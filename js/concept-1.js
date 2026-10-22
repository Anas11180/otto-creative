/* =========================================================
   otto creative — Concept 1: Supercharged Studio JS
   Audio Feedback, Magnetic Buttons, 3D Tilt, Live Brief Builder
   ========================================================= */

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* -------------------------------------------------------
     1. Web Audio API — Subtle Micro-Haptics
     ------------------------------------------------------- */
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTick(freq = 600, duration = 0.03) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playCrunch() {
    if (!soundEnabled || !audioCtx) return;
    try {
      // Noise burst for bite crunch
      const bufferSize = audioCtx.sampleRate * 0.12;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + 0.12);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  const soundBtn = $('#sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundBtn.classList.toggle('is-active', soundEnabled);
      soundBtn.innerHTML = soundEnabled ? '<span>🔊</span> الصوت مفعّل' : '<span>🔇</span> تفعيل المؤثرات الصوتية';
      if (soundEnabled) playCrunch();
    });
  }

  // Hook crunch to the hero bite
  const heroLogoWrap = $('#hero-logo');
  if (heroLogoWrap) {
    heroLogoWrap.addEventListener('click', () => {
      if (soundEnabled) playCrunch();
    });
  }

  /* -------------------------------------------------------
     2. 3D Tilt Effect on Cards
     ------------------------------------------------------- */
  const tiltElements = $$('.tilt-card, .board, .core-card, .variant');
  tiltElements.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });

    card.addEventListener('mouseenter', () => playTick(800, 0.02));
  });

  /* -------------------------------------------------------
     3. Magnetic Buttons
     ------------------------------------------------------- */
  const magneticBtns = $$('.btn--accent, .nav__cta');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* -------------------------------------------------------
     4. Interactive Brief Builder & WhatsApp Generator
     ------------------------------------------------------- */
  const typeOptions = $$('.brief-option[data-group="type"]');
  const scopeOptions = $$('.brief-option[data-group="scope"]');
  const timelineOptions = $$('.brief-option[data-group="timeline"]');
  const summaryPreview = $('#brief-summary-text');
  const whatsappCta = $('#brief-whatsapp-cta');

  let selectedType = 'مشروع تجاري جديد (Start from Scratch)';
  let selectedScope = ['نظام الشعار والهوية البصرية المتكاملة', 'تصميم التغليف والعبوات'];
  let selectedTimeline = 'خطة إطلاق قياسية (3 - 5 أسابيع)';

  function updateBrief() {
    // Generate readable preview
    const scopeListStr = selectedScope.length ? selectedScope.join(' + ') : 'هوية بصرية شاملة';
    if (summaryPreview) {
      summaryPreview.innerHTML = `
        نوع المشروع: <b>${selectedType}</b><br>
        النطاق المطلوب: <b>${scopeListStr}</b><br>
        الجدول الزمني: <b>${selectedTimeline}</b>
      `;
    }

    // Generate WhatsApp Link
    const waText = `مرحباً فريق otto creative 👋\n\nأود بدء مشروع هوية بصرية معكم بالتفاصيل التالية:\n\n📌 نوع المشروع: ${selectedType}\n📦 نطاق العمل المطلوب: ${scopeListStr}\n⏱️ الجدول الزمني المقترح: ${selectedTimeline}\n\nأرجو تزويدي بالخطوات وتفاصيل البدء. شكراً لكم!`;
    const encoded = encodeURIComponent(waText);
    if (whatsappCta) {
      whatsappCta.href = `https://wa.me/message/A5AWO6AT3BUGH1?text=${encoded}`;
    }
  }

  // Type selection (single choice)
  typeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      typeOptions.forEach(o => o.classList.remove('is-selected'));
      opt.classList.add('is-selected');
      selectedType = opt.dataset.val;
      playTick(500, 0.04);
      updateBrief();
    });
  });

  // Scope selection (multi choice)
  scopeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('is-selected');
      const val = opt.dataset.val;
      if (opt.classList.contains('is-selected')) {
        if (!selectedScope.includes(val)) selectedScope.push(val);
      } else {
        selectedScope = selectedScope.filter(s => s !== val);
      }
      playTick(700, 0.03);
      updateBrief();
    });
  });

  // Timeline selection (single choice)
  timelineOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      timelineOptions.forEach(o => o.classList.remove('is-selected'));
      opt.classList.add('is-selected');
      selectedTimeline = opt.dataset.val;
      playTick(600, 0.04);
      updateBrief();
    });
  });

  updateBrief();

  /* -------------------------------------------------------
     5. Animated Number Counters
     ------------------------------------------------------- */
  const counters = $$('.hero-stat-card__num[data-target]');
  let counted = false;

  const countObserver = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting) && !counted) {
      counted = true;
      counters.forEach(counter => {
        const target = +counter.dataset.target;
        const suffix = counter.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 45);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.innerHTML = `${current}<span>${suffix}</span>`;
        }, 30);
      });
    }
  }, { threshold: 0.3 });

  const statsBar = $('.hero-stats');
  if (statsBar) countObserver.observe(statsBar);
})();
