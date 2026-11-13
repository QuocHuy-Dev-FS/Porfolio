# Hướng dẫn publish lên GitHub Pages

Thực hiện từng bước theo thứ tự. Mỗi lệnh git/GitHub được đánh số riêng để bạn duyệt và chạy từng lệnh một.

---

## Bước 0 — Xác nhận trước khi làm bất cứ điều gì

**0a. Xác nhận tên repo và URL Pages thực tế**

Giá trị hiện tại trong `data/profile.json` → `site.url`:
```
https://quochuy-dev-fs.github.io/Porfolio/
```
URL inputs.md ghi: `https://github.com/QuocHuy-Dev-FS/Porfolio.git` — tên repo là `Porfolio` (thiếu chữ "t", có thể là typo của "Portfolio").

Hãy quyết định:
- **Giữ tên `Porfolio`**: URL Pages sẽ là `https://quochuy-dev-fs.github.io/Porfolio/` — không cần sửa gì.
- **Đổi thành `Portfolio`**: sửa `site.url` trong `data/profile.json` thành `https://quochuy-dev-fs.github.io/Portfolio/`, chạy lại `node scripts/build.mjs`, sau đó tạo repo GitHub với tên `Portfolio`.

> Quyết định trước lần push đầu tiên. Đổi tên repo sau khi đã push sẽ làm hỏng mọi link cũ.

**0b. Kiểm tra file nào không nên đưa lên repo công khai**

Repo hiện có các file chưa commit cần xem xét:

| File | Nội dung | Khuyến nghị |
|---|---|---|
| `data/inputs.md` | Dữ liệu thô do bạn điền — có thể chứa thông tin riêng tư | Thêm vào `.gitignore` nếu chưa có |
| `data/evidence.md` | Dữ kiện khai thác từ file nguồn — có thể chứa đường dẫn nội bộ | Thêm vào `.gitignore` nếu chưa có |
| `portfolio-team-setup-prompt.md` | Prompt thiết lập agent — không nhạy cảm nhưng không cần thiết public | Thêm vào `.gitignore` hoặc xóa nếu không muốn public |
| `package.json` | Metadata Node.js | An toàn để commit nếu không chứa secret |
| `scripts/dev.mjs` | Script phát triển | An toàn để commit |
| `.claude/launch.json` | Cấu hình agent Claude | Xem nội dung trước; nếu chứa token hay path riêng thì thêm vào `.gitignore` |

Thêm file muốn ẩn vào `.gitignore` trước khi tiếp tục.

**0c. Xác nhận tên bệnh viện**

Các dự án bệnh viện hiện dùng "a Grade-I hospital" và "a general hospital" thay vì tên cụ thể.
- Nếu được phép nêu tên bệnh viện công khai: cập nhật `data/profile.json`, chạy lại `node scripts/build.mjs`.
- Nếu giữ mô tả chung: không cần làm gì.

**0d. Xử lý og:image (khuyến nghị)**

`docs/assets/og-image.svg` — Facebook, LinkedIn, Twitter/X thường không render SVG làm ảnh preview. Nên:
- Tạo file PNG hoặc JPEG kích thước 1200×630 px thay thế, đặt vào `docs/assets/`.
- Cập nhật tham chiếu trong `templates/index.html.tpl` và `templates/project.html.tpl`, build lại.
- Nếu chấp nhận thiếu preview card trên mạng xã hội: bỏ qua bước này.

**0e. Kiểm tra responsive 320 px**

Mở `docs/index.html` trong trình duyệt, bật DevTools (F12), chuyển sang chế độ responsive, thử ở 320 px. Chưa có kết quả kiểm tra thực tế trong trình duyệt.

---

## Bước 1 — Kiểm tra trạng thái repo

**Lệnh 1:**
```bash
git status
```
Làm gì: hiển thị file đã thay đổi và chưa commit. Có thể đảo ngược: có (không thay đổi gì).

Các file sẽ được thêm vào commit (đã xác nhận an toàn):
- `docs/` — output build, nội dung trang web (3 dự án public)
- `data/profile.json` — dữ liệu site (không chứa secret)
- `data/brief.md` — yêu cầu dự án
- `data/design.md` — design token và wireframe
- `data/qa-report.md` — kết quả kiểm định (KẾT QUẢ: PASS)
- `data/publish-steps.md` — file này
- `templates/` — template HTML/CSS/JS
- `scripts/` — script build và check
- `README.md` — hướng dẫn repo
- `CLAUDE.md` — quy tắc dự án
- `.claude/` — cấu hình agent (xác nhận không chứa token trước)

**Các file KHÔNG đưa lên repo công khai (nếu chứa thông tin riêng tư):**
- `data/inputs.md` — dữ liệu thô
- `data/evidence.md` — dữ kiện khai thác
- `portfolio-team-setup-prompt.md` — prompt thiết lập

Thêm vào `.gitignore` trước khi stage nếu chưa làm ở Bước 0b.

---

## Bước 2 — Build lần cuối và kiểm tra

**Lệnh 2:**
```bash
node scripts/build.mjs
```
Làm gì: sinh lại `docs/` từ `data/profile.json` + `templates/`. Có thể đảo ngược: có (chạy lại bất cứ lúc nào).

**Lệnh 3:**
```bash
node scripts/check.mjs
```
Làm gì: kiểm tra JSON hợp lệ, trường bắt buộc, không có dự án private trong output. Có thể đảo ngược: có (chỉ đọc, không ghi).

Chỉ tiếp tục nếu cả hai lệnh chạy không lỗi.

---

## Bước 3 — Stage và commit

**Lệnh 4:**
```bash
git add docs/ data/profile.json data/brief.md data/design.md data/qa-report.md data/publish-steps.md templates/ scripts/ README.md CLAUDE.md .claude/
```
Làm gì: thêm các file cụ thể vào staging area (không stage file ngoài danh sách). Có thể đảo ngược: có (`git reset HEAD <file>` để unstage từng file).

**Lệnh 5:**
```bash
git status
```
Làm gì: xác nhận lại danh sách file sẽ commit — không có file ngoài ý muốn trong staged. Có thể đảo ngược: có.

**Lệnh 6:**
```bash
git commit -m "Add 3 public projects, qa-report PASS, publish steps"
```
Làm gì: tạo commit với toàn bộ file đã stage. Có thể đảo ngược: có (`git reset --soft HEAD~1` để undo commit, giữ nguyên file trong working tree).

---

## Bước 4 — Liên kết remote và push

> Repo local đã có commit. Kiểm tra remote hiện có bằng `git remote -v` trước.

**Lệnh 7 (kiểm tra remote):**
```bash
git remote -v
```
Làm gì: hiển thị remote đã cấu hình. Có thể đảo ngược: có (chỉ đọc).

**Lệnh 8 (nếu chưa có remote `origin`):**

Trước tiên tạo repo trên GitHub: vào `github.com/new`, đặt tên `Porfolio` (hoặc tên đã xác nhận ở Bước 0a), chọn **Public**, bỏ chọn "Add a README file". Sau đó:

```bash
git remote add origin https://github.com/QuocHuy-Dev-FS/Porfolio.git
```
Làm gì: liên kết repo local với repo GitHub. Có thể đảo ngược: có (`git remote remove origin`).

**Lệnh 9:**
```bash
git push -u origin main
```
Làm gì: đẩy nhánh `main` và toàn bộ lịch sử commit lên GitHub. Có thể đảo ngược: hạn chế (có thể force-push hoặc xóa nhánh trên remote, nhưng nếu repo đã public thì người khác có thể đã thấy).

---

## Bước 5 — Bật GitHub Pages

Thực hiện qua giao diện web GitHub:

1. Vào repo trên GitHub → tab **Settings**.
2. Menu trái → **Pages**.
3. Mục **Source**: chọn **Deploy from a branch**.
4. Branch: chọn `main`, thư mục: chọn `/docs`.
5. Nhấn **Save**.

GitHub sẽ build và deploy. Thường mất 1–3 phút. Có thể đảo ngược: có (đổi Source về "None" để tắt Pages).

---

## Bước 6 — Xác minh sau triển khai

**Lệnh 10:**
```bash
# Windows — mở URL trong trình duyệt (thay bằng URL thực tế đã xác nhận ở Bước 0a)
start https://quochuy-dev-fs.github.io/Porfolio/
```
Làm gì: mở trang web để kiểm tra bằng mắt. Có thể đảo ngược: có.

Danh sách kiểm tra sau khi mở trang:
- [ ] Trang load được, không lỗi 404.
- [ ] Tên, chức danh, email hiển thị đúng.
- [ ] Dự án "Hospital Indoor Navigation" hiển thị và mở được trang chi tiết.
- [ ] Dự án "Hospital Quality Survey" hiển thị và mở được trang chi tiết.
- [ ] Dự án "Employee Management" hiển thị và mở được trang chi tiết.
- [ ] Link GitHub (`https://github.com/QuocHuy-Dev-FS`) hoạt động.
- [ ] Link LinkedIn mở đúng profile (URL có ký tự `%C4%91` — xác nhận trên trình duyệt).
- [ ] Thử trên điện thoại hoặc DevTools 375 px.
- [ ] Không lỗi JS trong console (F12 → Console).
- [ ] Kiểm tra preview card qua [Facebook Debugger](https://developers.facebook.com/tools/debug/) nếu đã thay og:image sang PNG/JPEG.

---

## Tóm tắt lệnh theo thứ tự

```
1.  git status
    → Xem xét .gitignore cho data/inputs.md, data/evidence.md, portfolio-team-setup-prompt.md nếu cần
2.  node scripts/build.mjs
3.  node scripts/check.mjs
4.  git add docs/ data/profile.json data/brief.md data/design.md data/qa-report.md data/publish-steps.md templates/ scripts/ README.md CLAUDE.md .claude/
5.  git status
    → Xác nhận không có file ngoài ý muốn trong staged
6.  git commit -m "Add 3 public projects, qa-report PASS, publish steps"
7.  git remote -v
    → Nếu chưa có: tạo repo GitHub rồi git remote add origin https://github.com/QuocHuy-Dev-FS/Porfolio.git
8.  (nếu cần) git remote add origin https://github.com/QuocHuy-Dev-FS/Porfolio.git
9.  git push -u origin main
    → Bật Pages: Settings → Pages → Deploy from branch → main /docs
10. start https://quochuy-dev-fs.github.io/Porfolio/
```
