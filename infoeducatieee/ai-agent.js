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
                offlineReply = "Greetings, Agent. I am the GeoInformatica AI system. I'm ready to brief you on any geopolitical situation.";
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

    // Handle language change
    document.addEventListener('languageChanged', () => {
        // We could re-render system messages here if needed
        aiInput.placeholder = t('ai.placeholder');
        aiSendBtn.innerText = t('ai.btn_send');
    });
}

function addMessage(text, sender) {
    chatHistory.push({ text, sender });
    // Keep only last 50
    if(chatHistory.length > 50) chatHistory.shift();
    localStorage.setItem('ai_chat_history', JSON.stringify(chatHistory));
    
    appendMessageElement(text, sender);

    // Speak the response if it's the bot
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
    div.innerText = text; // In a real app, use a markdown parser like marked.js
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

// ============ VOICE SYNTHESIS ============
let currentUtterance = null;

function speakText(text, lang) {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Remove emojis or special characters that sound weird
    const cleanText = text.replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}]/gu, '')
                          .replace(/\[.*?\]/g, ''); // Remove [Offline Mode] tags etc
    
    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    
    // Try to find a good robotic/system voice
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.startsWith(lang === 'ro' ? 'ro' : 'en') && (v.name.includes('Google') || v.name.includes('Microsoft')));
    
    // Fallback to any english voice if romanian is not found
    if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
    
    if (voice) currentUtterance.voice = voice;
    currentUtterance.pitch = 0.9; // Slightly lower pitch for authority
    currentUtterance.rate = 1.05; // Slightly faster for efficiency
    
    const wave = document.getElementById('ai-voice-wave');
    
    currentUtterance.onstart = () => {
        if (wave) wave.classList.remove('hidden');
    };
    
    currentUtterance.onend = () => {
        if (wave) wave.classList.add('hidden');
    };
    
    currentUtterance.onerror = () => {
        if (wave) wave.classList.add('hidden');
    };
    
    window.speechSynthesis.speak(currentUtterance);
}

// Make sure voices are loaded
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        // Just trigger load
        window.speechSynthesis.getVoices();
    };
}
