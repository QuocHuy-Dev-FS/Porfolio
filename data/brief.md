# Brief portfolio

## Mục tiêu (1 câu)
Bổ sung hai dự án mới (Hospital Quality Survey và Employee Shift & Payroll) vào mảng `projects[]` trong `data/profile.json`, giữ nguyên dự án hospital-indoor-navigation và toàn bộ dữ liệu hiện tại.

## Đối tượng đọc và mục đích
- Nhà tuyển dụng kỹ thuật: đánh giá năng lực qua dự án thực, stack, vai trò cụ thể.
- Khách hàng freelance: xác nhận khả năng giao việc, xem demo/repo.
- Ngôn ngữ site: `en` (theo `site.locale` trong profile.json).

## Phạm vi và ngoài phạm vi
**Trong phạm vi:**
- Trích xuất dữ kiện từ hai file nguồn vào `data/evidence.md` (project-miner).
- Thêm hai entry project vào `data/profile.json` (content-writer).
- Build lại `docs/` và chạy check (frontend-builder).
- Kiểm định toàn bộ output (qa-auditor).

**Ngoài phạm vi:**
- Không thay đổi thiết kế, templates, tokens.css (ui-designer không chạy).
- Không thêm section mới vào giao diện.
- Không thay đổi dự án hospital-indoor-navigation hiện có.
- Không git commit, push, deploy, bật GitHub Pages khi chưa được phép rõ ràng.
- Không điền links.repo / links.demo (bỏ hẳn khóa `links` cho cả hai dự án mới).
- Không đưa tên "Bệnh viện Quân y 7A", email quản trị, dữ liệu `.env.local`, feedbacks.json thật vào bất kỳ file output nào.

## Ràng buộc (từ CLAUDE.md + yêu cầu này)
1. Không bịa. Chỉ dùng dữ kiện xác minh được trong `data/evidence.md`.
2. Mọi con số nằm trong `metrics[]` hoặc `highlights[]` kèm `source` (tên file nguồn).
3. Không điền trường có giá trị giả ("", "...", "TODO", null).
4. Dự án `visibility: "private"` không xuất hiện trong `docs/`.
5. Không tên bệnh viện cụ thể trong bất kỳ file output nào — dùng "a Grade-I hospital".
6. Hospital Quality Survey: vai trò chỉ ghi "Fullstack Developer" (file nguồn chưa xác nhận solo hay nhóm); không ghi thời gian (file nguồn ghi "[CẦN BỔ SUNG]").
7. Manager Project (Employee Shift & Payroll): thời gian "09/2026 – 11/2026", vai trò "Full-stack (sole developer)" — đúng như file nguồn ghi.
8. `category: "web"` cho cả hai dự án mới.
9. Hai dự án mới đều `visibility: "public"`.
10. Văn phong tiếng Anh, ngắn, cụ thể, động từ rõ ràng; tránh từ sáo rỗng.
11. `docs/` chỉ sinh ra qua `node scripts/build.mjs`; không sửa tay.

## Agent cần chạy
Wave 1: project-miner
Wave 2: content-writer
Wave 3: frontend-builder (build + check)
Wave 4: qa-auditor

## Nhiệm vụ từng agent

### project-miner
- **Mục tiêu:** Đọc hai file nguồn, trích xuất dữ kiện có thể xác minh (stack, số liệu có nguồn, tính năng chính, điểm kỹ thuật) của hai dự án mới; bổ sung vào `data/evidence.md` mà không xóa dữ kiện cũ.
- **Đọc:**
  - `D:\Workplace\hospital-quality-survey\CV_PORTFOLIO_hospital-quality-survey.md`
  - `D:\Workplace\Manager-Project\PORTFOLIO.md`
  - `data/evidence.md` (để bổ sung, giữ nguyên phần cũ)
- **Ghi:** `data/evidence.md`
- **Nghiệm thu:**
  - Mỗi dữ kiện mới ghi rõ nguồn (tên file + section).
  - Hai dự án mới có section riêng trong evidence.md.
  - Dữ liệu cũ (hospital-indoor-navigation, thông tin cá nhân) còn nguyên.
  - Không ghi tên "Bệnh viện Quân y 7A"; ghi "a Grade-I hospital" hoặc "bệnh viện hạng I" trong phần mô tả nội bộ evidence.
  - Chỉ ghi số liệu có nguồn rõ ràng trong file nguồn: 27/27 test PASS, 83 test Vitest, 4 migration (Hospital Quality Survey), 6 migration, 46 commit (Manager Project), 13 departments (Hospital Quality Survey). Bỏ mọi mục [CẦN BỔ SUNG].
  - Ghi rõ ràng: Hospital Quality Survey chưa có thời gian xác nhận, vai trò chưa xác nhận solo/nhóm.
  - Không có thông tin bịa thêm ngoài nguồn.

### content-writer
- **Mục tiêu:** Thêm hai entry project mới vào mảng `projects[]` trong `data/profile.json`; giữ nguyên mọi dữ liệu hiện có.
- **Đọc:**
  - `data/evidence.md` (nguồn duy nhất để lấy dữ kiện)
  - `data/profile.json` (để bổ sung, không xóa gì)
  - `data/brief.md` (ràng buộc nội dung và schema)
- **Ghi:** `data/profile.json`
- **Nghiệm thu:**
  - Mảng `projects[]` có đúng 3 entry sau khi ghi: hospital-indoor-navigation (giữ nguyên), hospital-quality-survey (mới), quan-ly-nhan-vien (giữ nguyên — private).
  - Dự án hospital-indoor-navigation không bị thay đổi bất kỳ trường nào.
  - Dự án quan-ly-nhan-vien (Employee Management, private) không bị thay đổi.
  - **hospital-quality-survey:**
    - `slug`: `"hospital-quality-survey"`
    - `name`: `"Hospital Quality Survey"`
    - `role`: `"Fullstack Developer"` (không ghi thời gian vì chưa xác nhận)
    - `summary`: 1–2 câu tiếng Anh, không nhắc tên bệnh viện cụ thể, dùng "a Grade-I hospital"
    - `stack`: lấy từ evidence.md (Next.js 16, React 19, Tailwind CSS 4, Supabase, PostgreSQL, Recharts, ESLint)
    - `highlights[]`: tối đa 5 mục, mỗi mục kèm `source: "CV_PORTFOLIO_hospital-quality-survey.md"`
    - `metrics[]`: chỉ điền `{ "label": "Department mapping tests", "value": "27/27 PASS", "source": "CV_PORTFOLIO_hospital-quality-survey.md, section 5" }` và `{ "label": "SQL migrations", "value": "4", "source": "CV_PORTFOLIO_hospital-quality-survey.md, section 4" }` và `{ "label": "Departments covered", "value": "13", "source": "CV_PORTFOLIO_hospital-quality-survey.md, section 4" }`
    - `category`: `"web"`
    - `visibility`: `"public"`
    - Không có khóa `links`
  - **quan-ly-nhan-vien (Employee Shift & Payroll — tên mới):** xem ghi chú phía dưới.
    - Lưu ý: dự án quan-ly-nhan-vien hiện đang `visibility: "private"`. Người dùng CHƯA yêu cầu chuyển sang public. Giữ nguyên `visibility: "private"`. Nếu content-writer muốn thêm metrics/highlights từ PORTFOLIO.md vào entry này (để sẵn khi sau đổi public), được phép — nhưng KHÔNG đổi visibility.
    - Nếu bổ sung dữ liệu cho quan-ly-nhan-vien: `highlights[]` và `metrics[]` lấy từ evidence.md, kèm `source: "Manager-Project/PORTFOLIO.md"`. Các số liệu: 83 test Vitest pass, 46 commits, 6 SQL migrations, period "09/2026 – 11/2026".
  - JSON hợp lệ, parse không lỗi.
  - Không trường nào điền giả ("", "...", "TODO", null).
  - `site.locale` vẫn là `"en"`.

### frontend-builder (giai đoạn build + check)
- **Mục tiêu:** Chạy build để sinh lại `docs/` với dữ liệu mới; chạy check để xác minh không lỗi.
- **Đọc:** `data/profile.json`, `templates/*`, `scripts/build.mjs`, `scripts/check.mjs`
- **Ghi:** `docs/` (qua `node scripts/build.mjs`)
- **Nghiệm thu:**
  - `node scripts/build.mjs` chạy không lỗi.
  - `node scripts/check.mjs` chạy không lỗi, không cảnh báo critical.
  - `docs/index.html` chứa dự án "Hospital Quality Survey".
  - `docs/projects/hospital-quality-survey/index.html` tồn tại và không rỗng.
  - Không có chuỗi "Bệnh viện Quân y 7A" trong bất kỳ file nào trong `docs/`.
  - Dự án quan-ly-nhan-vien (`visibility: "private"`) KHÔNG xuất hiện trong `docs/`.
  - Không có placeholder còn sót (`{{`, `__TODO__`) trong `docs/`.
  - Dự án hospital-indoor-navigation vẫn còn trong `docs/index.html`.

### qa-auditor
- **Mục tiêu:** Kiểm định output sau khi thêm hai dự án mới: nội dung đúng nguồn, không lộ thông tin nhạy cảm, build ổn định.
- **Đọc:** `docs/index.html`, `docs/projects/hospital-quality-survey/index.html`, `docs/projects/hospital-indoor-navigation/index.html`, `data/profile.json`, `data/evidence.md`
- **Ghi:** `data/qa-report.md`
- **Nghiệm thu (checklist tối thiểu):**
  - Không có chuỗi "Bệnh viện Quân y 7A" trong `docs/`.
  - Không có dự án quan-ly-nhan-vien trong `docs/` (visibility: private).
  - Dự án hospital-indoor-navigation vẫn hiện trong `docs/index.html` và trang chi tiết.
  - Dự án hospital-quality-survey xuất hiện trong `docs/index.html` và có trang chi tiết.
  - Mọi số liệu trong profile.json kèm `source`.
  - Không có trường bịa (giá trị rỗng "", "...", "TODO").
  - Không CDN, font ngoài, dependency ngoài trong `docs/`.
  - JSON profile.json hợp lệ.
  - `qa-report.md` liệt kê rõ: passed / warning / failed cho từng mục.

## Câu hỏi bắt buộc
(Không có — người dùng đã trả lời đủ.)
