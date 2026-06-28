/* ════════════════════════════════
   Şa Kitaplar — script.js
════════════════════════════════ */

/* ── Refs ── */
const header     = document.getElementById('header');
const burger     = document.getElementById('burger');
const nav        = document.getElementById('nav');
const navOverlay = document.getElementById('navOverlay');
const floatIg    = document.getElementById('floatIg');
const backToTop  = document.getElementById('backToTop');
const scrollHint = document.getElementById('scrollHint');

/* ── Scroll handler ── */
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 20);
  floatIg.classList.toggle('is-visible', y > 300);
  backToTop.classList.toggle('is-visible', y > 500);
  if (scrollHint) scrollHint.classList.toggle('is-hidden', y > 80);
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Mobile menu ── */
function openNav() {
  nav.classList.add('is-open');
  navOverlay.classList.add('is-visible');
  burger.classList.add('is-active');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  nav.classList.remove('is-open');
  navOverlay.classList.remove('is-visible');
  burger.classList.remove('is-active');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => nav.classList.contains('is-open') ? closeNav() : openNav());
navOverlay.addEventListener('click', closeNav);
nav.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeNav(); closeLightbox(); } });

/* ── Floating buttons ── */
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Scroll-spy nav ── */
const sections  = document.querySelectorAll('section[id], div[id="about"]');
const navLinks  = document.querySelectorAll('.nav__link[href^="#"]');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('is-active'));
      const match = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
      if (match) match.classList.add('is-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('section[id]').forEach(s => spyObserver.observe(s));

/* ── Stat counters ── */
function animateCount(el, target, duration = 1400) {
  const isK = target >= 10000;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    if (isK) {
      const val = (ease * target / 1000).toFixed(1);
      el.textContent = val + 'K';
    } else {
      el.textContent = Math.round(ease * target);
    }
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count, 10);
      if (!isNaN(target)) animateCount(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

/* ════════════════════════════════
   LIGHTBOX
════════════════════════════════ */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');
const lbCounter = document.getElementById('lbCounter');

let lbItems = [];
let lbIndex = 0;

function openLightbox(items, index) {
  lbItems = items;
  lbIndex = index;
  showLbImage(lbIndex);
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

function showLbImage(idx) {
  lbIndex = (idx + lbItems.length) % lbItems.length;
  const item = lbItems[lbIndex];
  lbImg.classList.add('is-loading');
  const tmp = new Image();
  tmp.onload = () => { lbImg.src = tmp.src; lbImg.alt = item.alt; lbImg.classList.remove('is-loading'); };
  tmp.src = item.src;
  lbCounter.textContent = `${lbIndex + 1} / ${lbItems.length}`;
  lbPrev.style.display = lbItems.length > 1 ? '' : 'none';
  lbNext.style.display = lbItems.length > 1 ? '' : 'none';
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => showLbImage(lbIndex - 1));
lbNext.addEventListener('click', () => showLbImage(lbIndex + 1));

lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'ArrowLeft')  showLbImage(lbIndex - 1);
  if (e.key === 'ArrowRight') showLbImage(lbIndex + 1);
});

/* ── Wire gallery items ── */
function initGallery() {
  const galleryItems = document.querySelectorAll('#galleryGrid [data-lb]');
  const items = Array.from(galleryItems).map(el => ({ src: el.dataset.lb, alt: el.dataset.lbAlt || '' }));
  galleryItems.forEach((el, i) => {
    el.addEventListener('click', () => openLightbox(items, i));
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(items, i); });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initGallery();

  /* Reveal animations */
  const revealSelectors = [
    '.cat-card', '.gallery__item', '.review-card',
    '.step', '.about__img', '.about__content',
    '.contact__content', '.contact__image',
    '.features-bar__inner',
  ];
  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i >= 1 && i <= 5) el.classList.add(`reveal-delay-${i}`);
      revealObserver.observe(el);
    });
  });

  /* Counters */
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* Initial state */
  onScroll();
});
