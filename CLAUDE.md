# Dự án portfolio fullstack dev

## Mục tiêu
Một trang portfolio tĩnh, đăng công khai trên GitHub Pages, cho một lập trình viên fullstack. Dùng để xin việc hoặc nhận dự án.

## Công nghệ
HTML, CSS, JavaScript thuần. Không dependency, không CDN, không font ngoài, không analytics. Node 18+ chỉ để chạy `scripts/build.mjs` và `scripts/check.mjs`. Không cài thêm package khi chưa có sự đồng ý của tôi.

## Nguồn dữ liệu duy nhất
- `data/inputs.md`: dữ liệu thô do tôi điền.
- `data/profile.json`: nội dung đã chuẩn hóa, nguồn duy nhất của site.
- `docs/`: thư mục SINH RA bởi `node scripts/build.mjs`. Không sửa tay (hook sẽ chặn). Muốn đổi, sửa `data/profile.json` hoặc `templates/` rồi build lại.

## Sở hữu file (mỗi file chỉ một agent được ghi)
- `data/brief.md`: brief-architect
- `data/evidence.md`: project-miner
- `data/design.md`, `templates/tokens.css`: ui-designer
- `data/profile.json`: content-writer
- `templates/*` (trừ tokens.css), `scripts/*`, `docs/` (qua build): frontend-builder
- `data/qa-report.md`: qa-auditor
- `README.md`, `data/publish-steps.md`: publisher
Hai agent chạy song song không bao giờ được ghi cùng một file.

## Quy tắc nội dung (bất biến)
1. Không bịa. Chỉ dùng dữ kiện có trong `data/evidence.md`.
2. Mọi con số (người dùng, %, thời gian, số sao...) nằm trong `metrics[]` hoặc `highlights[]` kèm `source`. Không đặt số liệu trong câu văn.
3. Không bịa lời giới thiệu, chứng chỉ, tên công ty, thành tích.
4. Dự án có `visibility: "private"` không bao giờ xuất hiện trong `docs/`.
5. Không đưa secret, token, mật khẩu, địa chỉ nội bộ, dữ liệu khách hàng, dữ liệu cá nhân của người khác vào bất kỳ file nào.
6. Văn phong ngắn, cụ thể, động từ rõ ràng. Tránh từ sáo rỗng (passionate, cutting-edge, world-class, rockstar, ninja, guru, hàng đầu, đẳng cấp).

## Quy tắc làm việc
- Trao đổi với tôi bằng tiếng Việt. Ngôn ngữ của site theo `site.locale` (mặc định `vi`).
- Không git commit, push, deploy, bật GitHub Pages khi chưa có sự cho phép rõ ràng của tôi trong phiên hiện tại.
- Chỉ báo "xong" khi đã chạy kiểm tra thật và có kết quả. Nói rõ phần chưa kiểm chứng được (ví dụ chưa xem trên trình duyệt).
- Báo cáo cuối của mỗi agent tối đa 12 dòng: đã làm gì, file đã ghi, vấn đề còn lại.

## Cấu trúc data/profile.json
{
  "site": { "url": "https://USERNAME.github.io/", "locale": "vi", "themeColor": "#0f172a" },
  "person": {
    "name": "", "title": "", "location": "", "summary": "",
    "email": "", "links": { "github": "", "linkedin": "", "website": "" }
  },
  "skills": [ { "group": "Frontend", "items": ["..."] } ],
  "projects": [
    {
      "slug": "ten-du-an", "name": "", "role": "", "summary": "",
      "stack": ["..."],
      "highlights": [ { "text": "", "source": "" } ],
      "metrics": [ { "label": "", "value": "", "source": "" } ],
      "links": { "repo": "", "demo": "" },
      "visibility": "public"
    }
  ],
  "experience": [ { "org": "", "role": "", "period": "", "bullets": ["..."] } ],
  "education": [ { "school": "", "degree": "", "period": "" } ],

  "traits": ["..."],
  "services": [ { "title": "", "description": "", "icon": "" } ],
  "stats": [ { "icon": "", "value": "", "label": "", "source": "" } ],
  "skillLevels": [ { "label": "", "value": "", "source": "" } ],
  "testimonials": [ { "quote": "", "author": "", "role": "", "source": "" } ],
  "pricing": [ { "name": "", "price": "", "unit": "", "description": "", "features": ["..."], "popular": false, "source": "" } ],
  "pricingPerks": ["..."]
}
Khóa tùy chọn mở rộng (bố cục kiểu manhnguyen18): `person.about[]` (các đoạn giới thiệu), `person.tagline`, `person.available` (boolean), `person.resume` (đường dẫn như `assets/cv.pdf`), `person.phone`, và `projects[].category` (`web` | `mobile` | `api` | `open-source`). Các khối `stats`, `skillLevels`, `testimonials`, `pricing` chỉ được render khi có dữ liệu thật kèm `source`; mọi con số nằm trong trường có `source`.
Trường nào chưa có dữ kiện thì bỏ hẳn khóa đó, đừng điền giả. `person.name`, `person.title`, `person.summary`, và mỗi dự án phải có `slug`, `name`, `summary`, `stack`, `visibility`.
