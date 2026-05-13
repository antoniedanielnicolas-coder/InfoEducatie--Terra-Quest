// =====================================================
// TerraQuest — Historical World Map Module (Leaflet)
// =====================================================

const historicalEras = [
    {
        year: 1914,
        label: '1914 — Eve of WWI',
        color: '#e05c3a',
        description: `<strong style="color:#e05c3a;">1914 — Eve of World War I</strong><br>
        Europe is divided into two armed alliance blocs: the Triple Entente (France, Russia, UK) vs the Triple Alliance (Germany, Austria-Hungary, Italy).
        The Austro-Hungarian and Ottoman empires are crumbling. The entire African continent has been partitioned by European colonial powers at the Berlin Conference (1884).`,
        geojson: 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1914.geojson',
        events: [
            { icon: '🏭', title: 'Industrial Powers', desc: 'Germany overtakes Britain in industrial production' },
            { icon: '🌍', title: 'Scramble for Africa', desc: '90% of Africa under European colonial control' },
            { icon: '💣', title: 'Arms Race', desc: 'Naval buildup between UK and Germany intensifies' },
            { icon: '🤝', title: 'Alliance System', desc: 'Europe split into two armed, rigid treaty blocs' }
        ]
    },
    {
        year: 1938,
        label: '1938 — Pre WW2',
        color: '#d4a843',
        description: `<strong style="color:#d4a843;">1938 — Eve of World War II</strong><br>
        Tensions rise dramatically globally. Germany has annexed Austria and the Sudetenland. 
        Japan's invasion of China expands the conflict in Asia. The League of Nations proves ineffective at preventing aggression.`,
        geojson: 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1938.geojson',
        events: [
            { icon: '⚔️', title: 'Axis Expansion', desc: 'Aggressive territorial claims by Germany, Italy, and Japan' },
            { icon: '🛡️', title: 'Appeasement', desc: 'Western powers attempt to avoid war through concessions' },
            { icon: '🕊️', title: 'League of Nations Fails', desc: 'International diplomatic framework collapses' }
        ]
    },
    {
        year: 1945,
        label: '1945 — Post WW2',
        color: '#cc3355',
        description: `<strong style="color:#cc3355;">1945 — Post World War II</strong><br>
        The world is reshaped by WW2's aftermath. The United States and Soviet Union emerge as superpowers. 
        Europe is divided by the "Iron Curtain". The United Nations is founded with 51 original members. 
        Decolonization begins — but most of Africa and Asia remain under European rule.`,
        geojson: 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1945.geojson',
        events: [
            { icon: '🇺🇳', title: 'United Nations', desc: 'Founded in 1945 with 51 member states' },
            { icon: '✂️', title: 'Iron Curtain', desc: 'Europe divided between capitalism and communism' },
            { icon: '💣', title: 'Nuclear Age', desc: 'USA and USSR enter the nuclear arms race' },
            { icon: '🕊️', title: 'Decolonization Begins', desc: 'India, Pakistan gain independence shortly after' }
        ]
    },
    {
        year: 1994,
        label: '1994 — Post Cold War',
        color: '#2eaa6e',
        description: `<strong style="color:#2eaa6e;">1994 — Post Cold War</strong><br>
        The Soviet Union has dissolved into 15 independent states. Germany is reunified. 
        Eastern European nations transition to democracy. Apartheid ends in South Africa.
        The USA stands as the world's sole superpower in a "unipolar moment".`,
        geojson: 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1994.geojson',
        events: [
            { icon: '🏳️', title: 'USSR Dissolves', desc: '15 new sovereign states emerged recently' },
            { icon: '🇩🇪', title: 'German Reunification', desc: 'East and West Germany reunified' },
            { icon: '🗳️', title: 'Democracy Wave', desc: 'Eastern Europe shifts to market economy' }
        ]
    },
    {
        year: 2026,
        label: '2026 — Present',
        color: '#00d4ff',
        description: `<strong style="color:#00d4ff;">2026 — The Multipolar World</strong><br>
        The unipolar US dominance has given way to a multipolar world order. China is an economic powerhouse. 
        Conflicts like the invasion of Ukraine reshape European security. BRICS expands. 
        Climate change and technological races are defining geopolitical challenges.`,
        geojson: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
        events: [
            { icon: '🇨🇳', title: 'Rise of China', desc: "Global economic and technological competition intensifies" },
            { icon: '⚔️', title: 'Global Conflicts', desc: "Ongoing conflicts reshape regional security borders" },
            { icon: '🌡️', title: 'Climate Geopolitics', desc: 'Arctic resources and sea routes become contested' },
            { icon: '🤝', title: 'BRICS Expansion', desc: 'New members join to balance Western financial influence' }
        ]
    }
];

let currentEra = 0;
let historicalMap = null;
let geojsonLayer = null;

window.switchMapTab = function(tab) {
    const currentTab = document.getElementById('worldmap-tab-current');
    const historicTab = document.getElementById('worldmap-tab-historic');
    const btnCurrent = document.getElementById('tab-current-map');
    const btnHistoric = document.getElementById('tab-historic-map');

    if (tab === 'current') {
        currentTab.style.display = 'block';
        historicTab.style.display = 'none';
        btnCurrent.style.background = 'var(--blue-gradient)';
        btnCurrent.style.color = '#0a0e17';
        btnHistoric.style.background = 'transparent';
        btnHistoric.style.color = 'var(--text-secondary)';
    } else {
        currentTab.style.display = 'none';
        historicTab.style.display = 'block';
        btnHistoric.style.background = 'linear-gradient(135deg,#d4a843,#a17e2e)';
        btnHistoric.style.color = '#0a0e17';
        btnCurrent.style.background = 'transparent';
        btnCurrent.style.color = 'var(--text-secondary)';
        
        // Render current era map when tab is opened
        if (!historicalMap) {
            initHistoricalMap();
        } else {
            historicalMap.invalidateSize();
        }
        showHistoricalEra(currentEra);
    }
};

function initHistoricalMap() {
    historicalMap = L.map('historical-map-leaflet', {
        zoomControl: true,
        attributionControl: false,
        minZoom: 2,
        maxZoom: 6
    }).setView([20, 0], 2);

    // Simple dark base tiles (physical or basic borders)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(historicalMap);
}

window.showHistoricalEra = function(eraIndex) {
    currentEra = eraIndex;
    const era = historicalEras[eraIndex];

    // Build buttons if not exist
    const btnContainer = document.getElementById('era-buttons');
    if (btnContainer.children.length === 0) {
        btnContainer.innerHTML = historicalEras.map((e, i) => `
            <button onclick="showHistoricalEra(${i})" class="era-btn ${i === eraIndex ? 'era-btn-active' : ''}" 
                style="padding:8px 16px;border-radius:8px;font-family:'JetBrains Mono',monospace;font-size:0.75rem;cursor:pointer;transition:all 0.2s;
                border:1px solid ${i === eraIndex ? e.color : 'rgba(255,255,255,0.2)'};
                background:${i === eraIndex ? e.color+'30' : 'transparent'};
                color:${i === eraIndex ? e.color : 'var(--text-secondary)'};">
                ${e.label}
            </button>
        `).join('');
    } else {
        // Update styling
        Array.from(btnContainer.children).forEach((btn, i) => {
            const e = historicalEras[i];
            if (i === eraIndex) {
                btn.style.border = `1px solid ${e.color}`;
                btn.style.background = `${e.color}30`;
                btn.style.color = e.color;
            } else {
                btn.style.border = '1px solid rgba(255,255,255,0.2)';
                btn.style.background = 'transparent';
                btn.style.color = 'var(--text-secondary)';
            }
        });
    }

    // Update description
    const descEl = document.getElementById('era-description');
    if (descEl) {
        descEl.style.borderLeftColor = era.color;
        descEl.innerHTML = era.description;
    }

    // Load GeoJSON for this era
    loadEraGeoJSON(era);

    // Render event cards
    const eventsEl = document.getElementById('era-events');
    if (eventsEl) {
        eventsEl.innerHTML = era.events.map(ev => `
            <div style="background:rgba(${hexToRgb(era.color)},0.06);border:1px solid ${era.color}44;border-radius:10px;padding:14px;display:flex;gap:12px;align-items:flex-start;">
                <div style="font-size:1.5rem;">${ev.icon}</div>
                <div>
                    <div style="font-weight:700;font-size:0.85rem;color:${era.color};margin-bottom:4px;">${ev.title}</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary);line-height:1.4;">${ev.desc}</div>
                </div>
            </div>
        `).join('');
    }
};

async function loadEraGeoJSON(era) {
    if (!historicalMap) return;

    // Show loading state (could add a spinner in production)
    
    try {
        const response = await fetch(era.geojson);
        const data = await response.json();

        // Remove old layer
        if (geojsonLayer) {
            historicalMap.removeLayer(geojsonLayer);
        }

        // Add new GeoJSON layer
        geojsonLayer = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: era.color, // Border color
                    weight: 1.5,
                    opacity: 0.8,
                    fillColor: era.color,
                    fillOpacity: 0.1
                };
            },
            onEachFeature: function (feature, layer) {
                // Determine country name depending on properties in GeoJSON
                const name = feature.properties.NAME || feature.properties.name || feature.properties.ADMIN || "Unknown Territory";
                layer.bindTooltip(name, {
                    className: 'geo-popup',
                    direction: 'auto'
                });
            }
        }).addTo(historicalMap);
        
    } catch (error) {
        console.error("Failed to load historical GeoJSON:", error);
        // Fallback or error message could be shown to the user here
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '0,212,255';
}

// Map will be auto-initialized when tab is switched.
