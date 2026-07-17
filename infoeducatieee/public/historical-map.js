const historicalEras = [
    {
        year: 1914,
        color: '#e05c3a',
        geojson: 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1914.geojson',
        label: {
            ro: '1914 — Ajunul WWI',
            en: '1914 — Eve of WWI'
        },
        description: {
            ro: `<strong style="color:#e05c3a;">1914 — Ajunul Primului Război Mondial</strong><br>
            Europa este divizată în două blocuri de alianțe înarmate: Tripla Înțelegere (Franța, Rusia, Marea Britanie) contra Tripla Alianță (Germania, Austro-Ungaria, Italia).
            Imperiile Austro-Ungar și Otoman se prăbușesc. Întregul continent african a fost împărțit de puterile coloniale europene la Conferința de la Berlin (1884).`,
            en: `<strong style="color:#e05c3a;">1914 — Eve of World War I</strong><br>
            Europe is divided into two armed alliance blocs: the Triple Entente (France, Russia, UK) vs the Triple Alliance (Germany, Austria-Hungary, Italy).
            The Austro-Hungarian and Ottoman empires are crumbling. The entire African continent has been partitioned by European colonial powers at the Berlin Conference (1884).`
        },
        events: {
            ro: [
                { icon: '🏭', title: 'Puterile Industriale', desc: 'Germania depășește Marea Britanie în producția industrială' },
                { icon: '🌍', title: 'Lupta pentru Africa', desc: '90% din Africa se află sub control colonial european' },
                { icon: '💣', title: 'Cursa Înarmării', desc: 'Construcția navală dintre Marea Britanie și Germania se intensifică' },
                { icon: '🤝', title: 'Sistemul de Alianțe', desc: 'Europa este împărțită în două blocuri rigide de tratate' }
            ],
            en: [
                { icon: '🏭', title: 'Industrial Powers', desc: 'Germany overtakes Britain in industrial production' },
                { icon: '🌍', title: 'Scramble for Africa', desc: '90% of Africa under European colonial control' },
                { icon: '💣', title: 'Arms Race', desc: 'Naval buildup between UK and Germany intensifies' },
                { icon: '🤝', title: 'Alliance System', desc: 'Europe split into two armed, rigid treaty blocs' }
            ]
        }
    },
    {
        year: 1938,
        color: '#d4a843',
        geojson: 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1938.geojson',
        label: {
            ro: '1938 — Pre WW2',
            en: '1938 — Pre WW2'
        },
        description: {
            ro: `<strong style="color:#d4a843;">1938 — Ajunul Celui de-al Doilea Război Mondial</strong><br>
            Tensiunile globale cresc dramatic. Germania a anexat Austria și Regiunea Sudetă.
            Invazia Japoniei în China extinde conflictul în Asia. Liga Națiunilor se dovedește ineficientă în prevenirea agresiunii.`,
            en: `<strong style="color:#d4a843;">1938 — Eve of World War II</strong><br>
            Tensions rise dramatically globally. Germany has annexed Austria and the Sudetenland.
            Japan's invasion of China expands the conflict in Asia. The League of Nations proves ineffective at preventing aggression.`
        },
        events: {
            ro: [
                { icon: '⚔️', title: 'Expansiunea Axei', desc: 'Pretenții teritoriale agresive ale Germaniei, Italiei și Japoniei' },
                { icon: '🛡️', title: 'Politica de Conciliere', desc: 'Puterile occidentale încearcă să evite războiul prin concesii' },
                { icon: '🕊️', title: 'Liga Națiunilor Eșuează', desc: 'Cadrul diplomatic internațional se prăbușește' }
            ],
            en: [
                { icon: '⚔️', title: 'Axis Expansion', desc: 'Aggressive territorial claims by Germany, Italy, and Japan' },
                { icon: '🛡️', title: 'Appeasement', desc: 'Western powers attempt to avoid war through concessions' },
                { icon: '🕊️', title: 'League of Nations Fails', desc: 'International diplomatic framework collapses' }
            ]
        }
    },
    {
        year: 1945,
        color: '#cc3355',
        geojson: 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1945.geojson',
        label: {
            ro: '1945 — Post WW2',
            en: '1945 — Post WW2'
        },
        description: {
            ro: `<strong style="color:#cc3355;">1945 — După Al Doilea Război Mondial</strong><br>
            Lumea este remodelată în urma războiului. Statele Unite și Uniunea Sovietică devin superputeri.
            Europa este divizată de "Cortina de Fier". Organizația Națiunilor Unite este fondată cu 51 de membri.
            Începe decolonizarea, dar majoritatea Africii și Asiei rămân sub dominație europeană.`,
            en: `<strong style="color:#cc3355;">1945 — Post World War II</strong><br>
            The world is reshaped by WW2's aftermath. The United States and Soviet Union emerge as superpowers.
            Europe is divided by the "Iron Curtain". The United Nations is founded with 51 original members.
            Decolonization begins — but most of Africa and Asia remain under European rule.`
        },
        events: {
            ro: [
                { icon: '🇺🇳', title: 'Națiunile Unite', desc: 'Fondată în 1945 cu 51 de state membre fondatoare' },
                { icon: '✂️', title: 'Cortina de Fier', desc: 'Europa divizată între capitalism și comunism' },
                { icon: '💣', title: 'Era Nucleară', desc: 'SUA și URSS încep cursa înarmării nucleare' },
                { icon: '🕊️', title: 'Începutul Decolonizării', desc: 'India și Pakistan își câștigă independența la scurt timp după' }
            ],
            en: [
                { icon: '🇺🇳', title: 'United Nations', desc: 'Founded in 1945 with 51 member states' },
                { icon: '✂️', title: 'Iron Curtain', desc: 'Europe divided between capitalism and communism' },
                { icon: '💣', title: 'Nuclear Age', desc: 'USA and USSR enter the nuclear arms race' },
                { icon: '🕊️', title: 'Decolonization Begins', desc: 'India, Pakistan gain independence shortly after' }
            ]
        }
    },
    {
        year: 1994,
        color: '#2eaa6e',
        geojson: 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1994.geojson',
        label: {
            ro: '1994 — Post Războiul Rece',
            en: '1994 — Post Cold War'
        },
        description: {
            ro: `<strong style="color:#2eaa6e;">1994 — Post Războiul Rece</strong><br>
            Uniunea Sovietică s-a dizolvat în 15 state independente. Germania este reunificată.
            Națiunile din Europa de Est fac tranziția către democrație. Apartheid-ul se încheie în Africa de Sud.
            SUA rămâne singura superputere mondială într-un "moment unipolar".`,
            en: `<strong style="color:#2eaa6e;">1994 — Post Cold War</strong><br>
            The Soviet Union has dissolved into 15 independent states. Germany is reunified.
            Eastern European nations transition to democracy. Apartheid ends in South Africa.
            The USA stands as the world's sole superpower in a "unipolar moment".`
        },
        events: {
            ro: [
                { icon: '🏳️', title: 'Dizolvarea URSS', desc: '15 noi state suverane au apărut pe hartă' },
                { icon: '🇩🇪', title: 'Reunificarea Germaniei', desc: 'Germania de Est și de Vest s-au reunificat' },
                { icon: '🗳️', title: 'Valul Democratic', desc: 'Europa de Est trece la democrație și economia de piață' }
            ],
            en: [
                { icon: '🏳️', title: 'USSR Dissolves', desc: '15 new sovereign states emerged recently' },
                { icon: '🇩🇪', title: 'German Reunification', desc: 'East and West Germany reunified' },
                { icon: '🗳️', title: 'Democracy Wave', desc: 'Eastern Europe shifts to market economy' }
            ]
        }
    },
    {
        year: 2026,
        color: '#00d4ff',
        geojson: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
        label: {
            ro: '2026 — Prezent',
            en: '2026 — Present'
        },
        description: {
            ro: `<strong style="color:#00d4ff;">2026 — Lumea Multipolară</strong><br>
            Dominanța unipolară a SUA a lăsat loc unei ordini mondiale multipolare. China este o superputere economică.
            Conflictele precum invazia Ucrainei remodelează securitatea europeană. BRICS se extinde.
            Schimbările climatice și cursele tehnologice definesc provocările geopolitice.`,
            en: `<strong style="color:#00d4ff;">2026 — The Multipolar World</strong><br>
            The unipolar US dominance has given way to a multipolar world order. China is an economic powerhouse.
            Conflicts like the invasion of Ukraine reshape European security. BRICS expands.
            Climate change and technological races are defining geopolitical challenges.`
        },
        events: {
            ro: [
                { icon: '🇨🇳', title: 'Ascensiunea Chinei', desc: 'Competiția economică și tehnologică globală se intensifică' },
                { icon: '⚔️', title: 'Conflicte Globale', desc: 'Conflictele în desfășurare remodelează granițele de securitate' },
                { icon: '🌡️', title: 'Geopolitica Climatică', desc: 'Resursele și rutele din Arctica devin disputate' },
                { icon: '🤝', title: 'Extinderea BRICS', desc: 'Noi membri se alătură pentru a echilibra influența financiară a Occidentului' }
            ],
            en: [
                { icon: '🇨🇳', title: 'Rise of China', desc: "Global economic and technological competition intensifies" },
                { icon: '⚔️', title: 'Global Conflicts', desc: "Ongoing conflicts reshape regional security borders" },
                { icon: '🌡️', title: 'Climate Geopolitics', desc: 'Arctic resources and sea routes become contested' },
                { icon: '🤝', title: 'BRICS Expansion', desc: 'New members join to balance Western financial influence' }
            ]
        }
    }
];

let currentEra = 0;
let historicalMap = null;
let geojsonLayer = null;
let historicalMapInitialized = false;

function getActiveLang() {
    return localStorage.getItem('appLang') === 'ro' ? 'ro' : 'en';
}

export function initHistoryMap() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.dataset.page !== 'historymap') {
                historicalMapInitialized = false;
            }
        });
    });

    const historymapLink = document.querySelector('[data-page="historymap"]');
    if (historymapLink) {
        historymapLink.addEventListener('click', () => {
            setTimeout(renderHistoryMap, 200);
        });
    }
}

window.renderHistoryMap = renderHistoryMap;

function renderHistoryMap() {
    const container = document.getElementById('historical-map-leaflet');
    if (!container || historicalMapInitialized) return;
    historicalMapInitialized = true;

    if (historicalMap) {
        historicalMap.remove();
    }

    historicalMap = L.map('historical-map-leaflet', {
        zoomControl: true,
        attributionControl: false,
        minZoom: 2,
        maxZoom: 6
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(historicalMap);

    showHistoricalEra(currentEra);
}

window.showHistoricalEra = function(eraIndex) {
    currentEra = eraIndex;
    const era = historicalEras[eraIndex];
    const lang = getActiveLang();

    const btnContainer = document.getElementById('era-buttons');
    if (btnContainer) {
        if (btnContainer.children.length === 0) {
            btnContainer.innerHTML = historicalEras.map((e, i) => `
                <button onclick="showHistoricalEra(${i})" class="era-btn ${i === eraIndex ? 'era-btn-active' : ''}" 
                    style="padding:8px 16px;border-radius:8px;font-family:'JetBrains Mono',monospace;font-size:0.75rem;cursor:pointer;transition:all 0.2s;
                    border:1px solid ${i === eraIndex ? e.color : 'rgba(255,255,255,0.2)'};
                    background:${i === eraIndex ? e.color+'30' : 'transparent'};
                    color:${i === eraIndex ? e.color : 'var(--text-secondary)'};">
                    ${e.label[lang]}
                </button>
            `).join('');
        } else {
            Array.from(btnContainer.children).forEach((btn, i) => {
                const e = historicalEras[i];
                btn.textContent = e.label[lang];
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
    }

    const descEl = document.getElementById('era-description');
    if (descEl) {
        descEl.style.borderLeftColor = era.color;
        descEl.innerHTML = era.description[lang];
    }

    loadEraGeoJSON(era);

    const eventsEl = document.getElementById('era-events');
    if (eventsEl) {
        eventsEl.innerHTML = era.events[lang].map(ev => `
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
    try {
        const response = await fetch(era.geojson);
        const data = await response.json();
        if (geojsonLayer) historicalMap.removeLayer(geojsonLayer);
        geojsonLayer = L.geoJSON(data, {
            style: () => ({ color: era.color, weight: 1.5, opacity: 0.8, fillColor: era.color, fillOpacity: 0.1 }),
            onEachFeature: (feature, layer) => {
                const name = feature.properties.NAME || feature.properties.name || feature.properties.ADMIN || "Unknown Territory";
                layer.bindTooltip(name, { className: 'geo-popup', direction: 'auto' });
            }
        }).addTo(historicalMap);
    } catch (error) {
        console.error("Failed to load historical GeoJSON:", error);
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '0,212,255';
}

document.addEventListener('languageChanged', () => {
    const btnContainer = document.getElementById('era-buttons');
    if (btnContainer) {
        
        btnContainer.innerHTML = '';
    }
    if (historicalMapInitialized) {
        showHistoricalEra(currentEra);
    }
});
