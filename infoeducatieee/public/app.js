import { initI18n, setLanguage, currentLang, t, updateDOMTranslations } from './i18n.js';
import { initLessons } from './lessons.js';
import { initQuizzes } from './quizzes.js?v=4';
import { initAI } from './ai-agent.js';
import { initSounds, playSound, startAmbientMusic, stopAmbientMusic, setSoundTheme, getCurrentSoundTheme, musicLibrary, setBackgroundMusic, getCurrentMusicId } from './sounds.js';
import { startGame, endGame } from './games.js';
import { showToast } from './utils.js';
import { initWorldMap } from './worldmap.js';
import { initHistoryMap } from './historical-map.js';
import { initSocialMap } from './geosocial.js';
import {
    onAuthReady, signInWithGoogle, signInWithEmail,
    registerWithEmail, resetPassword, logOut,
    searchUserByEmail, searchUserByQR, addFriend,
    listenToFriends, getMyQRCode, currentUser,
    syncUserProgress, getLeaderboard, listenToNews
} from './firebase-auth.js';


async function initApp() {
    console.log("Initializing App...");
    
    // Fallback: Hide preloader after 3 seconds even if things fail
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('hidden')) {
            console.warn("Preloader forced hidden after timeout");
            preloader.classList.add('hidden');
        }
    }, 3000);

    try {
        // Initialize Core Systems
        await initI18n();
        initSounds();
        initLessons();
        initQuizzes();
        initAI();
        initWorldMap();
        initHistoryMap();
        initSocialMap();
        
        // Hide preloader normally
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) preloader.classList.add('hidden');
        }, 1500);

    } catch (err) {
        console.error("Initialization Error:", err);
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }

    // ─── FIREBASE AUTH ────────────────────────────────────────────────────────
    let unsubFriends = null;

    // ─── REAL-TIME NEWS FEED ──────────────────────────────────────────────────
    function formatNewsDate(ts) {
        if (!ts) return '';
        let d;
        if (ts.toDate) d = ts.toDate();
        else if (ts instanceof Date) d = ts;
        else d = new Date(ts);
        return d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    function renderNewsCard(item) {
        const borderColor = item.pinned ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.07)';
        const accentColor = item.tagColor || '#00d4ff';
        const pinBadge = item.pinned
            ? '<span style="background:rgba(212,168,67,0.2);border:1px solid rgba(212,168,67,0.5);color:#d4a843;font-size:0.65rem;font-family:Orbitron,sans-serif;padding:2px 8px;border-radius:4px;letter-spacing:1px;font-weight:700;">📌 FIXAT</span>'
            : '';
        const tagBg = accentColor + '22';
        const tagBorder = accentColor + '55';
        return [
            '<div style="background:rgba(10,14,23,0.7);backdrop-filter:blur(12px);border:1px solid ' + borderColor + ';border-radius:14px;padding:18px 22px;display:flex;gap:16px;align-items:flex-start;animation:fadeSlideIn 0.4s ease both;">',
            '<div style="width:3px;min-width:3px;border-radius:3px;background:' + accentColor + ';align-self:stretch;"></div>',
            '<div style="flex:1;min-width:0;">',
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">',
            '<span style="background:' + tagBg + ';border:1px solid ' + tagBorder + ';color:' + accentColor + ';font-size:0.65rem;font-family:Orbitron,sans-serif;padding:2px 10px;border-radius:4px;font-weight:700;letter-spacing:1px;">' + (item.tag || 'Update') + '</span>',
            pinBadge,
            '<span style="color:var(--text-muted);font-size:0.72rem;font-family:JetBrains Mono,monospace;margin-left:auto;">' + formatNewsDate(item.createdAt) + '</span>',
            '</div>',
            '<h4 style="color:white;font-family:Orbitron,sans-serif;font-size:0.9rem;font-weight:700;margin:0 0 4px;line-height:1.3;">' + item.title + '</h4>',
            '<p style="color:var(--text-secondary);font-size:0.82rem;margin:0;line-height:1.5;">' + item.description + '</p>',
            '</div></div>'
        ].join('');
    }

    const newsFeedContainer = document.getElementById('news-feed-container');
    if (newsFeedContainer) {
        listenToNews(function(items) {
            if (!items || items.length === 0) {
                newsFeedContainer.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:20px;">Nicio noutate disponibila.</p>';
                return;
            }
            const sorted = items.slice().sort(function(a, b) {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return 0;
            });
            newsFeedContainer.innerHTML = sorted.map(renderNewsCard).join('');
        });
    }

    onAuthReady((user) => {
        if (user) {
            // Show QR code
            getMyQRCode().then(qr => {
                if (!qr) return;
                const qrImg = document.getElementById('my-qr-code');
                const qrPlaceholder = document.getElementById('qr-placeholder');
                const qrText = document.getElementById('my-qr-text');
                if (qrImg) {
                    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${qr}&bgcolor=ffffff&color=000000`;
                    qrImg.style.display = 'block';
                }
                if (qrPlaceholder) qrPlaceholder.style.display = 'none';
                if (qrText) qrText.textContent = qr;

                const copyBtn = document.getElementById('copy-qr-btn');
                if (copyBtn) {
                    copyBtn.onclick = () => {
                        navigator.clipboard.writeText(qr);
                        showToast('📋 Cod copiat!', 'success');
                    };
                }
            });

            // Live friends listener
            if (unsubFriends) unsubFriends();
            unsubFriends = listenToFriends((friends) => {
                renderFriendsList(friends);
            });
        } else {
            const loginPrompt = document.getElementById('friends-login-prompt');
            if (loginPrompt) loginPrompt.style.display = 'block';
            const dynList = document.getElementById('dynamic-friends-list');
            if (dynList) dynList.innerHTML = '';
            const badge = document.getElementById('friends-count-badge');
            if (badge) badge.textContent = '0 prieteni';
        }
    });

    // Auth buttons
    const btnEmailLogin = document.getElementById('btn-email-login');
    if (btnEmailLogin) {
        btnEmailLogin.addEventListener('click', async () => {
            const email = document.getElementById('login-email')?.value?.trim();
            const pass  = document.getElementById('login-password')?.value;
            if (!email || !pass) return showToast('Completează email și parolă.', 'error');
            btnEmailLogin.textContent = '⏳ Se conectează...';
            btnEmailLogin.disabled = true;
            await signInWithEmail(email, pass);
            btnEmailLogin.textContent = t('settings.btn_login') || '🔐 Conectare cu Email';
            btnEmailLogin.disabled = false;
        });
    }

    const btnGoogle = document.getElementById('btn-google-login');
    if (btnGoogle) {
        btnGoogle.addEventListener('click', async () => {
            btnGoogle.textContent = '⏳ Se deschide Google...';
            btnGoogle.disabled = true;
            await signInWithGoogle();
            btnGoogle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Conectare cu Google`;
            btnGoogle.disabled = false;
        });
    }

    const btnRegister = document.getElementById('btn-register');
    if (btnRegister) {
        btnRegister.addEventListener('click', async () => {
            const name  = document.getElementById('reg-name')?.value?.trim();
            const email = document.getElementById('reg-email')?.value?.trim();
            const pass  = document.getElementById('reg-password')?.value;
            if (!name || !email || !pass) return showToast('Completează toate câmpurile.', 'error');
            if (pass.length < 6) return showToast('Parola trebuie să aibă minim 6 caractere.', 'error');
            btnRegister.textContent = '⏳ Se creează contul...';
            btnRegister.disabled = true;
            await registerWithEmail(email, pass, name);
            btnRegister.textContent = t('settings.btn_register') || '📝 Creare Cont';
            btnRegister.disabled = false;
        });
    }

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.addEventListener('click', async () => {
            const email = document.getElementById('reset-email')?.value?.trim();
            if (!email) return showToast('Introdu adresa de email.', 'error');
            btnReset.textContent = '⏳ Se trimite...';
            btnReset.disabled = true;
            await resetPassword(email);
            btnReset.textContent = t('settings.btn_reset') || '🔑 Trimite Email de Resetare';
            btnReset.disabled = false;
        });
    }

    const btnLogout = document.getElementById('logout-btn');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await logOut();
            showToast('Ai ieșit din cont.', 'info');
        });
    }

    // Friends search
    const friendSearchBtn = document.getElementById('friend-search-btn');
    const friendSearchInput = document.getElementById('friend-search-input');
    const friendSearchResult = document.getElementById('friend-search-result');

    if (friendSearchBtn && friendSearchInput) {
        friendSearchBtn.addEventListener('click', async () => {
            const query = friendSearchInput.value.trim();
            if (!query) return;
            if (!currentUser) { showToast('Loghează-te pentru a căuta prieteni.', 'error'); return; }

            friendSearchBtn.textContent = '⏳';
            let found = null;
            if (query.startsWith('GEO_') || query.startsWith('geo_')) {
                found = await searchUserByQR(query);
            } else {
                found = await searchUserByEmail(query);
            }
            friendSearchBtn.textContent = 'Caută';

            if (!found) {
                if (friendSearchResult) {
                    friendSearchResult.style.display = 'block';
                    friendSearchResult.innerHTML = `<span style="color:#ff4466;font-size:0.85rem;">❌ Niciun utilizator găsit.</span>`;
                }
                return;
            }
            if (found.uid === currentUser.uid) {
                if (friendSearchResult) {
                    friendSearchResult.style.display = 'block';
                    friendSearchResult.innerHTML = `<span style="color:#d4a843;font-size:0.85rem;">⚠️ Acesta ești tu!</span>`;
                }
                return;
            }

            if (friendSearchResult) {
                friendSearchResult.style.display = 'block';
                friendSearchResult.innerHTML = `
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div style="width:38px;height:38px;background:linear-gradient(135deg,#00d4ff,#0077ff);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">👤</div>
                            <div>
                                <div style="font-weight:700;color:white;font-size:0.9rem;">${found.displayName || 'Agent'}</div>
                                <div style="font-size:0.75rem;color:#00d4ff;font-family:'JetBrains Mono',monospace;">${found.qrCode || ''}</div>
                            </div>
                        </div>
                        <button id="add-friend-confirm-btn"
                            style="background:linear-gradient(90deg,#00d4ff,#0077ff);color:#0a0e17;border:none;border-radius:8px;padding:8px 16px;font-family:'Orbitron',sans-serif;font-weight:700;font-size:0.75rem;cursor:pointer;">
                            + Adaugă
                        </button>
                    </div>`;
                document.getElementById('add-friend-confirm-btn')?.addEventListener('click', async () => {
                    await addFriend(found.uid);
                    showToast(`✅ ${found.displayName} adăugat ca prieten!`, 'success');
                    friendSearchResult.style.display = 'none';
                    friendSearchInput.value = '';
                });
            }
        });
        friendSearchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') friendSearchBtn.click();
        });
    }

    function renderFriendsList(friends) {
        const dynList = document.getElementById('dynamic-friends-list');
        const badge   = document.getElementById('friends-count-badge');
        const loginPrompt = document.getElementById('friends-login-prompt');
        if (loginPrompt) loginPrompt.style.display = 'none';
        if (badge) badge.textContent = `${friends.length} prieten${friends.length !== 1 ? 'i' : ''}`;
        if (!dynList) return;

        if (friends.length === 0) {
            dynList.innerHTML = `<div style="text-align:center;color:#555;font-size:0.8rem;font-family:'JetBrains Mono',monospace;padding:8px;">Niciun prieten adăugat încă.</div>`;
            return;
        }
        dynList.innerHTML = friends.map(f => {
            const online = f.online === true;
            return `
                <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(10,14,23,0.8);padding:10px 12px;border-radius:10px;border:1px solid ${online ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.05)'};">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="position:relative;">
                            <div style="width:36px;height:36px;background:linear-gradient(135deg,#00d4ff,#0077ff);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;">👤</div>
                            <div style="position:absolute;bottom:-2px;right:-2px;width:10px;height:10px;background:${online ? '#00e676' : '#555'};border-radius:50%;border:2px solid #0a0e17;"></div>
                        </div>
                        <div>
                            <div style="font-weight:700;color:white;font-size:0.85rem;">${f.displayName || 'Agent'}</div>
                            <div style="font-size:0.7rem;color:${online ? '#00e676' : '#555'};font-family:'JetBrains Mono',monospace;">${online ? '● ONLINE' : '○ Offline'}</div>
                        </div>
                    </div>
                    <div style="font-size:0.75rem;color:#00d4ff;font-family:'JetBrains Mono',monospace;">${f.rank || 'Bronze I'}</div>
                </div>`;
        }).join('');
    }

    // --- State and UI Logic ---
    
    let userXP = parseInt(localStorage.getItem('userXP')) || 0;
    let compassCoins = parseInt(localStorage.getItem('compassCoins')) || 0;
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    const xpDisplay = document.getElementById('profile-xp-current');
    const coinsDisplays = document.querySelectorAll('.coin-count, #shop-balance');
    const navLevel = document.getElementById('nav-level');
    
    function updateStats() {
        const level = Math.floor(userXP / 100) + 1;
        const currentLevelXP = userXP % 100;
        const nextLevelXP = 100;

        if (xpDisplay) xpDisplay.innerText = userXP;
        
        // Update level badges
        if (navLevel) navLevel.innerText = `Lv. ${level}`;
        const lvlNumDossier = document.getElementById('level-number-dossier');
        if(lvlNumDossier) lvlNumDossier.innerText = level;
        
        // Update dossier progress bar
        const xpFill = document.getElementById('dossier-xp-fill');
        if (xpFill) xpFill.style.width = `${(currentLevelXP / nextLevelXP) * 100}%`;
        
        const xpNeeded = document.getElementById('profile-xp-needed');
        if (xpNeeded) xpNeeded.innerText = (level * 100);

        // Rank Titles
        const rankTitles = [
            currentLang === 'ro' ? "Atașat Debutant" : "Rookie Attaché",
            currentLang === 'ro' ? "Agent de Teren" : "Field Agent",
            currentLang === 'ro' ? "Diplomat" : "Diplomat",
            currentLang === 'ro' ? "Ambasador" : "Ambassador",
            currentLang === 'ro' ? "Strateg Global" : "Global Strategist"
        ];
        const rankEl = document.getElementById('profile-rank');
        if (rankEl) rankEl.innerText = rankTitles[Math.min(level - 1, rankTitles.length - 1)];

        // Avatar Ring Color
        const ring = document.getElementById('dossier-avatar-ring');
        if (ring) {
            ring.className = 'absolute -inset-1 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500';
            if (level >= 10) {
                ring.classList.add('bg-gradient-to-r', 'from-[#f0c94d]', 'to-[#d4a843]'); // Gold
            } else if (level >= 5) {
                ring.classList.add('bg-gradient-to-r', 'from-[#00e676]', 'to-[#00a352]'); // Emerald
            } else {
                ring.classList.add('bg-gradient-to-r', 'from-[#00d4ff]', 'to-[#0077ff]'); // Blue
            }
        }

        coinsDisplays.forEach(d => d.innerText = compassCoins);
        
        const invList = document.getElementById('inventory-list');
        if(invList) {
            if(inventory.length === 0) {
                invList.innerHTML = `<p class="text-gray-500 text-sm col-span-full">${t('profile.no_assets')}</p>`;
            } else {
                invList.innerHTML = inventory.map(item => `
                    <div class="inventory-item bg-[#1a2440]/80 border border-[#00d4ff]/30 rounded-lg p-4 cursor-pointer hover:bg-[#00d4ff]/20 transition-all shadow-[0_0_10px_rgba(0,212,255,0.1)] flex flex-col items-center justify-center text-center text-xs font-bold text-white group" data-item="${item}">
                        <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">${item.includes('Banner') ? '🖼️' : (item.includes('Avatar') ? '👤' : '🎨')}</div>
                        ${item}
                    </div>
                `).join('');

                // Add Equip Logic
                document.querySelectorAll('.inventory-item').forEach(itemBox => {
                    itemBox.addEventListener('click', () => {
                        const itemName = itemBox.getAttribute('data-item');
                        playSound('click');
                        
                        if (itemName.includes('World Map Banner')) {
                            const banner = document.getElementById('dossier-banner');
                            if (banner) banner.style.backgroundImage = "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')";
                            showToast("Banner Equipped: World Map", "success");
                        } else if (itemName.includes('Cyberpunk')) {
                            const banner = document.getElementById('dossier-banner');
                            if (banner) banner.style.backgroundImage = "url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1000&auto=format&fit=crop')";
                            showToast("Banner Equipped: Cyberpunk", "success");
                        } else if (itemName.includes('Topographic Master')) {
                            const banner = document.getElementById('dossier-banner');
                            if (banner) banner.style.backgroundImage = "url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop')";
                            showToast("Banner Equipped: Topographic Master", "success");
                        } else if (itemName.includes('Field Explorer')) {
                            const avatarEmoji = document.getElementById('avatar-emoji');
                            if (avatarEmoji) avatarEmoji.innerText = '🧗';
                            showToast("Avatar Equipped: Field Explorer", "success");
                        } else if (itemName.includes('Chronos Protocol')) {
                            showToast("Chronos Protocol is a PASSIVE power-up. It applies automatically in games.", "info");
                        }
                    });
                });
            }
        }
        
        // Sync to Firestore
        syncUserProgress(userXP, compassCoins);
        updateHomeStatsUI();
    }

    function updateHomeStatsUI() {
        const level = Math.floor(userXP / 100) + 1;
        const currentLevelXP = userXP % 100;
        
        // Update Home XP text and bar
        const homeXpDisplay = document.getElementById('home-xp-display');
        if (homeXpDisplay) homeXpDisplay.innerText = `${userXP} XP`;
        const homeXpBar = document.getElementById('home-xp-bar');
        if (homeXpBar) homeXpBar.style.width = `${(currentLevelXP / 100) * 100}%`;
        
        // Update Rank on Home
        const homeRankBadge = document.getElementById('home-rank-badge');
        const homeRankName = document.getElementById('home-rank-name');
        
        const rankTitles = [
            { name: "Bronze I", icon: "🥉" },
            { name: "Silver II", icon: "🥈" },
            { name: "Gold III", icon: "🥇" },
            { name: "Diamond IV", icon: "💎" },
            { name: "Geo Champion", icon: "👑" }
        ];
        const rankIdx = Math.min(level - 1, rankTitles.length - 1);
        if (homeRankBadge) homeRankBadge.innerText = rankTitles[rankIdx].icon;
        if (homeRankName) homeRankName.innerText = rankTitles[rankIdx].name;
        
        // Coins on Home
        const homeCoins = document.getElementById('home-coins-display');
        if (homeCoins) homeCoins.innerText = `${compassCoins} 🧭`;
        
        // We can estimate games played/lessons done from localStorage or just show mock logic for now
        const homeLessonsDone = document.getElementById('home-lessons-done');
        const homeLessonsBar = document.getElementById('home-lessons-bar');
        const homeLessonsProg = document.getElementById('home-lessons-progress'); // in quick access
        
        // Calculate finished lessons if possible, or roughly based on XP
        const estimatedLessons = Math.min(Math.floor(userXP / 20), 48); 
        if (homeLessonsDone) homeLessonsDone.innerText = `${estimatedLessons}/48`;
        if (homeLessonsBar) homeLessonsBar.style.width = `${(estimatedLessons / 48) * 100}%`;
        if (homeLessonsProg) homeLessonsProg.style.width = `${(estimatedLessons / 48) * 100}%`;
        
        const homeGamesCount = document.getElementById('home-games-count');
        const homeGamesBar = document.getElementById('home-games-bar');
        const estimatedGames = Math.min(Math.floor(userXP / 15), 50);
        if (homeGamesCount) homeGamesCount.innerText = estimatedGames;
        if (homeGamesBar) homeGamesBar.style.width = `${(estimatedGames / 50) * 100}%`;
    }

    async function populateLeaderboardUI() {
        const board = document.getElementById('home-leaderboard');
        if (!board) return;
        
        board.innerHTML = `<div style="text-align:center;color:#555;font-size:0.8rem;font-family:'JetBrains Mono',monospace;padding:20px;">Se încarcă clasamentul...</div>`;
        
        const leaders = await getLeaderboard();
        if (leaders.length === 0) {
            board.innerHTML = `<div style="text-align:center;color:#555;font-size:0.8rem;font-family:'JetBrains Mono',monospace;padding:20px;">Nu există date suficiente.</div>`;
            return;
        }
        
        board.innerHTML = leaders.map((l, index) => {
            const isMe = currentUser && l.id === currentUser.uid;
            let medal = `#${index + 1}`;
            if (index === 0) medal = '🥇';
            if (index === 1) medal = '🥈';
            if (index === 2) medal = '🥉';
            
            return `
                <div style="display:flex;align-items:center;justify-content:space-between;background:${isMe ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)'};padding:12px;border-radius:10px;border:1px solid ${isMe ? 'rgba(0,212,255,0.3)' : 'transparent'};">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="font-family:'Orbitron',sans-serif;color:${index < 3 ? 'var(--gold-bright)' : '#888'};font-size:1.1rem;font-weight:700;width:24px;text-align:center;">${medal}</div>
                        <div>
                            <div style="font-weight:700;color:${isMe ? '#00d4ff' : 'white'};font-size:0.9rem;">${l.displayName || 'Anonim'}</div>
                            <div style="font-size:0.7rem;color:#aaa;">Level ${Math.floor((l.xp || 0) / 100) + 1}</div>
                        </div>
                    </div>
                    <div style="font-family:'JetBrains Mono',monospace;color:#00e676;font-weight:bold;">${l.xp || 0} XP</div>
                </div>
            `;
        }).join('');
    }

    let shopAudio = null;
    let currentShopShelfIndex = 0;

    function handleShopLogic(targetPageId) {
        if (targetPageId === 'shop') {
            // Stop ambient, play shop music
            stopAmbientMusic();
            if (!shopAudio) {
                shopAudio = new Audio('assets/night-nook-pecan-pie-main-version-43149-02-17 - Copie.mp3');
                shopAudio.loop = true;
                shopAudio.volume = 0.5;
            }
            shopAudio.play().catch(e => console.log('Shop audio blocked:', e));
        } else {
            // Leave shop
            if (shopAudio) {
                shopAudio.pause();
            }
            // If they returned to a page that needs ambient music, start it again
            // Only if they've passed the welcome screen
            if (!document.getElementById('welcome-overlay')) {
                startAmbientMusic();
            }
        }
    }

    // Shop 3D Setup
    const shopContainer = document.getElementById('shop-3d-container');
    const shopPrevBtn = document.getElementById('shop-prev-btn');
    const shopNextBtn = document.getElementById('shop-next-btn');
    const shopCategoryTitle = document.getElementById('shop-category-title');
    
    if (shopContainer && shopPrevBtn && shopNextBtn && shopCategoryTitle) {
        const categories = shopContainer.querySelectorAll('.shop-category-view');
        const totalCategories = categories.length;

        function updateShopView() {
            shopContainer.style.transform = `translateX(-${currentShopShelfIndex * 100}vw)`;
            shopCategoryTitle.textContent = categories[currentShopShelfIndex].getAttribute('data-title');
            shopPrevBtn.style.display = currentShopShelfIndex > 0 ? 'block' : 'none';
            shopNextBtn.style.display = currentShopShelfIndex < totalCategories - 1 ? 'block' : 'none';
        }

        shopPrevBtn.addEventListener('click', () => {
            if (currentShopShelfIndex > 0) {
                playSound('click');
                currentShopShelfIndex--;
                updateShopView();
            }
        });

        shopNextBtn.addEventListener('click', () => {
            if (currentShopShelfIndex < totalCategories - 1) {
                playSound('click');
                currentShopShelfIndex++;
                updateShopView();
            }
        });

        updateShopView();
    }

    // Page Navigation
    const navLinks = document.querySelectorAll('[data-page]');
    const pages = document.querySelectorAll('.page');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = link.getAttribute('data-page');
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            if(link.classList.contains('nav-link')) {
                link.classList.add('active');
            } else {
                const matchingNav = document.querySelector(`.nav-link[data-page="${targetPageId}"]`);
                if (matchingNav) matchingNav.classList.add('active');
            }
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `page-${targetPageId}`) page.classList.add('active');
            });
            window.scrollTo(0, 0);
            
            if (targetPageId === 'home') {
                updateHomeStatsUI();
                populateLeaderboardUI();
            }

            handleShopLogic(targetPageId);
        });
    });

    // Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-links');
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => navMenu.classList.toggle('open'));
    }

    const overlay = document.getElementById('welcome-overlay');
    // Use event delegation so we catch clicks even if the innerHTML was replaced by 3D globe script
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            const isBtnClick = e.target.closest('#start-experience-btn');
            const isFingerprintClick = e.target.closest('.fingerprint-wrap') || e.target.closest('.group'); 
            
            if (isBtnClick || isFingerprintClick) {
                if (overlay.dataset.authenticating) return;
                overlay.dataset.authenticating = "true";
                
                playSound('click'); // Can also add a specific scan sound later
                
                const bioSection = document.getElementById('welcome-biometric');
                const loadSection = document.getElementById('welcome-loading');
                const progFill = document.getElementById('welcome-progress-fill');
                const progText = document.getElementById('welcome-progress-pct');
                const statusText = document.getElementById('welcome-loading-text');

                // Switch to Loading View
                if (bioSection) bioSection.style.display = 'none';
                if (loadSection) {
                    loadSection.classList.remove('hidden');
                    loadSection.style.display = 'flex';
                }

                let progress = 0;
                
                const interval = setInterval(() => {
                    progress += Math.random() * 8 + 4; // increment fast enough for a short load
                    if (progress > 100) progress = 100;
                    
                    if (progFill) progFill.style.width = `${progress}%`;
                    if (progText) progText.innerText = `${Math.floor(progress)}%`;

                    if (statusText) {
                        if (progress > 30 && progress < 60) {
                            statusText.innerText = "Loading Topographical Data...";
                        } else if (progress > 60 && progress < 90) {
                            statusText.innerText = "Decrypting Modules...";
                        } else if (progress >= 100) {
                            statusText.innerText = "Access Granted.";
                            statusText.style.color = "#00e676";
                        }
                    }

                    if (progress >= 100) {
                        clearInterval(interval);
                        startAmbientMusic();
                        playSound('correct'); 

                        setTimeout(() => {
                            overlay.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                            overlay.style.opacity = '0';
                            overlay.style.transform = 'scale(1.1)';
                            
                            setTimeout(() => {
                                overlay.remove();
                                initGlobe();
                            }, 1000);
                        }, 500);
                    }
                }, 100);
            }
        });
    }

    // --- HUD Coordination Logic ---
    function updateHUDCoords() {
        const latEl = document.getElementById('hud-lat');
        const lngEl = document.getElementById('hud-lng');
        if (latEl && lngEl) {
            setInterval(() => {
                const latBase = 44.4268;
                const lngBase = 26.1025;
                const jitter = () => (Math.random() - 0.5) * 0.001;
                latEl.innerText = (latBase + jitter()).toFixed(4);
                lngEl.innerText = (lngBase + jitter()).toFixed(4);
            }, 2000);
        }
    }
    updateHUDCoords();

    // Lang Toggle
    const langToggle = document.getElementById('lang-toggle');
    const langFlag = document.getElementById('current-lang-flag');
    if (langToggle && langFlag) {
        // Set initial flag based on saved/default language
        langFlag.innerText = currentLang === 'ro' ? '🇷🇴' : '🇬🇧';
        langToggle.addEventListener('click', () => {
            // currentLang is a live ES module binding — always reads the latest value
            const newLang = currentLang === 'ro' ? 'en' : 'ro';
            setLanguage(newLang);
            langFlag.innerText = newLang === 'ro' ? '🇷🇴' : '🇬🇧';
        });
    }

    // Listen for language changes to re-render ALL dynamic content
    document.addEventListener('languageChanged', () => {
        // 1. Update every element that has a data-i18n attribute
        updateDOMTranslations();
        // 2. Re-render dynamically-built lesson module cards and lesson lists
        initLessons();
        // 3. Re-render quiz content
        initQuizzes();
    });

    // Game Launch Event Listener (from lessons or elsewhere)
    document.addEventListener('launch-game', (e) => {
        const gameId = e.detail.game;
        const gamesSelection = document.getElementById('games-selection');
        const activeGameContainer = document.getElementById('active-game-container');
        
        if (gamesSelection && activeGameContainer) {
            gamesSelection.classList.add('hidden');
            activeGameContainer.classList.remove('hidden');
            activeGameContainer.innerHTML = ''; // clear previous
            
            // Call startGame from games.js directly
            startGame(gameId, activeGameContainer);
            showToast(`Lansare joc: ${gameId}...`, 'info');
        }
    });

    // XP Event Listener
    document.addEventListener('xpGained', (e) => {
        const amount = e.detail.amount;
        userXP += amount;
        localStorage.setItem('userXP', userXP);
        showToast(currentLang === 'ro' ? `Ai primit +${amount} XP` : `Received +${amount} XP`, "success");
        updateStats();

        // Animated XP Arrow
        const xpNavEl = document.querySelector('.nav-xp');
        if (xpNavEl) {
            const arrow = document.createElement('div');
            arrow.innerText = `⬆ +${amount} XP`;
            arrow.style.position = 'absolute';
            arrow.style.left = '50%';
            arrow.style.bottom = '-10px';
            arrow.style.transform = 'translateX(-50%)';
            arrow.style.color = '#00e676';
            arrow.style.fontWeight = 'bold';
            arrow.style.fontSize = '1.2rem';
            arrow.style.textShadow = '0 0 10px #00e676';
            arrow.style.zIndex = '9999';
            arrow.style.animation = 'floatUpXP 1.5s ease-out forwards';
            arrow.style.pointerEvents = 'none';
            
            // Inject keyframes if not exists
            if (!document.getElementById('xp-arrow-keyframe')) {
                const style = document.createElement('style');
                style.id = 'xp-arrow-keyframe';
                style.innerHTML = `
                    @keyframes floatUpXP {
                        0% { opacity: 0; transform: translate(-50%, 10px) scale(0.5); }
                        20% { opacity: 1; transform: translate(-50%, 0px) scale(1.2); }
                        80% { opacity: 1; transform: translate(-50%, -30px) scale(1); }
                        100% { opacity: 0; transform: translate(-50%, -50px) scale(0.8); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            xpNavEl.style.position = 'relative';
            xpNavEl.appendChild(arrow);
            setTimeout(() => arrow.remove(), 1500);
        }
    });

    // Market Logic
    const buyBtns = document.querySelectorAll('.buy-btn');
    buyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.shop-item');
            const price = parseInt(item.getAttribute('data-price'));
            const itemName = item.querySelector('h4').innerText;
            if (compassCoins >= price) {
                compassCoins -= price;
                inventory.push(itemName);
                btn.innerText = "Owned";
                btn.disabled = true;
                item.classList.add('owned');
                showToast(`Successfully bought ${itemName}!`, "success");
                updateStats();
            } else {
                item.classList.add('shake');
                setTimeout(() => item.classList.remove('shake'), 500);
                showToast("Insufficient Funds!", "error");
            }
        });
    });

    // Games Integration
    document.querySelectorAll('.start-game-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const gameId = e.target.closest('.game-card').getAttribute('data-game');
            startGame(gameId);
        });
    });

    const gameBackBtn = document.getElementById('game-back-btn');
    if (gameBackBtn) {
        gameBackBtn.addEventListener('click', () => {
            endGame();
        });
    }

    document.addEventListener('coinsGained', (e) => {
        compassCoins += e.detail.amount;
        localStorage.setItem('compassCoins', compassCoins);
        updateStats();
    });

    // Avatar Upload Logic
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarImage = document.getElementById('avatar-image');
    const avatarEmoji = document.getElementById('avatar-emoji');

    if (avatarUpload && avatarImage && avatarEmoji) {
        // Load saved avatar
        const savedAvatar = localStorage.getItem('customAvatar');
        if (savedAvatar) {
            avatarImage.src = savedAvatar;
            avatarImage.classList.remove('hidden');
            avatarEmoji.classList.add('hidden');
        }

        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Str = event.target.result;
                    localStorage.setItem('customAvatar', base64Str);
                    avatarImage.src = base64Str;
                    avatarImage.classList.remove('hidden');
                    avatarEmoji.classList.add('hidden');
                    playSound('click');
                    showToast("Profile image updated!", "success");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Banner Upload logic
    const bannerUpload = document.getElementById('banner-upload');
    const dossierBanner = document.getElementById('dossier-banner');
    if (bannerUpload && dossierBanner) {
        bannerUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    dossierBanner.style.backgroundImage = `url('${event.target.result}')`;
                    playSound('click');
                    showToast("Banner updated!", "success");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Dossier UI Elements
    const saveDossierBtn = document.getElementById('save-dossier-btn');
    if (saveDossierBtn) {
        saveDossierBtn.addEventListener('click', async () => {
            playSound('click');
            saveDossierBtn.disabled = true;
            const originalText = saveDossierBtn.innerHTML;
            saveDossierBtn.innerHTML = "📸 Generare...";
            
            try {
                const card = document.querySelector('#page-profile .relative.rounded-2xl.overflow-hidden');
                if (card) {
                    const canvas = await html2canvas(card, {
                        useCORS: true,
                        backgroundColor: '#0a0e17',
                        scale: 2 // Higher quality
                    });
                    
                    const link = document.createElement('a');
                    link.download = `Agent_Dossier_${document.getElementById('profile-name').innerText}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    
                    showToast("Dosarul a fost salvat ca imagine!", "success");
                }
            } catch (err) {
                console.error("Screenshot error:", err);
                showToast("Eroare la generarea imaginii.", "error");
            } finally {
                saveDossierBtn.disabled = false;
                saveDossierBtn.innerHTML = originalText;
            }
        });
    }

    // Theme Customizer
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            playSound('click');
            const theme = e.currentTarget.getAttribute('data-theme');
            
            // Just simulate the effect by showing a toast or adding class to body. 
            // Since it's a prototype, we'll set CSS variables on the root.
            if (theme === 'blue') {
                document.documentElement.style.setProperty('--neon-blue', '#00d4ff');
                document.documentElement.style.setProperty('--blue-gradient', 'linear-gradient(90deg, #00d4ff, #0077ff)');
                showToast("Theme: Midnight Blue applied", "info");
            } else if (theme === 'emerald') {
                document.documentElement.style.setProperty('--neon-blue', '#00e676');
                document.documentElement.style.setProperty('--blue-gradient', 'linear-gradient(90deg, #00e676, #00a352)');
                showToast("Theme: Emerald Spy applied", "success");
            } else if (theme === 'red') {
                document.documentElement.style.setProperty('--neon-blue', '#ff4466');
                document.documentElement.style.setProperty('--blue-gradient', 'linear-gradient(90deg, #ff4466, #cc0033)');
                showToast("Theme: Volcanic Red applied", "error");
            }
        });
    });

    // Music Selection Logic
    const musicGrid = document.getElementById('music-selection-grid');
    if (musicGrid) {
        function renderMusicGrid() {
            const currentId = getCurrentMusicId();
            musicGrid.innerHTML = musicLibrary.map(track => `
                <div class="music-track-card p-3 rounded-lg border ${track.id === currentId ? 'border-[#00d4ff] bg-[#00d4ff]/10' : 'border-white/10 bg-white/5'} cursor-pointer hover:border-white/30 transition-all flex items-center justify-between group" data-music-id="${track.id}">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-[#1a2440] flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                            ${track.id === currentId ? '▶️' : '🎵'}
                        </div>
                        <span class="text-xs font-bold text-white">${track.name}</span>
                    </div>
                    ${track.id === currentId ? '<span class="text-[10px] text-[#00d4ff] font-orbitron animate-pulse">ACTIVE</span>' : ''}
                </div>
            `).join('');

            musicGrid.querySelectorAll('.music-track-card').forEach(card => {
                card.addEventListener('click', () => {
                    const musicId = card.getAttribute('data-music-id');
                    setBackgroundMusic(musicId);
                    playSound('click');
                    renderMusicGrid();
                    showToast(`Playing: ${musicLibrary.find(m => m.id === musicId).name}`, "info");
                });
            });
        }
        renderMusicGrid();
    }

    // Sound Theme Logic
    const currentSound = getCurrentSoundTheme();
    document.querySelectorAll('.sound-theme-btn').forEach(btn => {
        if (btn.getAttribute('data-theme-key') === currentSound) {
            btn.classList.add('border-[#00d4ff]', 'bg-[#00d4ff]/20');
            btn.classList.remove('border-white/20', 'bg-transparent');
            btn.style.color = '#fff';
        }
        btn.addEventListener('click', (e) => {
            const key = e.currentTarget.getAttribute('data-theme-key');
            setSoundTheme(key);
            
            // Update UI
            document.querySelectorAll('.sound-theme-btn').forEach(b => {
                b.classList.remove('border-[#00d4ff]', 'bg-[#00d4ff]/20', 'border-[#d4a843]', 'bg-[#d4a843]/20', 'border-[#cc3355]', 'bg-[#cc3355]/20', 'border-[#2eaa6e]', 'bg-[#2eaa6e]/20');
                b.classList.add('border-white/20', 'bg-transparent');
                b.style.color = '';
            });
            
            const colorClassMap = {
                'cyber': ['border-[#00d4ff]', 'bg-[#00d4ff]/20'],
                'classic': ['border-[#d4a843]', 'bg-[#d4a843]/20'],
                'retro': ['border-[#cc3355]', 'bg-[#cc3355]/20'],
                'minimal': ['border-[#2eaa6e]', 'bg-[#2eaa6e]/20']
            };
            const cClasses = colorClassMap[key] || colorClassMap.cyber;
            e.currentTarget.classList.add(...cClasses);
            e.currentTarget.classList.remove('border-white/20', 'bg-transparent');
            e.currentTarget.style.color = '#fff';
            
            showToast(`Sound theme changed to ${key}`, "info");
        });
    });

    // Avatar Customizer Logic
    const emojis = ['👨‍💼', '👩‍💼', '🕵️‍♂️', '🕵️‍♀️', '🥷', '👩‍🚀', '👨‍🚀', '🧙‍♂️', '🦹', '🦸', '🧜‍♂️', '🧛', '🧟', '🧞', '🧚', '💂‍♂️', '👮', '👷', '🧑‍🔬', '🧑‍💻'];
    const avatarGrid = document.getElementById('avatar-grid');
    let selectedAvatarEmoji = localStorage.getItem('profileEmoji') || '👨‍💼';
    
    // Set initial avatar emoji on UI
    const profileAvatarEmojiEl = document.getElementById('avatar-emoji');
    if(profileAvatarEmojiEl && !localStorage.getItem('customAvatar')) {
        profileAvatarEmojiEl.innerText = selectedAvatarEmoji;
    }

    if (avatarGrid) {
        avatarGrid.innerHTML = emojis.map(emoji => `
            <div class="avatar-option ${emoji === selectedAvatarEmoji ? 'selected' : ''}" style="text-align:center;font-size:1.8rem;padding:8px;border-radius:8px;cursor:pointer;transition:all 0.2s;background:${emoji === selectedAvatarEmoji ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)'};border:1px solid ${emoji === selectedAvatarEmoji ? '#00d4ff' : 'transparent'};" data-emoji="${emoji}">
                ${emoji}
            </div>
        `).join('');

        const options = avatarGrid.querySelectorAll('.avatar-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                playSound('click');
                options.forEach(o => {
                    o.classList.remove('selected');
                    o.style.background = 'rgba(255,255,255,0.05)';
                    o.style.borderColor = 'transparent';
                });
                opt.classList.add('selected');
                opt.style.background = 'rgba(0,212,255,0.2)';
                opt.style.borderColor = '#00d4ff';
                selectedAvatarEmoji = opt.getAttribute('data-emoji');
            });
        });

        const applyBtn = document.getElementById('apply-avatar-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                localStorage.setItem('profileEmoji', selectedAvatarEmoji);
                localStorage.removeItem('customAvatar'); // clear custom img if using emoji
                if (profileAvatarEmojiEl) {
                    profileAvatarEmojiEl.innerText = selectedAvatarEmoji;
                    profileAvatarEmojiEl.classList.remove('hidden');
                    const imgEl = document.getElementById('avatar-image');
                    if (imgEl) imgEl.classList.add('hidden');
                }
                playSound('correct');
                showToast("Avatar successfully updated!", "success");
            });
        }
        
        const randomBtn = document.getElementById('random-avatar-btn');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                const randomOpt = Array.from(options).find(o => o.getAttribute('data-emoji') === randomEmoji);
                if (randomOpt) randomOpt.click();
            });
        }
    }

    // Shop Logic
    document.querySelectorAll('.shop-tab-tw').forEach(tab => {
        tab.addEventListener('click', (e) => {
            playSound('click');
            document.querySelectorAll('.shop-tab-tw').forEach(t => t.classList.remove('active', 'bg-gradient-to-r', 'from-[#00d4ff]/20', 'to-[#0077ff]/20', 'border-[#00d4ff]/50', 'text-white'));
            document.querySelectorAll('.shop-tab-tw').forEach(t => t.classList.add('bg-[#121a2e]', 'text-gray-400'));
            
            e.currentTarget.classList.remove('bg-[#121a2e]', 'text-gray-400');
            e.currentTarget.classList.add('active', 'bg-gradient-to-r', 'from-[#00d4ff]/20', 'to-[#0077ff]/20', 'border-[#00d4ff]/50', 'text-white');
            
            const targetType = e.currentTarget.getAttribute('data-tab');
            document.querySelectorAll('.shop-item').forEach(item => {
                if (targetType === 'all' || item.getAttribute('data-type') + 's' === targetType || (item.getAttribute('data-type') === 'banner' && targetType === 'banners')) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const shopItem = e.currentTarget.closest('.shop-item');
            const price = parseInt(shopItem.getAttribute('data-price'));
            const itemId = shopItem.getAttribute('data-id');
            const itemName = shopItem.querySelector('h4').innerText;

            if (inventory.includes(itemName)) {
                showToast(t('shop.toast_owned'), "info");
                playSound('click');
                return;
            }

            if (compassCoins >= price) {
                compassCoins -= price;
                inventory.push(itemName);
                localStorage.setItem('compassCoins', compassCoins);
                localStorage.setItem('inventory', JSON.stringify(inventory));
                updateStats();
                showToast(`${t('shop.toast_purchased')}: ${itemName}`, "success");
                playSound('correct');
            } else {
                showToast(t('shop.toast_insufficient'), "error");
                playSound('wrong');
            }
        });
    });

    // Click Sounds
    document.querySelectorAll('.btn, .nav-link, .shop-tab').forEach(btn => {
        btn.addEventListener('click', () => playSound('click'));
    });

    // Initialize stats
    updateStats();

    // Edit Name Button
    const editNameBtn = document.getElementById('edit-name-btn');
    const profileNameEl = document.getElementById('profile-name');
    if (editNameBtn && profileNameEl) {
        // Load saved name
        const savedName = localStorage.getItem('profileName');
        if (savedName) profileNameEl.textContent = savedName;

        let editing = false;
        editNameBtn.addEventListener('click', () => {
            editing = !editing;
            if (editing) {
                profileNameEl.contentEditable = 'true';
                profileNameEl.style.borderBottomColor = 'var(--neon-blue)';
                profileNameEl.style.cursor = 'text';
                profileNameEl.focus();
                // Move cursor to end
                const range = document.createRange();
                range.selectNodeContents(profileNameEl);
                range.collapse(false);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                editNameBtn.innerHTML = '✅ Save';
                editNameBtn.style.background = 'rgba(0,230,118,0.15)';
                editNameBtn.style.borderColor = '#00e676';
                editNameBtn.style.color = '#00e676';
            } else {
                profileNameEl.contentEditable = 'false';
                profileNameEl.style.borderBottomColor = 'transparent';
                profileNameEl.style.cursor = 'default';
                const newName = profileNameEl.textContent.trim() || 'Explorer';
                profileNameEl.textContent = newName;
                localStorage.setItem('profileName', newName);
                editNameBtn.innerHTML = '✏️ Edit';
                editNameBtn.style.background = 'rgba(0,212,255,0.1)';
                editNameBtn.style.borderColor = 'rgba(0,212,255,0.3)';
                editNameBtn.style.color = '#00d4ff';
                showToast(`✅ Name saved: ${newName}`, 'success');
                playSound('correct');
            }
        });
        // Save on Enter
        profileNameEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); editNameBtn.click(); }
        });
    }

    // ── COACHING LOGIC ──────────────────────────────────────────
    const coachingSubmitBtn = document.getElementById('coaching-submit-btn');
    const coachingQuestionnaire = document.getElementById('coaching-questionnaire');
    const coachingDashboard = document.getElementById('coaching-dashboard');
    const coachingResetBtn = document.getElementById('coaching-reset-btn');
    const mentorGrid = document.getElementById('mentor-grid');

    // If coaching was already done, show dashboard
    if (localStorage.getItem('coachingInterests') && coachingQuestionnaire && coachingDashboard) {
        coachingQuestionnaire.style.display = 'none';
        coachingDashboard.classList.remove('hidden');
        filterMentors(JSON.parse(localStorage.getItem('coachingInterests')));
    }

    if (coachingSubmitBtn) {
        coachingSubmitBtn.addEventListener('click', () => {
            const selected = Array.from(document.querySelectorAll('input[name="interest"]:checked')).map(cb => cb.value);
            if (selected.length === 0) {
                showToast('Selectează cel puțin un interes!', 'error');
                return;
            }
            localStorage.setItem('coachingInterests', JSON.stringify(selected));
            // Animate out questionnaire
            coachingQuestionnaire.style.transition = 'opacity 0.5s, transform 0.5s';
            coachingQuestionnaire.style.opacity = '0';
            coachingQuestionnaire.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                coachingQuestionnaire.style.display = 'none';
                coachingDashboard.classList.remove('hidden');
                coachingDashboard.style.opacity = '0';
                coachingDashboard.style.transform = 'translateY(20px)';
                coachingDashboard.style.transition = 'opacity 0.5s, transform 0.5s';
                filterMentors(selected);
                requestAnimationFrame(() => {
                    coachingDashboard.style.opacity = '1';
                    coachingDashboard.style.transform = 'translateY(0)';
                });
            }, 500);
            playSound('correct');
        });
    }

    if (coachingResetBtn) {
        coachingResetBtn.addEventListener('click', () => {
            localStorage.removeItem('coachingInterests');
            coachingDashboard.classList.add('hidden');
            coachingQuestionnaire.style.display = '';
            coachingQuestionnaire.style.opacity = '1';
            coachingQuestionnaire.style.transform = '';
            // Uncheck all
            document.querySelectorAll('input[name="interest"]').forEach(cb => {
                cb.checked = false;
                const span = cb.nextElementSibling;
                if (span) { span.style.background = 'transparent'; span.style.borderColor = 'rgba(0,212,255,0.25)'; span.style.color = 'rgba(255,255,255,0.55)'; }
            });
        });
    }

    function filterMentors(selected) {
        if (!mentorGrid) return;
        const allCards = mentorGrid.querySelectorAll('.mentor-card');
        let shown = 0;
        allCards.forEach(card => {
            const cardInterests = card.getAttribute('data-interests')?.split(',') || [];
            const matches = selected.length === 0 || selected.some(s => cardInterests.includes(s));
            card.style.display = matches ? '' : 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            card.style.transition = 'opacity 0.4s, transform 0.4s';
            if (matches) {
                shown++;
                const delay = shown * 80;
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, delay);
            }
        });
        const titleEl = document.getElementById('coaching-result-title');
        if (titleEl) titleEl.textContent = `${shown} Mentor${shown !== 1 ? 'i' : ''} Recomandat${shown !== 1 ? 'i' : ''}`;
    }

    // ── UNIVERSAL CHAT LOGIC ───────────────────────────────────────
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('community-chat-messages');
    const chatAttachBtn = document.getElementById('chat-attach-btn');
    const chatFileInput = document.getElementById('chat-file-input');
    const chatAttachPreview = document.getElementById('chat-attachment-preview');
    const chatRemoveAttach = document.getElementById('chat-remove-attachment');
    let currentAttachment = null;

    if (chatInput && chatSendBtn && chatMessages) {
        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (!text && !currentAttachment) return;
            
            const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            let attachHtml = '';
            
            if (currentAttachment) {
                attachHtml = `<div style="margin-top:8px; border-radius:8px; overflow:hidden; border:1px solid rgba(0,212,255,0.3); max-width:200px;"><img src="${currentAttachment}" style="width:100%; display:block;"></div>`;
            }

            const msgHtml = `
                <div style="display:flex; gap:10px; animation: fadeIn 0.3s ease;">
                    <div style="width:30px; height:30px; background:#00d4ff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.9rem; flex-shrink:0;">👤</div>
                    <div style="background:rgba(0,212,255,0.1); padding:10px 14px; border-radius:0 12px 12px 12px; border:1px solid rgba(0,212,255,0.2);">
                        <div style="font-size:0.75rem; color:#00d4ff; font-weight:bold; margin-bottom:4px;">Tu <span style="color:rgba(255,255,255,0.3); font-weight:normal; font-size:0.65rem;">Astăzi la ${time}</span></div>
                        <div style="font-size:0.85rem; color:white; line-height:1.4;">${text}</div>
                        ${attachHtml}
                    </div>
                </div>
            `;
            
            chatMessages.insertAdjacentHTML('beforeend', msgHtml);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            chatInput.value = '';
            currentAttachment = null;
            chatAttachPreview.classList.add('hidden');
            playSound('click');

            // Simulate reply
            setTimeout(() => {
                const replyHtml = `
                    <div style="display:flex; gap:10px; animation: fadeIn 0.3s ease;">
                        <div style="width:30px; height:30px; background:#d4a843; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.9rem; flex-shrink:0;">🕵️‍♂️</div>
                        <div style="background:rgba(255,255,255,0.05); padding:10px 14px; border-radius:0 12px 12px 12px;">
                            <div style="font-size:0.75rem; color:#d4a843; font-weight:bold; margin-bottom:4px;">Elena V. <span style="color:rgba(255,255,255,0.3); font-weight:normal; font-size:0.65rem;">Astăzi la ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                            <div style="font-size:0.85rem; color:white; line-height:1.4;">Interesant punct de vedere! Hai să detaliem asta pe chat privat sau într-o sesiune scurtă dacă vrei.</div>
                        </div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', replyHtml);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                playSound('correct'); // subtle notification sound
            }, 3000);
        };

        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Attachment Logic
        if (chatAttachBtn && chatFileInput) {
            chatAttachBtn.addEventListener('click', () => chatFileInput.click());
            
            chatFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        currentAttachment = ev.target.result;
                        chatAttachPreview.classList.remove('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (chatRemoveAttach) {
            chatRemoveAttach.addEventListener('click', () => {
                currentAttachment = null;
                chatFileInput.value = '';
                chatAttachPreview.classList.add('hidden');
            });
        }
    }

    // ── SHOP DOTS ────────────────────────────────────────────────
    const shopDotsEl = document.getElementById('shop-dots');
    if (shopDotsEl && shopContainer) {
        const cats = shopContainer.querySelectorAll('.shop-category-view');
        cats.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${i===0?'#00d4ff':'rgba(255,255,255,0.2)'};transition:all 0.3s;cursor:pointer;`;
            dot.addEventListener('click', () => { currentShopShelfIndex = i; updateShopViewGlobal(); });
            shopDotsEl.appendChild(dot);
        });
    }

    function updateShopViewGlobal() {
        if (!shopContainer) return;
        const cats = shopContainer.querySelectorAll('.shop-category-view');
        shopContainer.style.transform = `translateX(-${currentShopShelfIndex * 100}%)`;
        if (shopCategoryTitle) shopCategoryTitle.textContent = cats[currentShopShelfIndex]?.getAttribute('data-title') || '';
        if (shopPrevBtn) shopPrevBtn.style.display = currentShopShelfIndex > 0 ? 'block' : 'none';
        if (shopNextBtn) shopNextBtn.style.display = currentShopShelfIndex < cats.length - 1 ? 'block' : 'none';
        // Update dots
        if (shopDotsEl) {
            shopDotsEl.querySelectorAll('div').forEach((d, i) => {
                d.style.background = i === currentShopShelfIndex ? '#00d4ff' : 'rgba(255,255,255,0.2)';
                d.style.width = i === currentShopShelfIndex ? '22px' : '8px';
                d.style.borderRadius = '4px';
            });
        }
    }

    // Override the previous shopPrevBtn/shopNextBtn listeners with the new dot-aware version
    if (shopPrevBtn) { shopPrevBtn.onclick = () => { if(currentShopShelfIndex>0){currentShopShelfIndex--;updateShopViewGlobal();playSound('click');} }; }
    if (shopNextBtn) { shopNextBtn.onclick = () => { const cats=shopContainer?.querySelectorAll('.shop-category-view'); if(cats&&currentShopShelfIndex<cats.length-1){currentShopShelfIndex++;updateShopViewGlobal();playSound('click');} }; }
    updateShopViewGlobal();

    // 3D Globe
    function initGlobe() {
        const globeContainer = document.getElementById('globe-container');
        if (!globeContainer || !window.Globe) return;
        if(globeContainer.innerHTML !== '') return;
        const world = Globe()(globeContainer)
            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
            .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
            .pointOfView({ lat: 45, lng: 25, altitude: 2 })
            .autoRotate(true)
            .autoRotateSpeed(1.5);
        const markers = [
            { lat: 44.4268, lng: 26.1025, size: 20, color: 'red', name: 'Bucharest' },
            { lat: 40.7128, lng: -74.0060, size: 20, color: 'blue', name: 'New York (UN HQ)' },
            { lat: 50.8503, lng: 4.3517, size: 20, color: 'yellow', name: 'Brussels (EU/NATO)' }
        ];
        world.pointsData(markers).pointAltitude('size').pointColor('color');
        window.addEventListener('resize', () => {
            world.width(globeContainer.clientWidth);
            world.height(globeContainer.clientHeight);
        });
    }
}

// ── GLOBAL handleBuy (called from inline onclick in shop items) ──
window.handleBuy = function(btn) {
    const item = btn.closest('.shop-item');
    if (!item) return;
    const price = parseInt(btn.getAttribute('data-price') || item.getAttribute('data-price') || 0);
    const itemId = btn.getAttribute('data-id') || item.getAttribute('data-id') || '';
    const nameEl = item.querySelector('h4');
    const itemName = nameEl ? nameEl.innerText : itemId;

    let compassCoins = parseInt(localStorage.getItem('compassCoins')) || 0;
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    if (inventory.includes(itemId)) {
        btn.textContent = '✓ Deja deții';
        btn.style.background = 'rgba(0,230,118,0.2)';
        btn.style.color = '#00e676';
        btn.style.borderColor = '#00e676';
        return;
    }
    if (compassCoins >= price) {
        compassCoins -= price;
        inventory.push(itemId);
        localStorage.setItem('compassCoins', compassCoins);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        // Update all coin displays
        document.querySelectorAll('#shop-balance, .coin-count').forEach(el => el.textContent = compassCoins);
        btn.textContent = '✓ Cumpărat!';
        btn.style.background = 'rgba(0,230,118,0.2)';
        btn.style.color = '#00e676';
        btn.style.borderColor = '#00e676';
        btn.disabled = true;
        // Particle burst effect
        item.style.transition = 'box-shadow 0.3s';
        item.style.boxShadow = '0 0 40px rgba(0,230,118,0.6)';
        setTimeout(() => { item.style.boxShadow = ''; }, 800);
        // Show toast
        const toast = document.createElement('div');
        toast.textContent = `✅ Ai cumpărat: ${itemName}`;
        toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#00e676;color:#07101d;padding:12px 24px;border-radius:12px;font-family:Orbitron,sans-serif;font-weight:bold;font-size:0.85rem;z-index:9999;box-shadow:0 0 25px rgba(0,230,118,0.5);animation:fadeIn 0.3s ease;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    } else {
        item.style.animation = 'shake 0.4s ease';
        setTimeout(() => item.style.animation = '', 500);
        const toast = document.createElement('div');
        toast.textContent = '❌ Coins insuficienți!';
        toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#ff4466;color:white;padding:12px 24px;border-radius:12px;font-family:Orbitron,sans-serif;font-weight:bold;font-size:0.85rem;z-index:9999;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
};

// ── GLOBAL SHOP NAV (used by inline onclick in shop HTML) ───────────────
let _shopCatIndex = 0;
const _shopCatLabels = ['BANNERE', 'AVATARE', 'UPGRADES'];

window.switchShopCat = function(idx, btn) {
    _shopCatIndex = idx;
    _updateShopTrack();
    // Update tab buttons
    document.querySelectorAll('.shop-tab-btn').forEach((b, i) => {
        if (i === idx) {
            b.style.background = 'rgba(0,212,255,0.15)';
            b.style.borderColor = 'rgba(0,212,255,0.5)';
            b.style.color = '#00d4ff';
        } else {
            b.style.background = 'transparent';
            b.style.borderColor = 'rgba(255,255,255,0.1)';
            b.style.color = 'rgba(255,255,255,0.4)';
        }
    });
};

window.shopNav = function(dir) {
    const panels = document.querySelectorAll('.shop-cat-panel');
    _shopCatIndex = Math.max(0, Math.min(panels.length - 1, _shopCatIndex + dir));
    _updateShopTrack();
    // Sync tab buttons
    document.querySelectorAll('.shop-tab-btn').forEach((b, i) => {
        if (i === _shopCatIndex) {
            b.style.background = 'rgba(0,212,255,0.15)';
            b.style.borderColor = 'rgba(0,212,255,0.5)';
            b.style.color = '#00d4ff';
        } else {
            b.style.background = 'transparent';
            b.style.borderColor = 'rgba(255,255,255,0.1)';
            b.style.color = 'rgba(255,255,255,0.4)';
        }
    });
};

function _updateShopTrack() {
    const track = document.getElementById('shop-shelf-track');
    const prevBtn = document.getElementById('shop-prev-btn');
    const nextBtn = document.getElementById('shop-next-btn');
    const label   = document.getElementById('shop-cat-label');
    const panels  = document.querySelectorAll('.shop-cat-panel');

    if (!track) return;
    track.style.transform = `translateX(-${_shopCatIndex * 100}%)`;
    if (prevBtn) prevBtn.style.display = _shopCatIndex > 0 ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = _shopCatIndex < panels.length - 1 ? 'block' : 'none';
    if (label)   label.textContent = _shopCatLabels[_shopCatIndex] || '';
}

// Initialise on page load
document.addEventListener('DOMContentLoaded', () => { _updateShopTrack(); });

// Entry Point
console.log("APP.JS MODULE EXECUTING...");

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Friend Link Sharing Logic
document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.getElementById('share-friend-link-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const qrCode = document.getElementById('my-qr-text').innerText;
            if (!qrCode || qrCode === '—' || qrCode.length < 5) {
                showToast("Autentifică-te pentru a genera link-ul!", "error");
                return;
            }
            const link = window.location.origin + window.location.pathname + "?addFriend=" + qrCode;
            navigator.clipboard.writeText(link).then(() => {
                showToast("Link-ul de prietenie a fost copiat!", "success");
            }).catch(() => {
                // Fallback if clipboard API fails
                alert("Link: " + link);
            });
        });
    }

    // Handle Friend Add from URL
    const urlParams = new URLSearchParams(window.location.search);
    const friendToAdd = urlParams.get('addFriend');
    if (friendToAdd) {
        onAuthReady(async (user) => {
            if (user) {
                showToast("Procesare cerere de prietenie...", "info");
                try {
                    const result = await addFriend(friendToAdd);
                    if (result) {
                        showToast("Prieten adăugat cu succes!", "success");
                    }
                } catch (e) {
                    console.error("Friend link error:", e);
                }
                // Clean URL
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            } else {
                showToast("Conectează-te pentru a adăuga acest prieten!", "warning");
            }
        });
    }
});

