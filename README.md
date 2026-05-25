# BirdLog

BirdLog 是一个单人使用的鸟舍学徒记录与内容孵化系统。它的目标不是管理公司，也不是第一版就商业化，而是把每天在鸟舍里的碎片经历沉淀成：

- 一线工作记录
- 异常观察案例
- 明星鸟/个体档案
- 游客与宠主问题库
- 内容素材
- 用户访谈
- 产品灵感
- 周复盘
- Obsidian/Markdown 可导出的知识资产

## 本地运行

```bash
npm run dev
```

打开 `http://localhost:5173`。

也可以不用 npm，直接运行：

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

## 本地页面没反应时

如果页面能打开，但输入框、按钮没有反应，通常是浏览器拿到了旧缓存。按这个顺序处理：

1. 停掉当前终端里的服务：按 `Ctrl+C`。
2. 重新启动：

```bash
cd /Users/ming/codes/birdlog
npm run dev
```

3. 打开 `http://localhost:5173/?v=latest`。
4. 在浏览器里强制刷新一次：Mac 上按 `Command + Shift + R`。

v0.1.2 已经关闭本地 Service Worker 缓存，后续不应该再出现旧脚本卡住交互的问题。

## 同步与访问设置

BirdLog v0.1 是静态 PWA，不把个人配置写进 GitHub 仓库。打开应用后进入“设置”，可填写：

- 本地访问码：只保存在当前浏览器，用来防止随手打开就看到数据。
- Supabase URL：你的 Supabase Project URL。
- Supabase anon key：Supabase 项目的 anon key。
- Owner key：你自己生成的一段随机字符串，Mac 和 iPhone 填同一段。

如果不配置 Supabase，BirdLog 会使用浏览器 IndexedDB 本地缓存。适合先试用，但不同设备不会自动互通。

## Supabase 云同步

1. 新建 Supabase 项目。
2. 打开 SQL Editor。
3. 执行 `supabase/schema.sql`。
4. 打开 BirdLog 的“设置”，在应用内填入 Supabase URL、anon key 和 Owner key。

注意：v0.1 的 Supabase 策略是个人 MVP 用的轻量方案，不是强安全方案。不要把你的 Supabase 配置提交到 GitHub。正式给别人用之前，应升级为 Supabase Auth 或后端 API。

## 部署到 Vercel

1. 把仓库推到 GitHub。
2. 在 Vercel 导入该仓库。
3. Framework 选择 Other。
4. Build Command 留空或使用 `echo static`。
5. Output Directory 使用项目根目录。
6. 部署后在应用设置里填写 Supabase 配置。

## 设计原则

- 手机优先：上班碎片时间能快速记录。
- Mac 复盘：下班后整理、搜索、导出、写草稿。
- 低负担：第一版不强制公开等级、不做复杂审核。
- 资产化：每条记录都可以转成内容素材或产品灵感。
- 可退出：支持 Markdown、CSV、JSON 导出，避免被工具锁死。
