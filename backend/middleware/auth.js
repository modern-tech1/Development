const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Admin login required' });
  if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET is not configured' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Administrator access required' });
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
}
module.exports = { requireAdmin };
