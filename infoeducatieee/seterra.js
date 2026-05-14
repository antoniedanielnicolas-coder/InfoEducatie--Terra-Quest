import { playSound } from './sounds.js';
import { showToast } from './utils.js';

const DB = {
    europe: {
        en: 'Europe — Capitals', ro: 'Europa — Capitale',
        center: [54, 15], zoom: 3, color: '#4a90d9',
        caps: [
            { c: 'Albania', k: 'Tirana', lat: 41.33, lng: 19.82 },
            { c: 'Andorra', k: 'Andorra la Vella', lat: 42.50, lng: 1.52 },
            { c: 'Armenia', k: 'Erevan', lat: 40.18, lng: 44.51 },
            { c: 'Austria', k: 'Viena', lat: 48.21, lng: 16.37 },
            { c: 'Azerbaidjan', k: 'Baku', lat: 40.41, lng: 49.87 },
            { c: 'Belarus', k: 'Minsk', lat: 53.90, lng: 27.57 },
            { c: 'Belgia', k: 'Bruxelles', lat: 50.85, lng: 4.35 },
            { c: 'Bosnia și Herțegovina', k: 'Sarajevo', lat: 43.85, lng: 18.41 },
            { c: 'Bulgaria', k: 'Sofia', lat: 42.70, lng: 23.32 },
            { c: 'Cehia', k: 'Praga', lat: 50.08, lng: 14.44 },
            { c: 'Cipru', k: 'Nicosia', lat: 35.19, lng: 33.38 },
            { c: 'Croația', k: 'Zagreb', lat: 45.81, lng: 15.98 },
            { c: 'Danemarca', k: 'Copenhaga', lat: 55.68, lng: 12.57 },
            { c: 'Elveția', k: 'Berna', lat: 46.95, lng: 7.45 },
            { c: 'Estonia', k: 'Tallinn', lat: 59.44, lng: 24.75 },
            { c: 'Finlanda', k: 'Helsinki', lat: 60.17, lng: 24.94 },
            { c: 'Franța', k: 'Paris', lat: 48.85, lng: 2.35 },
            { c: 'Georgia', k: 'Tbilisi', lat: 41.71, lng: 44.83 },
            { c: 'Germania', k: 'Berlin', lat: 52.52, lng: 13.40 },
            { c: 'Grecia', k: 'Atena', lat: 37.98, lng: 23.73 },
            { c: 'Irlanda', k: 'Dublin', lat: 53.35, lng: -6.26 },
            { c: 'Islanda', k: 'Reykjavík', lat: 64.15, lng: -21.94 },
            { c: 'Italia', k: 'Roma', lat: 41.90, lng: 12.49 },
            { c: 'Kosovo', k: 'Pristina', lat: 42.67, lng: 21.17 },
            { c: 'Letonia', k: 'Riga', lat: 56.95, lng: 24.11 },
            { c: 'Liechtenstein', k: 'Vaduz', lat: 47.14, lng: 9.52 },
            { c: 'Lituania', k: 'Vilnius', lat: 54.69, lng: 25.28 },
            { c: 'Luxemburg', k: 'Luxemburg', lat: 49.61, lng: 6.13 },
            { c: 'Macedonia de Nord', k: 'Skopje', lat: 42.00, lng: 21.43 },
            { c: 'Malta', k: 'Valletta', lat: 35.90, lng: 14.51 },
            { c: 'Marea Britanie', k: 'Londra', lat: 51.51, lng: -0.13 },
            { c: 'Moldova', k: 'Chișinău', lat: 47.01, lng: 28.86 },
            { c: 'Monaco', k: 'Monaco', lat: 43.73, lng: 7.42 },
            { c: 'Muntenegru', k: 'Podgorica', lat: 42.44, lng: 19.26 },
            { c: 'Norvegia', k: 'Oslo', lat: 59.91, lng: 10.75 },
            { c: 'Olanda', k: 'Amsterdam', lat: 52.37, lng: 4.90 },
            { c: 'Polonia', k: 'Varșovia', lat: 52.23, lng: 21.01 },
            { c: 'Portugalia', k: 'Lisabona', lat: 38.72, lng: -9.14 },
            { c: 'România', k: 'București', lat: 44.43, lng: 26.10 },
            { c: 'Rusia', k: 'Moscova', lat: 55.75, lng: 37.62 },
            { c: 'San Marino', k: 'San Marino', lat: 43.94, lng: 12.45 },
            { c: 'Serbia', k: 'Belgrad', lat: 44.80, lng: 20.46 },
            { c: 'Slovacia', k: 'Bratislava', lat: 48.15, lng: 17.11 },
            { c: 'Slovenia', k: 'Ljubljana', lat: 46.05, lng: 14.51 },
            { c: 'Spania', k: 'Madrid', lat: 40.42, lng: -3.70 },
            { c: 'Suedia', k: 'Stockholm', lat: 59.33, lng: 18.07 },
            { c: 'Turcia', k: 'Ankara', lat: 39.93, lng: 32.86 },
            { c: 'Ucraina', k: 'Kiev', lat: 50.45, lng: 30.52 },
            { c: 'Ungaria', k: 'Budapesta', lat: 47.50, lng: 19.04 },
            { c: 'Vatican', k: 'Vatican', lat: 41.90, lng: 12.45 }
        ]
    },
    africa: {
        en: 'Africa — Capitals', ro: 'Africa — Capitale',
        center: [5, 20], zoom: 2, color: '#2eaa6e',
        caps: [
            { c: 'Africa de Sud', k: 'Pretoria', lat: -25.74, lng: 28.19 },
            { c: 'Algeria', k: 'Alger', lat: 36.74, lng: 3.06 },
            { c: 'Angola', k: 'Luanda', lat: -8.84, lng: 13.23 },
            { c: 'Benin', k: 'Porto-Novo', lat: 6.50, lng: 2.60 },
            { c: 'Botswana', k: 'Gaborone', lat: -24.66, lng: 25.92 },
            { c: 'Burkina Faso', k: 'Ouagadougou', lat: 12.37, lng: -1.53 },
            { c: 'Burundi', k: 'Gitega', lat: -3.43, lng: 29.93 },
            { c: 'Camerun', k: 'Yaoundé', lat: 3.87, lng: 11.52 },
            { c: 'Capul Verde', k: 'Praia', lat: 14.92, lng: -23.51 },
            { c: 'Ciad', k: 'N\\\'Djamena', lat: 12.11, lng: 15.04 },
            { c: 'Coasta de Fildeș', k: 'Yamoussoukro', lat: 6.82, lng: -5.28 },
            { c: 'Comore', k: 'Moroni', lat: -11.70, lng: 43.25 },
            { c: 'Congo', k: 'Brazzaville', lat: -4.27, lng: 15.28 },
            { c: 'Djibouti', k: 'Djibouti', lat: 11.59, lng: 43.15 },
            { c: 'Egipt', k: 'Cairo', lat: 30.04, lng: 31.24 },
            { c: 'Eritreea', k: 'Asmara', lat: 15.33, lng: 38.93 },
            { c: 'Eswatini', k: 'Mbabane', lat: -26.32, lng: 31.14 },
            { c: 'Etiopia', k: 'Addis Abeba', lat: 9.03, lng: 38.74 },
            { c: 'Gabon', k: 'Libreville', lat: 0.39, lng: 9.45 },
            { c: 'Gambia', k: 'Banjul', lat: 13.45, lng: -16.58 },
            { c: 'Ghana', k: 'Accra', lat: 5.56, lng: -0.20 },
            { c: 'Guineea', k: 'Conakry', lat: 9.54, lng: -13.68 },
            { c: 'Guineea Ecuatorială', k: 'Malabo', lat: 3.75, lng: 8.78 },
            { c: 'Guineea-Bissau', k: 'Bissau', lat: 11.86, lng: -15.60 },
            { c: 'Kenya', k: 'Nairobi', lat: -1.29, lng: 36.82 },
            { c: 'Lesotho', k: 'Maseru', lat: -29.32, lng: 27.48 },
            { c: 'Liberia', k: 'Monrovia', lat: 6.31, lng: -10.80 },
            { c: 'Libia', k: 'Tripoli', lat: 32.89, lng: 13.19 },
            { c: 'Madagascar', k: 'Antananarivo', lat: -18.88, lng: 47.53 },
            { c: 'Malawi', k: 'Lilongwe', lat: -13.98, lng: 33.78 },
            { c: 'Mali', k: 'Bamako', lat: 12.64, lng: -8.00 },
            { c: 'Maroc', k: 'Rabat', lat: 34.02, lng: -6.84 },
            { c: 'Mauritania', k: 'Nouakchott', lat: 18.07, lng: -15.97 },
            { c: 'Mauritius', k: 'Port Louis', lat: -20.16, lng: 57.50 },
            { c: 'Mozambic', k: 'Maputo', lat: -25.97, lng: 32.59 },
            { c: 'Namibia', k: 'Windhoek', lat: -22.56, lng: 17.08 },
            { c: 'Niger', k: 'Niamey', lat: 13.51, lng: 2.11 },
            { c: 'Nigeria', k: 'Abuja', lat: 9.07, lng: 7.40 },
            { c: 'R.D. Congo', k: 'Kinshasa', lat: -4.32, lng: 15.31 },
            { c: 'Republica Centrafricană', k: 'Bangui', lat: 4.36, lng: 18.55 },
            { c: 'Rwanda', k: 'Kigali', lat: -1.94, lng: 30.06 },
            { c: 'São Tomé și Príncipe', k: 'São Tomé', lat: 0.34, lng: 6.73 },
            { c: 'Senegal', k: 'Dakar', lat: 14.69, lng: -17.44 },
            { c: 'Seychelles', k: 'Victoria', lat: -4.62, lng: 55.45 },
            { c: 'Sierra Leone', k: 'Freetown', lat: 8.48, lng: -13.23 },
            { c: 'Somalia', k: 'Mogadishu', lat: 2.05, lng: 45.34 },
            { c: 'Sudan', k: 'Khartoum', lat: 15.55, lng: 32.53 },
            { c: 'Sudanul de Sud', k: 'Juba', lat: 4.85, lng: 31.58 },
            { c: 'Tanzania', k: 'Dodoma', lat: -6.17, lng: 35.74 },
            { c: 'Togo', k: 'Lomé', lat: 6.13, lng: 1.22 },
            { c: 'Tunisia', k: 'Tunis', lat: 36.82, lng: 10.17 },
            { c: 'Uganda', k: 'Kampala', lat: 0.31, lng: 32.58 },
            { c: 'Zambia', k: 'Lusaka', lat: -15.42, lng: 28.28 },
            { c: 'Zimbabwe', k: 'Harare', lat: -17.83, lng: 31.05 }
        ]
    },
    americas: {
        en: 'Americas — Capitals', ro: 'Americi — Capitale',
        center: [10, -78], zoom: 2, color: '#e05c3a',
        caps: [
            { c: 'Antigua și Barbuda', k: 'St. John\\\'s', lat: 17.12, lng: -61.85 },
            { c: 'Argentina', k: 'Buenos Aires', lat: -34.61, lng: -58.38 },
            { c: 'Bahamas', k: 'Nassau', lat: 25.08, lng: -77.34 },
            { c: 'Barbados', k: 'Bridgetown', lat: 13.10, lng: -59.62 },
            { c: 'Belize', k: 'Belmopan', lat: 17.25, lng: -88.77 },
            { c: 'Bolivia', k: 'Sucre', lat: -19.03, lng: -65.26 },
            { c: 'Brazilia', k: 'Brasília', lat: -15.79, lng: -47.88 },
            { c: 'Canada', k: 'Ottawa', lat: 45.42, lng: -75.69 },
            { c: 'Chile', k: 'Santiago', lat: -33.46, lng: -70.65 },
            { c: 'Colombia', k: 'Bogotá', lat: 4.71, lng: -74.07 },
            { c: 'Costa Rica', k: 'San José', lat: 9.93, lng: -84.08 },
            { c: 'Cuba', k: 'Havana', lat: 23.13, lng: -82.38 },
            { c: 'Dominica', k: 'Roseau', lat: 15.30, lng: -61.39 },
            { c: 'Ecuador', k: 'Quito', lat: -0.22, lng: -78.51 },
            { c: 'El Salvador', k: 'San Salvador', lat: 13.70, lng: -89.20 },
            { c: 'Grenada', k: 'St. George\\\'s', lat: 12.06, lng: -61.75 },
            { c: 'Guatemala', k: 'Ciudad de Guatemala', lat: 14.63, lng: -90.53 },
            { c: 'Guyana', k: 'Georgetown', lat: 6.80, lng: -58.16 },
            { c: 'Haiti', k: 'Port-au-Prince', lat: 18.54, lng: -72.34 },
            { c: 'Honduras', k: 'Tegucigalpa', lat: 14.08, lng: -87.21 },
            { c: 'Jamaica', k: 'Kingston', lat: 17.97, lng: -76.79 },
            { c: 'Mexic', k: 'Ciudad de México', lat: 19.43, lng: -99.13 },
            { c: 'Nicaragua', k: 'Managua', lat: 12.13, lng: -86.25 },
            { c: 'Panama', k: 'Panama City', lat: 8.98, lng: -79.52 },
            { c: 'Paraguay', k: 'Asunción', lat: -25.29, lng: -57.65 },
            { c: 'Peru', k: 'Lima', lat: -12.05, lng: -77.04 },
            { c: 'Republica Dominicană', k: 'Santo Domingo', lat: 18.49, lng: -69.93 },
            { c: 'Sfântul Kitts și Nevis', k: 'Basseterre', lat: 17.30, lng: -62.73 },
            { c: 'Sfânta Lucia', k: 'Castries', lat: 14.01, lng: -61.00 },
            { c: 'Sfântul Vicențiu', k: 'Kingstown', lat: 13.16, lng: -61.22 },
            { c: 'SUA', k: 'Washington D.C.', lat: 38.89, lng: -77.04 },
            { c: 'Surinam', k: 'Paramaribo', lat: 5.85, lng: -55.20 },
            { c: 'Trinidad și Tobago', k: 'Port of Spain', lat: 10.66, lng: -61.52 },
            { c: 'Uruguay', k: 'Montevideo', lat: -34.90, lng: -56.16 },
            { c: 'Venezuela', k: 'Caracas', lat: 10.48, lng: -66.88 }
        ]
    },
    asia: {
        en: 'Asia & Oceania', ro: 'Asia & Oceania',
        center: [30, 100], zoom: 2, color: '#d4a843',
        caps: [
            { c: 'Afganistan', k: 'Kabul', lat: 34.53, lng: 69.17 },
            { c: 'Arabia Saudită', k: 'Riad', lat: 24.69, lng: 46.72 },
            { c: 'Australia', k: 'Canberra', lat: -35.28, lng: 149.13 },
            { c: 'Bahrain', k: 'Manama', lat: 26.22, lng: 50.58 },
            { c: 'Bangladesh', k: 'Dhaka', lat: 23.72, lng: 90.41 },
            { c: 'Bhutan', k: 'Thimphu', lat: 27.47, lng: 89.64 },
            { c: 'Birmania', k: 'Naypyidaw', lat: 19.75, lng: 96.13 },
            { c: 'Brunei', k: 'Bandar Seri Begawan', lat: 4.90, lng: 114.94 },
            { c: 'Cambodgia', k: 'Phnom Penh', lat: 11.56, lng: 104.93 },
            { c: 'China', k: 'Beijing', lat: 39.91, lng: 116.39 },
            { c: 'Coreea de Nord', k: 'Phenian', lat: 39.03, lng: 125.75 },
            { c: 'Coreea de Sud', k: 'Seul', lat: 37.57, lng: 126.98 },
            { c: 'Emiratele Arabe Unite', k: 'Abu Dhabi', lat: 24.45, lng: 54.38 },
            { c: 'Fiji', k: 'Suva', lat: -18.14, lng: 178.44 },
            { c: 'Filipine', k: 'Manila', lat: 14.60, lng: 120.98 },
            { c: 'India', k: 'New Delhi', lat: 28.61, lng: 77.21 },
            { c: 'Indonezia', k: 'Jakarta', lat: -6.20, lng: 106.82 },
            { c: 'Iordania', k: 'Amman', lat: 31.95, lng: 35.93 },
            { c: 'Irak', k: 'Bagdad', lat: 33.34, lng: 44.40 },
            { c: 'Iran', k: 'Teheran', lat: 35.69, lng: 51.42 },
            { c: 'Israel', k: 'Ierusalim', lat: 31.77, lng: 35.21 },
            { c: 'Japonia', k: 'Tokyo', lat: 35.69, lng: 139.69 },
            { c: 'Kârgâzstan', k: 'Bișkek', lat: 42.87, lng: 74.59 },
            { c: 'Kazahstan', k: 'Astana', lat: 51.17, lng: 71.43 },
            { c: 'Kuweit', k: 'Kuweit', lat: 29.37, lng: 47.98 },
            { c: 'Laos', k: 'Vientiane', lat: 17.97, lng: 102.60 },
            { c: 'Liban', k: 'Beirut', lat: 33.89, lng: 35.50 },
            { c: 'Malaezia', k: 'Kuala Lumpur', lat: 3.14, lng: 101.69 },
            { c: 'Maldive', k: 'Malé', lat: 4.18, lng: 73.51 },
            { c: 'Micronezia', k: 'Palikir', lat: 6.91, lng: 158.16 },
            { c: 'Mongolia', k: 'Ulaanbaatar', lat: 47.92, lng: 106.92 },
            { c: 'Nepal', k: 'Kathmandu', lat: 27.70, lng: 85.32 },
            { c: 'Noua Zeelandă', k: 'Wellington', lat: -41.29, lng: 174.78 },
            { c: 'Oman', k: 'Muscat', lat: 23.59, lng: 58.40 },
            { c: 'Pakistan', k: 'Islamabad', lat: 33.72, lng: 73.06 },
            { c: 'Papua Noua Guinee', k: 'Port Moresby', lat: -9.44, lng: 147.18 },
            { c: 'Qatar', k: 'Doha', lat: 25.29, lng: 51.53 },
            { c: 'Samoa', k: 'Apia', lat: -13.83, lng: -171.77 },
            { c: 'Singapore', k: 'Singapore', lat: 1.35, lng: 103.82 },
            { c: 'Siria', k: 'Damasc', lat: 33.51, lng: 36.29 },
            { c: 'Sri Lanka', k: 'Colombo', lat: 6.93, lng: 79.85 },
            { c: 'Tadjikistan', k: 'Dușanbe', lat: 38.56, lng: 68.78 },
            { c: 'Thailanda', k: 'Bangkok', lat: 13.75, lng: 100.52 },
            { c: 'Timorul de Est', k: 'Dili', lat: -8.56, lng: 125.57 },
            { c: 'Turkmenistan', k: 'Așgabat', lat: 37.95, lng: 58.38 },
            { c: 'Uzbekistan', k: 'Tașkent', lat: 41.31, lng: 69.24 },
            { c: 'Vanuatu', k: 'Port Vila', lat: -17.74, lng: 168.32 },
            { c: 'Vietnam', k: 'Hanoi', lat: 21.03, lng: 105.85 },
            { c: 'Yemen', k: 'Sana\\\'a', lat: 15.37, lng: 44.21 }
        ]
    }
};
DB.world = {
    en: 'World — All Capitals', ro: 'Lumea — Toate Capitalele',
    center: [20, 0], zoom: 1, color: '#00d4ff',
    caps: [...DB.europe.caps, ...DB.africa.caps, ...DB.americas.caps, ...DB.asia.caps]
};

let sMap = null, sCurrent = null, sPending = [], sSolved = 0, sTimer = null;
let sGameData = { score: 0, coins: 0 };
let sUpdateCb = null;

function isRO() {
    const f = document.getElementById('current-lang-flag');
    return f && f.innerText === '🇷🇴';
}

export function initSeterra(continent, gameDataRef, updateFn) {
    sGameData = gameDataRef;
    sUpdateCb = updateFn;
    const data = DB[continent];
    if (!data) return;
    const ro = isRO();

    sPending = [...data.caps].sort(() => Math.random() - 0.5);
    sSolved = 0;

    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;height:100%;min-height:500px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding:0 4px;">
                <div>
                    <h2 style="font-family:'Orbitron',sans-serif;color:${data.color};margin:0;font-size:1rem;letter-spacing:2px;">
                        ${ro ? data.ro : data.en}
                    </h2>
                    <p id="s-task" style="color:#aaa;margin:6px 0 0;font-size:0.9rem;">${ro ? 'Se încarcă...' : 'Loading...'}</p>
                </div>
                <div style="display:flex;gap:20px;align-items:center;">
                    <div style="font-family:'JetBrains Mono',monospace;color:${data.color};font-size:1rem;font-weight:700;">
                        <span id="s-solved">0</span><span style="color:#666;">/${data.caps.length}</span>
                    </div>
                    <div style="font-family:'JetBrains Mono',monospace;color:#d4a843;font-size:0.9rem;">⏱ <span id="s-time">0</span>s</div>
                </div>
            </div>
            <div id="s-map" style="flex:1;min-height:420px;border-radius:16px;border:2px solid ${data.color}44;box-shadow:0 0 40px ${data.color}22;overflow:hidden;"></div>
            <div id="s-hint" style="text-align:center;font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#555;">
                ${ro ? '💡 Click pe punctul corect de pe hartă' : '💡 Click the correct point on the map'}
            </div>
        </div>`;

    setTimeout(() => {
        if (sMap) { sMap.remove(); sMap = null; }
        if (sTimer) { clearInterval(sTimer); sTimer = null; }

        sMap = L.map('s-map', { zoomControl: true }).setView(data.center, data.zoom);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(sMap);

        data.caps.forEach(cap => {
            const m = L.circleMarker([cap.lat, cap.lng], {
                radius: 7, color: 'rgba(255,255,255,0.25)', weight: 1.5,
                fillColor: 'rgba(255,255,255,0.1)', fillOpacity: 0.6
            }).addTo(sMap);
            m._cap = cap; m._done = false;

            m.on('click', () => {
                if (!sCurrent || m._done) return;
                if (cap.k === sCurrent.k) {
                    playSound('correct');
                    m._done = true;
                    m.setStyle({ radius: 10, color: '#00e676', fillColor: '#00e676', fillOpacity: 0.95, weight: 2 });
                    m.bindPopup(`<b style="color:#00e676">✅ ${cap.k}</b><br><small style="color:#888">${cap.c}</small>`).openPopup();
                    sSolved++;
                    sGameData.coins += 5; sGameData.score += 10;
                    if (sUpdateCb) sUpdateCb();
                    const el = document.getElementById('s-solved');
                    if (el) el.textContent = sSolved;
                    showToast(`✅ ${cap.k}! +5`, 'success');
                    nextTarget(ro);
                } else {
                    playSound('wrong');
                    const orig = { color: m.options.color, fillColor: m.options.fillColor };
                    m.setStyle({ color: '#ff4466', fillColor: '#ff4466' });
                    setTimeout(() => { if (!m._done) m.setStyle(orig); }, 700);
                    showToast(`❌ ${ro ? 'Nu e' : "Not"} ${cap.k}!`, 'error');
                }
            });
        });

        let elapsed = 0;
        sTimer = setInterval(() => {
            elapsed++;
            const el = document.getElementById('s-time');
            if (el) el.textContent = elapsed;
        }, 1000);

        nextTarget(ro);
    }, 120);
}

function nextTarget(ro) {
    if (sPending.length === 0) {
        if (sTimer) { clearInterval(sTimer); sTimer = null; }
        const t = document.getElementById('s-task');
        if (t) t.innerHTML = `🏆 ${ro ? 'Felicitări! Ai găsit toate capitalele!' : 'Congratulations! All capitals found!'}`;
        const hint = document.getElementById('s-hint');
        if (hint) hint.style.display = 'none';
        sGameData.coins += 30; sGameData.score += 100;
        if (sUpdateCb) sUpdateCb();
        showToast(`🏆 ${ro ? 'Completat!' : 'Completed!'} +30 ${ro ? 'Monede' : 'Coins'}`, 'success');
        return;
    }
    sCurrent = sPending.shift();
    const t = document.getElementById('s-task');
    if (t) {
        t.innerHTML = ro
            ? `🎯 Găsește: <strong style="color:#00d4ff;font-size:1rem;">${sCurrent.k}</strong> <span style="color:#555;font-size:0.8rem;">(${sCurrent.c})</span>`
            : `🎯 Find: <strong style="color:#00d4ff;font-size:1rem;">${sCurrent.k}</strong> <span style="color:#555;font-size:0.8rem;">(${sCurrent.c})</span>`;
    }
}

export function cleanupSeterra() {
    if (sMap) { sMap.remove(); sMap = null; }
    if (sTimer) { clearInterval(sTimer); sTimer = null; }
}
