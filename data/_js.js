
// ===== shared utils =====
const OB = window.OB_TEXT;
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·";
function scopeEl(scope, sel){ return scope ? scope.querySelector(sel) : document.querySelector(sel); }
const running = {};
function loop(id, fn){ stopLoop(id); running[id] = true; (function f(t){ if(!running[id]) return; fn(t); requestAnimationFrame(f); })(0); }
function stopLoop(id){ running[id] = false; }

// 3 typewriter
function v3(scope){
  const el = scopeEl(scope,'#j3'); if(!el) return; let i=0;
  const t = setInterval(()=>{ el.textContent = OB.slice(0,++i) + "▌"; if(i>=OB.length){clearInterval(t); setTimeout(()=>el.textContent=OB,600);} }, 90);
}
// 5 matrix decode
function v5(scope){
  const el = scopeEl(scope,'#j5'); if(!el) return;
  let frame = 0; const total = 42;
  const id = "v5"; loop(id, ()=>{
    frame++;
    const reveal = Math.floor((frame/total)*OB.length);
    el.textContent = OB.split("").map((c,i)=> c===" "?" ": (i<reveal? c : CHARS[(Math.random()*CHARS.length)|0])).join("");
    if(frame>=total){ el.textContent = OB; stopLoop(id); }
  });
}
// 11 letter scatter
function v11(scope){
  const els = scope.querySelectorAll('.txt b');
  els.forEach(el=>{
    el.style.transition='none';
    el.style.opacity='0';
    el.style.transform=`translate(${(Math.random()-.5)*260}px,${(Math.random()-.5)*120}px) rotate(${(Math.random()-.5)*160}deg)`;
    requestAnimationFrame(()=>{ el.style.transition='all .9s cubic-bezier(.16,.8,.24,1)'; el.style.opacity='1'; el.style.transform='none'; });
  });
}
// 21 handwriting svg draw
function v21(scope){
  const p = scope.querySelector('#p21'); if(!p) return;
  const len = p.getTotalLength();
  p.style.transition='none'; p.style.strokeDasharray=len; p.style.strokeDashoffset=len;
  void p.getBoundingClientRect();
  p.style.transition='stroke-dashoffset 2.4s ease';
  p.style.strokeDashoffset='0';
}
// 29 type delete loop
function v29(scope){
  const el = scopeEl(scope,'#j29'); if(!el || el.dataset.on) return; el.dataset.on='1';
  let dir=1,i=0;
  setInterval(()=>{
    i+=dir;
    if(i>OB.length+6){dir=-1;i=OB.length;}
    if(i<0){dir=1;i=0;}
    el.textContent = OB.slice(0,Math.min(i,OB.length)) + "▌";
  },95);
}
// 34 magnetic hover per letter
function v34(scope){
  const box = scopeEl(scope,'.stage')||scope; const els=[...scope.querySelectorAll('.txt b')];
  box.addEventListener('pointermove',e=>{
    const r=box.getBoundingClientRect();
    els.forEach(el=>{
      const er=el.getBoundingClientRect();
      const dx=(er.left+er.width/2)-(e.clientX-r.left), dy=(er.top+er.height/2)-(e.clientY-r.top);
      const d=Math.hypot(dx,dy);
      if(d<70){ el.style.transform=`translate(${dx/d*(70-d)*.5}px,${dy/d*(70-d)*.5}px)`; }
      else el.style.transform='';
    });
  });
  box.addEventListener('pointerleave',()=>els.forEach(el=>el.style.transform=''));
}
// 35 spring physics per letter
function v35(scope){
  const els=[...scope.querySelectorAll('.txt b')];
  els.forEach((el,idx)=>{
    let x=-260-Math.random()*140, v=0, target=0;
    el.style.opacity='1'; el.style.willChange='transform';
    const k=0.012+idx*0.0004, damp=0.86;
    function step(){
      const f=(target-x)*k*60; v=(v+f)*damp; x+=v*16/60*8;
      if(Math.abs(v)<.05 && Math.abs(x)<.05){ el.style.transform='none'; return; }
      el.style.transform=`translateX(${x}px)`;
      requestAnimationFrame(step);
    } setTimeout(step, idx*40);
  });
}
// 42 random jitter forever
function v42(scope){
  const els=[...scope.querySelectorAll('.txt b')];
  els.forEach(el=>el.style.display='inline-block');
  loop('v42',(t)=>{
    els.forEach((el,i)=>{
      el.style.transform=`translate(${Math.sin(t/90+i*7)*2.2}px,${Math.cos(t/110+i*13)*2.2}px)`;
    });
  });
}
// 44 circuit trace then text
function v44(scope){
  const tr = scope.querySelector('#trace44') || scopeEl(scope,'#trace44');
  const tx = scopeEl(scope,'#j44t');
  if(tr){ tr.style.animation='none'; void tr.getBoundingClientRect(); tr.style.animation='tr44 1.6s ease forwards'; }
  if(tx){ tx.style.transition='opacity .5s ease 1.3s'; tx.style.opacity='1'; }
}
// 51 emoji rain into slots
function v51(scope){
  const el=scopeEl(scope,'#j51'); if(!el) return;
  const EMO=['🟡','⚡','🔥','💎','🚀','✨'];
  let frame=0,total=46;
  loop('v51',()=>{
    frame++;
    el.textContent = OB.split('').map((c,i)=> c===' '?' ': (i < (frame/total)*OB.length ? c : EMO[(Math.random()*EMO.length)|0])).join('');
    if(frame>=total){ el.textContent=OB; stopLoop('v51'); }
  });
}
// 58 ripple click: wave travels through letters on click
function v58(scope){
  const els=[...scope.querySelectorAll('.txt b')];
  els.forEach(el=>el.style.display='inline-block');
  scope.addEventListener('click',()=>{
    els.forEach((el,i)=>{ setTimeout(()=>{ el.style.transition='transform .28s cubic-bezier(.2,.9,.3,1)'; el.style.transform='translateY(-14px) scale(1.25)'; setTimeout(()=>el.style.transform='',300); }, i*38); });
  });
  // auto-fire once
  setTimeout(()=>scope.click(),700);
}
// 61 scramble font weight
function v61(scope){
  const els=[...scope.querySelectorAll('.txt b')];
  els.forEach(el=>el.style.opacity='1');
  let frame=0,total=50;
  loop('v61',()=>{
    frame++; const settle=Math.floor((frame/total)*els.length);
    els.forEach((el,i)=>{
      el.style.opacity='1';
      el.style.fontWeight = i<settle ? 700 : (300+Math.floor(Math.random()*600));
    });
    if(frame>=total){ els.forEach(el=>el.style.fontWeight=700); stopLoop('v61'); }
  });
}
// 66 path follow letters along bezier
function v66(scope){
  const svg = scope.querySelector('svg'); if(!svg) return;
  const path = svg.querySelector('#curve66'); const tp = svg.querySelector('#tp66');
  const len = path.getTotalLength();
  tp.textContent='';
  [...OB].forEach((ch,i)=>{
    const tspan=document.createElementNS('http://www.w3.org/2000/svg','tspan');
    tspan.textContent=ch; tp.appendChild(tspan);
  });
  const spans=[...tp.children];
  spans.forEach((sp,i)=>{
    const pt = path.getPointAtLength((i/(OB.length-1))*len);
    sp.setAttribute('x',pt.x); sp.setAttribute('y',pt.y);
    sp.style.opacity='0'; sp.style.transition=`opacity .3s ${i*80}ms`;
    setTimeout(()=>sp.style.opacity='1', i*80);
  });
}
// 70 count-up numbers merge into letters
function v70(scope){
  const el=scopeEl(scope,'#j70'); if(!el) return;
  let frame=0,total=52;
  loop('v70',()=>{
    frame++; const p=frame/total;
    el.textContent = OB.split('').map((c,i)=>{
      if(c===' ')return' ';
      if(p*OB.length>i) return c;
      return String((Number(frame*7+i*13))%10);
    }).join('');
    if(frame>=total){ el.textContent=OB; stopLoop('v70'); }
  });
}
// 74 gravity stack drop with bounce per letter
function v74(scope){
  const els=[...scope.querySelectorAll('.txt b')];
  els.forEach((el,idx)=>{
    let y=-180-idx*22, v=0; el.style.opacity='1'; el.style.willChange='transform';
    const g=.09;
    function step(){
      v+=g*16; y+=v;
      if(y>0){ y=0; v*=-.45; if(Math.abs(v)<1.2){ el.style.transform='translateY(0)'; return; } }
      el.style.transform=`translateY(${y}px)`;
      requestAnimationFrame(step);
    } setTimeout(step, idx*55);
  });
}
// 78 shatter: text draws to canvas then breaks into shards falling
function v78(scope){
  const cv=scope.querySelector('#c78'); if(!cv) return; const ctx=cv.getContext('2d');
  // draw text to offscreen
  const off=document.createElement('canvas'); off.width=cv.width; off.height=cv.height;
  const octx=off.getContext('2d');
  octx.font="700 64px 'Space Grotesk',sans-serif"; octx.fillStyle='#f2f0e8'; octx.textAlign='center'; octx.textBaseline='middle';
  octx.fillText(OB, cv.width/2, cv.height/2);
  const shards=[]; const S=26;
  for(let y=0;y<cv.height;y+=S) for(let x=0;x<cv.width;x+=S)
    shards.push({x,y,vx:(Math.random()-.5)*2,vy:-Math.random()*3-1,rot:(Math.random()-.5)*.15,vr:(Math.random()-.5)*.12});
  let t0=null;
  loop('v78',(t)=>{
    if(!t0)t0=t; const el=(t-t0)/1000;
    ctx.clearRect(0,0,cv.width,cv.height);
    for(const s of shards){
      const delay=s.x/cv.width*900;
      const e=Math.max(0,(t-t0-delay));
      if(e<400){ ctx.drawImage(off,s.x,s.y,S,S,s.x,s.y,S,S); continue; }
      s.vy+=.16; s.x+=s.vx; s.y+=s.vy;
      ctx.save(); ctx.translate(s.x+S/2,s.y+S/2); ctx.rotate(s.rot+=s.vr*.02);
      ctx.drawImage(off, s.x, s.y, S, S, -S/2, -S/2, S, S); ctx.restore();
    }
    if(el>4200){ stopLoop('v78'); }
  });
}
// 80 tv static resolves
function v80(scope){
  const cv=scope.querySelector('#c80'); if(!cv) return; const ctx=cv.getContext('2d');
  const off=document.createElement('canvas'); off.width=cv.width; off.height=cv.height;
  const octx=off.getContext('2d');
  octx.font="700 62px 'Space Grotesk',sans-serif"; octx.fillStyle='#f2f0e8'; octx.textAlign='center'; octx.textBaseline='middle';
  octx.fillText(OB, cv.width/2, cv.height/2);
  const img=octx.getImageData(0,0,cv.width,cv.height);
  let start=null;
  loop('v80',(t)=>{
    if(!start)start=t; const p=Math.min((t-start)/2600,1);
    const cur=ctx.createImageData(cv.width,cv.height);
    for(let i=0;i<img.data.length;i+=4){
      if(img.data[i+3]>10 && Math.random()<p){ cur.data[i]=242;cur.data[i+1]=240;cur.data[i+2]=232;cur.data[i+3]=255; }
      else { const g=(Math.random()*200)|0; cur.data[i]=g;cur.data[i+1]=g;cur.data[i+2]=g;cur.data[i+3]=90; }
    }
    ctx.putImageData(cur,0,0);
    if(p>=1){ ctx.drawImage(off,0,0); stopLoop('v80'); }
  });
}
// 85 dither dissolve in reverse (noise -> text via ordered dithering threshold)
function v85(scope){
  const cv=scope.querySelector('#c85'); if(!cv) return; const ctx=cv.getContext('2d');
  const off=document.createElement('canvas'); off.width=cv.width; off.height=cv.height;
  const octx=off.getContext('2d');
  octx.font="700 62px 'Space Grotesk',sans-serif"; octx.fillStyle='#f3ba2f'; octx.textAlign='center'; octx.textBaseline='middle';
  octx.fillText(OB, cv.width/2, cv.height/2);
  const img=octx.getImageData(0,0,cv.width,cv.height);
  const B=[[0,128],[192,64],[48,240],[144,16],[96,208],[240,112],[16,176],[112,32],[208,144],[64,96],[176,224],[128,80],[224,192],[32,248],[80,160],[240,48]];
  let start=null;
  loop('v85',(t)=>{
    if(!start)start=t; const p=Math.min((t-start)/2800,1);
    const cur=ctx.createImageData(cv.width,cv.height);
    const thresh=p*16;
    for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++){
      const idx=(y*cv.width+x)*4; const a=img.data[idx+3];
      if(a>10 && B[y%4][x%4]/17<thresh){ cur.data[idx]=243;cur.data[idx+1]=186;cur.data[idx+2]=47;cur.data[idx+3]=255; }
    }
    ctx.putImageData(cur,0,0);
    if(p>=1){ ctx.putImageData(img,0,0); stopLoop('v85'); }
  });
}
// 88 type with font morph mono->grotesk
function v88(scope){
  const el=scopeEl(scope,'#j88'); if(!el) return;
  let i=0;
  const t=setInterval(()=>{
    i++;
    el.textContent=OB.slice(0,i);
    el.style.fontFamily = i<OB.length*0.55 ? "'JetBrains Mono',monospace" : "'Space Grotesk',sans-serif";
    if(i>=OB.length){ clearInterval(t); }
  },85);
}
// 99 rewind glitch: plays forward fast then rewinds with glitches, loops
function v99(scope){
  const els=[...scope.querySelectorAll('.txt b')];
  els.forEach(el=>{el.style.opacity='0'});
  let phase=0, i=0;
  setInterval(()=>{
    if(phase===0){ i++; els.forEach(e=>e.style.opacity='0'); for(let k=0;k<=i&&k<els.length;k++) els[k].style.opacity='1';
      if(i>=els.length){phase=1;} }
    else { i-=3; if(i<0)i=0;
      els.forEach(e=>e.style.opacity='0');
      for(let k=0;k<i;k++){ els[k].style.opacity='1'; els[k].style.transform = Math.random()<.3?`translateX(${(Math.random()-.5)*10}px)`:''; }
      els.forEach((e,k)=>{ if(k>=i)e.style.transform=''; });
      if(i===0){ phase=0; els.forEach(e=>e.style.transform=''); }
    }
  }, 70);
}
// 100 finale: glitch sweep + color wave + glow pulse combo loop
function v100(scope){
  const els=[...scope.querySelectorAll('.txt b')];
  els.forEach(el=>el.style.opacity='1');
  loop('v100',(t)=>{
    els.forEach((el,i)=>{
      const w=Math.sin(t/300+i*.55);
      el.style.transform=`translateY(${w*-9}px)`;
      el.style.color = Math.sin(t/450+i)>0.92 ? '#ef6472' : '#f3ba2f';
      el.style.textShadow = `0 0 ${10+w*10}px rgba(243,186,47,${.35+w*.4})`;
      if(Math.random()<.008) el.style.transform+=` translateX(${(Math.random()-.5)*14}px)`;
    });
  });
}

// dispatcher
window.runJs = function(n, scope){
  n=String(n);
  const map={ '3':v3,'5':v5,'11':v11,'21':v21,'29':v29,'34':v34,'35':v35,'42':v42,'44':v44,
    '51':v51,'58':v58,'61':v61,'66':v66,'70':v70,'74':v74,'78':v78,'80':v80,'85':v85,'88':v88,'99':v99,'100':v100 };
  if(map[n]){ try{ map[n](scope||document.getElementById(n)); }catch(e){ console.warn(n,e); } }
};
