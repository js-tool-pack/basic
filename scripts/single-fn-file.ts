import type { ExportNamedDeclaration, Declaration } from '@babel/types';
import type { Identifier } from '@babel/types';
import generate from '@babel/generator';
import { parse } from '@babel/parser';
import { prompt } from 'enquirer';
import * as Path from 'path';
import chalk from 'chalk';
import * as FS from 'fs';

/**
 * 把一个大函数集合文件转成单函数文件
 */
async function run() {
  console.log('*'.repeat(10), '大函数集合文件转成单函数文件', '*'.repeat(10));
  try {
    const filepath = await selectFile(Path.resolve(__dirname, '..'));

    const functions = extractFunctionsFromFile(filepath);
    console.log(
      `\n提取了 ${chalk.green(functions.length)} 个函数:\n`,
      chalk.green(JSON.stringify(functions, null, 2)),
    );
  } catch (e) {
    console.error(e);
  }
}

/**
 * 大函数集合文件转成单函数文件
 */
function extractFunctionsFromFile(filepath: string): string[] {
  const fileContent = FS.readFileSync(filepath, 'utf-8');
  // 解析文件内容为 AST
  const ast = parse(fileContent, { plugins: ['typescript'], sourceType: 'module' });

  // 提取函数定义
  const nodes = ast.program.body.filter(
    (node) => node.type === 'ExportNamedDeclaration',
  ) as ExportNamedDeclaration[];

  const dirname = Path.dirname(filepath);

  function getFnName(declaration: Declaration): string {
    switch (declaration.type) {
      case 'FunctionDeclaration':
        return declaration.id!.name;
      case 'VariableDeclaration':
        return (declaration.declarations[0]!.id as Identifier).name;
      case 'ExportNamedDeclaration':
        return getFnName(declaration.declaration!);
      case 'TSDeclareFunction': // 函数重载
        return declaration.id!.name;
      case 'TSTypeAliasDeclaration': // 类型别名
        return declaration.id!.name;
      default:
        console.error(declaration);
        throw new Error(`未识别的类型：${declaration.type}`);
    }
  }

  // 创建文件流
  const indexStream = FS.createWriteStream(Path.resolve(dirname, `index.ts`), 'utf-8');
  nodes.forEach((node) => {
    // 生成单独的函数文件内容
    const functionFileContent = generate({
      ...node,
      // 去除代码后面的注释
      trailingComments: [],
    }).code;

    const isAlias = node.declaration?.type === 'TSTypeAliasDeclaration';

    // 获取函数名
    const filename = getFnName(node.declaration!);

    const filepath = Path.resolve(dirname, filename + '.ts');
    if (FS.existsSync(filepath)) {
      // 如果文件存在，则拼接进去
      FS.appendFileSync(filepath, functionFileContent + '\n', 'utf-8');
    } else {
      // 生成单独的函数文件
      FS.writeFileSync(Path.resolve(dirname, filename + '.ts'), functionFileContent + '\n', 'utf8');
    }

    // 写入流 index.ts导出
    if (!['TSDeclareFunction'].includes(node.declaration!.type))
      indexStream.write(`export${isAlias ? ' type' : ''} * from './${filename}';\n`);
  });
  // 关闭流
  indexStream.end();

  // 返回函数名列表
  return Array.from(new Set(nodes.map(getFnName)));
}

const ignoreList = [
  /^\./,
  /\.(md|json|js|tsbuildinfo|yaml|css)$/,
  'dist',
  'node_modules',
  '__tests__',
  'docs-html',
  'dist',
  'scripts',
  'temp',
  'LICENSE',
];

/**
 * 选择文件
 */
async function selectFile(rootPath: string): Promise<string> {
  const paths = FS.readdirSync(rootPath)
    .filter(
      (path) =>
        !ignoreList.some((ignore) =>
          typeof ignore === 'string' ? ignore === path : ignore.test(path),
        ),
    )
    .map((name) => {
      const path = Path.resolve(rootPath, name);
      const isFile = FS.statSync(path).isFile();
      return { isFile, name, path };
    })
    .sort((a, b) => Number(a.isFile) - Number(b.isFile));

  const { path } = await prompt<{ path: string }>([
    {
      choices: paths.map<{ name: string; hint: string }>(({ isFile, name, path }) => {
        return {
          hint: isFile ? 'file' : 'dir',
          message: name,
          name: path,
        };
      }),
      message: `选择文件`,
      type: 'select',
      name: 'path',
    },
  ]);

  if (!paths.find((p) => p.path === path)!.isFile) return await selectFile(path);

  const { confirm } = await prompt<{ confirm: boolean }>({
    message: `确定转换该文件(${path})？`,
    type: 'confirm',
    name: 'confirm',
  });

  if (!confirm) throw '取消选择文件....';

  return path;
}

run();
