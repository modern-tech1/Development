const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    const admins = req.app.locals.db.get('admins');
    const admin = await admins.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ sub: String(admin._id), email: admin.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
    res.json({ token, admin: { email: admin.email, role: 'admin' } });
  } catch (err) { next(err); }
});
module.exports = router;
