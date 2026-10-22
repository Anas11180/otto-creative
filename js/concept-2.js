/* =========================================================
   otto creative — Concept 2: Cinematic 3D & Horizontal Odyssey JS
   Three.js WebGL 3D Monolith, GSAP ScrollTrigger Pinned Track,
   Cinema Spotlight Follower
   ========================================================= */

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* -------------------------------------------------------
     1. Cinema Spotlight Torch Follower
     ------------------------------------------------------- */
  const spotlight = $('.cinema-spotlight');
  if (spotlight) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animSpotlight() {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      spotlight.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animSpotlight);
    }
    animSpotlight();
  }

  /* -------------------------------------------------------
     2. Three.js WebGL Interactive 3D Scene
     ------------------------------------------------------- */
  const canvasWrap = $('#hero-3d-canvas');
  if (canvasWrap && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvasWrap.clientWidth / canvasWrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    canvasWrap.appendChild(renderer.domElement);

    // 3D Monolith / Ring Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Outer Obsidian Ring (Dark Luxury Glass/Ceramic)
    const ringGeo = new THREE.TorusGeometry(2.2, 0.55, 32, 100);
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x0F0F10,
      metalness: 0.85,
      roughness: 0.22,
      envMapIntensity: 1.5,
    });
    const ringMesh = new THREE.Mesh(ringGeo, obsidianMat);
    mainGroup.add(ringMesh);

    // Signature Radiant Ember Floating Bite Core
    const coreGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const emberMat = new THREE.MeshStandardMaterial({
      color: 0xFF5A1F,
      emissive: 0xFF3500,
      emissiveIntensity: 0.9,
      metalness: 0.2,
      roughness: 0.3,
    });
    const coreMesh = new THREE.Mesh(coreGeo, emberMat);
    coreMesh.position.set(1.9, 1.2, 0.2); // Positioned at bite quadrant
    mainGroup.add(coreMesh);

    // Outer Thin Wireframe Accent Ring
    const wireGeo = new THREE.TorusGeometry(2.5, 0.02, 16, 80);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xECE7DF, transparent: true, opacity: 0.25 });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // Embers Particle System (Floating sparks)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 12;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xFF5A1F,
      transparent: true,
      opacity: 0.65,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xECE7DF, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    dirLight.position.set(5, 5, 4);
    scene.add(dirLight);

    const emberLight = new THREE.PointLight(0xFF5A1F, 3.5, 8);
    emberLight.position.set(2, 1, 1);
    scene.add(emberLight);

    // Mouse Interaction for 3D rotation
    let targetRotationX = 0.2;
    let targetRotationY = -0.3;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    canvasWrap.addEventListener('mousedown', e => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => (isDragging = false));

    window.addEventListener('mousemove', e => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotationY = normX * 0.6;
        targetRotationX = -normY * 0.4;
      }
    });

    // Controls Buttons
    let isWireframe = false;
    const wireBtn = $('#btn-3d-wireframe');
    if (wireBtn) {
      wireBtn.addEventListener('click', () => {
        isWireframe = !isWireframe;
        obsidianMat.wireframe = isWireframe;
        wireBtn.classList.toggle('is-active', isWireframe);
      });
    }

    let spinFast = false;
    const spinBtn = $('#btn-3d-spin');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => {
        spinFast = !spinFast;
        spinBtn.classList.toggle('is-active', spinFast);
      });
    }

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle float
      const spinSpeed = spinFast ? 0.04 : 0.006;
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.06 + spinSpeed;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.06;
      mainGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.12;

      // Pulse ember core
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
      coreMesh.scale.set(pulse, pulse, pulse);
      emberLight.intensity = 3 + Math.sin(elapsedTime * 3) * 1.5;

      // Particle rotation
      particleSystem.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    }
    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
      camera.aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
    });
  }

  /* -------------------------------------------------------
     3. GSAP ScrollTrigger Pinned Horizontal Scroll
     ------------------------------------------------------- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const section = $('.horizontal-scroll-section');
    const track = $('.horizontal-track');
    const progressBar = $('.horizontal-progress-bar');

    if (section && track) {
      // Calculate scroll distance
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 80);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: self => {
            if (progressBar) {
              progressBar.style.width = `${(self.progress * 100).toFixed(1)}%`;
            }
          }
        }
      });
    }
  }
})();
