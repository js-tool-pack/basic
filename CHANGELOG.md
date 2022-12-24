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
