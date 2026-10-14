# Tiketbox FE (client)

Giao diện đặt vé cho khách hàng — Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + TanStack Query.

## Chạy local

```bash
cp .env.example .env.local   # API_URL trỏ tới api-gateway
npm install
npm run dev                  # http://localhost:3001
```

Backend (`../tiketbox`) cần chạy trước: `docker compose up -d && npm run start:all` (gateway ở cổng 3000, nên FE dùng cổng 3001).

## Cách gọi API

- Trình duyệt gọi `/api/*` cùng origin → Next rewrite sang `API_URL` (xem `next.config.ts`), nên không cần cấu hình CORS.
- Trang công khai (`/`, `/events/[id]`) là server component, fetch thẳng tới gateway (`src/lib/server-api.ts`).
- Trang cần đăng nhập là client component, dùng React Query (`src/lib/queries.ts`) + `api()` tự gắn `Authorization: Bearer`.
- JWT lưu trong `localStorage`; gặp 401 thì tự đăng xuất.

## Trang

| Route | Mô tả |
|---|---|
| `/` | Danh sách sự kiện đang mở bán (`PUBLISHED`) |
| `/events/[id]` | Chi tiết sự kiện + chọn số lượng, đặt vé |
| `/login`, `/register` | Đăng nhập / đăng ký (hỗ trợ `?next=` để quay lại trang trước) |
| `/bookings` | Danh sách đơn đặt vé |
| `/bookings/[id]` | Chi tiết đơn, chọn phương thức & thanh toán, huỷ đơn |
| `/tickets` | Vé của tôi kèm mã QR (dùng khi check-in) |
| `/profile` | Đổi họ tên / mật khẩu |
| `/admin/events` | (ADMIN) Danh sách tất cả sự kiện, mở bán / ngừng bán / xoá |
| `/admin/events/new` | (ADMIN) Tạo sự kiện |
| `/admin/events/[id]` | (ADMIN) Sửa sự kiện |

Tài khoản ADMIN: đăng ký bình thường rồi đổi `role` trong `user_db.users` (xem README backend), sau đó đăng nhập lại.

## Cấu trúc

```
src/
  app/            # routes (App Router)
  components/     # Header, BookingForm, AuthForm, RequireAuth, ...
  lib/
    api.ts          # fetch wrapper + token store (client)
    server-api.ts   # fetch cho server components
    auth-context.tsx
    queries.ts      # React Query hooks
    types.ts        # kiểu dữ liệu khớp với API gateway
```

## Ghi chú / TODO

- `GET /events` của backend đang trả cả sự kiện `DRAFT`; FE tự lọc `PUBLISHED`. Nên lọc ở backend.
- Token trong `localStorage` dễ bị XSS đọc được; khi lên production nên chuyển sang httpOnly cookie (BFF qua Next route handlers) + refresh token.
- Ảnh sự kiện: backend chưa có field ảnh, FE đang dùng gradient thay thế.
