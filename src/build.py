"""Ghép mã nguồn thành trang web index.html (chạy: python3 src/build.py ở thư mục gốc kho)."""
import pathlib, time
src = pathlib.Path(__file__).parent
parts = ["b0_core.js", "b1_ls.js", "b2_dl.js", "b3_kh.js", "b4_cn_gd_th.js", "b5_vd.js", "b6_gd_gk.js",
         "b7_ls_gk.js", "b8_th_gk.js", "b9_cn_gk.js", "b10_kh_gk.js", "b11_keys.js", "b12_more_ls.js", "b13_more_kh.js", "b14_more_ls2.js", "b15_more_kh2.js", "b16_more_th_cn_gd.js", "b17_nc1.js", "b18_nc2.js"]
bank = "".join((src / p).read_text() for p in parts)
page = (src / "shell.html").read_text().replace("/*BANK*/", bank).replace("/*APP*/", (src / "app.js").read_text())
head = """<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Gấu học bài">
<meta name="theme-color" content="#F5B83D">
<link rel="icon" href="icon.svg"><link rel="apple-touch-icon" href="icon.png">
</head><body>
"""
page = page.replace('const APP_VER = "__VER__";', 'const APP_VER = "%d";' % int(time.time()))
(src.parent / "index.html").write_text(head + page + "\n</body></html>\n")
print("index.html built")
