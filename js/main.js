/* otto creative — Brand Guidelines interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Marquee: duplicate content for a seamless loop ---------- */
  const track = $('#marquee-track');
  if (track) track.innerHTML += track.innerHTML + track.innerHTML;

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
    thumb.style.width = `${btn.offsetWidth}px`;
    thumb.style.left = `${btn.offsetLeft}px`;
  }
  function setMode(btn) {
    const mode = btn.dataset.mode;
    switchBtns.forEach(b => b.classList.toggle('is-active', b === btn));
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
})();
