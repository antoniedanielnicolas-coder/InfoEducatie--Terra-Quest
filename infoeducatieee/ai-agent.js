import { currentLang, t } from './i18n.js';
import { playSound } from './sounds.js';

let chatHistory = [];

export function initAI() {
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const aiChatHistory = document.getElementById('ai-chat-history');

    if (!aiSendBtn || !aiInput || !aiChatHistory) return;

    // Initial greeting
    aiChatHistory.innerHTML = `
        <div class="ai-msg bot-msg">${t('ai.greeting')}</div>
    `;

    // Load history from local storage
    const savedHistory = localStorage.getItem('ai_chat_history');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
        renderHistory();
    }

    aiSendBtn.addEventListener('click', async () => {
        const msg = aiInput.value.trim();
        if (!msg) return;

        // Add user message
        addMessage(msg, 'user');
        aiInput.value = '';
        playSound('click');

        // Show typing indicator
        const typingId = showTypingIndicator();

        try {
            // Send to proxy backend
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, language: currentLang })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            removeTypingIndicator(typingId);
            
            if (response.ok) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage("I'm sorry, my geopolitical database is currently offline. Please try again later.", 'bot');
            }
        } catch (error) {
            removeTypingIndicator(typingId);
            
            // Offline fallback responses
            const lowerMsg = msg.toLowerCase();
            let offlineReply = "I am currently offline, but I can still tell you that Political Geography is fascinating!";
            
            if(lowerMsg.includes('capital') || lowerMsg.includes('capitală')) {
                offlineReply = "Did you know that the capital of Romania is Bucharest? It plays a crucial role in Eastern European geopolitics, anchoring NATO's southeastern flank.";
            } else if (lowerMsg.includes('state') || lowerMsg.includes('stat')) {
                offlineReply = "A sovereign state requires three fundamental elements: a defined territory, a permanent population, and a functional government capable of maintaining sovereignty.";
            } else if (lowerMsg.includes('nato')) {
                offlineReply = "NATO (North Atlantic Treaty Organization) is a military alliance established in 1949. Its Article 5 guarantees collective defense: an attack on one is considered an attack on all.";
            } else if (lowerMsg.includes('ocean') || lowerMsg.includes('sea') || lowerMsg.includes('mare')) {
                offlineReply = "The UN Convention on the Law of the Sea (UNCLOS) establishes a 12 nautical mile territorial sea and a 200 nautical mile Exclusive Economic Zone (EEZ) for coastal states.";
            } else if (lowerMsg.includes('hello') || lowerMsg.includes('salut') || lowerMsg.includes('buna')) {
                offlineReply = "Greetings, Agent. I am the TerraQuest AI system. I'm ready to brief you on any geopolitical situation.";
            }
            
            addMessage(offlineReply, 'bot');
        }
        playSound('click'); // Play sound when bot replies
    });

    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            aiSendBtn.click();
        }
    });

    // Handle Mic Button
    initSpeechRecognition();

    // Handle language change
    document.addEventListener('languageChanged', () => {
        aiInput.placeholder = t('ai.placeholder');
        aiSendBtn.innerText = t('ai.btn_send');
    });
}

function addMessage(text, sender) {
    const model = document.getElementById('ai-model-select')?.value || 'classic';
    let processedText = text;
    
    if (sender === 'bot') {
        const prefixes = {
            'gemini-1.5': '♊ Gemini:',
            'claude-3.5': '🎭 Claude:',
            'gpt-4o': '🧠 GPT-4o:',
            'classic': '📜 Geo-Logic:'
        };
        processedText = `${prefixes[model]} ${text}`;
    }

    chatHistory.push({ text: processedText, sender });
    if(chatHistory.length > 50) chatHistory.shift();
    localStorage.setItem('ai_chat_history', JSON.stringify(chatHistory));
    
    appendMessageElement(processedText, sender);

    if (sender === 'bot') {
        speakText(text, currentLang);
    }
}

function renderHistory() {
    const aiChatHistory = document.getElementById('ai-chat-history');
    if (!aiChatHistory) return;
    
    aiChatHistory.innerHTML = `
        <div class="ai-msg bot-msg">${t('ai.greeting')}</div>
    `;
    
    chatHistory.forEach(msg => {
        appendMessageElement(msg.text, msg.sender);
    });
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
    if(el) el.remove();
}

// ============ SPEECH TO TEXT ============
function initSpeechRecognition() {
    const micBtn = document.getElementById('ai-mic-btn');
    const micStatus = document.getElementById('mic-status');
    const aiInput = document.getElementById('ai-input');
    
    if (!micBtn || !('webkitSpeechRecognition' in window)) {
        if (micBtn) micBtn.style.display = 'none';
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    micBtn.addEventListener('click', () => {
        recognition.lang = currentLang === 'ro' ? 'ro-RO' : 'en-US';
        recognition.start();
        micBtn.style.background = 'rgba(255, 68, 102, 0.2)';
        micBtn.style.borderColor = '#ff4466';
        if (micStatus) micStatus.style.display = 'block';
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (aiInput) aiInput.value = transcript;
    };

    recognition.onend = () => {
        micBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        micBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        if (micStatus) micStatus.style.display = 'none';
    };

    recognition.onerror = () => {
        micBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        if (micStatus) micStatus.style.display = 'none';
    };
}

// ============ VOICE SYNTHESIS ============
let currentUtterance = null;

function speakText(text, lang) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}]/gu, '')
                          .replace(/\[.*?\]/g, '');
    
    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = window.speechSynthesis.getVoices();
    const voicePref = document.getElementById('ai-voice-select')?.value || 'default';
    
    let voice = null;
    if (voicePref === 'female-ro') voice = voices.find(v => v.lang.startsWith('ro') && (v.name.includes('Female') || v.name.includes('Ioana') || v.name.includes('Google')));
    if (voicePref === 'male-ro') voice = voices.find(v => v.lang.startsWith('ro') && (v.name.includes('Male') || v.name.includes('Andrei') || v.name.includes('Microsoft')));
    if (voicePref === 'female-en') voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google')));
    if (voicePref === 'male-en') voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google')));
    
    // Fallback logic
    if (!voice) {
        voice = voices.find(v => v.lang.startsWith(lang === 'ro' ? 'ro' : 'en'));
    }
    
    if (voice) currentUtterance.voice = voice;
    currentUtterance.pitch = 1.0;
    currentUtterance.rate = 1.0;
    
    const wave = document.getElementById('ai-voice-wave');
    currentUtterance.onstart = () => { if (wave) wave.classList.remove('hidden'); };
    currentUtterance.onend = () => { if (wave) wave.classList.add('hidden'); };
    currentUtterance.onerror = () => { if (wave) wave.classList.add('hidden'); };
    
    window.speechSynthesis.speak(currentUtterance);
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}
