# VietDine (ITSS JP) 🍜

VietDine là một nền tảng web ứng dụng giúp kết nối thực khách với các nhà hàng ẩm thực Việt Nam chuẩn vị (đặc biệt nhắm tới thị trường Nhật Bản). Dự án cung cấp trải nghiệm toàn diện từ việc tìm kiếm nhà hàng, xem đánh giá, đặt bàn theo thời gian thực cho đến việc chủ quán quản lý nhà hàng thông qua Dashboard chuyên dụng.

## 🌟 Tính năng nổi bật (Features)

Hệ thống được chia làm 5 nhóm tính năng cốt lõi:
1. **Xác thực & Quản lý người dùng (Auth & User Management)**
   - Hỗ trợ đăng nhập thông thường & Google OAuth.
   - Phân quyền rõ ràng: Khách hàng (Customer) & Chủ quán (Owner).
   - Quản lý hồ sơ cá nhân, lịch sử hoạt động.

2. **Khám phá & Tìm kiếm (Discovery & Search)**
   - Tìm kiếm nhà hàng với bộ lọc nâng cao.
   - Tích hợp Bản đồ (Map) hiển thị vị trí trực quan.
   - Hỗ trợ đa ngôn ngữ (Tiếng Việt, Tiếng Nhật, Tiếng Anh).

3. **Chi tiết & Tương tác nhà hàng (Engagement)**
   - Xem chi tiết menu, thông tin giờ mở cửa, tiện ích nhà hàng.
   - Đánh giá (Review) và Lưu nhà hàng yêu thích (Bookmark/My List).

4. **Quản lý Đặt bàn & Giao tiếp (Booking & Real-time Chat)**
   - Khách hàng có thể đặt lịch trước.
   - Chat realtime giữa khách hàng và chủ quán qua Socket.IO.

5. **Hệ thống Quản lý Chủ quán (Owner CMS Dashboard)**
   - Thêm/Sửa/Xóa Menu món ăn, hình ảnh.
   - Quản lý Chương trình khuyến mãi.
   - Chấp nhận/Từ chối đơn đặt bàn.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng theo kiến trúc **Monorepo** với sự tách biệt rõ ràng giữa Frontend và Backend.

### Frontend
- **Framework:** Next.js (App Router), React
- **Styling:** Tailwind CSS, Vanilla CSS
- **State Management:** Context API
- **Real-time:** Socket.IO Client
- **Bản đồ:** Google Maps / Mapbox API

### Backend
- **Framework:** Node.js, Express.js
- **Database ORM:** Prisma ORM
- **Database:** PostgreSQL
- **Real-time:** Socket.IO
- **Bảo mật:** JWT (JSON Web Tokens), bcrypt
- **Validation:** Zod / Custom Middleware

---

## 📂 Cấu trúc thư mục (Folder Structure)

```text
vietdine-itssjp1/
├── backend/                  # Mã nguồn Backend (Express.js)
│   ├── prisma/               # Schema Database và file Seed
│   ├── src/
│   │   ├── controllers/      # Xử lý logic API
│   │   ├── middleware/       # JWT Auth, Validation
│   │   ├── routes/           # Định tuyến API
│   │   ├── services/         # Tương tác với Database
│   │   ├── lib/              # Socket.io, cấu hình chung
│   │   └── index.ts          # Entry point Backend
│   ├── package.json
│   └── .env                  # Biến môi trường Backend
│
├── frontend/                 # Mã nguồn Frontend (Next.js)
│   ├── src/
│   │   ├── actions/          # Data fetching actions
│   │   ├── app/              # Next.js App Router (Pages & Layouts)
│   │   ├── components/       # Reusable UI Components
│   │   ├── context/          # React Context (Auth, Language, Socket)
│   │   └── lib/              # Utils, Types, i18n
│   ├── public/               # Static assets (Images, Icons)
│   ├── package.json
│   └── .env                  # Biến môi trường Frontend
│
└── README.md
```

---

## 🚀 Hướng dẫn Cài đặt (Installation Guide)

### Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/) (Khuyến nghị bản v18 trở lên)
- [PostgreSQL](https://www.postgresql.org/) (Cài đặt cục bộ hoặc dùng Docker/Cloud)

### 1. Cài đặt Backend
Di chuyển vào thư mục `backend/` và cài đặt các thư viện:
```bash
cd backend
npm install
```

Tạo file `.env` ở thư mục `backend/` với nội dung tham khảo:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vietdine"
SESSION_SECRET="your_secret_key"
FRONTEND_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

Khởi tạo Database và nạp dữ liệu mẫu (Seeding):
```bash
npx prisma db push
npm run seed
```

Chạy Server Backend (Mặc định ở cổng `3001`):
```bash
npm run dev
```

### 2. Cài đặt Frontend
Di chuyển vào thư mục `frontend/` và cài đặt các thư viện:
```bash
cd frontend
npm install
```

Tạo file `.env` ở thư mục `frontend/` với nội dung:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Chạy Server Frontend (Mặc định ở cổng `3000`):
```bash
npm run dev
```

Bây giờ bạn có thể truy cập vào `http://localhost:3000` để trải nghiệm hệ thống!

---

## 🌐 Triển khai lên Production (Deployment)

Vì hệ thống sử dụng Websocket, bạn cần chia tách nền tảng deploy:
1. **Frontend**: Deploy lên **Vercel**. Vercel hỗ trợ Next.js cực tốt. Đừng quên thiết lập biến môi trường `NEXT_PUBLIC_API_URL` là link api thật.
2. **Backend**: Deploy lên **Render, Railway hoặc Fly.io** (Các nền tảng này hỗ trợ Persistent connection để Socket.IO hoạt động). Cần thiết lập `FRONTEND_URL` trỏ về link Vercel để tránh lỗi CORS.
3. **Database**: Khuyến nghị dùng **Supabase, Neon** hoặc **Render PostgreSQL**.

---

## ✅ Development Checklist

Đây là danh sách kiểm tra (Checklist) tiến độ của dự án, bạn có thể đánh dấu `[x]` khi hoàn thành để dễ dàng theo dõi.

### Phase 1: Authentication & User
- [x] Thiết lập Database Schema cho User & Roles.
- [x] Đăng nhập / Đăng ký bằng JWT.
- [x] Tích hợp Google OAuth.
- [x] Trang thông tin cá nhân & Lịch sử hoạt động.

### Phase 2: Core UX & Khám phá
- [x] Trang chủ (Landing Page) với giao diện hiện đại.
- [x] Hỗ trợ Đa ngôn ngữ (i18n: EN, VN, JP).
- [x] Hiển thị danh sách nhà hàng với Grid layout.
- [ ] Tính năng tìm kiếm theo bộ lọc & Bản đồ hiển thị (Map).

### Phase 3: Chi tiết nhà hàng & Tương tác
- [x] Trang chi tiết nhà hàng (Restaurant Details).
- [x] Lưu nhà hàng (Bookmark) & Hiển thị trên màn hình "Đã lưu".
- [x] Chức năng đánh giá (Review) và tính sao trung bình.

### Phase 4: Quản trị Chủ quán (Owner CMS)
- [x] Thiết kế layout Dashboard riêng cho Chủ quán.
- [x] Tính năng quản lý Menu món ăn (Thêm/Sửa/Xóa).
- [x] Tính năng quản lý Chương trình khuyến mãi.
- [x] Thống kê cơ bản tại màn hình chính Dashboard.

### Phase 5: Đặt bàn & Giao tiếp Realtime
- [x] Thiết kế UI Form đặt bàn (Booking Modal).
- [x] Luồng xử lý đơn đặt bàn (Chờ duyệt -> Đã xác nhận / Bị hủy).
- [x] Tích hợp Socket.IO ở Backend.
- [x] Giao diện Chat realtime tại màn hình quản lý (Owner) và màn hình khách hàng.
- [x] Logic hiển thị thông báo tin nhắn chưa đọc.

### Phase 6: Hoàn thiện & Triển khai
- [x] Clean up code & Sửa lỗi hiển thị UI (Responsive).
- [x] Tách biến môi trường `localhost` ra chuẩn bị cho Production.
- [ ] Deploy Database lên Cloud.
- [ ] Deploy Backend lên Render/Railway.
- [ ] Deploy Frontend lên Vercel.
- [ ] QA test thực tế luồng hệ thống trên Production.
