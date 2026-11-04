# Gấu học bài — trang ôn tập lớp 6 (KNTT)

Trang web tĩnh trên GitHub Pages: https://ryandohy-lab.github.io/Gau-hoc-bai/ (bé mở trên iPad, "Thêm vào Màn hình chính").

- Mã nguồn trong `src/`: ngân hàng câu hỏi `b0_core.js` … `b10_kh_gk.js`, từ khóa chấm tự luận `b11_keys.js`, câu bổ sung `b12_more_*.js`, ứng dụng `app.js`, giao diện `shell.html`.
- Sửa nguồn trong `src/`, rồi chạy `python3 src/build.py` để tạo lại `index.html` ở gốc kho, commit và push lên `main` — Pages tự cập nhật sau ~1 phút.
- Trên web (không phải claude.ai), mỗi lần nộp bài trang tự gửi kết quả vào Google Biểu mẫu của mẹ (`FORM_POST`, `entry.1182834105` = tóm tắt, `entry.295419570` = dữ liệu JSON) → bảng tính câu trả lời của biểu mẫu.
- Bản trên claude.ai (artifact của mẹ và bản cho bé) dựng từ cùng `shell.html` + `app.js`: thay `/*BANK*/` và `/*APP*/`, không có phần `<head>` ở trên.
- Kết quả lưu trong `localStorage` khóa `von6-state-v1`; giữ nguyên khóa này để không mất lịch sử của bé khi cập nhật.
