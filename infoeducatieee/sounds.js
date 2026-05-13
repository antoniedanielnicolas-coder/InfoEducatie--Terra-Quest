

let audioCtx = null;
let isMuted = localStorage.getItem('isMuted') === 'true';
let currentSoundTheme = localStorage.getItem('soundTheme') || 'cyber';

export const sounds = {
    click: null,
    correct: null,
    wrong: null,
    ambient: null
};

export const musicLibrary = [
    { id: 'world_explorer',   name: '🌍 World Explorer' },
    { id: 'discovery',        name: '🧭 Discovery Journey' },
    { id: 'global_harmony',   name: '🕊️ Global Harmony' },
    { id: 'sunny_equator',    name: '☀️ Sunny Equator' },
    { id: 'ocean_breeze',     name: '🌊 Ocean Breeze' }
];

let currentMusicId   = localStorage.getItem('currentMusicId') || 'world_explorer';
let musicNodes       = [];
let musicPlaying     = false;
let musicGainNode    = null;

const soundThemes = {
    cyber: {
        name: '⚡ Cyber',
        click: (ctx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(masterGainNode);
            o.frequency.setValueAtTime(800, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
            g.gain.setValueAtTime(0.18, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            o.type = 'square';
            o.start(); o.stop(ctx.currentTime + 0.12);
        },
        correct: (ctx) => {
            const freqs = [523, 659, 784, 1047];
            freqs.forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(masterGainNode);
                o.frequency.value = f;
                o.type = 'sine';
                const t = ctx.currentTime + i * 0.08;
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(0.2, t + 0.03);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
                o.start(t); o.stop(t + 0.25);
            });
        },
        wrong: (ctx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(masterGainNode);
            o.frequency.setValueAtTime(300, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
            o.type = 'sawtooth';
            g.gain.setValueAtTime(0.2, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            o.start(); o.stop(ctx.currentTime + 0.3);
        },
        levelup: (ctx) => {
            [262, 330, 392, 523, 659, 784].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(masterGainNode);
                o.frequency.value = f;
                o.type = 'sine';
                const t = ctx.currentTime + i * 0.09;
                g.gain.setValueAtTime(0.22, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
                o.start(t); o.stop(t + 0.35);
            });
        }
    },
    classic: {
        name: '🎵 Classic',
        click: (ctx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(masterGainNode);
            o.frequency.value = 600;
            o.type = 'sine';
            g.gain.setValueAtTime(0.15, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            o.start(); o.stop(ctx.currentTime + 0.08);
        },
        correct: (ctx) => {
            [440, 550, 660].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(masterGainNode);
                o.frequency.value = f;
                o.type = 'triangle';
                const t = ctx.currentTime + i * 0.12;
                g.gain.setValueAtTime(0.18, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                o.start(t); o.stop(t + 0.3);
            });
        },
        wrong: (ctx) => {
            [330, 280, 220].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(masterGainNode);
                o.frequency.value = f;
                o.type = 'triangle';
                const t = ctx.currentTime + i * 0.1;
                g.gain.setValueAtTime(0.15, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                o.start(t); o.stop(t + 0.2);
            });
        },
        levelup: (ctx) => {
            [261, 329, 392, 523].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(masterGainNode);
                o.frequency.value = f;
                o.type = 'sine';
                const t = ctx.currentTime + i * 0.12;
                g.gain.setValueAtTime(0.2, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
                o.start(t); o.stop(t + 0.4);
            });
        }
    },
    retro: {
        name: '👾 Retro 8-bit',
        click: (ctx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(masterGainNode);
            o.frequency.value = 440;
            o.type = 'square';
            g.gain.setValueAtTime(0.1, ctx.currentTime);
            g.gain.setValueAtTime(0, ctx.currentTime + 0.05);
            o.start(); o.stop(ctx.currentTime + 0.05);
        },
        correct: (ctx) => {
            [200, 400, 600, 800].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(masterGainNode);
                o.frequency.value = f;
                o.type = 'square';
                const t = ctx.currentTime + i * 0.06;
                g.gain.setValueAtTime(0.12, t);
                g.gain.setValueAtTime(0, t + 0.05);
                o.start(t); o.stop(t + 0.06);
            });
        },
        wrong: (ctx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(masterGainNode);
            o.frequency.setValueAtTime(200, ctx.currentTime);
            o.frequency.setValueAtTime(100, ctx.currentTime + 0.1);
            o.frequency.setValueAtTime(150, ctx.currentTime + 0.2);
            o.type = 'square';
            g.gain.setValueAtTime(0.12, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            o.start(); o.stop(ctx.currentTime + 0.3);
        },
        levelup: (ctx) => {
            [100, 200, 400, 300, 500, 700, 1000].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(masterGainNode);
                o.frequency.value = f;
                o.type = 'square';
                const t = ctx.currentTime + i * 0.07;
                g.gain.setValueAtTime(0.12, t);
                g.gain.setValueAtTime(0, t + 0.06);
                o.start(t); o.stop(t + 0.07);
            });
        }
    },
    minimal: {
        name: '🔕 Minimal',
        click: (ctx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(masterGainNode);
            o.frequency.value = 1000;
            o.type = 'sine';
            g.gain.setValueAtTime(0.05, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            o.start(); o.stop(ctx.currentTime + 0.04);
        },
        correct: (ctx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(masterGainNode);
            o.frequency.setValueAtTime(600, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
            o.type = 'sine';
            g.gain.setValueAtTime(0.1, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            o.start(); o.stop(ctx.currentTime + 0.2);
        },
        wrong: (ctx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(masterGainNode);
            o.frequency.value = 250;
            o.type = 'sine';
            g.gain.setValueAtTime(0.08, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            o.start(); o.stop(ctx.currentTime + 0.15);
        },
        levelup: (ctx) => {
            [500, 700, 1000].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(masterGainNode);
                o.frequency.value = f;
                o.type = 'sine';
                const t = ctx.currentTime + i * 0.15;
                g.gain.setValueAtTime(0.12, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                o.start(t); o.stop(t + 0.3);
            });
        }
    }
};

export let uiVolume = parseFloat(localStorage.getItem('uiVolume'));
if (isNaN(uiVolume)) uiVolume = 1.0;
export let bgmVolume = parseFloat(localStorage.getItem('bgmVolume'));
if (isNaN(bgmVolume)) bgmVolume = 0.2;

export let masterGainNode = null;

export function initSounds() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGainNode = audioCtx.createGain();
        masterGainNode.gain.value = uiVolume;
        masterGainNode.connect(audioCtx.destination);
    } catch (e) {
        console.warn('Web Audio API not supported, using HTML5 audio fallback');
    }

    sounds.ambient = { _procedural: true };
    console.log('🎵 Sound System ready. Music engine: Procedural Web Audio API.');

    updateSoundToggleUI();

    const toggleBtn = document.getElementById('sound-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            localStorage.setItem('isMuted', isMuted);
            updateSoundToggleUI();
            if (isMuted) {
                stopMusic();
                if (masterGainNode) masterGainNode.gain.value = 0;
            } else {
                if (masterGainNode) masterGainNode.gain.value = uiVolume;
                playMusic(currentMusicId);
            }
        });
    }

    const uiSlider = document.getElementById('ui-volume-slider');
    const uiLabel = document.getElementById('ui-vol-label');
    if (uiSlider) {
        uiSlider.value = Math.round(uiVolume * 100);
        if (uiLabel) uiLabel.innerText = uiSlider.value + '%';
        uiSlider.addEventListener('input', (e) => {
            uiVolume = e.target.value / 100;
            localStorage.setItem('uiVolume', uiVolume);
            if (uiLabel) uiLabel.innerText = e.target.value + '%';
            if (masterGainNode && !isMuted) masterGainNode.gain.value = uiVolume;
            if (e.target.value % 10 === 0) playSound('click');
        });
    }

    const bgmSlider = document.getElementById('bgm-volume-slider');
    const bgmLabel = document.getElementById('bgm-vol-label');
    if (bgmSlider) {
        bgmSlider.value = Math.round(bgmVolume * 100);
        if (bgmLabel) bgmLabel.innerText = bgmSlider.value + '%';
        bgmSlider.addEventListener('input', (e) => {
            bgmVolume = e.target.value / 100;
            localStorage.setItem('bgmVolume', bgmVolume);
            if (bgmLabel) bgmLabel.innerText = e.target.value + '%';
            if (musicGainNode) musicGainNode.gain.value = bgmVolume;
        });
    }

    const startMusicOnce = () => {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        if (!isMuted && !musicPlaying) playMusic(currentMusicId);
        document.removeEventListener('click', startMusicOnce);
        document.removeEventListener('keydown', startMusicOnce);
    };
    document.addEventListener('click', startMusicOnce);
    document.addEventListener('keydown', startMusicOnce);
}

function unlockAudio() {
}

const trackPatterns = {
    world_explorer: { baseFreq: 261.63, mode: 'major', bpm: 110 },
    discovery:      { baseFreq: 329.63, mode: 'major', bpm: 125 },
    global_harmony: { baseFreq: 293.66, mode: 'major', bpm: 115 },
    sunny_equator:  { baseFreq: 349.23, mode: 'major', bpm: 130 },
    ocean_breeze:   { baseFreq: 220.00, mode: 'major', bpm: 100 }
};

function stopMusic() {
    musicPlaying = false;
    musicNodes.forEach(n => {
        try { n.stop(); } catch(e) {}
        try { n.disconnect(); } catch(e) {}
    });
    musicNodes = [];
    if (musicGainNode) {
        musicGainNode.disconnect();
        musicGainNode = null;
    }
}

function playMusic(trackId) {
    if (!audioCtx) return;
    stopMusic();
    if (isMuted) return;

    const pat = trackPatterns[trackId] || trackPatterns.world_explorer;
    musicGainNode = audioCtx.createGain();
    musicGainNode.gain.setValueAtTime(bgmVolume * 0.4, audioCtx.currentTime);
    musicGainNode.connect(audioCtx.destination);
    musicPlaying = true;

    const droneFreqs = [pat.baseFreq, pat.baseFreq * 1.25, pat.baseFreq * 1.5];
    droneFreqs.forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + freq, audioCtx.currentTime);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(musicGainNode);
        osc.start();
        musicNodes.push(osc);
    });

    const midOsc = audioCtx.createOscillator();
    const midGain = audioCtx.createGain();
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    midOsc.type = 'sine';
    midOsc.frequency.setValueAtTime(pat.baseFreq * 2, audioCtx.currentTime);
    lfo.frequency.setValueAtTime(0.5, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    midGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(midGain.gain);
    midOsc.connect(midGain);
    midGain.connect(musicGainNode);
    midOsc.start();
    lfo.start();
    musicNodes.push(midOsc, lfo);

    const beatInterval = 60 / pat.bpm;
    const arpNotes = [pat.baseFreq * 2, pat.baseFreq * 2.5, pat.baseFreq * 3, pat.baseFreq * 2.5];
    let arpIndex = 0;
    const scheduleBeats = () => {
        if (!musicPlaying) return;
        const pulse = audioCtx.createOscillator();
        const pulseGain = audioCtx.createGain();
        pulse.type = 'sine';
        pulse.frequency.setValueAtTime(arpNotes[arpIndex], audioCtx.currentTime);
        arpIndex = (arpIndex + 1) % arpNotes.length;
        
        pulseGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        pulse.connect(pulseGain);
        pulseGain.connect(musicGainNode);
        pulse.start();
        pulse.stop(audioCtx.currentTime + 0.2);
    };
    const beatTimer = setInterval(scheduleBeats, beatInterval * 1000);
    musicNodes.push({ stop: () => clearInterval(beatTimer), disconnect: () => {} });

    const atmOsc = audioCtx.createOscillator();
    const atmGain = audioCtx.createGain();
    const atmFilter = audioCtx.createBiquadFilter();
    atmOsc.type = 'sine';
    atmOsc.frequency.setValueAtTime(pat.baseFreq * 4, audioCtx.currentTime);
    atmFilter.type = 'bandpass';
    atmFilter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    atmFilter.Q.setValueAtTime(1, audioCtx.currentTime);
    atmGain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    atmOsc.connect(atmFilter);
    atmFilter.connect(atmGain);
    atmGain.connect(musicGainNode);
    atmOsc.start();
    musicNodes.push(atmOsc);

    console.log(`🎵 Playing: ${trackId}`);
}

function updateSoundToggleUI() {
    const toggleBtn = document.getElementById('sound-toggle');
    if (toggleBtn) {
        toggleBtn.innerHTML = isMuted ? '<span>🔇</span>' : '<span>🔊</span>';
        toggleBtn.title = isMuted ? 'Unmute' : 'Mute';
    }
}

export function playSound(name) {
    if (isMuted) return;
    if (!audioCtx) return;

    try {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const theme = soundThemes[currentSoundTheme] || soundThemes.cyber;
        if (theme[name]) {
            theme[name](audioCtx);
        }
    } catch (e) {
        console.warn('Sound play error:', e);
    }
}

export function startAmbientMusic() {
    if (!isMuted && audioCtx) {
        playMusic(currentMusicId);
    }
}

export function stopAmbientMusic() {
    stopMusic();
}

export function setSoundTheme(themeKey) {
    if (soundThemes[themeKey]) {
        currentSoundTheme = themeKey;
        localStorage.setItem('soundTheme', themeKey);
        playSound('click');
    }
}

export function getSoundThemes() {
    return Object.entries(soundThemes).map(([key, val]) => ({ key, name: val.name }));
}

export function getCurrentSoundTheme() {
    return currentSoundTheme;
}

export function setBackgroundMusic(musicId) {
    const track = musicLibrary.find(m => m.id === musicId);
    if (track && audioCtx) {
        currentMusicId = musicId;
        localStorage.setItem('currentMusicId', musicId);
        playMusic(musicId);
    } else if (track) {
        currentMusicId = musicId;
        localStorage.setItem('currentMusicId', musicId);
    }
}

export function getCurrentMusicId() {
    return currentMusicId;
}
