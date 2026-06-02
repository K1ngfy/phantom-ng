# Debug Session: phantom-extension-not-loading

## 症状描述
- 加载插件后，打开 Phantom 页面，没有任何插件运行的反应
- Artifact 页面中没有任何 UI 被修改
- 预期：应该能看到右侧抽屉面板或至少有控制台日志

## 假设（Hypotheses）

### H1: Content Script 未被注入
- **状态**: ❌ 已排除
- **证据**: 用户反馈看到了完整的初始化日志

### H2: 初始化失败（Shadow DOM 或 React 挂载）
- **状态**: ❌ 已排除
- **证据**: 日志显示所有初始化步骤都成功完成

### H3: 事件监听器未正确绑定
- **状态**: ⏳ 待验证
- **验证方法**: 需要用户点击表格行测试

### H4: 构建产物路径不正确
- **状态**: ❌ 已排除
- **证据**: 扩展成功加载并执行

### H5: container_id 提取失败 ✅ 已确认
- **状态**: ✅ 已确认并修复
- **证据**: 日志显示 `[phantom-ng] No container ID found`
- **根本原因**: URL 模式不匹配
  - 代码期望: `container/(\d+)`
  - 实际 URL: `mission/7203/analyst/artifacts/`
- **修复方案**: 添加 `mission/(\d+)` 模式匹配

## 修复内容

### 修改文件: `src/content/index.tsx`

```typescript
const extractContainerId = (): string | null => {
  console.log('[phantom-ng] API: Extracting container ID from URL:', window.location.href);
  
  // 原有模式
  const urlMatch = window.location.href.match(/container\/(\d+)/);
  if (urlMatch) {
    console.log('[phantom-ng] API: Found container ID from container pattern:', urlMatch[1]);
    return urlMatch[1];
  }

  // 新增模式：适配 mission/xxx URL
  const missionMatch = window.location.href.match(/mission\/(\d+)/);
  if (missionMatch) {
    console.log('[phantom-ng] API: Found container ID from mission pattern:', missionMatch[1]);
    return missionMatch[1];
  }

  const containerElement = document.querySelector('[data-container-id], .container-id, #container-id');
  if (containerElement) {
    const id = containerElement.getAttribute('data-container-id') || containerElement.textContent?.trim() || null;
    console.log('[phantom-ng] API: Found container ID from DOM element:', id);
    return id;
  }

  console.log('[phantom-ng] API: No container ID found in URL or DOM');
  return null;
};
```

## 用户反馈的日志

```
[phantom-ng] INIT: Content script loaded
[phantom-ng] INIT: Current URL: https://ua-ph.services.silu.net/mission/7203/analyst/artifacts/
[phantom-ng] INIT: Document ready state: interactive
[phantom-ng] INIT: Container created and appended to body
[phantom-ng] INIT: Shadow DOM created
[phantom-ng] INIT: Styles injected to Shadow DOM
[phantom-ng] INIT: React root created
[phantom-ng] INIT: React app mounted
[phantom-ng] INIT: Event listeners setup complete
[phantom-ng] No container ID found
[phantom-ng] INIT: Initial artifact fetch triggered
[phantom-ng] INIT: App component rendering
```

## 操作步骤（Cheatsheet）

### 1. 重新加载扩展
```bash
# 在 Chrome 中：
# 1. 打开 chrome://extensions/
# 2. 找到 phantom-ng 扩展
# 3. 点击"重新加载"按钮 🔄
```

### 2. 刷新 Phantom 页面
```bash
# 在 Phantom 页面：
# 1. 按 F5 或 Cmd+R 刷新页面
# 2. 打开控制台查看新的日志
```

### 3. 验证修复
```bash
# 预期看到的新日志：
[phantom-ng] API: Extracting container ID from URL: https://ua-ph.services.silu.net/mission/7203/analyst/artifacts/
[phantom-ng] API: Found container ID from mission pattern: 7203
[phantom-ng] Loaded X artifacts
```

### 4. 测试点击功能
```bash
# 点击表格中的任意一行
# 预期：右侧滑出抽屉面板显示 Artifact 详情
```

## 状态
- [OPEN] 等待用户验证修复结果

## 操作历史
- 2026-06-02: 添加调试日志到 Content Script
- 2026-06-02: 重新构建项目
- 2026-06-02: 收到用户反馈，确认插件已加载
- 2026-06-02: 识别并修复 container_id 提取问题
- 2026-06-02: 重新构建修复版本