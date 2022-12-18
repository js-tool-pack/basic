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
