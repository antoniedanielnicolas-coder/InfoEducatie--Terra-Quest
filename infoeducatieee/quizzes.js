import { gradesData, testSets } from './data/quizzes.js?v=4';
import { currentLang, t } from './i18n.js';
import { playSound } from './sounds.js';

let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 0;
let currentIslandMusic = null;

export function initQuizzes() {
    renderGradeIslands();
    
    document.getElementById('results-back-btn')?.addEventListener('click', () => {
        document.getElementById('test-results').classList.add('hidden');
        document.getElementById('island-view').classList.remove('hidden');
        playSound('click');
    });

    document.getElementById('results-certificate-btn')?.addEventListener('click', () => {
        const resultsCard = document.querySelector('.results-card');
        if (!resultsCard) return;

        const actions = document.querySelector('.results-actions');
        if (actions) actions.style.opacity = '0';

        if (window.html2canvas) {
            html2canvas(resultsCard, { 
                backgroundColor: '#0a0e17',
                scale: 2,
                logging: false,
                useCORS: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `TerraQuest_Certificate_${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                if (actions) actions.style.opacity = '1';
                if (window.showToast) {
                    window.showToast(currentLang === 'ro' ? "Certificat salvat!" : "Certificate saved!", "success");
                }
            }).catch(err => {
                console.error("Screenshot failed", err);
                if (actions) actions.style.opacity = '1';
            });
        }
    });

    document.getElementById('results-retry-btn')?.addEventListener('click', () => {
        document.getElementById('test-results').classList.add('hidden');
        document.getElementById('test-container').classList.remove('hidden');
        // Restart the current test
        const testId = document.getElementById('test-container').getAttribute('data-current-test');
        if(testId) startTest(testId);
    });

    document.addEventListener('languageChanged', () => {
        if (!document.getElementById('tests-selection').classList.contains('hidden')) {
            renderGradeIslands();
        } else if (!document.getElementById('test-container').classList.contains('hidden')) {
            loadQuestion();
        }
    });
}

function renderGradeIslands() {
    let container = document.getElementById('tests-selection');
    if (!container) return;
    
    container.innerHTML = '';
    container.className = 'games-selection'; // Keep using games-selection class for grid layout

    gradesData.forEach(grade => {
        const card = document.createElement('div');
        card.className = 'game-card glass-card';
        card.style.borderTop = `3px solid ${grade.color}`;
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        card.innerHTML = `
            <div class="game-card-visual" style="margin-bottom:15px; position:relative; overflow:hidden;">
                <div class="game-icon-large" style="filter:drop-shadow(0 0 12px ${grade.color}88); transform:scale(1.2);">${grade.icon}</div>
                <div class="game-card-glow" style="background:${grade.color}44; filter:blur(20px);"></div>
            </div>
            <h3 style="color:white;margin-bottom:8px;font-size:1.4rem;">${grade.title[currentLang] || grade.title.en}</h3>
            <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:15px;">${grade.desc[currentLang] || grade.desc.en}</p>
            <div style="display:flex;align-items:center;justify-content:center;margin-top:auto;">
                <button class="btn btn-outline" style="border-color:${grade.color};color:${grade.color};width:100%;font-weight:bold;">
                    ${currentLang === 'ro' ? 'Explorează Insula' : 'Explore Island'}
                </button>
            </div>
        `;
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = `0 15px 30px ${grade.color}33`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });

        card.addEventListener('click', () => {
            playSound('click');
            // Zoom animation
            card.style.transform = 'scale(2)';
            card.style.opacity = '0';
            setTimeout(() => {
                openIsland(grade);
                card.style.transform = '';
                card.style.opacity = '1';
            }, 400);
        });

        container.appendChild(card);
    });
}

function openIsland(grade) {
    document.getElementById('tests-selection').classList.add('hidden');
    
    let islandView = document.getElementById('island-view');
    if (!islandView) {
        islandView = document.createElement('div');
        islandView.id = 'island-view';
        islandView.className = 'island-view';
        document.getElementById('page-tests').appendChild(islandView);
    }
    islandView.classList.remove('hidden');
    
    // Play custom ambient music for the island
    playIslandMusic(grade.id);

    // Get tests for this grade (should be 10 levels)
    const gradeTests = testSets.filter(t => t.grade === grade.id);
    
    // Set background image based on grade
    let bgImage = '';
    if(grade.id === 9) bgImage = 'assets/tropical_map.png';
    else if(grade.id === 10) bgImage = 'assets/desert_map.png';
    else if(grade.id === 11) bgImage = 'assets/arctic_map.png';
    else if(grade.id === 12) bgImage = 'assets/volcanic_map.png';

    // Generate path points
    const points = [];
    for(let i=0; i<gradeTests.length; i++) {
        // x goes from 10% to 90%
        let x = 10 + (i / (gradeTests.length - 1)) * 80;
        // y is a sine wave
        let y = 50 + Math.sin(i * 1.2) * 30;
        points.push({x, y});
    }

    // Generate SVG path connecting the points
    let svgPath = '';
    if (points.length > 0) {
        svgPath += `M ${points[0].x} ${points[0].y} `;
        for(let i=1; i<points.length; i++) {
            // simple cubic bezier for smooth curves
            let prev = points[i-1];
            let curr = points[i];
            let cpX1 = prev.x + (curr.x - prev.x)/2;
            let cpX2 = prev.x + (curr.x - prev.x)/2;
            svgPath += `C ${cpX1} ${prev.y}, ${cpX2} ${curr.y}, ${curr.x} ${curr.y} `;
        }
    }

    islandView.innerHTML = `
        <div class="island-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;position:relative;z-index:10;">
            <button class="btn btn-outline" id="back-to-islands" style="border-color:${grade.color};color:${grade.color};background:rgba(10,14,23,0.8);">
                ⬅ ${currentLang === 'ro' ? 'Înapoi la Hartă' : 'Back to Map'}
            </button>
            <h2 style="font-family:'Orbitron',sans-serif;font-size:2rem;color:white;text-shadow:0 0 10px ${grade.color};margin:0;background:rgba(10,14,23,0.8);padding:10px 20px;border-radius:15px;backdrop-filter:blur(5px);">
                ${grade.icon} ${grade.title[currentLang] || grade.title.en}
            </h2>
            <div style="width:150px;"></div>
        </div>
        
        <div class="island-container" style="position:relative;width:100%;height:600px;border-radius:20px;overflow:hidden;box-shadow:0 0 40px ${grade.color}44;border:4px solid ${grade.color};background:url('${bgImage}') center/cover no-repeat;">
            
            <!-- SVG Path connecting the levels -->
            <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 5px 5px rgba(0,0,0,0.5));" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="${svgPath}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-dasharray="2,2"></path>
            </svg>
            
            <!-- Level Nodes -->
            <div style="position:absolute;inset:0;pointer-events:none;">
                ${gradeTests.map((test, index) => {
                    let p = points[index];
                    let locked = index > 0 && !localStorage.getItem('quiz_score_' + gradeTests[index-1].id);
                    // For demo, let's just leave them all unlocked or unlock first 2. Let's make them all unlocked for now.
                    let score = localStorage.getItem('quiz_score_' + test.id) || 0;
                    let stars = 0;
                    if (score >= 80) stars = 3;
                    else if (score >= 60) stars = 2;
                    else if (score >= 40) stars = 1;
                    
                    let starHtml = '';
                    if(stars > 0) {
                        starHtml = '<div style="position:absolute;top:-15px;display:flex;gap:2px;">';
                        for(let s=0; s<3; s++) {
                            starHtml += `<span style="font-size:12px;color:${s<stars ? 'gold' : '#444'};text-shadow:0 0 2px black;">⭐</span>`;
                        }
                        starHtml += '</div>';
                    }

                    return `
                        <div class="island-node level-btn" data-test-id="${test.id}" style="
                            pointer-events:auto;
                            position:absolute;
                            left:${p.x}%;
                            top:${p.y}%;
                            transform:translate(-50%, -50%);
                            width:60px;
                            height:60px;
                            background:radial-gradient(circle at 30% 30%, ${grade.color}, #111);
                            border:3px solid white;
                            border-radius:50%;
                            display:flex;
                            justify-content:center;
                            align-items:center;
                            cursor:pointer;
                            box-shadow:0 10px 15px rgba(0,0,0,0.6), inset 0 0 10px rgba(255,255,255,0.5);
                            transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        " onmouseenter="this.style.transform='translate(-50%, -50%) scale(1.2)'" onmouseleave="this.style.transform='translate(-50%, -50%) scale(1)'">
                            ${starHtml}
                            <span style="font-family:'Orbitron',sans-serif;font-weight:900;color:white;font-size:1.5rem;text-shadow:2px 2px 0px rgba(0,0,0,0.5);">${index + 1}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    document.getElementById('back-to-islands').addEventListener('click', () => {
        playSound('click');
        islandView.classList.add('hidden');
        document.getElementById('tests-selection').classList.remove('hidden');
        stopIslandMusic();
    });

    document.querySelectorAll('.island-node').forEach((node, index) => {
        node.addEventListener('click', () => {
            playSound('click');
            const testId = node.getAttribute('data-test-id');
            islandView.classList.add('hidden');
            document.getElementById('test-container').classList.remove('hidden');
            document.getElementById('test-container').setAttribute('data-current-test', testId);
            startTest(testId);
        });
    });
}

function playIslandMusic(gradeId) {
    stopIslandMusic();
    currentIslandMusic = new Audio();
    currentIslandMusic.loop = true;
    currentIslandMusic.volume = 0.3;
    
    if(gradeId === 9) currentIslandMusic.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
    if(gradeId === 10) currentIslandMusic.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';
    if(gradeId === 11) currentIslandMusic.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3';
    if(gradeId === 12) currentIslandMusic.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3';
    
    currentIslandMusic.play().catch(e => console.log("Audio play blocked by browser", e));
}

function stopIslandMusic() {
    if(currentIslandMusic) {
        currentIslandMusic.pause();
        currentIslandMusic = null;
    }
}

function startTest(testId) {
    const testData = testSets.find(t => t.id === testId);
    if(!testData) return;

    currentQuizQuestions = [...testData.questions].sort(() => 0.5 - Math.random());
    currentQuestionIndex = 0;
    score = 0;
    
    timeLeft = testData.time;
    startTimer();
    
    document.getElementById('test-title').innerText = testData.name[currentLang] || testData.name.en;
    
    document.getElementById('test-submit-btn').style.display = 'none';
    document.getElementById('test-next-btn').style.display = 'inline-flex';
    document.getElementById('test-next-btn').disabled = true;
    
    loadQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (!display) return;
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    display.innerText = `${m}:${s}`;
    
    if (timeLeft <= 10) {
        display.style.color = 'var(--error)';
        display.classList.add('animate-pulse');
    } else {
        display.style.color = 'var(--text-primary)';
        display.classList.remove('animate-pulse');
    }
}

function loadQuestion() {
    const qText = document.getElementById('question-text');
    const optsGrid = document.getElementById('options-grid');
    const qNum = document.getElementById('test-question-num');
    const progressFill = document.getElementById('test-progress-fill');
    
    if (!qText || currentQuestionIndex >= currentQuizQuestions.length) return;
    
    const q = currentQuizQuestions[currentQuestionIndex];
    qNum.innerText = `${currentQuestionIndex + 1}/${currentQuizQuestions.length}`;
    progressFill.style.width = `${((currentQuestionIndex) / currentQuizQuestions.length) * 100}%`;
    
    qText.innerText = q.question[currentLang] || q.question.en;
    optsGrid.innerHTML = '';
    
    const nextBtn = document.getElementById('test-next-btn');
    nextBtn.disabled = true;

    if (q.type === 'multiple_choice' || q.type === 'true_false') {
        const options = q.options[currentLang] || q.options.en;
        options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = optText;
            btn.dataset.idx = idx;
            btn.onclick = () => selectOption(btn, q);
            optsGrid.appendChild(btn);
        });
    }
    
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    newNextBtn.addEventListener('click', () => {
        playSound('click');
        currentQuestionIndex++;
        if (currentQuestionIndex >= currentQuizQuestions.length) {
            finishQuiz();
        } else {
            loadQuestion();
            if (currentQuestionIndex === currentQuizQuestions.length - 1) {
                newNextBtn.innerText = currentLang === 'ro' ? 'Finalizare' : 'Submit';
            } else {
                newNextBtn.innerText = currentLang === 'ro' ? 'Următorul' : 'Next';
            }
        }
    });
}

function selectOption(btn, q) {
    if (document.querySelector('.option-btn.selected')) return;

    btn.classList.add('selected');
    const selectedIdx = parseInt(btn.dataset.idx);
    const isCorrect = selectedIdx === q.correctIndex;

    if (isCorrect) {
        btn.classList.add('correct');
        playSound('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        playSound('wrong');
        document.querySelectorAll('.option-btn').forEach(b => {
            if (parseInt(b.dataset.idx) === q.correctIndex) {
                b.classList.add('correct');
            }
        });
    }

    const expl = document.createElement('p');
    expl.style.marginTop = '15px';
    expl.style.color = isCorrect ? 'var(--success)' : 'var(--warning)';
    expl.style.fontSize = '0.9rem';
    expl.style.background = 'rgba(255,255,255,0.05)';
    expl.style.padding = '10px';
    expl.style.borderRadius = '8px';
    expl.style.borderLeft = `3px solid ${isCorrect ? 'var(--success)' : 'var(--warning)'}`;
    expl.innerText = q.explanation[currentLang] || q.explanation.en;
    document.getElementById('options-grid').appendChild(expl);

    document.getElementById('test-next-btn').disabled = false;
}

function finishQuiz() {
    clearInterval(timerInterval);
    const percentage = Math.round((score / currentQuizQuestions.length) * 100);
    
    document.getElementById('test-container').classList.add('hidden');
    document.getElementById('test-results').classList.remove('hidden');
    
    const testId = document.getElementById('test-container').getAttribute('data-current-test');
    const oldBest = parseInt(localStorage.getItem(`quiz_score_${testId}`) || 0);
    if (percentage > oldBest) {
        localStorage.setItem(`quiz_score_${testId}`, percentage);
    }
    
    document.getElementById('results-title').innerText = currentLang === 'ro' ? 'Test Finalizat!' : 'Test Complete!';
    document.getElementById('results-stats').innerHTML = `
        <p style="font-size: 3rem; font-weight:900; color: ${percentage >= 80 ? 'var(--success)' : (percentage >= 50 ? 'var(--gold-bright)' : 'var(--error)')}; margin-bottom: 15px; font-family:'Orbitron',sans-serif;">${percentage}%</p>
        <p style="font-size:1.1rem; color:var(--text-secondary); margin-bottom:8px;">${currentLang === 'ro' ? 'Răspunsuri corecte' : 'Correct answers'}: <span style="color:white;font-weight:bold;">${score} / ${currentQuizQuestions.length}</span></p>
        <p style="font-size:1.1rem; color:var(--text-secondary);">${currentLang === 'ro' ? 'Timp rămas' : 'Time left'}: <span style="color:white;font-weight:bold;">${Math.floor(timeLeft/60)}m ${timeLeft%60}s</span></p>
    `;

    const testData = testSets.find(t => t.id === testId);
    let multiplier = testData ? (testData.type === 'long' ? 3 : (testData.type === 'medium' ? 2 : 1)) : 1;
    
    const xpEarned = score * 10 * multiplier;
    if (xpEarned > 0) {
        document.dispatchEvent(new CustomEvent('xpGained', { detail: { amount: xpEarned } }));
        document.dispatchEvent(new CustomEvent('coinsGained', { detail: { amount: Math.floor(xpEarned / 5) } }));
    }
    
    if (percentage >= 80) {
        if(typeof window.triggerConfetti === 'function') window.triggerConfetti();
    }
}
