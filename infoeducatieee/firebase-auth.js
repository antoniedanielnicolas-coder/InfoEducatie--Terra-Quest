// firebase-auth.js — Firebase Authentication Module
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    onSnapshot,
    orderBy,
    limit
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBEn2s1P6s_8q6vVUeEvlunL26uKQQGyYM",
    authDomain: "geoinformatica-bd3b3.firebaseapp.com",
    projectId: "geoinformatica-bd3b3",
    storageBucket: "geoinformatica-bd3b3.firebasestorage.app",
    messagingSenderId: "212610399880",
    appId: "1:212610399880:web:d42b9080669d709f1fa93d",
    measurementId: "G-7L520VNY0Y"
};

let app, auth, db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (e) {
    console.warn('Firebase init error (check config):', e);
}

export { auth, db };

// ─── Auth State ─────────────────────────────────────────────────────────────────
export let currentUser = null;

export function onAuthReady(callback) {
    if (!auth) return;
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (user) {
            await ensureUserProfile(user);
            updateAuthUI(user);
        } else {
            updateAuthUI(null);
        }
        callback(user);
    });
}

// ─── Ensure user profile in Firestore ──────────────────────────────────────────
async function ensureUserProfile(user) {
    if (!db) return;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || '',
            qrCode: `GEO_${user.uid.slice(0, 8).toUpperCase()}`,
            friends: [],
            friendRequests: [],
            xp: 0,
            coins: 0,
            rank: 'Bronze I',
            online: true,
            lastSeen: serverTimestamp(),
            createdAt: serverTimestamp()
        });
    } else {
        await updateDoc(userRef, { online: true, lastSeen: serverTimestamp() });
    }
}

// ─── Update Auth UI ─────────────────────────────────────────────────────────────
function updateAuthUI(user) {
    const authSection = document.getElementById('auth-section');
    const loggedInSection = document.getElementById('logged-in-section');
    const userEmailDisplay = document.getElementById('user-email-display');
    const userNameDisplay = document.getElementById('user-display-name');

    if (user) {
        if (authSection) authSection.style.display = 'none';
        if (loggedInSection) loggedInSection.style.display = 'flex';
        if (userEmailDisplay) userEmailDisplay.textContent = user.email;
        if (userNameDisplay) userNameDisplay.textContent = user.displayName || user.email.split('@')[0];
        // Update profile name
        const profileName = document.getElementById('profile-name');
        if (profileName && user.displayName) profileName.textContent = user.displayName;
    } else {
        if (authSection) authSection.style.display = 'flex';
        if (loggedInSection) loggedInSection.style.display = 'none';
    }
}

// ─── Google Sign-In ──────────────────────────────────────────────────────────
export async function signInWithGoogle() {
    if (!auth) return showAuthError('Firebase nu este configurat. Verifică firebase-auth.js.');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
        const result = await signInWithPopup(auth, provider);
        showAuthSuccess(`Bun venit, ${result.user.displayName}! ✅`);
        return result.user;
    } catch (err) {
        console.error('Google sign-in error:', err.code, err.message);
        if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
            // User closed — silent
        } else if (err.code === 'auth/popup-blocked') {
            showAuthError('⚠️ Popup-ul a fost blocat de browser. Permite popup-uri pentru acest site și încearcă din nou.');
        } else if (err.code === 'auth/unauthorized-domain') {
            showAuthError('❌ Domeniu neautorizat! Firebase Console → Authentication → Settings → Authorized Domains → adaugă "localhost".');
        } else if (err.code === 'auth/operation-not-allowed') {
            showAuthError('❌ Google Sign-In nu este activat! Firebase Console → Authentication → Sign-in method → Google → Activează.');
        } else if (err.code === 'auth/invalid-api-key' || err.code === 'auth/configuration-not-found') {
            showAuthError('❌ Configurație Firebase invalidă. Verifică firebaseConfig din firebase-auth.js.');
        } else {
            showAuthError(getErrorMessage(err.code));
        }
    }
}

// ─── Email/Password Sign-In ─────────────────────────────────────────────────────
export async function signInWithEmail(email, password) {
    if (!auth) return showAuthError('Firebase nu este configurat.');
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        showAuthSuccess(`Bun venit înapoi!`);
        return result.user;
    } catch (err) {
        showAuthError(getErrorMessage(err.code));
    }
}

// ─── Email/Password Register ────────────────────────────────────────────────────
export async function registerWithEmail(email, password, displayName) {
    if (!auth) return showAuthError('Firebase nu este configurat.');
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        showAuthSuccess(`Cont creat! Bun venit, ${displayName}!`);
        return result.user;
    } catch (err) {
        showAuthError(getErrorMessage(err.code));
    }
}

// ─── Password Reset ─────────────────────────────────────────────────────────────
export async function resetPassword(email) {
    if (!auth) return showAuthError('Firebase nu este configurat.');
    try {
        await sendPasswordResetEmail(auth, email);
        showAuthSuccess('Email de resetare trimis! Verifică inbox-ul.');
    } catch (err) {
        showAuthError(getErrorMessage(err.code));
    }
}

// ─── Sign Out ───────────────────────────────────────────────────────────────────
export async function logOut() {
    if (!auth) return;
    if (currentUser && db) {
        await updateDoc(doc(db, 'users', currentUser.uid), { online: false });
    }
    await signOut(auth);
    showAuthSuccess('Ai ieșit din cont.');
}

// ─── Friends System ─────────────────────────────────────────────────────────────
export async function searchUserByEmail(email) {
    if (!db) return null;
    const q = query(collection(db, 'users'), where('email', '==', email.trim().toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function searchUserByQR(qrCode) {
    if (!db) return null;
    const q = query(collection(db, 'users'), where('qrCode', '==', qrCode.trim().toUpperCase()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function addFriend(targetUid) {
    if (!db || !currentUser) return;
    const myRef = doc(db, 'users', currentUser.uid);
    const theirRef = doc(db, 'users', targetUid);
    await updateDoc(myRef, { friends: arrayUnion(targetUid) });
    await updateDoc(theirRef, { friends: arrayUnion(currentUser.uid) });
}

export async function removeFriend(targetUid) {
    if (!db || !currentUser) return;
    const myRef = doc(db, 'users', currentUser.uid);
    const theirRef = doc(db, 'users', targetUid);
    await updateDoc(myRef, { friends: arrayRemove(targetUid) });
    await updateDoc(theirRef, { friends: arrayRemove(currentUser.uid) });
}

export async function getFriendsList() {
    if (!db || !currentUser) return [];
    const snap = await getDoc(doc(db, 'users', currentUser.uid));
    if (!snap.exists()) return [];
    const friendIds = snap.data().friends || [];
    const friends = [];
    for (const uid of friendIds) {
        const fSnap = await getDoc(doc(db, 'users', uid));
        if (fSnap.exists()) friends.push({ id: uid, ...fSnap.data() });
    }
    return friends;
}

export function listenToFriends(callback) {
    if (!db || !currentUser) return;
    return onSnapshot(doc(db, 'users', currentUser.uid), async (snap) => {
        if (!snap.exists()) return;
        const friendIds = snap.data().friends || [];
        const friends = [];
        for (const uid of friendIds) {
            const fSnap = await getDoc(doc(db, 'users', uid));
            if (fSnap.exists()) friends.push({ id: uid, ...fSnap.data() });
        }
        callback(friends);
    });
}

export async function getMyQRCode() {
    if (!db || !currentUser) return null;
    const snap = await getDoc(doc(db, 'users', currentUser.uid));
    return snap.exists() ? snap.data().qrCode : null;
}

// ─── Phase 2: Progress Sync & Leaderboard ─────────────────────────────────────
export async function syncUserProgress(xp, coins) {
    if (!db || !currentUser) return;
    try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
            xp: xp,
            coins: coins,
            lastActive: serverTimestamp()
        });
    } catch (e) {
        console.warn("Failed to sync progress:", e);
    }
}

export async function getLeaderboard() {
    if (!db) return [];
    try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10));
        const snap = await getDocs(q);
        const leaders = [];
        snap.forEach(doc => leaders.push({ id: doc.id, ...doc.data() }));
        return leaders;
    } catch (e) {
        console.warn("Failed to fetch leaderboard:", e);
        return [];
    }
}

// ─── Helpers ────────────────────────────────────────────────────────────────────
function getErrorMessage(code) {
    const messages = {
        'auth/user-not-found': 'Nu există un cont cu acest email.',
        'auth/wrong-password': 'Parolă incorectă.',
        'auth/invalid-credential': 'Email sau parolă incorectă. Verifică datele introduse.',
        'auth/email-already-in-use': 'Acest email este deja folosit. Încearcă să te conectezi.',
        'auth/weak-password': 'Parola trebuie să aibă cel puțin 6 caractere.',
        'auth/invalid-email': 'Adresă de email invalidă.',
        'auth/popup-closed-by-user': 'Autentificarea a fost anulată.',
        'auth/network-request-failed': 'Eroare de rețea. Verifică conexiunea la internet.',
        'auth/too-many-requests': 'Prea multe încercări. Încearcă din nou mai târziu.',
        'auth/operation-not-allowed': 'Această metodă de autentificare nu este activată în Firebase Console.',
        'auth/requires-recent-login': 'Sesiune expirată. Reconectează-te.',
        'auth/user-disabled': 'Contul a fost dezactivat.',
    };
    return messages[code] || `A apărut o eroare (${code}). Încearcă din nou.`;
}


function showAuthError(msg) {
    const el = document.getElementById('auth-error-msg');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    console.error('Auth error:', msg);
}

function showAuthSuccess(msg) {
    const el = document.getElementById('auth-success-msg');
    if (el) { el.textContent = msg; el.style.display = 'block'; setTimeout(() => el.style.display = 'none', 3000); }
}

// ─── Real-time News Feed ─────────────────────────────────────────────────────
const INITIAL_NEWS = [
    {
        title: '🎉 TerraQuest a fost lansat!',
        description: 'Platforma a fost redenumită din GeoQuest în TerraQuest. Design nou, experiență îmbunătățită.',
        tag: 'Rebrand',
        tagColor: '#00d4ff',
        pinned: true,
        createdAt: new Date('2026-05-08T08:00:00Z')
    },
    {
        title: '🔐 Sistem de autentificare Firebase',
        description: 'A fost integrat sistemul de conturi Firebase. Acum poți crea cont, te poți loga cu Google și îți poți sincroniza progresul.',
        tag: 'Funcționalitate',
        tagColor: '#00e676',
        pinned: false,
        createdAt: new Date('2026-05-08T07:00:00Z')
    },
    {
        title: '🌍 Hartă Politică Mondială',
        description: 'A fost adăugată harta politică interactivă cu monarhii, republici și state cu un singur partid, cu filtrare pe tip.',
        tag: 'Funcționalitate',
        tagColor: '#00e676',
        pinned: false,
        createdAt: new Date('2026-05-07T10:00:00Z')
    },
    {
        title: '🤖 GeoAI Agent integrat',
        description: 'Asistentul AI de geografie politică este acum disponibil. Pune întrebări despre state, granițe, organizații internaționale.',
        tag: 'AI',
        tagColor: '#d4a843',
        pinned: false,
        createdAt: new Date('2026-05-06T09:00:00Z')
    },
    {
        title: '🎮 Jocuri interactive adăugate',
        description: 'Quiz pe Hartă, Simulator Geopolitic, Provocare Cronologică, Ghicește Conturul și multe altele.',
        tag: 'Jocuri',
        tagColor: '#ff4466',
        pinned: false,
        createdAt: new Date('2026-05-05T08:00:00Z')
    }
];

async function seedInitialNews() {
    if (!db) return;
    try {
        const newsCol = collection(db, 'app_news');
        const snap = await getDocs(query(newsCol, limit(20)));
        if (snap.empty) {
            // No data yet — seed all items
            for (const item of INITIAL_NEWS) {
                await setDoc(doc(newsCol), {
                    ...item,
                    createdAt: serverTimestamp()
                });
            }
        } else {
            // Data exists — find and fix the rebrand item if it has old text
            for (const docSnap of snap.docs) {
                const data = docSnap.data();
                if (data.description && data.description.includes('GeoInformatica')) {
                    await setDoc(docSnap.ref, {
                        ...data,
                        description: data.description.replace(/GeoInformatica/g, 'GeoQuest')
                    }, { merge: true });
                }
            }
        }
    } catch (e) {
        console.warn('News seed skipped (Firestore rules?):', e.code);
    }
}

export function listenToNews(callback) {
    if (!db) {
        // Fallback: return hardcoded items sorted by date
        callback(INITIAL_NEWS.sort((a, b) => b.createdAt - a.createdAt));
        return () => { };
    }
    seedInitialNews();
    const newsQuery = query(
        collection(db, 'app_news'),
        orderBy('createdAt', 'desc'),
        limit(20)
    );
    const unsub = onSnapshot(newsQuery, (snap) => {
        if (snap.empty) {
            callback(INITIAL_NEWS);
            return;
        }
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(items);
    }, (err) => {
        console.warn('News listener error:', err.code);
        callback(INITIAL_NEWS);
    });
    return unsub;
}
