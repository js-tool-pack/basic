# @tool-pack/basic

> 🛠 typescript javascript basic utils functions / 基础工具函数

该库从[@mxssfd/core](https://github.com/mengxinssfd/ts-utils/tree/981d9d/packages/core)库迁移而来

- [Document](https://js-tool-pack.github.io/basic/)

**工欲善其事必先利其器。**

开发中积累的一些常用基础工具函数，减少开发时的重复编码。

分为常用工具函数~~及一些 es5 以上功能的替代函数~~（不再做 polyfill 的工作，有新 api 直接使用就是，不行就添加 polyfill）。

可运行环境：

- nodejs
- 微信小程序
- 现代浏览器（未对 ie 做兼容，最低需要支持 es6；部分浏览器需要对 api 做 polyfill，如微信浏览器不支持 Promise.prototype.finally 等）
- electron
- ...

以上环境亲测可用
