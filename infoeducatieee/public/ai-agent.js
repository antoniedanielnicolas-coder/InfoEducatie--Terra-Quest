import { currentLang, t } from './i18n.js';
import { playSound } from './sounds.js';

let chatHistory = [];

export function initAI() {
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const aiChatHistory = document.getElementById('ai-chat-history');

    if (!aiSendBtn || !aiInput || !aiChatHistory) return;

    aiChatHistory.innerHTML = `
        <div class="ai-msg bot-msg">${t('ai.greeting')}</div>
    `;

    const savedHistory = localStorage.getItem('ai_chat_history');
    if (savedHistory) {
        try {
            chatHistory = JSON.parse(savedHistory);
            renderHistory();
        } catch (e) {
            chatHistory = [];
        }
    }

    aiSendBtn.addEventListener('click', async () => {
        const msg = aiInput.value.trim();
        if (!msg) return;

        addMessage(msg, 'user');
        aiInput.value = '';
        playSound('click');

        const typingId = showTypingIndicator();

        const mode = document.getElementById('ai-mode-select')?.value || 'normal';

        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, language: currentLang, mode })
            });

            const data = await response.json();
            removeTypingIndicator(typingId);

            if (response.ok) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage(
                    currentLang === 'ro'
                        ? 'Imi pare rau, asistentul meu AI nu este disponibil momentan. Incearca din nou mai tarziu.'
                        : "I'm sorry, my geopolitical database is currently offline. Please try again later.",
                    'bot'
                );
            }
        } catch (error) {
            removeTypingIndicator(typingId);

            const lowerMsg = msg.toLowerCase();
            let offlineReply = currentLang === 'ro'
                ? 'Sunt momentan offline, dar pot sa-ti spun ca Geografia Politica este fascinanta!'
                : 'I am currently offline, but I can still tell you that Political Geography is fascinating!';

            if (lowerMsg.includes('capital') || lowerMsg.includes('capitala')) {
                offlineReply = "Did you know that the capital of Romania is Bucharest? It plays a crucial role in Eastern European geopolitics, anchoring NATO's southeastern flank.";
            } else if (lowerMsg.includes('state') || lowerMsg.includes('stat')) {
                offlineReply = 'A sovereign state requires three fundamental elements: a defined territory, a permanent population, and a functional government capable of maintaining sovereignty.';
            } else if (lowerMsg.includes('nato')) {
                offlineReply = "NATO (North Atlantic Treaty Organization) is a military alliance established in 1949. Its Article 5 guarantees collective defense: an attack on one is considered an attack on all.";
            } else if (lowerMsg.includes('ocean') || lowerMsg.includes('sea') || lowerMsg.includes('mare')) {
                offlineReply = "The UN Convention on the Law of the Sea (UNCLOS) establishes a 12 nautical mile territorial sea and a 200 nautical mile Exclusive Economic Zone (EEZ) for coastal states.";
            } else if (lowerMsg.includes('hello') || lowerMsg.includes('salut') || lowerMsg.includes('buna')) {
                offlineReply = "Greetings, Agent. I am the TerraQuest AI system. I'm ready to brief you on any geopolitical situation.";
            }

            addMessage(offlineReply, 'bot');
        }
        playSound('click');
    });

    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') aiSendBtn.click();
    });

    initSpeechRecognition();

    document.addEventListener('languageChanged', () => {
        aiInput.placeholder = t('ai.placeholder');
        aiSendBtn.innerText = t('ai.btn_send');
    });
}

function addMessage(text, sender) {
    
    const processedText = sender === 'bot' ? `♊ Gemini: ${text}` : text;

    chatHistory.push({ text: processedText, sender });
    if (chatHistory.length > 50) chatHistory.shift();
    localStorage.setItem('ai_chat_history', JSON.stringify(chatHistory));

    appendMessageElement(processedText, sender);

    if (sender === 'bot') {
        speakText(text, currentLang);
    }
}

function renderHistory() {
    const aiChatHistory = document.getElementById('ai-chat-history');
    if (!aiChatHistory) return;
    aiChatHistory.innerHTML = `<div class="ai-msg bot-msg">${t('ai.greeting')}</div>`;
    chatHistory.forEach(msg => appendMessageElement(msg.text, msg.sender));
}

function appendMessageElement(text, sender) {
    const aiChatHistory = document.getElementById('ai-chat-history');
    if (!aiChatHistory) return;
    const div = document.createElement('div');
    div.className = `ai-msg ${sender}-msg`;
    div.innerText = text;
    aiChatHistory.appendChild(div);
    aiChatHistory.scrollTop = aiChatHistory.scrollHeight;
}

function showTypingIndicator() {
    const aiChatHistory = document.getElementById('ai-chat-history');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'ai-msg bot-msg';
    div.id = id;
    div.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
    aiChatHistory.appendChild(div);
    aiChatHistory.scrollTop = aiChatHistory.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function initSpeechRecognition() {
    const micBtn    = document.getElementById('ai-mic-btn');
    const micStatus = document.getElementById('mic-status');
    const aiInput   = document.getElementById('ai-input');

    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!micBtn || !SpeechAPI) {
        if (micBtn) micBtn.style.display = 'none';
        return;
    }

    const recognition = new SpeechAPI();
    recognition.continuous      = false;
    recognition.interimResults  = false;
    recognition.maxAlternatives = 1;

    let listening = false;

    function setListening(active) {
        listening = active;
        if (active) {
            micBtn.style.background  = 'rgba(255, 68, 102, 0.25)';
            micBtn.style.borderColor = '#ff4466';
            micBtn.style.boxShadow   = '0 0 12px rgba(255,68,102,0.5)';
            if (micStatus) {
                micStatus.style.display = 'block';
                micStatus.textContent   = String.fromCodePoint(0x1F534) + ' Ascult...';
                micStatus.style.color   = '#ff4466';
            }
        } else {
            micBtn.style.background  = 'rgba(255, 255, 255, 0.05)';
            micBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            micBtn.style.boxShadow   = 'none';
            if (micStatus) { micStatus.style.display = 'none'; }
        }
    }

    function showMicError(msg) {
        if (micStatus) {
            micStatus.style.display = 'block';
            micStatus.textContent   = msg;
            micStatus.style.color   = '#ffaa00';
            setTimeout(() => { micStatus.style.display = 'none'; }, 3500);
        }
    }

    micBtn.addEventListener('click', () => {
        if (listening) { recognition.stop(); return; }
        recognition.lang = (typeof currentLang !== 'undefined' && currentLang === 'ro')
            ? 'ro-RO' : 'en-US';
        try { recognition.start(); } catch(e) {  }
    });

    recognition.onstart = () => { setListening(true); };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (aiInput && transcript.trim()) {
            aiInput.value = transcript;
            const sendBtn = document.getElementById('ai-send-btn');
            if (sendBtn) { sendBtn.click(); }
        }
    };

    recognition.onend = () => { setListening(false); };

    recognition.onerror = (event) => {
        setListening(false);
        const msgs = {
            'not-allowed':   String.fromCodePoint(0x26A0) + ' Permisiune microfon refuzata. Apasa pe lacatul din bara de adrese si permite microfonul.',
            'no-speech':     String.fromCodePoint(0x26A0) + ' Nu am auzit nimic. Incearca mai tare.',
            'network':       String.fromCodePoint(0x26A0) + ' Eroare de retea la recunoastere vocala.',
            'audio-capture': String.fromCodePoint(0x26A0) + ' Microfon indisponibil.',
            'aborted':       ''
        };
        const msg = msgs[event.error] || (String.fromCodePoint(0x26A0) + ' Eroare: ' + event.error);
        if (msg) { showMicError(msg); }
    };
}

let currentAudio = null;
let currentUtterance = null;

async function speakText(text, lang) {
    const wave = document.getElementById('ai-voice-wave');
    
    const voicePref = 'default';

    const cleanText = text
        .replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}]/gu, '')
        .replace(/\[.*?\]/g, '')
        .trim();

    if (!cleanText) return;

    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); }

    const playedOnServer = await tryServerVoice(cleanText, lang, voicePref, wave);
    if (!playedOnServer) { speakWithBrowserVoice(cleanText, lang, voicePref, wave); }
}

async function tryServerVoice(text, lang, voicePref, wave) {
    if (voicePref === 'default') { return false; }
    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang, voice: voicePref })
        });
        if (!response.ok) { return false; }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        currentAudio = new Audio(url);
        currentAudio.onplay  = () => { if (wave) { wave.classList.remove('hidden'); } };
        currentAudio.onended = () => { if (wave) { wave.classList.add('hidden'); } URL.revokeObjectURL(url); };
        currentAudio.onerror = () => { if (wave) { wave.classList.add('hidden'); } };
        await currentAudio.play();
        return true;
    } catch (err) {
        return false;
    }
}

function speakWithBrowserVoice(text, lang, voicePref, wave) {
    if (!('speechSynthesis' in window)) { return; }

    currentUtterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const matchers = {
        'female-ro': v => v.lang.startsWith('ro') && /female|ioana|google/i.test(v.name),
        'male-ro':   v => v.lang.startsWith('ro') && /male|andrei|microsoft/i.test(v.name),
        'female-en': v => v.lang.startsWith('en') && /female|zira|google/i.test(v.name),
        'male-en':   v => v.lang.startsWith('en') && /male|david|google/i.test(v.name),
    };

    let voice = matchers[voicePref] ? voices.find(matchers[voicePref]) : null;
    if (!voice) { voice = voices.find(v => v.lang.startsWith(lang === 'ro' ? 'ro' : 'en')); }
    if (voice) { currentUtterance.voice = voice; }

    currentUtterance.pitch = 1.0;
    currentUtterance.rate  = 1.0;
    currentUtterance.onstart = () => { if (wave) { wave.classList.remove('hidden'); } };
    currentUtterance.onend   = () => { if (wave) { wave.classList.add('hidden'); } };
    currentUtterance.onerror = () => { if (wave) { wave.classList.add('hidden'); } };

    window.speechSynthesis.speak(currentUtterance);
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
