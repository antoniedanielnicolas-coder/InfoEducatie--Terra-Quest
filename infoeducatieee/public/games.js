import { playSound } from './sounds.js';
import { t } from './i18n.js';
import { showToast } from './utils.js';
import { initSeterra, cleanupSeterra } from './seterra.js';

let currentGame = null;
let gameData = {
    score: 0,
    coins: 0
};

// --- GAME 1: MAP QUIZ ---
const mapTargets = [
    { name: "Craiova, Romania", lat: 44.33, lng: 23.82, zoom: 6 },
    { name: "Brussels, Belgium (NATO HQ)", lat: 50.85, lng: 4.35, zoom: 6 },
    { name: "New York, USA (UN HQ)", lat: 40.71, lng: -74.00, zoom: 4 },
    { name: "Taipei, Taiwan", lat: 25.03, lng: 121.56, zoom: 5 },
    { name: "Funafuti, Tuvalu", lat: -8.51, lng: 179.19, zoom: 8 },
    { name: "Beijing, China", lat: 39.91, lng: 116.39, zoom: 5 },
    { name: "Moscow, Russia", lat: 55.75, lng: 37.62, zoom: 5 },
    { name: "Pretoria, South Africa", lat: -25.74, lng: 28.19, zoom: 6 }
];

let mapInstance = null;
let currentTargetIndex = 0;

function initMapQuiz() {
    currentTargetIndex = 0;
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="map-quiz-ui">
            <div id="target-box" class="glass-card">
                <div style="display:flex;align-items:center;gap:12px;justify-content:center;">
                    <span style="font-size:2rem;">🎯</span>
                    <div>
                        <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:2px;">Locate on Map</div>
                        <h3 style="margin:0;" id="target-name" class="gradient-text">${mapTargets[0].name}</h3>
                    </div>
                </div>
                <div style="display:flex;gap:20px;justify-content:center;margin-top:10px;">
                    <span style="font-size:0.8rem;color:var(--text-secondary);">📍 Target <span id="target-progress">1</span>/${mapTargets.length}</span>
                    <span style="font-size:0.8rem;color:var(--gold-bright);">✅ Score: <span id="map-score">0</span></span>
                </div>
            </div>
            <div id="leaflet-map" style="height: 500px; border-radius: 20px; box-shadow: var(--shadow-neon);"></div>
        </div>
    `;

    setTimeout(() => {
        if (mapInstance) { mapInstance.remove(); mapInstance = null; }
        mapInstance = L.map('leaflet-map').setView([20, 0], 2);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance);

        mapInstance.on('click', (e) => {
            handleMapClick(e.latlng);
        });
    }, 100);
}

function handleMapClick(clicked) {
    const target = mapTargets[currentTargetIndex];
    const targetLatLng = L.latLng(target.lat, target.lng);
    const distance = clicked.distanceTo(targetLatLng);
    const threshold = 150000;

    if (distance < threshold) {
        playSound('correct');
        gameData.coins += 5;
        gameData.score++;
        updateGameStats();
        
        // Show correct marker
        L.marker([target.lat, target.lng]).addTo(mapInstance)
            .bindPopup(`<b style="color:#00d4ff">✅ ${target.name}</b>`).openPopup();
        
        const scoreEl = document.getElementById('map-score');
        if (scoreEl) scoreEl.innerText = gameData.score;
        
        showToast(t('games.correct_toast') || `✅ Correct! +5 Coins`, "success");
        
        currentTargetIndex = (currentTargetIndex + 1) % mapTargets.length;
        document.getElementById('target-name').innerText = mapTargets[currentTargetIndex].name;
        const progressEl = document.getElementById('target-progress');
        if (progressEl) progressEl.innerText = currentTargetIndex + 1;
    } else {
        playSound('wrong');
        const mapEl = document.getElementById('leaflet-map');
        if (mapEl) mapEl.classList.add('shake');
        setTimeout(() => mapEl && mapEl.classList.remove('shake'), 500);
        showToast("❌ Too far! Try again.", "error");
        
        // Show a hint circle
        L.circle(clicked, { radius: distance * 0.3, color: '#ff4466', fillOpacity: 0.1, weight: 1 })
            .addTo(mapInstance);
    }
}

// --- GAME 2: GEOPOLITICS SIMULATOR (HTML5 Drag & Drop) ---
function getGeoSimItems() {
    return [
        {
            id: 'eu',
            emoji: '🇪🇺',
            label: t('geo_sim.items.eu_label'),
            desc: t('geo_sim.items.eu_desc'),
            color: '#003399',
            zone: { label: t('geo_sim.items.eu_zone'), hint: t('geo_sim.items.eu_hint') }
        },
        {
            id: 'nato',
            emoji: '🎖️',
            label: t('geo_sim.items.nato_label'),
            desc: t('geo_sim.items.nato_desc'),
            color: '#00d4ff',
            zone: { label: t('geo_sim.items.nato_zone'), hint: t('geo_sim.items.nato_hint') }
        },
        {
            id: 'dmz',
            emoji: '🇰🇷',
            label: t('geo_sim.items.dmz_label'),
            desc: t('geo_sim.items.dmz_desc'),
            color: '#ff4466',
            zone: { label: t('geo_sim.items.dmz_zone'), hint: t('geo_sim.items.dmz_hint') }
        },
        {
            id: '49th',
            emoji: '🇨🇦',
            label: t('geo_sim.items.49th_label'),
            desc: t('geo_sim.items.49th_desc'),
            color: '#00e676',
            zone: { label: t('geo_sim.items.49th_zone'), hint: t('geo_sim.items.49th_hint') }
        },
        {
            id: 'bri',
            emoji: '🇨🇳',
            label: t('geo_sim.items.bri_label'),
            desc: t('geo_sim.items.bri_desc'),
            color: '#d4a843',
            zone: { label: t('geo_sim.items.bri_zone'), hint: t('geo_sim.items.bri_hint') }
        }
    ];
}

let geoSimScore = 0;
let geoSimTotal = 5;
let geoSimCompleted = new Set();

function initGeoSimulator() {
    geoSimScore = 0;
    geoSimCompleted.clear();
    const geoSimItems = getGeoSimItems();
    geoSimTotal = geoSimItems.length;
    
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="geo-sim-layout" style="display:grid;grid-template-columns:280px 1fr;gap:20px;height:580px;">
            <!-- Sidebar: Drag Items -->
            <div class="sim-sidebar glass-card" style="padding:20px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;">
                <h4 style="color:var(--neon-blue);font-family:'Orbitron',sans-serif;font-size:0.85rem;text-transform:uppercase;letter-spacing:2px;margin:0 0 5px 0;">
                    ${t('geo_sim.sidebar_title')}
                </h4>
                <p style="font-size:0.75rem;color:var(--text-secondary);margin:0 0 10px 0;">
                    ${t('geo_sim.sidebar_desc')}
                </p>
                <div id="drag-items-list" style="display:flex;flex-direction:column;gap:12px;">
                    ${geoSimItems.map(item => `
                        <div 
                            class="geo-drag-item" 
                            id="drag-item-${item.id}"
                            draggable="true"
                            data-id="${item.id}"
                            style="
                                background: ${item.color}22;
                                border: 2px dashed ${item.color};
                                border-radius: 12px;
                                padding: 12px 15px;
                                cursor: grab;
                                user-select: none;
                                transition: all 0.3s;
                                display: flex;
                                align-items: center;
                                gap: 10px;
                            "
                        >
                            <span style="font-size:1.8rem;">${item.emoji}</span>
                            <div>
                                <div style="font-weight:700;font-size:0.85rem;color:${item.color};">${item.label}</div>
                                <div style="font-size:0.72rem;color:var(--text-secondary);">${item.desc}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:auto;padding-top:15px;border-top:1px solid rgba(255,255,255,0.1);">
                    <div style="font-size:0.8rem;color:var(--text-secondary);">${t('geo_sim.progress')}</div>
                    <div id="sim-score-display" style="font-size:1.5rem;font-weight:900;color:var(--gold-bright);font-family:'Orbitron',sans-serif;">0/${geoSimTotal}</div>
                </div>
            </div>

            <!-- Map Area with Drop Zones -->
            <div class="sim-map-area glass-card" style="
                position:relative;
                background: linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%);
                border:1px solid rgba(0,212,255,0.3);
                border-radius:20px;
                overflow:hidden;
            ">
                <!-- Decorative world map background -->
                <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.3;pointer-events:none;" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                    <image href="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" width="800" height="500" preserveAspectRatio="none" style="filter: invert(50%) sepia(100%) saturate(300%) hue-rotate(160deg) brightness(80%) contrast(120%); opacity: 0.5;"/>
                    
                    <!-- Grid lines -->
                    <defs>
                        <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d4ff" stroke-width="0.4"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mapgrid)" opacity="0.3"/>
                    <!-- Equator -->
                    <line x1="0" y1="250" x2="800" y2="250" stroke="#00d4ff" stroke-width="0.8" opacity="0.8"/>
                    <!-- Prime meridian -->
                    <line x1="400" y1="0" x2="400" y2="500" stroke="#00d4ff" stroke-width="0.8" opacity="0.8"/>
                    <!-- Tropics -->
                    <line x1="0" y1="195" x2="800" y2="195" stroke="#d4a843" stroke-width="0.5" stroke-dasharray="6,4" opacity="0.6"/>
                    <line x1="0" y1="305" x2="800" y2="305" stroke="#d4a843" stroke-width="0.5" stroke-dasharray="6,4" opacity="0.6"/>
                    
                    <!-- Labels -->
                    <text x="170" y="150" font-size="10" fill="#00d4ff" font-family="monospace" text-anchor="middle" opacity="0.8">N. AMERICA</text>
                    <text x="240" y="360" font-size="10" fill="#00d4ff" font-family="monospace" text-anchor="middle" opacity="0.8">S. AMERICA</text>
                    <text x="420" y="110" font-size="9" fill="#00d4ff" font-family="monospace" text-anchor="middle" opacity="0.8">EUROPE</text>
                    <text x="430" y="270" font-size="10" fill="#00d4ff" font-family="monospace" text-anchor="middle" opacity="0.8">AFRICA</text>
                    <text x="600" y="130" font-size="10" fill="#00d4ff" font-family="monospace" text-anchor="middle" opacity="0.8">ASIA</text>
                    <text x="690" y="380" font-size="9" fill="#00d4ff" font-family="monospace" text-anchor="middle" opacity="0.8">AUSTRALIA</text>
                </svg>

                <!-- Continent labels -->
                <div style="position:absolute;top:10px;left:15px;font-size:0.65rem;color:rgba(0,212,255,0.4);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:2px;">${t('worldmap.title')} ${t('worldmap.title_gradient')} — ${t('worldmap.legend_title')}</div>
                
                <!-- Drop Zones -->
                ${geoSimItems.map((item, i) => {
                    const positions = [
                        { top: '28%', left: '42%' },   // EU - Western Europe
                        { top: '22%', left: '58%' },   // NATO Eastern Flank
                        { top: '38%', left: '80%' },   // Korean DMZ
                        { top: '22%', left: '14%' },   // 49th Parallel
                        { top: '35%', left: '68%' }    // Belt & Road
                    ];
                    const pos = positions[i];
                    return `
                        <div 
                            class="geo-drop-zone"
                            id="drop-zone-${item.id}"
                            data-accepts="${item.id}"
                            style="
                                position:absolute;
                                top:${pos.top};
                                left:${pos.left};
                                width:120px;
                                min-height:60px;
                                border:2px dashed rgba(255,255,255,0.25);
                                border-radius:10px;
                                background: rgba(255,255,255,0.03);
                                display:flex;
                                flex-direction:column;
                                align-items:center;
                                justify-content:center;
                                padding:8px;
                                transition:all 0.3s;
                                cursor:crosshair;
                                transform:translate(-50%,-50%);
                            "
                        >
                            <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);text-align:center;font-family:'JetBrains Mono',monospace;line-height:1.4;">
                                📍 ${item.zone.label}
                            </div>
                            <div style="font-size:0.6rem;color:rgba(255,255,255,0.3);text-align:center;margin-top:3px;">${item.zone.hint}</div>
                        </div>
                    `;
                }).join('')}
                
                <div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-size:0.75rem;color:rgba(0,212,255,0.5);font-family:'JetBrains Mono',monospace;">
                    ${t('geo_sim.drag_bottom_hint')}
                </div>
            </div>
        </div>
    `;

    // Add drag listeners to items
    document.querySelectorAll('.geo-drag-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
            item.style.opacity = '0.4';
            item.style.transform = 'scale(0.95)';
        });
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        });
    });

    // Add drop listeners to zones
    document.querySelectorAll('.geo-drop-zone').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.background = 'rgba(0,212,255,0.15)';
            zone.style.borderColor = 'rgba(0,212,255,0.8)';
            zone.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)';
        });
        zone.addEventListener('dragleave', () => {
            const accepts = zone.getAttribute('data-accepts');
            if (!geoSimCompleted.has(accepts)) {
                zone.style.background = 'rgba(255,255,255,0.03)';
                zone.style.borderColor = 'rgba(255,255,255,0.25)';
                zone.style.boxShadow = 'none';
            }
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const accepts = zone.getAttribute('data-accepts');
            handleGeoSimDrop(draggedId, accepts, zone);
        });
    });
}

function handleGeoSimDrop(draggedId, zoneAccepts, zoneEl) {
    if (draggedId === zoneAccepts) {
        // Correct!
        if (geoSimCompleted.has(draggedId)) return;
        geoSimCompleted.add(draggedId);
        
        playSound('correct');
        geoSimScore++;
        
        const item = getGeoSimItems().find(i => i.id === draggedId);
        
        // Snap to zone - show success state
        zoneEl.style.background = `${item.color}33`;
        zoneEl.style.borderColor = item.color;
        zoneEl.style.borderStyle = 'solid';
        zoneEl.style.boxShadow = `0 0 25px ${item.color}66`;
        zoneEl.innerHTML = `
            <div style="font-size:1.5rem;">${item.emoji}</div>
            <div style="font-size:0.65rem;color:${item.color};font-weight:700;text-align:center;font-family:'JetBrains Mono',monospace;">${item.label}</div>
            <div style="font-size:0.9rem;color:var(--success);">✅</div>
        `;
        
        // Hide dragged item from sidebar
        const dragEl = document.getElementById(`drag-item-${draggedId}`);
        if (dragEl) {
            dragEl.style.opacity = '0.3';
            dragEl.style.pointerEvents = 'none';
            dragEl.style.borderStyle = 'solid';
            dragEl.innerHTML = `<span style="font-size:1.2rem;">✅</span><div style="font-size:0.8rem;color:var(--text-secondary);">${item.label} — ${t('geo_sim.placed')}</div>`;
        }
        
        // Update score
        gameData.coins += 10;
        updateGameStats();
        document.getElementById('sim-score-display').innerText = `${geoSimScore}/${geoSimTotal}`;
        
        showToast(`✅ ${item.label} ${t('geo_sim.success_placed')} +10 Coins`, "success");
        
        if (geoSimScore === geoSimTotal) {
            setTimeout(() => {
                showToast(t('geo_sim.success_perfect'), "success");
                gameData.coins += 25;
                updateGameStats();
            }, 800);
        }
    } else {
        // Wrong drop
        playSound('wrong');
        zoneEl.style.background = 'rgba(255,68,102,0.15)';
        zoneEl.style.borderColor = '#ff4466';
        setTimeout(() => {
            zoneEl.style.background = 'rgba(255,255,255,0.03)';
            zoneEl.style.borderColor = 'rgba(255,255,255,0.25)';
            zoneEl.style.boxShadow = 'none';
        }, 600);
        showToast(t('geo_sim.error_wrong'), "error");
    }
}

// --- GAME 3: REGIME GUESSER ---
const regimeQuestions = [
    { name: "United Kingdom", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000", type: "Monarchy" },
    { name: "France", img: "https://images.unsplash.com/photo-1502602898657-3e907fa0a586?q=80&w=1000", type: "Republic" },
    { name: "Saudi Arabia", img: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?q=80&w=1000", type: "Monarchy" },
    { name: "United States", img: "https://images.unsplash.com/photo-1596422846543-7dc3baab0706?q=80&w=1000", type: "Republic" },
    { name: "Japan", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000", type: "Monarchy" },
    { name: "Germany", img: "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=1000", type: "Republic" },
    { name: "Spain", img: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1000", type: "Monarchy" },
    { name: "Italy", img: "https://images.unsplash.com/photo-1516483638261-f40af5edca57?q=80&w=1000", type: "Republic" },
];

let regimeIndex = 0;

function initRegimeGuesser() {
    regimeIndex = 0;
    renderRegimeQuestion();
}

function renderRegimeQuestion() {
    if (regimeIndex >= regimeQuestions.length) {
        showToast("Game Complete! Great job.", "success");
        setTimeout(endGame, 2000);
        return;
    }
    
    const container = document.getElementById('game-container');
    const q = regimeQuestions[regimeIndex];
    
    container.innerHTML = `
        <div class="regime-game" style="display:flex;flex-direction:column;align-items:center;padding:20px;gap:20px;">
            <h2 style="font-family:'Orbitron',sans-serif;color:var(--neon-blue);margin:0;">${q.name}</h2>
            <div style="font-size:0.9rem;color:var(--text-secondary); margin-top:-10px;">Is this state a Monarchy or a Republic?</div>
            
            <div id="regime-image-container" style="position:relative;width:100%;max-width:600px;aspect-ratio:16/9;border-radius:20px;overflow:hidden;box-shadow:0 0 30px rgba(0,212,255,0.2);border:2px solid rgba(0,212,255,0.3);transition:all 0.5s ease;">
                <img src="${q.img}" style="width:100%;height:100%;object-fit:cover;" />
                <div id="regime-stamp" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%) scale(5);opacity:0;font-size:5rem;font-weight:900;letter-spacing:4px;text-transform:uppercase;font-family:'Orbitron',sans-serif;transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);text-shadow:0 0 20px black, 0 0 40px black;pointer-events:none;"></div>
            </div>
            
            <div style="display:flex;gap:20px;width:100%;max-width:500px;margin-top:20px;">
                <button class="btn btn-primary" onclick="guessRegime('Monarchy')" style="flex:1;font-size:1.2rem;padding:15px;background:linear-gradient(135deg, #8b44cc, #6a2c9e);border-color:#8b44cc;">👑 Monarchy</button>
                <button class="btn btn-primary" onclick="guessRegime('Republic')" style="flex:1;font-size:1.2rem;padding:15px;background:linear-gradient(135deg, #2eaa6e, #1a7a4a);border-color:#2eaa6e;">🏛️ Republic</button>
            </div>
            <div style="font-size:1rem;color:var(--gold-bright);margin-top:10px;">Progress: ${regimeIndex + 1}/${regimeQuestions.length}</div>
        </div>
    `;
}

window.guessRegime = function(guess) {
    const q = regimeQuestions[regimeIndex];
    const stamp = document.getElementById('regime-stamp');
    const imgContainer = document.getElementById('regime-image-container');
    
    // Disable buttons to prevent double clicks
    const btns = imgContainer.parentElement.querySelectorAll('button');
    btns.forEach(b => b.disabled = true);
    
    if (guess === q.type) {
        playSound('correct');
        stamp.innerText = "CORRECT";
        stamp.style.color = "#00e676";
        stamp.style.transform = "translate(-50%, -50%) scale(1) rotate(-15deg)";
        stamp.style.opacity = "1";
        imgContainer.style.borderColor = "#00e676";
        imgContainer.style.boxShadow = "0 0 40px rgba(0, 230, 118, 0.5)";
        gameData.score += 10;
        gameData.coins += 5;
        updateGameStats();
    } else {
        playSound('wrong');
        stamp.innerText = "WRONG";
        stamp.style.color = "#ff4466";
        stamp.style.transform = "translate(-50%, -50%) scale(1) rotate(15deg)";
        stamp.style.opacity = "1";
        imgContainer.style.borderColor = "#ff4466";
        imgContainer.style.boxShadow = "0 0 40px rgba(255, 68, 102, 0.5)";
        // shake animation
        imgContainer.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ], { duration: 400, iterations: 1 });
    }
    
    setTimeout(() => {
        regimeIndex++;
        renderRegimeQuestion();
    }, 1500);
}


// --- UTILS ---
function updateGameStats() {
    const xpEl = document.getElementById('game-xp-count');
    const coinEl = document.getElementById('game-coin-count');
    if (xpEl) xpEl.innerText = gameData.score;
    if (coinEl) coinEl.innerText = gameData.coins;
    document.dispatchEvent(new CustomEvent('coinsGained', { detail: { amount: gameData.coins } }));
}

export function startGame(gameId) {
    currentGame = gameId;
    gameData = { score: 0, coins: 0 };
    
    const selection = document.getElementById('games-selection');
    const view = document.getElementById('game-view');
    
    selection.classList.add('hidden');
    view.classList.remove('hidden');

    if (gameId === 'map-quiz') initMapQuiz();
    if (gameId === 'geo-simulator') initGeoSimulator();
    if (gameId === 'regime-guesser') initRegimeGuesser();
    if (gameId === 'timeline-challenge') initTimelineChallenge();
    if (gameId === 'city-guesser') initCityGuesser();
    if (gameId === 'shape-guesser') initShapeGuesser();
    if (gameId === 'seterra-europe') initSeterra('europe', gameData, updateGameStats);
    if (gameId === 'seterra-africa') initSeterra('africa', gameData, updateGameStats);
    if (gameId === 'seterra-americas') initSeterra('americas', gameData, updateGameStats);
    if (gameId === 'seterra-asia') initSeterra('asia', gameData, updateGameStats);
    if (gameId === 'seterra-world') initSeterra('world', gameData, updateGameStats);
}

export function endGame() {
    if (mapInstance) { mapInstance.remove(); mapInstance = null; }
    if (timelineTimer) { clearInterval(timelineTimer); timelineTimer = null; }
    cleanupSeterra();
    document.getElementById('game-view').classList.add('hidden');
    document.getElementById('games-selection').classList.remove('hidden');
    currentGame = null;
}

// --- GAME 4: TIMELINE CHALLENGE ---
let timelineTimer = null;
let timeLeft = 60;

function initTimelineChallenge() {
    const container = document.getElementById('game-container');
    const hasChronos = JSON.parse(localStorage.getItem('inventory') || '[]').includes('Chronos Protocol');
    timeLeft = hasChronos ? 70 : 60;
    
    const events = [
        { id: '1', year: 1648, text: t('games_content.timeline.westphalia') || "Peace of Westphalia" },
        { id: '2', year: 1884, text: t('games_content.timeline.berlin') || "Berlin Conference" },
        { id: '3', year: 1945, text: t('games_content.timeline.un') || "UN Founded" },
        { id: '4', year: 1991, text: t('games_content.timeline.ussr') || "Fall of USSR" },
        { id: '5', year: 2020, text: t('games_content.timeline.brexit') || "Brexit" }
    ];
    
    // Shuffle events
    const shuffled = [...events].sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <div class="timeline-game" style="max-width:600px;margin:0 auto;padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h2 style="font-family:'Orbitron',sans-serif;color:var(--neon-blue);margin:0;">Timeline Challenge</h2>
                <div style="font-size:1.5rem;font-weight:bold;color:var(--gold-bright);font-family:'JetBrains Mono',monospace;">⏱️ <span id="timeline-timer">${timeLeft}</span>s</div>
            </div>
            <p style="color:var(--text-secondary);margin-bottom:20px;font-size:0.9rem;">${t('games.timeline_chal_desc')}</p>
            <div id="timeline-sortable" style="display:flex;flex-direction:column;gap:10px;">
                ${shuffled.map(ev => `
                    <div class="timeline-item-sort glass-card" data-year="${ev.year}" style="padding:15px;cursor:grab;display:flex;align-items:center;gap:15px;border:1px solid rgba(0,212,255,0.2);">
                        <span style="font-size:1.5rem;color:var(--neon-blue);">☰</span>
                        <div style="font-weight:bold;font-size:1.1rem;">${ev.text}</div>
                    </div>
                `).join('')}
            </div>
            <button id="check-timeline-btn" class="btn btn-primary" style="width:100%;margin-top:20px;padding:15px;font-size:1.1rem;">${t('games.check_order') || 'Check Order'}</button>
        </div>
    `;
    
    const sortableEl = document.getElementById('timeline-sortable');
    if (window.Sortable) {
        new Sortable(sortableEl, {
            animation: 150,
            ghostClass: 'sortable-ghost'
        });
    }
    
    timelineTimer = setInterval(() => {
        timeLeft--;
        const timerEl = document.getElementById('timeline-timer');
        if (timerEl) timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timelineTimer);
            playSound('wrong');
            showToast(t('games.time_up') || "Time's up!", "error");
            document.getElementById('check-timeline-btn').disabled = true;
        }
    }, 1000);
    
    document.getElementById('check-timeline-btn').addEventListener('click', () => {
        const items = document.querySelectorAll('.timeline-item-sort');
        let correct = true;
        let prevYear = 0;
        
        items.forEach((item, index) => {
            const year = parseInt(item.getAttribute('data-year'));
            if (year < prevYear) {
                correct = false;
                item.style.borderColor = '#ff4466';
                item.style.background = 'rgba(255,68,102,0.1)';
            } else {
                item.style.borderColor = '#00e676';
                item.style.background = 'rgba(0,230,118,0.1)';
            }
            prevYear = year;
        });
        
        if (correct) {
            clearInterval(timelineTimer);
            playSound('correct');
            document.getElementById('check-timeline-btn').innerText = "✅ Perfect!";
            document.getElementById('check-timeline-btn').disabled = true;
            gameData.coins += 20;
            gameData.score += 50;
            updateGameStats();
            showToast("Timeline sorted correctly! +20 Coins", "success");
        } else {
            playSound('wrong');
            showToast("Incorrect order. Try again!", "error");
        }
    });
}

// --- GAME 5: CITY GUESSER ---
const cityGuesserData = [
    { name: "Paris", img: "https://images.unsplash.com/photo-1502602898657-3e907fa0a586?q=80&w=1000", options: ["London", "Paris", "Berlin", "Madrid"] },
    { name: "New York", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000", options: ["Chicago", "Toronto", "New York", "Los Angeles"] },
    { name: "Tokyo", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000", options: ["Seoul", "Beijing", "Tokyo", "Osaka"] },
    { name: "Dubai", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000", options: ["Doha", "Dubai", "Riyadh", "Abu Dhabi"] },
    { name: "Sydney", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000", options: ["Melbourne", "Auckland", "Brisbane", "Sydney"] }
];

let cityGuesserIndex = 0;
let shuffledCities = [];

function initCityGuesser() {
    shuffledCities = [...cityGuesserData].sort(() => Math.random() - 0.5);
    cityGuesserIndex = 0;
    renderCityGuesser();
}

function renderCityGuesser() {
    if (cityGuesserIndex >= shuffledCities.length) {
        showToast("City Guesser Complete! Great job.", "success");
        setTimeout(endGame, 2000);
        return;
    }
    
    const container = document.getElementById('game-container');
    const q = shuffledCities[cityGuesserIndex];
    
    // Shuffle options
    const options = [...q.options].sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <div class="city-guesser-game" style="display:flex;flex-direction:column;align-items:center;padding:20px;gap:20px;">
            <h2 style="font-family:'Orbitron',sans-serif;color:var(--success);margin:0;">Identify the City</h2>
            <div style="font-size:0.9rem;color:var(--text-secondary); margin-top:-10px;">Look at the aerial view and select the correct city.</div>
            
            <div id="city-image-container" style="position:relative;width:100%;max-width:600px;aspect-ratio:16/9;border-radius:20px;overflow:hidden;box-shadow:0 0 30px rgba(0,230,118,0.2);border:2px solid rgba(0,230,118,0.3);transition:all 0.5s ease;">
                <img src="${q.img}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;width:100%;max-width:500px;margin-top:20px;">
                ${options.map(opt => `
                    <button class="btn btn-outline city-btn" onclick="guessCity('${opt}', '${q.name}')" style="font-size:1.1rem;padding:12px;border-color:var(--success);color:white;">${opt}</button>
                `).join('')}
            </div>
            <div style="font-size:1rem;color:var(--gold-bright);margin-top:10px;">Progress: ${cityGuesserIndex + 1}/${shuffledCities.length}</div>
        </div>
    `;
}

window.guessCity = function(guess, correct) {
    const btns = document.querySelectorAll('.city-btn');
    btns.forEach(b => b.disabled = true);
    
    const imgContainer = document.getElementById('city-image-container');
    
    if (guess === correct) {
        playSound('correct');
        imgContainer.style.borderColor = "#00e676";
        imgContainer.style.boxShadow = "0 0 40px rgba(0, 230, 118, 0.5)";
        gameData.score += 15;
        gameData.coins += 10;
        updateGameStats();
        showToast("Correct!", "success");
    } else {
        playSound('wrong');
        imgContainer.style.borderColor = "#ff4466";
        imgContainer.style.boxShadow = "0 0 40px rgba(255, 68, 102, 0.5)";
        showToast(`Wrong! It was ${correct}`, "error");
    }
    
    setTimeout(() => {
        cityGuesserIndex++;
        renderCityGuesser();
    }, 1500);
}

// --- GAME 6: SHAPE GUESSER ---
const shapeGuesserData = [
    { name: "Italy", shape: "M 30,10 L 40,20 L 50,40 L 60,60 L 70,80 L 60,90 L 50,80 L 40,70 L 30,50 Z", options: ["Italy", "Greece", "Spain", "France"] },
    { name: "Japan", shape: "M 80,10 L 70,30 L 60,50 L 50,70 L 40,90 L 30,80 L 40,60 L 50,40 Z", options: ["Japan", "Philippines", "New Zealand", "Madagascar"] },
    { name: "Chile", shape: "M 40,10 L 50,10 L 50,90 L 40,90 Z", options: ["Chile", "Argentina", "Peru", "Norway"] },
    { name: "Australia", shape: "M 20,20 L 80,20 L 90,50 L 70,80 L 30,80 L 10,50 Z", options: ["Australia", "Brazil", "India", "USA"] }
];

let shapeGuesserIndex = 0;
let shuffledShapes = [];

function initShapeGuesser() {
    shuffledShapes = [...shapeGuesserData].sort(() => Math.random() - 0.5);
    shapeGuesserIndex = 0;
    renderShapeGuesser();
}

function renderShapeGuesser() {
    if (shapeGuesserIndex >= shuffledShapes.length) {
        showToast("Shape Guesser Complete! Great job.", "success");
        setTimeout(endGame, 2000);
        return;
    }
    
    const container = document.getElementById('game-container');
    const q = shuffledShapes[shapeGuesserIndex];
    
    // Shuffle options
    const options = [...q.options].sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <div class="shape-guesser-game" style="display:flex;flex-direction:column;align-items:center;padding:20px;gap:20px;">
            <h2 style="font-family:'Orbitron',sans-serif;color:var(--neon-purple);margin:0;">Guess the Shape</h2>
            <div style="font-size:0.9rem;color:var(--text-secondary); margin-top:-10px;">Which country has this silhouette?</div>
            
            <div id="shape-container" style="position:relative;width:100%;max-width:300px;aspect-ratio:1/1;border-radius:20px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.2);box-shadow:0 0 30px rgba(139,68,204,0.2);border:2px solid rgba(139,68,204,0.3);transition:all 0.5s ease;">
                <svg viewBox="0 0 100 100" style="width:70%;height:70%;filter:drop-shadow(0 0 10px rgba(139,68,204,0.8));">
                    <path d="${q.shape}" fill="var(--neon-purple)" stroke="white" stroke-width="1"/>
                </svg>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;width:100%;max-width:500px;margin-top:20px;">
                ${options.map(opt => `
                    <button class="btn btn-outline shape-btn" onclick="guessShape('${opt}', '${q.name}')" style="font-size:1.1rem;padding:12px;border-color:var(--neon-purple);color:white;">${opt}</button>
                `).join('')}
            </div>
            <div style="font-size:1rem;color:var(--gold-bright);margin-top:10px;">Progress: ${shapeGuesserIndex + 1}/${shuffledShapes.length}</div>
        </div>
    `;
}

window.guessShape = function(guess, correct) {
    const btns = document.querySelectorAll('.shape-btn');
    btns.forEach(b => b.disabled = true);
    
    const container = document.getElementById('shape-container');
    
    if (guess === correct) {
        playSound('correct');
        container.style.borderColor = "#00e676";
        container.style.boxShadow = "0 0 40px rgba(0, 230, 118, 0.5)";
        gameData.score += 20;
        gameData.coins += 15;
        updateGameStats();
        showToast("Correct!", "success");
    } else {
        playSound('wrong');
        container.style.borderColor = "#ff4466";
        container.style.boxShadow = "0 0 40px rgba(255, 68, 102, 0.5)";
        showToast(`Wrong! It was ${correct}`, "error");
    }
    
    setTimeout(() => {
        shapeGuesserIndex++;
        renderShapeGuesser();
    }, 1500);
}
