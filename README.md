# 📸 React Live Photobooth Viewer

*[English instructions below]*

Ứng dụng hiển thị ảnh thời gian thực (real-time) từ một thư mục Google Drive. Thích hợp cho các sự kiện trực tiếp (đám cưới, tiệc tùng), nơi nhiếp ảnh gia đẩy ảnh thẳng từ máy ảnh lên Google Drive bằng Wi-Fi SD Card hoặc dây tether.

✅ **Tự động làm mới khi có ảnh mới** | ✅ **Xem lại thư viện ảnh** | ✅ **Giao diện mượt mà** | ✅ **Bảo mật Service Account**

---

## 🚀 Hướng Dẫn Cài ĐặtNhanh (Tiếng Việt)

### 1. Chuẩn bị
1. Cài đặt **Node.js** (v18+).
2. Tạo một **Google Service Account** trên Google Cloud Console.
3. Tạo một **Key JSON** cho Service Account vừa tạo và tải về thư mục gốc của dự án.
4. Lấy email của Service Account đó và **Share** thư mục Google Drive ảnh của bạn với quyền "Viewer".

### 2. Cài đặt & Cấu hình
```bash
git clone https://github.com/Manh-Huynh-PP/PhotoQR-Drive.git
cd PhotoQR-Drive
npm install
```

Tạo file `.env` (copy từ `.env.example`) và điền thông tin:
```env
GOOGLE_APPLICATION_CREDENTIALS=./ten-file-key-cua-ban.json
FOLDER_ID=id_thu_muc_google_drive_cua_ban
PORT=3001
ALLOWED_ORIGIN=*
```

### 3. Chạy Ứng Dụng (Local)

**⚠️ Bắt buộc:** Chạy backend server trước để kết nối an toàn với Google Drive.
```bash
# Terminal 1: Bật Backend Server
npm run server
```

```bash
# Terminal 2: Bật Frontend React (Tự động mở cổng mạng LAN --host)
npm run dev
```
> **Mẹo:** Vite sẽ cung cấp một đường link **Network** (vd: `http://192.168.x.x:5173`). Dùng đường link này hiển thị trên màn hình Monitor chính để khách xem ảnh theo thời gian thực và có thể quét mã QR (nếu bạn có tích hợp) tải ảnh về điện thoại. Khách cùng mạng Wi-Fi cũng có thể tự mở link trên điện thoại cá nhân.

### 4. Triển khai (Deploy / Hosting)
Web dùng NodeJS làm backend (`server.js`) để bảo mật. Hãy host code trên các nền tảng hỗ trợ **Node.js Web Service** như Render, Railway, DigitalOcean, VPS.
- **Build:** `npm install && npm run build`
- **Start:** `npm run server`
- Đừng quên thêm các biến `.env` trên bảng điều khiển Hosting.

---
---

## 🚀 Quick Setup Guide (English)

A real-time photo viewer that monitors a Google Drive folder and displays newly uploaded images instantly. Ideal for live events.

### 1. Prerequisites
1. Install **Node.js** (v18+).
2. Create a **Google Service Account** on Google Cloud Console.
3. Download the **JSON Key** for your Service Account to the project root.
4. **Share** your target Google Drive folder with the Service Account's email (Viewer role).

### 2. Install & Configure
```bash
git clone https://github.com/Manh-Huynh-PP/PhotoQR-Drive.git
cd PhotoQR-Drive
npm install
```

Create a `.env` file (copy from `.env.example`):
```env
GOOGLE_APPLICATION_CREDENTIALS=./your-service-account-key.json
FOLDER_ID=your_google_drive_folder_id
PORT=3001
ALLOWED_ORIGIN=*
```

### 3. Running Locally

**⚠️ Important:** The backend server must be running to securely read from Google Drive.
```bash
# Terminal 1: Start Backend Server
npm run server
```

```bash
# Terminal 2: Start Frontend UI (Runs with --host for LAN sharing)
npm run dev
```
> **Tip:** Open the `Network` URL (e.g., `http://192.168.x.x:5173`) on an iPad or phone connected to the same Wi-Fi network.

### 4. Deployment
Because of the backend requirement (`server.js`), host this application on a platform supporting **Continuous Node.js Services** (Render, Railway, VPS, Heroku).
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run server`
- Remember to add your `.env` variables in your hosting provider's dashboard.

---

### 🔒 Security Warning
**NEVER** commit your `.env` or `*.json` keys to GitHub. Wait, don't worry, `.gitignore` is already taking care of it!

---

## 👨‍💻 Author

**Manh Huynh**  
- Website: [www.manhhuynh.work](https://www.manhhuynh.work)
- Email: contact@manhhuynh.work
