KẾT QUẢ: PASS

> qa-auditor · 2026-11-13 · Vòng 3 — node scripts/check.mjs + đọc tĩnh sau khi thêm hospital-quality-survey và đổi quan-ly-nhan-vien sang public

---

## Tóm tắt

- `node scripts/check.mjs`: tất cả 18 kiểm tra PASS.
- Lỗi chặn: **0**.
- Nên sửa: **0**.
- Thông tin / người dùng bổ sung: **6** mục (xem bên dưới).

---

## Kiểm tra vòng 3 — kết quả

| Mục | Kết quả | Ghi chú |
|---|---|---|
| check.mjs (18/18 mục) | PASS | |
| Không có "Bệnh viện Quân y 7A" hay "Quân y 7A" trong docs/ | PASS | check.mjs [10] xác nhận; đọc tĩnh xác nhận |
| "Grade-I hospital" dùng thay tên cụ thể (hospital-quality-survey) | PASS | docs/projects/hospital-quality-survey/index.html dòng 7, 82 |
| "a general hospital" dùng thay tên cụ thể (hospital-indoor-navigation) | PASS | docs/projects/hospital-indoor-navigation/index.html xác nhận |
| quan-ly-nhan-vien hiện có trong docs/ và sitemap | PASS | docs/projects/quan-ly-nhan-vien/; sitemap.xml dòng 8 |
| hospital-quality-survey hiện có trong docs/ và sitemap | PASS | docs/projects/hospital-quality-survey/; sitemap.xml dòng 15 |
| hospital-indoor-navigation không thay đổi | PASS | nội dung khớp vòng 2 |
| 3 dự án public trong profile.json — cả 3 xuất hiện trong docs/ | PASS | |
| Không có dự án private trong docs/ | PASS | check.mjs [4] |
| Mọi số liệu trong profile.json (12 metrics) có source | PASS | check.mjs [3]; truy xuất evidence.md xác nhận từng mục |
| Không có số liệu trong câu văn summary (3 dự án) | PASS | summary chỉ mô tả chức năng, không có con số |
| Không trường rỗng / giả trong 3 dự án | PASS | slug, name, summary, stack, visibility — đủ; links vắng là đúng vì không có dữ liệu |
| Không secret / token / password / localhost thực trong docs/ | PASS | "token" trong docs chỉ là "Portfolio Design Tokens" — CSS token (tên thiết kế) |
| Không CDN / font ngoài / analytics | PASS | check.mjs [13]; grep xác nhận không có googleapis, cdnjs, jsdelivr |
| JSON hợp lệ | PASS | check.mjs [2] |
| Văn phong — không từ sáo rỗng (passionate, cutting-edge, world-class…) | PASS | grep trả 0 kết quả trong docs/ |
| Truy xuất nguồn — quan-ly-nhan-vien metrics khớp evidence.md | PASS | 83/83 tests ← PORTFOLIO.md §9; 46 commits ← §4; 0 TS errors ← §9; 6 migrations ← §7 |
| Truy xuất nguồn — hospital-quality-survey metrics khớp evidence.md | PASS | 27/27 tests ← CV_PORTFOLIO §5; 4 migrations ← §4; 13 khoa ← §4 |
| alt ảnh — tất cả img có alt | PASS | check.mjs [7] |
| Thứ tự heading — single h1 mỗi trang | PASS | check.mjs [6] |
| Landmark — banner, main, contentinfo, nav | PASS | đọc tĩnh index.html: role="banner", main#main-content, role="contentinfo" |
| Skip-link | PASS | `<a class="skip-link" href="#main-content">` dòng 23 (index.html) |
| Focus ring CSS | PASS | style.css dòng 272–273: :focus-visible |
| prefers-reduced-motion | PASS | style.css dòng 225–234 |
| Tương phản (bảng design.md) | PASS (lý thuyết) | Tỉ lệ thấp nhất: 5.36:1 (btn) — vượt AA; kiểm tra rendered trong mục Chưa kiểm chứng |
| viewport meta | PASS | `<meta name="viewport" content="width=device-width, initial-scale=1">` |
| Không độ rộng cố định gây cuộn ngang ở 320 px | PASS | Fixed width 200/150 px chỉ trên .hero-deco (position:absolute, aria-hidden, overflow clip tại container) |
| title, description, canonical, Open Graph mỗi trang | PASS | check.mjs [6][11]; đọc tĩnh xác nhận 4 trang |
| sitemap (4 URL) | PASS | docs/sitemap.xml |
| robots.txt | PASS | Allow: /; Sitemap trỏ đúng |

---

## Người dùng cần bổ sung (không phải lỗi)

| Mục | Ghi chú |
|---|---|
| `site.url` = `"…/Porfolio/"` — có thể typo (thiếu 't') | Xác nhận URL GitHub Pages thực tế trước khi deploy |
| `person.links.linkedin` đã có nhưng URL gốc chứa dấu | URL đã encode thành `%C4%91` trong HTML — kiểm tra link thực trên trình duyệt |
| `person.resume` vắng | Thêm file CV và khóa person.resume nếu muốn nút Download CV |
| `projects[*].links.repo` và `.demo` vắng (2 dự án mới) | Thêm khi repo được push và có demo |
| `experience[]` và `education[]` vắng trong profile.json | Điền vào data/inputs.md rồi chạy lại content-writer |
| hospital-quality-survey: vai trò solo hay nhóm chưa xác nhận | evidence.md ghi "chưa xác nhận"; profile.json dùng "Fullstack Developer" (không ghi solo) |

---

## Chưa kiểm chứng

Các mục dưới đây cần người dùng kiểm tra thủ công bằng trình duyệt vì qa-auditor không có trình duyệt:

1. **Giao diện thực tế**: layout visual, hiệu ứng hover/glow trên card, hero gradient-shift, floating badges.
2. **Responsive 375 / 768 / 1440 px**: layout đúng breakpoint, không cuộn ngang thực tế (đặc biệt trang hospital-quality-survey mới).
3. **Console sạch**: không lỗi JS, không warning CORS.
4. **Tương phản rendered**: bảng design.md dùng giá trị lý thuyết — nên kiểm tra bằng DevTools hoặc extension Lighthouse trên trang thật.
5. **Hamburger menu** trên mobile: drawer mở/đóng, focus trap hoạt động.
6. **Scroll progress bar** cập nhật đúng khi cuộn.
7. **Tab lọc Portfolio**: JS filter hoạt động; cả 3 dự án đều category "web" — tab filter có thể bị ẩn hoặc hiển thị một tab; xác nhận hành vi đúng.
8. **LinkedIn URL**: link `huy-%C4%91o%C3%A0n-077089432` cần mở trên trình duyệt để xác nhận đúng profile.
