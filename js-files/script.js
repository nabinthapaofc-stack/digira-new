// Cursor glow removed for performance
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ── FOOTER YEAR ──
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

// ── NAVBAR (debounced scroll) ──
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

let lastScrollY = 0;
let navTicking = false;

function updateNav() {
  if (navbar) navbar.classList.toggle('scrolled', lastScrollY > 60);
  navTicking = false;
}

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!navTicking) {
    requestAnimationFrame(updateNav);
    navTicking = true;
  }
}, { passive: true });

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ── SCROLL REVEAL (IntersectionObserver — fire once) ──
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // stop observing after reveal
    }
  });
}, observerOptions);

reveals.forEach(el => observer.observe(el));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── HERO PARALLAX ON MOUSE MOVE (only desktop) ──
const hero = document.getElementById('hero');
const heroOrbs = document.querySelectorAll('.hero-orb');

if (hero && !isTouchDevice) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    heroOrbs.forEach((orb, i) => {
      const speed = (i + 1) * 12;
      orb.style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0)`;
    });
  }, { passive: true });
}

// ── PARALLAX ON SCROLL (unified, debounced) ──
let scrollTicking = false;
const breakBg = document.querySelector('.break-bg');
const breakSection = document.getElementById('break');

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      // Break section parallax
      if (breakBg && breakSection) {
        const rect = breakSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const progress = -rect.top / window.innerHeight;
          breakBg.style.transform = `scale(1.15) translate3d(0, ${progress * 40}px, 0)`;
        }
      }
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// ── CARD TILT EFFECT (desktop only) ──
if (!isTouchDevice) {
  const tiltCards = document.querySelectorAll('.service-showcase, .pricing-card, .testimonial-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${y * -3}deg`);
      card.style.setProperty('--tilt-y', `${x * 3}deg`);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

// ── MAGNETIC BUTTON EFFECT (desktop only) ──
if (!isTouchDevice) {
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .pricing-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ── ROOT SYSTEM ANIMATION ──
const rootSystem = document.getElementById('rootSystem');
if (rootSystem) {
  const rootObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        rootSystem.classList.add('visible');
        rootObserver.unobserve(rootSystem);
      }
    });
  }, { threshold: 0.25 });
  rootObserver.observe(rootSystem);

  const rootNodes = document.querySelectorAll('.root-node');
  rootNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const target = node.getAttribute('data-target');
      const path = document.querySelector(`.active-path.target-${target}`);
      if (path) path.classList.add('hovered');
    });
    node.addEventListener('mouseleave', () => {
      const target = node.getAttribute('data-target');
      const path = document.querySelector(`.active-path.target-${target}`);
      if (path) path.classList.remove('hovered');
    });
  });
}

// ── NAV ACTIVE LINK ON SCROLL (debounced) ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
let activeTicking = false;

window.addEventListener('scroll', () => {
  if (!activeTicking) {
    requestAnimationFrame(() => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + current) {
          a.style.color = 'var(--gold)';
        }
      });
      activeTicking = false;
    });
    activeTicking = true;
  }
}, { passive: true });
