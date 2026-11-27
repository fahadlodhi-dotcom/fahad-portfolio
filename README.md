# Fahad's Portfolio — Full Stack (Supabase)

Premium portfolio with **Express + Supabase (Postgres + Auth)**.

## 🚀 Run karein

```bash
npm start
```

- **Site:** http://localhost:3000
- **Admin:** http://localhost:3000/admin.html
- **Admin login:** `fahadrafi.mkd@gmail.com` / `fahadlodhi93`

(Dev ke liye: `npm run dev`)

## ⚙️ `.env`

```env
PORT=3000
SUPABASE_URL=https://lolxsnquydefoxubpbmi.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
```

## 📁 Structure

```
server.js              Express server + Supabase client + Auth verify
.env                   Config
supabase/
  setup.sql            Tables + RLS (pehla setup)
  fix-rls.sql          RLS fix (agar insert blocked ho)
public/
  index.html           Main site
  admin.html           Admin panel (Supabase Auth login)
  css/style.css        Premium design
  js/script.js         Frontend logic
```

## 🔐 Security

- **RLS policies:** public sirf INSERT kar sakta hai; read/update/delete sirf `authenticated`
- Admin API har request par Supabase JWT verify karti hai
- Rate limiting (10 req/min) + input validation
- Anon key safe (publishable); `service_role` key yahan use nahi hoti

## 🔌 API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | Public | Message Supabase me save |
| GET | `/api/stats` | Public | Placeholder |
| GET | `/api/messages` | Admin JWT | Sab messages |
| PATCH | `/api/messages/:id/read` | Admin JWT | Mark read |
| DELETE | `/api/messages/:id` | Admin JWT | Delete |
| GET | `/api/admin/stats` | Admin JWT | Counts |

## ✅ Test status (26 Nov 2026)

- Contact form → Supabase insert: **PASS**
- Public SELECT blocked by RLS: **PASS**
- No-auth admin API → 401: **PASS**
- Supabase Auth login: **PASS**
- Admin read/delete with JWT: **PASS**
