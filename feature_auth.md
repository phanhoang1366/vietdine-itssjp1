# 1. Feature Xác thực & Quản lý người dùng (Auth & User Management)

Feature này tập trung vào luồng đăng nhập, bảo mật và thông tin cá nhân.

## Các màn hình bao gồm:
- (6) Màn hình Đăng nhập/Đăng ký cho khách
- (8) Màn hình đăng nhập/đăng ký cho chủ quán
- (10) Màn hình thay đổi mật khẩu
- (7) Màn hình Hồ sơ cá nhân

## Góc nhìn kỹ thuật:
- **Backend:** Xử lý chung các logic về phân quyền (Role ID 1, 2, 3), tạo và xác thực token (JWT), mã hóa mật khẩu, và CRUD thông tin user.
- **Frontend:** Tái sử dụng được rất nhiều UI component dùng chung như Form, Input validation, Button, và logic lưu trữ trạng thái đăng nhập (Redux/Context).
