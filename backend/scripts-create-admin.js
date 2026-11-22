require('dotenv').config();
const monk = require('monk');
const bcrypt = require('bcrypt');

function arg(name) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((item) => item.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : '';
}
(async () => {
  const email = String(arg('email')).trim().toLowerCase();
  const password = String(arg('password'));
  if (!email || !password || password.length < 12) {
    console.error("Usage: npm run create-admin -- --email admin@example.com --password 'AtLeast12Characters'");
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) console.warn('MONGODB_URI not set; using local default.');
  const db = monk(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gospelhub');
  try {
    const admins = db.get('admins');
    const existing = await admins.findOne({ email });
    const passwordHash = await bcrypt.hash(password, 12);
    if (existing) {
      await admins.update({ _id: existing._id }, { $set: { passwordHash } });
      console.log(`Updated admin password for ${email}`);
    } else {
      await admins.insert({ email, passwordHash, role: 'admin', createdAt: new Date() });
      console.log(`Created admin account: ${email}`);
    }
  } catch (err) { console.error(err.message); process.exitCode = 1; }
  finally { await db.close(); }
})();
