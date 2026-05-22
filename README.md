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

## 🚀 Hướng dẫn cài đặt nhanh cho khách hàng

Cách khuyến nghị là chạy bằng **Docker Compose**. Khách hàng không cần cài Node.js hoặc PostgreSQL trực tiếp trên máy; Docker sẽ tự chạy Frontend, Backend và Database.

### 1. Yêu cầu trước khi chạy

Cài đặt các công cụ sau:
- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Đảm bảo Docker Desktop đang mở trước khi chạy lệnh. Các cổng mặc định cần trống:
- Frontend: `3000`
- Backend: `3001`
- PostgreSQL: `5432`

### 2. Clone source code

```bash
git clone <repository-url>
cd vietdine-itssjp1
```

Thay `<repository-url>` bằng link GitHub/GitLab của project.

### 3. Tạo file cấu hình môi trường

Trên Windows PowerShell:

```powershell
copy .env.example .env
```

Trên macOS/Linux/Git Bash:

```bash
cp .env.example .env
```

File `.env.example` đã có cấu hình mặc định để chạy thử local:

```env
POSTGRES_DB=vietdine
POSTGRES_USER=vietdine
POSTGRES_PASSWORD=vietdine_password
POSTGRES_PORT=5432

FRONTEND_PORT=3000
BACKEND_PORT=3001
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
SERVER_API_URL=http://backend:3001
INTERNAL_API_URL=http://backend:3001

SESSION_SECRET=change_me_for_shared_demo
RUN_SEED=true

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

Nếu chỉ chạy demo và không dùng đăng nhập Google, có thể để trống các biến `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

### 4. Chạy toàn bộ hệ thống

```bash
docker compose up --build
```

Lần đầu chạy có thể mất vài phút vì Docker cần tải image, cài thư viện và build project.

Khi chạy thành công, truy cập:

```text
http://localhost:3000
```

Docker Compose sẽ tự chạy:
- `db`: PostgreSQL 16
- `backend`: Express API tại `http://localhost:3001`
- `frontend`: Next.js tại `http://localhost:3000`

Backend sẽ tự chạy `prisma db push` để tạo schema database. Mặc định `RUN_SEED=true`, nên dữ liệu demo sẽ được nạp tự động.

### 5. Dừng hệ thống

Nhấn `Ctrl + C` ở terminal đang chạy Docker, sau đó chạy:

```bash
docker compose down
```

### 6. Chạy lại sau này

```bash
docker compose up
```

Nếu có thay đổi source code hoặc muốn build lại:

```bash
docker compose up --build
```

### 7. Xóa sạch database và seed lại từ đầu

Lệnh này sẽ xóa toàn bộ dữ liệu PostgreSQL đang nằm trong Docker volume:

```bash
docker compose down -v
docker compose up --build
```

### 8. Xem log khi cần kiểm tra lỗi

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Lỗi thường gặp

Nếu `http://localhost:3000` không mở được, hãy kiểm tra Docker Desktop đang chạy và terminal chưa báo lỗi.

Nếu báo trùng port `3000`, `3001` hoặc `5432`, hãy tắt ứng dụng đang dùng port đó hoặc đổi `FRONTEND_PORT`, `BACKEND_PORT`, `POSTGRES_PORT` trong file `.env`.

Nếu muốn làm mới dữ liệu demo, chạy lại bằng lệnh:

```bash
docker compose down -v
docker compose up --build
```

---

## 🧑‍💻 Chạy local cho developer

Cách này dùng khi cần phát triển code trực tiếp, không phải cách khuyến nghị cho khách hàng chạy demo.

### Yêu cầu hệ thống

- [Node.js](https://nodejs.org/) bản 20 trở lên
- [PostgreSQL](https://www.postgresql.org/) cài local hoặc dùng database cloud

### 1. Cài dependency

Chạy ở thư mục gốc project:

```bash
npm install
```

### 2. Cấu hình Backend

Tạo file `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vietdine"
SESSION_SECRET="your_secret_key"
FRONTEND_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Khởi tạo database và nạp dữ liệu mẫu:

```bash
cd backend
npx prisma db push
npm run seed
npm run dev
```

Backend mặc định chạy tại `http://localhost:3001`.

### 3. Cấu hình Frontend

Mở terminal khác, tạo file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Chạy frontend:

```bash
cd frontend
npm run dev
```

Frontend mặc định chạy tại `http://localhost:3000`.

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
