# [0.9.0](https://github.com/js-tool-pack/basic/compare/v0.8.3...v0.9.0) (2024-05-30)

### Bug Fixes

- 修复 exports 顺序在某些打包工具中default 不在最后会报错的问题 ([a3f9f97](https://github.com/js-tool-pack/basic/commit/a3f9f972b327d18de85591f0010d5dd5e17a216d))

## [0.8.3](https://github.com/js-tool-pack/basic/compare/v0.8.2...v0.8.3) (2024-05-15)

### Features

- **base64:** 新增 parseBase64、arrayBufferToBase64、base64ToArrayBuffer ([8eafa04](https://github.com/js-tool-pack/basic/commit/8eafa04aa3c8bd7ce3877e9e0399b41101f08595))

## [0.8.2](https://github.com/js-tool-pack/basic/compare/v0.8.1...v0.8.2) (2024-05-15)

### Bug Fixes

- **common:** 修复 throttle 对有参数的函数会类型报错的问题 ([7687330](https://github.com/js-tool-pack/basic/commit/768733046acc8a32a105ebc9ed58b88b3913b3e7))

## [0.8.1](https://github.com/js-tool-pack/basic/compare/v0.8.0...v0.8.1) (2024-05-13)

### Features

- **array-buffer:** 为 stringToArrayBuffer 和 arrayBufferToString 添加可选择 Uint16Array 还是 Uint8Array 的功能 ([e764e4e](https://github.com/js-tool-pack/basic/commit/e764e4e5c2266f2081dc471a7bc20fee21cade65))

# [0.8.0](https://github.com/js-tool-pack/basic/compare/v0.7.7...v0.8.0) (2024-05-13)

### Bug Fixes

- **array-buffer:** 修复 stringToArrayBuffer 和 arrayBufferToString 中文乱码的问题 ([0f95bbc](https://github.com/js-tool-pack/basic/commit/0f95bbcafc762afeb666c9c882d2537acf8456e6))

## [0.7.7](https://github.com/js-tool-pack/basic/compare/v0.7.6...v0.7.7) (2024-05-13)

### Features

- **array-buffer:** 新增 arrayBufferToString 和 stringToArrayBuffer ([6bfc336](https://github.com/js-tool-pack/basic/commit/6bfc3362c96a3923b0136e4466cd1b9a066feaba))
- **array-buffer:** 新增 encodeObjectToArrayBuffer 和 decodeArrayBufferToObject ([0a0874e](https://github.com/js-tool-pack/basic/commit/0a0874e1f875d876180231053910eb1c70a8a3c0))
- **promise/nextTick:** 当传入参数时返回值改为中断闭包函数 ([d546707](https://github.com/js-tool-pack/basic/commit/d546707baf8a1773b8af7d7c432906fd8d44b015))

## [0.7.6](https://github.com/js-tool-pack/basic/compare/v0.7.5...v0.7.6) (2024-04-09)

### Performance Improvements

- **array/groupBy:** 提供更精准的返回值类型 ([2ba7382](https://github.com/js-tool-pack/basic/commit/2ba738226838fee0d9e611c42e14ce23217a1c4a))

## [0.7.5](https://github.com/js-tool-pack/basic/compare/v0.7.4...v0.7.5) (2024-04-09)

### Performance Improvements

- **array:** 优化 groupBy ([6a6ce83](https://github.com/js-tool-pack/basic/commit/6a6ce8376c2fa7f9dd5c1420b0f74bfc5d65220a))

## [0.7.4](https://github.com/js-tool-pack/basic/compare/v0.7.3...v0.7.4) (2024-04-09)

### Features

- **common/createEnum:** 添加类型体操 ([67863b5](https://github.com/js-tool-pack/basic/commit/67863b5ab70898b7dd1c2b6e6de385db2326a74d))
- **object/getReversedObj:** 添加类型体操 ([6c55b41](https://github.com/js-tool-pack/basic/commit/6c55b419002de6cd13017c2bcf4e89d4307b126c))

## [0.7.3](https://github.com/js-tool-pack/basic/compare/v0.7.2...v0.7.3) (2024-04-04)

### Features

- **number:** 新增 shortenNumber 缩短数字 ([04f3bcd](https://github.com/js-tool-pack/basic/commit/04f3bcd46ab4f1293b5c85335e46daddd9874697))

## [0.7.2](https://github.com/js-tool-pack/basic/compare/v0.7.1...v0.7.2) (2024-04-04)

### Features

- **time/dateAdd:** 第二个参数可为对象，增加复数类型数值 ([d6c9fad](https://github.com/js-tool-pack/basic/commit/d6c9fad6e92f7e3651b24d57f5f446e62d1acbd8))

## [0.7.1](https://github.com/js-tool-pack/basic/compare/v0.7.0...v0.7.1) (2024-03-26)

# [0.7.0](https://github.com/js-tool-pack/basic/compare/v0.6.0...v0.7.0) (2024-01-16)

### Features

- **time:** isSameDate 判断两个日期是否是同一天 ([c63d36e](https://github.com/js-tool-pack/basic/commit/c63d36e0343ac5b5c3d4683b35aaf4bef8e21481))

# [0.6.0](https://github.com/js-tool-pack/basic/compare/v0.5.2...v0.6.0) (2024-01-12)

### Features

- **time:** isNextMonth 判断日期是否是下个月 ([16f933e](https://github.com/js-tool-pack/basic/commit/16f933eeac224da4c5ea38f329ca8d85dd66eec9))

## [0.5.2](https://github.com/js-tool-pack/basic/compare/v0.5.1...v0.5.2) (2024-01-11)

### Bug Fixes

- **time:** 修复 parseFormattedDate 漏掉 date 会变成前一个月的问题 ([335eb6d](https://github.com/js-tool-pack/basic/commit/335eb6da1a54a9648e0f24d925502730d821e16a))

## [0.5.1](https://github.com/js-tool-pack/basic/compare/v0.5.0...v0.5.1) (2024-01-11)

### Features

- **time:** 为 getStartOfMonth 添加 offset 参数 ([6bdbca7](https://github.com/js-tool-pack/basic/commit/6bdbca71816b6d549cebadee2b9ec957e78d2fce))

# [0.5.0](https://github.com/js-tool-pack/basic/compare/v0.4.0...v0.5.0) (2024-01-11)

### Features

- **time:** getStartOfMonth ([e17bb6c](https://github.com/js-tool-pack/basic/commit/e17bb6cefd3d3f4769e9c191459d8c6ce173792e))

# [0.4.0](https://github.com/js-tool-pack/basic/compare/v0.3.1...v0.4.0) (2024-01-03)

### Bug Fixes

- **time:** 修复 WeekDays 类型问题 ([5ba15a4](https://github.com/js-tool-pack/basic/commit/5ba15a479f3ebd395e5b0161ac43c9df0c9a6d19))

### Features

- **time:** parseFormattedDate ([1f504d5](https://github.com/js-tool-pack/basic/commit/1f504d5df943a8bf96f81a5b1361e3469b2ca61d))

## [0.3.1](https://github.com/js-tool-pack/basic/compare/v0.3.0...v0.3.1) (2023-12-19)

### Bug Fixes

- **time:** 修复 getStartOfWeek 部分日期不准确的问题 ([0b643fd](https://github.com/js-tool-pack/basic/commit/0b643fd8b274f5bdcb59e347c1308112e5e37b2b))

# [0.3.0](https://github.com/js-tool-pack/basic/compare/v0.2.0...v0.3.0) (2023-12-19)

### Features

- **time:** getEndOfWeek 可选择星期的任意一天作为开始，不再局限于周一和周日 ([ea1862c](https://github.com/js-tool-pack/basic/commit/ea1862cb9f9ee9455f666ac78a876e4de7874574))
- **time:** getStartOfWeek 可选择星期的任意一天作为开始，不再局限于周一和周日 ([ee7d868](https://github.com/js-tool-pack/basic/commit/ee7d86866d17b29489e873ea9831997b84e73a06))
- **time:** 移除 getStartOfNextWeek ([265b7bb](https://github.com/js-tool-pack/basic/commit/265b7bb066ca710996770eb6d379da581a3fc703))

### BREAKING CHANGES

- **time:** 移除 weekBegin 选项
- **time:** 移除 getStartOfNextWeek，可通过 getStartOfWeek 添加偏移量代替该函数
- **time:** 移除 weekBegin 选项

# [0.2.0](https://github.com/js-tool-pack/basic/compare/v0.1.3...v0.2.0) (2023-12-17)

### Features

- **time:** getEndOfMonth 函数添加 monthOffset 参数，可获取前 n 个或后 n 个月的结束日期 ([1b3b97c](https://github.com/js-tool-pack/basic/commit/1b3b97c68a6cd82a69ce99989b58d0a2947ba777))
- **time:** 移除 getEndOfPrevMonth ([dc033f1](https://github.com/js-tool-pack/basic/commit/dc033f14fdfbc2361fbd8aff444c6d5a79159812))

### Performance Improvements

- **array:** 优化 chunk 函数 ([c64c544](https://github.com/js-tool-pack/basic/commit/c64c5443c639a45e8a54055d9b567172597cb663))

### BREAKING CHANGES

- **time:** 移除 getEndOfPrevMonth，可通过 getEndOfMonth 添加偏移量代替该函数

## [0.1.3](https://github.com/js-tool-pack/basic/compare/v0.1.2...v0.1.3) (2023-12-16)

### Features

- **time:** dateAdd ([084819c](https://github.com/js-tool-pack/basic/commit/084819cd62f2af224bf0004fe72ee11c608871ea))
- **time:** getEndOfPrevMonth ([8c4b6a1](https://github.com/js-tool-pack/basic/commit/8c4b6a1827aba275a2207b6a9f997155ec63e2f7))
- **time:** getEndOfWeek ([47e9eb9](https://github.com/js-tool-pack/basic/commit/47e9eb92c754974d47f21348ffa4fcd16c056289))

## [0.1.2](https://github.com/js-tool-pack/basic/compare/v0.1.1...v0.1.2) (2023-08-25)

### Bug Fixes

- **common:** 修复 createTimeCountUp 后马上调用 play 时间不对的问题 ([bcbba11](https://github.com/js-tool-pack/basic/commit/bcbba1148b1284cef2c9c4c1b8d2e594ef2b6f97))

### Features

- **common:** emptyFn 空函数 ([82924f7](https://github.com/js-tool-pack/basic/commit/82924f72d9c7f0ab333ff6e87829f8adac0b4b2b))

## [0.1.1](https://github.com/js-tool-pack/basic/compare/v0.1.1-beta.1...v0.1.1) (2023-07-08)

## [0.1.1-beta.1](https://github.com/js-tool-pack/basic/compare/v0.1.0...v0.1.1-beta.1) (2023-07-08)

### Code Refactoring

- **string/cases:** 使用 splitByCases 代替 CaseSplitRegExp ([0082080](https://github.com/js-tool-pack/basic/commit/0082080971bd29516b7297e9d6266098f8bf0468)), closes [#12](https://github.com/js-tool-pack/basic/issues/12)

### Features

- **string:** 新增 splitByCases，把各种变量风格的字符串分割成字符串数组;用于代替 CaseSplitRegExp ([0b6ff2b](https://github.com/js-tool-pack/basic/commit/0b6ff2bb3dce92dfc3f38b607d32c4cdf6a38f56))

### BREAKING CHANGES

- **string/cases:** 移除 CaseSplitRegExp

# [0.1.0](https://github.com/js-tool-pack/basic/compare/v0.0.27...v0.1.0) (2023-06-30)

### Bug Fixes

- **array:** inRange 类型不正确 ([ac907a4](https://github.com/js-tool-pack/basic/commit/ac907a4bfb879d5235677dbd5259022b93c5ee66))

### Features

- **data-type:** 新增 isASCIIPunctuationSymbol，判断字符串内是否全部都是 ascii 标点符号 ([00ab5ad](https://github.com/js-tool-pack/basic/commit/00ab5ad80320e6d39e45d57c54898eccc90b33b8))
- **string:** 新增 camelCase，其他变量命名风格转小驼峰 ([95cb370](https://github.com/js-tool-pack/basic/commit/95cb37097320685cf324f8d86eab66a952a6cb01))
- **string:** 新增 CaseSplitRegExp 正则，用于切割各种命名法的字符串 ([6eb5c43](https://github.com/js-tool-pack/basic/commit/6eb5c43169be013c98f8a5f6aa8faeef5fe8ee67))
- **string:** 新增 kebabCase，其他变量命名风格转小写加中划线 ([0c0a1f1](https://github.com/js-tool-pack/basic/commit/0c0a1f1efdb27cdab413a8f42c3c75152869164f))
- **string:** 新增 pascalCase，其他变量命名风格转大驼峰 ([f9f77ce](https://github.com/js-tool-pack/basic/commit/f9f77ce0fd4c82329b2a6771bfbea450310ae038))
- **string:** 新增 snakeCase，其他变量命名风格转蛇形 ([9d59b3d](https://github.com/js-tool-pack/basic/commit/9d59b3d2c67239e6413bc7fd03875bd52c8ac5d2))
- **string:** 移除 fromCamel ([d272e84](https://github.com/js-tool-pack/basic/commit/d272e84e0f7d6a0385040dd6a513be3667184ddf))
- **string:** 移除 toCamel ([beddc8a](https://github.com/js-tool-pack/basic/commit/beddc8ac5e36d5fdba6ffd9358f99b0f6b438a3e))

### BREAKING CHANGES

- **string:** 移除 fromCamel，可以使用 kebabCase、pascalCase、snakeCase 代替
- **string:** 移除 toCamel，可以使用 camelCase 或 pascalCase 作为代替

## [0.0.27](https://github.com/js-tool-pack/basic/compare/v0.0.26...v0.0.27) (2023-06-20)

### Features

- **promise:** nextTick ([a5202b0](https://github.com/js-tool-pack/basic/commit/a5202b0d0e0e15cee725832df2be12368650daef))

## [0.0.26](https://github.com/js-tool-pack/basic/compare/v0.0.25...v0.0.26) (2023-06-20)

### Features

- **data-type:** isArrayLike 支持范型 ([a3cf26f](https://github.com/js-tool-pack/basic/commit/a3cf26f39d027e72a05739485cdfe124da83c82e))
- **data-type:** isIterable 支持范型 ([3ddfc2c](https://github.com/js-tool-pack/basic/commit/3ddfc2c179669638ebf80c81e7d5dc8c0535cdc2))
- **data-type:** isObjectLike 支持范型 ([e5a6e33](https://github.com/js-tool-pack/basic/commit/e5a6e33fb29bb83ad2008e72f042b88f934752f8))
- **data-type:** isObject 支持范型 ([c3bb8a5](https://github.com/js-tool-pack/basic/commit/c3bb8a5e43c43c84e6c278a08a6d70b7b8424961))

## [0.0.25](https://github.com/js-tool-pack/basic/compare/v0.0.24...v0.0.25) (2023-06-18)

### Features

- **array:** joinArray 添加 callbackFn 回调，可对数组遍历进行操作 ([f9f1b17](https://github.com/js-tool-pack/basic/commit/f9f1b172caa693d864d09c9bd5b3a80039099cc8))

## [0.0.24](https://github.com/js-tool-pack/basic/compare/v0.0.23...v0.0.24) (2023-06-18)

### Features

- **array:** joinArray separator 参数支持回调函数类型 ([d404e72](https://github.com/js-tool-pack/basic/commit/d404e72b994c431c8f472adb4a8d96635a94aa8c))
- **data-type:** isArray 支持范型 ([6af6267](https://github.com/js-tool-pack/basic/commit/6af6267913734ab27a555e3e221d4d6390c781f1))
- **data-type:** isFunction 支持范型 ([d1b9d4f](https://github.com/js-tool-pack/basic/commit/d1b9d4f47295b16d0c780b2ef584135066415095))
- **data-type:** isNullish ([0443871](https://github.com/js-tool-pack/basic/commit/0443871be1402874dbdf2ecbe71d8508050bd09d))
- **data-type:** isUnavailable ([5980edd](https://github.com/js-tool-pack/basic/commit/5980edd44b01da97e4d1347f6679e8c30daf11d9))

## [0.0.23](https://github.com/js-tool-pack/basic/compare/v0.0.22...v0.0.23) (2023-06-18)

### Features

- **array:** joinArray ([d39d888](https://github.com/js-tool-pack/basic/commit/d39d8885a36474beb12d7ca387839b8f1e4686a7))

## [0.0.22](https://github.com/js-tool-pack/basic/compare/v0.0.21...v0.0.22) (2023-06-17)

### Features

- **string:** getClassNames 当有重复的 className 时，后面的条件需要覆盖前面的条件 ([cca042d](https://github.com/js-tool-pack/basic/commit/cca042d0c6680d17e904e063ac37888dc90aed1a))

## [0.0.21](https://github.com/js-tool-pack/basic/compare/v0.0.20...v0.0.21) (2023-06-17)

### Features

- **string:** getClassNames 类型支持 null 和 undefined ([010f395](https://github.com/js-tool-pack/basic/commit/010f3959550fae102700029b26a5509fcae990cb))

## [0.0.20](https://github.com/js-tool-pack/basic/compare/v0.0.19...v0.0.20) (2023-05-30)

### Bug Fixes

- **time:** getEndOfMonth 在日期为 2023 年 5 月 31 号时会获取错误的日期 ([f503b93](https://github.com/js-tool-pack/basic/commit/f503b9340b20bb2eabbed27dcf37e55e67e7ec0f))

### Features

- **common:** loadingElse ([34b2ed4](https://github.com/js-tool-pack/basic/commit/34b2ed427c322c7d750f03391b1bce4fb23bead8))

## [0.0.19](https://github.com/js-tool-pack/basic/compare/v0.0.18...v0.0.19) (2023-04-27)

### Bug Fixes

- **time:** 修复 msToDateStr 对小数秒数出错的 bug ([38f2710](https://github.com/js-tool-pack/basic/commit/38f27109094cef3b6b16983b31cbec0d41c8cde7))

### Features

- **time:** msToDateStr 重命名为 formatMilliseconds ([0f3e030](https://github.com/js-tool-pack/basic/commit/0f3e03067dea295464056ddb4c9d8e0704cd4763))

### BREAKING CHANGES

- **time:** 重命名 msToDateStr 为 formatMilliseconds

## [0.0.18](https://github.com/js-tool-pack/basic/compare/v0.0.17...v0.0.18) (2023-04-26)

### Bug Fixes

- **time/getTheLastDateOfAMonth:** 日期时间未归零 ([fecefde](https://github.com/js-tool-pack/basic/commit/fecefdef0cc2fcffba221febd287789de7a21995))

### Features

- **common:** formatBytes 格式化字节数 ([9575474](https://github.com/js-tool-pack/basic/commit/9575474267d1c8e2c4f6b1bb29ee4e665922968e))
- **time/howLongAgo:** 添加 now template ([53a82a0](https://github.com/js-tool-pack/basic/commit/53a82a01f0c56ce4ee566527aa044efb97104afb))
- **time/howLongAgo:** 第二个参数改为可选参数 ([c557d8e](https://github.com/js-tool-pack/basic/commit/c557d8ed40497f8760f4d03ea79fb2d69f8d38f4))
- **time:** getStartOfDate 获取某一天的开始 Date ([edc3729](https://github.com/js-tool-pack/basic/commit/edc37290afc3d2dea46dd57bee3fa0a5141eba23))
- **time:** getStartOfNextWeek 获取某日下个星期开始的 date ([871f258](https://github.com/js-tool-pack/basic/commit/871f258e65ad96bcec0f4b34727cff8b90c7eca8))
- **time:** getStartOfWeek 获取某日所在星期开始的 date ([ac01c68](https://github.com/js-tool-pack/basic/commit/ac01c6846f0226eab8359cc9858590545e7cb107))
- **time:** getTheLastDateOfAMonth 重命名为 getEndOfMonth ([cf57ef7](https://github.com/js-tool-pack/basic/commit/cf57ef78708a33be6623a7233a91f6c05e4cf2ee))

### BREAKING CHANGES

- **time:** getTheLastDateOfAMonth 不能再使用

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
