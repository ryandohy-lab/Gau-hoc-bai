/* KHO CÂU HỎI THEO BÀI — Kết nối tri thức lớp 6.
   L(môn, mã bài, tên bài, giai đoạn, phần)   giai đoạn: 1 = nửa đầu HK I, 2 = nửa sau HK I, 3 = nửa đầu HK II, 4 = nửa sau HK II
   M(câu hỏi, [ĐÁP ÁN ĐÚNG, sai, sai, sai], nâng cao?)   — đáp án được xáo khi làm bài
   T(câu dẫn, ["+ý đúng", "-ý sai", ...], nâng cao?)
   S(câu hỏi, "đáp án|cách viết khác", gợi ý?, nâng cao?) */
const LESSONS = [];
const BANK = [];
let _L = null;
function L(s, id, title, k, part) { _L = { s, id, title, k, part: part || "", n: 0 }; LESSONS.push(_L); }
function _push(o) { _L.n++; o.id = _L.id + "-" + _L.n; o.s = _L.s; o.les = _L.id; o.k = _L.k; o.lv = o.lv ? 2 : 1; BANK.push(o); }
function M(q, o, lv) { _push({ t: "mc", q, o, a: 0, lv }); }
function T(q, st, lv) { _push({ t: "tf", q, st: st.map((x) => [x.slice(1), x[0] === "+"]), lv }); }
function S(q, a, h, lv) {
  if (typeof h === "number") { lv = h; h = ""; }
  const ans = a.split("|");
  _push({ t: "sa", q, a: ans, h: h || (ans.every((x) => /^[\d.,]+$/.test(x)) ? "Chỉ ghi số" : "Ghi ngắn gọn"), lv });
}
