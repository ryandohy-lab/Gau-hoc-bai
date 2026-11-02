/* ===== ĐỀ ÔN GIỮA KÌ I – TIN HỌC 6 (Bài 1 – Bài 5) =====
   Cấu trúc: 12 câu chọn đáp án (0,25đ/câu) + 4 câu đúng – sai dạng tình huống (mỗi ý 0,25đ) + 3 câu tự luận (1đ/câu). */
function TFS(q, st) { _push({ t: "tf", q, st: st.map((x) => [x.slice(1), x[0] === "+"]), scen: 1 }); }

/* --- Bài 1. Thông tin và dữ liệu --- */
VL("t1");
M("Phát biểu nào sau đây là đúng?",["Thông tin đem lại hiểu biết cho con người về thế giới xung quanh và về chính mình","Dữ liệu chỉ có thể là chữ viết","Vật mang tin luôn luôn là giấy","Thông tin không cần đến dữ liệu"]);
M("Đâu KHÔNG phải là vật mang tin?",["Không khí trong phòng","Đĩa CD","Tờ báo","Thẻ nhớ"]);
M("Khi xem bản tin thời sự, hình ảnh và âm thanh trên tivi là",["Dữ liệu được truyền đến người xem","Vật mang tin","Thiết bị ra","Phần mềm"]);
TFS("Tình huống: Sáng nay An nghe bản tin dự báo: “Hà Nội hôm nay có mưa rào, nhiệt độ từ 22 đến 27°C”. An quyết định mang áo mưa khi đi học.",["+a) Bản tin dự báo thời tiết cho An thông tin để đưa ra quyết định.","+b) Các con số “22 đến 27°C” là dữ liệu.","-c) Chiếc áo mưa là vật mang tin.","+d) Nhờ có thông tin, An chủ động hơn trong việc chuẩn bị đi học."]);
TFS("Thông tin: Cô giáo ghi điểm kiểm tra của cả lớp vào sổ điểm điện tử, tính điểm trung bình rồi gửi nhận xét cho phụ huynh qua tin nhắn.",["+a) Điểm kiểm tra của từng bạn là dữ liệu.","+b) Lời nhận xét “con học tiến bộ” là thông tin rút ra từ dữ liệu.","-c) Sổ điểm điện tử không phải là vật mang tin.","+d) Thông tin giúp phụ huynh biết tình hình học tập của con."]);
TFS("Tình huống: Trên đường đến trường, Minh thấy đèn giao thông chuyển sang màu đỏ nên dừng xe lại.",["+a) Đèn đỏ cho Minh thông tin rằng phải dừng lại.","+b) Cột đèn giao thông là vật mang tin.","-c) Việc Minh dừng xe không liên quan gì đến thông tin.","+d) Thông tin giúp mọi người tham gia giao thông an toàn."]);
TFS("Thông tin: Lan ghi chép bài giảng vào vở, chụp ảnh sơ đồ trên bảng và lưu vào điện thoại.",["+a) Quyển vở là vật mang tin.","+b) Điện thoại cũng có thể là vật mang tin.","-c) Bức ảnh chụp sơ đồ không chứa dữ liệu.","+d) Ghi chép giúp Lan lưu trữ thông tin để ôn tập sau."]);

/* --- Bài 2. Xử lí thông tin --- */
VL("t2");
M("Thiết bị nào vừa là thiết bị vào, vừa là thiết bị ra?",["Màn hình cảm ứng","Bàn phím","Loa","Máy in"]);
M("Bộ nhớ của máy tính dùng để",["Lưu trữ dữ liệu","Hiển thị hình ảnh","Phát ra âm thanh","In văn bản"]);
M("Khi em nghe cô giảng bài, tai của em thực hiện hoạt động",["Thu nhận thông tin","Lưu trữ thông tin","Truyền thông tin","Xóa thông tin"]);
TFS("Tình huống: Hoa đọc đề bài toán (1), suy nghĩ tìm cách giải (2), viết lời giải vào vở (3) và đọc kết quả cho cô giáo nghe (4).",["+a) Bước (1) là thu nhận thông tin.","+b) Bước (2) là xử lí thông tin.","+c) Bước (3) là lưu trữ thông tin.","-d) Bước (4) là thu nhận thông tin."]);
TFS("Thông tin: Khi em gõ chữ bằng bàn phím, máy tính hiển thị chữ lên màn hình và có thể in ra giấy bằng máy in.",["+a) Bàn phím là thiết bị vào.","+b) Màn hình và máy in là thiết bị ra.","-c) Bộ xử lí (CPU) là thiết bị ra.","+d) Máy tính có thể lưu văn bản vào bộ nhớ để dùng lại."]);
TFS("Tình huống: Mẹ đưa thẻ vào máy ATM, nhập mã PIN; máy kiểm tra tài khoản, nhả tiền và in hóa đơn.",["+a) Bàn phím để nhập mã PIN là thiết bị vào.","+b) Việc máy kiểm tra tài khoản là hoạt động xử lí thông tin.","+c) Hóa đơn được in ra nhờ thiết bị ra.","-d) Máy ATM không thực hiện hoạt động xử lí thông tin nào."]);
TFS("Thông tin: Máy tính xử lí thông tin nhanh, chính xác, lưu trữ được lượng lớn dữ liệu và có thể làm việc liên tục nhiều giờ.",["+a) Máy tính giúp con người xử lí thông tin hiệu quả hơn.","+b) Máy tính có thể làm việc nhiều giờ liền.","-c) Máy tính có thể tự suy nghĩ và có cảm xúc như con người.","+d) Máy tính vẫn cần con người ra lệnh, điều khiển."]);

/* --- Bài 3. Thông tin trong máy tính --- */
VL("t3");
M("Dãy bit là",["Dãy các kí hiệu 0 và 1","Dãy các chữ cái A đến Z","Dãy các số từ 0 đến 9","Dãy các hình ảnh"]);
M("Các đơn vị đo dung lượng được sắp xếp theo thứ tự tăng dần là",["Byte, KB, MB, GB","GB, MB, KB, Byte","KB, Byte, MB, GB","MB, KB, GB, Byte"]);
M("1 MB bằng bao nhiêu KB?",["1024 KB","1000 KB","100 KB","8 KB"]);
TFS("Thông tin: Một chiếc USB có dung lượng 8 GB. Nam muốn lưu các bức ảnh, mỗi ảnh có dung lượng 4 MB.",["+a) 1 GB = 1024 MB.","+b) USB có dung lượng 8 × 1024 = 8192 MB.","+c) USB chứa được khoảng 2048 bức ảnh.","-d) USB chỉ chứa được khoảng 32 bức ảnh."]);
TFS("Thông tin: Trong máy tính, mọi dữ liệu như chữ, số, hình ảnh, âm thanh đều được biểu diễn bằng dãy bit.",["+a) Bit là đơn vị nhỏ nhất dùng để đo lượng thông tin.","+b) Mỗi bit nhận một trong hai giá trị 0 hoặc 1.","-c) 1 byte = 10 bit.","+d) Âm thanh cũng được lưu trong máy tính dưới dạng dãy bit."]);
TFS("Tình huống: Điện thoại của Mai báo “Bộ nhớ còn trống 500 MB”. Mai muốn tải về một bộ phim dung lượng 1,2 GB.",["+a) 1,2 GB lớn hơn 500 MB.","-b) Mai tải được bộ phim vì bộ nhớ còn đủ chỗ.","+c) Mai có thể xóa bớt ảnh, video không cần thiết để có thêm chỗ trống.","+d) Thẻ nhớ, USB là các thiết bị lưu trữ."]);
TFS("Thông tin: Một tệp văn bản có dung lượng 2 KB.",["+a) 2 KB = 2048 byte.","+b) 2 KB = 16 384 bit.","-c) 2 KB lớn hơn 1 MB.","+d) Đơn vị KB nhỏ hơn đơn vị MB."]);

/* --- Bài 4. Mạng máy tính --- */
VL("t4");
M("Thiết bị nào sau đây là thiết bị đầu cuối?",["Máy tính bảng","Bộ định tuyến","Bộ chuyển mạch","Dây cáp mạng"]);
M("Mạng có dây truyền thông tin qua",["Dây cáp","Sóng điện từ","Ánh sáng Mặt Trời","Âm thanh"]);
M("Phần mềm mạng có vai trò",["Giúp các thiết bị giao tiếp và chia sẻ dữ liệu với nhau","Làm máy tính nặng hơn","Thay thế dây cáp","Thay thế màn hình"]);
TFS("Tình huống: Nhà Bình có 2 máy tính, 1 điện thoại và 1 máy in cùng kết nối với bộ phát Wi-Fi để dùng Internet và in tài liệu.",["+a) Các thiết bị trong nhà Bình tạo thành một mạng máy tính.","+b) Bộ phát Wi-Fi (bộ định tuyến) là thiết bị kết nối.","+c) Máy tính và điện thoại là thiết bị đầu cuối.","-d) Máy in không thể dùng chung qua mạng."]);
TFS("Thông tin: Phòng máy của trường có 30 máy tính được nối với nhau bằng dây cáp mạng qua một bộ chuyển mạch (switch).",["+a) Đây là mạng có dây.","+b) Bộ chuyển mạch là thiết bị kết nối.","-c) Mạng có dây truyền thông tin bằng sóng điện từ.","+d) Các máy trong phòng có thể chia sẻ dữ liệu với nhau."]);
TFS("Tình huống: Cô giáo để bài tập trên một máy tính chung của phòng máy; học sinh ở các máy khác mở ra làm bài.",["+a) Đây là lợi ích chia sẻ dữ liệu của mạng máy tính.","+b) Nếu không có mạng, học sinh có thể phải chép bài qua USB.","-c) Mạng máy tính chỉ dùng để chơi trò chơi.","+d) Phần mềm mạng giúp các máy giao tiếp với nhau."]);
TFS("Thông tin: Mạng không dây (Wi-Fi) truyền thông tin bằng sóng điện từ; mạng có dây truyền thông tin bằng dây cáp.",["+a) Điện thoại thường kết nối mạng không dây.","+b) Mạng không dây thuận tiện khi di chuyển.","-c) Mạng không dây luôn cần dây cáp nối đến từng thiết bị.","+d) Một gia đình có thể dùng kết hợp cả mạng có dây và mạng không dây."]);

/* --- Bài 5. Internet --- */
VL("t5");
M("Dịch vụ nào sau đây KHÔNG phải là dịch vụ trên Internet?",["Giao hàng bằng xe máy","Thư điện tử","Học trực tuyến","Xem video trực tuyến"]);
M("Để kết nối Internet, gia đình thường phải",["Đăng kí với nhà cung cấp dịch vụ Internet","Mua thêm máy in","Mua thêm loa","Cài phần mềm vẽ tranh"]);
M("Tính “dễ tiếp cận” của Internet nghĩa là",["Có thể truy cập ở nhiều nơi, nhiều lúc khi có kết nối","Chỉ truy cập được ở trường","Chỉ người lớn mới truy cập được","Không cần thiết bị vẫn truy cập được"]);
TFS("Tình huống: Em dùng Internet để học trực tuyến, xem video bài giảng và tìm tài liệu cho bài thuyết trình.",["+a) Internet giúp việc học tập thuận tiện hơn.","+b) Internet là mạng kết nối các mạng máy tính trên khắp thế giới.","-c) Internet thuộc quyền sở hữu của một công ty duy nhất.","+d) Cần chọn nguồn thông tin tin cậy khi tìm tài liệu."]);
TFS("Thông tin: Tùng dùng điện thoại lướt mạng xã hội đến 1 giờ sáng mỗi ngày, sáng hôm sau thường buồn ngủ trong lớp.",["+a) Tùng đang sử dụng Internet chưa hợp lí.","+b) Dùng Internet quá nhiều có thể ảnh hưởng đến sức khỏe và học tập.","-c) Dùng Internet càng lâu càng tốt cho học sinh.","+d) Tùng nên đặt giới hạn thời gian sử dụng mỗi ngày."]);
TFS("Thông tin về đặc điểm của Internet: tính toàn cầu, tính tương tác, tính dễ tiếp cận, không thuộc quyền sở hữu của ai.",["+a) Người ở nhiều quốc gia có thể kết nối với nhau qua Internet.","+b) Tính tương tác cho phép người dùng trao đổi, bình luận, phản hồi.","+c) Có thể truy cập Internet từ máy tính, điện thoại, máy tính bảng.","-d) Chỉ người lớn mới được phép truy cập Internet."]);
TFS("Tình huống: Một người lạ nhắn tin cho Hương qua mạng: “Gửi cho anh ảnh và địa chỉ nhà em, anh sẽ tặng quà.”",["+a) Hương không nên gửi thông tin cá nhân cho người lạ.","+b) Hương nên báo cho bố mẹ hoặc thầy cô biết.","-c) Mọi người trên Internet đều đáng tin cậy.","+d) Internet có cả thông tin có ích và thông tin có hại."]);

/* --- Tự luận (mỗi câu 1 điểm) – dạng vận dụng, theo mẫu phụ huynh cung cấp --- */
ESSAY("th1","t1","Bạn Hà đo nhiệt độ cơ thể được 38,5°C. Mẹ thấy vậy liền cho Hà nghỉ học và đưa đi khám. Em hãy chỉ ra đâu là dữ liệu, đâu là thông tin trong tình huống trên, và thông tin đó đã giúp mẹ Hà như thế nào?",["Dữ liệu: con số 38,5°C đo được trên nhiệt kế.","Thông tin: Hà đang bị sốt (thân nhiệt cao hơn mức bình thường khoảng 37°C).","Thông tin giúp mẹ đưa ra quyết định: cho Hà nghỉ học, đưa đi khám kịp thời."]);
ESSAY("th3","t1","Trước chuyến dã ngoại, lớp em cần biết: thời tiết hôm đi, đường đến địa điểm và giờ xuất phát. Em sẽ thu nhận những thông tin đó từ đâu? Những thông tin đó giúp lớp em quyết định điều gì?",["Thời tiết: bản tin dự báo trên tivi, ứng dụng thời tiết, trang web dự báo.","Đường đi: bản đồ giấy hoặc ứng dụng bản đồ trên điện thoại.","Giờ xuất phát: thông báo của cô giáo chủ nhiệm, nhóm tin nhắn của lớp.","Thông tin giúp lớp quyết định: mang áo mưa hay mũ nón, chọn đường đi, có mặt đúng giờ."]);
ESSAY("th4","t2","Em dùng điện thoại chụp một bức ảnh rồi gửi cho bà qua tin nhắn. Hãy mô tả 4 hoạt động xử lí thông tin diễn ra trong tình huống này và bộ phận nào của điện thoại thực hiện.",["Thu nhận: camera của điện thoại thu nhận hình ảnh (thiết bị vào).","Xử lí: bộ xử lí của điện thoại biến đổi hình ảnh thành dãy bit, nén ảnh.","Lưu trữ: ảnh được lưu vào bộ nhớ của điện thoại.","Truyền: ảnh được gửi qua mạng đến điện thoại của bà và hiển thị trên màn hình (thiết bị ra)."]);
ESSAY("th5","t2","Máy bán nước tự động hoạt động như sau: khách bỏ tiền vào khe, bấm nút chọn loại nước; máy kiểm tra số tiền, rồi trả chai nước và tiền thừa, màn hình hiện “Cảm ơn quý khách”. Hãy chỉ ra thiết bị vào, bộ xử lí và thiết bị ra của máy.",["Thiết bị vào: khe nhận tiền, các nút bấm chọn loại nước.","Bộ xử lí: bộ phận kiểm tra số tiền, tính tiền thừa, ra lệnh trả nước.","Thiết bị ra: khay trả chai nước, khay trả tiền thừa, màn hình hiển thị lời cảm ơn.","Máy cũng có bộ nhớ lưu giá các loại nước và số lượng còn lại."]);
ESSAY("th6","t3","Cho một lưới ô vuông 3 hàng × 10 cột. Quy ước ô màu đen (■) biểu thị kí hiệu “1”, ô màu trắng (□) biểu thị kí hiệu “0”.\nHàng a: □ ■ □ ■ □ ■ □ ■ □ ■\nHàng b: ■ □ ■ □ ■ □ ■ □ ■ □\nHàng c: □ ■ □ ■ □ ■ □ ■ □ ■\na) Viết dãy bit biểu diễn cho mỗi hàng.\nb) Giải thích tại sao một byte không đủ để lưu trữ một hàng. Cần tối thiểu bao nhiêu byte để lưu trữ cả ba hàng?",["a) Hàng a: 0101010101; hàng b: 1010101010; hàng c: 0101010101.","b) Mỗi hàng có 10 ô → cần 10 bit; mà 1 byte = 8 bit < 10 bit nên một byte không đủ lưu một hàng.","Cả ba hàng có 3 × 10 = 30 bit.","30 : 8 = 3,75 → cần tối thiểu 4 byte để lưu trữ cả ba hàng (nếu lưu riêng từng hàng thì mỗi hàng 2 byte, cần 6 byte)."]);
ESSAY("th7","t3","Trong thư mục máy tính có hai tệp bài trình chiếu: “Bài 1” có dung lượng 17 028 KB và “Bài 2” có dung lượng 16 136 KB. Em hãy quy đổi dung lượng của các tệp này xấp xỉ ra MB. Nếu em soạn thêm nội dung vào bài trình chiếu thì dung lượng có thay đổi không? Vì sao?",["Vì 1 MB = 1024 KB nên muốn đổi KB ra MB ta chia cho 1024.","Bài 1: 17 028 : 1024 ≈ 16,6 MB (khoảng 17 MB).","Bài 2: 16 136 : 1024 ≈ 15,8 MB (khoảng 16 MB).","Khi soạn thêm nội dung, dung lượng tệp sẽ tăng lên, vì có thêm dữ liệu (chữ, hình ảnh…) cần được lưu trữ bằng nhiều bit hơn."]);
ESSAY("th8","t3","Một thẻ nhớ có dung lượng 2 GB đã dùng hết 1,5 GB. Mỗi bài hát có dung lượng 4 MB. Hỏi thẻ nhớ còn chứa được tối đa bao nhiêu bài hát? Trình bày cách tính.",["Dung lượng còn trống: 2 GB − 1,5 GB = 0,5 GB.","Đổi đơn vị: 0,5 GB = 0,5 × 1024 = 512 MB.","Số bài hát: 512 : 4 = 128 bài.","Kết luận: thẻ nhớ còn chứa được tối đa 128 bài hát."]);
ESSAY("th16","t3","Một chiếc USB có dung lượng 16 GB. Mỗi bức ảnh có dung lượng khoảng 8 MB. Hỏi USB chứa được tối đa bao nhiêu bức ảnh? Nếu mỗi ảnh được chụp với chất lượng cao hơn (dung lượng 16 MB) thì số ảnh thay đổi thế nào?",["Đổi đơn vị: 16 GB = 16 × 1024 = 16 384 MB.","Số ảnh 8 MB: 16 384 : 8 = 2048 bức ảnh.","Số ảnh 16 MB: 16 384 : 16 = 1024 bức ảnh.","Ảnh chất lượng cao chứa nhiều dữ liệu hơn nên dung lượng lớn hơn → USB chứa được ít ảnh hơn (giảm một nửa)."]);
ESSAY("th9","t4","Mạng điện thoại di động là một hệ thống viễn thông không dây cho phép các thiết bị di động (như điện thoại thông minh) kết nối và liên lạc với nhau trên một khu vực rộng lớn. Theo em, lợi ích chính của mạng này là gì?",["Giúp mọi người liên lạc (gọi điện, nhắn tin) mọi lúc, mọi nơi, kể cả khi đang di chuyển.","Không cần dây nối nên rất thuận tiện, phủ sóng trên khu vực rộng lớn.","Cho phép truy cập Internet trên điện thoại: tìm thông tin, học trực tuyến, gọi video.","Hỗ trợ kịp thời trong trường hợp khẩn cấp (gọi cấp cứu 115, cứu hỏa 114…)."]);
ESSAY("th10","t4","Lớp tin học có 10 máy tính nhưng chỉ có 1 máy in. Nếu các máy tính không được nối mạng thì việc in tài liệu gặp khó khăn gì? Khi nối mạng thì có lợi ích gì? Cần những thành phần nào để tạo mạng?",["Không có mạng: phải chép tài liệu sang USB rồi mang đến máy nối với máy in → mất thời gian, bất tiện.","Có mạng: mọi máy đều in được qua máy in dùng chung; có thể chia sẻ tài liệu giữa các máy.","Thành phần: thiết bị đầu cuối (10 máy tính, máy in).","Thiết bị kết nối (bộ chuyển mạch, dây cáp hoặc bộ phát Wi-Fi) và phần mềm mạng."]);
ESSAY("th11","t4","Nhà em muốn dùng Internet cho 1 máy tính để bàn đặt cố định ở phòng làm việc và 3 chiếc điện thoại thông minh. Em đề xuất dùng mạng có dây hay mạng không dây cho từng loại thiết bị? Vì sao?",["Máy tính để bàn: nên dùng mạng có dây (cáp mạng) vì máy đặt cố định, kết nối ổn định, nhanh.","Điện thoại: dùng mạng không dây (Wi-Fi) vì điện thoại hay di chuyển, không có cổng cắm dây.","Có thể dùng một bộ định tuyến vừa có cổng cắm dây, vừa phát Wi-Fi.","Cần đặt mật khẩu Wi-Fi để bảo vệ mạng gia đình."]);
ESSAY("th12","t5","Em cần tìm tư liệu cho bài thuyết trình “Bảo vệ môi trường”. Internet giúp em những gì? Em cần lưu ý gì khi sử dụng thông tin tìm được trên Internet?",["Internet giúp tìm kiếm nhanh bài viết, hình ảnh, video, số liệu về môi trường.","Có thể học hỏi, trao đổi với thầy cô, bạn bè qua thư điện tử, nhắn tin.","Lưu ý: chọn trang web tin cậy, đối chiếu nhiều nguồn vì thông tin trên Internet có thể sai.","Ghi rõ nguồn khi sử dụng hình ảnh, tư liệu; không sao chép nguyên văn."]);
ESSAY("th13","t5","Vì sao nói Internet có tính toàn cầu, tính tương tác và tính dễ tiếp cận? Lấy ví dụ cho mỗi đặc điểm.",["Toàn cầu: Internet kết nối máy tính ở khắp các quốc gia. Ví dụ: em có thể gọi video cho người thân ở nước ngoài.","Tương tác: người dùng có thể trao đổi, bình luận, phản hồi. Ví dụ: học trực tuyến, hỏi đáp với thầy cô.","Dễ tiếp cận: truy cập được ở nhiều nơi, nhiều lúc, trên nhiều thiết bị. Ví dụ: dùng điện thoại tra cứu thông tin khi đang ở ngoài đường.","Internet không thuộc quyền sở hữu của ai."]);
ESSAY("th14","t5","Một người lạ nhắn tin cho em qua mạng xã hội, hứa sẽ tặng quà nếu em gửi ảnh và địa chỉ nhà. Em sẽ xử lí tình huống này thế nào? Vì sao?",["Không trả lời, không gửi ảnh, địa chỉ hay bất kì thông tin cá nhân nào.","Báo ngay cho bố mẹ, thầy cô; có thể chặn tài khoản lạ đó.","Vì kẻ xấu có thể lợi dụng thông tin cá nhân để lừa đảo, bắt cóc hoặc làm hại em.","Internet có cả thông tin có ích và có hại, cần sử dụng an toàn, cảnh giác."]);
ESSAY("th15","t5","Bạn của em thường chơi trò chơi trực tuyến đến khuya nên hay đi học muộn và buồn ngủ trong lớp. Em hãy đưa ra lời khuyên cho bạn.",["Chỉ ra tác hại: thiếu ngủ, ảnh hưởng sức khỏe, mắt, kết quả học tập giảm sút.","Khuyên bạn đặt giới hạn thời gian chơi, không chơi vào buổi tối muộn.","Lập thời gian biểu cân đối giữa học tập, nghỉ ngơi và giải trí.","Thay bằng hoạt động lành mạnh (thể thao, đọc sách); nhờ bố mẹ giúp nếu khó tự điều chỉnh."]);

/* --- 5 đề Tin học --- */
const TH_GK_SETS = (() => {
  const les = ["t1", "t2", "t3", "t4", "t5"];
  const mcBy = les.map((l) => BANK.filter((q) => q.les === l && q.t === "mc"));
  const tfBy = les.map((l) => BANK.filter((q) => q.les === l && q.scen));
  const tfPlan = [[0, 1, 2, 3], [1, 2, 3, 4], [0, 2, 3, 4], [0, 1, 2, 4], [0, 1, 3, 4]];
  const tfIdx = [[0, 0, 0, 0], [1, 1, 1, 0], [1, 2, 2, 1], [2, 2, 3, 2], [3, 3, 3, 3]];
  const mcCount = [3, 2, 3, 2, 2];
  const essays = [["th1", "th6", "th9"], ["th4", "th7", "th12"], ["th3", "th10", "th8"], ["th5", "th16", "th14"], ["th11", "th13", "th15"]];
  const sets = [];
  for (let d = 0; d < 5; d++) {
    const mc = [];
    les.forEach((l, i) => {
      const list = mcBy[i], n = mcCount[(i + d) % 5];
      for (let k = 0, got = 0; got < n && k < list.length * 2; k++) { const q = list[(d * 3 + k * 2) % list.length]; if (!mc.includes(q.id)) { mc.push(q.id); got++; } }
    });
    const tf = tfPlan[d].map((li, j) => tfBy[li][tfIdx[d][j] % tfBy[li].length].id);
    sets.push({ no: d + 1, mc: mc.concat(tf), essays: essays[d], weights: { mc: 0.25, tf: 1, sa: 0.25 }, tfLinear: true });
  }
  return sets;
})();
