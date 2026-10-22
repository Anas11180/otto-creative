/* =========================================================
   otto creative — Concept 3: The Living Brand Sandbox JS
   Dual Theme Switcher, Logo Architecture Lab, Live Mockup Simulator
   ========================================================= */

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* -------------------------------------------------------
     1. Dual Theme Switcher (Noir vs Warm Editorial Paper)
     ------------------------------------------------------- */
  const themeBtn = $('#theme-toggle-btn');
  let isPaper = false;

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      isPaper = !isPaper;
      document.body.classList.toggle('mode-paper', isPaper);
      themeBtn.innerHTML = isPaper ? '🌙 عودة لأسود نوار' : '📄 وضع الورق التحريري';
    });
  }

  /* -------------------------------------------------------
     2. Logo Architecture Lab (Exploded View & Bite Scaler)
     ------------------------------------------------------- */
  const sliderExplode = $('#lab-explode');
  const sliderBite = $('#lab-bite');
  const toggleGrid = $('#lab-grid-toggle');
  const gridOverlay = $('#lab-grid-lines');

  const partO1 = $('#lab-o1');
  const partT1 = $('#lab-t1');
  const partT2 = $('#lab-t2');
  const partBar = $('#lab-bar');
  const partO2 = $('#lab-o2');
  const biteCircles = $$('#m-lab-bite circle');

  if (sliderExplode) {
    sliderExplode.addEventListener('input', () => {
      const val = parseFloat(sliderExplode.value);
      // Explode elements apart symmetrically
      if (partO1) partO1.style.transform = `translateX(${-val * 28}px)`;
      if (partT1) partT1.style.transform = `translateX(${-val * 10}px)`;
      if (partT2) partT2.style.transform = `translateX(${val * 10}px)`;
      if (partO2) partO2.style.transform = `translateX(${val * 28}px)`;
      if (partBar) partBar.style.transform = `scaleX(${1 + val * 0.25})`;
    });
  }

  if (sliderBite) {
    sliderBite.addEventListener('input', () => {
      const r = parseFloat(sliderBite.value);
      biteCircles.forEach((circle, i) => {
        circle.setAttribute('r', r * (1 - i * 0.15));
      });
    });
  }

  if (toggleGrid && gridOverlay) {
    toggleGrid.addEventListener('change', () => {
      gridOverlay.style.opacity = toggleGrid.checked ? '0.75' : '0';
    });
  }

  /* -------------------------------------------------------
     3. Live Custom Mockup Simulator
     ------------------------------------------------------- */
  const brandInput = $('#mockup-brand-name');
  const cupText = $('.simulated-cup__text');
  const cupSleeve = $('.simulated-cup__sleeve');
  const swatches = $$('.color-swatch-opt');

  if (brandInput && cupText) {
    brandInput.addEventListener('input', () => {
      cupText.textContent = brandInput.value.trim() || 'علامتك هنا';
    });
  }

  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      swatches.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const color = btn.dataset.color;
      if (cupSleeve) {
        cupSleeve.style.setProperty('--sim-color', color);
        cupSleeve.style.backgroundColor = color;
      }
    });
  });
})();
