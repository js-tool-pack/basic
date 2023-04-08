## [0.0.17](https://github.com/js-tool-pack/basic/compare/v0.0.16...v0.0.17) (2023-04-08)

### Features

- **array/forEachAround:** 第三个参数改为 object 选项，支持设置顺逆时针(reverse)、开始下标(startIndexes)，开始方向(startDirect) ([9c014c2](https://github.com/js-tool-pack/basic/commit/9c014c28cf4f0273c0af22e4065bdec0aab7b76f))
- **array:** forEachAround 环绕式遍历数组 ([b236da9](https://github.com/js-tool-pack/basic/commit/b236da9c65de8ded530bd13b2c8deaabf4c8af8a))

## [0.0.16](https://github.com/js-tool-pack/basic/compare/v0.0.15...v0.0.16) (2023-04-07)

### Features

- **time:** getTimePeriodConst 获取时间段常数 ([128cb94](https://github.com/js-tool-pack/basic/commit/128cb9455644776e14e4d8e0daeb1619e25d1a90))
- **time:** howLongAgo ([cc3bd5b](https://github.com/js-tool-pack/basic/commit/cc3bd5ba365a67e91982b3ffeac75608df8c19b2))

## [0.0.15](https://github.com/js-tool-pack/basic/compare/v0.0.14...v0.0.15) (2023-03-28)

### Features

- **string:** getClassNames ([f7a0d31](https://github.com/js-tool-pack/basic/commit/f7a0d31c08f9c7ac9935fb61d2e52b855e68f64d))
- **string:** getClassNames 对象类型参数不再限制值的类型 ([7738d26](https://github.com/js-tool-pack/basic/commit/7738d26e77f157d7d6523b63a900a82615ec1bbd))
- **string:** hideString 添加 replacementLen 选项，支持替换字符不等于实际字符数量 ([f4ab9ab](https://github.com/js-tool-pack/basic/commit/f4ab9abb271908fa752178ef3c1cf59950147c2a))

## [0.0.14](https://github.com/js-tool-pack/basic/compare/v0.0.13...v0.0.14) (2023-03-12)

### Features

- **object:** replaceValues ([55bdc84](https://github.com/js-tool-pack/basic/commit/55bdc84603435abd14e9e7a175c57eb83130dd10))

## [0.0.13](https://github.com/js-tool-pack/basic/compare/v0.0.12...v0.0.13) (2023-03-10)

## [0.0.12](https://github.com/js-tool-pack/basic/compare/v0.0.11...v0.0.12) (2023-02-17)

### Features

- **string:** hideString ([dd80fc3](https://github.com/js-tool-pack/basic/commit/dd80fc3a4c4ae302874ab3f1396f0d9393fb9224))

## [0.0.11](https://github.com/js-tool-pack/basic/compare/v0.0.10...v0.0.11) (2023-02-13)

### Bug Fixes

- **object:** 修复 pickByKeys/pickRename 不能获取祖先对象属性的 bug ([1d52326](https://github.com/js-tool-pack/basic/commit/1d523262178d008560d5a973f209a9dfadc80fc7))

### Features

- **object:** shadowObj ([a604d62](https://github.com/js-tool-pack/basic/commit/a604d620f427f322f2ac69b6d6a3f8ff92db6ba7))

### BREAKING CHANGES

- **object:** pickRename/pickByKeys/pick 改为可获取祖先对象属性

## [0.0.10](https://github.com/js-tool-pack/basic/compare/v0.0.9...v0.0.10) (2023-01-30)

### Bug Fixes

- **generator:** 修复 createTimeCountUpGen 二次 pause 的 bug ([ed5d543](https://github.com/js-tool-pack/basic/commit/ed5d5434d084085f6498677171a0154a2e40e14e))
- **generator:** 修复 createTimeCountUpGen 二次 play bug ([b96a3bd](https://github.com/js-tool-pack/basic/commit/b96a3bdaa48cc22b2c49f9a6b7ed82e3976b139b))

### Code Refactoring

- **generator:** randomItemsGen 从 random 移动到 generator，并重命名为 randomItemGen ([f6df3f8](https://github.com/js-tool-pack/basic/commit/f6df3f8b0d223d172323d5577c07d04200f6b09a))

### Features

- **generator:** createTimeCountDownGen--createTimeCountDown 的 Generator 版本 ([e24dc90](https://github.com/js-tool-pack/basic/commit/e24dc9063aa27cdfa0f253a08e41fb1b8cbf2e6d))
- **generator:** createTimeCountDownGen--createTimeCountDown 的 Generator 版本 ([a3ff879](https://github.com/js-tool-pack/basic/commit/a3ff879036d9e389e013283d3c667ec8319da0df))
- **generator:** createTimeCountUpGen--createTimeCountUp 的 Generator 版本 ([ca8a90a](https://github.com/js-tool-pack/basic/commit/ca8a90a14ce3a1569c3b4419997b8bd277371a72))
- **numbers:** chineseToNumber 中文转为阿拉伯数字 ([de895ab](https://github.com/js-tool-pack/basic/commit/de895ab6fefb9e7bbb0038c018b7114aad06dfbe))
- **numbers:** numberToChinese 阿拉伯数字转为中文数字 ([fcca99e](https://github.com/js-tool-pack/basic/commit/fcca99e396b6c0b2b84d3a08e85711c742a87131))

### BREAKING CHANGES

- **generator:** randomItemsGen 重命名为 randomItemGen

## [0.0.9](https://github.com/js-tool-pack/basic/compare/v0.0.8...v0.0.9) (2022-12-26)

## [0.0.8](https://github.com/js-tool-pack/basic/compare/v0.0.7...v0.0.8) (2022-12-24)

### Features

- **time:** createTimeCountUp 和 createTimeCountDown 支持暂停和继续 ([98286dc](https://github.com/js-tool-pack/basic/commit/98286dcb9ac8227fafada38071fd92da34c6bafe))

## [0.0.7](https://github.com/js-tool-pack/basic/compare/v0.0.6...v0.0.7) (2022-12-24)

### Bug Fixes

- **bezier:** useCubicBezier3 ([fa57740](https://github.com/js-tool-pack/basic/commit/fa57740c756104616ab57180ed7ffef17bdfde89))
- **coordinate:** 修复 getAngle 除 top 外另外 3 个方向角度不准确的问题 ([c3b10f1](https://github.com/js-tool-pack/basic/commit/c3b10f133956dc47a15b3a5ba1bc93329899c58f))

### Code Refactoring

- **bezier:** bezier3withTimingFN 改为 cubicBezier3 ([3c0a0e3](https://github.com/js-tool-pack/basic/commit/3c0a0e36678f4b539c8fa3b66ac8213b2f23aa4f))

### BREAKING CHANGES

- **bezier:** bezier3withTimingFN 改为 cubicBezier3

## [0.0.6](https://github.com/js-tool-pack/basic/compare/v0.0.5...v0.0.6) (2022-12-20)

### Code Refactoring

- **bezier.ts:** twoBezier 重命名为 pointBezier2 ([1a12bdb](https://github.com/js-tool-pack/basic/commit/1a12bdb39114bc6863c955c479c84539541051ea))

### Features

- **array:** createArray fill 回调传入 end 参数 ([e3bc4ae](https://github.com/js-tool-pack/basic/commit/e3bc4ae518a5813355972d4bb8c8477fb9a076f2))
- **array:** 添加获取杨辉三角 getYangHuiTriangleOne、getYangHuiTriangle ([9eb8ddb](https://github.com/js-tool-pack/basic/commit/9eb8ddbda29415c24b50938aa4826adf68d5976e))
- **bezier.ts:** 新增 bezier2 ([bc2ff09](https://github.com/js-tool-pack/basic/commit/bc2ff09d3fb9e5336430a63ae8a3b55f127817b2))
- **bezier/base:** 使用 strip 去除长小数 ([90e4b54](https://github.com/js-tool-pack/basic/commit/90e4b54cc13d0015c9633c00bb513345efea940e))
- **bezier/point:** pointBezierN n 阶贝塞尔曲线 ([43ed44f](https://github.com/js-tool-pack/basic/commit/43ed44f9868af1bfc28702d6b1c353b9fcdf7521))
- **bezier:** bezier3 ([8508a69](https://github.com/js-tool-pack/basic/commit/8508a69546b2ff40036889907e27506b3e7f4869))
- **bezier:** bezier3withTimingFN ([7b67c10](https://github.com/js-tool-pack/basic/commit/7b67c10d00f533994a841441624f4cb6f8500eb0))
- **bezier:** pointBezier3 ([56b4c49](https://github.com/js-tool-pack/basic/commit/56b4c49bcf7a4143d2594c1da47d86f775e192e9))

### BREAKING CHANGES

- **bezier.ts:** twoBezier 重命名为 pointBezier2，并且第二个参数和第三个参数位置互换

## [0.0.5](https://github.com/js-tool-pack/basic/compare/v0.0.4...v0.0.5) (2022-12-18)

### Features

- **array:** chunk 改为参数改为范型，返回值支持推导 ([99e38f5](https://github.com/js-tool-pack/basic/commit/99e38f541cd77281bf8dd44d1980cdb7a71bae9e))

## [0.0.4](https://github.com/js-tool-pack/basic/compare/v0.0.3...v0.0.4) (2022-12-18)

### Features

- **array:** chunk 改为支持 ArrayLike ([fc8e5bb](https://github.com/js-tool-pack/basic/commit/fc8e5bb28922626aee6d69e33cfeef1f18081cde))

## [0.0.3](https://github.com/js-tool-pack/basic/compare/v0.0.2...v0.0.3) (2022-12-14)

### Features

- **coordinate:** getAngle ([620e9bc](https://github.com/js-tool-pack/basic/commit/620e9bc6b4e62789a3fc8a0d8afa58b250991fe0))

### BREAKING CHANGES

- **coordinate:** 不再导出 Direct

## [0.0.2](https://github.com/js-tool-pack/basic/compare/v0.0.1...v0.0.2) (2022-12-13)

### Code Refactoring

- **time:** `formatDate` ([a14c5c2](https://github.com/js-tool-pack/basic/commit/a14c5c220218a67cc8c8f1f02bfbcd9f37c375e6))

### Tests

- **time:** `formatDate` ([e1d8539](https://github.com/js-tool-pack/basic/commit/e1d85392538e1f97837d76328713125afdc08a0b))

### BREAKING CHANGES

- **time:** 1.seasonText 改为 seasonNames
  2.weekText 改为 weekNames 3.季节月份范围不再默认为 1-3，4-6...
- **time:** 1.seasonText 改为 seasonNames
  2.weekText 改为 weekNames 3.季节月份范围不再默认为 1-3，4-6...

## [0.0.1](https://github.com/js-tool-pack/basic/compare/v0.0.1-beta.0...v0.0.1) (2022-12-13)

### Bug Fixes

- **time:** 修复`inSameWeek`边界问题 ([67106da](https://github.com/js-tool-pack/basic/commit/67106daf0b31da746ea1ca0bc78940ba54650a82))

## 0.0.1-beta.0 (2022-12-12)

### Features

- **array:** sum avg ([b036348](https://github.com/js-tool-pack/basic/commit/b036348f6de30602310fc932f1c24250aee54850))
- 在（[@mxssfd/core](https://github.com/mengxinssfd/ts-utils/tree/981d9d/packages/core)）基础上删除部分 polyfill 性质的工具函数，再细化分类，并放弃兼容 es5
