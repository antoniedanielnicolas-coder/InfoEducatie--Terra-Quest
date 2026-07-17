const functions = require('firebase-functions');
const express   = require('express');
const rateLimit  = require('express-rate-limit');

const app = express();
app.use(express.json({ limit: '10kb' }));

// ─── Citim cheia din Firebase Secret (setat cu: firebase functions:secrets:set OPENROUTER_API_KEY) ──
// Fallback la process.env pt compatibilitate locala
const OPENROUTER_API_KEY = () =>
    process.env.OPENROUTER_API_KEY || '';

const OPENROUTER_MODEL = 'google/gemini-2.5-pro';
const OPENROUTER_URL   = 'https://openrouter.ai/api/v1/chat/completions';

const AZURE_TTS_KEY    = () => process.env.AZURE_TTS_KEY    || '';
const AZURE_TTS_REGION = () => process.env.AZURE_TTS_REGION || '';

// ─── Rate limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Prea multe cereri. Incearca din nou peste putin timp.' }
});

// ─── Moduri AI ────────────────────────────────────────────────────────────────
const MODES = {
    normal:    { ro: 'Raspunde intr-un ton normal, prietenos si echilibrat.', en: 'Answer in a normal, friendly, balanced tone.' },
    learning:  { ro: 'Esti in modul INVATARE: explica pas cu pas, cu exemple, pune o intrebare scurta la final.', en: 'You are in LEARNING mode: explain step by step, use examples, ask a follow-up question at the end.' },
    assistant: { ro: 'Esti in modul ASISTENT: raspunsuri foarte scurte, tip rezumat, fara introduceri lungi.', en: 'You are in ASSISTANT mode: very short summary-style answers, no long introductions.' },
    test:      { ro: 'Esti in modul TEST: nu da raspunsul direct. Pune o intrebare de tip quiz legata de subiect.', en: 'You are in TEST mode: do not give the direct answer. Ask a quiz-style question on the topic.' }
};
const VALID_MODES = Object.keys(MODES);

function buildSystemPrompt(lang, mode) {
    const isRo = lang === 'ro';
    const base = isRo
        ? 'Esti GeoAI, asistent expert in geografie politica si geopolitica. Dai raspunsuri educationale pentru olimpici la geografie, clasele 10-12.'
        : 'You are GeoAI, an expert AI assistant in political geography and geopolitics. You give educational answers for geography olympiad students, grades 10-12.';
    const modeCfg = MODES[mode] || MODES.normal;
    return base + '\n\n' + (isRo ? modeCfg.ro : modeCfg.en);
}

function validateChatInput(req, res, next) {
    const { message, language, mode } = req.body || {};
    if (typeof message !== 'string' || !message.trim())
        return res.status(400).json({ error: 'Campul "message" este obligatoriu.' });
    if (message.length > 1000)
        return res.status(400).json({ error: 'Mesaj prea lung (max 1000 caractere).' });
    if (language !== undefined && !['ro','en'].includes(language))
        return res.status(400).json({ error: 'Limba trebuie sa fie "ro" sau "en".' });
    if (mode !== undefined && !VALID_MODES.includes(mode))
        return res.status(400).json({ error: 'Mod invalid. Optiuni: ' + VALID_MODES.join(', ') + '.' });
    next();
}

// ─── POST /api/ai-chat ────────────────────────────────────────────────────────
app.post('/ai-chat', apiLimiter, validateChatInput, async (req, res) => {
    try {
        const { message, language, mode } = req.body;
        const lang       = language === 'ro' ? 'ro' : 'en';
        const activeMode = mode || 'normal';
        const key        = OPENROUTER_API_KEY();

        if (!key) return res.status(503).json({ error: 'AI service not configured.' });

        const apiResponse = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': 'Bearer ' + key,
                'HTTP-Referer':  'https://terraquest-1.web.app',
                'X-Title':       'TerraQuest'
            },
            body: JSON.stringify({
                model:      OPENROUTER_MODEL,
                messages:   [
                    { role: 'system', content: buildSystemPrompt(lang, activeMode) },
                    { role: 'user',   content: message }
                ],
                max_tokens: 500
            })
        });

        if (!apiResponse.ok) {
            const err = await apiResponse.text();
            console.error('OpenRouter error:', err);
            return res.status(502).json({ error: 'AI provider returned an error.' });
        }

        const data  = await apiResponse.json();
        const reply = data.choices?.[0]?.message?.content || 'No valid response received.';
        res.json({ reply });

    } catch (err) {
        console.error('AI Error:', err);
        res.status(500).json({ error: 'Internal error.' });
    }
});

// ─── POST /api/tts ────────────────────────────────────────────────────────────
const VOICE_MAP = {
    'male-ro':   'ro-RO-EmilNeural',
    'female-ro': 'ro-RO-AlinaNeural',
    'male-en':   'en-US-GuyNeural',
    'female-en': 'en-US-JennyNeural'
};

function escapeXml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

app.post('/tts', apiLimiter, async (req, res) => {
    const { text, voice, lang } = req.body || {};
    const ttsKey    = AZURE_TTS_KEY();
    const ttsRegion = AZURE_TTS_REGION();

    if (!ttsKey || !ttsRegion)
        return res.status(501).json({ error: 'TTS not configured.' });
    if (!text || !text.trim())
        return res.status(400).json({ error: 'text is required.' });

    const voiceName = VOICE_MAP[voice] || (lang === 'ro' ? VOICE_MAP['female-ro'] : VOICE_MAP['female-en']);
    const locale    = voiceName.startsWith('ro') ? 'ro-RO' : 'en-US';
    const ssml      = "<speak version='1.0' xml:lang='" + locale + "'><voice name='" + voiceName + "'>" + escapeXml(text) + "</voice></speak>";

    try {
        const ttsResp = await fetch('https://' + ttsRegion + '.tts.speech.microsoft.com/cognitiveservices/v1', {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': ttsKey,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-16khz-64kbitrate-mono-mp3'
            },
            body: ssml
        });

        if (!ttsResp.ok) return res.status(502).json({ error: 'TTS provider error.' });
        const buf = Buffer.from(await ttsResp.arrayBuffer());
        res.set('Content-Type', 'audio/mpeg');
        res.send(buf);
    } catch (err) {
        res.status(500).json({ error: 'TTS error.' });
    }
});

// ─── Export ca Firebase Function ──────────────────────────────────────────────
exports.api = functions.https.onRequest(app);
