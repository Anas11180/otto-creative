/* otto creative — Brand Guidelines interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Marquee: purely CSS-driven seamless loop ---------- */

  /* ---------- Hero: the bite ---------- */
  const heroWrap = $('#hero-logo');
  const heroSvg = $('#hero-svg');
  const biteIns = $$('.bite-in', heroSvg);
  const biteOuts = $$('.bite-out', heroSvg);
  const VB = { x: -4, y: -12, w: 344, h: 136 };
  const BITE_POINTS = [[307.98, 22.87], [322.77, 33.23], [333.13, 48.03]];
  let biting = false;

  function spawnCrumbs([vx, vy]) {
    const hero = $('#hero');
    const r = heroSvg.getBoundingClientRect();
    const h = hero.getBoundingClientRect();
    const x = r.left - h.left + ((vx - VB.x) / VB.w) * r.width;
    const y = r.top - h.top + ((vy - VB.y) / VB.h) * r.height;
    for (let i = 0; i < 5; i++) {
      const c = document.createElement('span');
      c.className = 'crumb';
      const angle = (-Math.PI / 2.4) + (Math.random() - .3) * 1.6;
      const dist = 40 + Math.random() * 90;
      c.style.left = `${x}px`;
      c.style.top = `${y}px`;
      c.style.setProperty('--s', `${5 + Math.random() * 9}px`);
      c.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      c.style.setProperty('--dy', `${Math.sin(angle) * dist + 40}px`);
      hero.appendChild(c);
      c.addEventListener('animationend', () => c.remove());
    }
  }

  function bite() {
    if (biting) return;
    biting = true;
    biteIns.forEach((a, i) => {
      setTimeout(() => {
        a.beginElement();
        heroSvg.classList.remove('is-crunch');
        void heroSvg.getBoundingClientRect();
        heroSvg.classList.add('is-crunch');
        if (!reduceMotion) spawnCrumbs(BITE_POINTS[i]);
        if (i === biteIns.length - 1) setTimeout(() => (biting = false), 300);
      }, i * 170);
    });
  }

  function heal(cb) {
    biteOuts.forEach(a => a.beginElement());
    setTimeout(cb, 380);
  }

  if (heroSvg && biteIns.length) {
    setTimeout(bite, reduceMotion ? 0 : 900);
    heroWrap.addEventListener('click', () => !biting && heal(bite));
  }
  const replay = $('#bite-replay');
  if (replay) replay.addEventListener('click', () => {
    $('#hero').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => heal(bite), 600);
  });

  /* ---------- Nav: scrolled state + active link ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = $$('.nav__links a');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(l => { const s = $(l.getAttribute('href')); if (s) sectionObserver.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Mirror / palindrome demo ---------- */
  const flipBtn = $('#flip-btn');
  const mirrorLogo = $('#mirror-logo');
  const mirrorCaption = $('#mirror-caption');
  if (flipBtn) flipBtn.addEventListener('click', () => {
    const flipped = mirrorLogo.classList.toggle('is-flipped');
    mirrorCaption.textContent = flipped
      ? 'لاحظ؟ كل شيء تطابق… والقضمة وحدها انتقلت. هذا هو توقيعنا.'
      : 'اقلبها، وستبقى كما هي… إلا القضمة.';
  });

  /* ---------- Logo stage: background + construction grid ---------- */
  const stage = $('#logo-stage');
  $$('.swatch-btn', stage).forEach(btn => btn.addEventListener('click', () => {
    stage.dataset.bg = btn.dataset.bg;
    $$('.swatch-btn', stage).forEach(b => b.classList.toggle('is-active', b === btn));
  }));
  const gridToggle = $('#grid-toggle');
  if (gridToggle) gridToggle.addEventListener('click', () => {
    const on = stage.classList.toggle('show-grid');
    gridToggle.classList.toggle('is-active', on);
    gridToggle.setAttribute('aria-pressed', on);
    gridToggle.textContent = on ? 'إخفاء شبكة البناء' : 'إظهار شبكة البناء';
  });

  /* ---------- Colors: copy HEX ---------- */
  const toast = $('#toast');
  const toastText = $('#toast-text');
  const toastDot = $('#toast-dot');
  let toastTimer;
  function showToast(msg, color) {
    toastText.textContent = msg;
    toastDot.style.background = color || 'transparent';
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }
  $$('.color').forEach(btn => btn.addEventListener('click', async () => {
    const hex = btn.dataset.hex;
    try { await navigator.clipboard.writeText(hex); showToast(`تم نسخ ${hex}`, hex); }
    catch { showToast(hex, hex); }
  }));

  /* ---------- Type tester ---------- */
  const typeInput = $('#type-input');
  const typeOutput = $('#type-output');
  const typeSize = $('#type-size');
  const fontBtns = $$('[data-font]');
  if (typeInput) {
    typeInput.addEventListener('input', () => { typeOutput.textContent = typeInput.value || 'علامتك جائعة؟'; });
    typeSize.addEventListener('input', () => { typeOutput.style.fontSize = `${typeSize.value}px`; });
    fontBtns.forEach(b => b.addEventListener('click', () => {
      typeOutput.style.fontFamily = b.dataset.font;
      typeOutput.style.fontWeight = b.id === 'font-plex' ? 600 : 900;
      fontBtns.forEach(x => x.classList.toggle('is-active', x === b));
    }));
  }

  /* ---------- Voice: plain vs otto rewrite ---------- */
  const rewrites = $('#rewrites');
  const thumb = $('#switch-thumb');
  const switchBtns = $$('#voice-switch button');
  function placeThumb(btn) {
    if (!btn || !thumb) return;
    thumb.style.width = `${btn.offsetWidth}px`;
    thumb.style.left = `${btn.offsetLeft}px`;
  }
  function setMode(btn) {
    const mode = btn.dataset.mode;
    switchBtns.forEach(b => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });
    placeThumb(btn);
    const texts = $$('.rewrite__text', rewrites);
    texts.forEach(t => t.classList.add('is-swapping'));
    setTimeout(() => {
      rewrites.classList.toggle('is-otto', mode === 'otto');
      texts.forEach(t => { t.textContent = t.dataset[mode]; t.classList.remove('is-swapping'); });
    }, 220);
  }
  if (switchBtns.length) {
    switchBtns.forEach(b => b.addEventListener('click', () => setMode(b)));
    const init = () => placeThumb($('#voice-switch .is-active'));
    document.fonts ? document.fonts.ready.then(init) : init();
    window.addEventListener('resize', init);
  }

  /* ---------- Behance Showcase: Filter + Lightbox ---------- */
  const filterBtns = $$('.showcase-filters [data-filter]');
  const boards = $$('#behance-grid .board');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.toggle('is-active', b === btn));
    boards.forEach(card => {
      const match = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('is-hidden', !match);
    });
  }));

  const lightbox = $('#lightbox');
  const lbImg = $('#lightbox-img');
  const lbTitle = $('#lightbox-title');
  const lbDesc = $('#lightbox-desc');
  const lbClose = $('#lightbox-close');

  function openLightbox(board) {
    if (!lightbox) return;
    lbImg.src = board.dataset.full;
    lbImg.alt = board.dataset.title || '';
    lbTitle.textContent = board.dataset.title || '';
    lbDesc.textContent = board.dataset.desc || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  boards.forEach(b => b.addEventListener('click', () => openLightbox(b)));
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox(); });
  }

  /* ---------- Mobile Navigation Drawer & Touch Interactions ---------- */
  const navToggle = $('#nav-toggle');
  const navLinks = $('#nav-links');

  function closeMobileNav() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', e => {
      e.stopPropagation();
      const open = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    links.forEach(l => l.addEventListener('click', closeMobileNav));
    document.addEventListener('click', e => {
      if (navLinks.classList.contains('is-open') && !nav.contains(e.target)) closeMobileNav();
    });
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) closeMobileNav();
    });
  }

  /* Tap-to-flip for Business Card & Voice Cards on touchscreens */
  const appCard = $('.app--card');
  const bcard = $('.bcard', appCard || document);
  if (appCard && bcard) {
    appCard.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      bcard.classList.toggle('is-flipped');
    });
  }

  $$('.voice-pair').forEach(vp => {
    vp.addEventListener('click', () => vp.classList.toggle('is-flipped'));
  });
})();
