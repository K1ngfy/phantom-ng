# phantom-ng

Chrome 扩展，用于优化 Splunk SOAR (Phantom) 系统中 Artifacts 的详情展示。

## 技术栈

- Vite
- React 18
- TypeScript
- Tailwind CSS
- CRXJS Vite Plugin (Chrome 扩展打包)
- Zustand (状态管理)

## 功能

- 右侧抽屉面板展示 Artifact 详情
- 样式隔离 (Shadow DOM)
- 支持 NIDS 和 HIDS 两种类型的 Artifact
- 网络流向可视化 (NIDS)
- 事件详情展示 (HIDS)
- 一键复制关键信息

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 安装到 Chrome

1. 运行 `npm run build`
2. 打开 Chrome 扩展管理 (chrome://extensions/)
3. 开启开发者模式
4. 点击"加载已解压的扩展程序"
5. 选择项目目录下的 `dist` 文件夹
