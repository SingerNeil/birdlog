const APP_VERSION = "1.1.0";
const DB_NAME = "birdlog-db";
const DB_VERSION = 1;
const ENTRY_STORE = "entries";
const SETTINGS_KEY = "birdlog.settings.v1";
const LOCK_KEY = "birdlog.lock.v1";
const DRAFT_PREFIX = "birdlog.draft.";

const schemas = [
  {
    kind: "quick",
    label: "日常记录",
    shortLabel: "记录",
    description: "碎片记录、下班补记和原始语料都放这里，先保证能持续留下事实。",
    primaryField: "observation",
    fields: [
      {
        name: "workTypes",
        label: "工作类型",
        type: "multiselect",
        options: ["清洁", "饲养", "观察", "游客接待", "学习", "设备/环境", "其他"]
      },
      { name: "species", label: "鸟种/对象", type: "text", placeholder: "例：玄凤、和尚、蓝喉金刚、某只明星鸟" },
      { name: "scene", label: "场景", type: "text", placeholder: "例：上午清洁区、游客互动、喂食后观察" },
      { name: "observation", label: "观察记录", type: "textarea", required: true },
      { name: "learning", label: "今天学到的东西", type: "textarea" },
      { name: "raw", label: "原始语料", type: "textarea", placeholder: "可以直接用豆包输入法口述，先不整理。" },
      { name: "nextAction", label: "后续想验证", type: "textarea" }
    ]
  },
  {
    kind: "abnormal",
    label: "异常观察",
    shortLabel: "异常",
    description: "把异常表现、处理方式和后续结果沉淀成可复盘案例。",
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
      { name: "followUp", label: "后续观察", type: "textarea" },
      { name: "severity", label: "严重程度", type: "rating" }
    ]
  },
  {
    kind: "bird",
    label: "明星鸟档案",
    shortLabel: "个体",
    description: "给叫得出名字、未来会反复出现的鸟建立轻量档案。",
    primaryField: "name",
    fields: [
      { name: "name", label: "名字", type: "text", required: true },
      { name: "species", label: "鸟种", type: "text" },
      { name: "sexAge", label: "性别/年龄", type: "text" },
      { name: "traits", label: "识别特征", type: "textarea" },
      { name: "personality", label: "性格", type: "textarea" },
      { name: "behaviors", label: "常见行为", type: "textarea" },
      { name: "handlingTips", label: "互动/照护注意", type: "textarea" },
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
        options: ["价格", "寿命", "说话", "咬人", "饮食", "合法性", "饲养难度", "疾病", "互动", "寄养", "用品", "训练"]
      },
      { name: "answer", label: "当时怎么回答", type: "textarea" },
      { name: "betterAnswer", label: "下次更好的回答", type: "textarea" },
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
      { name: "source", label: "来源证据", type: "textarea", placeholder: "来自哪条记录、哪个问题、哪次访谈" },
      {
        name: "contentType",
        label: "类型",
        type: "select",
        options: ["新手科普", "鸟舍打工日记", "职业转行记录", "养鸟避坑", "工具开发", "观察案例", "未定"]
      },
      { name: "titles", label: "标题备选", type: "textarea" },
      { name: "draft", label: "草稿", type: "textarea" },
      { name: "platform", label: "平台", type: "select", options: ["未定", "小红书", "抖音", "B站", "视频号", "公众号"] },
      { name: "status", label: "状态", type: "select", options: ["未整理", "可写", "已写", "已发布"] },
      { name: "nextStep", label: "下一步", type: "textarea" }
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
      { name: "profile", label: "基本画像", type: "textarea" },
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
      { name: "firstExperiment", label: "第一个验证动作", type: "textarea" },
      { name: "monetization", label: "付费可能性", type: "rating" },
      { name: "complexity", label: "实现复杂度", type: "rating" },
      { name: "judgment", label: "当前判断", type: "textarea" },
      { name: "status", label: "状态", type: "select", options: ["想法", "待访谈", "验证中", "放弃", "可做"] }
    ]
  }
];

const templates = {
  quick: [
    {
      name: "下班补记",
      fields: {
        observation: "今天最值得留下的事实：\n\n当时我怎么判断：\n\n这个观察以后可能有什么用：",
        learning: "今天学到的操作/判断：\n\n还没弄明白的问题：",
        nextAction: "明天继续观察："
      },
      tags: ["日常", "学习"]
    },
    {
      name: "游客接待",
      fields: {
        workTypes: ["游客接待"],
        observation: "游客问了什么：\n\n他们为什么会关心这个：\n\n现场反应：",
        learning: "下次可以怎么解释得更清楚：",
        nextAction: "可转成的内容选题："
      },
      tags: ["游客问题", "内容素材"]
    }
  ],
  abnormal: [
    {
      name: "异常观察标准版",
      fields: {
        symptom: "我看到的异常事实：\n\n出现时间/持续时间：\n\n和正常状态相比的差异：",
        droppings: "颜色：\n形态：\n频率：",
        feathers: "羽毛状态：",
        handling: "当时怎么处理：\n谁判断/谁执行：",
        followUp: "需要复查的点："
      },
      tags: ["异常观察"]
    }
  ],
  bird: [
    {
      name: "明星鸟建档",
      fields: {
        traits: "一眼识别特征：",
        personality: "亲人程度/警惕程度：",
        behaviors: "常见动作和触发条件：",
        handlingTips: "互动边界、容易应激的点："
      },
      tags: ["明星鸟"]
    }
  ],
  question: [
    {
      name: "高频问题",
      fields: {
        question: "原话：\n\n追问：",
        answer: "我当时怎么回答：",
        betterAnswer: "下次可以用的回答结构：\n1. 先给结论\n2. 给原因\n3. 给新手建议",
        contentPotential: "4"
      },
      tags: ["问题库", "内容素材"]
    }
  ],
  content: [
    {
      name: "小红书草稿",
      fields: {
        contentType: "未定",
        platform: "小红书",
        status: "未整理",
        titles: "标题 1：\n标题 2：\n标题 3：",
        draft: "开头钩子：\n\n正文三点：\n1.\n2.\n3.\n\n结尾互动："
      },
      tags: ["小红书"]
    }
  ],
  interview: [
    {
      name: "养鸟人访谈",
      fields: {
        profile: "年龄/阶段：\n养鸟时长：\n目前养几只：",
        painPoints: "最麻烦的事情：\n为什么麻烦：\n现在怎么解决：",
        spending: "最近三次为鸟花钱：",
        worries: "最担心发生什么：",
        transcript: "原始转写：",
        judgment: "我听完之后的判断："
      },
      tags: ["访谈", "用户研究"]
    }
  ],
  idea: [
    {
      name: "工具假设",
      fields: {
        source: "来自哪条记录/访谈/问题：",
        targetUser: "谁最需要：",
        pain: "具体痛点：",
        alternatives: "他们现在怎么凑合解决：",
        firstExperiment: "不用写代码，先验证的动作：",
        status: "想法"
      },
      tags: ["产品灵感"]
    }
  ]
};

const views = [
  { id: "dashboard", label: "看板", icon: "▦", hint: "资产概览" },
  { id: "capture", label: "记录", icon: "+", hint: "快速沉淀" },
  { id: "library", label: "资料库", icon: "⌕", hint: "搜索整理" },
  { id: "review", label: "复盘", icon: "◷", hint: "周期判断" },
  { id: "exports", label: "导出", icon: "⇩", hint: "备份迁移" },
  { id: "settings", label: "设置", icon: "⚙", hint: "同步访问" }
];

const schemaMap = new Map(schemas.map((schema) => [schema.kind, schema]));
const app = document.querySelector("#app");

const state = {
  view: "dashboard",
  activeKind: "quick",
  entries: [],
  editingId: null,
  detailId: null,
  filters: {
    query: "",
    kind: "all",
    dateFrom: "",
    dateTo: "",
    tag: "",
    starred: false
  },
  reviewDays: 7,
  syncMessage: "本机 IndexedDB 已启用。",
  syncing: false,
  toast: ""
};

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
  if (Array.isArray(value)) return value.filter(Boolean).join("、");
  return String(value ?? "");
}

function nowIso() {
  return new Date().toISOString();
}

function today() {
  return localDateKey(new Date());
}

function localDateKey(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function createId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseTags(value) {
  return String(value || "")
    .split(/[,，\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function notify(message) {
  state.toast = message;
  render();
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
  return sortEntries(entries.map(normalizeEntry));
}

async function putEntry(entry) {
  await dbAction("readwrite", (store) => store.put(normalizeEntry(entry)));
}

async function deleteEntry(entryId) {
  await dbAction("readwrite", (store) => store.delete(entryId));
}

function normalizeEntry(entry) {
  return {
    id: entry.id || createId(),
    kind: entry.kind || "quick",
    date: entry.date || today(),
    title: entry.title || "未命名记录",
    tags: Array.isArray(entry.tags) ? entry.tags : parseTags(entry.tags),
    fields: entry.fields || {},
    images: Array.isArray(entry.images) ? entry.images : [],
    pinned: Boolean(entry.pinned),
    createdAt: entry.createdAt || entry.updatedAt || nowIso(),
    updatedAt: entry.updatedAt || nowIso(),
    syncedAt: entry.syncedAt || ""
  };
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
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
    "x-owner-key": settings.ownerKey || "",
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
    payload: normalizeEntry(entry),
    updated_at: entry.updatedAt || nowIso()
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
  return rows.map((row) => normalizeEntry({ ...row.payload, syncedAt: nowIso() }));
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
      map.set(entry.id, normalizeEntry(entry));
    }
  }
  return sortEntries([...map.values()]);
}

async function saveEntry(entry, options = {}) {
  const normalized = normalizeEntry(entry);
  await putEntry(normalized);
  state.entries = sortEntries([normalized, ...state.entries.filter((item) => item.id !== normalized.id)]);
  if (!options.keepEditing) state.editingId = null;
  state.syncMessage = "已保存到本机。";
  render();

  if (remoteConfigured()) {
    try {
      await pushEntry(normalized);
      state.syncMessage = "已保存并同步到云端。";
    } catch {
      state.syncMessage = "已保存到本机，云同步稍后重试。";
    }
    render();
  }
}

async function removeEntry(entryId) {
  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) return;
  if (!window.confirm(`确定删除「${entry.title}」吗？`)) return;
  await deleteEntry(entryId);
  state.entries = state.entries.filter((item) => item.id !== entryId);
  if (state.detailId === entryId) state.detailId = null;
  if (state.editingId === entryId) state.editingId = null;
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
    return { id: createId(), name: file.name, dataUrl: rawData, createdAt: nowIso() };
  }

  const image = await loadImage(rawData);
  const maxSize = 1200;
  const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * ratio));
  canvas.height = Math.max(1, Math.round(image.height * ratio));
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  return {
    id: createId(),
    name: file.name,
    dataUrl: canvas.toDataURL("image/jpeg", 0.72),
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

function draftKey(kind) {
  return `${DRAFT_PREFIX}${kind}`;
}

function readDraft(kind) {
  try {
    return JSON.parse(localStorage.getItem(draftKey(kind)) || "{}");
  } catch {
    return {};
  }
}

function writeDraft(kind, draft) {
  localStorage.setItem(draftKey(kind), JSON.stringify({ ...draft, savedAt: nowIso() }));
}

function clearDraft(kind) {
  localStorage.removeItem(draftKey(kind));
}

function currentSchema() {
  return schemaMap.get(state.activeKind) || schemas[0];
}

function emptyFields(schema) {
  return Object.fromEntries(schema.fields.map((field) => [field.name, field.type === "multiselect" ? [] : ""]));
}

function fieldLabel(kind, fieldName) {
  const schema = schemaMap.get(kind);
  return schema?.fields.find((field) => field.name === fieldName)?.label || fieldName;
}

function entryText(entry) {
  return [
    entry.title,
    entry.kind,
    entry.date,
    fieldLabel(entry.kind, entry.kind),
    ...(entry.tags || []),
    ...Object.entries(entry.fields || {}).flatMap(([key, value]) => [fieldLabel(entry.kind, key), fieldText(value)])
  ].join(" ");
}

function filteredEntries() {
  const query = state.filters.query.trim().toLowerCase();
  return state.entries.filter((entry) => {
    if (state.filters.kind !== "all" && entry.kind !== state.filters.kind) return false;
    if (state.filters.dateFrom && entry.date < state.filters.dateFrom) return false;
    if (state.filters.dateTo && entry.date > state.filters.dateTo) return false;
    if (state.filters.starred && !entry.pinned) return false;
    if (state.filters.tag && !(entry.tags || []).includes(state.filters.tag)) return false;
    if (!query) return true;
    return entryText(entry).toLowerCase().includes(query);
  });
}

function entriesInLastDays(days) {
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  const startKey = localDateKey(start);
  return state.entries.filter((entry) => entry.date >= startKey);
}

function countTop(values, limit = 8) {
  const counts = new Map();
  values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function allTags() {
  return countTop(state.entries.flatMap((entry) => entry.tags || []), 50).map(([tag]) => tag);
}

function streakDays() {
  const dates = new Set(state.entries.map((entry) => entry.date));
  let cursor = new Date();
  let count = 0;
  while (dates.has(localDateKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function analytics() {
  const recent = entriesInLastDays(7);
  const questions = state.entries.filter((entry) => entry.kind === "question");
  const interviews = state.entries.filter((entry) => entry.kind === "interview");
  const contentBacklog = state.entries.filter((entry) => entry.kind === "content" && entry.fields?.status !== "已发布");
  const ideas = state.entries.filter((entry) => entry.kind === "idea");
  return {
    recent,
    questions,
    interviews,
    contentBacklog,
    ideas,
    topSpecies: countTop(state.entries.map((entry) => entry.fields?.species || entry.fields?.bird)),
    topTags: countTop(state.entries.flatMap((entry) => entry.tags || [])),
    topThemes: countTop(questions.flatMap((entry) => entry.fields?.themes || [])),
    opportunities: buildOpportunities()
  };
}

function buildOpportunities() {
  const rows = [];
  for (const entry of state.entries) {
    if (entry.kind === "question") {
      const rating = Number(entry.fields.contentPotential || 0);
      const themes = fieldText(entry.fields.themes);
      rows.push({
        title: entry.title,
        type: "内容选题",
        score: 50 + rating * 10 + (themes ? 8 : 0),
        reason: themes ? `高频主题：${themes}` : "来自真实提问",
        entryId: entry.id
      });
    }
    if (entry.kind === "interview") {
      const willingness = Number(entry.fields.willingness || 0);
      rows.push({
        title: entry.fields.painPoints || entry.title,
        type: "痛点信号",
        score: 45 + willingness * 12,
        reason: `访谈对象：${entry.title}`,
        entryId: entry.id
      });
    }
    if (entry.kind === "idea") {
      const pay = Number(entry.fields.monetization || 0);
      const complexity = Number(entry.fields.complexity || 0);
      rows.push({
        title: entry.title,
        type: "产品机会",
        score: 50 + pay * 12 - complexity * 6,
        reason: entry.fields.firstExperiment || entry.fields.pain || "待设计验证动作",
        entryId: entry.id
      });
    }
  }
  return rows.sort((a, b) => b.score - a.score).slice(0, 8);
}

function render() {
  if (!app) return;
  const settings = readSettings();
  if (settings.accessCode && localStorage.getItem(LOCK_KEY) !== settings.accessCode) {
    app.innerHTML = renderGate(settings);
    return;
  }

  app.innerHTML = html`
    <main class="app-shell">
      ${renderNav()}
      <section class="app-workspace">
        ${renderHeader()}
        ${renderCurrentView()}
      </section>
      ${renderDetailModal()}
      ${state.toast ? `<div class="toast" role="status">${escapeHtml(state.toast)}</div>` : ""}
    </main>
  `;
}

function renderHeader() {
  const settings = readSettings();
  const storageMode = remoteConfigured() ? "云同步可用" : "本机保存";
  const view = views.find((item) => item.id === state.view) || views[0];
  return html`
    <header class="app-header">
      <div class="brand-block">
        <p class="eyebrow">BirdLog ${APP_VERSION}</p>
        <h1>${escapeHtml(view.label)}</h1>
        <p>${escapeHtml(view.hint)} · ${today()}</p>
      </div>
      <section class="status-panel" aria-label="同步状态">
        <div>
          <span class="${navigator.onLine ? "dot online" : "dot offline"}"></span>
          <strong>${storageMode}</strong>
          <p>${escapeHtml(state.syncMessage)}</p>
        </div>
        <div class="status-actions">
          <button class="secondary-button" data-action="sync" ${state.syncing ? "disabled" : ""}>同步</button>
          <button class="secondary-button" data-action="go-view" data-view="settings">设置</button>
          ${settings.accessCode ? `<button class="secondary-button" data-action="lock-app">锁定</button>` : ""}
        </div>
      </section>
    </header>
  `;
}

function renderNav() {
  return html`
    <nav class="main-nav" aria-label="主导航">
      <div class="nav-brand">
        <span class="brand-glyph">B</span>
        <div>
          <strong>BirdLog</strong>
          <small>鸟舍资产库</small>
        </div>
      </div>
      ${views
        .map(
          (view) =>
            `<button class="${state.view === view.id ? "active" : ""}" data-action="go-view" data-view="${view.id}">
              <span class="nav-icon">${escapeHtml(view.icon)}</span>
              <span class="nav-label">${escapeHtml(view.label)}</span>
            </button>`
        )
        .join("")}
      <div class="nav-footer">
        <span class="${navigator.onLine ? "dot online" : "dot offline"}"></span>
        <span>${remoteConfigured() ? "Cloud" : "Local"}</span>
      </div>
    </nav>
  `;
}

function renderCurrentView() {
  if (state.view === "capture") return renderCaptureView();
  if (state.view === "library") return renderLibraryView();
  if (state.view === "review") return renderReviewView();
  if (state.view === "exports") return renderExportsView();
  if (state.view === "settings") return renderSettingsView();
  return renderDashboardView();
}

function renderDashboardView() {
  const data = analytics();
  const recent = state.entries.slice(0, 5);
  return html`
    <section class="dashboard-grid">
      <div class="hero-panel">
        <div>
          <p class="eyebrow">Today</p>
          <h2>${today()} 记录入口</h2>
          <p>上班碎片先记事实，下班再整理判断。每天十分钟也要留下可检索材料。</p>
        </div>
        <div class="quick-actions">
          <button class="primary-button" data-action="start-kind" data-kind="quick">写日常记录</button>
          <button class="secondary-button" data-action="start-kind" data-kind="abnormal">记异常</button>
          <button class="secondary-button" data-action="start-kind" data-kind="question">记问题</button>
          <button class="secondary-button" data-action="start-kind" data-kind="interview">记访谈</button>
        </div>
      </div>

      <section class="metric-grid">
        ${renderMetric("总记录", state.entries.length, "所有沉淀下来的材料")}
        ${renderMetric("近 7 天", data.recent.length, "持续记录强度")}
        ${renderMetric("连续天数", streakDays(), "今天开始往前算")}
        ${renderMetric("待整理内容", data.contentBacklog.length, "可转成小红书/抖音")}
      </section>

      <section class="work-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Recent</p>
            <h2>最近记录</h2>
          </div>
          <button class="text-button" data-action="go-view" data-view="library">查看资料库</button>
        </div>
        ${recent.length ? `<div class="compact-list">${recent.map(renderCompactEntry).join("")}</div>` : renderEmpty("还没有记录，先写一条日常记录。")}
      </section>

      <section class="work-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Signals</p>
            <h2>机会雷达</h2>
          </div>
          <button class="text-button" data-action="go-view" data-view="review">去复盘</button>
        </div>
        ${
          data.opportunities.length
            ? `<div class="opportunity-list">${data.opportunities.map(renderOpportunity).join("")}</div>`
            : renderEmpty("问题、访谈和灵感积累后，这里会自动冒出机会线索。")
        }
      </section>

      <section class="work-panel">
        <p class="eyebrow">Focus</p>
        <h2>当前最该记录的东西</h2>
        <ul class="prompt-list">
          <li>具体鸟种和具体行为，不要只写“正常”。</li>
          <li>异常案例的处理方式和后续结果。</li>
          <li>游客、新手、养鸟人反复问的问题。</li>
          <li>你觉得未来能做成工具、内容或服务的痛点。</li>
        </ul>
      </section>

      <section class="work-panel">
        <p class="eyebrow">Distribution</p>
        <h2>主题分布</h2>
        ${renderTopList("高频鸟种", data.topSpecies)}
        ${renderTopList("高频标签", data.topTags)}
      </section>
    </section>
  `;
}

function renderMetric(label, value, note) {
  return html`
    <article class="metric-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <p>${escapeHtml(note)}</p>
    </article>
  `;
}

function renderCaptureView() {
  const schema = currentSchema();
  return html`
    <section class="capture-layout">
      <div class="capture-main">
        ${renderKindTabs()}
        ${renderRecordForm(schema)}
      </div>
      <aside class="capture-side">
        ${renderTemplatePanel(schema.kind)}
        ${renderFieldGuide(schema)}
      </aside>
    </section>
  `;
}

function renderKindTabs() {
  return html`
    <div class="kind-tabs" aria-label="记录类型">
      ${schemas
        .map(
          (schema) =>
            `<button class="${state.activeKind === schema.kind ? "active" : ""}" data-action="set-kind" data-kind="${schema.kind}">${schema.shortLabel}</button>`
        )
        .join("")}
    </div>
  `;
}

function renderRecordForm(schema) {
  const editing = state.editingId ? state.entries.find((entry) => entry.id === state.editingId) : null;
  const draft = readDraft(schema.kind);
  const values = editing?.kind === schema.kind ? editing.fields : { ...emptyFields(schema), ...(draft.fields || {}) };
  const tags = editing?.kind === schema.kind ? editing.tags.join(" ") : (draft.tags || []).join(" ");
  const images = editing?.kind === schema.kind ? editing.images || [] : [];
  const dateValue = editing?.kind === schema.kind ? editing.date : draft.date || today();
  const pinned = editing?.kind === schema.kind ? Boolean(editing.pinned) : Boolean(draft.pinned);

  return html`
    <section class="form-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">${editing ? "Editing" : "Capture"}</p>
          <h2>${editing ? `编辑：${escapeHtml(schema.label)}` : escapeHtml(schema.label)}</h2>
          <p>${escapeHtml(schema.description)}</p>
        </div>
        ${editing ? `<button class="secondary-button" data-action="cancel-edit" type="button">取消编辑</button>` : ""}
      </div>

      <form id="record-form" class="record-form" data-kind="${schema.kind}">
        <input type="hidden" name="editingId" value="${escapeHtml(editing?.id || "")}" />
        <label class="field">
          <span>日期</span>
          <input type="date" name="date" value="${escapeHtml(dateValue)}" />
        </label>
        ${schema.fields.map((field) => renderField(field, values[field.name])).join("")}
        <label class="field">
          <span>标签</span>
          <input name="tags" value="${escapeHtml(tags)}" placeholder="例：玄凤 异常 内容素材" />
        </label>
        <label class="check-row">
          <input type="checkbox" name="pinned" value="1" ${pinned ? "checked" : ""} />
          <span>置顶这条记录</span>
        </label>
        <label class="field">
          <span>图片</span>
          <input name="images" accept="image/*" multiple type="file" />
          <small>图片会压缩后存入浏览器数据库。适合关键照片，不建议当完整相册。</small>
        </label>
        <div class="image-strip" id="image-strip">${images.map(renderImageFigure).join("")}</div>
        <div class="form-actions">
          <button class="primary-button" type="submit">${editing ? "保存修改" : "保存记录"}</button>
          <button class="secondary-button" type="button" data-action="clear-draft">清空草稿</button>
        </div>
      </form>
    </section>
  `;
}

function renderField(field, value) {
  if (field.type === "textarea") {
    return html`
      <label class="field field-wide">
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
      <div class="field field-wide" data-multiselect="${field.name}">
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
    <figure data-image-id="${escapeHtml(image.id)}">
      <img src="${image.dataUrl}" alt="${escapeHtml(image.name)}" />
      <button type="button" data-action="remove-image" data-image-id="${escapeHtml(image.id)}">删除</button>
    </figure>
  `;
}

function renderTemplatePanel(kind) {
  const items = templates[kind] || [];
  return html`
    <section class="side-panel">
      <p class="eyebrow">Templates</p>
      <h2>快速模板</h2>
      <div class="template-list">
        ${
          items.length
            ? items.map((item, index) => `<button data-action="apply-template" data-template-index="${index}">${escapeHtml(item.name)}</button>`).join("")
            : `<p>这个类型暂时没有模板。</p>`
        }
      </div>
    </section>
  `;
}

function renderFieldGuide(schema) {
  return html`
    <section class="side-panel">
      <p class="eyebrow">Guide</p>
      <h2>这条记录要合格</h2>
      <ul class="prompt-list">
        <li>先写事实，再写判断。</li>
        <li>出现鸟种、对象或场景时尽量写具体。</li>
        <li>能转内容、访谈或产品灵感的地方加标签。</li>
        <li>原始语料可以乱，但观察字段要尽量可检索。</li>
      </ul>
      <div class="field-map">
        ${schema.fields.map((field) => `<span>${escapeHtml(field.label)}</span>`).join("")}
      </div>
    </section>
  `;
}

function renderLibraryView() {
  const entries = filteredEntries();
  return html`
    <section class="library-layout">
      <div class="library-toolbar">
        <div>
          <p class="eyebrow">Library</p>
          <h2>资料库</h2>
        </div>
        <div class="library-filters">
          <input id="search-input" value="${escapeHtml(state.filters.query)}" placeholder="搜索鸟种、问题、标签、原始语料" />
          <select id="kind-filter">
            <option value="all" ${state.filters.kind === "all" ? "selected" : ""}>全部类型</option>
            ${schemas.map((schema) => `<option value="${schema.kind}" ${state.filters.kind === schema.kind ? "selected" : ""}>${schema.label}</option>`).join("")}
            <option value="weekly" ${state.filters.kind === "weekly" ? "selected" : ""}>周复盘</option>
          </select>
          <input id="date-from" type="date" value="${escapeHtml(state.filters.dateFrom)}" />
          <input id="date-to" type="date" value="${escapeHtml(state.filters.dateTo)}" />
          <select id="tag-filter">
            <option value="">全部标签</option>
            ${allTags().map((tag) => `<option value="${escapeHtml(tag)}" ${state.filters.tag === tag ? "selected" : ""}>${escapeHtml(tag)}</option>`).join("")}
          </select>
          <label class="mini-check"><input id="starred-filter" type="checkbox" ${state.filters.starred ? "checked" : ""} /> 只看置顶</label>
        </div>
      </div>
      <div class="result-bar">
        <span>当前筛选：${entries.length} 条</span>
        <div>
          <button class="secondary-button" data-action="reset-filters">重置筛选</button>
          <button class="secondary-button" data-action="export-md">导出当前 MD</button>
          <button class="secondary-button" data-action="copy-gpt-prompt">复制给 GPT 的整理提示</button>
        </div>
      </div>
      ${entries.length ? `<div class="entry-grid">${entries.map(renderEntryCard).join("")}</div>` : renderEmpty("没有符合条件的记录。")}
    </section>
  `;
}

function renderEntryCard(entry) {
  const schema = schemaMap.get(entry.kind);
  const preview = Object.entries(entry.fields || {})
    .filter(([, value]) => fieldText(value).trim())
    .slice(0, 4);
  return html`
    <article class="entry-card ${entry.pinned ? "pinned" : ""}">
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
                <dt>${escapeHtml(fieldLabel(entry.kind, key))}</dt>
                <dd>${escapeHtml(fieldText(value))}</dd>
              </div>
            `
          )
          .join("")}
      </dl>
      ${entry.images?.length ? `<div class="thumbs">${entry.images.slice(0, 3).map((image) => `<img src="${image.dataUrl}" alt="${escapeHtml(image.name)}" />`).join("")}</div>` : ""}
      ${entry.tags?.length ? `<div class="tag-row">${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      <div class="entry-actions">
        <button data-action="view-entry" data-id="${entry.id}">详情</button>
        <button data-action="edit-entry" data-id="${entry.id}">编辑</button>
        <button data-action="toggle-pin" data-id="${entry.id}">${entry.pinned ? "取消置顶" : "置顶"}</button>
        ${entry.kind !== "content" ? `<button data-action="create-content" data-id="${entry.id}">转内容</button>` : ""}
        ${entry.kind !== "idea" ? `<button data-action="create-idea" data-id="${entry.id}">转灵感</button>` : ""}
        <button class="danger" data-action="delete-entry" data-id="${entry.id}">删除</button>
      </div>
    </article>
  `;
}

function renderCompactEntry(entry) {
  const schema = schemaMap.get(entry.kind);
  return html`
    <button class="compact-entry" data-action="view-entry" data-id="${entry.id}">
      <span>${escapeHtml(schema?.shortLabel || entry.kind)}</span>
      <strong>${escapeHtml(entry.title)}</strong>
      <time>${escapeHtml(entry.date)}</time>
    </button>
  `;
}

function renderOpportunity(item) {
  return html`
    <button class="opportunity-item" data-action="view-entry" data-id="${item.entryId}">
      <span>${escapeHtml(item.type)} · ${Math.max(0, Math.round(item.score))}</span>
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.reason)}</p>
    </button>
  `;
}

function renderReviewView() {
  const periodEntries = entriesInLastDays(Number(state.reviewDays || 7));
  const report = buildReviewText(periodEntries);
  return html`
    <section class="review-layout">
      <div class="work-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Review</p>
            <h2>${state.reviewDays} 天复盘</h2>
          </div>
          <select id="review-days">
            <option value="7" ${state.reviewDays === 7 ? "selected" : ""}>近 7 天</option>
            <option value="14" ${state.reviewDays === 14 ? "selected" : ""}>近 14 天</option>
            <option value="30" ${state.reviewDays === 30 ? "selected" : ""}>近 30 天</option>
          </select>
        </div>
        <section class="metric-grid compact">
          ${renderMetric("记录", periodEntries.length, "复盘周期内")}
          ${renderMetric("异常", periodEntries.filter((entry) => entry.kind === "abnormal").length, "案例数量")}
          ${renderMetric("问题", periodEntries.filter((entry) => entry.kind === "question").length, "市场信号")}
          ${renderMetric("灵感", periodEntries.filter((entry) => entry.kind === "idea").length, "产品假设")}
        </section>
        <div class="generated-report">
          <textarea readonly rows="16">${escapeHtml(report)}</textarea>
          <div class="form-actions">
            <button class="primary-button" data-action="copy-review">复制复盘文本</button>
            <button class="secondary-button" data-action="download-review">下载复盘 MD</button>
          </div>
        </div>
      </div>

      <form id="weekly-form" class="form-panel">
        <p class="eyebrow">Save Review</p>
        <h2>保存人工判断</h2>
        <label class="field field-wide">
          <span>这一周期最重要的学习</span>
          <textarea name="reflection" rows="5" required></textarea>
        </label>
        <label class="field field-wide">
          <span>下一个周期重点观察</span>
          <textarea name="focus" rows="4"></textarea>
        </label>
        <label class="field field-wide">
          <span>我现在最可能做的产品/内容方向</span>
          <textarea name="direction" rows="4"></textarea>
        </label>
        <button class="primary-button" type="submit">保存复盘记录</button>
      </form>
    </section>
  `;
}

function buildReviewText(entries) {
  const topSpecies = countTop(entries.map((entry) => entry.fields?.species || entry.fields?.bird));
  const topTags = countTop(entries.flatMap((entry) => entry.tags || []));
  const questions = entries.filter((entry) => entry.kind === "question").slice(0, 6);
  const abnormal = entries.filter((entry) => entry.kind === "abnormal").slice(0, 6);
  const ideas = entries.filter((entry) => entry.kind === "idea").slice(0, 6);
  const content = entries.filter((entry) => entry.kind === "content").slice(0, 6);

  return [
    `# BirdLog ${state.reviewDays} 天复盘`,
    "",
    `日期：${today()}`,
    `记录数：${entries.length}`,
    "",
    "## 1. 本期事实",
    `- 高频鸟种：${topSpecies.length ? topSpecies.map(([name, count]) => `${name}(${count})`).join("、") : "暂无"}`,
    `- 高频标签：${topTags.length ? topTags.map(([name, count]) => `${name}(${count})`).join("、") : "暂无"}`,
    `- 异常案例：${abnormal.length} 条`,
    `- 游客/宠主问题：${questions.length} 条`,
    "",
    "## 2. 值得继续追踪的问题",
    ...(questions.length ? questions.map((entry) => `- ${entry.title}`) : ["- 暂无"]),
    "",
    "## 3. 异常观察案例",
    ...(abnormal.length ? abnormal.map((entry) => `- ${entry.date}｜${entry.title}`) : ["- 暂无"]),
    "",
    "## 4. 内容素材",
    ...(content.length ? content.map((entry) => `- ${entry.title}｜状态：${entry.fields.status || "未整理"}`) : ["- 暂无"]),
    "",
    "## 5. 产品灵感",
    ...(ideas.length ? ideas.map((entry) => `- ${entry.title}｜目标用户：${entry.fields.targetUser || "未写"}`) : ["- 暂无"]),
    "",
    "## 6. 给 GPT 整理时可以追问",
    "- 哪些记录已经足够转成小红书选题？",
    "- 哪些问题背后是养鸟人的高频痛点？",
    "- 哪个产品灵感最适合先做无代码验证？"
  ].join("\n");
}

function renderExportsView() {
  const entries = filteredEntries();
  return html`
    <section class="exports-layout">
      <div class="work-panel">
        <p class="eyebrow">Exports</p>
        <h2>导出和备份</h2>
        <p class="muted">导出范围会跟随资料库筛选条件。需要全量导出时先在资料库重置筛选。</p>
        <div class="export-grid">
          <button class="export-tile" data-action="export-md">
            <strong>Markdown / Obsidian</strong>
            <span>带 YAML front matter，适合放进 Obsidian。</span>
          </button>
          <button class="export-tile" data-action="export-csv">
            <strong>CSV 表格</strong>
            <span>适合后续做统计和人工整理。</span>
          </button>
          <button class="export-tile" data-action="export-json">
            <strong>JSON 备份</strong>
            <span>完整保留字段和图片，可导回 BirdLog。</span>
          </button>
          <button class="export-tile" data-action="copy-gpt-prompt">
            <strong>GPT 整理提示</strong>
            <span>把当前筛选记录整理成可复制给 GPT 的材料。</span>
          </button>
        </div>
      </div>
      <div class="work-panel">
        <p class="eyebrow">Import</p>
        <h2>导入备份</h2>
        <p class="muted">只导入 BirdLog JSON 备份。相同 id 会按更新时间覆盖。</p>
        <input id="import-json-input" type="file" accept="application/json,.json" />
      </div>
      <div class="work-panel">
        <p class="eyebrow">Current Scope</p>
        <h2>当前导出范围</h2>
        <p>${entries.length} 条记录</p>
        ${renderTopList("类型", countTop(entries.map((entry) => schemaMap.get(entry.kind)?.label || entry.kind), 12))}
      </div>
    </section>
  `;
}

function renderSettingsView() {
  const settings = readSettings();
  return html`
    <section class="settings-layout">
      <form id="settings-form" class="form-panel">
        <p class="eyebrow">Settings</p>
        <h2>同步与访问设置</h2>
        <p class="muted">这些配置只保存在当前浏览器，不会写进公开 GitHub 仓库。Mac 和 iPhone 各输入一次即可。</p>
        <label class="field">
          <span>本地访问码</span>
          <input name="accessCode" value="${escapeHtml(settings.accessCode || "")}" placeholder="可选，设置后打开需输入" />
        </label>
        <label class="field">
          <span>Supabase URL</span>
          <input name="supabaseUrl" value="${escapeHtml(settings.supabaseUrl || "")}" placeholder="https://xxxx.supabase.co" />
        </label>
        <label class="field field-wide">
          <span>Supabase anon key</span>
          <input name="supabaseAnonKey" value="${escapeHtml(settings.supabaseAnonKey || "")}" placeholder="eyJ..." />
        </label>
        <label class="field">
          <span>Owner key</span>
          <input name="ownerKey" value="${escapeHtml(settings.ownerKey || "")}" placeholder="自己生成一段随机字符串，Mac 和 iPhone 保持一致" />
        </label>
        <div class="form-actions">
          <button class="primary-button" type="submit">保存设置</button>
          <button class="secondary-button" type="button" data-action="sync">测试同步</button>
        </div>
      </form>
      <section class="work-panel">
        <p class="eyebrow">Health</p>
        <h2>系统状态</h2>
        <div class="health-list">
          <div><span>浏览器数据库</span><strong>${"indexedDB" in window ? "可用" : "不可用"}</strong></div>
          <div><span>网络状态</span><strong>${navigator.onLine ? "在线" : "离线"}</strong></div>
          <div><span>云同步配置</span><strong>${remoteConfigured() ? "已配置" : "未配置"}</strong></div>
          <div><span>本机记录</span><strong>${state.entries.length} 条</strong></div>
        </div>
      </section>
    </section>
  `;
}

function renderGate() {
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
      </section>
    </main>
  `;
}

function renderDetailModal() {
  if (!state.detailId) return "";
  const entry = state.entries.find((item) => item.id === state.detailId);
  if (!entry) return "";
  const schema = schemaMap.get(entry.kind);
  return html`
    <div class="modal-backdrop" data-action="close-detail">
      <article class="detail-modal" role="dialog" aria-modal="true" aria-label="记录详情" data-modal>
        <div class="section-heading">
          <div>
            <p class="eyebrow">${escapeHtml(schema?.label || entry.kind)} · ${escapeHtml(entry.date)}</p>
            <h2>${escapeHtml(entry.title)}</h2>
          </div>
          <button class="icon-button" data-action="close-detail" aria-label="关闭">×</button>
        </div>
        <div class="detail-body">
          ${Object.entries(entry.fields || {})
            .filter(([, value]) => fieldText(value).trim())
            .map(
              ([key, value]) => html`
                <section>
                  <h3>${escapeHtml(fieldLabel(entry.kind, key))}</h3>
                  <p>${escapeHtml(fieldText(value))}</p>
                </section>
              `
            )
            .join("")}
          ${entry.tags?.length ? `<div class="tag-row">${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
          ${entry.images?.length ? `<div class="image-gallery">${entry.images.map((image) => `<img src="${image.dataUrl}" alt="${escapeHtml(image.name)}" />`).join("")}</div>` : ""}
        </div>
        <div class="form-actions">
          <button class="primary-button" data-action="edit-entry" data-id="${entry.id}">编辑</button>
          ${entry.kind !== "content" ? `<button class="secondary-button" data-action="create-content" data-id="${entry.id}">转内容</button>` : ""}
          ${entry.kind !== "idea" ? `<button class="secondary-button" data-action="create-idea" data-id="${entry.id}">转灵感</button>` : ""}
          <button class="secondary-button" data-action="duplicate-entry" data-id="${entry.id}">复制一条</button>
        </div>
      </article>
    </div>
  `;
}

function renderTopList(title, items) {
  return html`
    <div class="top-list">
      <h3>${escapeHtml(title)}</h3>
      ${
        items.length
          ? `<ul>${items.map(([name, count]) => `<li><span>${escapeHtml(name)}</span><strong>${count}</strong></li>`).join("")}</ul>`
          : `<p class="muted">暂无数据</p>`
      }
    </div>
  `;
}

function renderEmpty(message) {
  return `<div class="empty-state">${escapeHtml(message)}</div>`;
}

async function saveRecordForm(form) {
  try {
    if (!form.reportValidity()) return;
    const schema = schemaMap.get(form.dataset.kind);
    if (!schema) return;
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
    const files = fileInput?.files ? [...fileInput.files].slice(0, 8) : [];
    const newImages = [];
    for (const file of files) {
      newImages.push(await compressImage(file));
    }

    const title = fieldText(fields[schema.primaryField]).slice(0, 56) || `${schema.label} ${formData.get("date") || today()}`;
    const entry = {
      id: editing?.id || createId(),
      kind: schema.kind,
      date: String(formData.get("date") || today()),
      title,
      tags: parseTags(formData.get("tags")),
      fields,
      images: [...retainedImages, ...newImages],
      pinned: Boolean(formData.get("pinned")),
      createdAt: editing?.createdAt || nowIso(),
      updatedAt: nowIso()
    };

    await saveEntry(entry);
    clearDraft(schema.kind);
    notify(editing ? "修改已保存。" : "记录已保存。");
  } catch (error) {
    console.error(error);
    notify(`保存失败：${error.message || "未知错误"}`);
  }
}

async function saveWeeklyForm(form) {
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const periodEntries = entriesInLastDays(Number(state.reviewDays || 7));
  const report = buildReviewText(periodEntries);
  const entry = {
    id: createId(),
    kind: "weekly",
    date: today(),
    title: `复盘 ${today()} · 近 ${state.reviewDays} 天`,
    tags: ["复盘", "周复盘"],
    fields: {
      reflection: String(formData.get("reflection") || ""),
      focus: String(formData.get("focus") || ""),
      direction: String(formData.get("direction") || ""),
      periodDays: String(state.reviewDays),
      recordCount: String(periodEntries.length),
      autoReport: report
    },
    images: [],
    pinned: false,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  await saveEntry(entry);
  notify("复盘已保存。");
}

function readRecordDraftFromForm(form) {
  const schema = schemaMap.get(form.dataset.kind);
  if (!schema) return null;
  const data = new FormData(form);
  const fields = {};
  for (const field of schema.fields) {
    fields[field.name] = field.type === "multiselect" ? data.getAll(field.name).map(String) : String(data.get(field.name) || "");
  }
  return {
    date: String(data.get("date") || today()),
    tags: parseTags(data.get("tags")),
    fields,
    pinned: Boolean(data.get("pinned"))
  };
}

function applyTemplate(index) {
  const schema = currentSchema();
  const template = templates[schema.kind]?.[index];
  if (!template) return;
  const draft = readDraft(schema.kind);
  writeDraft(schema.kind, {
    date: draft.date || today(),
    fields: { ...emptyFields(schema), ...(draft.fields || {}), ...(template.fields || {}) },
    tags: unique([...(draft.tags || []), ...(template.tags || [])]),
    pinned: Boolean(draft.pinned)
  });
  render();
}

async function duplicateEntry(entryId) {
  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) return;
  await saveEntry({
    ...entry,
    id: createId(),
    title: `${entry.title}（副本）`,
    date: today(),
    pinned: false,
    createdAt: nowIso(),
    updatedAt: nowIso()
  });
  notify("已复制一条新记录。");
}

async function togglePin(entryId) {
  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) return;
  await saveEntry({ ...entry, pinned: !entry.pinned, updatedAt: nowIso() });
}

async function createContentFromEntry(entryId) {
  const source = state.entries.find((entry) => entry.id === entryId);
  if (!source) return;
  const draft = buildContentDraft(source);
  const entry = {
    id: createId(),
    kind: "content",
    date: today(),
    title: `内容素材：${source.title}`,
    tags: unique(["内容素材", ...source.tags]),
    fields: {
      topic: source.title,
      source: sourceToText(source),
      contentType: source.kind === "question" ? "新手科普" : "未定",
      titles: draft.titles,
      draft: draft.body,
      platform: "小红书",
      status: "可写",
      nextStep: "补图、压缩成 3 个要点，再决定是否发布。"
    },
    images: source.images || [],
    pinned: false,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  await saveEntry(entry);
  state.view = "capture";
  state.activeKind = "content";
  notify("已生成内容素材。");
}

async function createIdeaFromEntry(entryId) {
  const source = state.entries.find((entry) => entry.id === entryId);
  if (!source) return;
  const entry = {
    id: createId(),
    kind: "idea",
    date: today(),
    title: `产品灵感：${source.title}`,
    tags: unique(["产品灵感", ...source.tags]),
    fields: {
      ideaTitle: source.title,
      source: sourceToText(source),
      targetUser: source.kind === "interview" ? source.title : "养鸟新手/宠物鹦鹉饲主",
      pain: source.fields.painPoints || source.fields.question || source.fields.observation || "",
      alternatives: "",
      firstExperiment: "先用访谈或手工表格验证，不急着写完整产品。",
      monetization: "",
      complexity: "",
      judgment: "",
      status: "想法"
    },
    images: source.images || [],
    pinned: false,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  await saveEntry(entry);
  state.view = "capture";
  state.activeKind = "idea";
  notify("已生成产品灵感。");
}

function buildContentDraft(entry) {
  const facts = Object.entries(entry.fields || {})
    .filter(([, value]) => fieldText(value).trim())
    .slice(0, 6)
    .map(([key, value]) => `${fieldLabel(entry.kind, key)}：${fieldText(value)}`);
  return {
    titles: [
      `在鸟舍才发现：${entry.title}`,
      `养鹦鹉新手容易忽略的一个细节`,
      `从一线观察看宠物鹦鹉照护`
    ].join("\n"),
    body: [
      "开头钩子：",
      `今天在鸟舍遇到一个很适合新手了解的细节：${entry.title}`,
      "",
      "事实材料：",
      ...facts.map((item) => `- ${item}`),
      "",
      "可以展开的三个点：",
      "1. 这个现象具体是什么，不要先下结论。",
      "2. 新手为什么容易误解或忽略。",
      "3. 下次观察/照护时可以怎么做。",
      "",
      "结尾互动：",
      "你们养鸟时有没有遇到过类似情况？"
    ].join("\n")
  };
}

function sourceToText(entry) {
  return [
    `${entry.date}｜${entry.title}`,
    "",
    ...Object.entries(entry.fields || {})
      .filter(([, value]) => fieldText(value).trim())
      .map(([key, value]) => `${fieldLabel(entry.kind, key)}：${fieldText(value)}`)
  ].join("\n");
}

function entriesToMarkdown(entries) {
  return entries
    .map((entry) => {
      const tags = (entry.tags || []).map((tag) => `"${String(tag).replaceAll('"', '\\"')}"`).join(", ");
      const species = fieldText(entry.fields?.species || entry.fields?.bird);
      const yaml = [
        "---",
        `id: "${entry.id}"`,
        `date: "${entry.date}"`,
        `kind: "${entry.kind}"`,
        `title: "${entry.title.replaceAll('"', '\\"')}"`,
        `tags: [${tags}]`,
        species ? `species: "${species.replaceAll('"', '\\"')}"` : "",
        entry.pinned ? "pinned: true" : "",
        "---"
      ]
        .filter(Boolean)
        .join("\n");
      const body = Object.entries(entry.fields || {})
        .filter(([, value]) => fieldText(value).trim())
        .map(([key, value]) => `## ${fieldLabel(entry.kind, key)}\n\n${fieldText(value)}`)
        .join("\n\n");
      const images = entry.images?.length ? `\n\n## 图片\n${entry.images.map((image) => `- ${image.name}`).join("\n")}` : "";
      return `${yaml}\n\n# ${entry.title}\n\n${body}${images}\n`;
    })
    .join("\n---\n\n");
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function entriesToCsv(entries) {
  const headers = ["id", "kind", "date", "title", "tags", "fields", "pinned", "createdAt", "updatedAt"];
  const rows = entries.map((entry) => [
    entry.id,
    entry.kind,
    entry.date,
    entry.title,
    (entry.tags || []).join("|"),
    JSON.stringify(entry.fields || {}),
    entry.pinned ? "true" : "false",
    entry.createdAt,
    entry.updatedAt
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function gptPrompt(entries) {
  return [
    "你是我的鸟舍学习与宠物鹦鹉创业研究助手。下面是我从 BirdLog 导出的原始记录。",
    "请你帮我完成四件事：",
    "1. 按主题整理成结构化笔记，保留事实和我的判断，不要编造。",
    "2. 提炼可以发布在小红书/抖音的内容选题，并给出标题备选。",
    "3. 找出养鸟人痛点、潜在工具需求、寄养/记录工具机会。",
    "4. 告诉我下一周最值得继续观察和访谈的问题。",
    "",
    "原始记录如下：",
    "",
    entriesToMarkdown(entries)
  ].join("\n");
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

async function copyText(text, fallbackFilename) {
  try {
    await navigator.clipboard.writeText(text);
    notify("已复制到剪贴板。");
  } catch {
    downloadText(fallbackFilename, text);
    notify("浏览器不允许复制，已改为下载文本文件。");
  }
}

async function importJsonFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const entries = Array.isArray(parsed) ? parsed : parsed.entries;
  if (!Array.isArray(entries)) throw new Error("JSON 格式不正确，找不到 entries 数组。");
  const normalized = entries.map(normalizeEntry);
  const merged = mergeEntries(state.entries, normalized);
  for (const entry of merged) {
    await putEntry(entry);
  }
  state.entries = merged;
  notify(`导入完成：当前共 ${merged.length} 条记录。`);
}

function updateFiltersFromDom() {
  state.filters.query = document.querySelector("#search-input")?.value || state.filters.query;
  state.filters.kind = document.querySelector("#kind-filter")?.value || state.filters.kind;
  state.filters.dateFrom = document.querySelector("#date-from")?.value || "";
  state.filters.dateTo = document.querySelector("#date-to")?.value || "";
  state.filters.tag = document.querySelector("#tag-filter")?.value || "";
  state.filters.starred = Boolean(document.querySelector("#starred-filter")?.checked);
}

async function handleClick(event) {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "go-view") {
    state.view = button.dataset.view || "dashboard";
    state.detailId = null;
    render();
    return;
  }

  if (action === "start-kind") {
    state.view = "capture";
    state.activeKind = button.dataset.kind || "quick";
    state.editingId = null;
    render();
    return;
  }

  if (action === "set-kind") {
    state.activeKind = button.dataset.kind || "quick";
    state.editingId = null;
    render();
    return;
  }

  if (action === "sync") {
    await syncNow();
    return;
  }

  if (action === "lock-app") {
    localStorage.removeItem(LOCK_KEY);
    render();
    return;
  }

  if (action === "cancel-edit") {
    state.editingId = null;
    render();
    return;
  }

  if (action === "clear-draft") {
    clearDraft(state.activeKind);
    render();
    return;
  }

  if (action === "apply-template") {
    applyTemplate(Number(button.dataset.templateIndex || 0));
    return;
  }

  if (action === "remove-image") {
    button.closest("figure")?.remove();
    return;
  }

  if (action === "view-entry") {
    state.detailId = button.dataset.id || "";
    render();
    return;
  }

  if (action === "close-detail") {
    if (event.target.closest("[data-modal]") && !event.target.closest(".icon-button")) return;
    state.detailId = null;
    render();
    return;
  }

  if (action === "edit-entry") {
    const entry = state.entries.find((item) => item.id === button.dataset.id);
    if (!entry) return;
    state.view = "capture";
    state.activeKind = entry.kind;
    state.editingId = entry.id;
    state.detailId = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
    render();
    return;
  }

  if (action === "delete-entry") {
    await removeEntry(button.dataset.id);
    return;
  }

  if (action === "duplicate-entry") {
    await duplicateEntry(button.dataset.id);
    return;
  }

  if (action === "toggle-pin") {
    await togglePin(button.dataset.id);
    return;
  }

  if (action === "create-content") {
    await createContentFromEntry(button.dataset.id);
    return;
  }

  if (action === "create-idea") {
    await createIdeaFromEntry(button.dataset.id);
    return;
  }

  if (action === "reset-filters") {
    state.filters = { query: "", kind: "all", dateFrom: "", dateTo: "", tag: "", starred: false };
    render();
    return;
  }

  if (action === "export-md") {
    downloadText(`birdlog-${today()}.md`, entriesToMarkdown(filteredEntries()), "text/markdown;charset=utf-8");
    return;
  }

  if (action === "export-csv") {
    downloadText(`birdlog-${today()}.csv`, entriesToCsv(filteredEntries()), "text/csv;charset=utf-8");
    return;
  }

  if (action === "export-json") {
    downloadText(
      `birdlog-backup-${today()}.json`,
      JSON.stringify({ app: "BirdLog", version: APP_VERSION, exportedAt: nowIso(), entries: filteredEntries() }, null, 2),
      "application/json;charset=utf-8"
    );
    return;
  }

  if (action === "copy-gpt-prompt") {
    await copyText(gptPrompt(filteredEntries()), `birdlog-gpt-prompt-${today()}.md`);
    return;
  }

  if (action === "copy-review") {
    await copyText(buildReviewText(entriesInLastDays(Number(state.reviewDays || 7))), `birdlog-review-${today()}.md`);
    return;
  }

  if (action === "download-review") {
    downloadText(`birdlog-review-${today()}.md`, buildReviewText(entriesInLastDays(Number(state.reviewDays || 7))), "text/markdown;charset=utf-8");
  }
}

function handleInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const form = target.closest("#record-form");
  if (form instanceof HTMLFormElement) {
    const draft = readRecordDraftFromForm(form);
    if (draft) writeDraft(form.dataset.kind, draft);
    if (target.closest(".chip")) {
      target.closest(".chip").classList.toggle("selected", target.checked);
    }
  }

  if (target.id === "search-input") {
    updateFiltersFromDom();
    render();
  }
}

function handleChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const form = target.closest("#record-form");
  if (form instanceof HTMLFormElement) {
    const draft = readRecordDraftFromForm(form);
    if (draft) writeDraft(form.dataset.kind, draft);
  }

  if (["kind-filter", "date-from", "date-to", "tag-filter", "starred-filter"].includes(target.id)) {
    updateFiltersFromDom();
    render();
  }

  if (target.id === "review-days") {
    state.reviewDays = Number(target.value || 7);
    render();
  }

  if (target.id === "import-json-input" && target.files?.[0]) {
    void importJsonFile(target.files[0]).catch((error) => notify(`导入失败：${error.message || "未知错误"}`));
  }
}

async function handleSubmit(event) {
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
    state.syncMessage = "设置已保存。";
    notify("设置已保存。");
    return;
  }

  if (form.id === "record-form") {
    event.preventDefault();
    await saveRecordForm(form);
    return;
  }

  if (form.id === "weekly-form") {
    event.preventDefault();
    await saveWeeklyForm(form);
  }
}

async function init() {
  document.addEventListener("click", (event) => void handleClick(event));
  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleChange);
  document.addEventListener("submit", (event) => void handleSubmit(event));
  await clearOldServiceWorkers();
  state.entries = await getAllEntries();
  render();
}

async function clearOldServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    // Local recording should not depend on PWA cache cleanup succeeding.
  }
}

init();
