/* ===== Fahad Portfolio — Frontend JS ===== */
const API = ''; // same origin

/* ===== Apply content.js data to all [data-c] elements ===== */
function applyContent() {
  const C = window.SITE_CONTENT;
  if (!C) { console.warn('content.js load nahi hua'); return; }

  // dot-path se value nikalna: "hero.badge" → C.hero.badge
  function get(path) {
    return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, C);
  }

  document.querySelectorAll('[data-c]').forEach(el => {
    const value = get(el.dataset.c);
    if (value !== undefined) el.textContent = value;
  });

  // dynamic links
  const emailLink = document.getElementById('emailLink');
  if (emailLink && C.email) emailLink.href = 'mailto:' + C.email;
  const waLink = document.getElementById('waLink');
  if (waLink && C.whatsappLink) waLink.href = C.whatsappLink;

  // page title & meta
  if (C.title) document.title = C.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && C.description) meta.content = C.description;

  // typing words
  if (C.hero?.typingWords) words.splice(0, words.length, ...C.hero.typingWords);

  // Testimonials render
  const tg = document.getElementById('testimonialsGrid');
  if (tg && C.testimonials) {
    tg.innerHTML = C.testimonials.map(t => `
      <div class="testimonial reveal">
        <div class="quote-icon"><i class="fa-solid fa-quote-left"></i></div>
        <p>"${t.text}"</p>
        <div class="person">
          <div class="person-avatar">${t.initial}</div>
          <div><strong>${t.name}</strong><small>${t.role}</small></div>
          <div class="stars">${'⭐'.repeat(t.stars)}</div>
        </div>
      </div>`).join('');
    tg.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  // FAQ render
  const fl = document.getElementById('faqList');
  if (fl && C.faq) {
    fl.innerHTML = C.faq.map(item => `
      <div class="faq-item">
        <button class="faq-q">${item.q} <i class="fa-solid fa-plus"></i></button>
        <div class="faq-a"><p>${item.a}</p></div>
      </div>`).join('');
    bindFaq();
  }
}

// FAQ binder (function声明 hoisting ke saath)
function bindFaq() {
  document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => {
    const item = q.parentElement;
    const open = item.classList.toggle('open');
    document.querySelectorAll('.faq-item').forEach(i => { if (i !== item) i.classList.remove('open'); });
    q.querySelector('i').className = open ? 'fa-solid fa-minus' : 'fa-solid fa-plus';
  }));
}

/* --- Loader --- */
window.addEventListener('load', () => {
  // Purana scroll position / #hash restore hone se hero upar chala jata hai — top par laayein
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo(0, 0);
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 120);
  }, 900);
});

/* --- Typing effect --- */
const words = ['Creative Developer', 'UI Designer', 'Problem Solver', 'Web Wizard'];
const typingEl = document.getElementById('typing');
let wi = 0, ci = 0, deleting = false;
(function type() {
  const w = words[wi];
  typingEl.textContent = w.slice(0, ci);
  if (!deleting && ci < w.length) { ci++; setTimeout(type, 85); }
  else if (deleting && ci > 0) { ci--; setTimeout(type, 45); }
  else { deleting = !deleting; if (!deleting) wi = (wi + 1) % words.length; setTimeout(type, 1300); }
})();

/* --- Theme --- */
const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeIcon.className = 'fa-solid fa-sun';
}
themeBtn.addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.toggleAttribute('data-theme', !dark);
  themeIcon.className = dark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  localStorage.setItem('theme', dark ? 'light' : 'dark');
});

/* --- Mobile menu --- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.innerHTML = `<i class="fa-solid fa-${open ? 'xmark' : 'bars'}"></i>`;
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

/* --- Navbar scroll --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 30));

/* --- Cursor glow --- */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

/* --- Reveal on scroll --- */
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('active');
    // animate skill bars & stats
    entry.target.querySelectorAll?.('.bar span').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    obs.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
// content.js se render kiye gaye testimonials bhi observe karein
document.querySelectorAll('#testimonialsGrid .reveal').forEach(el => obs.observe(el));

/* ===== PROJECTS DATA (full content + demo type) ===== */
const PROJECTS = [
  {
    id: 1, category: 'web', color: 'p1', icon: 'fa-shopping-cart', num: '01',
    title: 'E-Commerce Store', tags: ['HTML', 'CSS', 'JS', 'LocalStorage'],
    short: 'Responsive storefront with cart, filtering and smooth checkout flow.',
    desc: 'Ek complete online store jahan user products browse kar sakte hain, category filter kar sakte hain, cart me item daal sakte hain aur checkout flow dekh sakte hain. Cart localStorage me persist hota hai taaki page refresh ke baad bhi samaan na jaye.',
    features: ['Product grid with category filters', 'Add-to-cart with quantity controls', 'Cart persisted in localStorage', 'Responsive mobile-first layout', 'Smooth checkout UI'],
    challenge: 'Sabse badi challenge thi cart state ko refresh ke baad bhi maintain karna — localStorage se ye solve kiya.',
    outcome: 'Store 3 second me load hota hai aur mobile par bhi utna hi smooth hai.',
    demo: 'shop'
  },
  {
    id: 2, category: 'ui', color: 'p2', icon: 'fa-chart-line', num: '02',
    title: 'Analytics Dashboard', tags: ['React', 'CSS', 'Charts'],
    short: 'Modern dashboard with charts, dark mode and clean data visualisation.',
    desc: 'Ek data-heavy admin dashboard jisme revenue charts, traffic graph, stat cards aur recent activity table hai. Dark mode toggle aur sidebar navigation ke saath poora premium feel.',
    features: ['Animated revenue & traffic charts', 'Dark/Light mode toggle', 'Stat cards with growth indicators', 'Responsive sidebar navigation', 'Recent activity feed'],
    challenge: 'Charts ko mobile par readable banana — alag breakpoints aur compact variants banaye.',
    outcome: 'Client ne is UI ko apne internal tool me adopt kiya.',
    demo: 'dashboard'
  },
  {
    id: 3, category: 'web', color: 'p3', icon: 'fa-cloud-sun', num: '03',
    title: 'Weather App', tags: ['JS', 'API', 'Geolocation'],
    short: 'Real-time forecasts with geolocation and dynamic weather visuals.',
    desc: 'OpenWeather API se real-time mausam dikhane wali app — location detection, 5-day forecast aur mausam ke hisaab se badalte hue gradient visuals.',
    features: ['Current location via geolocation', '5-day forecast cards', 'Dynamic weather-based backgrounds', 'Search by city name', 'Loading & error states'],
    challenge: 'API rate limits aur failed requests ko gracefully handle karna — fallback UI banaya.',
    outcome: 'Ek simple lekin visually rich app jo har device par chal ti hai.',
    demo: 'weather'
  },
  {
    id: 4, category: 'api', color: 'p4', icon: 'fa-server', num: '04',
    title: 'Portfolio Backend', tags: ['Node', 'Express', 'Supabase'],
    short: "This site's own API — messages stored in Supabase with secure admin panel.",
    desc: 'Ye website ka apna backend hai! Express server, Supabase Postgres me messages, Supabase Auth se protected admin panel, rate limiting aur input validation ke saath.',
    features: ['REST API with Express', 'Supabase Postgres persistence', 'Supabase Auth (JWT) admin login', 'Rate limiting & XSS protection', 'Live visitor & message stats'],
    challenge: 'Anon key se INSERT karte time RLS .select() ko block kar raha tha — insert-alone approach se solve kiya.',
    outcome: 'Poora system cloud pe hai — kahi se bhi messages dekh sakte ho.',
    demo: 'backend'
  },
  {
    id: 5, category: 'ui', color: 'p5', icon: 'fa-mobile-screen', num: '05',
    title: 'Fitness Tracker UI', tags: ['UI/UX', 'Mobile', 'Figma'],
    short: 'Clean mobile-first interface for tracking workouts and progress.',
    desc: 'Mobile-first fitness app ka design — daily workouts, progress rings, streak counter aur weekly summary. Figma me design kiya aur live preview banayi.',
    features: ['Daily workout cards', 'Animated progress rings', 'Streak & streak-flame counter', 'Weekly summary graph', 'Thumb-friendly mobile navigation'],
    challenge: 'Ek hi screen me zyada data dikhana bina clutter kiye — hierarchy aur spacing se solve.',
    outcome: 'Design client ko pasand aaya aur uske app ka base ban gaya.',
    demo: 'fitness'
  },
  {
    id: 6, category: 'api', color: 'p6', icon: 'fa-key', num: '06',
    title: 'Auth System', tags: ['Supabase', 'JWT', 'Security'],
    short: 'Secure login/signup with hashed passwords and protected routes.',
    desc: 'Supabase Auth par based complete authentication flow — email/password login, protected routes, session restore aur secure sign-out.',
    features: ['Email/password authentication', 'JWT-based protected APIs', 'Session persistence', 'Password reset flow', 'Server-side token verification'],
    challenge: 'Browser aur server dono jagah token verify karna — shared client + header approach se handled.',
    outcome: 'Production-ready auth jo kisi bhi app me plug kiya ja sakta hai.',
    demo: 'auth'
  }
];

/* --- Render project cards --- */
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = PROJECTS.map(p => `
    <article class="project-card reveal" data-category="${p.category}">
      <div class="project-img ${p.color}">
        <i class="fa-solid ${p.icon}"></i>
        <span class="project-num">${p.num}</span>
        <button class="play-btn" onclick="openModal(${p.id})" aria-label="Watch demo of ${p.title}">
          <i class="fa-solid fa-play"></i><span>Watch Demo</span>
        </button>
      </div>
      <div class="project-body">
        <div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <h3>${p.title}</h3>
        <p>${p.short}</p>
        <div class="project-actions">
          <button class="project-link" onclick="openModal(${p.id})"><i class="fa-solid fa-circle-info"></i> Details & Demo</button>
          ${p.link ? `<a class="project-link" href="${p.link}">${p.linkText} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
        </div>
      </div>
    </article>`).join('');
  grid.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
renderProjects();

/* --- Project filters (rebind after render) --- */
function bindFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    };
  });
}
bindFilters();

/* ===== MODAL + ANIMATED DEMO ===== */
function openModal(id) {
  const p = PROJECTS.find(x => x.id === id);
  const box = document.getElementById('modalContent');
  box.innerHTML = `
    <div class="modal-head">
      <div class="modal-title-wrap">
        <span class="modal-num">${p.num}</span>
        <div><h2>${p.title}</h2><div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div></div>
      </div>
    </div>
    <div class="demo-window">
      <div class="demo-bar"><span></span><span></span><span></span><em>${p.title.toLowerCase().replace(/\s+/g,'-')}.demo</em></div>
      <div class="demo-stage" id="demoStage"></div>
      <div class="demo-controls">
        <button onclick="toggleDemo()" id="demoToggle"><i class="fa-solid fa-pause"></i> Pause</button>
        <span class="demo-label">● LIVE PREVIEW</span>
        <span class="demo-hint">Har 2 second me animation badalta hai</span>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-section"><h3><i class="fa-solid fa-info-circle"></i> Is project ke baare me</h3><p>${p.desc}</p></div>
      <div class="modal-two">
        <div class="modal-section"><h3><i class="fa-solid fa-check-circle"></i> Features</h3><ul class="feature-list">${p.features.map(f => `<li>${f}</li>`).join('')}</ul></div>
        <div class="modal-section"><h3><i class="fa-solid fa-bullseye"></i> Challenge & Result</h3><p><strong>Challenge:</strong> ${p.challenge}</p><p><strong>Result:</strong> ${p.outcome}</p></div>
      </div>
      <div class="modal-cta">
        <a href="#contact" onclick="closeModal()" class="btn btn-primary small">Aisa project chahiye? Contact karein <i class="fa-solid fa-arrow-right"></i></a>
        ${p.link ? `<a href="${p.link}" class="btn btn-glass small">${p.linkText} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
      </div>
    </div>`;
  document.getElementById('projectModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  startDemo(p.demo);
}
function closeModal() {
  document.getElementById('projectModal').classList.remove('open');
  document.body.style.overflow = '';
  stopDemo();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* --- Animated demo engine (video jaisa) --- */
let demoTimer = null, demoStep = 0, demoRunning = false, demoKind = '';
function stopDemo() { clearInterval(demoTimer); demoRunning = false; }
function toggleDemo() {
  demoRunning = !demoRunning;
  const b = document.getElementById('demoToggle');
  if (b) b.innerHTML = demoRunning ? '<i class="fa-solid fa-pause"></i> Pause' : '<i class="fa-solid fa-play"></i> Play';
  if (demoRunning) { demoStep++; runDemoFrame(); demoTimer = setInterval(() => { demoStep++; runDemoFrame(); }, 1800); }
  else clearInterval(demoTimer);
}
function startDemo(kind) {
  stopDemo(); demoKind = kind; demoStep = 0;
  const b = document.getElementById('demoToggle');
  if (b) b.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
  demoRunning = true;
  runDemoFrame();
  demoTimer = setInterval(() => { demoStep++; runDemoFrame(); }, 1800);
}
function runDemoFrame() {
  const stage = document.getElementById('demoStage');
  if (!stage) return;
  const s = demoStep;
  let html = '';

  if (demoKind === 'shop') {
    const items = [
      ['🎧','Wireless Headphones','₨ 4,999'], ['👟','Running Shoes','₨ 6,500'],
      ['⌚','Smart Watch','₨ 8,999'], ['🎒','Backpack','₨ 3,200'],
      ['📱','Phone Case','₨ 1,500'], ['🕶️','Sunglasses','₨ 2,400']
    ];
    const active = s % items.length;
    html = `<div class="demo-shop">
      <div class="demo-shop-top"><strong>🛒 Fahad Store</strong><span>Cart (${(s % 3) + 1})</span></div>
      <div class="demo-shop-grid">${items.map((it,i) => `<div class="demo-product ${i===active?'active':''}"><div class="demo-prod-icon">${it[0]}</div><small>${it[1]}</small><b>${it[2]}</b>${i===active?'<em>👀 viewing</em>':''}</div>`).join('')}</div>
      <div class="demo-toast">✅ Added to cart — ${items[active][1]}</div>
    </div>`;
  }
  else if (demoKind === 'dashboard') {
    const bars = [40,65,45,80,55,92,70].map((v,i) => `<div class="dbar" style="height:${(i===s%7)?v+10:v}%"></div>`).join('');
    html = `<div class="demo-dash">
      <div class="demo-dash-side"><i class="fa-solid fa-chart-line"></i><i class="fa-solid fa-users"></i><i class="fa-solid fa-cog"></i></div>
      <div class="demo-dash-main">
        <div class="demo-dash-cards"><div><small>Revenue</small><strong>₨ ${(120+s*13)},450</strong><em>↗ +12%</em></div><div><small>Users</small><strong>${840+s*7}</strong><em>↗ +8%</em></div><div><small>Orders</small><strong>${128+s*3}</strong><em>↗ +5%</em></div></div>
        <div class="demo-chart">${bars}</div>
      </div>
    </div>`;
  }
  else if (demoKind === 'weather') {
    const w = [['☀️','Sunny','32°C','clear'],['⛅','Partly Cloudy','29°C','cloudy'],['🌧️','Rainy','24°C','rain'],['⛈️','Storm','22°C','storm'],['🌤️','Mostly Clear','30°C','clear']][s%5];
    html = `<div class="demo-weather ${w[3]}">
      <div class="demo-w-search">🔍 Search city... <span>Lahore 📍</span></div>
      <div class="demo-w-main"><div class="demo-w-icon">${w[0]}</div><h2>${w[2]}</h2><p>${w[1]} · Feels like ${w[2]}</p></div>
      <div class="demo-w-days">${['Mon','Tue','Wed','Thu','Fri'].map((d,i)=>`<div class="${i===s%5?'active':''}">${d}<b>${25+i}°</b></div>`).join('')}</div>
    </div>`;
  }
  else if (demoKind === 'backend') {
    const logs = [
      'POST /api/contact  →  200 ✅ saved to Supabase',
      'GET  /api/messages →  401 🔒 no token',
      'GET  /api/messages →  200 ✅ admin JWT verified',
      'PATCH /api/messages/4/read → 200 ✅',
      'GET  /api/admin/stats → { messages: 12, unread: 3 }',
      'anon INSERT → 201 ✅ | anon SELECT → blocked 🛡️'
    ];
    html = `<div class="demo-terminal"><div class="demo-term-line">$ node server.js</div><div class="demo-term-line ok">🚀 Server running on :3000</div>${logs.slice(0,(s%logs.length)+1).map(l=>`<div class="demo-term-line ${l.includes('✅')?'ok':l.includes('🔒')||l.includes('blocked')?'warn':''}">${l}</div>`).join('')}<div class="demo-cursor">_</div></div>`;
  }
  else if (demoKind === 'fitness') {
    const pct = 40 + (s%6)*10;
    html = `<div class="demo-fitness">
      <div class="demo-fit-head">🏃 Today's Activity <span>🔥 ${5+s%3} day streak</span></div>
      <div class="demo-rings"><div class="ring r1" style="--p:${pct}%"><span>${pct}%</span></div><div class="ring r2" style="--p:${70-(s%3)*10}%"><span>Cardio</span></div></div>
      <div class="demo-fit-cards"><div>👟 Steps<b>${(6000+s*740).toLocaleString()}</b></div><div>⏱️ Minutes<b>${28+s*4}</b></div><div>🔥 Calories<b>${(320+s*35)}</b></div></div>
    </div>`;
  }
  else if (demoKind === 'auth') {
    const steps = [
      ['1️⃣','User enters email & password','idle'],
      ['2️⃣','Supabase verifies credentials','active'],
      ['3️⃣','JWT access token generated','active'],
      ['4️⃣','Protected API accepts token ✅','done']
    ];
    const cur = s % steps.length;
    html = `<div class="demo-auth">${steps.map((st,i)=>`<div class="auth-step ${i<cur?'done':i===cur?'active':''}"><span>${st[0]}</span><p>${st[1]}</p>${i<=cur?'<i class="fa-solid fa-check"></i>':''}</div>`).join('')}<div class="demo-token">🔑 eyJhbGciOiJIUzI1NiIsInR5cCI6...${'x'.repeat(s%10)}</div></div>`;
  }
  stage.innerHTML = html;
}

/* --- Fetch stats from backend --- */
async function loadStats() {
  try {
    const res = await fetch(`${API}/api/stats`);
    const data = await res.json();
    if (data.success && data.messages !== null) {
      document.getElementById('statMessages').textContent = data.messages;
      document.getElementById('statVisitors').textContent = data.visitors;
    }
  } catch (_) { /* server down — keep defaults */ }
}
loadStats();

/* --- Contact form → POST /api/contact --- */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim()
  };

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  formMsg.className = 'form-msg';
  formMsg.textContent = 'Sending...';

  try {
    const res = await fetch(`${API}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      formMsg.className = 'form-msg success';
      formMsg.textContent = '✅ ' + data.message;
      form.reset();
      loadStats();
    } else {
      formMsg.className = 'form-msg error';
      formMsg.textContent = '❌ ' + (data.error || 'Something went wrong.');
    }
  } catch (err) {
    formMsg.className = 'form-msg error';
    formMsg.textContent = '❌ Server se connect nahi ho paya. Server chal raha hai?';
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

/* --- Year --- */
document.getElementById('year').textContent = new Date().getFullYear();

/* --- Ab content apply karein (sab definitions ready hain) --- */
applyContent();
