// ---------- live examples: render + filter + modal ----------
const EX_DATA = window.OMB_EXAMPLES || [];

const catChip = (t) => `<span class="ex-tag">${t}</span>`;
const exGrid = document.getElementById('exGrid');
const exSearch = document.getElementById('exSearch');
const exCount = document.getElementById('exCount');

function exCard(it){
  const d = document.createElement('div');
  d.className = 'ex-card';
  d.dataset.text = (it.prompt + ' ' + it.response + ' ' + it.tags.join(' ')).toLowerCase();
  d.dataset.cat = it.tags[0] || 'misc';
  d.innerHTML = `
    <div style="display:flex;align-items:center;gap:.5rem;">
      <span class="ex-num">${String(it.n).padStart(2,'0')}</span>
      <div class="ex-tags">${it.tags.slice(0,2).map(catChip).join('')}</div>
    </div>
    <p class="ex-prompt">${it.prompt}</p>
    <span class="ex-open">Read full response →</span>`;
  d.addEventListener('click', ()=>openExample(it));
  return d;
}

// derive unique categories from first tag
const cats = [...new Set(EX_DATA.map(i=>i.tags[0]).filter(Boolean))];
const chipRow = document.getElementById('chipRow');
cats.forEach(c=>{
  const b = document.createElement('button');
  b.className = 'chip'; b.textContent = c; b.dataset.cat = c;
  b.addEventListener('click', ()=>{
    const on = b.classList.contains('active');
    chipRow.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
    if(!on){ b.classList.add('active'); }
    filterExamples();
  });
  chipRow.appendChild(b);
});

let activeCat = null;
function filterExamples(){
  const q = (exSearch.value||'').trim().toLowerCase();
  activeCat = chipRow.querySelector('.chip.active')?.dataset.cat || null;
  let shown = 0;
  exGrid.querySelectorAll('.ex-card').forEach(card=>{
    const okQ = !q || card.dataset.text.includes(q);
    const okC = !activeCat || card.dataset.cat === activeCat;
    card.style.display = (okQ && okC) ? '' : 'none';
    if(okQ && okC) shown++;
  });
  exCount.textContent = shown + ' of ' + EX_DATA.length + ' examples';
}
if(exSearch) exSearch.addEventListener('input', filterExamples);

// ---------- tiny md renderer (bold, tables, lists, headers, code, newlines) ----------
function renderMD(md){
  let h = md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // tables
  h = h.replace(/((?:^\|.+\|$\n?)+)/gm, (block)=>{
    const rows = block.trim().split('\n').filter(r=>r.includes('|'));
    if(rows.length < 2) return block;
    const parseRow = r => r.split('|').slice(1,-1).map(c=>c.trim());
    const head = parseRow(rows[0]);
    let out = '<table><thead><tr>' + head.map(c=>`<th>${c}</th>`).join('') + '</tr></thead><tbody>';
    for(let i=1;i<rows.length;i++){
      if(/^[\s|:-]+$/.test(rows[i])) continue;
      out += '<tr>' + parseRow(rows[i]).map(c=>`<td>${c}</td>`).join('') + '</tr>';
    }
    return out + '</tbody></table>';
  });
  // headers
  h = h.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h3>$1</h3>');
  // bold + italic + code
  h = h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
       .replace(/(^|\s)\*([^*\n]+)\*/g,'$1<em>$2</em>')
       .replace(/`([^`]+)`/g,'<code>$1</code>');
  // list items
  h = h.replace(/^(?:[-•])\s+(.+)$/gm,'<li>$1</li>');
  h = h.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, m=>m.includes('<ul>')?m:'<ul>'+m+'</ul>');
  // paragraphs: double newline
  h = h.split(/\n{2,}/).map(seg=>{
    const s = seg.trim();
    if(!s) return '';
    if(s.startsWith('<table')||s.startsWith('<h3')||s.startsWith('<ul')||s.startsWith('<li')) return s;
    return '<p>'+s.replace(/\n/g,'<br>')+'</p>';
  }).join('');
  return h;
}

// ---------- modal ----------
const modalBg = document.createElement('div');
modalBg.className = 'ex-modal-bg';
modalBg.innerHTML = `
  <div class="ex-modal" role="dialog" aria-modal="true">
    <div class="ex-modal-head">
      <div style="display:flex;gap:.8rem;align-items:flex-start;">
        <span class="ex-num" id="mNum"></span>
        <div class="ex-modal-q" id="mQ"></div>
      </div>
      <button class="ex-modal-close" id="mClose" aria-label="Close">✕</button>
    </div>
    <div class="ex-modal-body" id="mBody"></div>
  </div>`;
document.body.appendChild(modalBg);

function openExample(it){
  document.getElementById('mNum').textContent = String(it.n).padStart(2,'0');
  document.getElementById('mQ').textContent = it.prompt;
  let html = renderMD(it.response);
  if(it.data_note){
    html += `<div class="ex-data-note">◈ ${it.data_note}</div>`;
  }
  const body = document.getElementById('mBody');
  body.innerHTML = html;
  body.scrollTop = 0;
  modalBg.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeExample(){
  modalBg.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('mClose').addEventListener('click', closeExample);
modalBg.addEventListener('click', e=>{ if(e.target===modalBg) closeExample(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeExample(); });

// init grid
EX_DATA.forEach(it=>exGrid.appendChild(exCard(it)));
filterExamples();

// ---------- @BNB_Wizard physics playground ----------
(function(){
  const cv = document.getElementById('wizCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const section = cv.parentElement;
  let W,H,DPR;
  function resize(){
    DPR = Math.min(window.devicePixelRatio||1, 2);
    W = section.clientWidth; H = section.clientHeight;
    cv.width = W*DPR; cv.height = H*DPR;
    cv.style.width = W+'px'; cv.style.height = H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  const AMBER='#f3ba2f', TEAL='#3fd6bf', ROSE='#ef6472', VIOLET='#a08cf0';
  const COLORS=[AMBER,TEAL,ROSE,VIOLET,'#fff'];
  const G=1400; // gravity px/s^2

  // balls
  const KEYWORDS=['BNB','SOL','BTC','ETH','OI','CVD','R:R','APY','LONG','SHORT','TUT','4H','1D'];
  let balls=[];
  function spawn(x,y,power){
    const r = 7+Math.random()*16;
    balls.push({
      x,y,
      vx:(Math.random()-.5)*power,
      vy:-Math.random()*power*.9-120,
      r, color:COLORS[(Math.random()*COLORS.length)|0],
      life:1, word: Math.random()<.22 ? KEYWORDS[(Math.random()*KEYWORDS.length)|0] : null,
      rot:(Math.random()-.5)*4,
    });
    if(balls.length>240) balls.splice(0, balls.length-240);
  }
  // ambient spawner
  let lastAmbient=0;
  function ambient(t){
    if(t-lastAmbient > 420){
      lastAmbient=t;
      spawn(W*(0.15+Math.random()*0.7), -20, 260);
    }
  }

  // pointer
  const ptr={x:W/2,y:H/2,down:false};
  section.addEventListener('pointermove',e=>{
    const r=cv.getBoundingClientRect();
    ptr.x=e.clientX-r.left; ptr.y=e.clientY-r.top;
  });
  section.addEventListener('pointerdown',e=>{
    const r=cv.getBoundingClientRect();
    ptr.x=e.clientX-r.left; ptr.y=e.clientY-r.top; ptr.down=true;
    for(let i=0;i<26;i++) spawn(ptr.x,ptr.y,520);
  });
  section.addEventListener('pointerup',()=>ptr.down=false);
  section.addEventListener('pointerleave',()=>{ptr.down=false;});

  // floating orbs (DOM)
  const orbData=[
    ['52 skills','18%','12%','10s'],
    ['9 launchers','70%','20%','12s'],
    ['Agent OS','80%','62%','9s'],
    ['Web3 live','12%','55%','11s'],
    ['MIT','45%','78%','10s'],
  ];
  orbData.forEach(([txt,l,t,dur])=>{
    const o=document.createElement('div');
    o.className='orb';
    o.textContent=txt;
    o.style.left=l; o.style.top=t;
    o.style.width=(74+Math.random()*30)+'px';
    o.style.height=o.style.width;
    o.style.setProperty('--dur',dur);
    o.style.background='rgba(21,23,28,.55)';
    section.appendChild(o);
  });

  // physics loop
  let prev=performance.now();
  function tick(now){
    const dt=Math.min((now-prev)/1000,.033); prev=now;
    ambient(now);
    ctx.clearRect(0,0,W,H);

    for(const b of balls){
      // gravity + pointer repulsion
      b.vy+=G*dt;
      if(ptr.down){
        const dx=b.x-ptr.x, dy=b.y-ptr.y, d2=dx*dx+dy*dy;
        if(d2<26000){ const f=90000/(d2+900); const d=Math.sqrt(d2)||1; b.vx+=(dx/d)*f*dt*60; b.vy+=(dy/d)*f*dt*60; }
      }
      b.x+=b.vx*dt; b.y+=b.vy*dt; b.life-=dt*.14;

      // floor bounce
      if(b.y+b.r>H){ b.y=H-b.r; b.vy*=-.42; b.vx*=.86; if(Math.abs(b.vy)<24) b.life-=dt*1.6; }
      // walls
      if(b.x-b.r<0){b.x=b.r;b.vx*=-.6;} if(b.x+b.r>W){b.x=W-b.r;b.vx*=-.6;}
      // ceiling
      if(b.y-b.r<0 && b.vy<0){ b.vy*=-.35; }

      // draw
      ctx.globalAlpha=Math.max(b.life,0);
      ctx.fillStyle=b.color;
      ctx.beginPath(); ctx.arc(b.x,b.y,b.r*Math.max(b.life,.25),0,6.283); ctx.fill();
      if(b.word && b.life>.25){
        ctx.globalAlpha=Math.max(Math.min(b.life,1),0)*.95;
        ctx.fillStyle='#0a0b0d';
        ctx.font='600 '+Math.max(9,b.r*.75)+'px "JetBrains Mono",monospace';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(b.word,b.x,b.y+.5);
      }
    }
    ctx.globalAlpha=1;
    balls=balls.filter(b=>b.life>0);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // magnetic button
  const btn=document.querySelector('.wiz-btn');
  if(btn){
    section.addEventListener('pointermove',e=>{
      const r=btn.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      const dx=e.clientX-cx, dy=e.clientY-cy;
      const dist=Math.hypot(dx,dy);
      if(dist<180){ btn.style.transform=`translate(${dx*.14}px,${dy*.14}px) scale(1.04)`; }
      else{ btn.style.transform=''; }
    });
    section.addEventListener('pointerleave',()=>{ btn.style.transform=''; });
  }
})();
