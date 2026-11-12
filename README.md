# Portfolio — Đoàn Quốc Huy

Static portfolio site for a fullstack developer, generated from a single data file (`data/profile.json`) and published on GitHub Pages. No dependencies, no CDN, no external fonts.

---

## Xem cục bộ

**Cách 1 — HTTP server (khuyến nghị, tránh lỗi CORS với file JS module):**

```bash
python3 -m http.server 8000 --directory docs
# sau đó mở http://localhost:8000
```

**Cách 2 — Mở thẳng file:**

```
docs/index.html
```

---

## Cập nhật nội dung

1. Sửa `data/profile.json` (nguồn dữ liệu duy nhất của site).
2. Chạy lại build:
   ```bash
   node scripts/build.mjs
   ```
3. Kiểm tra output:
   ```bash
   node scripts/check.mjs
   ```
4. Xem kết quả trong `docs/index.html`.

> Không sửa tay các file trong `docs/` — thư mục này được sinh lại mỗi lần build và sẽ bị ghi đè.

---

## Cấu trúc thư mục

```
Portfolio/
├── data/
│   ├── profile.json        # nguồn dữ liệu duy nhất — sửa ở đây
│   ├── brief.md            # yêu cầu dự án (do brief-architect ghi)
│   ├── design.md           # hệ thống design token và wireframe (do ui-designer ghi)
│   └── qa-report.md        # kết quả kiểm định (do qa-auditor ghi)
├── docs/                   # output — KHÔNG sửa tay
│   ├── index.html
│   ├── assets/
│   └── ...
├── scripts/
│   ├── build.mjs           # sinh docs/ từ profile.json + templates/
│   └── check.mjs           # kiểm tra JSON, trường bắt buộc, không dự án private
├── templates/
│   ├── index.html.tpl      # template trang chính
│   ├── project.html.tpl    # template trang dự án
│   ├── style.css           # stylesheet
│   ├── site.js             # JavaScript
│   ├── tokens.css          # CSS custom properties (màu, typography, spacing)
│   └── og-image.svg        # ảnh Open Graph (xem cảnh báo bên dưới)
├── CLAUDE.md               # quy tắc dự án
└── README.md               # file này
```

---

## Cảnh báo còn lại (cần xử lý trước khi publish)

- **og:image là SVG:** `docs/assets/og-image.svg` — Facebook, LinkedIn, Twitter/X thường không render SVG làm ảnh preview. Nên thay bằng PNG hoặc JPEG kích thước tối thiểu 1200×630 px.
- **LinkedIn chưa có:** URL `www.linkedin.com/in/huy-đoàn-077089432` chứa ký tự có dấu chưa được xác nhận. Xác nhận URL thực (có thể là `huy-doan-077089432`) rồi thêm vào `person.links.linkedin` trong `data/profile.json` và build lại.
- **Responsive 320 px:** Chỉ kiểm tra CSS tĩnh, chưa xem trên viewport thật. Mở DevTools và thử ở 320 px trước khi publish.
- **URL site:** Placeholder `https://quochuy-dev-fs.github.io/Porfolio/` (tên repo "Porfolio" có thể là typo). Xác nhận tên repo thực trước khi push (xem `data/publish-steps.md`).

---

## Yêu cầu

- Node.js 18 trở lên (chỉ dùng để chạy `scripts/build.mjs` và `scripts/check.mjs`).
- Python 3 (tùy chọn, chỉ để chạy HTTP server xem local).
- Không cần cài thêm package nào.
