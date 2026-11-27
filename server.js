require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Supabase client (anon key + RLS = safe) =====
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Simple rate limiter
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const record = hits.get(ip) || { count: 0, reset: now + 60000 };
  if (now > record.reset) { record.count = 0; record.reset = now + 60000; }
  record.count++;
  hits.set(ip, record);
  if (record.count > 10) {
    return res.status(429).json({ success: false, error: 'Bahut zyada requests. Thodi der baad koshish karein.' });
  }
  next();
}

// Verify Supabase Auth JWT — sirf aapka account
async function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : (req.headers['x-access-token'] || req.query.token);
  if (!token) return res.status(401).json({ success: false, error: 'Login zaroori hai.' });

  // Seed token into an isolated client, then call getUser (validates signature + expiry)
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ success: false, error: 'Session invalid ya expire ho gaya.' });

  // Admin client — apikey + Authorization dono headers zaroori hain
  req.admin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: { headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`
      } },
      auth: { persistSession: false, autoRefreshToken: false }
    }
  );
  req.user = data.user;
  next();
}

// Log visitors (fire & forget)
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    supabase.from('visitors').insert({ ip: req.ip, path: req.path }).then(() => {}).catch(() => {});
  }
  next();
});

// ===== API =====

// POST /api/contact — public insert (RLS allow karta hai)
app.post('/api/contact', rateLimit, async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Saare fields zaroori hain.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Email address valid nahi hai.' });
  }
  if (name.length > 100 || subject.length > 150 || message.length > 2000) {
    return res.status(400).json({ success: false, error: 'Input bahut lamba hai.' });
  }

  // Note: .select() purposefully nahi hai — anon ko SELECT permission nahi
  // (RLS), aur insert ke baad SELECT karne se 401 aata hai. Insert alone 201 deta hai.
  const { error } = await supabase
    .from('messages')
    .insert([{ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }]);

  if (error) {
    console.error('Supabase insert error:', error.message);
    return res.status(500).json({ success: false, error: 'Save nahi ho paya. Database setup check karein.' });
  }
  res.json({ success: true, message: 'Message Supabase me save ho gaya! ✅' });
});

// GET /api/stats — public counts (RLS: anon sirf insert kar sakta hai,
// isliye hum counts client se nahi, server se Returning count se nikalte hain)
app.get('/api/stats', async (req, res) => {
  // Public anon SELECT allowed nahi hai (sirf authenticated).
  // Hum ek chhota trick use karte hain: count sirf logged-in admin ke liye.
  // Public page ke liye 0 bhejte hain (frontend gracefully handle karta hai).
  res.json({ success: true, messages: null, unread: null, visitors: null, note: 'Admin stats /api/admin/stats se' });
});

// ===== Admin-only APIs =====
app.get('/api/messages', requireAdmin, async (req, res) => {
  const { data, error } = await req.admin
    .from('messages').select('*').order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, messages: data, user: req.user.email });
});

app.patch('/api/messages/:id/read', requireAdmin, async (req, res) => {
  const { error } = await req.admin.from('messages').update({ is_read: true }).eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

app.delete('/api/messages/:id', requireAdmin, async (req, res) => {
  const { error } = await req.admin.from('messages').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  const [m, u, v] = await Promise.all([
    req.admin.from('messages').select('id', { count: 'exact', head: true }),
    req.admin.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
    req.admin.from('visitors').select('id', { count: 'exact', head: true })
  ]);
  res.json({ success: true, messages: m.count || 0, unread: u.count || 0, visitors: v.count || 0 });
});

// SPA fallback
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Fahad's Portfolio (Supabase) at http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`🔐 Admin login: Supabase Auth (fahadrafi.mkd@gmail.com)\n`);
});
