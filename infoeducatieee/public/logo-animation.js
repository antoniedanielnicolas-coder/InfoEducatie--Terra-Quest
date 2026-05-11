window.addEventListener('DOMContentLoaded', () => {
    // --- Scene Setup ---
    const logoContainer = document.getElementById('logo-3d-container');
    if (!logoContainer || !window.THREE) return;

    const width = 60; 
    const height = 60;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    logoContainer.appendChild(renderer.domElement);

// --- Model Groups ---
const GeoInfoLogoGroup = new THREE.Group();
scene.add(GeoInfoLogoGroup);

const GlobeGroup = new THREE.Group();
GeoInfoLogoGroup.add(GlobeGroup);

// --- Geometry ---

// 1. Globe Container (The Ocean Sphere)
const oceanGeometry = new THREE.IcosahedronGeometry(1, 2); 
const oceanMaterial = new THREE.MeshPhongMaterial({
  color: 0x121a2e,
  emissive: 0x00d4ff,
  emissiveIntensity: 0.2,
  shininess: 100,
  specular: 0xffffff,
  flatShading: true,
  transparent: true,
  opacity: 0.9
});
const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
GlobeGroup.add(oceanMesh);

// 2. Continents Wireframe
const continentGeometry = new THREE.IcosahedronGeometry(1.05, 2);
const continentMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.9,
  roughness: 0.1,
  wireframe: true,
  emissive: 0x00d4ff,
  emissiveIntensity: 0.2
});
const continentMesh = new THREE.Mesh(continentGeometry, continentMaterial);
GlobeGroup.add(continentMesh);

// 3. Separate Compass Needle
const needleGroup = new THREE.Group();
GeoInfoLogoGroup.add(needleGroup);

const topNeedleGeometry = new THREE.ConeGeometry(0.12, 0.5, 4);
const topNeedleMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00d4ff, 
    metalness: 0.8, 
    emissive: 0x00d4ff,
    emissiveIntensity: 0.5
});
const topNeedleMesh = new THREE.Mesh(topNeedleGeometry, topNeedleMaterial);
topNeedleMesh.position.y = 0.3;
needleGroup.add(topNeedleMesh);

const bottomNeedleGeometry = new THREE.ConeGeometry(0.12, 0.5, 4);
const bottomNeedleMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd4a843, 
    metalness: 0.5 
});
const bottomNeedleMesh = new THREE.Mesh(bottomNeedleGeometry, bottomNeedleMaterial);
bottomNeedleMesh.position.y = -0.3;
bottomNeedleMesh.rotation.x = Math.PI;
needleGroup.add(bottomNeedleMesh);

// --- Lighting ---
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// --- Animation Logic ---
function animateLogo() {
  requestAnimationFrame(animateLogo);
  GlobeGroup.rotation.y += 0.01;
  GlobeGroup.rotation.x += 0.005;
  renderer.render(scene, camera);
}
animateLogo();

// --- GSAP Intro Sequence ---
function playLogoIntro() {
    const appTitleText = document.querySelector('.app-title');
    
    const introTimeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    // Hide title initially
    if (appTitleText) gsap.set(appTitleText, { opacity: 0, x: -20 });

    // Sequence Start: Emerge
    introTimeline.fromTo(GeoInfoLogoGroup.position, 
        { y: -2 }, 
        { y: 0, duration: 1.5 }
    );

    // Step 1: Rapid Rotate & Slow Down
    introTimeline.to(GlobeGroup.rotation, { 
        y: Math.PI * 4, 
        duration: 2, 
        ease: 'expo.out' 
    }, "-=1");

    // Step 2: Snail North & Snap North
    introTimeline.fromTo(needleGroup.rotation, 
      { y: -Math.PI * 8 }, 
      { y: Math.PI * 8, duration: 1.5, ease: 'sine.inOut' },
    '-=2');

    introTimeline.to(needleGroup.rotation, { 
        y: 0, 
        duration: 1, 
        ease: 'back.out(1.7)' 
    }, '-=0.5'); 

    // Fade In App Title
    introTimeline.to(appTitleText, { 
        opacity: 1, 
        x: 0, 
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8');

    // Pulse Glow
    gsap.to(continentMesh.material, { 
      emissiveIntensity: 0.8, 
      duration: 2, 
      repeat: -1, 
      yoyo: true, 
      ease: 'sine.inOut' 
    });
}

// Start intro after short delay
setTimeout(playLogoIntro, 500);

// Mouse Interaction
window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) - 0.5;
    const mouseY = (e.clientY / window.innerHeight) - 0.5;
    
    gsap.to(GeoInfoLogoGroup.rotation, {
        y: mouseX * 0.5,
        x: mouseY * 0.5,
        duration: 1,
        ease: 'power2.out'
    });
    });
});
