const DB_NAME = "birdlog-db";
const DB_VERSION = 1;
const ENTRY_STORE = "entries";
const SETTINGS_KEY = "birdlog.settings.v1";
const LOCK_KEY = "birdlog.lock.v1";

const schemas = [
  {
    kind: "quick",
    label: "快速记录",
    shortLabel: "记录",
    description: "碎片记录或下班统一记录，重点是先把原始经验留下来。",
    primaryField: "observation",
    fields: [
      {
        name: "workTypes",
        label: "工作类型",
        type: "multiselect",
        options: ["清洁", "饲养", "观察", "游客接待", "学习", "设备/环境", "其他"]
      },
      { name: "species", label: "鸟种/对象", type: "text", placeholder: "例：玄凤、和尚、蓝喉金刚、某只明星鸟" },
      { name: "observation", label: "观察记录", type: "textarea", required: true },
      { name: "learning", label: "今天学到的东西", type: "textarea" },
      { name: "raw", label: "原始语料", type: "textarea", placeholder: "可以直接用豆包输入法口述，先不整理。" }
    ]
  },
  {
    kind: "abnormal",
    label: "异常观察",
    shortLabel: "异常",
    description: "记录食欲、粪便、羽毛、精神、叫声、应激和处理方式，形成案例库。",
    primaryField: "symptom",
    fields: [
      { name: "species", label: "鸟种", type: "text" },
      { name: "individual", label: "个体名/编号", type: "text" },
      { name: "symptom", label: "主要异常", type: "textarea", required: true },
      { name: "appetite", label: "食欲", type: "select", options: ["未观察", "正常", "下降", "拒食", "异常增加"] },
      { name: "droppings", label: "粪便", type: "textarea" },
      { name: "feathers", label: "羽毛", type: "textarea" },
      { name: "energy", label: "精神状态", type: "select", options: ["未观察", "正常", "偏安静", "嗜睡", "焦躁", "虚弱"] },
      { name: "vocalization", label: "叫声", type: "textarea" },
      { name: "posture", label: "站姿/活动", type: "textarea" },
      { name: "social", label: "攻击性/亲人程度", type: "textarea" },
      { name: "stress", label: "应激表现", type: "textarea" },
      { name: "handling", label: "处理方式", type: "textarea" },
      { name: "followUp", label: "后续观察", type: "textarea" }
    ]
  },
  {
    kind: "bird",
    label: "明星鸟档案",
    shortLabel: "个体",
    description: "为叫得出名字的鸟建立轻量档案，长期积累识别特征和行为。",
    primaryField: "name",
    fields: [
      { name: "name", label: "名字", type: "text", required: true },
      { name: "species", label: "鸟种", type: "text" },
      { name: "traits", label: "识别特征", type: "textarea" },
      { name: "personality", label: "性格", type: "textarea" },
      { name: "behaviors", label: "常见行为", type: "textarea" },
      { name: "notes", label: "补充记录", type: "textarea" }
    ]
  },
  {
    kind: "question",
    label: "游客/宠主问题",
    shortLabel: "问题",
    description: "把别人反复问的问题当市场调研，沉淀内容选题和产品入口。",
    primaryField: "question",
    fields: [
      { name: "question", label: "问题原文", type: "textarea", required: true },
      { name: "asker", label: "提问者类型", type: "select", options: ["游客", "新手", "养鸟人", "小孩", "家长", "同事", "其他"] },
      {
        name: "themes",
        label: "涉及主题",
        type: "multiselect",
        options: ["价格", "寿命", "说话", "咬人", "饮食", "合法性", "饲养难度", "疾病", "互动", "寄养", "用品"]
      },
      { name: "answer", label: "当时怎么回答", type: "textarea" },
      { name: "contentPotential", label: "内容潜力", type: "rating" }
    ]
  },
  {
    kind: "content",
    label: "内容素材",
    shortLabel: "内容",
    description: "先积累小红书/抖音素材，不急着定账号定位。",
    primaryField: "topic",
    fields: [
      { name: "topic", label: "选题", type: "text", required: true },
      { name: "source", label: "来源", type: "textarea", placeholder: "来自哪条记录、哪个问题、哪次访谈" },
      {
        name: "contentType",
        label: "类型",
        type: "select",
        options: ["新手科普", "鸟舍打工日记", "职业转行记录", "养鸟避坑", "工具开发", "观察案例", "未定"]
      },
      { name: "titles", label: "标题备选", type: "textarea" },
      { name: "draft", label: "草稿", type: "textarea" },
      { name: "platform", label: "平台", type: "select", options: ["未定", "小红书", "抖音", "B站", "视频号", "公众号"] },
      { name: "status", label: "状态", type: "select", options: ["未整理", "可写", "已写", "已发布"] }
    ]
  },
  {
    kind: "interview",
    label: "用户访谈",
    shortLabel: "访谈",
    description: "记录养鸟人访谈，验证痛点、付费意愿和未来产品方向。",
    primaryField: "person",
    fields: [
      { name: "person", label: "访谈对象", type: "text", required: true },
      { name: "bird", label: "养什么鸟", type: "text" },
      { name: "painPoints", label: "最大痛点", type: "textarea" },
      { name: "spending", label: "花钱最多的地方", type: "textarea" },
      { name: "worries", label: "最担心的问题", type: "textarea" },
      { name: "needsRecordTool", label: "是否需要养鸟记录工具", type: "select", options: ["未问", "需要", "可能需要", "不需要"] },
      { name: "needsBoardingReport", label: "是否需要寄养日报", type: "select", options: ["未问", "需要", "可能需要", "不需要"] },
      { name: "willingness", label: "付费意愿", type: "rating" },
      { name: "transcript", label: "原始访谈文本", type: "textarea" },
      { name: "judgment", label: "我的判断", type: "textarea" }
    ]
  },
  {
    kind: "idea",
    label: "产品灵感",
    shortLabel: "灵感",
    description: "把一线问题转成可验证的数字化工具假设。",
    primaryField: "ideaTitle",
    fields: [
      { name: "ideaTitle", label: "灵感标题", type: "text", required: true },
      { name: "source", label: "来源证据", type: "textarea" },
      { name: "targetUser", label: "目标用户", type: "text" },
      { name: "pain", label: "解决什么痛点", type: "textarea" },
      { name: "alternatives", label: "现在的替代方案", type: "textarea" },
      { name: "monetization", label: "付费可能性", type: "rating" },
      { name: "complexity", label: "实现复杂度", type: "rating" },
      { name: "judgment", label: "当前判断", type: "textarea" }
    ]
  }
];

const schemaMap = new Map(schemas.map((schema) => [schema.kind, schema]));

const state = {
  unlocked: false,
  entries: [],
  activeKind: "quick",
  editingId: null,
  query: "",
  libraryKind: "all",
  settingsOpen: false,
  syncMessage: "本机 IndexedDB 已启用。",
  syncing: false
};

const app = document.querySelector("#app");

function nowIso() {
  return new Date().toISOString();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function id() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function html(strings, ...values) {
  return strings.reduce((result, string, index) => result + string + (values[index] ?? ""), "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fieldText(value) {
  if (!value) return "";
  return Array.isArray(value) ? value.join("、") : String(value);
}

function parseTags(value) {
  return String(value || "")
    .split(/[,，\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ENTRY_STORE)) {
        const store = db.createObjectStore(ENTRY_STORE, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
        store.createIndex("kind", "kind");
        store.createIndex("date", "date");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbAction(mode, action) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ENTRY_STORE, mode);
    const store = tx.objectStore(ENTRY_STORE);
    const result = action(store);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
  }).finally(() => db.close());
}

async function getAllEntries() {
  const entries = await dbAction("readonly", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  });
  return sortEntries(entries);
}

async function putEntry(entry) {
  await dbAction("readwrite", (store) => store.put(entry));
}

async function deleteEntry(idValue) {
  await dbAction("readwrite", (store) => store.delete(idValue));
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    const dateOrder = String(b.date).localeCompare(String(a.date));
    if (dateOrder !== 0) return dateOrder;
    return String(b.updatedAt).localeCompare(String(a.updatedAt));
  });
}

function readSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function remoteConfigured() {
  const settings = readSettings();
  return Boolean(settings.supabaseUrl && settings.supabaseAnonKey && settings.ownerKey);
}

function remoteUrl(path) {
  const settings = readSettings();
  return `${String(settings.supabaseUrl || "").replace(/\/$/, "")}/rest/v1/${path}`;
}

function remoteHeaders(extra = {}) {
  const settings = readSettings();
  return {
    apikey: settings.supabaseAnonKey,
    Authorization: `Bearer ${settings.supabaseAnonKey}`,
    "Content-Type": "application/json",
    ...extra
  };
}

function toRow(entry) {
  return {
    id: entry.id,
    owner_key: readSettings().ownerKey,
    kind: entry.kind,
    entry_date: entry.date || null,
    title: entry.title,
    payload: entry,
    updated_at: entry.updatedAt
  };
}

async function pushEntry(entry) {
  if (!remoteConfigured()) return;
  const response = await fetch(remoteUrl("birdlog_entries?on_conflict=id"), {
    method: "POST",
    headers: remoteHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(toRow(entry))
  });
  if (!response.ok) throw new Error(await response.text());
}

async function pushDelete(entryId) {
  if (!remoteConfigured()) return;
  const response = await fetch(remoteUrl(`birdlog_entries?id=eq.${encodeURIComponent(entryId)}`), {
    method: "DELETE",
    headers: remoteHeaders()
  });
  if (!response.ok) throw new Error(await response.text());
}

async function pullRemote() {
  if (!remoteConfigured()) return [];
  const settings = readSettings();
  const path = `birdlog_entries?owner_key=eq.${encodeURIComponent(settings.ownerKey)}&select=*&order=updated_at.desc`;
  const response = await fetch(remoteUrl(path), { headers: remoteHeaders() });
  if (!response.ok) throw new Error(await response.text());
  const rows = await response.json();
  return rows.map((row) => ({ ...row.payload, syncedAt: nowIso() }));
}

async function syncNow() {
  if (!remoteConfigured()) {
    state.syncMessage = "未配置 Supabase，当前只保存在本机浏览器。";
    render();
    return;
  }

  state.syncing = true;
  state.syncMessage = "正在同步...";
  render();

  try {
    for (const entry of state.entries) {
      await pushEntry(entry);
    }
    const remoteEntries = await pullRemote();
    const merged = mergeEntries(state.entries, remoteEntries);
    for (const entry of merged) {
      await putEntry(entry);
    }
    state.entries = merged;
    state.syncMessage = `同步完成：${merged.length} 条记录。`;
  } catch (error) {
    state.syncMessage = `同步失败：${error.message || "请检查 Supabase 配置和网络。"}`;
  } finally {
    state.syncing = false;
    render();
  }
}

function mergeEntries(localEntries, remoteEntries) {
  const map = new Map();
  for (const entry of [...localEntries, ...remoteEntries]) {
    const existing = map.get(entry.id);
    if (!existing || String(entry.updatedAt) > String(existing.updatedAt)) {
      map.set(entry.id, entry);
    }
  }
  return sortEntries([...map.values()]);
}

async function saveEntry(entry) {
  await putEntry(entry);
  state.entries = sortEntries([entry, ...state.entries.filter((item) => item.id !== entry.id)]);
  state.editingId = null;
  state.syncMessage = "已保存到本机。";
  render();
  if (remoteConfigured()) {
    try {
      await pushEntry(entry);
      state.syncMessage = "已保存并同步到云端。";
    } catch {
      state.syncMessage = "已保存到本机，云同步稍后重试。";
    }
    render();
  }
}

async function removeEntry(entryId) {
  if (!window.confirm("确定删除这条记录吗？")) return;
  await deleteEntry(entryId);
  state.entries = state.entries.filter((entry) => entry.id !== entryId);
  render();
  try {
    await pushDelete(entryId);
    state.syncMessage = "已删除并同步。";
  } catch {
    state.syncMessage = "已从本机删除，云端删除失败。";
  }
  render();
}

async function compressImage(file) {
  const rawData = await readFileAsDataUrl(file);
  if (!file.type.startsWith("image/")) {
    return { id: id(), name: file.name, dataUrl: rawData, createdAt: nowIso() };
  }
  const image = await loadImage(rawData);
  const maxSize = 900;
  const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * ratio));
  canvas.height = Math.max(1, Math.round(image.height * ratio));
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  return {
    id: id(),
    name: file.name,
    dataUrl: canvas.toDataURL("image/jpeg", 0.66),
    createdAt: nowIso()
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function currentSchema() {
  return schemaMap.get(state.activeKind) || schemas[0];
}

function emptyFields(schema) {
  return Object.fromEntries(schema.fields.map((field) => [field.name, field.type === "multiselect" ? [] : ""]));
}

function filteredEntries() {
  const query = state.query.trim().toLowerCase();
  return state.entries.filter((entry) => {
    const kindMatch = state.libraryKind === "all" || entry.kind === state.libraryKind;
    const text = [
      entry.title,
      entry.kind,
      entry.date,
      entry.tags.join(" "),
      ...Object.values(entry.fields).map(fieldText)
    ]
      .join(" ")
      .toLowerCase();
    return kindMatch && (!query || text.includes(query));
  });
}

function render() {
  if (!app) return;
  const settings = readSettings();
  if (settings.accessCode && localStorage.getItem(LOCK_KEY) !== settings.accessCode) {
    app.innerHTML = renderGate(settings);
    bindGate();
    return;
  }

  const schema = currentSchema();
  app.innerHTML = html`
    <main class="app-shell">
      <header class="app-header">
        <div>
          <p class="eyebrow">BirdLog v0.1</p>
          <h1>鸟舍学徒资产库</h1>
          <p class="header-copy">把每天的一线经验沉淀成内容素材、产品灵感和可复盘的知识资产。</p>
        </div>
        <div class="sync-card">
          <span class="${navigator.onLine ? "dot online" : "dot offline"}"></span>
          <strong>${remoteConfigured() ? "云同步" : "本机 IndexedDB"}</strong>
          <p>${escapeHtml(state.syncMessage)}</p>
          <div class="sync-actions">
            <button class="ghost-button" data-action="sync" ${state.syncing ? "disabled" : ""}>立即同步</button>
            <button class="ghost-button" data-action="settings">设置</button>
          </div>
        </div>
      </header>

      ${state.settingsOpen ? renderSettings(settings) : ""}

      <nav class="tab-bar" aria-label="记录类型">
        ${schemas
          .map(
            (item) =>
              `<button class="${state.activeKind === item.kind ? "active" : ""}" data-kind="${item.kind}">${item.shortLabel}</button>`
          )
          .join("")}
        <button class="${state.activeKind === "weekly" ? "active" : ""}" data-kind="weekly">复盘</button>
      </nav>

      <section class="workspace">
        ${state.activeKind === "weekly" ? renderWeeklyReview() : renderRecordForm(schema)}
        <aside class="side-panel">
          <section class="panel-card">
            <h2>今天应该留下什么</h2>
            <ul class="prompt-list">
              <li>一个具体观察，不要只写“挺正常”。</li>
              <li>一个你以前不知道的处理方式。</li>
              <li>一个别人问过的问题，哪怕很简单。</li>
              <li>一个未来可能做成内容或工具的点。</li>
            </ul>
          </section>
          ${renderStats()}
        </aside>
      </section>

      ${renderLibrary()}
    </main>
  `;

  bindEvents();
}

function renderGate(settings) {
  return html`
    <main class="gate">
      <section class="gate-card">
        <div class="brand-mark">BirdLog</div>
        <h1>输入访问码</h1>
        <p>这是本浏览器的轻量访问锁。它不是正式账号系统，但能防止随手打开就看到数据。</p>
        <form id="gate-form">
          <input name="accessCode" autofocus placeholder="访问码" type="password" />
          <button type="submit">进入</button>
        </form>
        <p class="small-note">${settings.accessCode ? "" : "还没有设置访问码。进入设置后可以添加。"}</p>
      </section>
    </main>
  `;
}

function renderSettings(settings) {
  return html`
    <section class="settings-card">
      <div>
        <p class="eyebrow">Settings</p>
        <h2>同步与访问设置</h2>
        <p>这些配置只保存在当前浏览器，不会写进公开仓库。Mac 和 iPhone 各输入一次即可。</p>
      </div>
      <form id="settings-form" class="settings-grid">
        <label class="field">
          <span>本地访问码</span>
          <input name="accessCode" value="${escapeHtml(settings.accessCode || "")}" placeholder="可选，设置后打开需输入" />
        </label>
        <label class="field">
          <span>Supabase URL</span>
          <input name="supabaseUrl" value="${escapeHtml(settings.supabaseUrl || "")}" placeholder="https://xxxx.supabase.co" />
        </label>
        <label class="field">
          <span>Supabase anon key</span>
          <input name="supabaseAnonKey" value="${escapeHtml(settings.supabaseAnonKey || "")}" placeholder="eyJ..." />
        </label>
        <label class="field">
          <span>Owner key</span>
          <input name="ownerKey" value="${escapeHtml(settings.ownerKey || "")}" placeholder="自己生成一段随机字符串" />
        </label>
        <div class="settings-actions">
          <button class="primary-button" type="submit">保存设置</button>
          <button class="ghost-button" type="button" data-action="close-settings">关闭</button>
        </div>
      </form>
    </section>
  `;
}

function renderRecordForm(schema) {
  const editing = state.editingId ? state.entries.find((entry) => entry.id === state.editingId) : null;
  const values = editing?.kind === schema.kind ? editing.fields : emptyFields(schema);
  const tags = editing?.kind === schema.kind ? editing.tags.join(" ") : "";
  const images = editing?.kind === schema.kind ? editing.images || [] : [];
  return html`
    <section class="form-card">
      <div class="form-heading">
        <div>
          <p class="eyebrow">${editing ? "Editing" : "Capture"}</p>
          <h2>${editing ? `编辑：${escapeHtml(schema.label)}` : escapeHtml(schema.label)}</h2>
          <p>${escapeHtml(schema.description)}</p>
        </div>
        ${editing ? `<button class="ghost-button" data-action="cancel-edit" type="button">取消编辑</button>` : ""}
      </div>

      <form id="record-form" class="record-form" data-kind="${schema.kind}">
        <input type="hidden" name="editingId" value="${escapeHtml(editing?.id || "")}" />
        <label class="field">
          <span>日期</span>
          <input type="date" name="date" value="${escapeHtml(editing?.date || today())}" />
        </label>
        ${schema.fields.map((field) => renderField(field, values[field.name])).join("")}
        <label class="field">
          <span>标签</span>
          <input name="tags" value="${escapeHtml(tags)}" placeholder="例：玄凤 异常 内容素材" />
        </label>
        <label class="field">
          <span>图片</span>
          <input name="images" accept="image/*" multiple type="file" />
          <small>图片会压缩后存入 IndexedDB。第一版适合关键照片，不建议当相册。</small>
        </label>
        <div class="image-strip" id="image-strip">
          ${images.map(renderImageFigure).join("")}
        </div>
        <button class="primary-button" type="button" data-action="save-record">${editing ? "保存修改" : "保存记录"}</button>
      </form>
    </section>
  `;
}

function renderField(field, value) {
  if (field.type === "textarea") {
    return html`
      <label class="field">
        <span>${escapeHtml(field.label)}</span>
        <textarea name="${field.name}" ${field.required ? "required" : ""} placeholder="${escapeHtml(field.placeholder || "")}" rows="5">${escapeHtml(
          fieldText(value)
        )}</textarea>
      </label>
    `;
  }

  if (field.type === "select" || field.type === "rating") {
    const options = field.type === "rating" ? ["", "1", "2", "3", "4", "5"] : ["", ...(field.options || [])];
    return html`
      <label class="field">
        <span>${escapeHtml(field.label)}</span>
        <select name="${field.name}" ${field.required ? "required" : ""}>
          ${options
            .map((option) => `<option value="${escapeHtml(option)}" ${fieldText(value) === option ? "selected" : ""}>${option || "未选择"}</option>`)
            .join("")}
        </select>
      </label>
    `;
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value : [];
    return html`
      <div class="field" data-multiselect="${field.name}">
        <span>${escapeHtml(field.label)}</span>
        <div class="chip-grid">
          ${(field.options || [])
            .map(
              (option) => html`
                <label class="${selected.includes(option) ? "chip selected" : "chip"}">
                  <input type="checkbox" name="${field.name}" value="${escapeHtml(option)}" ${selected.includes(option) ? "checked" : ""} />
                  ${escapeHtml(option)}
                </label>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  return html`
    <label class="field">
      <span>${escapeHtml(field.label)}</span>
      <input name="${field.name}" value="${escapeHtml(fieldText(value))}" ${field.required ? "required" : ""} placeholder="${escapeHtml(
        field.placeholder || ""
      )}" />
    </label>
  `;
}

function renderImageFigure(image) {
  return html`
    <figure data-image-id="${image.id}">
      <img src="${image.dataUrl}" alt="${escapeHtml(image.name)}" />
      <button type="button" data-action="remove-image" data-image-id="${image.id}">删除</button>
    </figure>
  `;
}

function renderStats() {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const startKey = start.toISOString().slice(0, 10);
  const lastSeven = state.entries.filter((entry) => entry.date >= startKey);
  return html`
    <section class="panel-card stats-card">
      <h2>资产进度</h2>
      <div class="metric-row"><span>总记录</span><strong>${state.entries.length}</strong></div>
      <div class="metric-row"><span>近 7 天</span><strong>${lastSeven.length}</strong></div>
      <div class="metric-row"><span>内容素材</span><strong>${state.entries.filter((entry) => entry.kind === "content").length}</strong></div>
      <div class="metric-row"><span>产品灵感</span><strong>${state.entries.filter((entry) => entry.kind === "idea").length}</strong></div>
    </section>
  `;
}

function renderWeeklyReview() {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const startKey = start.toISOString().slice(0, 10);
  const weekly = state.entries.filter((entry) => entry.date >= startKey);
  const topSpecies = countTop(weekly.map((entry) => fieldText(entry.fields.species)));
  const topTags = countTop(weekly.flatMap((entry) => entry.tags));
  const questions = weekly.filter((entry) => entry.kind === "question").slice(0, 5);
  const ideas = weekly.filter((entry) => entry.kind === "idea").slice(0, 5);
  return html`
    <section class="form-card">
      <div class="form-heading">
        <div>
          <p class="eyebrow">Weekly Review</p>
          <h2>周复盘</h2>
          <p>判断这一周是在积累资产，还是只是在消耗体力。</p>
        </div>
      </div>
      <div class="review-grid">
        <div class="review-box"><span>本周记录</span><strong>${weekly.length}</strong></div>
        <div class="review-box"><span>异常观察</span><strong>${weekly.filter((entry) => entry.kind === "abnormal").length}</strong></div>
        <div class="review-box"><span>新增问题</span><strong>${weekly.filter((entry) => entry.kind === "question").length}</strong></div>
        <div class="review-box"><span>新增灵感</span><strong>${weekly.filter((entry) => entry.kind === "idea").length}</strong></div>
      </div>
      <div class="insight-columns">
        ${renderInsight("高频鸟种", topSpecies.map(([name, count]) => `${name} x ${count}`))}
        ${renderInsight("高频标签", topTags.map(([name, count]) => `${name} x ${count}`))}
        ${renderInsight("本周问题", questions.map((entry) => entry.title))}
        ${renderInsight("产品灵感", ideas.map((entry) => entry.title))}
      </div>
      <form id="weekly-form" class="record-form">
        <label class="field">
          <span>这一周最重要的学习</span>
          <textarea name="reflection" rows="5" required></textarea>
        </label>
        <label class="field">
          <span>下周重点观察</span>
          <textarea name="focus" rows="4"></textarea>
        </label>
        <button class="primary-button" type="button" data-action="save-weekly">保存周复盘</button>
      </form>
    </section>
  `;
}

function countTop(values, limit = 6) {
  const counts = new Map();
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function renderInsight(title, items) {
  return html`
    <div class="insight-card">
      <h3>${escapeHtml(title)}</h3>
      ${
        items.length
          ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
          : `<p>暂无数据</p>`
      }
    </div>
  `;
}

function renderLibrary() {
  const entries = filteredEntries();
  return html`
    <section class="library">
      <div class="library-header">
        <div>
          <p class="eyebrow">Library</p>
          <h2>记录库</h2>
        </div>
        <div class="library-actions">
          <input id="search-input" value="${escapeHtml(state.query)}" placeholder="搜索鸟种、问题、标签" />
          <select id="kind-filter">
            <option value="all" ${state.libraryKind === "all" ? "selected" : ""}>全部类型</option>
            ${schemas.map((item) => `<option value="${item.kind}" ${state.libraryKind === item.kind ? "selected" : ""}>${item.label}</option>`).join("")}
            <option value="weekly" ${state.libraryKind === "weekly" ? "selected" : ""}>周复盘</option>
          </select>
          <button data-action="export-md">导出 MD</button>
          <button data-action="export-csv">导出 CSV</button>
          <button data-action="export-json">备份 JSON</button>
        </div>
      </div>
      <div class="entry-grid">
        ${
          entries.length
            ? entries.map(renderEntryCard).join("")
            : `<div class="empty-state">还没有符合条件的记录。</div>`
        }
      </div>
    </section>
  `;
}

function renderEntryCard(entry) {
  const schema = schemaMap.get(entry.kind);
  const preview = Object.entries(entry.fields)
    .filter(([, value]) => fieldText(value).trim())
    .slice(0, 4);
  return html`
    <article class="entry-card">
      <div class="entry-meta">
        <span>${escapeHtml(schema?.shortLabel || entry.kind)}</span>
        <time>${escapeHtml(entry.date)}</time>
      </div>
      <h3>${escapeHtml(entry.title)}</h3>
      <dl>
        ${preview
          .map(
            ([key, value]) => html`
              <div>
                <dt>${escapeHtml(key)}</dt>
                <dd>${escapeHtml(fieldText(value))}</dd>
              </div>
            `
          )
          .join("")}
      </dl>
      ${
        entry.images?.length
          ? `<div class="thumbs">${entry.images
              .slice(0, 3)
              .map((image) => `<img src="${image.dataUrl}" alt="${escapeHtml(image.name)}" />`)
              .join("")}</div>`
          : ""
      }
      ${
        entry.tags?.length
          ? `<div class="tag-row">${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`
          : ""
      }
      <div class="entry-actions">
        <button data-action="edit-entry" data-id="${entry.id}">编辑</button>
        ${entry.kind !== "content" ? `<button data-action="create-content" data-id="${entry.id}">转内容</button>` : ""}
        <button class="danger" data-action="delete-entry" data-id="${entry.id}">删除</button>
      </div>
    </article>
  `;
}

function bindGate() {
  // Submit handling is delegated once in init().
}

function bindEvents() {
  document.querySelectorAll("[data-kind]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeKind = button.dataset.kind;
      state.editingId = null;
      render();
    });
  });

  document.querySelector('[data-action="sync"]')?.addEventListener("click", () => syncNow());
  document.querySelector('[data-action="settings"]')?.addEventListener("click", () => {
    state.settingsOpen = !state.settingsOpen;
    render();
  });
  document.querySelector('[data-action="close-settings"]')?.addEventListener("click", () => {
    state.settingsOpen = false;
    render();
  });
  document.querySelector('[data-action="cancel-edit"]')?.addEventListener("click", () => {
    state.editingId = null;
    render();
  });
  document.querySelector('[data-action="save-record"]')?.addEventListener("click", () => {
    const form = document.querySelector("#record-form");
    if (form instanceof HTMLFormElement) {
      void saveRecordForm(form);
    }
  });
  document.querySelector('[data-action="save-weekly"]')?.addEventListener("click", () => {
    const form = document.querySelector("#weekly-form");
    if (form instanceof HTMLFormElement) {
      void saveWeeklyForm(form);
    }
  });

  document.querySelector("#search-input")?.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });
  document.querySelector("#kind-filter")?.addEventListener("change", (event) => {
    state.libraryKind = event.target.value;
    render();
  });

  document.querySelectorAll("[data-action='delete-entry']").forEach((button) => {
    button.addEventListener("click", () => removeEntry(button.dataset.id));
  });
  document.querySelectorAll("[data-action='edit-entry']").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = state.entries.find((item) => item.id === button.dataset.id);
      if (!entry) return;
      state.activeKind = entry.kind;
      state.editingId = entry.id;
      window.scrollTo({ top: 0, behavior: "smooth" });
      render();
    });
  });
  document.querySelectorAll("[data-action='create-content']").forEach((button) => {
    button.addEventListener("click", () => createContentFromEntry(button.dataset.id));
  });
  document.querySelectorAll("[data-action='remove-image']").forEach((button) => {
    button.addEventListener("click", () => {
      const figure = button.closest("figure");
      figure?.remove();
    });
  });
  document.querySelector('[data-action="export-md"]')?.addEventListener("click", () => {
    downloadText("birdlog.md", entriesToMarkdown(filteredEntries()), "text/markdown;charset=utf-8");
  });
  document.querySelector('[data-action="export-csv"]')?.addEventListener("click", () => {
    downloadText("birdlog.csv", entriesToCsv(filteredEntries()), "text/csv;charset=utf-8");
  });
  document.querySelector('[data-action="export-json"]')?.addEventListener("click", () => {
    downloadText("birdlog.json", JSON.stringify(filteredEntries(), null, 2), "application/json");
  });
}

async function handleRecordSubmit(event) {
  event.preventDefault();
  if (event.target instanceof HTMLFormElement) {
    await saveRecordForm(event.target);
  }
}

async function saveRecordForm(form) {
  try {
    if (!form.reportValidity()) return;
    const schema = schemaMap.get(form.dataset.kind);
    const formData = new FormData(form);
    const editingId = String(formData.get("editingId") || "");
    const editing = state.entries.find((entry) => entry.id === editingId);
    const fields = {};
    for (const field of schema.fields) {
      fields[field.name] = field.type === "multiselect" ? formData.getAll(field.name).map(String) : String(formData.get(field.name) || "");
    }

    const existingImages = editing?.images || [];
    const visibleImageIds = new Set([...document.querySelectorAll("#image-strip figure")].map((figure) => figure.dataset.imageId));
    const retainedImages = existingImages.filter((image) => visibleImageIds.has(image.id));
    const fileInput = form.querySelector('input[name="images"]');
    const files = fileInput?.files ? [...fileInput.files].slice(0, 4) : [];
    const newImages = [];
    for (const file of files) {
      newImages.push(await compressImage(file));
    }

    const title = fieldText(fields[schema.primaryField]).slice(0, 42) || `${schema.label} ${formData.get("date") || today()}`;
    const entry = {
      id: editing?.id || id(),
      kind: schema.kind,
      date: String(formData.get("date") || today()),
      title,
      tags: parseTags(formData.get("tags")),
      fields,
      images: [...retainedImages, ...newImages],
      createdAt: editing?.createdAt || nowIso(),
      updatedAt: nowIso()
    };
    await saveEntry(entry);
  } catch (error) {
    console.error(error);
    state.syncMessage = `保存失败：${error.message || "未知错误"}`;
    render();
  }
}

async function handleWeeklySubmit(event) {
  event.preventDefault();
  if (event.target instanceof HTMLFormElement) {
    await saveWeeklyForm(event.target);
  }
}

async function saveWeeklyForm(form) {
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const startKey = start.toISOString().slice(0, 10);
  const weekly = state.entries.filter((entry) => entry.date >= startKey);
  const topSpecies = countTop(weekly.map((entry) => fieldText(entry.fields.species)));
  const topTags = countTop(weekly.flatMap((entry) => entry.tags));
  const entry = {
    id: id(),
    kind: "weekly",
    date: today(),
    title: `周复盘 ${today()}`,
    tags: ["周复盘"],
    fields: {
      reflection: String(formData.get("reflection") || ""),
      focus: String(formData.get("focus") || ""),
      recordCount: String(weekly.length),
      topSpecies: topSpecies.map(([name, count]) => `${name}(${count})`).join("、"),
      topTags: topTags.map(([name, count]) => `${name}(${count})`).join("、")
    },
    images: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  await saveEntry(entry);
}

async function createContentFromEntry(entryId) {
  const source = state.entries.find((entry) => entry.id === entryId);
  if (!source) return;
  const sourceText = `${source.date}｜${source.title}\n\n${Object.entries(source.fields)
    .map(([key, value]) => `${key}: ${fieldText(value)}`)
    .join("\n")}`;
  const entry = {
    id: id(),
    kind: "content",
    date: today(),
    title: `内容素材：${source.title}`,
    tags: [...new Set(["内容素材", ...source.tags])],
    fields: {
      topic: source.title,
      source: sourceText,
      contentType: "未定",
      titles: "",
      draft: "",
      platform: "未定",
      status: "未整理"
    },
    images: source.images || [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  await saveEntry(entry);
  state.activeKind = "content";
  render();
}

function entriesToMarkdown(entries) {
  return entries
    .map((entry) => {
      const tags = entry.tags.map((tag) => `"${tag.replaceAll('"', '\\"')}"`).join(", ");
      const species = fieldText(entry.fields.species);
      const yaml = [
        "---",
        `id: "${entry.id}"`,
        `date: "${entry.date}"`,
        `kind: "${entry.kind}"`,
        `title: "${entry.title.replaceAll('"', '\\"')}"`,
        `tags: [${tags}]`,
        species ? `species: "${species.replaceAll('"', '\\"')}"` : "",
        "---"
      ]
        .filter(Boolean)
        .join("\n");
      const body = Object.entries(entry.fields)
        .filter(([, value]) => fieldText(value).trim())
        .map(([key, value]) => `- **${key}**: ${fieldText(value)}`)
        .join("\n");
      const images = entry.images?.length ? `\n\n## 图片\n${entry.images.map((image) => `- ${image.name}`).join("\n")}` : "";
      return `${yaml}\n\n# ${entry.title}\n\n${body}${images}\n`;
    })
    .join("\n---\n\n");
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function entriesToCsv(entries) {
  const headers = ["id", "kind", "date", "title", "tags", "fields", "createdAt", "updatedAt"];
  const rows = entries.map((entry) => [
    entry.id,
    entry.kind,
    entry.date,
    entry.title,
    entry.tags.join("|"),
    JSON.stringify(entry.fields),
    entry.createdAt,
    entry.updatedAt
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function downloadText(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function init() {
  document.addEventListener("submit", handleDelegatedSubmit);
  state.entries = await getAllEntries();
  render();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}

function handleDelegatedSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.id === "gate-form") {
    event.preventDefault();
    const settings = readSettings();
    const value = new FormData(form).get("accessCode");
    if (value === settings.accessCode) {
      localStorage.setItem(LOCK_KEY, settings.accessCode);
      render();
    }
    return;
  }

  if (form.id === "settings-form") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    writeSettings({
      accessCode: String(data.accessCode || "").trim(),
      supabaseUrl: String(data.supabaseUrl || "").trim(),
      supabaseAnonKey: String(data.supabaseAnonKey || "").trim(),
      ownerKey: String(data.ownerKey || "").trim()
    });
    if (data.accessCode) localStorage.setItem(LOCK_KEY, String(data.accessCode));
    state.settingsOpen = false;
    state.syncMessage = "设置已保存。";
    render();
    return;
  }

  if (form.id === "record-form") {
    event.preventDefault();
    void handleRecordSubmit(event);
    return;
  }

  if (form.id === "weekly-form") {
    event.preventDefault();
    void handleWeeklySubmit(event);
  }
}

init();
