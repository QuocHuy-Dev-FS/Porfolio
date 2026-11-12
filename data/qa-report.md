KẾT QUẢ: PASS

> Vòng kiểm định 2 — 2026-11-12. Agent: qa-auditor.
> Không có lỗi chặn. Hai cảnh báo còn lại từ vòng 1 đã được xử lý hoặc xác nhận.

---

## Bảng lỗi / cảnh báo

| # | Mức | Vị trí | Mô tả | Agent sở hữu |
|---|-----|--------|-------|--------------|
| W-1 | đã xác nhận | `data/profile.json` → `site.url` | URL `https://quochuy-dev-fs.github.io/Porfolio/` và tên repo "Porfolio" (typo so với "Portfolio") — người dùng đã xác nhận giữ nguyên trong phiên này. Nếu đổi repo name sau này cần build lại và cập nhật canonical/sitemap. | publisher |
| W-2 | nên sửa | `docs/assets/og-image.svg` → `og:image` | og:image trỏ đến file SVG. Facebook, LinkedIn, Twitter/X thường không render SVG làm ảnh preview; nên thay bằng PNG hoặc JPEG (tối thiểu 1200×630). SVG hiện tại không chứa script hay URL ngoài — an toàn nội dung. | frontend-builder |
| W-3 | đã xác nhận | `data/design.md` §6 ↔ `templates/tokens.css` | Tất cả 14 cặp màu trong bảng tương phản đều khớp chính xác với giá trị hex trong tokens.css. Không có sai lệch. | — |
| W-4 | đã xác nhận | `data/profile.json` → `skills` | Các nhóm kỹ năng ngoài Frontend (Backend, Algorithms, Hardware, Testing) được suy ra từ stack thực tế trong evidence.md — người dùng đã xác nhận giữ nguyên. | — |
| W-5 | nên sửa | `data/profile.json` → `person.links` | LinkedIn vắng mặt. evidence.md ghi URL `www.linkedin.com/in/huy-đoàn-077089432` nhưng có ký tự có dấu chưa xác nhận. Cần người dùng xác nhận URL thực (có thể là `huy-doan-...`) rồi thêm vào profile.json và build lại. | content-writer |

---

## Chi tiết từng mục checklist

| Mục | Kết quả |
|-----|---------|
| `node scripts/check.mjs` (11 bài kiểm) | PASSED — tất cả 11/11 |
| Dự án private "quan-ly-nhan-vien" vắng trong docs/ | PASSED |
| Không tên bệnh viện cụ thể trong docs/ (dùng "general hospital") | PASSED |
| Mọi metrics[] và highlights[] có trường `source` | PASSED |
| Không CDN / font ngoài / preconnect | PASSED |
| MIT License comment còn nguyên trong style.css | PASSED |
| Không secret / token / local path / UUID trong docs/ | PASSED |
| Không từ sáo rỗng (passionate, cutting-edge v.v.) trong docs/ | PASSED |
| Skip-link, focus ring (:focus-visible), prefers-reduced-motion | PASSED |
| Viewport meta, không độ rộng cố định gây cuộn ngang ở 320 px | PASSED |
| title, description, canonical, Open Graph đầy đủ | PASSED |
| og:image:alt có mặt | PASSED |
| sitemap.xml và robots.txt | PASSED |
| Tokens hex trong design.md khớp tokens.css | PASSED |
| Nội dung profile.json có thể truy xuất về evidence.md | PASSED — tất cả trường có nguồn; person.summary là tổng hợp trung thực từ stack thực tế |
| og:image là ảnh raster (PNG/JPEG) | FAILED (nên sửa) — hiện là SVG (W-2) |
| LinkedIn link | PENDING — chờ xác nhận URL (W-5) |

---

## Chưa kiểm chứng (không có trình duyệt)

- Giao diện thực tế: layout, màu sắc, animation, hamburger menu, smooth scroll — chưa xem trên trình duyệt. **Yêu cầu người dùng mở `docs/index.html` trong trình duyệt và kiểm tra bằng mắt.**
- Tương phản thực tế trên màn hình: đã kiểm bằng bảng tĩnh trong design.md, nhưng chưa chạy DevTools / axe.
- og:image render trên mạng xã hội: chưa kiểm tra qua Facebook Debugger / Twitter Card Validator (không có trình duyệt).
- Responsive tại 320 px: chỉ đọc CSS tĩnh, chưa thực thi trong viewport thật.
- WebGL / Three.js trên trang detail: không liên quan site portfolio, không kiểm.
