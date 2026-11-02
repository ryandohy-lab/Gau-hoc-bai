/* ===== ĐỀ CƯƠNG GIỮA KÌ I – LỊCH SỬ & ĐỊA LÍ 6 (THCS Nguyễn Du, năm học 2026 – 2027) =====
   Đáp án theo sách giáo khoa Kết nối tri thức (không theo bài làm trên đề cương). */
function DCT(q, st) { _push({ t: "tf", q, st: st.map((x) => [x.slice(1), x[0] === "+"]), src: "dc" }); }
function DCS(q, a, h) { const ans = a.split("|"); _push({ t: "sa", q, a: ans, h: h || "Ghi ngắn gọn", src: "dc" }); }

/* --- PHÂN MÔN LỊCH SỬ: trắc nghiệm nhiều lựa chọn (20 câu) --- */
VL("s4");
DC("Con người có nguồn gốc từ đâu?",["Loài Vượn người.","Do Chúa trời tạo ra.","Loài khỉ.","Từ bọc trăm trứng."],0);
DC("Ở Việt Nam, dấu tích Người tối cổ được tìm thấy ở những địa điểm nào?",["Núi Đọ (Thanh Hóa), Xuân Lộc (Đồng Nai).","Cổ Loa (Hà Nội), Hoa Lư (Ninh Bình).","Óc Eo (An Giang), Phù Nam (Nam Bộ).","Thăng Long (Hà Nội), Phố Hiến (Hưng Yên)."],0);
DC("Tại Việt Nam, những chiếc răng của Người tối cổ được tìm thấy ở đâu?",["Thẩm Khuyên, Thẩm Hai (Lạng Sơn).","Thành Cổ Loa (Hà Nội).","Thánh địa Mỹ Sơn (Quảng Nam).","Kinh thành Huế (Thừa Thiên Huế)."],0);
DC("Ở Việt Nam, ngoài Núi Đọ (Thanh Hóa), công cụ đá ghè đẽo thô sơ của Người tối cổ còn được tìm thấy ở địa điểm nào?",["Xuân Lộc (Đồng Nai).","Đông Sơn (Thanh Hóa).","Bàu Tró (Quảng Trị).","Sa Huỳnh (Quảng Ngãi)."],0);
VL("s5");
DC("Xã hội nguyên thủy đã trải qua những giai đoạn phát triển nào?",["Bầy người nguyên thủy và Người tinh khôn.","Bầy người nguyên thủy và thị tộc.","Thị tộc và bộ lạc.","Bầy người nguyên thủy và công xã thị tộc."],3);
DC("Nội dung nào sau đây không đúng về bầy người nguyên thủy?",["Gồm vài gia đình cùng sinh sống.","Có tù trưởng đứng đầu.","Có sự phân công lao động giữa nam và nữ.","Tổ chức còn sơ khai."],1);
DC("Đâu là đặc điểm của thị tộc?",["Gồm vài gia đình sinh sống cùng nhau.","Đứng đầu là tù trưởng.","Là một bầy người sống trong hang động.","Đứng đầu là tộc trưởng."],3);
DC("Cách thức lao động chính của Người tối cổ là gì?",["Trồng lúa nước.","Săn bắt, hái lượm.","Thuần dưỡng động vật.","Chăn nuôi gia súc."],1);
DC("Người nguyên thủy thường sử dụng nguyên liệu nào để chế tạo công cụ lao động?",["Nhựa và cao su.","Đá, xương và gỗ.","Sắt và thép.","Xi măng và bê tông."],1);
DC("Người tối cổ sống chủ yếu ở đâu?",["Trong các hang động, mái đá.","Trong nhà sàn.","Trong các ngôi nhà xây bằng gạch.","Trong nhà thuyền trên sông nước."],0);
DC("Đâu là biểu hiện của đời sống vật chất của người nguyên thủy?",["Chôn người chết cùng đồ tùy táng.","Vẽ tranh trong hang đá.","Chế tạo nhạc cụ.","Chế tác công cụ lao động."],3);
DC("Đâu là biểu hiện của đời sống tinh thần của người nguyên thủy?",["Chôn người chết cùng công cụ, đồ trang sức.","Trồng trọt, chăn nuôi.","Sống trong hang động, mái đá.","Chế tác công cụ lao động."],0);
DC("Dấu tích của nền nông nghiệp sơ khai ở Việt Nam được tìm thấy tại di chỉ nào?",["Sơn Vi.","Đông Sơn.","Hòa Bình.","Núi Đọ."],2);
DC("Cư dân nền văn hóa nào ở Việt Nam đã bước đầu biết làm nông nghiệp?",["Cư dân văn hóa Hòa Bình.","Cư dân Núi Đọ (Thanh Hóa).","Cư dân văn hóa Bắc Sơn (Lạng Sơn).","Cư dân văn hóa Quỳnh Văn (Nghệ An)."],0);
DC("Đời sống vật chất của người nguyên thủy trên đất nước Việt Nam được thể hiện qua hoạt động nào?",["Săn bắt, hái lượm và chế tác công cụ bằng đá.","Trồng lúa bằng máy móc hiện đại.","Buôn bán hàng hóa với nước ngoài.","Sản xuất công nghiệp trong các nhà máy."],0);
VL("s6");
DC("Con người bắt đầu phát hiện và chế tác công cụ lao động bằng đồng đỏ và đồng thau từ khoảng",["Thiên niên kỉ IV TCN.","Thiên niên kỉ V TCN.","Thiên niên kỉ VI TCN.","Thiên niên kỉ VII TCN."],0);
DC("Công cụ lao động bằng kim loại đã giúp con người thời nguyên thủy",["Thu hẹp diện tích đất canh tác để làm nhà ở.","Sống quây quần gắn bó với nhau.","Chống lại các cuộc xung đột từ bên ngoài.","Năng suất lao động tăng, tạo sản phẩm dư thừa."],3);
DC("Người Việt cổ đã bắt đầu biết chế tác công cụ lao động bằng đồng đỏ và đồng thau từ nền văn hóa",["Sa Huỳnh.","Đồng Nai.","Đồng Đậu.","Phùng Nguyên."],3);
DC("Vào cuối thời nguyên thủy, con người ở Việt Nam đã có sự thay đổi địa bàn cư trú như thế nào?",["Mở rộng địa bàn cư trú lên các vùng trung du và miền núi.","Mở rộng địa bàn cư trú xuống vùng đồng bằng ven các con sông.","Thu hẹp địa bàn cư trú, sống tập trung trong các hang động, mái đá.","Thay đổi địa bàn cư trú liên tục, nay đây mai đó."],1);
DC("Công cụ kim loại tác động thế nào đến xã hội nguyên thủy Việt Nam?",["Thúc đẩy sản xuất, tạo sản phẩm dư thừa.","Tăng sự phụ thuộc vào tự nhiên.","Thúc đẩy săn bắt, hái lượm.","Xóa bỏ sự phân hóa xã hội."],0);
/* Lịch sử: trắc nghiệm đúng – sai (đề cương có 3 ý, bổ sung ý d) */
VL("s7");
DCT("Đọc đoạn trích (SGK): “Ai Cập cổ đại nằm ở phía đông bắc châu Phi, hình thành dọc theo lưu vực sông Nin. Hằng năm, sông Nin bồi đắp phù sa, cung cấp nguồn nước, tạo điều kiện thuận lợi cho nông nghiệp phát triển. Lưỡng Hà nằm ở khu vực Tây Nam Á, giữa hai con sông Ti-grơ và Ơ-phơ-rát. Hai con sông cung cấp nước tưới tiêu, bồi đắp phù sa…”",["-a) Sông Ấn có vai trò to lớn đối với sự phát triển nền nông nghiệp Ai Cập cổ đại.","+b) Phù sa của sông Ti-grơ và Ơ-phơ-rát tạo điều kiện thuận lợi cho nông nghiệp Lưỡng Hà phát triển.","+c) Vị trí địa lí và các dòng sông lớn góp phần thúc đẩy sự hình thành các nền văn minh Ai Cập và Lưỡng Hà.","+d) Ai Cập cổ đại nằm ở phía đông bắc châu Phi."]);
DCT("Đọc đoạn trích: “Sông Nin có vai trò đặc biệt quan trọng đối với nền văn minh Ai Cập cổ đại. Hằng năm, nước sông dâng lên rồi rút xuống, để lại lớp phù sa màu mỡ. Người Ai Cập cổ đại đào kênh mương dẫn nước tưới tiêu, đồng thời sử dụng sông Nin làm tuyến đường giao thông, vận chuyển hàng hóa…”",["+a) Sông Nin bồi đắp phù sa, tạo điều kiện thuận lợi cho nông nghiệp Ai Cập cổ đại.","+b) Cư dân Ai Cập cổ đại sử dụng sông Nin làm tuyến đường giao thông.","-c) Nền văn minh Ai Cập cổ đại hình thành và phát triển không liên quan đến sông Nin.","+d) Người Ai Cập cổ đại đào kênh mương dẫn nước từ sông Nin vào đồng ruộng."]);
/* Lịch sử: câu ý tưởng tự luận */
VL("s4");
IDEA("Những địa điểm tìm thấy dấu tích Người tối cổ ở Đông Nam Á là (ý cho tự luận)",["Gia-va (In-đô-nê-xi-a); Thẩm Khuyên, Thẩm Hai, Núi Đọ, An Khê, Xuân Lộc (Việt Nam); Pôn-đoong (Mi-an-ma); Ta-bon (Phi-líp-pin)","Ai Cập, Lưỡng Hà, Ấn Độ","Hy Lạp, La Mã","Bắc Kinh, Tây An (Trung Quốc)"]);
IDEA("Người tối cổ ở Đông Nam Á thường chọn nơi sinh sống ở đâu? (ý cho tự luận)",["Trong hang động, mái đá tự nhiên hoặc vùng đồi gò ven sông, suối","Trong thành phố ven biển","Trên các đỉnh núi tuyết","Trong nhà xây bằng gạch đá"]);
IDEA("Vì sao Người tối cổ thường sống trong hang động, mái đá hoặc ven sông, suối? (ý cho tự luận)",["Công cụ còn thô sơ (đá ghè đẽo), chưa thể làm nhà ổn định; phải tận dụng hang động làm nơi trú ẩn, tránh thời tiết khắc nghiệt và thú dữ","Vì thích ngắm cảnh","Vì luật lệ bắt buộc","Vì đã biết xây nhà nhưng không muốn ở"]);
IDEA("Vì sao nói Đông Nam Á là “cái nôi” xuất hiện con người? (ý cho tự luận)",["Dấu tích Người tối cổ phân bố rộng từ lục địa đến hải đảo; môi trường tự nhiên thuận lợi, nhiều muông thú và cây trái","Vì Đông Nam Á có nhiều thành phố lớn","Vì Đông Nam Á có khí hậu băng giá","Vì Đông Nam Á nằm giữa sa mạc"]);
VL("s6");
IDEA("Vai trò của công cụ kim loại đối với sản xuất thời nguyên thủy (ý cho tự luận)",["Năng suất lao động tăng, mở rộng diện tích trồng trọt, làm ra sản phẩm dư thừa","Làm con người sống phụ thuộc hơn vào tự nhiên","Làm sản xuất giảm sút","Chỉ dùng để trang trí"]);
IDEA("Mối quan hệ giữa công cụ kim loại và sự chuyển biến sang xã hội có giai cấp là",["Công cụ kim loại → sản phẩm dư thừa → một số người chiếm làm của riêng → xã hội phân hóa giàu, nghèo → xuất hiện giai cấp","Công cụ kim loại → mọi người bình đẳng hơn","Công cụ kim loại → con người quay lại sống trong hang","Không có mối quan hệ nào"]);
VL("s7");
IDEA("Vai trò của sông Nin đối với Ai Cập cổ đại (ý cho tự luận)",["Bồi đắp phù sa, cung cấp nước tưới, là tuyến đường giao thông, giúp nông nghiệp và văn minh Ai Cập sớm phát triển","Gây hạn hán quanh năm","Ngăn cản giao thông","Không có vai trò gì"]);

/* --- PHÂN MÔN ĐỊA LÍ: trắc nghiệm nhiều lựa chọn (20 câu) --- */
VL("d1");
DC("Các đường nối liền hai điểm cực Bắc và cực Nam trên quả Địa Cầu là những đường gì?",["Vĩ tuyến.","Kinh tuyến.","Xích đạo.","Vòng cực."],1);
DC("Kinh tuyến gốc (0°) đi qua đài thiên văn nào?",["Pa-ri (Pháp).","Ma-đrít (Tây Ban Nha).","Grin-uých (Anh).","Ô-xlô (Na Uy)."],2);
DC("Tọa độ địa lí của một điểm gồm những thành phần nào?",["Kinh độ và vĩ độ.","Vĩ độ và hướng gió.","Kinh độ và độ cao.","Khoảng cách và góc phương vị."],0);
DC("Vĩ tuyến gốc (Xích đạo) chia quả Địa Cầu thành hai bán cầu nào?",["Bán cầu Bắc và Bán cầu Nam.","Bán cầu Đông và Bán cầu Tây.","Bán cầu Tây và Bán cầu Nam.","Bán cầu nóng và Bán cầu lạnh."],0);
VL("d2");
DC("Bản đồ là gì?",["Mô hình của Trái Đất.","Ảnh chụp Trái Đất.","Sách thống kê số liệu.","Hình vẽ thu nhỏ bề mặt Trái Đất lên mặt phẳng."],3);
DC("Có bản đồ không thể hiện các đường kinh tuyến và vĩ tuyến thì chúng ta dựa vào mũi tên theo hướng nào?",["Hướng Nam.","Hướng Đông.","Hướng Bắc.","Hướng Tây."],2);
DC("Theo quy ước, đầu phía dưới của kinh tuyến gốc chỉ hướng nào?",["Tây.","Đông.","Bắc.","Nam."],3);
DC("Muốn xác định phương hướng trên bản đồ cần phải dựa vào các yếu tố nào?",["Các đường kinh tuyến, vĩ tuyến.","Bảng chú giải, tỉ lệ bản đồ.","Mép bên trái tờ bản đồ.","Các mũi tên chỉ hướng."],0);
DC("Theo quy ước, đầu bên phải của vĩ tuyến chỉ hướng nào?",["Tây.","Đông.","Bắc.","Nam."],1);
VL("d4");
DC("Dấu hiệu quy ước thể hiện đối tượng địa lí trên bản đồ là gì?",["Tỉ lệ.","Thước đo.","Kí hiệu bản đồ.","Khung bản đồ."],2);
DC("Có bao nhiêu loại kí hiệu bản đồ thường dùng?",["3 loại.","4 loại.","2 loại.","5 loại."],0);
DC("Kí hiệu thể hiện thủ đô, sân bay, cảng biển thuộc loại kí hiệu nào?",["Đường.","Diện tích.","Điểm.","Màu sắc."],2);
DC("Kí hiệu thể hiện đường biên giới, đường giao thông, sông ngòi thuộc loại kí hiệu nào?",["Đường.","Diện tích.","Điểm.","Màu sắc."],0);
VL("d6");
DC("Trái Đất có bán kính ở Xích đạo là bao nhiêu?",["6 356 km.","6 387 km.","6 378 km.","6 365 km."],2);
DC("Trái Đất có dạng hình gì?",["Hình tròn.","Hình vuông.","Hình cầu.","Hình bầu dục."],2);
VL("d7");
DC("Trong các hệ quả của chuyển động tự quay quanh trục, hệ quả nào có ý nghĩa nhất đối với sự sống?",["Hiện tượng mùa trong năm.","Sự lệch hướng chuyển động.","Giờ trên Trái Đất.","Sự luân phiên ngày đêm."],3);
DC("Cùng một lúc, trên Trái Đất có bao nhiêu giờ khác nhau?",["21 giờ.","23 giờ.","24 giờ.","22 giờ."],2);
DC("Khi Trái Đất tự quay quanh trục, những địa điểm nào sau đây không thay đổi vị trí?",["Hai cực.","Hai chí tuyến.","Xích đạo.","Vòng cực."],0);
VL("d8");
DC("Trái Đất có những chuyển động chính nào?",["Tự quay quanh trục và quay xung quanh các hành tinh khác.","Tự quay quanh trục và chuyển động quay xung quanh Mặt Trời.","Chuyển động tịnh tiến xung quanh Mặt Trời và các hành tinh khác.","Tự quay quanh trục và chuyển động quay quanh Mặt Trăng."],1);
DC("Vào ngày 22/12, ở Nam Bán Cầu có thời gian ban ngày diễn ra thế nào?",["Khó xác định.","Dài nhất.","Bằng ban đêm.","Ngắn nhất."],1);
/* Địa lí: đúng – sai và điền khuyết */
DCT("Đọc đoạn trích (SGK): “Nguyên nhân sinh ra hiện tượng mùa là do trục Trái Đất nghiêng và gần như không đổi hướng khi Trái Đất chuyển động trên quỹ đạo quanh Mặt Trời. Bán cầu nào ngả về phía Mặt Trời nhiều hơn thì nhận được nhiều nhiệt và ánh sáng hơn, lúc này là mùa nóng…”",["+a) Trục Trái Đất nghiêng và gần như không đổi hướng trong quá trình chuyển động quanh Mặt Trời là nguyên nhân sinh ra hiện tượng mùa.","+b) Khi bán cầu Bắc là mùa nóng thì bán cầu Nam sẽ là mùa lạnh.","-c) Vào cùng một thời điểm, cả hai bán cầu của Trái Đất đều có cùng một mùa.","+d) Bán cầu ngả về phía Mặt Trời nhiều hơn sẽ nhận được nhiều nhiệt và ánh sáng hơn."]);
VL("d7");
DCS("Điền khuyết: “Tại một thời điểm, trên Trái Đất có nơi đang là ngày, có nơi lại là đêm. Nguyên nhân là do Trái Đất có dạng (1) …… nên Mặt Trời chỉ chiếu sáng được một nửa.” Từ cần điền vào chỗ (1) là gì?","hình cầu|cầu","Ghi 1–2 từ");
DCS("Điền khuyết: “Do Trái Đất tự quay quanh trục từ (2) …… nên ở mọi nơi trên bề mặt Trái Đất đều lần lượt có ngày và đêm.” Cụm từ cần điền vào chỗ (2) là gì?","Tây sang Đông|tây đông|từ tây sang đông","Ghi cụm từ chỉ hướng");
DCS("Điền khuyết: “Đây là hiện tượng ngày, đêm (3) …… nhau.” Từ cần điền vào chỗ (3) là gì?","luân phiên|kế tiếp|nối tiếp","Ghi 1 từ");
/* Địa lí: câu ý tưởng tự luận */
IDEA("Vì sao có hiện tượng ngày và đêm luân phiên nhau? (ý cho tự luận)",["Trái Đất hình cầu nên Mặt Trời chỉ chiếu sáng một nửa; Trái Đất tự quay từ Tây sang Đông nên mọi nơi lần lượt có ngày và đêm","Do Mặt Trăng che Mặt Trời mỗi tối","Do Mặt Trời tắt vào ban đêm","Do mây che phủ Trái Đất"]);
IDEA("Vì sao các vật chuyển động trên bề mặt Trái Đất bị lệch hướng? (ý cho tự luận)",["Do Trái Đất tự quay quanh trục, vật chịu tác động của lực Cô-ri-ô-lít: nửa cầu Bắc lệch phải, nửa cầu Nam lệch trái","Do gió thổi mạnh","Do sức hút của Mặt Trăng","Do địa hình đồi núi"]);
IDEA("Giờ quốc tế (GMT) là gì? (ý cho tự luận)",["Là giờ ở khu vực có kinh tuyến gốc (0°) đi qua, dùng làm căn cứ để tính giờ của các khu vực khác","Là giờ ở Việt Nam","Là giờ ở khu vực có kinh tuyến 180°","Là giờ ở Xích đạo"]);
VL("d8");
IDEA("Nguyên nhân sinh ra hiện tượng mùa (ý cho tự luận)",["Trục Trái Đất nghiêng và không đổi hướng khi chuyển động quanh Mặt Trời, nên hai nửa cầu lần lượt ngả về phía Mặt Trời","Do Trái Đất lúc gần lúc xa Mặt Trăng","Do Trái Đất tự quay nhanh, chậm khác nhau","Do gió mùa thổi"]);
VL("d3");
IDEA("Các bước tính khoảng cách thực tế dựa vào tỉ lệ bản đồ (ý cho tự luận)",["Đo khoảng cách trên bản đồ (cm) → nhân với mẫu số của tỉ lệ → đổi đơn vị ra mét hoặc ki-lô-mét","Lấy khoảng cách trên bản đồ chia cho mẫu số tỉ lệ","Cộng khoảng cách với mẫu số tỉ lệ","Chỉ cần ước lượng bằng mắt"]);

/* Bổ sung: đúng – sai về Ai Cập và Lưỡng Hà cổ đại (dùng cho phần đúng – sai Lịch sử của các đề) */
VL("s7");
T("Về điều kiện tự nhiên của Ai Cập và Lưỡng Hà cổ đại:",["+Ai Cập cổ đại hình thành ở lưu vực sông Nin.","+Lưỡng Hà cổ đại nằm giữa hai con sông Ti-grơ và Ơ-phơ-rát.","-Ai Cập và Lưỡng Hà cổ đại đều nằm ở châu Âu.","+Đất phù sa màu mỡ ven sông giúp nông nghiệp ở hai nơi phát triển sớm."]);
T("Về nhà nước và xã hội Ai Cập, Lưỡng Hà cổ đại:",["+Người đứng đầu nhà nước Ai Cập cổ đại là Pha-ra-ông.","+Nông dân là lực lượng sản xuất chủ yếu trong xã hội.","-Nhà nước Ai Cập và Lưỡng Hà cổ đại là nhà nước dân chủ, mọi người đều bình đẳng.","+Vua nắm mọi quyền hành, đứng đầu bộ máy nhà nước."]);
T("Về thành tựu văn hóa của Ai Cập và Lưỡng Hà cổ đại:",["+Người Ai Cập cổ đại làm ra lịch, một năm có 365 ngày.","+Người Lưỡng Hà viết chữ hình nêm trên các tấm đất sét.","-Kim tự tháp là công trình kiến trúc của người Lưỡng Hà.","+Bộ luật Ha-mu-ra-bi là thành tựu của người Lưỡng Hà."]);
VL("s6");
IDEA("Công cụ kim loại đã làm thay đổi đời sống kinh tế của người nguyên thủy như thế nào? (ý cho tự luận)",["Khai hoang mở rộng đất trồng, nông nghiệp dùng cày và trồng lúa nước phát triển; thủ công nghiệp (luyện kim, làm gốm, dệt) ra đời; con người định cư lâu dài ven sông","Con người quay lại sống bằng săn bắt, hái lượm","Đời sống kinh tế không thay đổi","Con người bỏ nghề nông để đi du mục"]);
IDEA("Vì sao khi có sản phẩm dư thừa, xã hội nguyên thủy bị phân hóa? (ý cho tự luận)",["Người có chức phận (tộc trưởng, tù trưởng…) chiếm phần dư thừa làm của riêng, trở nên giàu có; số khác vẫn nghèo → xã hội phân hóa giàu, nghèo, xuất hiện giai cấp","Vì mọi người chia đều sản phẩm","Vì sản phẩm dư thừa bị vứt bỏ","Vì không ai còn lao động nữa"]);

/* --- Tự luận (theo đề cương, có bổ sung) --- */
ESSAY("ls1","s4","Kể tên những địa điểm tìm thấy dấu tích của Người tối cổ ở Đông Nam Á.",["Gia-va (In-đô-nê-xi-a).","Ở Việt Nam: hang Thẩm Khuyên, Thẩm Hai (Lạng Sơn), Núi Đọ (Thanh Hóa), An Khê (Gia Lai), Xuân Lộc (Đồng Nai).","Pôn-đoong (Mi-an-ma).","Ta-bon (Phi-líp-pin)…"]);
ESSAY("ls2","s4","Người tối cổ thường chọn địa bàn sinh sống như thế nào?",["Qua các dấu tích tìm thấy ở đảo Gia-va, hang Thẩm Khuyên (Lạng Sơn), một số địa điểm ở Thanh Hóa, Gia Lai…","Người tối cổ ở Đông Nam Á thường sinh sống trong hang động, mái đá tự nhiên.","Hoặc ở các vùng đồi gò ven sông, suối."]);
ESSAY("ls3","s4","Vì sao Người tối cổ thường sống trong hang động, mái đá hoặc ven sông, suối?",["Công cụ lao động còn thô sơ, chủ yếu là đá ghè đẽo.","Người tối cổ chưa thể xây dựng nhà ở ổn định.","Nên phải tận dụng hang động, mái đá tự nhiên làm nơi trú ẩn.","Để tránh thời tiết khắc nghiệt và thú dữ; ven sông, suối có nguồn nước và thức ăn."]);
ESSAY("ls4","s4","Vì sao nói Đông Nam Á là “cái nôi” xuất hiện con người?",["Dấu tích Người tối cổ phân bố rộng khắp từ vùng lục địa đến vùng hải đảo Đông Nam Á.","Chứng tỏ Đông Nam Á có môi trường sống rất lí tưởng cho con người thời nguyên thủy.","Môi trường tự nhiên thuận lợi cung cấp nguồn muông thú và cây trái (rau, củ, quả) vô cùng dồi dào.","Đáp ứng phương thức sống hái lượm và săn bắt phụ thuộc hoàn toàn vào tự nhiên của Người tối cổ."]);
ESSAY("kl1","s6","Trình bày vai trò của công cụ bằng kim loại đối với sự phát triển sản xuất, sự thay đổi đời sống kinh tế và quá trình phân hóa xã hội. Từ đó giải thích mối quan hệ giữa việc sử dụng công cụ bằng kim loại với sự chuyển biến từ xã hội nguyên thủy sang xã hội có giai cấp.",["Sản xuất: công cụ kim loại sắc bén, bền hơn đồ đá → năng suất lao động tăng, khai hoang mở rộng diện tích trồng trọt.","Đời sống kinh tế: nông nghiệp dùng cày, trồng lúa nước phát triển; thủ công nghiệp (luyện kim, làm gốm, dệt vải) ra đời; con người định cư ven sông.","Phân hóa xã hội: sản xuất phát triển → có sản phẩm dư thừa → một số người chiếm làm của riêng, trở nên giàu có; số khác nghèo → xã hội phân hóa giàu, nghèo.","Gia đình phụ hệ thay thế công xã thị tộc; quan hệ “cùng làm, cùng hưởng” bị phá vỡ.","Mối quan hệ: công cụ kim loại → sản phẩm dư thừa → tư hữu → phân hóa giàu nghèo → xã hội nguyên thủy tan rã, chuyển sang xã hội có giai cấp. Công cụ kim loại là nguyên nhân sâu xa của sự chuyển biến này."]);
ESSAY("kl2","s6","Sự xuất hiện của công cụ bằng kim loại đã làm thay đổi đời sống kinh tế của người nguyên thủy như thế nào?",["Công cụ kim loại (đồng, sau đó là sắt) cứng, sắc bén hơn đồ đá.","Con người khai hoang, mở rộng diện tích đất trồng trọt; nông nghiệp dùng cày, trồng lúa nước phát triển.","Chăn nuôi phát triển; thủ công nghiệp như luyện kim, làm gốm, dệt vải ra đời và chuyên môn hóa.","Con người chuyển xuống định cư ở vùng đồng bằng ven sông.","Năng suất tăng, lần đầu tiên có sản phẩm dư thừa."]);
ESSAY("kl3","s6","Vì sao khi công cụ bằng kim loại xuất hiện, xã hội nguyên thủy dần bị phân hóa giàu – nghèo?",["Công cụ kim loại giúp năng suất lao động tăng, sản xuất phát triển.","Lần đầu tiên con người làm ra sản phẩm dư thừa.","Những người có chức phận trong thị tộc, bộ lạc chiếm phần dư thừa làm của riêng, trở nên giàu có.","Số còn lại không có của dư thừa nên vẫn nghèo → xã hội phân hóa giàu, nghèo.","Gia đình phụ hệ dần thay thế công xã thị tộc; nguyên tắc “cùng làm, cùng hưởng” bị phá vỡ."]);
ESSAY("kl4","s6","Hãy giải thích mối quan hệ giữa việc sử dụng công cụ bằng kim loại và sự chuyển biến từ xã hội nguyên thủy sang xã hội có giai cấp.",["Công cụ kim loại ra đời → năng suất lao động tăng, sản xuất phát triển.","Sản xuất phát triển → xuất hiện sản phẩm dư thừa.","Sản phẩm dư thừa bị một số người chiếm làm của riêng → xuất hiện tư hữu.","Tư hữu dẫn đến xã hội phân hóa thành người giàu và người nghèo.","Xã hội nguyên thủy dần tan rã, con người bước sang xã hội có giai cấp → công cụ kim loại là nguyên nhân sâu xa của sự chuyển biến."]);
ESSAY("kl5","s6","Ở Việt Nam, người Việt cổ biết sử dụng kim loại từ khi nào? Công cụ kim loại đã tác động như thế nào đến xã hội nguyên thủy Việt Nam?",["Khoảng 4000 năm trước, cư dân văn hóa Phùng Nguyên đã biết chế tác công cụ bằng đồng đỏ, đồng thau; tiếp nối là Đồng Đậu, Gò Mun, rồi Đông Sơn (đồ sắt).","Công cụ kim loại giúp người Việt cổ khai phá vùng đồng bằng ven các con sông lớn (sông Hồng, sông Mã, sông Cả).","Nông nghiệp trồng lúa nước phát triển, thúc đẩy sản xuất, tạo ra sản phẩm dư thừa.","Xã hội bắt đầu phân hóa giàu, nghèo (thể hiện qua đồ tùy táng trong mộ táng khác nhau).","Đây là cơ sở cho sự ra đời của nhà nước đầu tiên của người Việt (Văn Lang)."]);
ESSAY("dl1","d7","Vì sao hướng chuyển động của gió, dòng biển và dòng sông bị lệch so với hướng ban đầu?",["Do Trái Đất tự quay quanh trục.","Các vật thể chuyển động trên bề mặt Trái Đất chịu tác động của lực Cô-ri-ô-lít nên bị lệch hướng so với hướng ban đầu.","Ở bán cầu Bắc, vật thể lệch về bên phải; ở bán cầu Nam, vật thể lệch về bên trái.","Hiện tượng này ảnh hưởng đến hướng chuyển động của gió, dòng biển và dòng sông."]);
ESSAY("dl2","d7","a) Ở bán cầu Nam, hướng gió chuyển động theo chiều kinh tuyến lệch theo hướng nào so với hướng ban đầu?  b) Vì sao hướng chuyển động của gió lại bị lệch so với hướng ban đầu?",["a) Ở bán cầu Nam, hướng gió lệch về bên trái so với hướng chuyển động ban đầu.","b) Do Trái Đất chuyển động tự quay quanh trục.","Chuyển động tự quay đã sinh ra một lực (lực Cô-ri-ô-lít) làm cho hướng chuyển động của gió theo chiều kinh tuyến bị lệch so với hướng ban đầu."]);
ESSAY("dl3","d7","Vì sao giờ ở các khu vực trên Trái Đất không giống nhau? Giờ quốc tế (GMT) có vai trò gì trong việc xác định giờ của các khu vực?",["Do Trái Đất có dạng hình cầu và tự quay quanh trục nên các khu vực trên Trái Đất có giờ khác nhau.","Bề mặt Trái Đất được chia thành 24 khu vực giờ.","Giờ GMT là giờ tại khu vực có kinh tuyến gốc (0°) đi qua, được lấy làm giờ quốc tế.","Giờ của các khu vực khác được tính dựa theo giờ khu vực số 0."]);
ESSAY("dl4","d3","Trên bản đồ tỉ lệ 1 : 500 000, khoảng cách giữa hai thành phố A và B đo được là 6 cm. Hãy tính khoảng cách thực tế giữa hai thành phố (đơn vị km) và nêu cách tính.",["Tỉ lệ 1 : 500 000 nghĩa là 1 cm trên bản đồ ứng với 500 000 cm ngoài thực tế.","Khoảng cách thực tế = khoảng cách trên bản đồ × mẫu số tỉ lệ = 6 × 500 000 = 3 000 000 cm.","Đổi đơn vị: 3 000 000 cm = 30 000 m = 30 km.","Kết luận: hai thành phố cách nhau 30 km."]);
ESSAY("dl5","d8","Trình bày nguyên nhân sinh ra hiện tượng mùa. Vì sao mùa ở hai bán cầu luôn trái ngược nhau?",["Trái Đất chuyển động quanh Mặt Trời với trục nghiêng và gần như không đổi hướng.","Hai bán cầu Bắc và Nam lần lượt ngả về phía Mặt Trời.","Bán cầu ngả về phía Mặt Trời nhiều hơn nhận nhiều nhiệt, ánh sáng hơn → mùa nóng; bán cầu ngả ít hơn → mùa lạnh.","Vì vậy cùng một thời điểm, mùa ở hai bán cầu trái ngược nhau (bán cầu Bắc mùa hạ thì bán cầu Nam mùa đông)."]);

ESSAY("kc2","d3","Trên bản đồ có tỉ lệ 1 : 200 000, khoảng cách giữa hai địa điểm A và B đo được là 4,5 cm. Hãy tính khoảng cách thực tế giữa A và B (đơn vị km).",["Tỉ lệ 1 : 200 000 nghĩa là 1 cm trên bản đồ ứng với 200 000 cm ngoài thực tế.","Khoảng cách thực tế = 4,5 × 200 000 = 900 000 cm.","Đổi đơn vị: 900 000 cm = 9 000 m = 9 km.","Kết luận: A cách B 9 km."]);
ESSAY("kc3","d3","Hai địa điểm M và N cách nhau 15 km ngoài thực tế. Trên bản đồ có tỉ lệ 1 : 300 000, khoảng cách giữa M và N là bao nhiêu xăng-ti-mét?",["Đổi khoảng cách thực tế ra cùng đơn vị cm: 15 km = 1 500 000 cm.","Khoảng cách trên bản đồ = khoảng cách thực tế : mẫu số tỉ lệ.","= 1 500 000 : 300 000 = 5 cm.","Kết luận: trên bản đồ, M và N cách nhau 5 cm."]);
ESSAY("kc4","d3","Trên bản đồ tỉ lệ 1 : 6 000 000, khoảng cách từ thành phố P đến thành phố Q đo được 11 cm. Tính khoảng cách thực tế giữa hai thành phố (km). Bản đồ này là bản đồ tỉ lệ lớn hay tỉ lệ nhỏ?",["Khoảng cách thực tế = 11 × 6 000 000 = 66 000 000 cm.","Đổi đơn vị: 66 000 000 cm = 660 000 m = 660 km.","Kết luận: P cách Q 660 km.","Mẫu số tỉ lệ rất lớn (6 000 000) nên đây là bản đồ tỉ lệ nhỏ, thể hiện ít chi tiết."]);
ESSAY("kc5","d3","Một bản đồ có tỉ lệ thước: 1 cm trên bản đồ ứng với 2 km ngoài thực tế. Khoảng cách giữa hai điểm trên bản đồ là 7,5 cm. a) Tính khoảng cách thực tế. b) Viết tỉ lệ số tương ứng của bản đồ.",["a) Khoảng cách thực tế = 7,5 × 2 = 15 km.","b) Đổi 2 km = 200 000 cm.","1 cm trên bản đồ ứng với 200 000 cm ngoài thực tế.","Vậy tỉ lệ số của bản đồ là 1 : 200 000."]);
/* --- 5 đề: mỗi đề 22 câu trắc nghiệm (Sử 11, Địa 11) + 4 câu tự luận (Sử đề cương, Sử công cụ kim loại, Địa đề cương, Địa tính khoảng cách) --- */
const LS_GK_SETS = (() => {
  const sLes = ["s4", "s5", "s6", "s7"], dLes = ["d1", "d2", "d3", "d4", "d6", "d7", "d8"];
  const of = (lesList, f) => BANK.filter((q) => lesList.includes(q.les) && f(q));
  const sDC = of(sLes, (q) => q.src === "dc" && q.t === "mc"), dDC = of(dLes, (q) => q.src === "dc" && q.t === "mc");
  const sTFdc = of(sLes, (q) => q.src === "dc" && q.t === "tf"), dTFdc = of(dLes, (q) => q.src === "dc" && q.t === "tf");
  const dSAdc = of(dLes, (q) => q.src === "dc" && q.t === "sa");
  const sIdea = of(sLes, (q) => q.idea), dIdea = of(dLes, (q) => q.idea);
  const sMC = of(sLes, (q) => !q.src && !q.idea && q.t === "mc"), dMC = of(dLes, (q) => !q.src && !q.idea && q.t === "mc");
  const sTF = of(["s7"], (q) => !q.src && q.t === "tf"), dTF = of(dLes, (q) => !q.src && q.t === "tf");
  const sSA = of(sLes, (q) => !q.src && q.t === "sa"), dSA = of(["d1", "d3", "d6", "d7", "d8"], (q) => !q.src && q.t === "sa");
  const pickN = (list, n, start, step, taken) => { const out = []; for (let k = 0; out.length < n && k < list.length * 3; k++) { const q = list[(start + k * step) % list.length]; if (q && !taken.has(q.id) && !out.includes(q.id)) out.push(q.id); } return out; };
  const sets = [];
  for (let d = 0; d < 5; d++) {
    const taken = new Set();
    const add = (ids) => ids.forEach((id) => { taken.add(id); mc.push(id); });
    const mc = [];
    add([d, d + 5, d + 10, d + 15].map((i) => sDC[i] && sDC[i].id).filter(Boolean));
    add(pickN(sMC, 3, d * 3, 7, taken));
    add(pickN(sIdea, 2, d * 2, 1, taken));
    add([d < 2 ? sTFdc[d].id : sTF[(d - 2) % sTF.length].id]);
    add(pickN(sSA, 1, d, 1, taken));
    add([d, d + 5, d + 10, d + 15].map((i) => dDC[i] && dDC[i].id).filter(Boolean));
    add(pickN(dMC, 3, d * 4, 11, taken));
    add(pickN(dIdea, 2, d * 2, 1, taken));
    add([d === 2 ? dTFdc[0].id : dTF[d % dTF.length].id]);
    add(d < 3 ? [dSAdc[d].id] : pickN(dSA, 1, d * 2, 1, taken));
    sets.push({ no: d + 1, mc, essays: ["ls" + ((d % 4) + 1), "kl" + (d + 1), ["dl1", "dl2", "dl3", "dl5", "dl1"][d], ["dl4", "kc2", "kc3", "kc4", "kc5"][d]] });
  }
  return sets;
})();
