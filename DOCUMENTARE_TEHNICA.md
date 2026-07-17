# Documentare Tehnică — TerraQuest

---

## Cum e structurat proiectul

E o aplicație single-page (SPA). Tot ce vede utilizatorul e în `index.html` — secțiunile se afișează și se ascund cu JavaScript, fără reîncărcare de pagină.

Serverul Node.js are un singur rol real: să fie intermediar între browser și Anthropic API. Fără server, cheia API ar trebui pusă în codul clientului, ceea ce nu e ok. În rest, servește fișierele statice ca orice server simplu.

```
Browser
  └── index.html + JS/CSS

Server (Node.js + Express)
  ├── servire fișiere statice
  └── POST /api/ai-chat  →  Anthropic API
```

---

## Modulele JS

### app.js

Punctul central al aplicației. La pornire inițializează celelalte module și setează navigarea între secțiuni. Gestionează starea globală: XP, monede, rang curent. Când un modul raportează că utilizatorul a câștigat XP (prin evenimentul `xpGained`), `app.js` actualizează totul și, dacă e cazul, urcă utilizatorul în rang.

### firebase-auth.js

Tot ce ține de Firebase e aici:
- autentificare cu email/parolă și cu Google
- la primul login se creează un profil în Firestore cu XP=0, monede=0, rang Bronze
- sistem de prieteni — adăugare/ștergere bidirectivă, căutare după email sau cod QR unic
- clasament global — top 10 după XP, din Firestore
- feed de știri — citit în timp real din colecția `app_news`

### i18n.js

Sistemul de traduceri. La pornire încarcă `lang/ro.json` și `lang/en.json`. Funcția `t('sectiune.cheie')` returnează textul în limba activă. Elementele HTML cu atributul `data-i18n` se actualizează automat. La schimbarea limbii se trimite evenimentul `languageChanged`, pe care modulele ca `quizzes.js` îl ascultă ca să re-randeze conținut.

### lessons.js

Lecțiile sunt structurate pe capitole (state suverane, sisteme de guvernare, organizații internaționale etc.). Fiecare lecție are text, eventual imagini și un mini-quiz la final. Progresul e salvat în `localStorage`. La completare se acordă XP.

### quizzes.js

Încarcă datele din `data/quizzes.js`. Suportă trei tipuri de întrebări:
- `multiple_choice` — 4 variante, una corectă
- `true_false` — adevărat sau fals
- `match` — drag & drop pentru potrivire coloană stânga–dreapta, folosind SortableJS

Timerul e calculat ca `număr_întrebări × 30 secunde`. La expirare se forțează finalizarea quiz-ului. Scorul se salvează în `localStorage` ca cel mai bun rezultat per categorie. Dacă scorul e ≥ 80%, se declanșează confetti.

### games.js

Mini-jocuri independente, fiecare cu logica lui:
- identificare țări pe hartă
- ghicit steag (4 variante)
- asociere capitală–stat
- simulator de decizii geopolitice
- ordonare evenimente cronologice

### worldmap.js și historical-map.js

`worldmap.js` randează o hartă SVG a lumii și colorează țările după tipul de guvernare. Permite filtrare și click pe țări.

`historical-map.js` afișează harta la diferite momente istorice printr-un slider de an. Datele despre granițe sunt preîncărcate în fișier.

### server.js

Server Express minimal. Endpoint-ul `/api/ai-chat` primește mesajul utilizatorului, adaugă un system prompt specific (în română sau engleză, după limbă) și îl trimite la Anthropic API. Returnează răspunsul înapoi la browser. Modelul folosit: `claude-sonnet-4-20250514`.

---

## CSS

| Fișier | Ce conține |
|---|---|
| `styles.css` | Variabile globale (culori, fonturi), layout, navbar, carduri |
| `animations.css` | Tranziții, efecte de particule, confetti |
| `pages.css` | Stiluri specifice fiecărei secțiuni |
| `welcome-overlay.css` | Ecranul de bun venit afișat la prima vizită |

Design-ul e dark mode cu accente neon (`#00d4ff`, `#00e676`, `#ff4466`) și efecte de glassmorphism.

---

## Datele pentru quiz-uri

`data/quizzes.js` exportă două lucruri:

**`quizzesData`** — array cu toate întrebările. Fiecare întrebare are:
- `module` — ID-ul categoriei (număr întreg)
- `type` — tipul întrebării
- `question`, `options`, `explanation` — obiect cu cheile `ro` și `en`
- `correctIndex` — indexul răspunsului corect
- `difficulty` — `"easy"`, `"medium"` sau `"hard"`

**`quizCategories`** — categoriile disponibile cu titlu, iconiță și culoare.

---

## XP și rang

Răspunsurile corecte la quiz-uri dau 10 XP fiecare. Lecțiile și jocurile au valori proprii definite în `app.js`.

| Rang | XP necesar |
|---|---|
| Bronze I | 0 |
| Silver I | 500 |
| Gold I | 1500 |
| Platinum I | 3000 |
| Diamond | 6000 |

XP și monedele sunt în `localStorage`. Dacă utilizatorul e autentificat, se sincronizează în Firestore la fiecare actualizare.

---

## Structura Firestore

### `users/{uid}`

```
email: string
displayName: string
photoURL: string
qrCode: string          // ex: "GEO_A1B2C3D4"
friends: [uid, ...]
xp: number
coins: number
rank: string
online: boolean
lastSeen: timestamp
createdAt: timestamp
```

### `app_news/{docId}`

```
title: string
description: string
tag: string
tagColor: string
pinned: boolean
createdAt: timestamp
```

---

## Configurare

Nu există `.env`. Configurările sunt direct în cod:

- **Firebase** — obiectul `firebaseConfig` în `firebase-auth.js`. Cheile Firebase pot fi publice prin design (securitatea e gestionată prin Firestore Rules).
- **Anthropic API** — cheia e citită din `process.env.ANTHROPIC_API_KEY` în `server.js`. Nu ajunge niciodată în browser.
- **Port** — `process.env.PORT` cu fallback la `8080`.

---

## Pornirea aplicației pas cu pas

1. Browserul încarcă `index.html`
2. `app.js` inițializează `i18n` (încarcă traducerile din `/lang/`)
3. `onAuthReady` din `firebase-auth.js` ascultă starea de autentificare
4. Se inițializează modulele: lecții, teste, jocuri, hărți, GeoAI
5. Se afișează pagina principală
6. Dacă utilizatorul e autentificat, profilul și XP-ul se încarcă din Firestore
