# Website ConTrust — Hướng dẫn sử dụng

Đây là website giới thiệu công ty (company profile) của ConTrust, dựng từ nội dung trong "Company Profile & Quotation - Jun 26". Web tĩnh thuần HTML/CSS/JS — không cần server, không cần build, có thể upload lên bất kỳ hosting nào.

## Cấu trúc thư mục

```
index.html          → toàn bộ nội dung trang (1 trang, có mục lục cuộn)
css/style.css        → giao diện, màu sắc, responsive
js/script.js          → chuyển ngôn ngữ VI/EN, menu mobile, form liên hệ
assets/img/           → logo, icon, ảnh khách hàng
```

Mở trực tiếp `index.html` bằng trình duyệt là xem được ngay (không cần internet, trừ phần font chữ Montserrat load từ Google Fonts).

## Cách đưa lên thành website thật (chọn 1 trong các cách)

**Cách dễ nhất — Netlify hoặc Vercel (miễn phí):**
1. Vào [app.netlify.com/drop](https://app.netlify.com/drop)
2. Kéo thả cả thư mục `website` (thư mục chứa `index.html`) vào trang đó
3. Xong — Netlify tự cấp cho bạn 1 link, ví dụ `contrust.netlify.app`
4. Muốn gắn tên miền riêng (ví dụ contrust.vn) thì vào phần Domain settings của Netlify, làm theo hướng dẫn (cần trỏ DNS tại nơi bạn mua tên miền)

**Cách khác — Hosting truyền thống (Hostinger, cPanel...):**
1. Đăng nhập vào trang quản lý hosting → File Manager (hoặc dùng FTP)
2. Upload toàn bộ nội dung thư mục `website` vào thư mục gốc web (thường là `public_html`)
3. Đảm bảo `index.html` nằm ngay trong `public_html`, không nằm trong thư mục con

**Cách khác — GitHub Pages (miễn phí, cần tài khoản GitHub):**
1. Tạo 1 repository mới, đẩy (push) toàn bộ nội dung thư mục `website` lên
2. Vào Settings → Pages → chọn nhánh chính, thư mục gốc
3. GitHub cấp link dạng `tenban.github.io/ten-repo`

## Kích hoạt form liên hệ (bắt buộc để form gửi được email)

Form liên hệ hiện đang dùng dịch vụ miễn phí [Formspree](https://formspree.io) — không cần bạn tự dựng server hay email riêng.

1. Vào [formspree.io](https://formspree.io), đăng ký tài khoản miễn phí bằng email `tuan.hoanganh@congroup.vn` (hoặc email khác bạn muốn nhận yêu cầu tư vấn)
2. Sau khi đăng ký, tạo 1 Form mới (New Form)
3. Formspree sẽ đưa bạn 1 đường link dạng `https://formspree.io/f/xxxxxxxx`
4. Mở file `index.html`, tìm dòng:
   ```html
   <form id="contactForm" class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   Thay `YOUR_FORM_ID` bằng mã Formspree thật của bạn (ví dụ `mzzabcde`)
5. Lưu file, upload lại lên hosting — form đã hoạt động. Formspree sẽ gửi lần đầu 1 email xác nhận, bạn cần bấm xác nhận thì các lượt gửi sau mới về đúng hộp thư
6. Gói miễn phí của Formspree cho 50 lượt gửi/tháng — nếu công ty cần nhiều hơn, có thể nâng cấp gói trả phí trên chính trang Formspree

Nếu chưa kịp làm bước này, website vẫn chạy bình thường — khi khách bấm "Gửi yêu cầu tư vấn", form sẽ hiện thông báo nhẹ nhàng mời khách gọi điện/email trực tiếp (số điện thoại và email hiển thị sẵn ngay bên cạnh form), không bị lỗi hay trống trơn.

## Nội dung có thể chỉnh sau

Toàn bộ chữ tiếng Việt và tiếng Anh đều nằm ngay trong `index.html`, đi theo cặp — mỗi đoạn có 1 bản `class="lang-vi"` và 1 bản `class="lang-en"` nằm sát nhau, nên sửa văn bản không cần biết code, chỉ cần tìm đúng đoạn chữ và gõ đè lên. Ví dụ đổi số điện thoại: tìm `036 588 1368` trong file, có 2 chỗ (phần liên hệ và nội dung khác), sửa cả hai.

Logo khách hàng nằm trong `assets/img/clients/` — muốn thêm/bớt khách hàng, chỉ cần thêm ảnh vào thư mục đó và thêm 1 dòng `<div class="client-logo"><img src="assets/img/clients/ten-file.jpg" alt="Tên khách hàng"></div>` vào mục "Khách hàng tiêu biểu" trong `index.html`.

Muốn mình (Claude) hỗ trợ chỉnh nội dung, thêm phần mới, hay đổi giao diện — cứ nhắn lại trong phiên làm việc này, mình sẽ sửa trực tiếp và gửi lại bản mới.

## Ghi chú

- Bảng giá 3 mức (7tr/12tr/20tr) đang hiển thị công khai theo lựa chọn của bạn — nếu sau này muốn ẩn đi, chỉ cần nói mình sửa lại.
- Trang mặc định hiển thị Tiếng Việt, có nút "VI / EN" ở góc trên để đổi ngôn ngữ; máy khách sẽ nhớ lựa chọn ngôn ngữ ở lần truy cập sau.
- Trang chưa có Google Analytics hay công cụ theo dõi lượt truy cập — nếu cần, nói mình gắn thêm.
