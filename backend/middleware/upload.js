const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const maxMb = Number(process.env.MAX_FILE_SIZE_MB || 500);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, file.fieldname === 'cover' ? path.join(__dirname, '..', 'uploads', 'covers') : path.join(__dirname, '..', 'uploads', 'media')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
  }
});
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = file.fieldname === 'cover'
    ? ['.jpg', '.jpeg', '.png', '.webp']
    : ['.mp3', '.mp4', '.m4a', '.wav', '.ogg', '.webm'];
  if (!allowed.includes(ext)) return cb(Object.assign(new Error(`Unsupported file type: ${ext || 'unknown'}`), { status: 400 }));
  cb(null, true);
}
const upload = multer({ storage, fileFilter, limits: { fileSize: maxMb * 1024 * 1024, files: 2 } });
module.exports = upload;
