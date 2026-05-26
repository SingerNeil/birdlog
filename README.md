# BirdLog

BirdLog 是一个单人使用的鸟舍学徒记录、复盘、内容素材和产品灵感系统。它的目标不是管理公司，也不是替代专业病历系统，而是把每天在鸟舍里的碎片经历沉淀成可检索、可复盘、可导出的个人知识资产。

- 一线工作记录
- 异常观察案例
- 明星鸟/个体档案
- 游客与宠主问题库
- 内容素材
- 用户访谈
- 产品灵感
- 周复盘
- Obsidian/Markdown 可导出的知识资产

## 1.1 功能

- 看板：查看总记录、近 7 天记录、连续记录天数、待整理内容和机会信号。
- 记录：支持日常记录、异常观察、明星鸟档案、游客/宠主问题、内容素材、用户访谈、产品灵感。
- 草稿：表单输入会自动保存在当前浏览器，刷新后还能继续写。
- 模板：内置下班补记、异常观察、游客接待、养鸟人访谈、小红书草稿等模板。
- 资料库：支持关键词、类型、日期、标签、置顶筛选。
- 记录操作：详情、编辑、置顶、复制、删除、转内容素材、转产品灵感。
- 复盘：自动生成近 7/14/30 天复盘文本，可保存人工判断。
- 导出：支持 Markdown/Obsidian、CSV、JSON 备份、GPT 整理提示词。
- 导入：支持导入 BirdLog JSON 备份。
- 同步：保留 Supabase 云同步配置，配置只保存在当前浏览器。
- Mac 显示：左侧导航 rail、吸顶工作状态栏、宽屏多列资料布局。
- iPhone 显示：底部导航、单列任务流、44px 以上表单触控区、底部安全区适配。

## 本地运行

```bash
cd /Users/ming/codes/birdlog
npm run dev
```

打开终端里 `Open:` 后面的完整地址，例如 `http://127.0.0.1:5173/?v=latest`。

如果 5173 被占用，终端会自动换到 5174、5175 等端口，并提示 `Port 5173 is already occupied`。不要手动猜 `localhost:5173`，只以终端里打印的 `Open: ...` 地址为准。

也可以不用 npm，直接运行：

```bash
python3 dev-server.py
```

## 本地页面没反应时

如果页面能打开，但输入框、按钮没有反应，通常是浏览器拿到了旧缓存。按这个顺序处理：

1. 停掉当前终端里的服务：按 `Ctrl+C`。
2. 重新启动：

```bash
cd /Users/ming/codes/birdlog
npm run dev
```

3. 打开终端里打印的 `Open: ...` 地址。
4. 在浏览器里强制刷新一次：Mac 上按 `Command + Shift + R`。

1.0 已经关闭本地 Service Worker 缓存，后续不应该再出现旧脚本卡住交互的问题。

也可以运行诊断：

```bash
npm run doctor
```

它会扫描 5173 到 5192，告诉你当前哪个地址真的在返回 BirdLog。

## 使用建议

- 上班碎片时间：优先写“日常记录”“异常观察”“游客/宠主问题”。
- 下班复盘：打开“资料库”筛选当天记录，再去“复盘”生成总结。
- 内容积累：任何记录都可以点“转内容”，先生成内容素材，不急着发布。
- 产品探索：任何问题、访谈、异常都可以点“转灵感”，后面用访谈验证。
- 给 GPT 整理：在“导出”里复制 GPT 整理提示词，再发给 ChatGPT 深度整理。

## 同步与访问设置

BirdLog 1.1 是静态网页应用，不把个人配置写进 GitHub 仓库。打开应用后进入“设置”，可填写：

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

注意：1.1 的 Supabase 策略是个人工具用的轻量方案，使用 `owner_key` 和 `x-owner-key` 做数据隔离。不要把你的 Supabase 配置提交到 GitHub。正式给别人用之前，应升级为 Supabase Auth 或后端 API。

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
- 低负担：不强制公开等级、不做复杂审核，先服务你自己的持续记录。
- 资产化：每条记录都可以转成内容素材或产品灵感。
- 可退出：支持 Markdown、CSV、JSON 导出，避免被工具锁死。
