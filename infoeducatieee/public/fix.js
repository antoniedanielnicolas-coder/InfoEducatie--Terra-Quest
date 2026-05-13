const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// ── 1. FIX ORPHAN HTML (lines 903-908: stray closing divs/section after coaching) ──
html = html.replace(
  /(<\/section>)\s*\r?\n\s*\r?\n\s*<\/div>\s*\r?\n\s*<\/div>\s*\r?\n\s*\r?\n\s*<\/div>\s*\r?\n\s*<\/section>\s*\r?\n(\s*<!-- PROFILE PAGE -->)/,
  '$1\n\n' + buildShop() + '\n\n$2'
);

// ── 2. REPLACE COACHING SECTION ──
html = html.replace(
  /<section id="page-coaching"[\s\S]*?<\/section>/,
  buildCoaching()
);

// ── 3. FIX AI labels (remove broken data-i18n that resolves to key name) ──
html = html.replace(
  /<label for="ai-mode-select"[^>]*>Mode:<\/label>/,
  '<label for="ai-mode-select" style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-family:\'JetBrains Mono\',monospace;">Mod:</label>'
);
html = html.replace(
  /<label for="ai-voice-select"[^>]*>Voice:<\/label>/,
  '<label for="ai-voice-select" style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-family:\'JetBrains Mono\',monospace;">Voce:</label>'
);

// ── 4. FIX AI controls bar background (white text bug) ──
html = html.replace(
  'class="ai-controls-bar"',
  'class="ai-controls-bar" style="background:rgba(8,14,26,0.95);padding:10px 18px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;border-top:1px solid rgba(0,212,255,0.12);"'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done: index.html patched');

// ── 5. FIX lang/en.json ──
const en = JSON.parse(fs.readFileSync('lang/en.json', 'utf8'));
if (!en.ai) en.ai = {};
Object.assign(en.ai, {
  mode_label: 'Mode', voice_label: 'Voice',
  mode_normal: 'Normal', mode_learning: 'Learning',
  mode_assistant: 'Assistant', mode_test: 'Test'
});
fs.writeFileSync('lang/en.json', JSON.stringify(en, null, 2), 'utf8');

if (fs.existsSync('lang/ro.json')) {
  const ro = JSON.parse(fs.readFileSync('lang/ro.json', 'utf8'));
  if (!ro.ai) ro.ai = {};
  Object.assign(ro.ai, {
    mode_label: 'Mod', voice_label: 'Voce',
    mode_normal: 'Normal', mode_learning: 'Învățare',
    mode_assistant: 'Asistent', mode_test: 'Test'
  });
  fs.writeFileSync('lang/ro.json', JSON.stringify(ro, null, 2), 'utf8');
}
console.log('Done: lang files patched');

// ══════════════════════════════════════════════════
function buildShop() {
  return `        <!-- SHOP PAGE -->
        <section id="page-shop" class="page" style="overflow:auto;padding:0;background:#07101d;position:relative;min-height:calc(100vh - 70px);">
            <div style="max-width:100%;padding:22px 40px 0;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:5;">
                <h1 style="font-family:'Orbitron',sans-serif;color:white;margin:0;font-size:1.9rem;letter-spacing:5px;text-shadow:0 0 20px #00d4ff;">GEO<span style="color:#d4a843;">-MARKET</span></h1>
                <div style="background:rgba(212,168,67,0.1);border:1px solid rgba(212,168,67,0.4);padding:8px 22px;border-radius:40px;display:flex;align-items:center;gap:10px;">
                    <span style="font-size:1.4rem;">🧭</span><span id="shop-balance" style="color:#d4a843;font-family:'JetBrains Mono',monospace;font-weight:bold;font-size:1.5rem;">0</span>
                </div>
            </div>
            <div style="text-align:center;margin:14px 0 4px;position:relative;z-index:5;">
                <h2 id="shop-category-title" style="font-family:'Orbitron',sans-serif;color:rgba(255,255,255,0.1);font-size:2.6rem;letter-spacing:14px;text-transform:uppercase;margin:0;font-weight:900;">BANNERS</h2>
            </div>
            <button id="shop-prev-btn" style="position:fixed;left:14px;top:52%;transform:translateY(-50%);z-index:200;width:48px;height:48px;border-radius:50%;background:rgba(0,212,255,0.1);border:2px solid rgba(0,212,255,0.5);color:#00d4ff;font-size:1.3rem;cursor:pointer;display:none;">❮</button>
            <button id="shop-next-btn" style="position:fixed;right:14px;top:52%;transform:translateY(-50%);z-index:200;width:48px;height:48px;border-radius:50%;background:rgba(0,212,255,0.1);border:2px solid rgba(0,212,255,0.5);color:#00d4ff;font-size:1.3rem;cursor:pointer;">❯</button>
            <div id="shop-dots" style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:200;display:flex;gap:10px;"></div>
            <div style="overflow:hidden;position:relative;z-index:5;">
              <div id="shop-3d-container" style="display:flex;transition:transform 0.8s cubic-bezier(0.4,0,0.2,1);">

                <div class="shop-category-view" data-title="BANNERS" style="min-width:100%;padding:20px 80px 60px;">
                  <div style="perspective:1000px;">
                    <div style="position:relative;transform:rotateX(8deg);transform-origin:bottom center;">
                      <div style="position:absolute;bottom:28px;left:0;width:100%;display:flex;justify-content:center;gap:40px;z-index:2;">
                        ${shopItem({id:'banner-world',name:'World Map',price:100,rarity:'RARE',rc:'#d4a843',bc:'#00d4ff',img:'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400'})}
                        ${shopItem({id:'banner-cyber',name:'Cyberpunk',price:150,rarity:'EPIC',rc:'#b829e3',bc:'#b829e3',img:'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400'})}
                        ${shopItem({id:'banner-topo',name:'Topographic',price:300,rarity:'LEGEND',rc:'#f0c94d',bc:'#f0c94d',img:'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=400'})}
                      </div>
                      <div style="height:16px;background:linear-gradient(to bottom,#9d6128,#69400f);border-radius:6px 6px 0 0;box-shadow:0 -4px 18px rgba(0,0,0,0.5),inset 0 2px 3px rgba(255,255,255,0.1);margin-top:160px;"></div>
                      <div style="height:9px;background:linear-gradient(to bottom,#57330e,#3b2007);border-radius:0 0 4px 4px;"></div>
                    </div>
                  </div>
                </div>

                <div class="shop-category-view" data-title="AVATARS" style="min-width:100%;padding:20px 80px 60px;">
                  <div style="perspective:1000px;">
                    <div style="position:relative;transform:rotateX(8deg);transform-origin:bottom center;">
                      <div style="position:absolute;bottom:28px;left:0;width:100%;display:flex;justify-content:center;gap:40px;z-index:2;">
                        ${shopItemEmoji({id:'avatar-explorer',name:'Explorer',price:250,emoji:'🧗',bc:'#00e676'})}
                        ${shopItemEmoji({id:'avatar-globe',name:'Globetrotter',price:180,emoji:'🌍',bc:'#ff6b35'})}
                        ${shopItemEmoji({id:'avatar-agent',name:'Secret Agent',price:350,emoji:'🕵️',bc:'#b829e3'})}
                      </div>
                      <div style="height:16px;background:linear-gradient(to bottom,#9d6128,#69400f);border-radius:6px 6px 0 0;box-shadow:0 -4px 18px rgba(0,0,0,0.5),inset 0 2px 3px rgba(255,255,255,0.1);margin-top:160px;"></div>
                      <div style="height:9px;background:linear-gradient(to bottom,#57330e,#3b2007);border-radius:0 0 4px 4px;"></div>
                    </div>
                  </div>
                </div>

                <div class="shop-category-view" data-title="UPGRADES" style="min-width:100%;padding:20px 80px 60px;">
                  <div style="perspective:1000px;">
                    <div style="position:relative;transform:rotateX(8deg);transform-origin:bottom center;">
                      <div style="position:absolute;bottom:28px;left:0;width:100%;display:flex;justify-content:center;gap:40px;z-index:2;">
                        ${shopItemEmoji({id:'theme-volcanic',name:'Volcanic UI',price:400,emoji:'🌋',bc:'#ff4466'})}
                        ${shopItemEmoji({id:'powerup-chronos',name:'Chronos +10s',price:50,emoji:'⏳',bc:'#00d4ff'})}
                        ${shopItemEmoji({id:'powerup-boost',name:'XP Boost x2',price:75,emoji:'⚡',bc:'#f0c94d'})}
                      </div>
                      <div style="height:16px;background:linear-gradient(to bottom,#9d6128,#69400f);border-radius:6px 6px 0 0;box-shadow:0 -4px 18px rgba(0,0,0,0.5),inset 0 2px 3px rgba(255,255,255,0.1);margin-top:160px;"></div>
                      <div style="height:9px;background:linear-gradient(to bottom,#57330e,#3b2007);border-radius:0 0 4px 4px;"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
        </section>`;
}

function shopItem(o) {
  return `<div class="shop-item" style="width:165px;background:#0d1929;border:2px solid ${o.bc};border-radius:16px;overflow:hidden;cursor:pointer;box-shadow:0 14px 32px rgba(0,0,0,0.7);transition:transform 0.3s;" onmouseover="this.style.transform='translateY(-14px) scale(1.05)'" onmouseout="this.style.transform=''">
    <div style="height:120px;background:url('${o.img}') center/cover;position:relative;">
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,#0d1929);"></div>
      <span style="position:absolute;top:7px;right:7px;background:rgba(0,0,0,0.75);color:${o.rc};font-size:0.6rem;padding:2px 6px;border-radius:5px;border:1px solid ${o.rc};font-family:'JetBrains Mono';">${o.rarity}</span>
    </div>
    <div style="padding:11px;text-align:center;">
      <h4 style="color:white;font-family:'Orbitron';font-size:0.78rem;margin:0 0 7px;">${o.name}</h4>
      <div style="color:#d4a843;font-family:'JetBrains Mono';font-weight:bold;">🧭 ${o.price}</div>
      <button onclick="handleBuy(this)" data-price="${o.price}" data-id="${o.id}" style="margin-top:9px;width:100%;padding:6px;background:rgba(255,255,255,0.04);border:1px solid ${o.bc};color:${o.bc};border-radius:8px;cursor:pointer;font-family:'Orbitron';font-size:0.62rem;transition:all 0.2s;" onmouseover="this.style.background='${o.bc}';this.style.color='#07101d'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.color='${o.bc}'">CUMPĂRĂ</button>
    </div>
  </div>`;
}

function shopItemEmoji(o) {
  return `<div class="shop-item" style="width:165px;background:#0d1929;border:2px solid ${o.bc};border-radius:16px;overflow:hidden;cursor:pointer;box-shadow:0 14px 32px rgba(0,0,0,0.7);transition:transform 0.3s;" onmouseover="this.style.transform='translateY(-14px) scale(1.05)'" onmouseout="this.style.transform=''">
    <div style="height:120px;display:flex;align-items:center;justify-content:center;font-size:4rem;filter:drop-shadow(0 0 12px ${o.bc});">${o.emoji}</div>
    <div style="padding:11px;text-align:center;">
      <h4 style="color:white;font-family:'Orbitron';font-size:0.78rem;margin:0 0 7px;">${o.name}</h4>
      <div style="color:#d4a843;font-family:'JetBrains Mono';font-weight:bold;">🧭 ${o.price}</div>
      <button onclick="handleBuy(this)" data-price="${o.price}" data-id="${o.id}" style="margin-top:9px;width:100%;padding:6px;background:rgba(255,255,255,0.04);border:1px solid ${o.bc};color:${o.bc};border-radius:8px;cursor:pointer;font-family:'Orbitron';font-size:0.62rem;transition:all 0.2s;" onmouseover="this.style.background='${o.bc}';this.style.color='#07101d'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.color='${o.bc}'">CUMPĂRĂ</button>
    </div>
  </div>`;
}

function buildCoaching() {
  const mentors = [
    {name:'Mesteacăn George',role:'Profesor Geografie',interests:['profesori','colegi'],color:'#00d4ff',emoji:'👨‍🏫',desc:'Specializat în geografia Europei și climatologie. 8 ani experiență la liceu.',online:true},
    {name:'Nanu Andrei',role:'Olimpic Internațional',interests:['olimpici','colegi'],color:'#f0c94d',emoji:'🏆',desc:'Medalie argint OIG 2024. Expert în geografie fizică și teste grilă.',online:true},
    {name:'Casian Pahonțu',role:'Expert Geopolitică',interests:['experti'],color:'#b829e3',emoji:'🌍',desc:'Analist relații internaționale, NATO și conflicte moderne.',online:false},
    {name:'Bălanescu Alexandru',role:'Geolog Senior',interests:['geologi'],color:'#ff6b35',emoji:'🪨',desc:'Doctor în geologie. Expert în resurse naturale și topografie.',online:true},
    {name:'Ionescu Maria',role:'Cartograf',interests:['cartografie','profesori'],color:'#00e676',emoji:'🗺️',desc:'Specializată în GIS și cartografie digitală. Cursuri online.',online:true},
    {name:'Dumitrescu Vlad',role:'Coleg Olimpic',interests:['colegi','olimpici'],color:'#ff4466',emoji:'📚',desc:'Clasa a 11-a, medaliat la olimpiada națională. Ajutor cu testele.',online:false},
  ];
  
  const mentorCards = mentors.map(m => `
    <div class="mentor-card" data-interests="${m.interests.join(',')}" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:14px;transition:all 0.4s;position:relative;overflow:hidden;" onmouseover="this.style.borderColor='${m.color}';this.style.background='rgba(255,255,255,0.06)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.background='rgba(255,255,255,0.03)';this.style.transform=''">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,${m.color},transparent);"></div>
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,${m.color}33,${m.color}11);border:2px solid ${m.color}66;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0;">${m.emoji}</div>
        <div style="flex:1;">
          <h3 style="margin:0;color:white;font-size:1rem;font-weight:700;">${m.name}</h3>
          <div style="color:${m.color};font-size:0.78rem;margin-top:3px;">${m.role}</div>
        </div>
        <div style="width:9px;height:9px;border-radius:50%;background:${m.online ? '#00e676' : '#555'};box-shadow:${m.online ? '0 0 8px #00e676' : 'none'};flex-shrink:0;" title="${m.online ? 'Online' : 'Offline'}"></div>
      </div>
      <p style="font-size:0.83rem;color:rgba(255,255,255,0.45);margin:0;line-height:1.5;">${m.desc}</p>
      <button onclick="this.textContent='✓ Mesaj Trimis!';this.style.background='${m.color}';this.style.color='#07101d';setTimeout(()=>{this.textContent='Trimite Mesaj';this.style.background='rgba(255,255,255,0.04)';this.style.color='${m.color}'},2500)" style="padding:10px;background:rgba(255,255,255,0.04);border:1px solid ${m.color}55;color:${m.color};border-radius:10px;cursor:pointer;font-size:0.82rem;transition:all 0.3s;font-family:'Orbitron',sans-serif;letter-spacing:1px;" onmouseover="this.style.borderColor='${m.color}'" onmouseout="this.style.borderColor='${m.color}55'">Trimite Mesaj</button>
    </div>`).join('');

  return `        <!-- COACHING PAGE -->
        <section id="page-coaching" class="page" style="padding:0;overflow:auto;background:linear-gradient(135deg,#07101d 0%,#0d1929 100%);">
            <div style="max-width:1100px;margin:0 auto;padding:40px 24px 60px;">
                <div style="text-align:center;margin-bottom:40px;">
                    <h1 style="font-family:'Orbitron',sans-serif;font-size:2.5rem;margin:0;color:white;text-shadow:0 0 30px rgba(0,212,255,0.3);">Geo <span style="background:linear-gradient(to right,#00d4ff,#b829e3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Coaching</span></h1>
                    <p style="color:rgba(255,255,255,0.4);margin:10px 0 0;font-size:0.95rem;">Conectează-te cu experți și colegi care te pot ajuta să excelezi în geografie.</p>
                </div>
                <div id="coaching-questionnaire" style="max-width:640px;margin:0 auto 40px;background:rgba(255,255,255,0.03);border:1px solid rgba(0,212,255,0.2);border-radius:20px;padding:32px;backdrop-filter:blur(10px);">
                    <h2 style="font-family:'Orbitron',sans-serif;color:#00d4ff;margin:0 0 8px;font-size:1.2rem;">🎯 Ce te interesează?</h2>
                    <p style="color:rgba(255,255,255,0.4);font-size:0.85rem;margin:0 0 22px;">Selectează și îți recomandăm mentorii potriviți.</p>
                    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:26px;" id="interest-tags">
                        ${['👥 Colegi de studiu:colegi','🎓 Profesori:profesori','🌍 Experți Geopolitică:experti','🪨 Geologi:geologi','🏆 Olimpici:olimpici','🗺️ Cartografie:cartografie'].map(s => {
                          const [label,val] = s.split(':');
                          return `<label style="cursor:pointer;"><input type="checkbox" name="interest" value="${val}" style="display:none;" onchange="this.parentElement.querySelector('span').style.background=this.checked?'rgba(0,212,255,0.2)':'transparent';this.parentElement.querySelector('span').style.borderColor=this.checked?'#00d4ff':'rgba(0,212,255,0.25)';this.parentElement.querySelector('span').style.color=this.checked?'white':'rgba(255,255,255,0.55)'"><span style="display:block;padding:9px 18px;border-radius:30px;border:2px solid rgba(0,212,255,0.25);color:rgba(255,255,255,0.55);font-size:0.83rem;transition:all 0.3s;">${label}</span></label>`;
                        }).join('')}
                    </div>
                    <button id="coaching-submit-btn" style="width:100%;padding:14px;background:linear-gradient(to right,#00d4ff,#0077ff);border:none;border-radius:12px;color:white;font-family:'Orbitron',sans-serif;font-size:0.88rem;font-weight:bold;letter-spacing:2px;cursor:pointer;transition:all 0.3s;box-shadow:0 0 25px rgba(0,212,255,0.25);" onmouseover="this.style.boxShadow='0 0 40px rgba(0,212,255,0.5)';this.style.transform='scale(1.01)'" onmouseout="this.style.boxShadow='0 0 25px rgba(0,212,255,0.25)';this.style.transform=''">🔍 GĂSEȘTE MENTORII MEI</button>
                </div>
                <div id="coaching-dashboard" class="hidden">
                    <div style="text-align:center;margin-bottom:26px;">
                        <h3 id="coaching-result-title" style="font-family:'Orbitron',sans-serif;color:white;font-size:1.1rem;margin:0;">Mentori Recomandați</h3>
                        <p style="color:rgba(255,255,255,0.3);font-size:0.78rem;margin:6px 0 0;">Bazat pe interesele tale</p>
                    </div>
                    <div id="mentor-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;">${mentorCards}</div>
                    <div style="text-align:center;margin-top:28px;">
                        <button id="coaching-reset-btn" style="padding:10px 28px;background:transparent;border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.35);border-radius:10px;cursor:pointer;font-size:0.8rem;transition:all 0.3s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.35)';this.style.color='white'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)';this.style.color='rgba(255,255,255,0.35)'">← Modifică preferințele</button>
                    </div>
                </div>
            </div>
        </section>`;
}
