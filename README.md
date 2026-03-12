# 📸 React Live Photobooth Viewer

A modern, real-time fetching React application that monitors a specific Google Drive folder and displays newly uploaded images instantly. Perfect for live events, weddings, or parties where a photographer uses a tethered or Wi-Fi SD card workflow to upload photos to Google Drive.

![Screenshot placeholders]

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
git clone https://github.com/yourusername/photobooth.git
cd photobooth
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

This project requires both a backend server (to securely query Google Drive without leaking your secret key to the browser) and a frontend Vite development server.

**Start the Backend Server:**
```bash
npm run server
```
*(Runs on port 3001 by default)*

**Start the Frontend Console:**
```bash
npm run dev
```
*(Runs on port 5173 by default)*

## 📦 Building for Production

To build the React app for production:

```bash
npm run build
```

Then, you can run the backend server which will automatically serve the built static files from the `dist` directory:
```bash
NODE_ENV=production npm run server
```
Visit `http://localhost:3001` in your browser.

## 🔒 Security Notes
- Never commit your `service-account-key.json` or `.env` files to GitHub. The `.gitignore` is pre-configured to exclude these.
- If you accidentally commit a key, delete it immediately from Google Cloud Console and generate a new one.

## 📄 License
MIT
