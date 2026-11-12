# Brief portfolio

## Mục tiêu (1 câu)
Dựng mới toàn bộ trang portfolio tĩnh (HTML/CSS/JS thuần, không dependency) cho một fullstack developer, lấy bố cục và phong cách từ reference/devportfolio làm mẫu, xuất bản trên GitHub Pages, dùng để xin việc và nhận dự án freelance.

## Đối tượng đọc và mục đích
- Nhà tuyển dụng kỹ thuật: đánh giá năng lực qua dự án thực, stack, vai trò cụ thể.
- Khách hàng freelance: xác nhận khả năng giao việc, xem demo/repo.
- Ngôn ngữ site: `en` (theo lựa chọn của người dùng trong inputs.md).

## Phạm vi và ngoài phạm vi
**Trong phạm vi:**
- Các mục theo reference/devportfolio: Hero, About, Projects, Experience, Education, Header, Footer.
- Dữ liệu từ `data/inputs.md` và 2 file PORTFOLIO.md được chỉ định.
- Dự án công khai duy nhất: "Hospital Indoor Navigation" (visibility = public).
- Dự án "Quản lý nhân viên" (visibility = private): ghi vào `data/profile.json` nhưng KHÔNG xuất hiện trong `docs/`; không làm nổi bật số liệu của nó trên site.
- Màu nhấn qua biến CSS (không phụ thuộc framework Tailwind của mẫu).
- Font monospace dùng font-stack hệ thống (không CDN, không font ngoài).
- Nếu chép đoạn code từ mẫu: giữ nguyên ghi chú bản quyền MIT.

**Ngoài phạm vi:**
- Không dùng Astro, Tailwind, bất kỳ package/CDN nào.
- Không git commit, push, deploy, bật GitHub Pages khi chưa được phép rõ ràng trong phiên.
- Không tạo nhiều trang (SPA một trang).
- Không analytics, không tracking.

## Ràng buộc (từ CLAUDE.md + yêu cầu này)
1. HTML/CSS/JS thuần; Node 18+ chỉ chạy `scripts/build.mjs` và `scripts/check.mjs`.
2. `docs/` chỉ sinh ra qua `node scripts/build.mjs`; không sửa tay.
3. Không bịa dữ kiện; chỉ dùng dữ liệu xác minh được trong `data/evidence.md`.
4. Dự án `visibility: "private"` không xuất hiện trong `docs/`.
5. Mọi số liệu phải nằm trong `metrics[]` hoặc `highlights[]` kèm `source`.
6. Văn phong ngắn, cụ thể, tránh từ sáo rỗng.
7. Không secret, token, dữ liệu cá nhân của người khác.
8. Nếu chép đoạn code từ reference/devportfolio: giữ ghi chú bản quyền MIT.
9. Không chạy script hay cài package của mẫu (chỉ đọc để tham chiếu bố cục).
10. Tên bệnh viện trong dự án "Hospital Indoor Navigation": KHÔNG nêu tên cụ thể "Bệnh viện Quân y 7A" — dùng mô tả chung "a general hospital" (locale=en). Đây là mặc định thận trọng, chờ xác nhận của người dùng.
11. `site.url` dùng placeholder `https://quochuy-dev-fs.github.io/Porfolio/` (suy ra từ tên repo); publisher phải nhắc xác nhận trước khi deploy.

## Agent cần chạy
Wave 1: project-miner
Wave 2: ui-designer | content-writer (song song)
Wave 3: frontend-builder (giai đoạn 1: dựng khung)
Wave 4: frontend-builder (giai đoạn 2: build)
Wave 5: qa-auditor
Wave 6: publisher

## Nhiệm vụ từng agent

### project-miner
- **Mục tiêu:** Đọc 2 file PORTFOLIO.md được chỉ định và `data/inputs.md`; trích xuất dữ kiện thô có thể kiểm chứng (tên dự án, vai trò, stack, highlights, metrics kèm source, links repo/demo, thông tin cá nhân, kinh nghiệm, học vấn).
- **Đọc:**
  - `D:\Workplace\Manager-Project\PORTFOLIO.md`
  - `D:\Workplace\Hospital Indoor Navigation\docs\PORTFOLIO.md`
  - `D:\Workplace\Portfolio\data\inputs.md`
- **Ghi:** `data/evidence.md`
- **Nghiệm thu:**
  - Mỗi dữ kiện có nguồn (tên file, section hoặc URL).
  - Không có thông tin bịa thêm ngoài nguồn.
  - Ghi rõ: "Quản lý nhân viên" = private, "Hospital Indoor Navigation" = public.
  - Với "Hospital Indoor Navigation": KHÔNG ghi tên bệnh viện cụ thể; dùng mô tả chung và ghi chú "tên bệnh viện chờ xác nhận người dùng".
  - `data/evidence.md` tồn tại và không rỗng.

### ui-designer
- **Mục tiêu:** Xác định hệ thống design token (màu, typography, spacing, breakpoint) và bố cục từng mục dựa trên reference/devportfolio; toàn bộ dùng CSS variable, font-stack hệ thống monospace.
- **Đọc:**
  - `reference/devportfolio/src/styles/global.css`
  - `reference/devportfolio/src/components/*.astro` (đọc để tham chiếu bố cục, không chạy)
  - `reference/devportfolio/LICENSE.md` (xác nhận giấy phép MIT trước khi tham chiếu code)
  - `data/inputs.md` (themeColor hint: `#0f172a`)
- **Ghi:** `data/design.md`, `templates/tokens.css`
- **Nghiệm thu:**
  - `tokens.css` chỉ chứa CSS custom properties (`:root { --... }`), không import ngoài.
  - `design.md` mô tả wireframe text cho 8 mục (Header, Hero, About, Skills, Projects, Experience, Education, Footer) đủ để frontend-builder dựng khung không cần hỏi lại.
  - Màu nhấn lấy từ biến `--color-accent`, không hardcode hex trong template.
  - Nếu chép CSS từ mẫu: giữ ghi chú bản quyền MIT.

### content-writer
- **Mục tiêu:** Chuẩn hóa toàn bộ dữ liệu từ `data/evidence.md` thành `data/profile.json` đúng schema CLAUDE.md; ngôn ngữ nội dung `en`; không bịa.
- **Đọc:** `data/evidence.md`, `data/inputs.md`, `CLAUDE.md` (schema)
- **Ghi:** `data/profile.json`
- **Nghiệm thu:**
  - `site.locale` = `"en"`.
  - `site.url` = `"https://quochuy-dev-fs.github.io/Porfolio/"` (placeholder; ghi chú cần xác nhận).
  - `person.name`, `person.title`, `person.summary` đều có giá trị.
  - Mỗi dự án có đủ `slug`, `name`, `summary`, `stack`, `visibility`.
  - "Quản lý nhân viên": `"visibility": "private"` — ghi vào profile.json nhưng không được xuất hiện trong docs/; không cần metrics/highlights chi tiết.
  - "Hospital Indoor Navigation": `"visibility": "public"` — đây là dự án công khai duy nhất trên site.
  - Tên bệnh viện trong summary/highlights của "Hospital Indoor Navigation": dùng "a general hospital" (KHÔNG ghi "Bệnh viện Quân y 7A").
  - Không có trường nào điền giả ("", "...", "TODO").
  - JSON hợp lệ (parse không lỗi).

### frontend-builder (giai đoạn 1: dựng khung)
- **Mục tiêu:** Tạo cấu trúc file template và script build; dựng khung HTML/CSS theo design.md và tokens.css; chưa điền dữ liệu động từ profile.json.
- **Đọc:**
  - `data/design.md`
  - `templates/tokens.css`
  - `reference/devportfolio/src/components/*.astro` (tham chiếu bố cục, không chạy)
  - `reference/devportfolio/LICENSE.md`
- **Ghi:** `templates/index.html` (template với placeholder), `scripts/build.mjs`, `scripts/check.mjs`
- **Nghiệm thu:**
  - `templates/index.html` có đủ 8 section: Header, Hero, About, Skills, Projects, Experience, Education, Footer.
  - `scripts/build.mjs` đọc `data/profile.json` + `templates/`, sinh ra `docs/index.html` và copy assets; chạy `node scripts/build.mjs` không lỗi (kiểm tra sau khi profile.json đã có dữ liệu).
  - `scripts/check.mjs` kiểm tra tối thiểu: JSON hợp lệ, trường bắt buộc có mặt, không có dự án private trong output.
  - Không CDN, không import ngoài trong template/script.
  - Nếu chép code từ mẫu: giữ ghi chú MIT.

### frontend-builder (giai đoạn 2: build)
- **Mục tiêu:** Chạy build thật để sinh `docs/`; kiểm tra output bằng `scripts/check.mjs`.
- **Đọc:** `data/profile.json`, `templates/*`, `scripts/*`
- **Ghi:** `docs/` (qua `node scripts/build.mjs`)
- **Nghiệm thu:**
  - `node scripts/build.mjs` chạy không lỗi, sinh ra `docs/index.html`.
  - `node scripts/check.mjs` chạy không lỗi, không cảnh báo critical.
  - `docs/index.html` chứa tên người dùng và dự án "Hospital Indoor Navigation" (dự án public duy nhất).
  - Không có dự án `visibility: "private"` ("Quản lý nhân viên") trong `docs/index.html`.
  - Không có placeholder còn sót (`{{`, `__TODO__`, v.v.).
  - Không có chuỗi "Bệnh viện Quân y 7A" trong docs/.

### qa-auditor
- **Mục tiêu:** Kiểm tra toàn bộ output: nội dung, kỹ thuật, bản quyền.
- **Đọc:** `docs/index.html`, `data/profile.json`, `data/evidence.md`, `templates/*`, `scripts/*`, `reference/devportfolio/LICENSE.md`
- **Ghi:** `data/qa-report.md`
- **Nghiệm thu (checklist tối thiểu):**
  - Không có dữ kiện bịa (đối chiếu evidence.md).
  - Không có dự án "Quản lý nhân viên" (private) trong docs/.
  - Không có chuỗi "Bệnh viện Quân y 7A" trong docs/ (tên bệnh viện chưa được xác nhận công khai).
  - Mọi số liệu kèm source trong profile.json.
  - Không có CDN/font ngoài/dependency trong docs/ hoặc templates/.
  - HTML parse được, không thẻ mở không đóng.
  - Nếu có đoạn code chép từ mẫu: ghi chú MIT còn nguyên.
  - LinkedIn URL không chứa ký tự diacritics chưa encode (huy-đoàn → cần encode hoặc xác nhận URL thực).
  - `qa-report.md` liệt kê rõ: passed / warning / failed cho từng mục.
  - Ghi warning nếu `site.url` vẫn là placeholder (chưa được người dùng xác nhận).

### publisher
- **Mục tiêu:** Hướng dẫn người dùng các bước deploy thủ công lên GitHub Pages; không tự deploy.
- **Đọc:** `data/qa-report.md`, `data/profile.json`, `data/inputs.md`
- **Ghi:** `README.md`, `data/publish-steps.md`
- **Nghiệm thu:**
  - `publish-steps.md` liệt kê từng bước cụ thể (tạo repo, push, bật Pages, kiểm tra URL).
  - Bước đầu tiên trong publish-steps.md: nhắc người dùng xác nhận URL GitHub Pages thực tế trước khi push (placeholder hiện tại: `https://quochuy-dev-fs.github.io/Porfolio/`).
  - Bước trong publish-steps.md: nhắc người dùng xác nhận tên bệnh viện có được nêu công khai không, nếu có thì cập nhật `data/inputs.md` và chạy lại content-writer + build.
  - `README.md` mô tả dự án, cách build local, cách cập nhật nội dung.
  - Không chứa secret hay token.
  - Không tự chạy git push hay deploy.

## Câu hỏi bắt buộc
Không có.
