// =====================================================
// GeoInformatica — Enhanced Welcome Overlay
// Three.js 3D Globe + Advanced Intro Animations
// =====================================================

export function initWelcomeOverlay() {
  buildOverlayHTML();
  initStars();
  initFloatingParticles();
  initThreeGlobe();
  initTypingEffect();
}

// ---- Build the overlay HTML ----
function buildOverlayHTML() {
  const overlay = document.getElementById('welcome-overlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="welcome-stars" id="welcome-stars"></div>
    <div class="welcome-grid"></div>
    
    <div class="welcome-card" id="welcome-card">
      <!-- 3D Globe -->
      <canvas id="welcome-globe-canvas"></canvas>

      <!-- Main card -->
      <div class="welcome-title-block">
        <div class="corner-deco tl"></div>
        <div class="corner-deco tr"></div>
        <div class="corner-deco bl"></div>
        <div class="corner-deco br"></div>

        <div class="welcome-agent-id" id="agent-id-text">SYS_BOOT: INITIALIZING...</div>

        <div class="welcome-headline">
          <span class="geo">Geo</span><span class="info">Infor</span><span class="matica">matica</span>
        </div>
        <div class="welcome-tagline">POLITICAL GEOGRAPHY OLYMPIAD PLATFORM</div>

        <!-- Biometric scan -->
        <div class="biometric-zone">
          <div class="fingerprint-wrap">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            <div class="fp-scanner-line"></div>
          </div>
          <div class="biometric-status">
            <span class="bio-label">Biometric Auth</span>
            <span class="bio-value" id="bio-value-text">SCANNING...</span>
            <div class="bio-bar-wrap"><div class="bio-bar-fill" id="bio-bar"></div></div>
          </div>
        </div>

        <!-- Stats readouts -->
        <div class="welcome-readouts">
          <div class="readout-item">
            <span class="readout-label">States</span>
            <span class="readout-value" id="rd-states">000</span>
          </div>
          <div class="readout-item">
            <span class="readout-label">Lessons</span>
            <span class="readout-value" id="rd-lessons">000</span>
          </div>
          <div class="readout-item">
            <span class="readout-label">Clearance</span>
            <span class="readout-value" id="rd-level">LV.1</span>
          </div>
        </div>

        <button id="start-experience-btn">
          <span id="start-btn-text">▶ INITIATE ACCESS</span>
        </button>
      </div>
    </div>
  `;
}

// ---- Stars ----
function initStars() {
  const container = document.getElementById('welcome-stars');
  if (!container) return;
  for (let i = 0; i < 180; i++) {
    const star = document.createElement('div');
    star.className = 'welcome-star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 3 + 2}s;
      animation-delay: ${Math.random() * 4}s;
      opacity: ${Math.random() * 0.6 + 0.1};
    `;
    container.appendChild(star);
  }
}

// ---- Floating particles ----
function initFloatingParticles() {
  const overlay = document.getElementById('welcome-overlay');
  if (!overlay) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'welcome-floating-particle';
    const size = Math.random() * 4 + 1;
    const colors = ['rgba(0,212,255,0.6)', 'rgba(212,168,67,0.5)', 'rgba(0,230,118,0.4)'];
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 8 + 5}s;
      animation-delay: ${Math.random() * 5}s;
      box-shadow: 0 0 ${size * 3}px currentColor;
    `;
    overlay.appendChild(p);
  }
}

// ---- Three.js 3D Globe ----
function initThreeGlobe() {
  const canvas = document.getElementById('welcome-globe-canvas');
  if (!canvas || !window.THREE) return;

  const W = 260, H = 260;
  canvas.width = W; canvas.height = H;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 3.2);

  // ---- Globe Sphere ----
  const globeGeo = new THREE.IcosahedronGeometry(1, 5);
  const globeMat = new THREE.MeshPhongMaterial({
    color: 0x0a1530,
    emissive: 0x001030,
    emissiveIntensity: 0.5,
    shininess: 120,
    specular: 0x00d4ff,
    flatShading: false,
    transparent: true,
    opacity: 0.92
  });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  scene.add(globe);

  // ---- Wireframe overlay ----
  const wireGeo = new THREE.IcosahedronGeometry(1.01, 3);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wire);

  // ---- Glowing atmosphere shell ----
  const atmosGeo = new THREE.SphereGeometry(1.18, 32, 32);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.04,
    side: THREE.BackSide
  });
  const atmos = new THREE.Mesh(atmosGeo, atmosMat);
  scene.add(atmos);

  // ---- Outer glow ring ----
  const ringGeo = new THREE.TorusGeometry(1.35, 0.008, 8, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.3 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 2.5;
  scene.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(1.55, 0.004, 8, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xd4a843, transparent: true, opacity: 0.2 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.z = Math.PI / 6;
  scene.add(ring2);

  // ---- Continent dots (random scatter to simulate landmasses) ----
  const dotsGeo = new THREE.BufferGeometry();
  const dotPositions = [];
  // Approximate continent regions with clustered dots
  const continentCenters = [
    [45, 15], [10, 15], [-30, -10], [100, 35], [-90, 40], [-65, -15], [130, -25]
  ];
  
  for (let i = 0; i < 800; i++) {
    const center = continentCenters[Math.floor(Math.random() * continentCenters.length)];
    const phi = THREE.MathUtils.degToRad(90 - (center[1] + (Math.random() - 0.5) * 35));
    const theta = THREE.MathUtils.degToRad(center[0] + (Math.random() - 0.5) * 60);
    const r = 1.02;
    dotPositions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }
  
  dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
  const dotsMat = new THREE.PointsMaterial({
    color: 0x00e676,
    size: 0.022,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });
  const dots = new THREE.Points(dotsGeo, dotsMat);
  scene.add(dots);

  // ---- Marker pins (key cities) ----
  const markerPositions = [
    { lat: 44.43, lng: 26.1, color: 0xff4466, label: 'Bucharest' },    // Bucharest
    { lat: 40.71, lng: -74.0, color: 0x00d4ff, label: 'New York' },   // NY
    { lat: 50.85, lng: 4.35, color: 0xd4a843, label: 'Brussels' },    // Brussels
    { lat: 39.9, lng: 116.4, color: 0xff8800, label: 'Beijing' },     // Beijing
    { lat: 55.75, lng: 37.6, color: 0xff4466, label: 'Moscow' },      // Moscow
  ];

  const markerGroup = new THREE.Group();
  markerPositions.forEach(m => {
    const phi = THREE.MathUtils.degToRad(90 - m.lat);
    const theta = THREE.MathUtils.degToRad(m.lng);
    const r = 1.06;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);

    const markerGeo = new THREE.SphereGeometry(0.028, 8, 8);
    const markerMat = new THREE.MeshBasicMaterial({ color: m.color });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.set(x, y, z);

    // Pulse ring around marker
    const pulseGeo = new THREE.RingGeometry(0.035, 0.05, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: m.color, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
    pulse.position.set(x, y, z);
    pulse.lookAt(new THREE.Vector3(0, 0, 0));
    pulse.userData.baseOpacity = 0.4;
    pulse.userData.pulsePhase = Math.random() * Math.PI * 2;

    markerGroup.add(marker);
    markerGroup.add(pulse);
  });
  scene.add(markerGroup);

  // ---- Lights ----
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0x112244, 0.8);
  scene.add(ambientLight);

  const blueLight = new THREE.PointLight(0x00d4ff, 0.8, 10);
  blueLight.position.set(-3, 2, 2);
  scene.add(blueLight);

  // ---- Animation loop ----
  let t = 0;
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let rotY = 0, rotX = 0;
  let velY = 0.003;

  canvas.addEventListener('mousedown', e => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    rotY += dx * 0.006;
    rotX += dy * 0.004;
    rotX = Math.max(-0.8, Math.min(0.8, rotX));
    velY = dx * 0.003;
    prevMouse = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener('mouseup', () => { isDragging = false; });

  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    if (!isDragging) {
      rotY += velY;
      velY *= 0.99;
      if (Math.abs(velY) < 0.001) velY = 0.003;
    }

    globe.rotation.y = rotY;
    globe.rotation.x = rotX;
    wire.rotation.y = rotY * 0.7;
    wire.rotation.x = rotX;
    dots.rotation.y = rotY;
    dots.rotation.x = rotX;
    markerGroup.rotation.y = rotY;
    markerGroup.rotation.x = rotX;

    ring1.rotation.z += 0.004;
    ring2.rotation.z -= 0.003;
    ring2.rotation.x += 0.002;

    // Pulse markers
    markerGroup.children.forEach(child => {
      if (child.userData.pulsePhase !== undefined) {
        const pulse = (Math.sin(t * 2 + child.userData.pulsePhase) + 1) / 2;
        child.material.opacity = 0.1 + pulse * 0.5;
        const s = 1 + pulse * 0.5;
        child.scale.set(s, s, 1);
      }
    });

    // Atmosphere breathe
    const breathe = (Math.sin(t * 0.5) + 1) / 2;
    atmosMat.opacity = 0.03 + breathe * 0.04;

    renderer.render(scene, camera);
  }
  animate();
}

// ---- Typing / Boot sequence effects ----
function initTypingEffect() {
  const lines = [
    { el: 'agent-id-text', texts: ['SYS_BOOT: INITIALIZING...', 'KERNEL_LOAD: OK', 'GEO_DB: CONNECTED', 'AUTH_MODULE: READY', 'AGENT_ID: GEO-∞'] },
  ];

  function typeSequence(elId, texts, callback) {
    const el = document.getElementById(elId);
    if (!el) { if (callback) callback(); return; }
    let i = 0;
    function next() {
      if (i >= texts.length) { if (callback) callback(); return; }
      el.textContent = texts[i++];
      setTimeout(next, i === texts.length ? 800 : 400);
    }
    next();
  }

  // Bio status sequence
  setTimeout(() => {
    const bioVal = document.getElementById('bio-value-text');
    if (bioVal) {
      const statuses = ['SCANNING...', 'PATTERN DETECTED', 'VERIFYING...', 'IDENTITY CONFIRMED ✓'];
      let i = 0;
      const iv = setInterval(() => {
        if (i >= statuses.length) { clearInterval(iv); return; }
        bioVal.textContent = statuses[i++];
        if (i === statuses.length) bioVal.style.color = '#00e676';
      }, 700);
    }
  }, 800);

  // Count-up readouts
  setTimeout(() => {
    countUp('rd-states', 0, 195, 1800);
    countUp('rd-lessons', 0, 48, 1500);

    const xp = parseInt(localStorage.getItem('userXP')) || 0;
    const lv = Math.floor(xp / 100) + 1;
    const rdLv = document.getElementById('rd-level');
    if (rdLv) rdLv.textContent = `LV.${lv}`;
  }, 600);

  typeSequence('agent-id-text', lines[0].texts);
}

function countUp(elId, from, to, duration) {
  const el = document.getElementById(elId);
  if (!el) return;
  const start = performance.now();
  function frame(now) {
    const prog = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.round(from + (to - from) * eased).toString().padStart(3, '0');
    if (prog < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
