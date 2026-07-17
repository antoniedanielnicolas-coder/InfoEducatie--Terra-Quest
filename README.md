# TerraQuest — InfoEducație 2026

Aplicație web pentru olimpiada InfoEducație 2026. Tema este geografie politică și geopolitică.

---

## Ce face?

E o platformă de învățare interactivă. Utilizatorul poate studia lecții, da teste, juca mini-jocuri pe hărți și întreba un asistent AI despre geopolitică. Pe măsură ce progresează, câștigă XP și urcă în rang. Există și un sistem de prieteni cu clasament global.

Funcționalități principale:
- lecții structurate pe capitole de geografie politică
- teste cu mai multe tipuri de întrebări (variante, adevărat/fals, potrivire)
- mini-jocuri: identificare țări pe hartă, steaguri, capitale
- hartă politică interactivă filtrabilă după tip de guvernare
- hartă istorică — granițele lumii în diferite perioade
- chat cu GeoAI, un asistent bazat pe Claude Sonnet
- sistem de conturi, prieteni, clasament (prin Firebase)

---

## Cum intri pe aplicație?

Deschizi terraquest-1.web.app în orice browser sau o rulezi local.

## Cum rulezi proiectul?

Ai nevoie de Node.js instalat.

```bash
npm install
npm run dev
```

Apoi deschide `http://localhost:8080` în browser.

---

## Stack

- HTML + CSS + JavaScript vanilla — frontend
- Node.js + Express — server local
- Firebase Auth + Firestore — autentificare și date
- Anthropic API (Claude Sonnet) — asistentul GeoAI

---

## Fișiere

| Fișier | Ce face |
|---|---|
| `index.html` | Tot UI-ul aplicației |
| `app.js` | Navigare, XP, monede, rang, inițializare module |
| `lessons.js` | Lecțiile interactive |
| `quizzes.js` | Testele și quiz-urile |
| `games.js` | Mini-jocurile |
| `worldmap.js` | Harta politică mondială |
| `historical-map.js` | Harta istorică cu slider de an |
| `ai-agent.js` | Chat-ul cu GeoAI |
| `firebase-auth.js` | Autentificare, prieteni, clasament, știri |
| `i18n.js` | Traduceri RO/EN |
| `server.js` | Server Express + proxy pentru Anthropic API |
| `lang/` | Fișierele de traducere (ro.json, en.json) |
| `data/` | Datele pentru quiz-uri și lecții |
| `styles.css` | Stiluri globale |
| `animations.css` | Animații |
| `pages.css` | Stiluri pe secțiuni |

---

## Conturi

Aplicația funcționează și fără cont (progresul se salvează local). Pentru clasament și prieteni trebuie autentificare — cu email/parolă sau cont Google.
