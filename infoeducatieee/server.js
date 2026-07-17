require('dotenv').config();

const express = require('express');
const path    = require('path');
const rateLimit = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── OpenRouter (cheia ta platita) ──────────────────────────────────────────
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL   = 'google/gemini-2.5-pro';
const OPENROUTER_URL     = 'https://openrouter.ai/api/v1/chat/completions';

// ── Azure Neural TTS (optional) ────────────────────────────────────────────
const AZURE_TTS_KEY    = process.env.AZURE_TTS_KEY    || '';
const AZURE_TTS_REGION = process.env.AZURE_TTS_REGION || '';

if (!OPENROUTER_API_KEY) {
  console.warn('AVERTISMENT: OPENROUTER_API_KEY nu este setat in .env — /api/ai-chat va raspunde cu eroare.');
}
if (!AZURE_TTS_KEY || !AZURE_TTS_REGION) {
  console.warn('NOTA: AZURE_TTS_KEY/AZURE_TTS_REGION nu sunt setate — /api/tts va returna 501, frontend foloseste vocea browserului.');
}

// ── Headere de securitate ──────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Rate limiting ──────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Prea multe cereri. Incearca din nou peste putin timp.' }
});

// ── Prompts per mod ────────────────────────────────────────────────────────
const MODES = {
  normal: {
    ro: 'Raspunde intr-un ton normal, prietenos si echilibrat.',
    en: 'Answer in a normal, friendly, balanced tone.'
  },
  learning: {
    ro: 'Esti in modul INVATARE: explica pas cu pas, cu exemple, pune o intrebare scurta la final.',
    en: 'You are in LEARNING mode: explain step by step, use examples, ask a follow-up question at the end.'
  },
  assistant: {
    ro: 'Esti in modul ASISTENT: raspunsuri foarte scurte, tip rezumat, fara introduceri lungi.',
    en: 'You are in ASSISTANT mode: very short summary-style answers, no long introductions.'
  },
  test: {
    ro: 'Esti in modul TEST: nu da raspunsul direct. Pune o intrebare de tip quiz legata de subiect. Raspunde complet doar daca userul cere explicit.',
    en: 'You are in TEST mode: do not give the direct answer. Ask a quiz-style question on the topic. Only reveal the answer if the user explicitly asks.'
  }
};
const VALID_MODES = Object.keys(MODES);

function buildSystemPrompt(lang, mode) {
  const isRo = lang === 'ro';
  const base = isRo
    ? 'Esti GeoAI, asistent expert in geografie politica si geopolitica. Esti specializat in state suverane, sisteme de guvernare, granite, organizatii internationale (ONU, NATO, UE, ASEAN, BRICS) si centre de putere globala. Dai raspunsuri educationale pentru olimpici la geografie, clasele 10-12.'
    : 'You are GeoAI, an expert AI assistant in political geography and geopolitics. You specialize in sovereign states, governance systems, borders, international organizations (UN, NATO, EU, ASEAN, BRICS) and global power centers. You give educational answers for geography olympiad students, grades 10-12.';

  const modeCfg = MODES[mode] || MODES.normal;
  return base + '\n\n' + (isRo ? modeCfg.ro : modeCfg.en);
}

// ── Validare ───────────────────────────────────────────────────────────────
function validateChatInput(req, res, next) {
  const { message, language, mode } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Campul "message" este obligatoriu.' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Mesajul este prea lung (max 1000 caractere).' });
  }
  if (language !== undefined && !['ro','en'].includes(language)) {
    return res.status(400).json({ error: 'Limba trebuie sa fie "ro" sau "en".' });
  }
  if (mode !== undefined && !VALID_MODES.includes(mode)) {
    return res.status(400).json({ error: 'Mod invalid. Optiuni: ' + VALID_MODES.join(', ') + '.' });
  }
  next();
}

// ── POST /api/ai-chat ──────────────────────────────────────────────────────
app.post('/api/ai-chat', apiLimiter, validateChatInput, async (req, res) => {
  try {
    const { message, language, mode } = req.body;
    const lang       = language === 'ro' ? 'ro' : 'en';
    const activeMode = mode || 'normal';

    if (!OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'Serviciul AI nu este configurat (OPENROUTER_API_KEY lipsa).' });
    }

    const systemPrompt = buildSystemPrompt(lang, activeMode);

    const apiResponse = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + OPENROUTER_API_KEY,
        'HTTP-Referer':  'https://github.com/infoeducatie/terraquest',
        'X-Title':       'TerraQuest'
      },
      body: JSON.stringify({
        model:      OPENROUTER_MODEL,
        messages:   [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: message      }
        ],
        max_tokens: 500
      })
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error('OpenRouter error:', errText);
      return res.status(502).json({ error: 'Serviciul AI a raspuns cu eroare. Incearca din nou.' });
    }

    const data  = await apiResponse.json();
    const reply = data.choices?.[0]?.message?.content || 'Nu am primit un raspuns valid.';
    res.json({ reply });

  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: 'Eroare la procesarea mesajului AI.' });
  }
});

// ── POST /api/tts (Azure Neural TTS) ──────────────────────────────────────
const VOICE_MAP = {
  'male-ro':   'ro-RO-EmilNeural',
  'female-ro': 'ro-RO-AlinaNeural',
  'male-en':   'en-US-GuyNeural',
  'female-en': 'en-US-JennyNeural'
};

function escapeXml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function validateTtsInput(req, res, next) {
  const { text, voice } = req.body || {};
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Campul "text" este obligatoriu.' });
  }
  if (text.length > 500) {
    return res.status(400).json({ error: 'Text prea lung pentru TTS (max 500 caractere).' });
  }
  if (voice !== undefined && !Object.keys(VOICE_MAP).includes(voice)) {
    return res.status(400).json({ error: 'Voce necunoscuta. Optiuni: ' + Object.keys(VOICE_MAP).join(', ') + '.' });
  }
  next();
}

app.post('/api/tts', apiLimiter, validateTtsInput, async (req, res) => {
  if (!AZURE_TTS_KEY || !AZURE_TTS_REGION) {
    return res.status(501).json({ error: 'TTS neconfigurat — foloseste vocea browserului.' });
  }

  const { text, voice, lang } = req.body;
  const voiceName = VOICE_MAP[voice] || (lang === 'ro' ? VOICE_MAP['female-ro'] : VOICE_MAP['female-en']);
  const localeTag = voiceName.startsWith('ro') ? 'ro-RO' : 'en-US';
  const ssml      = "<speak version='1.0' xml:lang='" + localeTag + "'><voice xml:lang='" + localeTag + "' name='" + voiceName + "'>" + escapeXml(text) + "</voice></speak>";

  try {
    const ttsResp = await fetch(
      'https://' + AZURE_TTS_REGION + '.tts.speech.microsoft.com/cognitiveservices/v1',
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key':  AZURE_TTS_KEY,
          'Content-Type':               'application/ssml+xml',
          'X-Microsoft-OutputFormat':   'audio-16khz-64kbitrate-mono-mp3'
        },
        body: ssml
      }
    );

    if (!ttsResp.ok) {
      console.error('Azure TTS error:', await ttsResp.text());
      return res.status(502).json({ error: 'Serviciul de voce a raspuns cu eroare.' });
    }

    const buf = Buffer.from(await ttsResp.arrayBuffer());
    res.set('Content-Type', 'audio/mpeg');
    res.send(buf);

  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'Eroare la generarea vocii.' });
  }
});

app.listen(PORT, () => {
  console.log('TerraQuest server running at http://localhost:' + PORT);
});
