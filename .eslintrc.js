module.exports = {
  /* 优先级低于parse的语法解析配置 */
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // typescript-eslint推荐规则
    'prettier',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    // 禁止使用 var
    'no-var': 'error',
    // 不使用结尾分号
    semi: 'off',
    eqeqeq: 'error',
    'no-case-declarations': 'off',
    // 优先使用 interface 而不是 type
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-this-alias': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**'],
      rules: {
        eqeqeq: 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: ['**/scripts/**.[jt]s', 'rollup.config.js'],
      rules: {
        eqeqeq: 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
