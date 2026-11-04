/* ================= CẤU HÌNH ================= */
const SUBJECTS = {
  ls: { name: "Lịch sử & Địa lí", short: "Sử – Địa", c: "var(--c-ls)" },
  kh: { name: "Khoa học tự nhiên", short: "KHTN", c: "var(--c-kh)" },
  cn: { name: "Công nghệ", short: "Công nghệ", c: "var(--c-cn)" },
  gd: { name: "Giáo dục công dân", short: "GDCD", c: "var(--c-gd)" },
  th: { name: "Tin học", short: "Tin học", c: "var(--c-th)" },
};
const MODES = {
  bai: { name: "Ôn bài nào", desc: "20 câu · bài đó + ôn lại bài trước" },
  kttx: { name: "Kiểm tra thường xuyên", desc: "20 câu · cộng dồn các bài đã học", need: { mc: 14, tf: 3, sa: 3 }, adv: 2 },
  gk: { name: "Ôn giữa kì", desc: "25 câu · nửa đầu học kì", need: { mc: 18, tf: 4, sa: 3 }, adv: 2 },
  ck: { name: "Ôn cuối kì", desc: "30 câu · cả học kì", need: { mc: 22, tf: 4, sa: 4 }, adv: 3 },
  redo: { name: "Làm lại câu sai", desc: "" },
  daily: { name: "Ôn hằng ngày", desc: "" },
};
const PASS = 5; // điểm tối thiểu để hoàn thành một bài
// Bài đã học trên lớp (mặc định do phụ huynh báo ngày 31/10/2026); chỉnh được trên trang.
const LEARNED_DEFAULT = { ls_s: "s8", ls_d: "d6", kh: "k13", cn: "c3", gd: "g3", th: "t4" };
const TRACKS = { ls: [["ls_s", "Lịch sử"], ["ls_d", "Địa lí"]], kh: [["kh", ""]], cn: [["cn", ""]], gd: [["gd", ""]], th: [["th", ""]] };
const LESSON_TOTAL = 20; // số câu một lượt ôn theo bài
const LESSON_OWN_MAX = 14; // tối đa số câu của chính bài đó, còn lại ôn bài trước
const EXAM_MIN = 45; // phút làm bài cho mỗi đề ôn giữa kì (tab Đề cương)
const EXAM_MIN_BY = { ls: 60 }; // Sử – Địa: 60 phút theo đề cương
const exMin = (s) => (s && EXAM_MIN_BY[s.subj]) || EXAM_MIN;
const QSEC = 60; // giây tối đa cho câu chọn đáp án và trả lời ngắn
const QSEC_TF = 120; // giây tối đa cho câu đúng – sai (4 ý)
const qSec = (q) => (q && q.t === "tf" ? QSEC_TF : QSEC);
const restSec = (s) => s.qs.reduce((n, q, j) => n + (j === s.i ? 0 : s.left ? Math.max(0, Math.ceil(s.left[j] / 1000)) : j > s.i ? qSec(q) : 0), 0);
const TYPE_LABEL = { mc: "Chọn 1 đáp án đúng", tf: "Chọn Đúng hoặc Sai cho từng ý", sa: "Điền đáp án ngắn" };
const BY_ID = Object.fromEntries(BANK.map((q) => [q.id, q]));
const LES = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
const LS_KEY = "von6-state-v1";

/* ================= LƯU TRỮ ================= */
const fresh = () => ({ v: 2, q: {}, hist: [], pr: {}, done: {}, hk: 1, learned: {} });
let store = fresh();
try { const raw = localStorage.getItem(LS_KEY); if (raw) store = Object.assign(fresh(), JSON.parse(raw)); } catch (e) {}
if (!store.done) store.done = {};
if (store.hk !== 1 && store.hk !== 2) store.hk = 1;
let cloudRef = null, cloudBusy = false, cloudAgain = false, lastRemote = 0;

function merge(a, b) {
  const out = fresh();
  const seen = new Set();
  [...(a.hist || []), ...(b.hist || [])].forEach((h) => { if (!seen.has(h.t)) { seen.add(h.t); out.hist.push(h); } });
  out.hist.sort((x, y) => x.t - y.t);
  out.hist = out.hist.slice(-500);
  const aq = a.q || {}, bq = b.q || {};
  new Set([...Object.keys(aq), ...Object.keys(bq)]).forEach((id) => {
    const x = aq[id], y = bq[id];
    out.q[id] = !x ? y : !y ? x : (y.n > x.n || (y.n === x.n && y.l > x.l)) ? y : x;
  });
  const ap = a.pr || {}, bp = b.pr || {};
  Object.keys({ ...ap, ...bp }).forEach((k) => (out.pr[k] = Math.max(ap[k] || 0, bp[k] || 0)));
  const ad = a.done || {}, bd = b.done || {};
  Object.keys({ ...ad, ...bd }).forEach((k) => (out.done[k] = Math.max(ad[k] || 0, bd[k] || 0)));
  out.hk = b.hk || a.hk || 1;
  const al = a.learned || {}, bl = b.learned || {};
  out.learned = { ...al, ...bl };
  if (a.learnedAt > (b.learnedAt || 0)) out.learned = { ...bl, ...al };
  out.learnedAt = Math.max(a.learnedAt || 0, b.learnedAt || 0);
  return out;
}
function save() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {}
  pushCloud();
  pushSheet();
  pushForm();
}
/* ===== Bản file HTML trên máy của Gấu: tự gửi kết quả vào Google Biểu mẫu của mẹ ===== */
const FILE_MODE = !GAS_PRE() && !(window.claude && window.claude.use) && !/claude/.test(location.hostname);
function GAS_PRE() { return typeof google !== "undefined" && google.script && google.script.run; }
const FORM_POST = "https://docs.google.com/forms/d/e/1FAIpQLSdw9b4v4jBaLm-3cDX38pw3TDPWLr622xXY-EXxmwR0dDXnBA/formResponse";
const FORM_TXT = "entry.1182834105", FORM_DATA = "entry.295419570";
const FORM_SENT = "von6-form-sent";
let formBusy = false;
function formText(h) {
  const d = new Date(h.t), p2 = (n) => String(n).padStart(2, "0");
  const wrong = (h.w || []).map((id) => BY_ID[id] ? "  - " + BY_ID[id].q.slice(0, 140) : "").filter(Boolean);
  const es = (h.es || []).map((x, k) => x.trim() ? "  Câu " + (k + 1) + ": " + x.trim() : "").filter(Boolean);
  return `${p2(d.getHours())}:${p2(d.getMinutes())} ${p2(d.getDate())}/${p2(d.getMonth() + 1)} · ${SUBJECTS[h.s] ? SUBJECTS[h.s].name : ""} · ${histLabel(h)}\nĐiểm ${h.esc != null ? `trắc nghiệm ${fmt2(h.tnp)}, tự luận ${fmt2(h.esc)}, tổng ${fmt2(scoreOf(h))}` : fmt1(h.sc)} (${h.k}/${h.tot} câu đúng) · làm ${mmss(h.dur || h.d || 0)}`
    + (wrong.length ? "\nCâu sai:\n" + wrong.join("\n") : "") + (es.length ? "\nTự luận:\n" + es.join("\n") : "");
}
async function postForm(fields) {
  try { await fetch(FORM_POST, { method: "POST", mode: "no-cors", body: new URLSearchParams(fields) }); return true; } catch (e) { return false; }
}
async function pushForm() {
  if (!FILE_MODE || formBusy) return;
  let sent = 0; try { sent = +localStorage.getItem(FORM_SENT) || 0; } catch (e) {}
  const hs = store.hist.filter((h) => h.t > sent);
  if (!hs.length) return;
  formBusy = true;
  const base = store.hist.length - hs.length;
  const q = {}; Object.entries(store.q).forEach(([id, st]) => { if (st.l > base) q[id] = st; });
  let ok = true;
  for (const h of hs) {
    ok = await postForm({ [FORM_TXT]: formText(h), [FORM_DATA]: JSON.stringify({ v: 1, hist: [h], q: h === hs[hs.length - 1] ? q : {}, done: store.done }) });
    if (!ok) break;
    try { localStorage.setItem(FORM_SENT, String(h.t)); } catch (e) {}
  }
  formBusy = false;
  setSync(ok ? "form" : "formwait");
  if (!ok) setTimeout(pushForm, 30000);
}
window.addEventListener("online", () => pushForm());
/* ===== Bản chạy trên Google (Apps Script): tự ghi kết quả vào Google Sheets của mẹ ===== */
const GAS = typeof google !== "undefined" && google.script && google.script.run ? google.script.run : null;
const SHEET_SENT = "von6-sheet-sent";
let sheetBusy = false, sheetAgain = false;
function sheetRow(h) {
  const d = new Date(h.t), p2 = (n) => String(n).padStart(2, "0");
  const wrong = (h.w || []).map((id) => BY_ID[id] ? "• " + BY_ID[id].q.slice(0, 120) : "").filter(Boolean).join("\n");
  const es = (h.es || []).map((x, k) => x.trim() ? "Câu " + (k + 1) + ": " + x.trim() : "").filter(Boolean).join("\n\n");
  return [`${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`,
    SUBJECTS[h.s] ? SUBJECTS[h.s].name : "", MODES[h.m] ? MODES[h.m].name : h.m, histLabel(h), h.sc, h.k + "/" + h.tot,
    mmss(h.dur || h.d || 0), wrong, es, h.t];
}
function pushSheet() {
  if (!GAS) return;
  if (sheetBusy) { sheetAgain = true; return; }
  let sent = 0; try { sent = +localStorage.getItem(SHEET_SENT) || 0; } catch (e) {}
  const hs = store.hist.filter((h) => h.t > sent);
  const last = store.hist.length ? store.hist[store.hist.length - 1].t : 0;
  sheetBusy = true;
  google.script.run
    .withSuccessHandler(() => { try { localStorage.setItem(SHEET_SENT, String(last)); } catch (e) {} sheetBusy = false; setSync("sheet"); if (sheetAgain) { sheetAgain = false; pushSheet(); } })
    .withFailureHandler(() => { sheetBusy = false; setSync("sheetwait"); setTimeout(pushSheet, 30000); })
    .saveResult(hs.map(sheetRow), JSON.stringify(store));
}
function initSheet() {
  setSync("sheetwait");
  google.script.run
    .withSuccessHandler((txt) => {
      if (txt) { try { const remote = JSON.parse(txt); const n = store.hist.length; store = merge(store, remote); try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {} if (store.hist.length !== n) { if (view === "home") renderHome(); if (view === "stats") renderStats(); } } catch (e) {} }
      pushSheet();
    })
    .withFailureHandler(() => setSync("sheetwait"))
    .loadState();
}
/* ===== Máy của mẹ (trên Claude): đọc kết quả của Gấu từ Google Sheets qua kết nối Google Sheets ===== */
const SHEET_URL_KEY = "von6-sheet-id";
let sheetId = "1oWPCYDnhgTMtExyPe1QrhJ-uaKI61wsb-tu5_i1I5C0"; try { const v = localStorage.getItem(SHEET_URL_KEY); if (v) sheetId = v; } catch (e) {}
let sheetStatus = "", sheetSeen = 0, sheetUnwatch = null, mcpNS = null;
const parseSheetId = (t) => { const m = String(t).match(/\/d\/([A-Za-z0-9_-]{20,})/) || String(t).trim().match(/^([A-Za-z0-9_-]{20,})$/); return m ? m[1] : ""; };
function valuesOf(payload) {
  if (!payload) return null;
  if (typeof payload === "string") { try { payload = JSON.parse(payload); } catch (e) { return null; } }
  if (Array.isArray(payload.values)) return payload.values;
  for (const k of Object.keys(payload)) { const v = payload[k]; if (v && typeof v === "object") { const r = valuesOf(v); if (r) return r; } }
  return null;
}
function applySheetState(rows) {
  let remote = fresh(), n = 0;
  rows.forEach((r) => { try { const d = JSON.parse(String(r[0] || "")); remote = merge(remote, { hist: d.hist || [], q: d.q || {}, done: d.done || {} }); n++; } catch (e) {} });
  if (!n) { sheetStatus = "empty"; if (view === "stats") renderStats(); return; }
  const fp = (x) => (x.hist || []).length + "|" + ((x.hist || []).slice(-1)[0] || {}).t;
  const merged = merge(store, remote);
  sheetStatus = "ok"; sheetSeen = Date.now();
  if (fp(merged) !== fp(store)) {
    store = merged; save();
    if (view === "home") { const y = window.scrollY; renderHome(); window.scrollTo(0, y); }
  }
  if (view === "stats") { const y = window.scrollY; renderStats(); window.scrollTo(0, y); }
}
function watchSheet() {
  if (!mcpNS || !sheetId) return;
  if (sheetUnwatch) { sheetUnwatch(); sheetUnwatch = null; }
  sheetStatus = "loading";
  sheetUnwatch = mcpNS.watchTool("Google Sheets", "get_values", { spreadsheetId: sheetId, range: "C2:C5000" }, (ev) => {
    if (ev.type === "data") { const v = valuesOf(ev.result.payload); if (v) applySheetState(v); else { sheetStatus = "empty"; if (view === "stats") renderStats(); } return; }
    const c = ev.error && ev.error.code;
    sheetStatus = c === "needs_reauth" ? "reauth" : c === "server_not_connected" || c === "selection_required" ? "noconn" : c === "not_in_manifest" || c === "approval_required" ? "denied" : c === "tool_error" ? "bad" : "later";
    if (view === "stats") { const y = window.scrollY; renderStats(); window.scrollTo(0, y); }
  }, { refetchInterval: 60000 });
}
async function initSheetReader() {
  if (!window.claude || !window.claude.use) return;
  try { mcpNS = await window.claude.use("mcp"); } catch (e) { mcpNS = null; }
  if (mcpNS && sheetId) watchSheet();
}
const SHEET_MSG = { loading: "Đang đọc bảng tính…", ok: "", empty: "Bảng tính chưa có kết quả nào của Gấu.", bad: "Không đọc được bảng tính. Mẹ kiểm tra lại link, và tài khoản Google đang kết nối với Claude có quyền xem bảng tính này.", reauth: "Kết nối Google Sheets đã hết hạn. Mẹ kết nối lại trong Cài đặt > Kết nối của Claude.", noconn: "Chưa có kết nối Google Sheets. Mẹ thêm trong Cài đặt > Kết nối của Claude.", denied: "Trang chưa được phép đọc Google Sheets. Mẹ bấm Kết nối lại để cho phép.", later: "Tạm thời chưa đọc được bảng tính, trang sẽ tự thử lại." };
async function pushCloud() {
  if (!cloudRef) return;
  if (cloudBusy) { cloudAgain = true; return; }
  cloudBusy = true;
  try {
    const snap = await cloudRef.get(); // gộp dữ liệu từ máy khác trước khi ghi, tránh ghi đè
    if (snap.exists) { try { store = merge(JSON.parse(snap.data().state || "{}"), store); } catch (e) {} }
    try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {}
    await cloudRef.set({ state: JSON.stringify(store), updated: Date.now() }); setSync("cloud");
  }
  catch (e) { setSync("local"); }
  cloudBusy = false;
  if (cloudAgain) { cloudAgain = false; pushCloud(); }
}
let syncKind = "local";
function setSync(kind) {
  syncKind = kind;
  const el = document.getElementById("sync");
  if (!el) return;
  el.textContent = kind === "form" ? "Đã gửi kết quả cho mẹ" : kind === "formwait" ? "Chưa có mạng, sẽ gửi kết quả cho mẹ sau" : kind === "sheet" ? "Đã gửi kết quả cho mẹ" : kind === "sheetwait" ? "Đang chờ mạng để gửi kết quả cho mẹ" : kind === "cloud" ? "Đã lưu vào tài khoản" : "Đang lưu trên máy này";
  el.dataset.kind = kind;
}
async function initCloud() {
  if (GAS) { initSheet(); return; }
  await initCloudInner();
}
async function initCloudInner() {
  if (!window.claude || !window.claude.use) { setSync("local"); pushForm(); return; }
  try {
    const [user, db] = await Promise.all([window.claude.use("user"), window.claude.use("db")]);
    if (!user || !db) { setSync("local"); return; }
    const uid = await user.id();
    if (!uid) { setSync("local"); return; }
    cloudRef = db.doc("data/users/" + uid + "/progress");
    const snap = await cloudRef.get();
    if (snap.exists) {
      let remote = fresh();
      try { remote = Object.assign(fresh(), JSON.parse(snap.data().state || "{}")); } catch (e) {}
      const before = JSON.stringify([store.hist.length, Object.keys(store.done).length]);
      store = merge(store, remote);
      try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {}
      if (store.hist.length !== (remote.hist || []).length || Object.keys(store.done).length !== Object.keys(remote.done || {}).length) pushCloud();
      if (before !== JSON.stringify([store.hist.length, Object.keys(store.done).length])) { if (view === "home") renderHome(); if (view === "stats") renderStats(); }
    } else if (store.hist.length) pushCloud();
    setSync("cloud");
    // Nghe thay đổi từ máy khác (máy của con / máy của mẹ) để cập nhật ngay
    cloudRef.onSnapshot((sn) => {
      if (!sn.exists) return;
      let remote; try { remote = JSON.parse(sn.data().state || "{}"); } catch (e) { return; }
      const fp = (x) => (x.hist || []).length + "|" + ((x.hist || []).slice(-1)[0] || {}).t + "|" + Object.keys(x.done || {}).length;
      const merged = merge(store, remote);
      if (fp(merged) !== fp(store)) {
        store = merged;
        try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {}
        lastRemote = Date.now();
        if (view === "home") { const y = window.scrollY; renderHome(); window.scrollTo(0, y); }
        if (view === "stats") renderStats();
      }
    }, () => {});
  } catch (e) { setSync("local"); }
}

/* ================= TIỆN ÍCH ================= */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const dayKey = (t) => { const d = new Date(t); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const fmt1 = (x) => (Math.round(x * 10) / 10).toLocaleString("vi-VN");
const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lesNum = (l) => { const m = l.title.match(/^Bài (\d+)/); return m ? m[1] : "?"; };
const lesName = (l) => l.title.replace(/^Bài \d+\.\s*/, "");
const lesShort = (l) => (l.s === "ls" ? (l.part === "Lịch sử" ? "Sử " : "Địa ") : "") + "Bài " + lesNum(l);
const hkStages = (mode, hk) => (mode === "gk" ? [hk === 1 ? 1 : 3] : hk === 1 ? [1, 2] : [3, 4]);
const doneLessons = (subj) => LESSONS.filter((l) => l.s === subj && (store.done[l.id] || 0) >= PASS);
const trackOf = (l) => (l.s === "ls" ? (l.part === "Lịch sử" ? "ls_s" : "ls_d") : l.s);
const learnedPtr = (tr) => LEARNED_DEFAULT[tr] || "";
const studied = (l) => (store.done[l.id] || 0) > 0 || store.hist.some((h) => h.les === l.id);
function isLearned(l) {
  const ptr = learnedPtr(trackOf(l));
  if (!ptr) return false;
  const list = LESSONS.filter((x) => trackOf(x) === trackOf(l));
  return list.findIndex((x) => x.id === l.id) <= list.findIndex((x) => x.id === ptr);
}
const kttxLessons = (subj) => LESSONS.filter((l) => l.s === subj && (isLearned(l) || studied(l)));
// Phạm vi mặc định của từng kiểu kiểm tra: KTTX = mọi bài đã học; giữa kì / cuối kì = bài đã học trong phạm vi học kì
function scopeLessons(mode, subj) {
  if (mode === "kttx") return kttxLessons(subj);
  const st = hkStages(mode, store.hk);
  const range = LESSONS.filter((l) => l.s === subj && st.includes(l.k));
  if (mode === "gk" && store.hk === 1) return range; // giữa kì I: đúng phạm vi kiểm tra của trường
  const learned = range.filter((l) => isLearned(l) || studied(l));
  return learned.length ? learned : range;
}
const DC_SETS = { gd: typeof GD_GK_SETS !== "undefined" ? GD_GK_SETS : null, ls: typeof LS_GK_SETS !== "undefined" ? LS_GK_SETS : null, th: typeof TH_GK_SETS !== "undefined" ? TH_GK_SETS : null, cn: typeof CN_GK_SETS !== "undefined" ? CN_GK_SETS : null, kh: typeof KH_GK_SETS !== "undefined" ? KH_GK_SETS : null };
const DC_NAME = { gd: "Giáo dục công dân", ls: "Lịch sử và Địa lí", th: "Tin học", cn: "Công nghệ", kh: "Khoa học tự nhiên" };
const hasDC = (mode, subj) => mode === "gk" && store.hk === 1 && !!DC_SETS[subj];
const setSubjOf = (h) => h.setSubj || "gd";
const tabOf = (mode) => { const t = sel.tabs && sel.tabs[mode]; if (t === "dc" && hasDC(mode, sel.subj)) return "dc"; return t === "pick" ? "pick" : "all"; };
const setQuestions = (subj, no) => shuffle(DC_SETS[subj][no - 1].mc.map((id) => BY_ID[id]).filter(Boolean)).sort((a, b) => ({ mc: 0, tf: 1, sa: 2 }[a.t] - { mc: 0, tf: 1, sa: 2 }[b.t])).map(prepare);
const pickKey = (mode, subj) => mode + "-" + subj;

function streak() {
  const days = new Set(store.hist.map((h) => dayKey(h.t)));
  let d = new Date(); let n = 0;
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const starsFor = (sc) => (sc >= 9 ? 3 : sc >= 7 ? 2 : sc >= 5 ? 1 : 0);

/* ================= CHỌN CÂU HỎI (quay vòng + lặp câu sai) ================= */
function poolFor(mode, subj, lesId, pickIds) {
  if (mode === "bai") return BANK.filter((q) => q.les === lesId);
  const ids = new Set(pickIds && pickIds.length ? pickIds : scopeLessons(mode, subj).map((l) => l.id));
  return BANK.filter((q) => ids.has(q.les));
}
function priority(q, attemptNo) {
  const st = store.q[q.id];
  if (st && st.b === 0) return Math.random() * 0.1;                 // câu sai lần trước: hỏi lại trước
  if (st && st.b === 1) return 1 + Math.random() * 0.5;             // mới đúng 1 lần sau khi sai
  return 2 + (st ? st.n : 0) + (st ? st.l / (attemptNo + 1) : 0) * 0.6 + Math.random() * 0.5; // ít gặp ra trước
}
function bestOf(list, n, attemptNo) {
  return list.map((q) => ({ q, pri: priority(q, attemptNo) })).sort((a, b) => a.pri - b.pri).slice(0, n).map((x) => x.q);
}
function ensureVd(chosen, pool, want) {
  const have = chosen.filter((q) => q.vd).length;
  if (have >= want) return;
  shuffle(pool.filter((q) => q.vd && q.lv !== 2 && !chosen.includes(q))).slice(0, want - have).forEach((x) => {
    const idx = chosen.map((q, i) => [q, i]).reverse().find(([q]) => q.t === "mc" && !q.vd && q.lv !== 2 && !(store.q[q.id] && store.q[q.id].b === 0));
    if (idx) chosen[idx[1]] = x;
  });
}
function capAdv(chosen, pool, cap, attemptNo) { // giữ số câu nâng cao vừa phải (1 – 3 câu mỗi đề)
  let extra = chosen.filter((q) => q.lv === 2).length - cap;
  if (extra <= 0) return chosen;
  const spare = bestOf(pool.filter((q) => q.lv !== 2 && !chosen.includes(q)), extra * 3, attemptNo);
  for (let i = chosen.length - 1; i >= 0 && extra > 0; i--) {
    const q = chosen[i];
    if (q.lv !== 2 || (store.q[q.id] && store.q[q.id].b === 0)) continue;
    const k = spare.findIndex((x) => x.t === q.t);
    if (k < 0) continue;
    chosen[i] = spare.splice(k, 1)[0]; extra--;
  }
  return chosen;
}
const ADV_CAP = { bai: 3, kttx: 2, gk: 3, ck: 4 };
function pickQuestions(mode, subj, lesId, pickIds) {
  const pool = poolFor(mode, subj, lesId, pickIds);
  const attemptNo = store.hist.length + 1;
  const order = { mc: 0, tf: 1, sa: 2 };
  if (mode === "bai") {
    const own = pool.length <= LESSON_OWN_MAX ? pool.slice() : bestOf(pool, LESSON_OWN_MAX, attemptNo);
    if (own.length < pool.length) ensureVd(own, pool, 2);
    const l = LES[lesId];
    const track = LESSONS.filter((x) => trackOf(x) === trackOf(l));
    const pos = track.indexOf(l);
    const back = new Set([...track.slice(0, pos), ...kttxLessons(subj)].map((x) => x.id)); back.delete(lesId);
    let cand = BANK.filter((q) => back.has(q.les));
    if (cand.length < LESSON_TOTAL - own.length) { const ahead = new Set(track.slice(pos + 1).map((x) => x.id)); cand = cand.concat(BANK.filter((q) => ahead.has(q.les))); }
    const fill = bestOf(cand, LESSON_TOTAL - own.length, attemptNo);
    capAdv(own, pool, 2, attemptNo); capAdv(fill, cand, 1, attemptNo);
    return shuffle(own.concat(fill)).sort((a, b) => order[a.t] - order[b.t]).map(prepare);
  }
  const need = MODES[mode].need;
  const total = need.mc + need.tf + need.sa;
  let chosen = [];
  {
    ["mc", "tf", "sa"].forEach((type) => {
      const list = pool.filter((q) => q.t === type);
      const wrongCap = Math.ceil(need[type] * 0.5);
      const scored = list.map((q) => ({ q, pri: priority(q, attemptNo), wrong: store.q[q.id] && store.q[q.id].b === 0 })).sort((a, b) => a.pri - b.pri);
      let wrongTaken = 0; const pick = [];
      for (const it of scored) { if (pick.length >= need[type]) break; if (it.wrong) { if (wrongTaken >= wrongCap) continue; wrongTaken++; } pick.push(it); }
      for (const it of scored) { if (pick.length >= need[type]) break; if (!pick.includes(it)) pick.push(it); }
      chosen.push(...pick.map((x) => x.q));
    });
    if (chosen.length < total) {
      const rest = pool.filter((q) => !chosen.includes(q)).map((q) => ({ q, pri: priority(q, attemptNo) })).sort((a, b) => a.pri - b.pri);
      chosen.push(...rest.slice(0, total - chosen.length).map((x) => x.q));
    }
    const advWant = MODES[mode].adv;
    const advHave = chosen.filter((q) => q.lv === 2).length;
    if (advHave < advWant) {
      shuffle(pool.filter((q) => q.lv === 2 && !chosen.includes(q))).slice(0, advWant - advHave).forEach((x) => {
        const idx = chosen.map((q, i) => [q, i]).reverse().find(([q]) => q.t === x.t && q.lv !== 2 && !q.vd && !(store.q[q.id] && store.q[q.id].b === 0));
        if (idx) chosen[idx[1]] = x;
      });
    }
    if (ADV_CAP[mode]) capAdv(chosen, pool, ADV_CAP[mode], attemptNo);
    ensureVd(chosen, pool, mode === "ck" ? 5 : 4);
    if (chosen.length < total && pickIds && pickIds.length) { // bài đã chọn chưa đủ câu: lấy thêm câu ôn từ bài đã học
      const picked = new Set(pickIds);
      const base = new Set((mode === "kttx" ? kttxLessons(subj) : scopeLessons(mode, subj)).map((l) => l.id));
      const extra = BANK.filter((q) => !picked.has(q.les) && base.has(q.les));
      chosen = chosen.concat(bestOf(extra, total - chosen.length, attemptNo));
    }
  }
  return shuffle(chosen).sort((a, b) => order[a.t] - order[b.t]).map(prepare);
}
function prepare(q) {
  if (q.t === "mc" && q.keep) return { ...q, opts: q.o.slice(), ans: q.a };
  if (q.t === "mc") { const idx = shuffle([0, 1, 2, 3]); return { ...q, opts: idx.map((i) => q.o[i]), ans: idx.indexOf(q.a) }; }
  return { ...q };
}

/* ================= CHẤM ĐIỂM ================= */
const TF_PTS = [0, 0.1, 0.25, 0.5, 1];
function norm(s) {
  return String(s || "").toLowerCase().normalize("NFC").replace(/[\s\-–_"“”'.,]+/g, "");
}
const plain = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
function gradeOne(q, ans) {
  if (q.t === "mc") return { pts: ans === q.ans ? 1 : 0, ok: ans === q.ans };
  if (q.t === "tf") {
    const k = q.st.reduce((n, s, i) => n + (ans && ans[i] === s[1] ? 1 : 0), 0);
    return { pts: TF_PTS[k], ok: k === 4, k };
  }
  const numeric = q.a.every((x) => /^[\d.,]+$/.test(x));
  let cand;
  if (numeric) { cand = String(ans || "").replace(/[^\d.,]/g, ""); if (/^\d{1,3}(\.\d{3})+$/.test(cand)) cand = cand.replace(/\./g, ""); cand = cand.replace(/,/g, "."); }
  else cand = norm(ans);
  const keys = q.a.map((x) => (numeric ? x.replace(/,/g, ".") : norm(x)));
  const ok = !!cand && (keys.includes(cand) || (!numeric && keys.map(plain).includes(plain(cand))));
  return { pts: ok ? 1 : 0, ok };
}

/* ================= TRẠNG THÁI ================= */
let view = "home";
let sel = { mode: "bai", subj: "ls", tabs: {}, pick: {} };
try { const v = JSON.parse(localStorage.getItem("von6-sel") || "{}"); if (SUBJECTS[v.subj]) sel.subj = v.subj; if (MODES[v.mode] && v.mode !== "redo" && v.mode !== "daily") sel.mode = v.mode; if (v.tabs && typeof v.tabs === "object") sel.tabs = v.tabs; if (v.pick && typeof v.pick === "object") sel.pick = v.pick; } catch (e) {}
const saveSel = () => { try { localStorage.setItem("von6-sel", JSON.stringify(sel)); } catch (e) {} };
let session = null;

/* ================= TRANG CHỦ ================= */
function lessonListHTML() {
  const st = hkStages("ck", store.hk);
  const ls = LESSONS.filter((l) => l.s === sel.subj && st.includes(l.k));
  const groups = [];
  ls.forEach((l) => {
    const g = l.part || (l.k <= 2 ? "Học kì I" : "Học kì II");
    let G = groups.find((x) => x.g === g); if (!G) { G = { g, items: [] }; groups.push(G); }
    G.items.push(l);
  });
  return groups.map((G) => `
    <div class="les-group">
      <h3>${esc(sel.subj === "ls" ? "Phần " + G.g : G.g)}</h3>
      <ul class="les-list">
      ${G.items.map((l) => {
        const best = store.done[l.id] || 0;
        const tried = store.hist.some((h) => h.les === l.id);
        const ok = best >= PASS;
        return `<li class="les ${ok ? "ok" : ""}">
          <button class="les-main" data-les="${l.id}" id="les-${l.id}">
            <span class="les-num">${ok ? ICON.check : lesNum(l)}</span>
            <span class="les-title"><small>${esc(lesShort(l))}</small>${esc(lesName(l))}</span>
            <span class="les-state">${ok ? "Đã xong · " + fmt1(best) + " đ" : tried ? "Chưa đạt" : isLearned(l) ? "Đã học trên lớp" : "Chưa ôn"}</span>
          </button>
          <button class="les-print" data-print="${l.id}" id="print-${l.id}" aria-label="Tải đề Word ${esc(lesShort(l))}">${ICON.print}</button>
        </li>`;
      }).join("")}
      </ul>
    </div>`).join("");
}
function rangeText(mode) {
  const st = hkStages(mode, store.hk);
  const ls = LESSONS.filter((l) => l.s === sel.subj && st.includes(l.k));
  const parts = {};
  ls.forEach((l) => { const p = sel.subj === "ls" ? l.part : ""; (parts[p] = parts[p] || []).push(+lesNum(l)); });
  return Object.entries(parts).map(([p, ns]) => (p ? p + ": " : "") + "Bài " + Math.min(...ns) + " – Bài " + Math.max(...ns)).join(" · ");
}
function renderHome() {
  view = "home";
  const st = streak();
  const today = store.hist.filter((h) => dayKey(h.t) === dayKey(Date.now())).length;
  const stars = store.hist.reduce((n, h) => n + starsFor(scoreOf(h)), 0);
  const doneAll = LESSONS.filter((l) => (store.done[l.id] || 0) >= PASS).length;
  const pending = Object.entries(store.q).filter(([id, x]) => x.b === 0 && BY_ID[id] && BY_ID[id].s === sel.subj).length;
  const week = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); week.push(d); }
  const days = new Set(store.hist.map((h) => dayKey(h.t)));
  const wd = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dl = kttxLessons(sel.subj);
  const isTest = sel.mode !== "bai";
  const tab = tabOf(sel.mode);
  const picks = isTest ? (sel.pick[pickKey(sel.mode, sel.subj)] || []).filter((id) => LES[id]) : [];
  const scope = isTest ? scopeLessons(sel.mode, sel.subj) : [];
  const hkToggle = `<div class="hk" role="group" aria-label="Học kì">
      <span>Học kì</span>
      <button class="${store.hk === 1 ? "on" : ""}" data-hk="1" id="hk-1">I</button>
      <button class="${store.hk === 2 ? "on" : ""}" data-hk="2" id="hk-2">II</button>
    </div>`;
  let body = "";
  if (sel.mode === "bai") {
    body = `<div class="sec-row"><h2 class="sec">3. Chọn bài</h2>${hkToggle}</div>
      <p class="hint">Mỗi lượt 20 câu: câu của bài đó và vài câu ôn lại bài trước. Mỗi câu tối đa ${QSEC / 60} phút, câu đúng – sai (4 ý) ${QSEC_TF / 60} phút. Đạt từ ${PASS} điểm là hoàn thành bài. Biểu tượng máy in để tải đề Word.</p>
      ${lessonListHTML()}`;
  } else {
    const n = sel.mode === "kttx" ? 20 : sel.mode === "gk" ? 25 : 30;
    const isK = sel.mode === "kttx";
    const hkName = store.hk === 1 ? "I" : "II";
    const tabs = `<div class="tabs ${hasDC(sel.mode, sel.subj) ? "tabs3" : ""}" role="tablist">
        <button role="tab" class="${tab === "all" ? "on" : ""}" data-tab="all" id="tab-all" aria-selected="${tab === "all"}">${isK ? "Tất cả bài đã học" : hasDC(sel.mode, sel.subj) ? "Bài đã học" : "Theo bài đã học"} <em>${scope.length}</em></button>
        <button role="tab" class="${tab === "pick" ? "on" : ""}" data-tab="pick" id="tab-pick" aria-selected="${tab === "pick"}">${hasDC(sel.mode, sel.subj) ? "Chọn bài" : "Chọn theo bài"}${picks.length ? ` <em>${picks.length}</em>` : ""}</button>
        ${hasDC(sel.mode, sel.subj) ? `<button role="tab" class="${tab === "dc" ? "on" : ""}" data-tab="dc" id="tab-dc" aria-selected="${tab === "dc"}">Đề cương <em>5</em></button>` : ""}
      </div>`;
    const head = `<div class="sec-row"><h2 class="sec">3. Phạm vi ${isK ? "kiểm tra" : "ôn"}</h2>${isK && tab === "all" ? "" : hkToggle}</div>${tabs}`;
    if (tab === "dc") {
      body = `${head}
        <p class="hint">5 đề ôn theo đề cương giữa kì I của trường, cấu trúc như đề thật: trắc nghiệm (${DC_SETS[sel.subj][0].tnPts || 7} điểm) và tự luận (${DC_SETS[sel.subj][0].essayPts || 3} điểm)${sel.subj === "ls" ? ", gồm cả phần Lịch sử và Địa lí" : ""}. Làm xong phần trắc nghiệm, con làm tự luận rồi xem gợi ý để tự chấm.</p>
        <ul class="sets">${DC_SETS[sel.subj].map((st) => {
          const hs = store.hist.filter((h) => h.set === st.no && setSubjOf(h) === sel.subj);
          const best = hs.length ? Math.max(...hs.map((h) => scoreOf(h))) : null;
          return `<li class="set ${best !== null && best >= PASS ? "ok" : ""}">
            <button class="set-main" data-set="${st.no}" id="set-${st.no}">
              <span class="set-no">${best !== null && best >= PASS ? ICON.check : st.no}</span>
              <span class="set-title"><b>Đề số ${st.no}</b><small>${st.mc.length} câu trắc nghiệm · ${st.essays.length} câu tự luận</small></span>
              <span class="les-state">${best === null ? "Chưa làm" : "Cao nhất " + fmt1(best) + " đ · " + hs.length + " lượt"}</span>
            </button>
            <button class="les-print" data-setprint="${st.no}" id="setprint-${st.no}" aria-label="Tải Đề số ${st.no} dạng Word">${ICON.print}</button>
          </li>`; }).join("")}</ul>`;
    } else if (tab === "all") {
      const st = hkStages(sel.mode, store.hk);
      const range = LESSONS.filter((l) => l.s === sel.subj && st.includes(l.k));
      const allLearned = scope.length === range.length || range.every((l) => scope.includes(l));
      const note = sel.mode === "gk" && store.hk === 1
        ? `Đề trộn ${n} câu từ <b>${scope.length}</b> bài trong phạm vi kiểm tra giữa kì I (${esc(rangeText(sel.mode))}).`
        : isK
        ? `Đề trộn ${n} câu từ <b>${scope.length}</b> bài con đã học từ đầu năm đến nay. Bài nào con ôn thêm ở mục Ôn bài nào sẽ tự được cộng vào.`
        : allLearned && !range.some((l) => isLearned(l) || studied(l))
          ? `Con chưa học bài nào trong phạm vi ${MODES[sel.mode].name.toLowerCase()} học kì ${hkName} (${esc(rangeText(sel.mode))}), nên đề lấy từ toàn bộ phạm vi.`
          : `Đề trộn ${n} câu từ <b>${scope.length}</b> bài con đã học trong phạm vi ${MODES[sel.mode].name.toLowerCase()} học kì ${hkName} (${esc(rangeText(sel.mode))}). Bài nào con ôn thêm trong phạm vi này sẽ tự được cộng vào.`;
      body = `${head}
        <p class="hint">${note}</p>
        <div class="tags">${scope.map((l) => `<span class="tagbox">${esc(lesShort(l))}</span>`).join("")}</div>
        <div class="start-row">
          <button class="btn-start" id="btn-start" ${scope.length ? "" : "disabled"}>Bắt đầu ${isK ? "kiểm tra" : "làm bài"} ${ICON.arrow}</button>
          ${pending ? `<p class="hint">Có <b>${pending}</b> câu môn này con làm sai lần trước. Các câu này sẽ được hỏi lại.</p>` : ""}
        </div>`;
    } else {
      const stg = hkStages(isK ? "ck" : sel.mode, store.hk);
      const list = LESSONS.filter((l) => l.s === sel.subj && stg.includes(l.k));
      const groups = [];
      list.forEach((l) => { const g = sel.subj === "ls" ? "Phần " + l.part : l.part || (l.k <= 2 ? "Học kì I" : "Học kì II"); let G = groups.find((x) => x.g === g); if (!G) { G = { g, items: [] }; groups.push(G); } G.items.push(l); });
      const learnedIds = kttxLessons(sel.subj);
      body = `${head}
        <p class="hint">Chạm vào bài để chọn hoặc bỏ chọn. Đề có ${n} câu; nếu các bài đã chọn chưa đủ câu, trang lấy thêm câu ôn từ các bài đã học.</p>
        <div class="pick-actions"><button class="ghost" id="pick-learned">Chọn các bài đã học</button><button class="ghost" id="pick-none" ${picks.length ? "" : "disabled"}>Bỏ chọn hết</button></div>
        ${groups.map((G) => `<div class="les-group"><h3>${esc(G.g)}</h3><div class="pick-grid">${G.items.map((l) => `
          <button class="pick ${picks.includes(l.id) ? "on" : ""}" data-pick="${l.id}" id="pick-${l.id}" aria-pressed="${picks.includes(l.id)}">
            <span class="pick-box">${picks.includes(l.id) ? ICON.check : ""}</span>
            <span class="pick-txt"><small>${esc(lesShort(l))}${learnedIds.includes(l) ? " · đã học" : ""}</small>${esc(lesName(l))}</span>
          </button>`).join("")}</div></div>`).join("")}
        <div class="pick-pad" aria-hidden="true"></div>
        <div class="start-row sticky-start">
          <button class="btn-start" id="btn-start" ${picks.length ? "" : "disabled"}>${picks.length ? (isK ? "Kiểm tra " : "Ôn ") + picks.length + " bài" : "Hãy chọn bài"} ${ICON.arrow}</button>
        </div>`;
    }
  }

  $("#app").innerHTML = `
  <header class="hero">
    <div class="hero-text">
      <p class="eyebrow">Học bài đi - Gấu thối</p>
      <h1>${today ? "Hôm nay con đã ôn " + today + " lượt. Giỏi lắm!" : "Hôm nay mình ôn bài nào?"}</h1>
      <div class="chips">
        <span class="chip chip-fire">${ICON.flame}<b>${st}</b> ngày liền</span>
        <span class="chip chip-star">${ICON.star}<b>${stars}</b> sao</span>
        <span class="chip">${ICON.check}<b>${doneAll}</b>/${LESSONS.length} bài đã xong</span>
      </div>
    </div>
    <div class="owl-wrap">${OWL}</div>
  </header>

  <section class="week" aria-label="Bảy ngày gần nhất">
    ${week.map((d) => `<div class="wday ${days.has(dayKey(d)) ? "done" : ""} ${dayKey(d) === dayKey(Date.now()) ? "today" : ""}"><span>${wd[d.getDay()]}</span><i>${days.has(dayKey(d)) ? ICON.check : d.getDate()}</i></div>`).join("")}
  </section>

  <section class="panel" style="--sc:${SUBJECTS[sel.subj].c}">
    <h2 class="sec">1. Hôm nay Gấu học gì?</h2>
    <div class="subjects">
      ${Object.keys(SUBJECTS).map((k) => `<button class="subj ${sel.subj === k ? "on" : ""}" data-subj="${k}" id="subj-${k}" style="--sc:${SUBJECTS[k].c}">${SUBJECTS[k].name}</button>`).join("")}
    </div>
    <h2 class="sec">2. Mời Gấu chọn đề</h2>
    <div class="modes">
      ${["bai", "kttx", "gk", "ck"].map((k) => `
        <button class="mode ${sel.mode === k ? "on" : ""}" data-mode="${k}" id="mode-${k}">
          <span class="mode-ico">${ICON[k]}</span>
          <span class="mode-name">${MODES[k].name}${k === "kttx" ? ` <em class="count">${dl.length} bài</em>` : ""}</span>
        </button>`).join("")}
    </div>
    ${body}
  </section>

  <section class="tools">
    <button class="tool" id="btn-stats">${ICON.chart}<span><b>Thống kê & lịch sử điểm</b><small>${store.hist.length} lượt đã làm</small></span></button>
    <button class="tool" id="btn-print" ${sel.mode === "bai" || (tab === "dc" || (tab === "pick" ? !picks.length : !scope.length)) ? "disabled" : ""}>${ICON.print}<span><b>Tải đề Word để in</b><small>${sel.mode === "bai" ? "Bấm biểu tượng máy in cạnh từng bài" : "Đề " + MODES[sel.mode].name.toLowerCase() + ", kèm đáp án"}</small></span></button>
  </section>
  <p class="foot"><span id="sync" class="sync">Đang kiểm tra…</span><span>${BANK.length} câu hỏi · ${LESSONS.length} bài</span></p>
  <p class="toast" id="toast" hidden></p>`;
  setSync(GAS || FILE_MODE ? syncKind : cloudRef ? "cloud" : "local");
  document.querySelectorAll("[data-mode]").forEach((b) => (b.onclick = () => { sel.mode = b.dataset.mode; saveSel(); renderHome(); }));
  document.querySelectorAll("[data-subj]").forEach((b) => (b.onclick = () => { sel.subj = b.dataset.subj; saveSel(); renderHome(); }));
  document.querySelectorAll("[data-set]").forEach((b) => (b.onclick = () => startSet(sel.subj, +b.dataset.set)));
  document.querySelectorAll("[data-setprint]").forEach((b) => (b.onclick = () => exportDocx("gk", sel.subj, null, null, +b.dataset.setprint)));
  document.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => { sel.tabs = { ...(sel.tabs || {}), [sel.mode]: b.dataset.tab }; saveSel(); renderHome(); }));
  const setPicks = (ids) => { sel.pick = { ...sel.pick, [pickKey(sel.mode, sel.subj)]: ids }; saveSel(); const y = window.scrollY; renderHome(); window.scrollTo(0, y); };
  document.querySelectorAll("[data-pick]").forEach((b) => (b.onclick = () => { const id = b.dataset.pick; setPicks(picks.includes(id) ? picks.filter((x) => x !== id) : picks.concat(id).sort((x, y) => LESSONS.indexOf(LES[x]) - LESSONS.indexOf(LES[y]))); }));
  if ($("#pick-learned")) $("#pick-learned").onclick = () => setPicks(dl.filter((l) => hkStages(sel.mode === "kttx" ? "ck" : sel.mode, store.hk).includes(l.k)).map((l) => l.id));
  if ($("#pick-none")) $("#pick-none").onclick = () => setPicks([]);
  document.querySelectorAll("[data-hk]").forEach((b) => (b.onclick = () => { store.hk = +b.dataset.hk; save(); renderHome(); }));
  document.querySelectorAll("[data-les]").forEach((b) => (b.onclick = () => startSession("bai", sel.subj, null, b.dataset.les)));
  document.querySelectorAll("[data-print]").forEach((b) => (b.onclick = () => exportDocx("bai", sel.subj, b.dataset.print)));
  const usePick = isTest && tab === "pick";
  if ($("#btn-start")) $("#btn-start").onclick = () => startSession(sel.mode, sel.subj, null, null, usePick ? picks : null);
  $("#btn-stats").onclick = renderStats;
  $("#btn-print").onclick = () => exportDocx(sel.mode, sel.subj, null, usePick ? picks : null);
}
function toast(msg) {
  const t = $("#toast"); if (!t) return;
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 4500);
}

/* ================= LÀM BÀI ================= */
function startSet(subj, no) {
  const st = DC_SETS[subj][no - 1];
  startSession("gk", subj, setQuestions(subj, no), null, null, { set: no, essays: st.essays.map((id) => ESSAYS[id]), weights: st.weights || null, tfLinear: !!st.tfLinear, tnPts: st.tnPts || 7, essayPts: st.essayPts || 3, exam: true, essayAns: st.essays.map(() => "") });
}
function startSession(mode, subj, qs, lesId, pickIds, extra) {
  const questions = qs || pickQuestions(mode, subj, lesId, pickIds);
  if (!questions.length) return;
  session = { mode, subj, les: lesId || null, pick: pickIds && pickIds.length ? pickIds.slice() : null, qs: questions, ans: questions.map(() => null), timeout: questions.map(() => false), i: 0, start: Date.now(), ...(extra || {}) };
  if (session.exam) { session.deadline = nowMs() + exMin(session) * 60000; session.paused = null; } else startQuestionTimer();
  renderQuiz();
  window.scrollTo(0, 0);
}
const pagesOf = (s) => s.qs.length + (s.exam ? s.essays.length : 0);
function quizTitle(s) {
  if (s.les) return lesShort(LES[s.les]) + " · " + SUBJECTS[s.subj].short;
  if (s.set) return "Đề cương giữa kì · Đề " + s.set;
  if (s.pick) return MODES[s.mode].name + " · " + s.pick.length + " bài · " + SUBJECTS[s.subj].short;
  return MODES[s.mode].name + " · " + SUBJECTS[s.subj].short;
}
/* ----- Dây cháy: mỗi câu tối đa QSEC giây ----- */
const nowMs = () => (window.performance && performance.now ? performance.now() : Date.now());
function startQuestionTimer() {
  const s = session;
  if (!s.left) { s.left = s.qs.map((q) => qSec(q) * 1000); s.maxI = 0; }
  s.deadline = nowMs() + s.left[s.i]; s.paused = null;
}
const qLocked = (s, i) => !s.exam && s.left && s.left[i] <= 0; // câu đã hết giờ: xem lại được nhưng không sửa
function goQuestion(i) { // chuyển câu, giữ thời gian còn lại của từng câu
  const s = session;
  clearTimeout(s.advT);
  if (s.exam) { gotoPage(i); return; }
  i = Math.max(0, Math.min(s.qs.length - 1, i));
  if (s.left[s.i] > 0) s.left[s.i] = Math.max(0, (s.paused != null ? s.paused : s.deadline - nowMs()));
  s.i = i; s.maxI = Math.max(s.maxI, i);
  startQuestionTimer();
  renderQuiz(); window.scrollTo(0, 0);
}
function autoNext() { /* Không tự chuyển câu nữa: con tự bấm "Câu tiếp" để tránh lỡ tay chọn nhầm. */ }
function pauseTimer() { if (session && session.paused == null) session.paused = Math.max(0, session.deadline - nowMs()); }
function resumeTimer() { if (session && session.paused != null) { session.deadline = nowMs() + session.paused; session.paused = null; } }
const mmss = (sec) => Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
function updateFuse(rem) {
  const s = session, fuse = document.getElementById("fuse");
  if (!fuse) return;
  const total = s.exam ? exMin(s) * 60000 : qSec(s.qs[s.i]) * 1000;
  const frac = Math.max(0, Math.min(1, rem / total));
  const sec = Math.ceil(rem / 1000);
  document.getElementById("rope").style.width = (frac * 100).toFixed(2) + "%";
  const label = s.exam ? mmss(sec) : String(sec);
  const secEl = document.getElementById("fuse-sec"); if (secEl.textContent !== label) secEl.textContent = label;
  fuse.classList.toggle("warn", s.exam ? sec <= 300 : sec <= 10);
  fuse.classList.toggle("danger", s.exam ? sec <= 60 : sec <= 5);
  const tot = document.getElementById("fuse-total");
  if (tot && !s.exam) tot.textContent = mmss(restSec(s) + sec);
}
function tick() {
  if (view === "quiz" && session && session.paused == null) {
    const rem = session.deadline - nowMs();
    if (rem <= 0) { if (session.exam) { session.timeUpExam = true; submit(); } else if (!qLocked(session, session.i)) timeUp(); } else updateFuse(rem);
  }
  requestAnimationFrame(tick);
}
function timeUp() {
  const s = session;
  s.left[s.i] = 0;
  if (!isAnswered(s.qs[s.i], s.ans[s.i])) s.timeout[s.i] = true;
  nextQuestion(true);
}
function askSubmitExam() {
  const s = session;
  const left = s.qs.filter((q, i) => !isAnswered(q, s.ans[i])).length + s.essayAns.filter((t) => !t.trim()).length;
  pauseTimer();
  showConfirm(left ? `Con còn <b>${left}</b> câu chưa làm. Vẫn nộp bài chứ?` : "Con đã làm hết các câu. Nộp bài nhé?", "Nộp bài", submit);
}
function gotoPage(i) { const s = session; clearTimeout(s.advT); s.i = Math.max(0, Math.min(pagesOf(s) - 1, i)); renderQuiz(); window.scrollTo(0, 0); }
function nextQuestion(fromTimer) {
  const s = session;
  if (s.exam) { if (s.i >= pagesOf(s) - 1) askSubmitExam(); else gotoPage(s.i + 1); return; }
  if (s.i >= s.qs.length - 1) { if (fromTimer) { renderQuiz(); toastQuiz("Hết giờ câu này. Con xem lại các câu trước hoặc bấm Nộp bài."); } else submit(); return; }
  goQuestion(s.i + 1);
  if (fromTimer) toastQuiz("Hết giờ câu trước, chuyển sang câu tiếp theo");
}
function toastQuiz(msg) {
  const t = document.getElementById("qtoast"); if (!t) return;
  t.textContent = msg; t.hidden = false; clearTimeout(toastQuiz._t); toastQuiz._t = setTimeout(() => (t.hidden = true), 2200);
}
const FLAME = `<svg class="flame" viewBox="0 0 32 40" aria-hidden="true"><path d="M16 1c3 8 13 12 13 23a13 13 0 0 1-26 0c0-6 3-9 6-12 0 4 2 7 4 8-1-7 1-13 3-19z" fill="#F07A2E"/><path d="M16 15c2 5 7 7 7 13a7 7 0 0 1-14 0c0-3 2-5 3-6 0 2 1 3 2 4 0-4 1-8 2-11z" fill="#FFD25A"/></svg><i class="spark s1"></i><i class="spark s2"></i><i class="spark s3"></i>`;
function examFuseHTML(s) {
  const rem = s.paused != null ? s.paused : Math.max(0, s.deadline - nowMs());
  const sec = Math.ceil(rem / 1000);
  return `<div class="fuse exam ${sec <= 300 ? "warn" : ""} ${sec <= 60 ? "danger" : ""}" id="fuse" role="timer" aria-label="Thời gian làm bài còn lại">
      <div class="fuse-sec"><b id="fuse-sec">${mmss(sec)}</b><small>còn lại</small></div>
      <div class="fuse-track"><div class="rope" id="rope" style="width:${(rem / (exMin(s) * 600)).toFixed(2)}%">${FLAME}</div></div>
    </div>
    <p class="fuse-total">Thời gian làm bài ${exMin(s)} phút cho cả đề (trắc nghiệm và tự luận). Hết giờ trang tự nộp bài.</p>`;
}
function examNavHTML(s) {
  const n = pagesOf(s), lastP = s.i === n - 1;
  return `<div class="qnav exam-nav">
      ${lastP ? "" : `<button class="ghost btn-submit-now" id="btn-submit-now">Nộp bài ngay</button>`}
      <button class="ghost" id="btn-prev" ${s.i === 0 ? "disabled" : ""}>${ICON.back} Câu trước</button>
      ${lastP ? `<button class="btn-next btn-submit" id="btn-next">Nộp bài ${ICON.check}</button>` : `<button class="btn-next" id="btn-next">Câu tiếp ${ICON.arrow}</button>`}
    </div>
    <div class="dots" aria-label="Đi tới câu">
      ${s.qs.map((qq, i) => `<button class="dot ${i === s.i ? "cur" : ""} ${isAnswered(qq, s.ans[i]) ? "done" : ""}" data-go="${i}" id="dot-${i}" aria-label="Câu ${i + 1}">${i + 1}</button>`).join("")}
      ${s.essays.map((e, k) => `<button class="dot dot-es ${s.qs.length + k === s.i ? "cur" : ""} ${s.essayAns[k].trim() ? "done" : ""}" data-go="${s.qs.length + k}" id="dot-tl${k}" aria-label="Tự luận câu ${k + 1}">TL${k + 1}</button>`).join("")}
    </div>
`;
}
function bindExamNav() {
  $("#btn-next").onclick = () => nextQuestion(false);
  if ($("#btn-prev")) $("#btn-prev").onclick = () => gotoPage(session.i - 1);
  if ($("#btn-submit-now")) $("#btn-submit-now").onclick = askSubmitExam;
  document.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => gotoPage(+b.dataset.go)));
  $("#btn-quit").onclick = () => { pauseTimer(); showConfirm("Thoát bây giờ thì bài làm sẽ không được chấm. Con chắc chứ?", "Thoát", () => { session = null; renderHome(); window.scrollTo(0, 0); }); };
}
function renderEssayPage() {
  const s = session, k = s.i - s.qs.length, e = s.essays[k];
  const subj = SUBJECTS[s.subj];
  $("#app").innerHTML = `
  <div class="quiz" style="--sc:${subj.c}">
    <div class="qbar">
      <button class="ghost" id="btn-quit">${ICON.back} Thoát</button>
      <span class="qmeta">${esc(quizTitle(s))}</span>
      <span class="qcount">TL ${k + 1}/${s.essays.length}</span>
    </div>
    ${examFuseHTML(s)}
    <article class="qcard">
      <div class="qtags"><span class="tag" style="background:${subj.c}">${esc(lesShort(LES[e.les]))}</span><span class="tag tag-vd">Tự luận</span><span class="tag-type">${fmt2((s.essayPts || 3) / s.essays.length)} điểm</span></div>
      <h2 class="qtext">Câu ${k + 1}. ${esc(e.q).replace(/\n/g, "<br>")}</h2>
      <label class="sa"><span>Bài làm của con <small>(viết ra giấy hoặc gõ vào đây)</small></span>
        <textarea id="exam-essay" rows="8" placeholder="Con trình bày câu trả lời ở đây">${esc(s.essayAns[k])}</textarea></label>
    </article>
    ${examNavHTML(s)}
    <div class="confirm" id="confirm" hidden></div>
  </div>`;
  const ta = $("#exam-essay");
  ta.oninput = () => { s.essayAns[k] = ta.value; const d = document.getElementById("dot-tl" + k); if (d) d.classList.toggle("done", !!ta.value.trim()); };
  bindExamNav();
}
function renderQuiz() {
  view = "quiz";
  if (session.exam && session.i >= session.qs.length) { renderEssayPage(); return; }
  const s = session, q = s.qs[s.i], a = s.ans[s.i];
  const subj = SUBJECTS[q.s];
  const last = s.i === s.qs.length - 1;
  const done = isAnswered(q, a);
  const rem = s.paused != null ? s.paused : Math.max(0, s.deadline - nowMs());
  const sec = Math.ceil(rem / 1000);
  const lock = qLocked(s, s.i);
  let body = "";
  if (q.t === "mc") {
    body = `<div class="opts">${q.opts.map((o, i) => `<button class="opt ${a === i ? "on" : ""}" data-i="${i}" id="opt-${i}"><b>${"ABCD"[i]}</b><span>${esc(o)}</span></button>`).join("")}</div>`;
  } else if (q.t === "tf") {
    body = `<div class="tfs">${q.st.map((st, i) => `
      <div class="tf"><p><b>${"abcd"[i]})</b> ${esc(st[0])}</p>
        <div class="tf-btns">
          <button class="tfb ${a && a[i] === true ? "on yes" : ""}" data-k="${i}" data-v="1" id="tf-${i}-d">Đúng</button>
          <button class="tfb ${a && a[i] === false ? "on no" : ""}" data-k="${i}" data-v="0" id="tf-${i}-s">Sai</button>
        </div></div>`).join("")}</div>`;
  } else {
    body = `<label class="sa"><span>Đáp án của con <small>(${esc(q.h)})</small></span>
      <input id="sa-input" autocomplete="off" inputmode="${q.a.every((x) => /^[\d.,]+$/.test(x)) ? "decimal" : "text"}" value="${esc(a || "")}" placeholder="Gõ đáp án vào đây"></label>`;
  }
  $("#app").innerHTML = `
  <div class="quiz" style="--sc:${subj.c}">
    <div class="qbar">
      <button class="ghost" id="btn-quit">${ICON.back} Thoát</button>
      <span class="qmeta">${esc(quizTitle(s))}</span>
      <span class="qcount">${s.i + 1}/${s.qs.length}${s.exam ? " · TL " + s.essays.length : ""}</span>
    </div>
    ${s.exam ? examFuseHTML(s) : `<div class="fuse ${sec <= 10 ? "warn" : ""} ${sec <= 5 ? "danger" : ""}" id="fuse" role="timer" aria-label="Thời gian còn lại cho câu này">
      <div class="fuse-sec"><b id="fuse-sec">${sec}</b><small>giây</small></div>
      <div class="fuse-track"><div class="rope" id="rope" style="width:${(rem / (qSec(q) * 10)).toFixed(2)}%">${FLAME}</div></div>
    </div>
    <p class="fuse-total">Câu này tối đa ${qSec(q)} giây · cả bài còn tối đa <b id="fuse-total">${mmss(restSec(s) + sec)}</b></p>`}
    <article class="qcard">
      <div class="qtags"><span class="tag" style="background:${subj.c}">${esc(lesShort(LES[q.les]))}</span>${q.vd ? `<span class="tag tag-vd">Liên hệ thực tế</span>` : ""}<span class="tag-type">${TYPE_LABEL[q.t]}</span></div>
      <h2 class="qtext">Câu ${s.i + 1}. ${esc(q.q)}</h2>
      ${body}
    </article>
    ${lock ? `<p class="lock-note">Câu này đã hết giờ nên con chỉ xem lại được, không sửa được nữa.</p>` : ""}
    ${s.exam ? examNavHTML(s) : `<div class="qnav exam-nav">
      <button class="ghost" id="btn-prev" ${s.i === 0 ? "disabled" : ""}>${ICON.back} Câu trước</button>
      ${last ? `<button class="btn-next btn-submit" id="btn-next">Nộp bài ${ICON.check}</button>`
        : `<button class="btn-next ${done ? "" : "skip"}" id="btn-next">${done || s.i < s.maxI ? "Câu tiếp" : "Bỏ qua"} ${ICON.arrow}</button>`}
    </div>
    <div class="dots" aria-label="Đi tới câu">
      ${s.qs.map((qq, i) => i <= s.maxI ? `<button class="dot ${i === s.i ? "cur" : ""} ${i !== s.i ? (s.timeout[i] && !isAnswered(qq, s.ans[i]) ? "late" : isAnswered(qq, s.ans[i]) ? "done" : "skipd") : ""}" data-go="${i}" aria-label="Câu ${i + 1}">${i + 1}</button>` : `<span class="dot">${i + 1}</span>`).join("")}
    </div>`}
    <p class="qtoast" id="qtoast" hidden></p>
    <div class="confirm" id="confirm" hidden></div>
  </div>`;
  if (lock) document.querySelectorAll(".opt, .tfb, #sa-input").forEach((b) => (b.disabled = true));
  document.querySelectorAll(".opt").forEach((b) => (b.onclick = () => { if (lock) return; s.ans[s.i] = +b.dataset.i; renderQuiz(); autoNext(); }));
  document.querySelectorAll(".tfb").forEach((b) => (b.onclick = () => {
    if (lock) return;
    const arr = s.ans[s.i] ? s.ans[s.i].slice() : [null, null, null, null];
    arr[+b.dataset.k] = b.dataset.v === "1"; s.ans[s.i] = arr; renderQuiz();
    if (arr.every((x) => x !== null)) autoNext();
  }));
  const inp = $("#sa-input");
  if (inp) {
    inp.oninput = () => { s.ans[s.i] = inp.value; const b = $("#btn-next"); if (b && !last && !s.exam) { const ok = !!inp.value.trim(); b.classList.toggle("skip", !ok); b.firstChild.textContent = (ok ? "Câu tiếp" : "Bỏ qua") + " "; } };
    inp.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); nextQuestion(false); } };
  }
  if (s.exam) { bindExamNav(); return; }
  $("#btn-next").onclick = () => nextQuestion(false);
  $("#btn-prev").onclick = () => goQuestion(s.i - 1);
  document.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => goQuestion(+b.dataset.go)));
  $("#btn-quit").onclick = () => { pauseTimer(); showConfirm("Thoát bây giờ thì bài làm sẽ không được chấm. Con chắc chứ?", "Thoát", () => { session = null; renderHome(); window.scrollTo(0, 0); }); };
}
/* Bấm Enter để sang câu tiếp (trừ khi đang gõ bài tự luận) */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || e.shiftKey || view !== "quiz" || !session) return;
  const t = e.target;
  if (t && (t.tagName === "TEXTAREA" || t.id === "sa-input")) return; // ô trả lời ngắn tự xử lí Enter
  const c = document.getElementById("confirm");
  if (c && !c.hidden) return;
  e.preventDefault();
  nextQuestion(false);
}, true);
function isAnswered(q, a) {
  if (q.t === "mc") return a !== null && a !== undefined;
  if (q.t === "tf") return !!a && a.every((x) => x !== null);
  return !!(a && String(a).trim());
}
function showConfirm(msg, okLabel, onOk) {
  const c = $("#confirm");
  c.innerHTML = `<div class="confirm-box"><p>${msg}</p><div><button class="ghost" id="c-no">Làm tiếp</button><button class="btn-next" id="c-yes">${okLabel}</button></div></div>`;
  c.hidden = false;
  $("#c-no").onclick = () => { c.hidden = true; resumeTimer(); };
  $("#c-yes").onclick = onOk;
}
function submit() {
  const s = session;
  const res = s.qs.map((q, i) => gradeOne(q, s.ans[i]));
  const pts = res.reduce((n, r) => n + r.pts, 0);
  let sc = Math.round((pts / s.qs.length) * 100) / 10;
  s.tn = null;
  if (s.weights) { // điểm trắc nghiệm theo trọng số (VD Tin học: chọn đáp án 0,25đ, đúng – sai 1đ, tổng 7đ)
    const tn = s.qs.reduce((n, q, i) => n + (s.weights[q.t] || 0) * (q.t === "tf" && s.tfLinear ? res[i].k / 4 : res[i].pts), 0);
    const mx = s.qs.reduce((n, q) => n + (s.weights[q.t] || 0), 0);
    s.tn = Math.round(tn * 100) / 100; s.tnMax = mx;
    sc = Math.round((tn / mx) * 100) / 10;
  }
  const attemptNo = store.hist.length + 1;
  s.qs.forEach((q, i) => {
    const st = store.q[q.id] || { n: 0, w: 0, b: -1, l: 0 };
    st.n++; st.l = attemptNo;
    if (!res[i].ok) { st.w++; st.b = 0; } else st.b = st.b === -1 ? 3 : Math.min(3, st.b + 1);
    store.q[q.id] = st;
  });
  const wrongIds = s.qs.filter((q, i) => !res[i].ok).map((q) => q.id);
  const entry = { t: Date.now(), m: s.mode, s: s.subj, sc, k: res.filter((r) => r.ok).length, tot: s.qs.length, w: wrongIds, d: Math.round((Date.now() - s.start) / 1000) };
  if (s.les) entry.les = s.les;
  if (s.pick) entry.pick = s.pick.length;
  if (s.set) { entry.set = s.set; entry.setSubj = s.subj; if (s.essayAns) { entry.es = s.essayAns.map((t) => t.slice(0, 1500)); const per = (s.essayPts || 3) / s.essays.length; entry.esc = q4(s.essays.reduce((n, e, k) => n + per * gradeEssay(e, s.essayAns[k]).frac, 0)); entry.esMax = s.essayPts || 3; s.esc0 = entry.esc; entry.tnp = Math.round((s.tn != null ? s.tn * (s.tnPts || 7) / s.tnMax : sc * (s.tnPts || 7) / 10) * 100) / 100; } if (s.exam) entry.dur = Math.round(Math.min(exMin(s) * 60000, exMin(s) * 60000 - Math.max(0, (s.paused != null ? s.paused : s.deadline - nowMs()))) / 1000); }
  store.hist.push(entry); s.histT = entry.t;
  store.hist = store.hist.slice(-500);
  s.newlyDone = false;
  if (s.mode === "bai" && s.les) {
    const before = store.done[s.les] || 0;
    if (sc > before) store.done[s.les] = sc;
    s.newlyDone = before < PASS && sc >= PASS;
  }
  save();
  s.res = res; s.sc = sc;
  renderResult();
}

/* ================= KẾT QUẢ ================= */
function praise(sc) {
  if (sc >= 9) return "Xuất sắc! Con nắm bài rất chắc.";
  if (sc >= 7) return "Tốt lắm! Sửa nốt mấy câu sai là con thuộc hết.";
  if (sc >= 5) return "Khá rồi. Làm lại câu sai để nhớ lâu hơn nhé.";
  return "Không sao cả. Làm lại câu sai ngay bây giờ, con sẽ tiến bộ.";
}
function ansText(q, a) {
  if (q.t === "mc") return a === null || a === undefined ? "Chưa làm" : "ABCD"[a] + ". " + q.opts[a];
  if (q.t === "tf") return a ? a.map((x, i) => "abcd"[i] + ") " + (x === null ? "–" : x ? "Đ" : "S")).join("  ") : "Chưa làm";
  return a && String(a).trim() ? a : "Chưa làm";
}
function rightText(q) {
  if (q.t === "mc") return "ABCD"[q.ans] + ". " + q.opts[q.ans];
  if (q.t === "tf") return q.st.map((x, i) => "abcd"[i] + ") " + (x[1] ? "Đ" : "S")).join("  ");
  return q.a[0];
}
function renderResult() {
  view = "result";
  const s = session, sc = s.sc;
  const tn7r = s.essays ? Math.round((s.tn != null ? s.tn * (s.tnPts || 7) / s.tnMax : sc * (s.tnPts || 7) / 10) * 100) / 100 : 0;
  const tot0 = s.essays ? Math.round((tn7r + (s.esc0 || 0)) * 100) / 100 : sc;
  const stars = starsFor(tot0);
  const wrong = s.qs.map((q, i) => ({ q, i, r: s.res[i] })).filter((x) => !x.r.ok);
  const C = 2 * Math.PI * 54;
  let lessonBox = "";
  if (s.mode === "bai" && s.les) {
    const l = LES[s.les];
    const n = kttxLessons(s.subj).length;
    if (sc >= PASS) lessonBox = `<div class="next-box ok">
        <p><b>${s.newlyDone ? "Hoàn thành " : "Đã hoàn thành "}${esc(lesShort(l))}!</b> Kiểm tra thường xuyên ${esc(SUBJECTS[s.subj].short)} giờ cộng dồn <b>${n}</b> bài con đã học.</p>
        <button class="btn-start" id="btn-kttx">Làm Kiểm tra thường xuyên ${ICON.arrow}</button></div>`;
    else lessonBox = `<div class="next-box">
        <p>Cần đạt từ <b>${PASS}</b> điểm để hoàn thành ${esc(lesShort(l))}. Con làm lại câu sai, rồi ôn lại cả bài nhé.</p>
        <button class="ghost" id="btn-again">${ICON.daily} Ôn lại cả bài</button></div>`;
  }
  $("#app").innerHTML = `
  <section class="result">
    <div class="score-card">
      <svg class="ring" viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r="54" fill="none" stroke="var(--line)" stroke-width="12"/>
        <circle cx="64" cy="64" r="54" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round"
          stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - tot0 / 10)}" transform="rotate(-90 64 64)" id="ring-arc"/>
      </svg>
      <div class="score-num"><b id="score-big">${s.essays ? fmt2(tot0) : fmt1(sc)}</b><span>${s.essays ? "tổng điểm / 10" : "điểm / 10"}</span></div>
      <div class="stars" id="stars">${[0, 1, 2].map((i) => `<span class="${i < stars ? "lit" : ""}">${ICON.star}</span>`).join("")}</div>
      ${s.essays ? `<div class="parts">
        <div><span>Trắc nghiệm</span><b>${fmt2(tn7r)}<small> / ${fmt2(s.tnPts || 7)}</small></b></div>
        <div><span>Tự luận</span><b id="part-es">${fmt2(s.esc0 || 0)}<small> / ${fmt2(s.essayPts || 3)}</small></b></div>
        <div class="parts-tot"><span>Tổng điểm</span><b id="part-tot">${fmt2(tot0)}<small> / 10</small></b></div>
      </div>` : ""}
      <p class="praise" id="praise">${praise(tot0)}</p>
      <p class="sub">Đúng ${s.res.filter((r) => r.ok).length}/${s.qs.length} câu · ${esc(quizTitle(s))}</p>
    </div>
    ${lessonBox}
    ${s.essays ? `<div class="essay-box">
      <h2 class="sec">Phần tự luận (${s.essayPts || 3} điểm)</h2>
      ${s.timeUpExam ? `<p class="late-txt"><b>Đã hết ${exMin(s)} phút, bài được nộp tự động.</b></p>` : ""}
      <p class="hint">Bài con gõ vào ô được máy chấm theo từng ý của đáp án. Ý có dấu ✓ là con đã viết được, ý có dấu ½ là con viết được một phần. Con viết ra giấy thì mẹ đối chiếu với đáp án rồi tích vào các ý con có. Mẹ có thể bấm vào từng ý để sửa điểm.</p>
      ${s.essays.map((e, k) => `<div class="essay" data-essay="${k}">
        <p class="essay-q"><b>Câu ${k + 1} (${fmt2((s.essayPts || 3) / s.essays.length)} điểm).</b> ${esc(e.q).replace(/\n/g, "<br>")}</p>
        <textarea id="essay-${k}" rows="5" placeholder="Con gõ bài làm vào đây rồi bấm Chấm bài">${esc((s.essayAns && s.essayAns[k]) || "")}</textarea>
        <div class="row"><button class="ghost" data-grade="${k}" id="grade-${k}">Chấm bài</button><span class="essay-score" id="escore-${k}"></span></div>
        <p class="essay-copy" id="ecopy-${k}" hidden>Bài làm chủ yếu chép lại đề bài nên chỉ được nửa số điểm. Con cần trả lời bằng ý của mình.</p>
        <p class="essay-ans-h">Đáp án</p>
        <ul class="essay-ideas" id="ideas-${k}">${e.ideas.map((t, j) => `<li><button class="idea-mark" data-idea="${k}" data-j="${j}" id="idea-${k}-${j}" data-v="0" aria-label="Chấm ý ${j + 1}"></button><span>${esc(t)}</span></li>`).join("")}</ul>
      </div>`).join("")}
      <p class="essay-total" id="essay-total"></p>
    </div>` : ""}
    ${wrong.length ? `
    <div class="wrong-box">
      <h2 class="sec">Các câu cần làm lại (${wrong.length})</h2>
      <ol class="wrong-list">
        ${wrong.map(({ q, i, r }) => `<li><span class="tag" style="background:${SUBJECTS[q.s].c}">${esc(lesShort(LES[q.les]))}</span>
          <p><b>Câu ${i + 1}.</b> ${esc(q.q)}</p>
          ${q.t === "tf" ? `<p class="small">Con đúng ${r.k}/4 ý.</p>` : ""}
          <p class="small">Con trả lời: ${s.timeout && s.timeout[i] ? "<b class=\"late-txt\">Hết giờ, chưa trả lời</b>" : esc(ansText(q, s.ans[i]))}</p>
          <p class="small reveal" hidden>Đáp án đúng: <b>${esc(rightText(q))}</b></p></li>`).join("")}
      </ol>
      <div class="row">
        <button class="btn-start" id="btn-redo">Làm lại ${wrong.length} câu sai ${ICON.arrow}</button>
        <button class="ghost" id="btn-reveal">Xem đáp án đúng</button>
      </div>
    </div>` : `<div class="wrong-box"><p class="allgood">Không sai câu nào. Tuyệt vời!</p></div>`}
    ${s.qs.some((q, i) => q.vd && s.res[i].ok) ? `
    <div class="ideas">
      <h2 class="sec">Ý hay để viết tự luận</h2>
      <p class="hint">Các câu liên hệ thực tế con đã trả lời đúng. Con có thể dùng những ý này khi viết bài tự luận. Câu liên hệ thực tế nào làm sai sẽ hiện ở đây khi con làm lại đúng.</p>
      <ul>${s.qs.filter((q, i) => q.vd && s.res[i].ok).map((q) => `<li><span class="tag" style="background:${SUBJECTS[q.s].c}">${esc(lesShort(LES[q.les]))}</span><p>${esc(q.q)}</p><p class="idea-ans">${ICON.check}<span>${esc(q.opts[q.ans])}</span></p></li>`).join("")}</ul>
    </div>` : ""}
    <div class="row center">
      <button class="ghost" id="btn-home">${ICON.back} Về trang chính</button>
      <button class="ghost" id="btn-stats2">${ICON.chart} Xem thống kê</button>
    </div>
    ${GAS || FILE_MODE ? `<p class="sync-note center">Kết quả tự gửi về cho mẹ khi có mạng.</p>` : ""}
  </section>`;
  if ($("#btn-redo")) $("#btn-redo").onclick = () => startSession("redo", s.subj, shuffle(wrong.map((w) => prepare(BY_ID[w.q.id]))));
  if ($("#btn-reveal")) $("#btn-reveal").onclick = (e) => { document.querySelectorAll(".reveal").forEach((x) => (x.hidden = false)); e.currentTarget.hidden = true; };
  if ($("#btn-kttx")) $("#btn-kttx").onclick = () => { sel.mode = "kttx"; sel.tabs = { ...(sel.tabs || {}), kttx: "all" }; sel.subj = s.subj; saveSel(); startSession("kttx", s.subj); };
  if (s.essays) {
    const tn7 = s.tn != null ? s.tn * (s.tnPts || 7) / s.tnMax : sc * (s.tnPts || 7) / 10;
    const per = (s.essayPts || 3) / s.essays.length;
    const copied = s.essays.map(() => false);
    const setMark = (b, v) => { b.dataset.v = String(v); b.textContent = v === 1 ? "✓" : v === 0.5 ? "½" : ""; b.classList.toggle("on", v === 1); b.classList.toggle("half", v === 0.5); };
    const upd = () => {
      let es = 0;
      s.essays.forEach((e, k) => {
        const got = [...document.querySelectorAll('[data-idea="' + k + '"]')].reduce((n, b) => n + +b.dataset.v, 0);
        const pts = q4(per * got / e.ideas.length * (copied[k] ? 0.5 : 1));
        es += pts;
        document.getElementById("escore-" + k).innerHTML = "Được <b>" + fmt2(pts) + " / " + fmt2(per) + "</b> điểm";
        document.getElementById("ecopy-" + k).hidden = !copied[k];
      });
      const tot = Math.round((tn7 + q4(es)) * 100) / 100;
      document.getElementById("essay-total").innerHTML = "Trắc nghiệm <b>" + fmt2(tn7) + " / " + fmt2(s.tnPts || 7) + "</b> · Tự luận <b>" + fmt2(q4(es)) + " / " + fmt2(s.essayPts || 3) + "</b> · Tổng <b>" + fmt2(tot) + " / 10 điểm</b>";
      document.getElementById("part-es").innerHTML = fmt2(q4(es)) + "<small> / " + fmt2(s.essayPts || 3) + "</small>";
      document.getElementById("part-tot").innerHTML = fmt2(tot) + "<small> / 10</small>";
      document.getElementById("score-big").textContent = fmt2(tot);
      document.getElementById("ring-arc").setAttribute("stroke-dashoffset", String(C * (1 - tot / 10)));
      document.getElementById("praise").textContent = praise(tot);
      document.querySelectorAll("#stars span").forEach((x, i) => x.classList.toggle("lit", i < starsFor(tot)));
      const h = store.hist.find((x) => x.t === s.histT);
      if (h) { h.esc = q4(es); h.es = s.essays.map((e, k) => (document.getElementById("essay-" + k).value || "").slice(0, 1500)); save(); }
    };
    const autoGrade = (k) => {
      const g = gradeEssay(s.essays[k], document.getElementById("essay-" + k).value);
      copied[k] = g.copied;
      g.marks.forEach((v, j) => setMark(document.getElementById("idea-" + k + "-" + j), v));
    };
    s.essays.forEach((e, k) => autoGrade(k));
    document.querySelectorAll("[data-grade]").forEach((b) => (b.onclick = () => { autoGrade(+b.dataset.grade); upd(); }));
    document.querySelectorAll("[data-idea]").forEach((b) => (b.onclick = () => { const v = +b.dataset.v; setMark(b, v === 1 ? 0 : v === 0.5 ? 1 : 0.5); upd(); }));
    upd();

  }
  if ($("#btn-again")) $("#btn-again").onclick = () => startSession("bai", s.subj, null, s.les);
  $("#btn-home").onclick = () => { session = null; renderHome(); window.scrollTo(0, 0); };
  $("#btn-stats2").onclick = renderStats;

  window.scrollTo(0, 0);
  if (sc >= 8) confetti();
}

/* ================= THỐNG KÊ ================= */
function histLabel(h) {
  if (h.les && LES[h.les]) return lesShort(LES[h.les]);
  if (h.set) return "Đề cương giữa kì – Đề " + h.set;
  if (h.pick && MODES[h.m]) return MODES[h.m].name + " (" + h.pick + " bài)";
  return MODES[h.m] ? MODES[h.m].name : h.m;
}
const lastSeen = () => { const h = store.hist.slice(-1)[0]; return h ? new Date(h.t).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""; };
function renderStats() {
  view = "stats";
  const H = store.hist;
  const graded = H.filter((h) => h.m !== "redo");
  const avg = graded.length ? graded.reduce((n, h) => n + scoreOf(h), 0) / graded.length : 0;
  const doneAll = LESSONS.filter((l) => (store.done[l.id] || 0) >= PASS).length;
  const last = graded.slice(-20);
  const W = 600, Hh = 200, pl = 34, pr = 14, pt = 14, pb = 28;
  const xs = (i) => pl + (last.length <= 1 ? (W - pl - pr) / 2 : (i * (W - pl - pr)) / (last.length - 1));
  const ys = (v) => pt + (1 - v / 10) * (Hh - pt - pb);
  const pts = last.map((h, i) => [xs(i), ys(scoreOf(h))]);
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = pts.length ? path + ` L${pts[pts.length - 1][0].toFixed(1)} ${ys(0)} L${pts[0][0].toFixed(1)} ${ys(0)} Z` : "";
  const chart = last.length ? `
    <svg viewBox="0 0 ${W} ${Hh}" class="chart" role="img" aria-label="Điểm ${last.length} lượt gần nhất">
      ${[0, 5, 10].map((v) => `<line x1="${pl}" x2="${W - pr}" y1="${ys(v)}" y2="${ys(v)}" stroke="var(--line)" stroke-width="1"/><text x="${pl - 8}" y="${ys(v) + 4}" text-anchor="end" fill="var(--muted)" font-size="12">${v}</text>`).join("")}
      <path d="${area}" fill="var(--accent-soft)"/>
      <path d="${path}" fill="none" stroke="var(--accent-ink)" stroke-width="2.5" stroke-linejoin="round"/>
      ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i === pts.length - 1 ? 5.5 : 3.5}" fill="${i === pts.length - 1 ? "var(--accent)" : "var(--surface)"}" stroke="var(--accent-ink)" stroke-width="2"/>`).join("")}
      <text x="${pts[pts.length - 1][0]}" y="${pts[pts.length - 1][1] - 10}" text-anchor="end" fill="var(--ink)" font-size="13" font-weight="700">${fmt1(last[last.length - 1].sc)}</text>
      <text x="${pl}" y="${Hh - 8}" fill="var(--muted)" font-size="12">Lượt cũ hơn</text>
      <text x="${W - pr}" y="${Hh - 8}" fill="var(--muted)" font-size="12" text-anchor="end">Gần nhất</text>
    </svg>` : `<p class="empty">Chưa có điểm nào. Làm bài đầu tiên để thấy biểu đồ tiến bộ.</p>`;
  const per = Object.keys(SUBJECTS).map((k) => {
    const hs = graded.filter((h) => h.s === k);
    const tot = LESSONS.filter((l) => l.s === k).length;
    const m = LESSONS.filter((l) => l.s === k && (store.done[l.id] || 0) >= PASS).length;
    return { k, n: hs.length, avg: hs.length ? hs.reduce((a, h) => a + scoreOf(h), 0) / hs.length : null, tot, m };
  });
  const hard = Object.entries(store.q).filter(([id, x]) => x.w > 0 && BY_ID[id]).sort((a, b) => b[1].w - a[1].w || a[1].b - b[1].b).slice(0, 8);
  $("#app").innerHTML = `
  <section class="stats">
    <div class="qbar"><button class="ghost" id="btn-back">${ICON.back} Trang chính</button><span class="qmeta">Thống kê học tập</span><span></span></div>
    <div class="tiles">
      <div class="tile"><span>Lượt làm bài</span><b>${H.length}</b></div>
      <div class="tile"><span>Điểm trung bình</span><b>${graded.length ? fmt1(avg) : "–"}</b></div>
      <div class="tile"><span>Chuỗi ngày ôn</span><b>${streak()}</b></div>
      <div class="tile"><span>Bài đã hoàn thành</span><b>${doneAll}<small>/${LESSONS.length}</small></b></div>
    </div>
    <div class="panel"><h2 class="sec">Điểm ${last.length || ""} lượt gần nhất</h2><div class="chart-wrap">${chart}</div></div>
    <div class="panel"><h2 class="sec">Theo môn</h2>
      <div class="per">${per.map((p) => `
        <div class="per-row" style="--sc:${SUBJECTS[p.k].c}">
          <span class="per-name">${SUBJECTS[p.k].name}</span>
          <span class="per-bar"><i style="width:${(p.m / p.tot) * 100}%"></i></span>
          <span class="per-num">${p.m}/${p.tot} bài xong · ${p.n} lượt · TB ${p.avg === null ? "–" : fmt1(p.avg)}</span>
        </div>`).join("")}</div>
    </div>
    ${hard.length ? `<div class="panel"><h2 class="sec">Câu hay sai nhất</h2><ol class="hard">${hard.map(([id, x]) => `<li><span class="tag" style="background:${SUBJECTS[BY_ID[id].s].c}">${esc(lesShort(LES[BY_ID[id].les]))}</span><span>${esc(BY_ID[id].q)}</span><em>sai ${x.w} lần${x.b === 0 ? " · đang chờ làm lại" : ""}</em></li>`).join("")}</ol></div>` : ""}
    <p class="sync-note">${cloudRef ? `Kết quả tự đồng bộ giữa các máy cùng tài khoản${lastSeen() ? ` · lượt mới nhất lúc ${lastSeen()}` : ""}` : "Đang lưu trên máy này"}</p>
    ${GAS || !mcpNS ? "" : `<div class="panel send-panel">
      <h2 class="sec">Kết quả từ máy của Gấu</h2>
      ${sheetId ? `<p class="hint">${mcpNS ? (SHEET_MSG[sheetStatus] || (sheetSeen ? "Đã đọc bảng tính lúc " + new Date(sheetSeen).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + ". Trang tự kiểm tra lại mỗi phút." : "")) : "Mở trang này trên Claude bằng tài khoản của mẹ để tự đọc bảng tính."}</p>
        <div class="row"><button class="ghost" id="btn-sheet-refresh">Đọc lại ngay</button><button class="ghost" id="btn-sheet-change">Đổi bảng tính</button></div>`
      : `<p class="hint">Dán link bảng tính nhận câu trả lời của biểu mẫu "Kết quả Gấu". Từ đó kết quả của Gấu tự hiện ở đây.</p>
        <label class="sa"><span>Link bảng tính</span><textarea id="sheet-url" rows="2" placeholder="https://docs.google.com/spreadsheets/d/…"></textarea></label>
        <div class="row"><button class="btn-start" id="btn-sheet-save">Lưu và đọc kết quả</button><span id="imp-msg" class="imp-msg" role="status"></span></div>`}
    </div>`}
    <div class="panel"><h2 class="sec">Lịch sử làm bài</h2>
      ${H.length ? `<div class="table-wrap"><table><thead><tr><th>Thời gian</th><th>Môn</th><th>Bài / kiểu ôn</th><th class="num">Đúng</th><th class="num">Điểm</th></tr></thead><tbody>
      ${H.slice().reverse().slice(0, 80).map((h) => `<tr><td>${new Date(h.t).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td><td>${SUBJECTS[h.s] ? SUBJECTS[h.s].short : "Trộn môn"}</td><td>${esc(histLabel(h))}</td><td class="num">${h.k}/${h.tot}</td><td class="num"><b class="sc ${scoreOf(h) >= 8 ? "hi" : scoreOf(h) >= 5 ? "mid" : "lo"}">${h.esc != null ? fmt2(scoreOf(h)) : fmt1(h.sc)}</b></td></tr>${h.es && h.es.some((x) => x.trim()) || h.dur || h.esc != null ? `<tr class="es-row"><td colspan="5">${h.esc != null ? `<small>Trắc nghiệm <b>${fmt2(h.tnp)} / ${fmt2(10 - (h.esMax || 3))}</b> · Tự luận <b>${fmt2(h.esc)} / ${fmt2(h.esMax || 3)}</b> · Tổng <b>${fmt2(scoreOf(h))} / 10</b></small> ` : ""}${h.dur ? `<small>Thời gian làm: ${mmss(h.dur)}</small>` : ""}${h.es && h.es.some((x) => x.trim()) ? `<details><summary>Xem bài tự luận con viết</summary>${h.es.map((x, k) => `<p><b>Câu ${k + 1}:</b> ${x.trim() ? esc(x).replace(/\n/g, "<br>") : "<i>(bỏ trống)</i>"}</p>`).join("")}</details>` : ""}</td></tr>` : ""}`).join("")}
      </tbody></table></div>` : `<p class="empty">Chưa có lượt làm bài nào.</p>`}
    </div>
  </section>`;
  $("#btn-back").onclick = () => { renderHome(); window.scrollTo(0, 0); };
  if ($("#btn-sheet-save")) $("#btn-sheet-save").onclick = () => {
    const id = parseSheetId($("#sheet-url").value);
    if (!id) { $("#imp-msg").textContent = "Link chưa đúng. Mẹ mở bảng tính, chép link trên thanh địa chỉ rồi dán vào nhé."; return; }
    sheetId = id; try { localStorage.setItem(SHEET_URL_KEY, id); } catch (e) {}
    watchSheet(); renderStats();
  };
  if ($("#btn-sheet-refresh")) $("#btn-sheet-refresh").onclick = async () => { if (!mcpNS) return; sheetStatus = "loading"; renderStats(); try { await mcpNS.invalidate("Google Sheets", "get_values"); } catch (e) {} watchSheet(); };
  if ($("#btn-sheet-change")) $("#btn-sheet-change").onclick = () => { if (sheetUnwatch) sheetUnwatch(); sheetUnwatch = null; sheetId = ""; try { localStorage.removeItem(SHEET_URL_KEY); } catch (e) {} renderStats(); };
  window.scrollTo(0, 0);
}



/* ================= CHẤM TỰ LUẬN TỰ ĐỘNG (so ý trong bài làm với đáp án) ================= */
const ES_STOP = new Set("va la cua co cac nhung mot de cho khi thi voi duoc nhu nen vi o trong tu the nao gi em ta con nay do day kia rat cung da dang se bi ra vao len xuong lai moi hay hoac neu ma thuoc tren duoi sau truoc giua theo bang ve nhieu it hon nhat can phai biet minh ho chung toi ban khong chua roi".split(" "));
const esNorm = (t) => plain(String(t).toLowerCase()).replace(/(\d)[\s.](?=\d{3}\b)/g, "$1").replace(/(\d)[\s.](?=\d{3}\b)/g, "$1").replace(/(\d),(\d)/g, "$1.$2").replace(/(\d)([a-z])/g, "$1 $2").replace(/([a-z])(\d)/g, "$1 $2");
const esToks = (t) => esNorm(t).split(/[^a-z0-9.]+/).map((w) => w.replace(/^\.+|\.+$/g, "")).filter(Boolean);
const isNum = (w) => /^\d+(\.\d+)?$/.test(w);
function gradeIdea(idea, ans, qToks) {
  const it = esToks(idea), at = esToks(ans);
  if (!at.length) return 0;
  const aset = new Set(at), abig = new Set(at.slice(1).map((w, i) => at[i] + " " + w));
  const content = [...new Set(it.filter((w) => !ES_STOP.has(w) && !isNum(w) && w.length > 1))];
  let tw = 0, mw = 0; content.forEach((w) => { const wt = qToks.has(w) ? 0.4 : 1; tw += wt; if (aset.has(w)) mw += wt; });
  const uni = tw ? mw / tw : 0;
  const big = [...new Set(it.slice(1).map((w, i) => [it[i], w]).filter(([a, b]) => !(ES_STOP.has(a) && ES_STOP.has(b)) && !isNum(a) && !isNum(b)).map(([a, b]) => a + " " + b))];
  const bi = big.length ? big.filter((x) => abig.has(x)).length / big.length : uni;
  let sc = Math.max(uni, 0.6 * uni + 0.4 * bi);
  let nums = [...new Set(it.filter(isNum))];
  const fresh = nums.filter((n) => !qToks.has(n));
  if (fresh.length) nums = fresh; // số con tự tính ra mới là ý chính
  if (nums.length) { const nf = nums.filter((n) => aset.has(n)).length / nums.length; sc = tw ? 0.35 * sc + 0.65 * nf : nf; if (fresh.length && nf === 0) sc = Math.min(sc, 0.2); }
  return sc >= 0.4 ? 1 : sc >= 0.22 ? 0.5 : 0;
}
const esFlat = (t) => " " + esNorm(t).replace(/[^a-z0-9.]+/g, " ").replace(/\.(?![0-9])/g, " ").replace(/\s+/g, " ").trim() + " ";
const KEY_RE = {};
function keyIdea(spec, flat) {
  const groups = spec.split(";").map((g) => g.split("|").map((k) => esFlat(k).trim()).filter(Boolean)).filter((g) => g.length);
  const hit = groups.filter((g) => g.some((k) => { const re = KEY_RE[k] || (KEY_RE[k] = new RegExp(" " + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + (/[0-9]$/.test(k) ? "(?![0-9])" : ""))); return re.test(flat); })).length;
  const f = groups.length ? hit / groups.length : 0;
  return f >= 0.6 ? 1 : f >= 0.3 ? 0.5 : 0;
}
function gradeEssay(e, ans) {
  const qToks = new Set(esToks(e.q));
  const keys = typeof ESSAY_KEYS !== "undefined" && ESSAY_KEYS[e.id];
  const flat = esFlat(ans || "");
  const marks = e.ideas.map((t, j) => !String(ans || "").trim() ? 0 : keys && keys[j] ? keyIdea(keys[j], flat) : gradeIdea(t, ans || "", qToks));
  let frac = marks.reduce((a, b) => a + b, 0) / e.ideas.length, copied = false;
  const at = esToks(ans || "").filter((w) => !ES_STOP.has(w));
  const qLen = esToks(e.q).filter((w) => !ES_STOP.has(w)).length;
  if (at.length >= 8 && at.length >= 0.6 * qLen && at.filter((w) => qToks.has(w)).length / at.length > 0.85) { frac *= 0.5; copied = true; } // chủ yếu chép lại đề
  return { marks, frac, copied };
}
const q4 = (x) => Math.round(x * 4) / 4;
const scoreOf = (h) => (h.tnp != null && h.esc != null ? Math.round((h.tnp + h.esc) * 100) / 100 : h.sc);
const fmt2 = (x) => (Math.round(x * 100) / 100).toLocaleString("vi-VN", { maximumFractionDigits: 2 });

/* ================= XUẤT ĐỀ WORD (.docx, Times New Roman 13) ================= */
const xe = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function para(text, o = {}) {
  const runs = (Array.isArray(text) ? text : [[text, o.b]]).map(([t, b]) =>
    `<w:r><w:rPr>${b ? "<w:b/>" : ""}<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="26"/></w:rPr><w:t xml:space="preserve">${xe(t)}</w:t></w:r>`).join("");
  return `<w:p><w:pPr>${o.center ? '<w:jc w:val="center"/>' : ""}<w:spacing w:before="${o.before || 0}" w:after="${o.after || 40}" w:line="276" w:lineRule="auto"/>${o.ind ? `<w:ind w:left="${o.ind}"/>` : ""}${o.keep ? "<w:keepNext/>" : ""}</w:pPr>${runs}</w:p>`;
}
const pageBreak = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
function docTitle(mode, subj, lesId, no, pickIds) {
  const sn = SUBJECTS[subj].name;
  if (mode === "bai") { const l = LES[lesId]; return `Đề ôn tập ${l.s === "ls" ? l.part : sn} – ${l.title} – Đề số ${no}`; }
  if (mode === "kttx") return `Đề ôn tập kiểm tra thường xuyên ${sn}${pickIds && pickIds.length ? " (" + pickIds.map((id) => lesShort(LES[id])).join(", ") + ")" : ""} – Đề số ${no}`;
  return `Đề ôn tập ${mode === "gk" ? "giữa" : "cuối"} học kì ${store.hk === 1 ? "I" : "II"} ${sn}${pickIds && pickIds.length ? " (" + pickIds.map((id) => lesShort(LES[id])).join(", ") + ")" : ""} – Đề số ${no}`;
}
async function exportDocx(mode, subj, lesId, pickIds, setNo) {
  const qs = setNo ? setQuestions(subj, setNo) : pickQuestions(mode, subj, lesId, pickIds);
  if (!qs.length) return;
  const key = setNo ? "set-" + subj + setNo : mode === "bai" ? "bai-" + lesId : mode + "-" + subj + (mode === "kttx" ? "" : "-hk" + store.hk);
  const no = setNo || (store.pr[key] || 0) + 1;
  const title = setNo ? "Đề ôn tập giữa kì " + DC_NAME[subj] + " – Đề số " + setNo : docTitle(mode, subj, lesId, no, pickIds);
  const essays = setNo ? DC_SETS[subj][setNo - 1].essays.map((id) => ESSAYS[id]) : [];
  const parts = { mc: qs.filter((q) => q.t === "mc"), tf: qs.filter((q) => q.t === "tf"), sa: qs.filter((q) => q.t === "sa") };
  let body = para(title, { b: 1, center: 1, after: 160 });
  let n = 0; const keyLines = [];
  const wts = setNo ? DC_SETS[subj][setNo - 1].weights : null;
  if (setNo) body += para("I. TRẮC NGHIỆM (" + (wts && DC_SETS[subj][setNo - 1].tnPts || 7) + " điểm)", { b: 1, before: 120, keep: 1 });
  const heads = setNo ? { mc: "Phần 1. Trắc nghiệm nhiều phương án lựa chọn" + (wts ? " (mỗi câu " + wts.mc.toLocaleString("vi-VN") + " điểm)" : ""), tf: "Phần 2. Trắc nghiệm đúng – sai" + (wts ? (wts.tfLinear ? " (mỗi câu có 4 ý a, b, c, d; mỗi ý đúng " + (wts.tf / 4).toLocaleString("vi-VN") + " điểm)" : " (mỗi câu " + fmt1(wts.tf) + " điểm; mỗi câu có 4 ý a, b, c, d)") : ""), sa: "Phần 3. Điền khuyết / trả lời ngắn" } : { mc: "PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn", tf: "PHẦN II. Câu trắc nghiệm đúng – sai", sa: "PHẦN III. Câu trắc nghiệm trả lời ngắn" };
  ["mc", "tf", "sa"].forEach((t) => {
    if (!parts[t].length) return;
    body += para(heads[t], { b: 1, before: 120, keep: 1 });
    parts[t].forEach((q) => {
      n++;
      body += para([["Câu " + n + ". ", true], [q.q, false]], { before: 60, keep: 1 });
      if (t === "mc") { q.opts.forEach((o, i) => (body += para("ABCD"[i] + ". " + o, { ind: 360, keep: i < 3 }))); keyLines.push(n + ". " + "ABCD"[q.ans]); }
      if (t === "tf") { q.st.forEach((s, i) => (body += para("abcd"[i] + ") " + s[0], { ind: 360, keep: i < 3 }))); keyLines.push(n + ". " + q.st.map((s, i) => "abcd"[i] + "-" + (s[1] ? "Đ" : "S")).join(", ")); }
      if (t === "sa") { body += para("Trả lời: ………………………", { ind: 360 }); keyLines.push(n + ". " + q.a[0]); }
    });
  });
  if (essays.length) {
    body += para("II. TỰ LUẬN (" + (DC_SETS[subj][setNo - 1].essayPts || 3) + " điểm)", { b: 1, before: 160, keep: 1 });
    essays.forEach((e, k) => {
      const lines = e.q.split("\n");
      body += para([["Câu " + (k + 1) + " (" + fmt1((DC_SETS[subj][setNo - 1].essayPts || 3) / essays.length) + " điểm). ", true], [lines[0], false]], { before: 60 });
      lines.slice(1).forEach((ln) => (body += para(ln, { ind: 360 })));
      for (let r = 0; r < 6; r++) body += para("………………………………………………………………………………………………………………");
    });
  }
  body += pageBreak + para("ĐÁP ÁN – Đề số " + no, { b: 1, center: 1, after: 120 });
  if (essays.length) body += para("I. Trắc nghiệm", { b: 1, before: 60 });
  keyLines.forEach((k) => (body += para(k)));
  if (essays.length) {
    body += para("II. Tự luận – gợi ý trả lời", { b: 1, before: 120 });
    essays.forEach((e, k) => { body += para("Câu " + (k + 1) + ":", { b: 1, before: 60 }); e.ideas.forEach((t) => (body += para("– " + t, { ind: 360 }))); });
  }
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1418" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  try {
    if (typeof JSZip === "undefined") throw { code: "nozip" };
    const dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null;
    if (!dl) { toast("Chỗ đang mở trang này không tải tệp được. Hãy mở trang trên claude.ai để tải đề."); return; }
    const zip = new JSZip();
    zip.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>');
    zip.file("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
    zip.file("word/_rels/document.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
    zip.file("word/styles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/><w:lang w:val="vi-VN"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>');
    zip.file("word/document.xml", doc);
    const blob = await zip.generateAsync({ type: "blob" });
    const base = setNo ? (subj === "ls" ? "Su-Dia" : "GDCD") + "-De-cuong-giua-ki" : mode === "bai" ? SUBJECTS[subj].short + "-" + lesShort(LES[lesId]) : SUBJECTS[subj].short + "-" + MODES[mode].name;
    const fname = plain(base).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-de-" + no + ".docx";
    await dl.save({ filename: fname, data: blob });
    if (!setNo) store.pr[key] = no;
    qs.forEach((q) => { const st = store.q[q.id] || { n: 0, w: 0, b: -1, l: 0 }; st.n++; st.l = store.hist.length; store.q[q.id] = st; });
    save();
    toast("Đã tải Đề số " + no + ". Mở bằng Word để in.");
  } catch (e) {
    if (e && e.code === "declined") return;
    if (e && e.code === "rate_limited") { toast("Đang có một tệp chờ xác nhận. Thử lại sau giây lát."); return; }
    toast("Chưa tải được đề. Thử lại sau nhé.");
  }
}

/* ================= HIỆU ỨNG ================= */
function confetti() {
  if (reduceMotion()) return;
  const cv = document.createElement("canvas");
  cv.className = "confetti"; document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  const w = (cv.width = innerWidth), h = (cv.height = innerHeight);
  const cols = ["#F6B73C", "#E2683C", "#2BAE7E", "#8A63E8", "#E2537D", "#3A86E8"];
  const ps = Array.from({ length: 120 }, () => ({ x: w / 2 + (Math.random() - 0.5) * 120, y: h * 0.35, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, c: cols[(Math.random() * cols.length) | 0], a: Math.random() * 6 }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, w, h);
    ps.forEach((p) => { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.a += 0.2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    if (++f < 110) requestAnimationFrame(tick); else cv.remove();
  })();
}

/* ================= KHỞI ĐỘNG ================= */
renderHome();
initCloud();
initSheetReader();
requestAnimationFrame(tick);
