# Virtual Avatar Creator

基于 HeyGen API 开发的虚拟人生成应用，让用户轻松创建和管理个性化的虚拟形象，并生成高质量的视频内容。

## 功能特性

### 1. Avatar 管理
- 展示所有已创建的虚拟形象列表
- 支持预览虚拟形象
- 显示虚拟形象名称和预览图
- 一键跳转到视频生成页面

### 2. 视频生成
- 支持选择已创建的 Avatar 生成视频
- 支持上传自定义音频（mp3、wav，最大 15MB）
- 支持自定义视频标题
- 支持预览和下载生成的视频
- 提供视频生成状态跟踪

### 3. 视频管理
- 展示所有生成的视频列表
- 显示视频标题、ID和时长
- 支持预览视频缩略图
- 实时显示视频生成状态
- 支持查看视频详情和下载

## 技术架构

- **前端框架**: Next.js 14 (App Router)
- **样式方案**: Tailwind CSS
- **状态管理**: React Context + Hooks
- **API 集成**: HeyGen API
- **HTTP 客户端**: Axios

## 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- HeyGen API 密钥

## 环境变量配置

项目需要以下环境变量：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.heygen.com/v2
NEXT_PUBLIC_HEYGEN_API_KEY=your_api_key_here
```

## HeyGen API 限制

- 音频文件大小限制：最大 15MB
- 支持的音频格式：mp3、wav
- API 调用频率限制：详见 HeyGen 官方文档

## 开发说明

1. 克隆项目并安装依赖：
```bash
git clone [repository_url]
cd virtual-avatar-creator
npm install
```

2. 配置环境变量：
- 复制 `.env.example` 到 `.env.local`
- 填入你的 HeyGen API 密钥

3. 启动开发服务器：
```bash
npm run dev
```

## HeyGen API 文档
https://docs.heygen.com/docs

## 待实现功能
- Avatar 创建功能
- 视频模板选择
- 背景设置
- 字幕添加
- 更多视频参数配置