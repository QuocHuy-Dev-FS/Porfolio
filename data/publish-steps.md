# Hướng dẫn publish lên GitHub Pages

Thực hiện từng bước theo thứ tự. Mỗi lệnh git/GitHub được đánh số riêng để bạn duyệt và chạy từng lệnh một.

---

## Bước 0 — Xác nhận trước khi làm bất cứ điều gì

**0a. Xác nhận tên repo và URL Pages thực tế**

Placeholder hiện tại trong `data/profile.json` → `site.url`:
```
https://quochuy-dev-fs.github.io/Porfolio/
```
Tên repo trên GitHub hiện là `Porfolio` (có thể là typo của "Portfolio").

Hãy quyết định:
- Giữ tên `Porfolio` → URL Pages sẽ là `https://quochuy-dev-fs.github.io/Porfolio/` — không cần sửa gì.
- Đổi thành `Portfolio` → cần sửa `site.url` trong `data/profile.json` thành `https://quochuy-dev-fs.github.io/Portfolio/`, sau đó chạy lại `node scripts/build.mjs`.

> Nếu đổi tên repo sau khi đã push, mọi link cũ sẽ trỏ sai; cần đổi ngay trước lần push đầu tiên.

**0b. Xác nhận tên bệnh viện**

Dự án "Hospital Indoor Navigation" hiện dùng "a general hospital" thay vì tên cụ thể "Bệnh viện Quân y 7A".
- Nếu được phép nêu tên bệnh viện công khai: cập nhật `data/inputs.md`, chạy lại content-writer (hoặc sửa trực tiếp `data/profile.json`), rồi `node scripts/build.mjs`.
- Nếu giữ mô tả chung: không cần làm gì.

**0c. Xác nhận URL LinkedIn**

URL trong `data/inputs.md`: `www.linkedin.com/in/huy-đoàn-077089432` (có ký tự có dấu).
- Kiểm tra URL thực tế trên trình duyệt (có thể là `https://www.linkedin.com/in/huy-doan-077089432`).
- Nếu xác nhận được: thêm vào `data/profile.json` → `person.links.linkedin`, chạy lại `node scripts/build.mjs`.

**0d. Xử lý og:image (khuyến nghị)**

`docs/assets/og-image.svg` — Facebook, LinkedIn, Twitter/X thường không render SVG làm ảnh preview. Nên:
- Tạo file PNG hoặc JPEG kích thước 1200×630 px thay thế.
- Cập nhật tham chiếu trong template, build lại.
- Nếu chấp nhận thiếu preview card trên mạng xã hội: bỏ qua bước này.

**0e. Kiểm tra responsive 320 px**

Mở `docs/index.html` trong trình duyệt, bật DevTools (F12), chuyển sang chế độ responsive, thử ở 320 px. Chưa có kết quả kiểm tra thực tế trong trình duyệt.

---

## Bước 1 — Kiểm tra trạng thái repo

**Lệnh 1:**
```bash
git status
```
Làm gì: hiển thị file chưa commit. Có thể đảo ngược: có (không thay đổi gì).

Các file sẽ được thêm vào commit (đã xác nhận an toàn):
- `docs/` — output build, nội dung trang web
- `data/profile.json` — dữ liệu site (không chứa secret)
- `data/brief.md` — yêu cầu dự án
- `data/design.md` — design token và wireframe
- `data/qa-report.md` — kết quả kiểm định
- `templates/` — template HTML/CSS/JS
- `scripts/` — script build và check
- `README.md` — hướng dẫn repo
- `CLAUDE.md` — quy tắc dự án
- `.claude/` — cấu hình agent

**Các file KHÔNG đưa lên repo công khai:**

`data/inputs.md` và `data/evidence.md` đã có trong `.gitignore` (xác nhận ở dòng 1–2 của file `.gitignore`). Hai file này chứa đường dẫn nội bộ và dữ liệu thô — không cần thao tác thêm.

Nếu bạn có thêm file nào chứa thông tin riêng tư (key, token, path nội bộ), thêm vào `.gitignore` trước khi tiếp tục.

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
git add docs/ data/profile.json data/brief.md data/design.md data/qa-report.md templates/ scripts/ README.md CLAUDE.md .claude/
```
Làm gì: thêm các file cụ thể vào staging area. Có thể đảo ngược: có (`git reset HEAD <file>` để unstage).

**Lệnh 5:**
```bash
git status
```
Làm gì: xác nhận lại danh sách file sẽ commit — không có file ngoài ý muốn. Có thể đảo ngược: có.

**Lệnh 6:**
```bash
git commit -m "Add portfolio site: static HTML/CSS/JS, generated from profile.json"
```
Làm gì: tạo commit với toàn bộ file đã stage. Có thể đảo ngược: có (`git reset --soft HEAD~1` để undo commit, giữ nguyên file).

---

## Bước 4 — Tạo repo GitHub và push

> Nếu repo đã tồn tại trên GitHub (tên `Porfolio`), bỏ qua lệnh 7 và tiếp tục từ lệnh 8.

**Lệnh 7 (nếu chưa có remote):**

Tạo repo qua giao diện web GitHub: vào `github.com/new`, đặt tên `Porfolio` (hoặc tên đã xác nhận ở Bước 0a), chọn Public, không tạo README/gitignore. Sau đó:

```bash
git remote add origin https://github.com/QuocHuy-Dev-FS/Porfolio.git
```
Làm gì: liên kết repo local với repo GitHub. Có thể đảo ngược: có (`git remote remove origin`).

**Lệnh 8:**
```bash
git push -u origin main
```
Làm gì: đẩy nhánh `main` lên GitHub. Có thể đảo ngược: hạn chế (có thể force-push hoặc xóa commit trên remote, nhưng nếu đã public thì người khác có thể đã thấy).

---

## Bước 5 — Bật GitHub Pages

Thực hiện qua giao diện web GitHub (không có lệnh CLI tương đương đơn giản):

1. Vào repo trên GitHub → tab **Settings**.
2. Menu trái → **Pages**.
3. Mục **Source**: chọn **Deploy from a branch**.
4. Branch: chọn `main`, thư mục: chọn `/docs`.
5. Nhấn **Save**.

GitHub sẽ build và deploy. Thường mất 1–3 phút. Có thể đảo ngược: có (đổi Source về "None" để tắt Pages).

---

## Bước 6 — Xác minh sau triển khai

**Lệnh 9:**
```bash
# Mở URL trong trình duyệt (thay bằng URL thực tế đã xác nhận ở Bước 0a)
# Windows:
start https://quochuy-dev-fs.github.io/Porfolio/
```
Làm gì: mở trang web để kiểm tra bằng mắt. Có thể đảo ngược: có.

Danh sách kiểm tra sau khi mở trang:
- [ ] Trang load được, không lỗi 404.
- [ ] Tên, chức danh, email hiển thị đúng.
- [ ] Dự án "Hospital Indoor Navigation" hiển thị.
- [ ] Dự án "Quản lý nhân viên" (private) KHÔNG hiển thị.
- [ ] Các link (GitHub, email) hoạt động.
- [ ] Thử trên điện thoại hoặc DevTools 375 px.
- [ ] Kiểm tra preview card qua [Facebook Debugger](https://developers.facebook.com/tools/debug/) hoặc [Twitter Card Validator](https://cards-dev.twitter.com/validator) (nếu đã thay og:image sang PNG/JPEG).

---

## Tóm tắt lệnh theo thứ tự

```
1.  git status
2.  node scripts/build.mjs
3.  node scripts/check.mjs
4.  git add docs/ data/profile.json data/brief.md data/design.md data/qa-report.md templates/ scripts/ README.md CLAUDE.md .claude/
5.  git status
6.  git commit -m "Add portfolio site: static HTML/CSS/JS, generated from profile.json"
7.  git remote add origin https://github.com/QuocHuy-Dev-FS/Porfolio.git   (nếu chưa có remote)
8.  git push -u origin main
    → Bật Pages qua giao diện GitHub (Settings → Pages → Deploy from branch → main /docs)
9.  start https://quochuy-dev-fs.github.io/Porfolio/
```
