import { db, currentUser, updateLocation, listenToFriends } from './firebase-auth.js';
import { collection, onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

let socialMapInstance = null;
let socialMapInitialized = false;
let syncUnsub = null;
let friendsUnsub = null;
let markersMap = new Map();

export function initSocialMap() {
    const worldmapLink = document.querySelector('[data-page="worldmap"]');
    if (worldmapLink) {
        worldmapLink.addEventListener('click', () => {
            setTimeout(renderSocialMap, 200);
        });
    }
}

window.renderSocialMap = renderSocialMap;

export function renderSocialMap() {
    const container = document.getElementById('social-world-map');
    if (!container) return;

    if (socialMapInitialized) {
        if (socialMapInstance) {
            setTimeout(() => socialMapInstance.invalidateSize(), 150);
        }
        return;
    }
    socialMapInitialized = true;

    if (socialMapInstance) socialMapInstance.remove();

    socialMapInstance = L.map('social-world-map', {
        center: [20, 10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 10,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB'
    }).addTo(socialMapInstance);

    initSocialSync();
    initFriendsList();

    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition((pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude);
        }, null, { enableHighAccuracy: true });
    }

    setTimeout(() => socialMapInstance.invalidateSize(), 150);
}

function initFriendsList() {
    if (friendsUnsub) friendsUnsub();
    const listContainer = document.getElementById('social-friends-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<div class="text-center text-xs text-gray-500 py-4">Se încarcă...</div>';

    friendsUnsub = listenToFriends((friends) => {
        listContainer.innerHTML = '';
        const onlineFriends = friends.filter(f => f.online);

        if (onlineFriends.length === 0) {
            listContainer.innerHTML = `<div class="text-gray-500 text-xs italic p-2 bg-white/5 rounded text-center">Niciun prieten online</div>`;
            return;
        }

        onlineFriends.forEach(friend => {
            const el = document.createElement('div');
            el.className = 'flex items-center gap-3 p-2 bg-white/5 rounded hover:bg-white/10 transition-colors cursor-pointer border border-white/5 hover:border-[#00d4ff]/30';
            el.innerHTML = `
                <div class="relative w-8 h-8 rounded-full border border-[#00d4ff] overflow-hidden bg-[#121a2e] flex-shrink-0">
                    ${friend.photoURL ? `<img src="${friend.photoURL}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-xs">👤</div>`}
                    <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00e676] rounded-full border border-[#0a0e17]"></div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-white truncate">${friend.displayName || 'Unknown Agent'}</div>
                    <div class="text-[0.65rem] text-[#00d4ff] truncate">${friend.rank || 'Agent'}</div>
                </div>
            `;
            el.addEventListener('click', () => {
                if (socialMapInstance && friend.lat && friend.lng) {
                    socialMapInstance.flyTo([friend.lat, friend.lng], 6);
                }
            });
            listContainer.appendChild(el);
        });
    });
}

function initSocialSync() {
    if (syncUnsub) syncUnsub();

    const playersRef = collection(db, "players");

    syncUnsub = onSnapshot(playersRef, (snapshot) => {
        if (!socialMapInstance) return;

        snapshot.docChanges().forEach((change) => {
            const playerId = change.doc.id;
            const data = change.doc.data();

            if (currentUser && playerId === currentUser.uid) return;

            if (change.type === "removed" || (data.online === false)) {
                if (markersMap.has(playerId)) {
                    socialMapInstance.removeLayer(markersMap.get(playerId));
                    markersMap.delete(playerId);
                }
            } else {
                if (data.lat && data.lng) {
                    const statusColor = '#00d4ff';
                    const markerHtml = `
                        <div style="position:relative;width:40px;height:40px;">
                            <div style="width:100%;height:100%;border-radius:50%;border:2px solid ${statusColor};overflow:hidden;background:#121a2e;display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px ${statusColor}66;">
                                ${data.photoURL ? `<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:1.2rem;">👤</span>`}
                            </div>
                            <div style="position:absolute;bottom:0;right:0;width:10px;height:10px;background:#00e676;border-radius:50%;border:2px solid #0a0e17;"></div>
                        </div>`;

                    if (markersMap.has(playerId)) {
                        markersMap.get(playerId).setLatLng([data.lat, data.lng]);
                    } else {
                        const newMarker = L.marker([data.lat, data.lng], {
                            icon: L.divIcon({
                                className: 'player-marker',
                                html: markerHtml,
                                iconSize: [40, 40],
                                iconAnchor: [20, 40]
                            })
                        }).addTo(socialMapInstance);

                        newMarker.bindPopup(`<b style="color:#00d4ff;">${data.displayName || 'Unknown Agent'}</b><br>${data.rank || 'Agent'}`);
                        markersMap.set(playerId, newMarker);
                    }
                }
            }
        });
    });
}
