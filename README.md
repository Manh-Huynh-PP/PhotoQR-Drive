# 📸 React Live Photobooth Viewer

*[English instructions below]*

Một ứng dụng web thời gian thực (real-time) được xây dựng bằng React, có khả năng kết nối và theo dõi một thư mục Google Drive cụ thể. Khi có ảnh mới được tải lên thư mục này, ứng dụng sẽ tự động tải về và hiển thị ngay lập tức. Rất phù hợp cho các sự kiện trực tiếp, tiệc cưới, nơi nhiếp ảnh gia sử dụng máy ảnh kết nối dây hoặc thẻ SD Wi-Fi để đẩy ảnh thẳng lên Google Drive.

![Screenshot placeholders]

## ✨ Tính năng chính

- **Chế độ Giám sát Trực tiếp (Live Monitor)**: Liên tục quét Google Drive (thông qua Service Account) và tự động cập nhật giao diện khi phát hiện ảnh mới.
- **Chế độ Thư viện (Gallery)**: Duyệt lại toàn bộ ảnh đã chụp trong sự kiện.
- **Hiệu ứng mượt mà**: Tích hợp Framer Motion mang lại cảm giác cao cấp.
- **Thanh điều hướng thông minh (Sidebar)**: Giao diện sidebar tối giản chỉ dùng icon.
- **Bảo mật hàng đầu**: Bảo mật hoàn toàn các thiết lập nhạy cảm thông qua biến môi trường (`.env`), cấu hình HTTP headers an toàn (Helmet) và kiểm tra định dạng dữ liệu đầu vào.

## 🚀 Yêu cầu hệ thống

1.  **Node.js**: Đảm bảo máy đã cài đặt Node.js (phiên bản 18 trở lên).
2.  **Google Cloud Project**: Bạn cần tạo một project trên Google Cloud để lấy Service Account và kết nối Google Drive API.

## ⚙️ Hướng dẫn cài đặt

### 1. Tải bộ mã nguồn (Clone)

```bash
git clone https://github.com/Manh-Huynh-PP/PhotoQR-Drive.git
cd PhotoQR-Drive
```

### 2. Cài đặt các thư viện cần thiết (Dependencies)

```bash
npm install
```

### 3. Cấu hình Google Drive API & Service Account

Để đọc file từ Drive một cách bảo mật mà không cần người dùng phải đăng nhập duyệt web, ứng dụng này sử dụng **Google Service Account**.

1. Vào trang [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một project mới (hoặc chọn project có sẵn).
3. Bật (Enable) **Google Drive API** cho project này.
4. Điều hướng tới mục **IAM & Admin > Service Accounts**.
5. Nhấn **Create Service Account**, đặt tên và hoàn tất quá trình khởi tạo.
6. Mở Service Account vừa tạo, chuyển sang tab **Keys**, nhấn **Add Key > Create new key**, và chọn định dạng **JSON**.
7. Tải file `.json` đó về và đặt vào thư mục gốc của project này (Cài đặt `.gitignore` đã được thiết lập sẵn để tự động bỏ qua file này khi đưa lên Git).
8. **BƯỚC QUAN TRỌNG NHẤT:** Copy địa chỉ `client_email` có trong file JSON. Vào thư mục Google Drive chứa ảnh gốc của bạn, bấm "Share" (Chia sẻ), dán email này vào và cấp quyền "Viewer" (Người xem).

### 4. Thiết lập biến môi trường (Environment Variables)

Tạo một file tên là `.env` trong thư mục gốc (bạn có thể copy nội dung từ file `.env.example`) và điền các thông tin sau:

```env
# Đường dẫn lưu file cấu hình service account định dạng JSON (vừa tải ở bước trên)
GOOGLE_APPLICATION_CREDENTIALS=./your-service-account-key.json

# ID của thư mục Google Drive cần theo dõi ảnh
# Ví dụ: link thư mục là https://drive.google.com/drive/folders/1UsOz5AX2m... -> ID sẽ là 1UsOz5AX2m...
FOLDER_ID=your_folder_id_here

# (Tùy chọn) Khóa kết nối API riêng cho domain của bạn khi cấu hình Production. Để * nếu dùng server dev.
ALLOWED_ORIGIN=*

# (Tùy chọn) Set port
PORT=3001
```

## 🛠️ Chạy ứng dụng

> [!IMPORTANT]
> Dự án này **BẮT BUỘC** phải chạy qua Server Backend (`server.js`) vì Google Drive API yêu cầu khóa bảo mật. Hình ảnh hiển thị trên app thực chất là dữ liệu được Backend tải về từ Drive và feed ngược lại cho app ở local, qua đó bảo vệ hoàn toàn Service Account Key của bạn. Không nên gọi trực tiếp Google Drive API từ Frontend (React/Vite).

Dự án này cần chạy đồng thời cả Server Backend và Frontend Vite dev server (đạt hiệu năng cao nhất trên localhost).

**Bật Backend Server:**
```bash
npm run server
```
*(Mặc định chạy ở cổng 3001)*

**Bật Frontend Console (Giao diện React):**
```bash
npm run dev
```
*(Mặc định chạy ở cổng 5173)*

> 💡 **Mẹo chạy trên mạng LAN (để iPad/Điện thoại cùng WiFi xem được):**
>
> Sửa file `package.json` mục scripts: `"dev": "vite --host"` hoặc chạy thẳng lệnh:
> ```bash
> npm run dev -- --host
> ```
> Khi khởi chạy, Vite sẽ in ra một địa chỉ Network (VD: `http://192.168.1.100:5173`). Dùng thiết bị khác cùng lớp mạng truy cập vào link này để xem ảnh live!

## 📦 Build bản Production

Để build ứng dụng React cho môi trường production:

```bash
npm run build
```

Sau đó, bạn có thể chạy backend server, nó sẽ tự động host và cung cấp nội dung tĩnh đã được build sẵn tại thư mục `dist`:
```bash
NODE_ENV=production npm run server
```
Truy cập `http://localhost:3001` trên trình duyệt để sử dụng. Tại thời điểm này bạn không cần chạy `npm run dev` nữa.

## 🚀 Đưa lên Hosting (Vercel, Render, Railway, v.v)

Bởi vì ứng dụng có cả Frontend tĩnh và một file Node.js Backend (`server.js`) chạy chung cổng, cách tốt nhất để host là sử dụng các nền tảng hỗ trợ **Web Service (Node.js/Express)** thay vì chỉ host Frontend.

Ví dụ, triển khai trên **Render** hoặc **Railway**:
1. Đăng nhập và tạo một **Web Service** mới, liên kết với repo GitHub này.
2. Nạp cấu hình **Environment Variables** (Sao chép y hệt nội dung file `.env` local của bạn, bao gồm cả chuỗi JSON của key nếu public platform hỗ trợ chứa file json, hoặc copy y hệt `FOLDER_ID`).
3. Build command: `npm install && npm run build`
4. Start command: `npm run server`

Trường hợp nền tảng hosting **không cho phép up file JSON (VD: Vercel serverless)**: 
Cấu trúc app hiện tại chạy trên nền Express server (`server.js`). Nếu bạn dùng Vercel, bạn cần phải cấu hình lại `vercel.json` để Serverless Function đọc `server.js`, đồng thời config đọc Google Credentials qua biến môi trường dạng string Encode Base64 thay vì đọc file JSON thật. Nguyên bản source code này được tối ưu để **chạy Local tại sự kiện** hoặc **Host trên nền tảng support NodeJS liên tục (VPS, Render, Railway, DigitalOcean App, Heroku)**.

## 🔒 Lưu ý bảo mật
- Tuyệt đối **KHÔNG commit** file chứa key `service-account-key.json` hay file `.env` lên GitHub. Trong source code file `.gitignore` đã khai báo chặn 2 định dạng này.
- Nếu bạn vô tình đẩy key lên public repo, hãy lập tức xóa key đó trên tài khoản Google Cloud Console và tạo key mới.

---
*(English Version)*

A modern, real-time fetching React application that monitors a specific Google Drive folder and displays newly uploaded images instantly. Perfect for live events, weddings, or parties where a photographer uses a tethered or Wi-Fi SD card workflow to upload photos to Google Drive.

## ✨ Features

- **Live Monitor Mode**: Constantly polls Google Drive (using a Service Account) and auto-updates the UI when a new image is found.
- **Gallery Mode**: Browse all historical images from the session.
- **Smooth Animations**: Built with Framer Motion for a premium feel.
- **Responsive Sidebar**: Clean, icon-driven sidebar navigation.
- **Security First**: Utilizes strict environment variables, HTTP headers (Helmet), and path validation.

## 🚀 Prerequisites

1.  **Node.js**: Ensure Node.js (v18+) is installed.
2.  **Google Cloud Project**: You need a project to create a Service Account and access the Google Drive API.

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Manh-Huynh-PP/PhotoQR-Drive.git
cd PhotoQR-Drive
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Google Drive API & Service Account

To read files securely without prompting users to log in, this app uses a **Google Service Account**.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Enable the **Google Drive API** for this project.
4. Navigate to **IAM & Admin > Service Accounts**.
5. Click **Create Service Account**, give it a name, and complete the creation.
6. Open the newly created Service Account, go to the **Keys** tab, click **Add Key > Create new key**, and select **JSON**.
7. Download the `.json` file and place it in the root folder of this project (it is ignored by Git automatically).
8. **CRITICAL STEP:** Copy the `client_email` address from the JSON file. Go to your target Google Drive folder, click "Share", and share the folder with this email as a "Viewer".

### 4. Environment Variables

Create a file named `.env` in the root directory (you can copy from `.env.example`) and fill it in:

```env
# Path to your downloaded service account JSON key
GOOGLE_APPLICATION_CREDENTIALS=./your-service-account-key.json

# The ID of the Google Drive folder to monitor
# E.g. https://drive.google.com/drive/folders/1UsOz5AX2m... -> ID is 1UsOz5AX2m...
FOLDER_ID=your_folder_id_here

# (Optional) Restrict API to your domain in production, use * for development
ALLOWED_ORIGIN=*

# (Optional) Port
PORT=3001
```

## 🛠️ Running the Application

> [!IMPORTANT]
> The **Server Backend (`server.js`) is MANDATORY** for this application to work safely. The App UI does not talk directly to Google Drive. The Backend streams the images to the App UI, preventing your Google Service Account Keys from ever being exposed to the users' web browsers.

This project requires both a backend server and a frontend Vite development server running.

**Start the Backend Server:**
```bash
npm run server
```
*(Runs on port 3001 by default)*

**Start the Frontend Console (React UI):**
```bash
npm run dev
```
*(Runs on port 5173 by default)*

> 💡 **Tip: Viewing on an iPad/Phone over local Wi-Fi**
>
> Edit `package.json` scripts: `"dev": "vite --host"` or run:
> ```bash
> npm run dev -- --host
> ```
> Vite will print a `Network` address (e.g., `http://192.168.1.100:5173`). Open this link on any device connected to the same Wi-Fi network to view the photobooth live!

## 📦 Building for Production

To build the React app for production:

```bash
npm run build
```

Then, you can run the backend server which will automatically serve the built static files from the `dist` directory:
```bash
NODE_ENV=production npm run server
```
Visit `http://localhost:3001` in your browser. At this point, you do not need the Vite dev server (`npm run dev`) anymore.

## 🚀 Deployment (Hosting)

Because this app uses an Express backend (`server.js`) to securely load from Google Drive and serve the React build, you must host it on a platform that supports **Node.js Web Services** (not just static site hosting).

Recommended platforms: **Render, Railway, Heroku, DigitalOcean App Platform** or a VPS.

1. Connect your Github Repo.
2. Set Build Command to: `npm install && npm run build`
3. Set Start Command to: `npm run server`
4. Add your **Environment Variables**: Copy everything from your local `.env`. 

*Note: For serverless platforms like **Vercel**, deploying this out of the box will require modifying `vercel.json` to treat `server.js` as an API route, and encoding the Service Account JSON into a single string environment variable, as Vercel doesn't process local file uploads easily. The app is highly optimized to run locally at the event or on continuous Node.js servers.*

## 🔒 Security Notes
- Never commit your `service-account-key.json` or `.env` files to GitHub. The `.gitignore` is pre-configured to exclude these.
- If you accidentally commit a key, delete it immediately from Google Cloud Console and generate a new one.

## 📄 License
MIT
