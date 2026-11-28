/* ============================================================
   WEBSITE CONTENT — YESSE SAB TEXT CONTROL HOTI HAI
   Customer: bas neeche apna data likhein, baaki code chhune ki
   zarurat nahi. Save karein → browser refresh → website update!
   ============================================================ */

const SITE_CONTENT = {
  // 👤 Basic identity
  brand: 'Fahad',
  name: 'Fahad',
  title: 'Creative Developer | Fahad',
  description: 'Fahad — creative developer & designer. Building beautiful digital experiences.',
  email: 'fahadrafi.mkd@gmail.com',
  whatsapp: '+923375477826',
  whatsappLink: 'https://wa.me/923375477826',
  location: 'Pakistan 🇵🇰',
  responseTime: 'Within 24 hours',

  // 🏠 Hero
  hero: {
    badge: 'Available for freelance work',
    greeting: "Hi, I'm",
    craft: 'I craft',
    typingWords: ['Creative Developer', 'UI Designer', 'Problem Solver', 'Web Wizard'],
    desc: 'A creative developer passionate about building digital experiences that feel effortless, look stunning, and actually work.',
    btn1: 'Explore My Work',
    btn2: "Let's Talk",
    scrollHint: 'Scroll to explore'
  },

  // ℹ️ About
  about: {
    eyebrow: 'Get to know me',
    titleBefore: 'About',
    titleHighlight: 'Me',
    sub: 'A bit of story, a lot of curiosity.',
    heading: 'Building with purpose, designing with heart.',
    p1: "I'm Fahad — a self-driven developer who loves the intersection of design and engineering. I believe great products come from caring about the tiny details nobody notices, but everybody feels.",
    p2: 'My journey started with curiosity and a lot of late-night tutorials. Today, I turn ideas into fast, accessible, and beautiful things for the web.',
    cta: "Let's Work Together"
  },

  // 💬 Testimonials — customer apne client ke reviews yahan likhega
  testimonials: [
    {
      text: 'Fahad ne meri website bilkul waise banayi jaise maine socha tha — usse bhi behtar. Har detail ka khayal rakha, delivery time par hui, aur communication bahut clear tha.',
      name: 'Ali Raza', role: 'Founder, StartupPK', initial: 'A', stars: 5
    },
    {
      text: 'Ek freelance developer ke liye ye sab kuch tha — clean code, responsive design, aur jo sabse important hai: samajhne ki ability. Highly recommended!',
      name: 'Sara Ahmed', role: 'Marketing Consultant', initial: 'S', stars: 5
    },
    {
      text: 'Budget kam tha par output premium tha. Fahad ne chhota project bhi utni hi seriousness se liya jaise bada hota. Phir se hire karunga.',
      name: 'Bilal Khan', role: 'Small Business Owner', initial: 'B', stars: 5
    }
  ],

  // ❓ FAQ — customer apne questions/answers yahan badlega
  faq: [
    { q: 'Website banwane me kitna time lagta hai?', a: 'Simple landing page 2–3 din, dynamic website 1–2 hafte, aur full-stack app 3–6 hafte. Details ke baad exact timeline bata deta hoon.' },
    { q: 'Aap remote kaam karte hain?', a: 'Haan, 100% remote. Communication WhatsApp, email ya call — aapki pasand.' },
    { q: 'Payment kaise hota hai?', a: '50% advance, 50% delivery par. Long projects me milestone-based payments bhi ho sakte hain.' },
    { q: 'Delivery ke baad support milta hai?', a: 'Bilkul — 30 din free bug support. Uske baad bhi aap message kar sakte ho, main madad karta hoon.' },
    { q: 'Kya main apna domain/hosting khud provide kar sakta hoon?', a: 'Haan, bilkul. Main deployment me aapki madad karunga chahe aapka hosting ho ya main suggest karoon.' }
  ],

  // 📧 Contact section
  contact: {
    eyebrow: 'Say hello',
    titleBefore: "Let's",
    titleHighlight: 'Connect',
    sub: "Have an idea? I'd love to hear about it.",
    heading: "Let's build something amazing together.",
    desc: 'Whether it is a project, a question, or just a hello — my inbox is open.'
  },

  // 📝 Footer
  footer: {
    madeWith: 'Crafted with care & lots of ☕',
    rights: 'All rights reserved.'
  }
};

// Browser me globally available
window.SITE_CONTENT = SITE_CONTENT;
