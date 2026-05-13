const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const shopSection = `        <!-- SHOP PAGE -->
        <section id="page-shop" class="page" style="padding:0;overflow:hidden;background:linear-gradient(160deg,#0a1628 0%,#0d1f3c 50%,#0a1628 100%);position:relative;height:calc(100vh - 70px);">

            <!-- Ambient radial glow -->
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:400px;background:radial-gradient(ellipse,rgba(0,150,255,0.06) 0%,transparent 70%);pointer-events:none;z-index:0;"></div>

            <!-- ═══ TOP HEADER BAR ═══ -->
            <div style="position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:16px 50px 0;">
                <div>
                    <h1 style="font-family:'Orbitron',sans-serif;color:white;margin:0;font-size:1.7rem;letter-spacing:6px;text-shadow:0 0 25px rgba(0,180,255,0.5);">GEO<span style="color:#d4a843;">-MARKET</span></h1>
                    <p style="color:rgba(255,255,255,0.3);font-size:0.7rem;margin:2px 0 0;font-family:'JetBrains Mono',monospace;letter-spacing:3px;">BROWSE · BUY · UPGRADE</p>
                </div>
                <div style="display:flex;align-items:center;gap:20px;">
                    <div style="background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.35);padding:8px 20px;border-radius:40px;display:flex;align-items:center;gap:8px;box-shadow:0 0 18px rgba(212,168,67,0.1);">
                        <span style="font-size:1.2rem;">🧭</span>
                        <span id="shop-balance" style="color:#d4a843;font-family:'JetBrains Mono',monospace;font-weight:bold;font-size:1.4rem;">0</span>
                        <span style="color:rgba(255,255,255,0.2);font-size:0.65rem;font-family:'Orbitron',monospace;">CP</span>
                    </div>
                </div>
            </div>

            <!-- ═══ CATEGORY TABS ═══ -->
            <div style="position:relative;z-index:10;display:flex;justify-content:center;gap:6px;margin:12px 0 8px;">
                <button class="shop-tab-btn active" data-cat="0" onclick="switchShopCat(0,this)" style="padding:7px 22px;border-radius:25px;border:1px solid rgba(0,212,255,0.5);background:rgba(0,212,255,0.15);color:#00d4ff;font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:2px;cursor:pointer;transition:all 0.3s;">🖼️ BANNERE</button>
                <button class="shop-tab-btn" data-cat="1" onclick="switchShopCat(1,this)" style="padding:7px 22px;border-radius:25px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(255,255,255,0.4);font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:2px;cursor:pointer;transition:all 0.3s;">🧗 AVATARE</button>
                <button class="shop-tab-btn" data-cat="2" onclick="switchShopCat(2,this)" style="padding:7px 22px;border-radius:25px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(255,255,255,0.4);font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:2px;cursor:pointer;transition:all 0.3s;">⚡ UPGRADE</button>
            </div>

            <!-- ═══ CATEGORY TITLE ═══ -->
            <div style="text-align:center;position:relative;z-index:10;margin-bottom:6px;">
                <span id="shop-cat-label" style="font-family:'Orbitron',sans-serif;color:rgba(255,255,255,0.07);font-size:2.4rem;letter-spacing:18px;font-weight:900;text-transform:uppercase;pointer-events:none;">BANNERE</span>
            </div>

            <!-- ═══ SHELF VIEWPORT ═══ -->
            <div style="position:relative;z-index:5;overflow:hidden;height:calc(100% - 160px);">
                <div id="shop-shelf-track" style="display:flex;height:100%;transition:transform 0.75s cubic-bezier(0.4,0,0.2,1);will-change:transform;">

                    <!-- ██ CATEGORY 0 : BANNERE (9 items, 3 shelves) ██ -->
                    <div class="shop-cat-panel" style="min-width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;gap:0;padding:0 60px;">

                        ${makeShelf([
  {id:'ban-world',  name:'World Map',    price:100, rarity:'RARE',    rc:'#d4a843', bc:'#00d4ff', img:'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=300'},
  {id:'ban-cyber',  name:'Cyberpunk',    price:150, rarity:'EPIC',    rc:'#b829e3', bc:'#b829e3', img:'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300'},
  {id:'ban-topo',   name:'Topographic', price:300, rarity:'LEGEND',  rc:'#f0c94d', bc:'#f0c94d', img:'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=300'},
  {id:'ban-space',  name:'Deep Space',  price:200, rarity:'EPIC',    rc:'#b829e3', bc:'#b829e3', img:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300'},
  {id:'ban-ocean',  name:'Ocean View',  price:120, rarity:'RARE',    rc:'#d4a843', bc:'#00d4ff', img:'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=300'},
  {id:'ban-mnt',    name:'Mountain',    price:180, rarity:'EPIC',    rc:'#b829e3', bc:'#00e676', img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300'},
  {id:'ban-desert', name:'Desert',      price:160, rarity:'RARE',    rc:'#d4a843', bc:'#ff6b35', img:'https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=300'},
  {id:'ban-arctic', name:'Arctic',      price:220, rarity:'EPIC',    rc:'#b829e3', bc:'#00d4ff', img:'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=300'},
  {id:'ban-gold',   name:'Golden Age',  price:500, rarity:'LEGEND',  rc:'#f0c94d', bc:'#f0c94d', img:'https://images.unsplash.com/photo-1503756234508-e32369269dde?q=80&w=300'},
])}

                    </div>

                    <!-- ██ CATEGORY 1 : AVATARE (9 items, 3 shelves) ██ -->
                    <div class="shop-cat-panel" style="min-width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;gap:0;padding:0 60px;">

                        ${makeShelf([
  {id:'av-explorer', name:'Explorer',     price:250, emoji:'🧗', bc:'#00e676'},
  {id:'av-globe',    name:'Globetrotter', price:180, emoji:'🌍', bc:'#ff6b35'},
  {id:'av-agent',    name:'Secret Agent', price:350, emoji:'🕵️', bc:'#b829e3'},
  {id:'av-scientist',name:'Scientist',    price:200, emoji:'🧑‍🔬', bc:'#00d4ff'},
  {id:'av-ninja',    name:'Geo Ninja',    price:300, emoji:'🥷', bc:'#ff4466'},
  {id:'av-astronaut',name:'Astronaut',    price:400, emoji:'👩‍🚀', bc:'#d4a843'},
  {id:'av-wizard',   name:'Geo Wizard',  price:280, emoji:'🧙‍♂️', bc:'#b829e3'},
  {id:'av-knight',   name:'Knight',      price:320, emoji:'💂', bc:'#00e676'},
  {id:'av-champion', name:'Champion',    price:600, emoji:'👑', bc:'#f0c94d'},
])}

                    </div>

                    <!-- ██ CATEGORY 2 : UPGRADES (9 items, 3 shelves) ██ -->
                    <div class="shop-cat-panel" style="min-width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;gap:0;padding:0 60px;">

                        ${makeShelf([
  {id:'up-volcanic', name:'Volcanic UI',   price:400, emoji:'🌋', bc:'#ff4466'},
  {id:'up-chronos',  name:'Chronos +10s', price:50,  emoji:'⏳', bc:'#00d4ff'},
  {id:'up-boost',    name:'XP Boost x2',  price:75,  emoji:'⚡', bc:'#f0c94d'},
  {id:'up-compass',  name:'Compass Pro',  price:120, emoji:'🧭', bc:'#d4a843'},
  {id:'up-shield',   name:'Shield',       price:90,  emoji:'🛡️', bc:'#00e676'},
  {id:'up-emerald',  name:'Emerald UI',   price:350, emoji:'💎', bc:'#00e676'},
  {id:'up-streak',   name:'Streak Saver', price:60,  emoji:'🔥', bc:'#ff6b35'},
  {id:'up-hint',     name:'Hint Pack x5', price:40,  emoji:'💡', bc:'#f0c94d'},
  {id:'up-arctic',   name:'Arctic UI',    price:380, emoji:'❄️', bc:'#00d4ff'},
])}

                    </div>

                </div>
            </div>

            <!-- ═══ NAV ARROWS ═══ -->
            <button id="shop-prev-btn" onclick="shopNav(-1)" style="display:none;position:absolute;left:14px;top:55%;transform:translateY(-50%);z-index:30;width:46px;height:46px;border-radius:50%;background:rgba(0,180,255,0.1);border:2px solid rgba(0,212,255,0.45);color:#00d4ff;font-size:1.2rem;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.background='rgba(0,212,255,0.25)'" onmouseout="this.style.background='rgba(0,180,255,0.1)'">❮</button>
            <button id="shop-next-btn" onclick="shopNav(1)"  style="position:absolute;right:14px;top:55%;transform:translateY(-50%);z-index:30;width:46px;height:46px;border-radius:50%;background:rgba(0,180,255,0.1);border:2px solid rgba(0,212,255,0.45);color:#00d4ff;font-size:1.2rem;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.background='rgba(0,212,255,0.25)'" onmouseout="this.style.background='rgba(0,180,255,0.1)'">❯</button>

        </section>`;

// ──────────────────────────────────────────────────────────
function makeShelf(items) {
  // 3 shelves of 3 items each
  let out = '';
  for (let s = 0; s < 3; s++) {
    const row = items.slice(s * 3, s * 3 + 3);
    out += `
        <div style="position:relative;margin-bottom:0;">
          <!-- Items sitting on the shelf -->
          <div style="display:flex;justify-content:center;gap:32px;padding:0 0 12px;">
            ${row.map(it => makeItem(it)).join('')}
          </div>
          <!-- Wooden shelf board -->
          <div style="height:14px;background:linear-gradient(to bottom,#b87333 0%,#8b5a2b 35%,#6b3f15 100%);border-radius:4px;box-shadow:0 6px 20px rgba(0,0,0,0.7),inset 0 2px 3px rgba(255,220,140,0.25),0 2px 0 #3d2008;position:relative;">
            <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(0,0,0,0.08) 80px,rgba(0,0,0,0.08) 82px);border-radius:4px;"></div>
          </div>
          <!-- shelf shadow -->
          <div style="height:8px;background:linear-gradient(to bottom,rgba(0,0,0,0.45),transparent);"></div>
        </div>`;
  }
  return out;
}

function makeItem(o) {
  const hasImg = !!o.img;
  const inner = hasImg
    ? `<div style="flex:1;background:url('${o.img}') center/cover;"></div>`
    : `<div style="flex:1;display:flex;align-items:center;justify-content:center;font-size:2.8rem;filter:drop-shadow(0 0 10px ${o.bc});">${o.emoji}</div>`;
  const rarityBadge = o.rarity
    ? `<div style="position:absolute;top:5px;right:5px;background:rgba(0,0,0,0.75);color:${o.rc};font-size:0.52rem;padding:2px 5px;border-radius:4px;border:1px solid ${o.rc};font-family:'JetBrains Mono';font-weight:bold;z-index:2;">${o.rarity}</div>`
    : '';
  return `<div class="shop-item" data-id="${o.id}" style="width:140px;height:155px;background:#0b1420;border:2px solid ${o.bc};border-radius:14px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;box-shadow:0 10px 25px rgba(0,0,0,0.65),0 0 15px ${o.bc}22;transition:transform 0.28s cubic-bezier(0.175,0.885,0.32,1.275),box-shadow 0.28s;position:relative;"
    onmouseover="this.style.transform='translateY(-12px) scale(1.07)';this.style.boxShadow='0 20px 40px rgba(0,0,0,0.8),0 0 35px ${o.bc}66'"
    onmouseout="this.style.transform='';this.style.boxShadow='0 10px 25px rgba(0,0,0,0.65),0 0 15px ${o.bc}22'">
    ${rarityBadge}
    ${inner}
    <div style="padding:7px 8px 8px;background:rgba(5,10,20,0.95);border-top:1px solid ${o.bc}44;flex-shrink:0;">
      <div style="color:white;font-family:'Orbitron',sans-serif;font-size:0.62rem;margin:0 0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${o.name}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">
        <span style="color:#d4a843;font-family:'JetBrains Mono';font-size:0.72rem;font-weight:bold;">🧭 ${o.price}</span>
        <button onclick="event.stopPropagation();handleBuy(this)" data-price="${o.price}" data-id="${o.id}" style="padding:3px 9px;background:${o.bc}22;border:1px solid ${o.bc};color:${o.bc};border-radius:6px;cursor:pointer;font-family:'Orbitron',sans-serif;font-size:0.55rem;letter-spacing:1px;transition:all 0.2s;white-space:nowrap;"
          onmouseover="this.style.background='${o.bc}';this.style.color='#07101d'"
          onmouseout="this.style.background='${o.bc}22';this.style.color='${o.bc}'">BUY</button>
      </div>
    </div>
  </div>`;
}
// ──────────────────────────────────────────────────────────

// Replace shop section
html = html.replace(/<section id="page-shop"[\s\S]*?<\/section>/, shopSection);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Shop replaced OK');
