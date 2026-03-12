import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ────────────────────────────────────────────
// CONFIG — environment variables only
// ────────────────────────────────────────────
const FOLDER_ID = process.env.FOLDER_ID;
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

// Basic check mapping old code JSON credential parsing, though GoogleAuth usually handles it automatically if GOOGLE_APPLICATION_CREDENTIALS is set in env
let auth;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
} else {
  console.error("Missing GOOGLE_APPLICATION_CREDENTIALS in .env");
  process.exit(1);
}

if (!FOLDER_ID) {
  console.error("Missing FOLDER_ID in .env");
  process.exit(1);
}

const drive = google.drive({ version: 'v3', auth });

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Ensure we can load fetched images
}));

// CORS Configuration
app.use(cors({
  origin: ALLOWED_ORIGIN === '*' ? '*' : ALLOWED_ORIGIN.split(',').map(o => o.trim())
}));

// Simple drive ID validation function
const isValidDriveId = (id) => /^[a-zA-Z0-9_-]{10,60}$/.test(id);

// ── API: List images (fetches ALL via pagination) ──
app.get('/api/images', async (req, res) => {
  try {
    let allFiles = [];
    let pageToken = null;

    do {
      const response = await drive.files.list({
        q: `'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
        orderBy: 'createdTime desc',
        fields: 'nextPageToken, files(id,name,webViewLink,createdTime,thumbnailLink)',
        pageSize: 1000,
        pageToken: pageToken || undefined,
      });

      allFiles = allFiles.concat(response.data.files || []);
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    res.json({ files: allFiles });
  } catch (err) {
    console.error('Drive list error:', err);
    res.status(500).json({ error: 'Failed to list images from Drive.' });
  }
});

// ── API: Proxy image binary (for <img src>) ──
app.get('/api/image/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!isValidDriveId(fileId)) {
        return res.status(400).json({ error: 'Invalid file ID format.' });
    }

    // Get metadata first for content type
    const meta = await drive.files.get({
      fileId,
      fields: 'mimeType,name',
    });

    // Stream the file content
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Type', meta.data.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    response.data.pipe(res);
  } catch (err) {
    console.error('Image proxy error:', err);
    res.status(500).json({ error: 'Failed to stream image from Drive.' });
  }
});

// ── API: Download image (with attachment header) ──
app.get('/api/download/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!isValidDriveId(fileId)) {
        return res.status(400).json({ error: 'Invalid file ID format.' });
    }

    const meta = await drive.files.get({
      fileId,
      fields: 'mimeType,name',
    });

    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    const safeName = meta.data.name ? meta.data.name.replace(/[^a-zA-Z0-9._-]/g, '_') : 'download';

    res.setHeader('Content-Type', meta.data.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    response.data.pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Failed to download image from Drive.' });
  }
});

// ── Serve Vite build in production ──
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🎯 Photobooth server running at http://localhost:${PORT}`);
  console.log(`  📂 Monitoring folder: ${FOLDER_ID}`);
  console.log(`  🔒 Credentials: service account (server-side only)\n`);
});
