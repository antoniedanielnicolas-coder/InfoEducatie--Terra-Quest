// =====================================================
// World Political Map — Leaflet + GeoJSON Colored
// Expanded Database & Enhanced Interactivity
// =====================================================
import { t } from './i18n.js';

const countryData = {
    // Constitutional Monarchies (blue)
    'GBR': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇬🇧', name: 'United Kingdom' },
    'ESP': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇪🇸', name: 'Spain' },
    'SWE': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇸🇪', name: 'Sweden' },
    'NOR': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇳🇴', name: 'Norway' },
    'DNK': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇩🇰', name: 'Denmark' },
    'NLD': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇳🇱', name: 'Netherlands' },
    'BEL': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇧🇪', name: 'Belgium' },
    'JPN': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇯🇵', name: 'Japan' },
    'CAN': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇨🇦', name: 'Canada' },
    'AUS': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇦🇺', name: 'Australia' },
    'NZL': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇳🇿', name: 'New Zealand' },
    'THA': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇹🇭', name: 'Thailand' },
    'MAR': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇲🇦', name: 'Morocco' },
    'JOR': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇯🇴', name: 'Jordan' },
    'MYS': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇲🇾', name: 'Malaysia' },
    'KWT': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇰🇼', name: 'Kuwait' },
    'BHR': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇧🇭', name: 'Bahrain' },
    'KHM': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇰🇭', name: 'Cambodia' },
    'LSO': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇱🇸', name: 'Lesotho' },
    'LIE': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇱🇮', name: 'Liechtenstein' },
    'MCO': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇲🇨', name: 'Monaco' },
    'LUX': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇱🇺', name: 'Luxembourg' },
    'JAM': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇯🇲', name: 'Jamaica' },
    'BHS': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇧🇸', name: 'Bahamas' },
    'PNG': { type: 'Constitutional Monarchy', color: '#4a90d9', flag: '🇵🇬', name: 'Papua New Guinea' },

    // Absolute Monarchies (purple)
    'SAU': { type: 'Absolute Monarchy', color: '#8b44cc', flag: '🇸🇦', name: 'Saudi Arabia' },
    'ARE': { type: 'Absolute Monarchy', color: '#8b44cc', flag: '🇦🇪', name: 'UAE' },
    'QAT': { type: 'Absolute Monarchy', color: '#8b44cc', flag: '🇶🇦', name: 'Qatar' },
    'BRN': { type: 'Absolute Monarchy', color: '#8b44cc', flag: '🇧🇳', name: 'Brunei' },
    'OMN': { type: 'Absolute Monarchy', color: '#8b44cc', flag: '🇴🇲', name: 'Oman' },
    'SWZ': { type: 'Absolute Monarchy', color: '#8b44cc', flag: '🇸🇿', name: 'Eswatini' },
    'VAT': { type: 'Absolute Monarchy', color: '#8b44cc', flag: '🇻🇦', name: 'Vatican City' },

    // Presidential Republics (red-orange)
    'USA': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇺🇸', name: 'United States' },
    'BRA': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇧🇷', name: 'Brazil' },
    'MEX': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇲🇽', name: 'Mexico' },
    'ARG': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇦🇷', name: 'Argentina' },
    'COL': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇨🇴', name: 'Colombia' },
    'CHL': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇨🇱', name: 'Chile' },
    'KEN': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇰🇪', name: 'Kenya' },
    'NGA': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇳🇬', name: 'Nigeria' },
    'ZAF': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇿🇦', name: 'South Africa' },
    'IDN': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇮🇩', name: 'Indonesia' },
    'PHL': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇵🇭', name: 'Philippines' },
    'KOR': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇰🇷', name: 'South Korea' },
    'VEN': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇻🇪', name: 'Venezuela' },
    'TUR': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇹🇷', name: 'Turkey' },
    'EGY': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇪🇬', name: 'Egypt' },
    'PER': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇵🇪', name: 'Peru' },
    'ECU': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇪🇨', name: 'Ecuador' },
    'BOL': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇧🇴', name: 'Bolivia' },
    'PRY': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇵🇾', name: 'Paraguay' },
    'URY': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇺🇾', name: 'Uruguay' },
    'AGO': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇦🇴', name: 'Angola' },
    'CIV': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇨🇮', name: 'Ivory Coast' },
    'GHA': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇬🇭', name: 'Ghana' },
    'SEN': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇸🇳', name: 'Senegal' },
    'UGA': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇺🇬', name: 'Uganda' },
    'TZA': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇹🇿', name: 'Tanzania' },
    'ZMB': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇿🇲', name: 'Zambia' },
    'MDG': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇲🇬', name: 'Madagascar' },
    'KAZ': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇰🇿', name: 'Kazakhstan' },
    'UZB': { type: 'Presidential Republic', color: '#e05c3a', flag: '🇺🇿', name: 'Uzbekistan' },
    'AFG': { type: 'Theocratic Republic', color: '#e05c3a', flag: '🇦🇫', name: 'Afghanistan' },
    'IRN': { type: 'Theocratic Republic', color: '#e05c3a', flag: '🇮🇷', name: 'Iran' },

    // Parliamentary Republics (green)
    'DEU': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇩🇪', name: 'Germany' },
    'ITA': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇮🇹', name: 'Italy' },
    'IND': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇮🇳', name: 'India' },
    'GRC': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇬🇷', name: 'Greece' },
    'IRL': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇮🇪', name: 'Ireland' },
    'ISR': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇮🇱', name: 'Israel' },
    'AUT': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇦🇹', name: 'Austria' },
    'FIN': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇫🇮', name: 'Finland' },
    'HUN': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇭🇺', name: 'Hungary' },
    'CZE': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇨🇿', name: 'Czechia' },
    'SVK': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇸🇰', name: 'Slovakia' },
    'BGR': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇧🇬', name: 'Bulgaria' },
    'HRV': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇭🇷', name: 'Croatia' },
    'SVN': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇸🇮', name: 'Slovenia' },
    'EST': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇪🇪', name: 'Estonia' },
    'LVA': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇱🇻', name: 'Latvia' },
    'LTU': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇱🇹', name: 'Lithuania' },
    'ISL': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇮🇸', name: 'Iceland' },
    'SGP': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇸🇬', name: 'Singapore' },
    'BGD': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇧🇩', name: 'Bangladesh' },
    'NPL': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇳🇵', name: 'Nepal' },
    'SOM': { type: 'Parliamentary Republic', color: '#2eaa6e', flag: '🇸🇴', name: 'Somalia' },

    // Semi-Presidential (gold)
    'ROM': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇷🇴', name: 'Romania' },
    'ROU': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇷🇴', name: 'Romania' },
    'FRA': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇫🇷', name: 'France' },
    'RUS': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇷🇺', name: 'Russia' },
    'POL': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇵🇱', name: 'Poland' },
    'PRT': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇵🇹', name: 'Portugal' },
    'UKR': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇺🇦', name: 'Ukraine' },
    'MDA': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇲🇩', name: 'Moldova' },
    'SRB': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇷🇸', name: 'Serbia' },
    'DZA': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇩🇿', name: 'Algeria' },
    'TUN': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇹🇳', name: 'Tunisia' },
    'SYR': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇸🇾', name: 'Syria' },
    'LKA': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇱🇰', name: 'Sri Lanka' },
    'TWN': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇹🇼', name: 'Taiwan' },
    'MLI': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇲🇱', name: 'Mali' },
    'NER': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇳🇪', name: 'Niger' },
    'COD': { type: 'Semi-Presidential Republic', color: '#d4a843', flag: '🇨🇩', name: 'DR Congo' },

    // One-Party States (red)
    'CHN': { type: 'One-Party State', color: '#cc3355', flag: '🇨🇳', name: 'China' },
    'PRK': { type: 'One-Party State', color: '#cc3355', flag: '🇰🇵', name: 'North Korea' },
    'CUB': { type: 'One-Party State', color: '#cc3355', flag: '🇨🇺', name: 'Cuba' },
    'VNM': { type: 'One-Party State', color: '#cc3355', flag: '🇻🇳', name: 'Vietnam' },
    'LAO': { type: 'One-Party State', color: '#cc3355', flag: '🇱🇦', name: 'Laos' },
    'ERI': { type: 'One-Party State', color: '#cc3355', flag: '🇪🇷', name: 'Eritrea' },

    // Federal Republics (orange)
    'CHE': { type: 'Federal Republic', color: '#ff6b35', flag: '🇨🇭', name: 'Switzerland' },
    'PAK': { type: 'Federal Republic', color: '#ff6b35', flag: '🇵🇰', name: 'Pakistan' },
    'ETH': { type: 'Federal Republic', color: '#ff6b35', flag: '🇪🇹', name: 'Ethiopia' },
    'IRQ': { type: 'Federal Republic', color: '#ff6b35', flag: '🇮🇶', name: 'Iraq' },
    'MYS': { type: 'Federal Monarchy', color: '#ff6b35', flag: '🇲🇾', name: 'Malaysia' },
    'MMR': { type: 'Federal Republic', color: '#ff6b35', flag: '🇲🇲', name: 'Myanmar' },
    'SDN': { type: 'Federal Republic', color: '#ff6b35', flag: '🇸🇩', name: 'Sudan' },
    'SSD': { type: 'Federal Republic', color: '#ff6b35', flag: '🇸🇸', name: 'South Sudan' },

    // Others (Grey/Neutral)
    'GRL': { type: 'Autonomous Territory', color: '#888888', flag: '🇬🇱', name: 'Greenland' },
    'ESH': { type: 'Disputed Territory', color: '#888888', flag: '🇪🇭', name: 'Western Sahara' }
};

let worldMapInstance = null;
let mapInitialized = false;
let geoJsonLayer = null;

export function initWorldMap() {
    // Reset initialization flag when navigating to other pages
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.dataset.page !== 'worldmap') {
                mapInitialized = false;
            }
        });
    });

    const worldmapLink = document.querySelector('[data-page="worldmap"]');
    if (worldmapLink) {
        worldmapLink.addEventListener('click', () => {
            setTimeout(renderWorldMap, 150);
        });
    }
}

function renderWorldMap() {
    const container = document.getElementById('world-political-map');
    if (!container || mapInitialized) return;
    mapInitialized = true;

    // Remove existing map if any
    if (worldMapInstance) {
        worldMapInstance.remove();
    }

    worldMapInstance = L.map('world-political-map', {
        center: [20, 10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(worldMapInstance);

    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(r => r.json())
        .then(data => {
            geoJsonLayer = L.geoJSON(data, {
                style: feature => {
                    const iso = feature.properties['ISO3166-1-Alpha-3'] || feature.properties.ISO_A3;
                    const info = countryData[iso];
                    return {
                        fillColor: info ? info.color : '#1a2440',
                        fillOpacity: info ? 0.72 : 0.25,
                        color: info ? '#00d4ff' : 'rgba(0,212,255,0.1)',
                        weight: info ? 1.5 : 0.5,
                        className: 'country-feature'
                    };
                },
                onEachFeature: (feature, layer) => {
                    const iso = feature.properties['ISO3166-1-Alpha-3'] || feature.properties.ISO_A3;
                    const info = countryData[iso];
                    if (info) {
                        layer.featureInfo = info;
                        layer.bindTooltip(`<strong>${info.flag} ${info.name}</strong><br>${info.type}`, { sticky: true });
                        
                        layer.on('mouseover', function() {
                            this.setStyle({ fillOpacity: 0.95, weight: 2.5 });
                            this.bringToFront();
                        });
                        layer.on('mouseout', function() {
                            this.setStyle({ fillOpacity: 0.72, weight: 1.5 });
                        });
                        layer.on('click', async function(e) {
                            const originalFill = info.color;
                            this.setStyle({ fillColor: '#ffffff', fillOpacity: 1, weight: 3 });
                            setTimeout(() => {
                                this.setStyle({ fillColor: originalFill, fillOpacity: 0.95, weight: 2.5 });
                            }, 400);
                            
                            // Dispatch XP and show toast
                            const xpEvent = new CustomEvent('xpGained', { detail: { amount: 5 } });
                            document.dispatchEvent(xpEvent);
                            try {
                                const { showToast } = await import('./utils.js');
                                showToast(`${info.flag} ${info.name} — ${info.type} (+5 XP)`, 'info');
                            } catch (e) {
                                console.log('Toast failed', e);
                            }
                        });
                    }
                }
            }).addTo(worldMapInstance);
        });
}
