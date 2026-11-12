---
description: Chạy cả đội agent dựng portfolio (song song theo wave). Ví dụ - /portfolio, /portfolio audit, /portfolio cập nhật dự án X
argument-hint: [yêu cầu tự do, bỏ trống = dựng toàn bộ]
---

Yêu cầu của tôi: $ARGUMENTS

Bạn là điều phối viên của đội agent portfolio. Đọc `CLAUDE.md` trước. Subagent không gọi được subagent khác, nên CHỈ bạn được giao việc cho các agent. Mỗi agent chỉ ghi các file nó sở hữu (bảng trong CLAUDE.md). Dùng công cụ danh sách việc để theo dõi từng wave.

## Wave 0: chuẩn hóa yêu cầu
1. Nếu `data/inputs.md` không tồn tại hoặc chưa có dự án nào được điền, dừng lại và nhờ tôi điền, không đoán.
2. Gọi `brief-architect` (một mình) với yêu cầu ở trên. Nó ghi `data/brief.md`.
3. Đọc `data/brief.md`. Nếu mục "Câu hỏi bắt buộc" có nội dung, hỏi tôi (tối đa một lượt, gom câu hỏi), rồi gọi lại `brief-architect` kèm câu trả lời.
4. Dòng "Agent cần chạy" trong brief quyết định các wave sau. Bỏ qua agent không có trong danh sách (ví dụ yêu cầu "audit" chỉ chạy qa-auditor).

## Wave 1: chạy SONG SONG (gửi trong MỘT tin nhắn, nhiều lệnh gọi agent)
- `project-miner`
- `ui-designer`
Prompt giao cho mỗi agent = nguyên văn mục tương ứng trong `data/brief.md` + dòng "Đọc CLAUDE.md trước". Chờ cả hai xong.

## Wave 2: chạy SONG SONG (một tin nhắn)
- `content-writer` (cần `data/evidence.md`)
- `frontend-builder` giai đoạn 1 "dựng khung": viết `templates/*`, `scripts/build.mjs`, `scripts/check.mjs` theo `data/design.md`, CHƯA build.
Chờ cả hai xong.

## Wave 3
- `frontend-builder` giai đoạn 2 "build": chạy `node scripts/build.mjs` và `node scripts/check.mjs`, sửa đến khi check đạt.

## Wave 4: kiểm định
- `qa-auditor` ghi `data/qa-report.md`.
- Nếu FAIL: nhóm lỗi theo agent sở hữu file, giao lại cho đúng agent (các agent không cùng file thì chạy song song), rồi chạy lại `qa-auditor`. Tối đa 2 vòng. Hết 2 vòng vẫn FAIL thì dừng và báo tôi chi tiết.

## Wave 5: cổng duyệt
1. Tóm tắt cho tôi: kết quả QA, những gì chưa kiểm chứng được (ví dụ chưa xem bằng trình duyệt), danh sách dự án sẽ được đăng công khai.
2. Hỏi tôi có đồng ý đăng hay không. Chưa được đồng ý thì dừng ở đây.
3. Được đồng ý: gọi `publisher` để soạn `README.md` và `data/publish-steps.md`.
4. Với từng lệnh git hoặc GitHub trong `data/publish-steps.md` (init, commit, push, tạo repo, bật Pages), hỏi riêng và chỉ chạy lệnh tôi đã đồng ý.

## Báo cáo cuối (ngắn)
- Kết quả: Đã hoàn thành / Hoàn thành một phần / Chưa hoàn thành
- Tạo hoặc đổi: các file chính
- Kiểm chứng: lệnh đã chạy và kết quả thật
- Còn lại: vấn đề, giới hạn, thông tin cần tôi cung cấp
- Tiếp theo: bước hợp lý tiếp theo
