# GospelHub

A starter full-stack gospel audio/video library built with Vue 3 + Vite + Tailwind CSS, Express, MongoDB, and Monk.

## Features
- Public responsive library with search and category filters
- Plays MP3 audio and MP4 video in the browser
- Admin login and dashboard
- Admin upload for MP3/MP4 media and optional cover image
- Edit metadata, publish/unpublish, and delete items
- Optional downloads controlled per item
- Files stored locally in `backend/uploads` for development

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- MongoDB running locally, or a MongoDB connection string

## 1. Configure backend
```bash
cd backend
cp .env.example .env
npm install
```
Edit `backend/.env`, especially `MONGODB_URI` and `JWT_SECRET`.
Create your first admin account (one time):
```bash
npm run create-admin -- --email admin@example.com --password 'Use-A-Long-Unique-Password'
```
Start the API:
```bash
npm run dev
```
API runs at http://localhost:5000.

## 2. Configure frontend (second terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

## Notes
- This is a development starter, not a hardened production deployment. Set a strong unique JWT secret, use HTTPS, configure a specific CORS origin, and move uploads to object storage for production.
- Upload limit defaults to 500 MB; change `MAX_FILE_SIZE_MB` in `.env` as needed. Ensure your server has enough disk space.
- Only upload media you own or have permission to distribute. MP4 browser playback depends on its codec; H.264 video with AAC audio is the broadest-supported combination.
- Local uploads are not suitable for ephemeral hosting or multiple backend instances. Use S3-compatible/object storage for production.
# Site
