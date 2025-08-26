# 相片水印 1.0

该软件遵循 MIT 协议，任何人均可免费使用,软件主要应用于相片批量添加水印，无任何商业用途纯个人开发。

## 项目启动

### 安装

项目使用 pnpm 管理包也可以使用 npm

```bash
$ pnpm install
```

### 开发环境

```bash
$ pnpm dev
```

### 打包生产环境

这里需要注意一点，打包 MacOS 版本的时候只能在 MacOS 系统中打包,否则将无法使用.

```bash
# Windows 环境打包
$ pnpm build:win

# macOS 打包
$ pnpm build:mac

# Linux 环境打包
$ pnpm build:linux
```
