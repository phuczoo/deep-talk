# Chuyện Trò — Deep Talk Card Game 🎴

> **Web App bộ câu hỏi trò chuyện chuyền tay** dành cho 2 người hoặc nhóm bạn trẻ, tối ưu cho trình duyệt di động, không cần đăng nhập, sẵn sàng kết nối và thấu hiểu.

---

## ✨ Tính Năng Nổi Bật (MVP)

1. **4 Bộ Chủ Đề Phong Phú & Gần Gũi**:
   - ❤️ **Người Yêu**: Chuyện đôi lứa, thói quen dễ thương, gắn kết và dự định tương lai.
   - 🍻 **Bạn Bè**: Những kỷ niệm cười ra nước mắt, góc nhìn chân thật, bí mật vui vẻ.
   - 🏡 **Gia Đình**: Ký ức tuổi thơ ấm áp, thấu hiểu khoảng cách thế hệ.
   - 💼 **Đồng Nghiệp**: Phá băng bàn làm việc, tìm hiểu đồng nghiệp ngoài giờ công sở.
2. **2 Chế Độ Chơi Linh Hoạt**:
   - **Tuần Tự (Sequential)**: Tăng dần độ sâu từ *Cấp 1: Khởi Động* $\rightarrow$ *Cấp 2: Gắn Kết* $\rightarrow$ *Cấp 3: Thâm Sâu*. Có màn hình chuyển tiếp cảnh báo nhẹ nhàng trước khi vào Cấp 3.
   - **Ngẫu Nhiên (Random)**: Xáo trộn toàn bộ bộ bài để tạo sự bất ngờ.
3. **Trải Nghiệm Rút Thẻ Di Động Tối Ưu**:
   - Thẻ bài lớn, typography rõ nét, thiết kế để chuyền tay từ người này sang người khác.
   - Nút **Câu tiếp theo**, **Bỏ qua** (đưa câu về cuối hàng đợi), **Ghim câu hỏi**, và **Câu trước** (sử dụng ngăn xếp lịch sử chuẩn xác).
4. **Ghim & Lưu Trữ Cục Bộ (`localStorage`)**:
   - Lưu lại những câu hỏi chạm đến cảm xúc hoặc câu trả lời đáng nhớ.
   - Hỗ trợ sao chép nhanh câu hỏi vào bộ nhớ tạm.
5. **Thêm Câu Hỏi Riêng**:
   - Cho phép người dùng tự tạo câu hỏi của riêng mình và gộp trực tiếp vào bất kỳ bộ chủ đề nào.
6. **Màn Hình Kết Thúc Phiên**:
   - Tổng kết số câu đã trả lời, hiệu ứng pháo giấy ăn mừng, lối tắt xem câu đã ghim và tùy chọn chơi lại/đổi bộ.
7. **Tối Ưu Chia Sẻ (Open Graph)**:
   - Tích hợp sẵn Open Graph metadata hiển thị ảnh thumbnail và tiêu đề đẹp mắt khi gửi link qua Zalo, Messenger, Telegram.

---

## 🛠️ Công Nghệ Sử Dụng

- **Next.js 15 (App Router)** + **React 19** + **TypeScript**
- **Tailwind CSS** (Mobile-first styling, Dark/Light mode)
- **Lucide Icons**
- **Canvas Confetti** (Hiệu ứng hoàn thành ván chơi)
- Không cần backend hay cơ sở dữ liệu (toàn bộ lưu trong client `localStorage`).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Chạy môi trường phát triển (Dev Server)
npm run dev

# 3. Mở trình duyệt tại:
# http://localhost:3000
```

---

## 🌐 Hướng Dẫn Triển Khai Lên Vercel Qua GitHub

1. Tạo repository mới trên GitHub (ví dụ đặt tên `chuyen-tro` hoặc `deep-talk`).
2. Đẩy toàn bộ mã nguồn lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for Chuyen Tro app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/chuyen-tro.git
   git push -u origin main
   ```
3. Truy cập [Vercel](https://vercel.com) $\rightarrow$ Chọn **Add New Project** $\rightarrow$ Chọn repo `chuyen-tro`.
4. Bấm **Deploy** (Vercel tự động nhận diện Next.js và build thành công trong ~1 phút).
