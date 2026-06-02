# Debug Session: phantom-extension-not-loading

## 症状描述
- 加载插件后，打开 Phantom 页面，没有任何插件运行的反应
- Artifact 页面中没有任何 UI 被修改
- 预期：应该能看到右侧抽屉面板或至少有控制台日志

## 假设（Hypotheses）

### H1: Content Script 未被注入
- **观察点**: Chrome 扩展管理页面是否显示 Content Script 已注入
- **验证方法**: 检查 manifest.json 的 matches 配置和页面 URL 匹配情况
- **预期日志**: `[INIT] Content script loaded`

### H2: 初始化失败（Shadow DOM 或 React 挂载）
- **观察点**: Content Script 执行时的错误信息
- **验证方法**: 检查 Shadow DOM 创建和 React 挂载过程
- **预期日志**: `[INIT] Shadow DOM created`, `[INIT] React mounted`

### H3: 事件监听器未正确绑定
- **观察点**: 点击表格行时是否有事件触发
- **验证方法**: 检查事件监听器注册和选择器匹配
- **预期日志**: `[EVENT] Click detected`, `[EVENT] Artifact ID extracted: <id>`

### H4: 构建产物路径不正确
- **观察点**: dist 目录中的文件结构
- **验证方法**: 检查 CRXJS 打包输出
- **预期日志**: `[INIT] Script path: <path>`

### H5: container_id 提取失败
- **观察点**: 数据加载时的错误
- **验证方法**: 检查 URL 解析和 container_id 提取逻辑
- **预期日志**: `[API] Container ID: <id>`, `[API] Fetching artifacts...`

## 已添加的插桩日志

在 `src/content/index.tsx` 中添加了以下调试日志：
- `[INIT] Content script loaded` - Content Script 加载
- `[INIT] Current URL: <url>` - 当前页面 URL
- `[INIT] Document ready state: <state>` - 文档就绪状态
- `[INIT] Container created and appended to body` - 容器创建
- `[INIT] Shadow DOM created` - Shadow DOM 创建
- `[INIT] Styles injected to Shadow DOM` - 样式注入
- `[INIT] React root created` - React 根创建
- `[INIT] App component rendering` - 组件渲染
- `[INIT] React app mounted` - React 应用挂载
- `[INIT] Event listeners setup complete` - 事件监听器设置
- `[INIT] Initial artifact fetch triggered` - 初始数据获取触发

## 操作步骤（Cheatsheet）

### 1. 重新加载扩展
```bash
# 重新构建
npm run build

# 在 Chrome 中：
# 1. 打开 chrome://extensions/
# 2. 找到 phantom-ng 扩展
# 3. 点击"重新加载"按钮
```

### 2. 打开 Phantom 页面并检查控制台
```bash
# 1. 打开 Phantom 页面
# 2. 按 F12 打开开发者工具
# 3. 切换到 Console 标签
# 4. 查找以 [phantom-ng] 开头的日志
```

### 3. 检查扩展注入状态
```bash
# 在 Chrome 扩展管理页面：
# 1. 点击 phantom-ng 扩展的"详细信息"
# 2. 查看"检查视图"中的 Content Script 是否显示为"已注入"
```

### 4. 检查构建产物
```bash
# 确认 dist 目录结构正确
ls -la dist/
ls -la dist/assets/

# 确认 manifest.json 中的路径正确
cat dist/manifest.json
```

## 状态
- [OPEN] 等待用户反馈控制台日志

## 操作历史
- 2026-06-02: 添加调试日志到 Content Script
- 2026-06-02: 重新构建项目