// v11: ver a loja em 1ª pessoa (3D próprio em canvas, WASD + mouse / setas na tela)
(function(){
const W=window;let on=false,cv,cx,raf,boxes=[],labels=[],npcs=[],P,L;
const K={};
function cor(h,f){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;r=Math.min(255,r*f|0);g=Math.min(255,g*f|0);b=Math.min(255,b*f|0);return `rgb(${r},${g},${b})`}
function box(x,y,z,w,d,h,c,o){boxes.push({x,y,z,w,d,h,c,solid:!(o&&o.ghost),top:o&&o.top})}
function montar(l){boxes=[];labels=[];npcs=[];const ec=(EMP[l.emp]||{}).c||"#1e3a8a",cons=segDe(l)==="const";
 const Wd=24,D=16,H=4.5;
 // paredes (caixas finas), balcão, gôndolas
 box(-.2,-.2,0,Wd+.4,.2,H,"#d9d4cc");box(-.2,D,0,Wd+.4,.2,H,"#d9d4cc");box(-.2,0,0,.2,D,H,"#cfc8bb");box(Wd,0,0,.2,D,H,"#cfc8bb");
 box(0,-.15,3.1,Wd,.1,.9,ec,{ghost:1});labels.push({x:Wd/2,y:.05,z:3.55,t:(EMP[l.emp]||{}).n||"LOJA",c:"#fff",s:46});
 box(1.5,13,0,5,.9,1.05,"#6b4226");box(1.5,13,1.05,5,.9,.06,"#2b2b2b");box(2.2,13.2,1.11,.5,.4,.35,"#111827");box(4.6,13.2,1.11,.5,.4,.35,"#111827");labels.push({x:4,y:13.5,z:2.1,t:"CAIXA",c:"#ffd34d",s:22});
 const marcas=cons?["#9ca3af","#78716c","#b45309","#e5e7eb","#374151","#a16207"]:["#facc15","#16a34a","#dc2626","#1d4ed8","#f97316","#111827","#0ea5e9","#a21caf"];
 for(let g=0;g<4;g++){const gx=2.5+g*3.8,gy=2,gl=7.6;box(gx,gy,0,.7,gl,.12,"#4b5563");box(gx+.3,gy,0,.1,gl,1.9,"#9ca3af");
  for(let n=0;n<4;n++){const z=.15+n*.45;box(gx,gy,z,.7,gl,.04,"#e5e7eb",{ghost:1});for(let k=0;k<9;k++){const c=marcas[(g*3+n+k)%marcas.length];box(gx+.04,gy+.1+k*.85,z+.04,.25,.7,cons?.3:.32,c,{ghost:1});box(gx+.41,gy+.1+k*.85,z+.04,.25,.7,cons?.3:.32,marcas[(g+n*2+k+1)%marcas.length],{ghost:1})}}
  labels.push({x:gx+.35,y:gy+gl/2,z:2.3,t:cons?["CIMENTO","TINTAS","HIDRÁULICA","FERRAGENS"][g]:["ÓLEOS MOTOR","ÓLEOS DIESEL","FILTROS","ADITIVOS"][g],c:"#fff",s:18})}
 if(l.troca&&!cons){box(18,1.5,0,5,8,.03,"#f5c400",{ghost:1});box(18.5,2.5,0,4,.15,.6,"#6b7280");box(18.5,7,0,4,.15,.6,"#6b7280");labels.push({x:20.5,y:5,z:2.8,t:"TROCA DE ÓLEO",c:"#f5c400",s:22});
  box(19.3,3,.6,2.4,3.2,.9,ec);box(19.3,3,1.5,2.4,1.7,.6,cor(ec,.7))} // carro no box
 else{for(let k=0;k<4;k++)box(19,1.5+k*3,0,3,1.8,cons?1.2:1.4,cons?"#9ca3af":"#1e40af")}
 // funcionários e clientes
 const fs=S.func.filter(f=>f.loja===l.id).slice(0,8),d=new Date(S.simMs),ab=aberto(d,l);
 fs.forEach((f,i)=>{const p=i===0?[2.7,14.1]:i===1?[5.1,14.1]:[4.4+((i*3.8)%15.2),11-(i%2)*0.8];npcs.push({x:p[0],y:p[1],c:ec,nome:f.nome.split(" ")[0],pele:(f.vis&&f.vis.pele)||"#c98f62",fun:1})});
 if(ab){const n=3+((d.getHours()*7)%5);for(let i=0;i<n;i++)npcs.push({x:2+Math.random()*15,y:1+Math.random()*9.5,c:["#64748b","#7c3aed","#0f766e","#b91c1c","#ca8a04"][i%5],pele:["#f1c27d","#8d5524","#c68642","#e0ac69"][i%4],cli:1,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6})}
 L=l}
function colide(x,y){if(x<.3||y<.3||x>23.7||y>15.7)return true;return boxes.some(b=>b.solid&&b.h>.3&&x>b.x-.25&&x<b.x+b.w+.25&&y>b.y-.25&&y<b.y+b.d+.25&&b.z<1.5)}
function proj(px,py,pz){const dx=px-P.x,dy=py-P.y,dz=pz-1.65-(P.bz||0),cy=Math.cos(P.yaw),sy=Math.sin(P.yaw);let x=dx*cy+dy*sy,z=-dx*sy+dy*cy;let y=dz;const cp=Math.cos(P.pitch),sp=Math.sin(P.pitch);const z2=z*cp+y*sp,y2=y*cp-z*sp;return [x,y2,z2]}
function clip(pts){const n=.12,out=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];const ai=a[2]>=n,bi=b[2]>=n;if(ai)out.push(a);if(ai!==bi){const t=(n-a[2])/(b[2]-a[2]);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,n])}}return out}
function render(){const Wc=cv.width,Hc=cv.height,f=Hc*.9,ox=Wc/2,oy=Hc/2;
 const d=new Date(S.simMs),h=d.getHours(),noite=h<6||h>=18,luz=aberto(d,L)||!noite?1:.45;
 const g=cx.createLinearGradient(0,0,0,Hc);g.addColorStop(0,noite?"#1e2433":"#f3f4f6");g.addColorStop(.5,noite?"#2a3140":"#e5e7eb");g.addColorStop(.5,"#cfccc6");g.addColorStop(1,"#efede9");cx.fillStyle=g;cx.fillRect(0,0,Wc,Hc);
 const faces=[];const add=(vs,c,sh)=>{let pts=clip(vs.map(v=>proj(v[0],v[1],v[2])));if(pts.length<3)return;const dep=pts.reduce((a,p)=>a+p[2],0)/pts.length;faces.push({p:pts.map(p=>[ox+p[0]/p[2]*f,oy-p[1]/p[2]*f]),dep,c:cor(c,sh*luz)})};
 // piso em placas e teto
 for(let i=0;i<24;i+=2)for(let j=0;j<16;j+=2)add([[i,j,0],[i+2,j,0],[i+2,j+2,0],[i,j+2,0]],((i+j)/2)%2?"#e9e6e1":"#dedad3",1);
 for(let i=0;i<24;i+=4)for(let j=0;j<16;j+=4)add([[i,j,4.5],[i+4,j,4.5],[i+4,j+4,4.5],[i,j+4,4.5]],"#f8fafc",.95);
 boxes.forEach(b=>{const x0=b.x,x1=b.x+b.w,y0=b.y,y1=b.y+b.d,z0=b.z,z1=b.z+b.h;
  if(P.z0!==undefined){}
  add([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],b.c,1.05);
  if(P.y<y0)add([[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],b.c,.85);if(P.y>y1)add([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],b.c,.8);
  if(P.x<x0)add([[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]],b.c,.7);if(P.x>x1)add([[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],b.c,.75)});
 npcs.forEach(n=>{const s=.22;[[n.x-s,n.y-s,0,s*2,s*2,.85,"#1f2937"],[n.x-s,n.y-s,.85,s*2,s*2,.65,n.c],[n.x-.13,n.y-.13,1.5,.26,.26,.28,n.pele]].forEach(q=>{const[x0,y0,z0,w,dd,hh,c]=q,x1=x0+w,y1=y0+dd,z1=z0+hh;add([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],c,1);add([[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],c,.85);add([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],c,.8);add([[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]],c,.7);add([[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],c,.75)})});
 faces.sort((a,b)=>b.dep-a.dep).forEach(fc=>{cx.fillStyle=fc.c;cx.beginPath();fc.p.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.closePath();cx.fill();cx.strokeStyle="rgba(0,0,0,.08)";cx.stroke()});
 labels.concat(npcs.filter(n=>n.fun).map(n=>({x:n.x,y:n.y,z:2.05,t:n.nome,c:"#ffd34d",s:16}))).forEach(lb=>{const p=proj(lb.x,lb.y,lb.z);if(p[2]<.3||p[2]>18)return;const sx=ox+p[0]/p[2]*f,sy=oy-p[1]/p[2]*f,fs=Math.max(9,Math.min(48,lb.s*3/p[2]));cx.font=`900 ${fs}px Inter,sans-serif`;cx.textAlign="center";cx.fillStyle="rgba(0,0,0,.45)";const w=cx.measureText(lb.t).width;cx.fillRect(sx-w/2-6,sy-fs,w+12,fs*1.3);cx.fillStyle=lb.c;cx.fillText(lb.t,sx,sy)});
 // mira e HUD
 cx.strokeStyle="rgba(255,255,255,.8)";cx.lineWidth=2;cx.beginPath();cx.moveTo(ox-8,oy);cx.lineTo(ox+8,oy);cx.moveTo(ox,oy-8);cx.lineTo(ox,oy+8);cx.stroke();cx.lineWidth=1;
 cx.fillStyle="rgba(15,23,42,.75)";cx.fillRect(10,10,330,46);cx.fillStyle="#fff";cx.font="800 15px Inter,sans-serif";cx.textAlign="left";cx.fillText("📍 "+nomeLoja(L),20,30);cx.font="600 12px Inter";cx.fillStyle="#cbd5e1";cx.fillText(`${aberto(d,L)?"🟢 Aberta":"🔴 Fechada"} · ${d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} · vendas hoje ${K$(L.venda.dia)}`,20,48)}
let tAnt=0,vel={x:0,y:0},bob=0,J=null,LK=null,perto=null,msg="",msgT=0;
function passo(t){if(!on)return;const dt=Math.min(.05,tAnt?(t-tAnt)/1000:.016);tAnt=t;
 let fw=0,st=0;if(K.w||K.arrowup||K.up)fw+=1;if(K.s||K.arrowdown||K.down)fw-=1;if(K.a||K.left)st-=1;if(K.d||K.right)st+=1;
 if(J){fw-=J.dy;st+=J.dx}
 const rt=2.2*dt;if(K.arrowleft||K.tl||K.q)P.yaw-=rt;if(K.arrowright||K.tr||K.e2)P.yaw+=rt;
 const m=Math.hypot(fw,st);if(m>1){fw/=m;st/=m}
 const sp=(K.shift||K.run?5.2:3.0);const fx=Math.sin(P.yaw),fy=Math.cos(P.yaw),rx=Math.cos(P.yaw),ry=-Math.sin(P.yaw);
 const tx=(fx*fw+rx*st)*sp,ty=(fy*fw+ry*st)*sp,a=Math.min(1,dt*10);vel.x+=(tx-vel.x)*a;vel.y+=(ty-vel.y)*a;
 const nx=P.x+vel.x*dt,ny=P.y+vel.y*dt;if(!colide(nx,P.y))P.x=nx;else vel.x=0;if(!colide(P.x,ny))P.y=ny;else vel.y=0;
 const v=Math.hypot(vel.x,vel.y);bob+=v*dt*2.4;P.bz=Math.sin(bob*Math.PI)*.035*Math.min(1,v/3);
 npcs.forEach(n=>{if(!n.cli)return;if(Math.random()<.004){n.vx=(Math.random()-.5)*1.2;n.vy=(Math.random()-.5)*1.2}const ax=n.x+n.vx*dt,ay=n.y+n.vy*dt;if(colide(ax,n.y)||ax<1||ax>22.5)n.vx*=-1;else n.x=ax;if(colide(n.x,ay)||ay<.8||ay>14.5)n.vy*=-1;else n.y=ay});
 perto=null;let md=2.2;npcs.forEach(n=>{const dd=Math.hypot(n.x-P.x,n.y-P.y);if(dd<md){md=dd;perto=n}});
 render();
 if(perto){const tx2=perto.fun?`Falar com ${perto.nome}`:"Atender cliente";cx.font="800 "+(cv.height/36|0)+"px Inter,sans-serif";cx.textAlign="center";const w=cx.measureText("[E] "+tx2).width+30;cx.fillStyle="rgba(37,99,235,.9)";cx.fillRect(cv.width/2-w/2,cv.height*.62,w,cv.height/22);cx.fillStyle="#fff";cx.fillText(("ontouchstart" in W?"👆 ":"[E] ")+tx2,cv.width/2,cv.height*.62+cv.height/30)}
 if(msg&&t<msgT){cx.font="700 "+(cv.height/40|0)+"px Inter,sans-serif";cx.textAlign="center";const w=cx.measureText(msg).width+36;cx.fillStyle="rgba(15,23,42,.88)";cx.fillRect(cv.width/2-w/2,cv.height*.72,w,cv.height/18);cx.fillStyle="#fde68a";cx.fillText(msg,cv.width/2,cv.height*.72+cv.height/28)}
 raf=requestAnimationFrame(passo)}
function interagir(){if(!perto)return;const fr=perto.fun?["Bom dia, chefe! Tudo em ordem por aqui.","Movimento bom hoje, chefe!","Estoque conferido, chefe.","Precisando de algo, é só chamar!"]:["Só olhando, obrigado!","Tem óleo 5W30?","Quanto custa a troca de óleo?","Ótimo atendimento aqui!"];msg=(perto.fun?perto.nome+": ":"Cliente: ")+fr[Math.random()*fr.length|0];msgT=performance.now()+3500}
W.entrar1P=function(){const l=S.lojas[lojaSel];if(!l)return;montar(l);P={x:11,y:15.2,yaw:Math.PI,pitch:0};on=true;
 let ov=document.getElementById("fp1");if(!ov){ov=document.createElement("div");ov.id="fp1";ov.innerHTML=`<canvas id="fpcv"></canvas><button id="fpSai">✕ Sair</button><div id="fpJoy"><div id="fpStk"></div></div><button id="fpRun">🏃</button><button id="fpAct">✋</button><div id="fpDica">Clique para travar o mouse · WASD andar · Shift correr · E interagir · Esc sair</div>`;document.body.appendChild(ov);
  const st=document.createElement("style");st.textContent=`#fp1{position:fixed;inset:0;z-index:200;background:#000;touch-action:none}#fpcv{width:100%;height:100%;display:block}#fpSai{position:absolute;top:12px;right:12px;padding:10px 14px;border:none;border-radius:10px;background:#ef4444;color:#fff;font-weight:800}#fpJoy{position:absolute;left:24px;bottom:28px;width:130px;height:130px;border-radius:50%;background:rgba(17,24,39,.35);border:2px solid rgba(255,255,255,.35);touch-action:none}#fpStk{position:absolute;left:40px;top:40px;width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.75)}#fpRun,#fpAct{position:absolute;right:24px;width:64px;height:64px;border-radius:50%;border:none;background:rgba(17,24,39,.7);color:#fff;font-size:26px}#fpRun{bottom:110px}#fpAct{bottom:30px}#fpRun.on{background:#2563eb}#fpDica{position:absolute;left:50%;transform:translateX(-50%);bottom:14px;background:rgba(0,0,0,.6);color:#fff;padding:6px 12px;border-radius:999px;font-size:12px}@media(pointer:fine){#fpJoy,#fpRun,#fpAct{display:none}}@media(pointer:coarse){#fpDica{display:none}}`;document.head.appendChild(st);
  ov.querySelector("#fpSai").onclick=()=>sair();const joy=ov.querySelector("#fpJoy"),stk=ov.querySelector("#fpStk");let jid=null;const jm=e=>{const r=joy.getBoundingClientRect();let dx=(e.clientX-r.left-65)/50,dy=(e.clientY-r.top-65)/50;const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}J={dx,dy};stk.style.left=40+dx*40+"px";stk.style.top=40+dy*40+"px"};
  joy.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();jid=e.pointerId;joy.setPointerCapture(jid);jm(e)});joy.addEventListener("pointermove",e=>{if(e.pointerId===jid)jm(e)});const jz=()=>{jid=null;J=null;stk.style.left="40px";stk.style.top="40px"};joy.addEventListener("pointerup",jz);joy.addEventListener("pointercancel",jz);
  const rb=ov.querySelector("#fpRun");rb.onpointerdown=e=>{e.stopPropagation();K.run=!K.run;rb.classList.toggle("on",!!K.run)};ov.querySelector("#fpAct").onpointerdown=e=>{e.stopPropagation();interagir()};
  const c2=ov.querySelector("#fpcv");let drag=null;
  c2.addEventListener("click",()=>{if(matchMedia("(pointer:fine)").matches&&c2.requestPointerLock)c2.requestPointerLock()});
  document.addEventListener("mousemove",e=>{if(on&&document.pointerLockElement===c2){P.yaw+=e.movementX*.0025;P.pitch=Math.max(-1.1,Math.min(1.1,P.pitch-e.movementY*.0022))}});
  c2.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse")return;drag=[e.clientX,e.clientY,e.pointerId];c2.setPointerCapture(e.pointerId)});c2.addEventListener("pointermove",e=>{if(!drag||drag[2]!==e.pointerId)return;P.yaw+=(e.clientX-drag[0])*.007;P.pitch=Math.max(-1.1,Math.min(1.1,P.pitch-(e.clientY-drag[1])*.005));drag=[e.clientX,e.clientY,e.pointerId]});c2.addEventListener("pointerup",()=>drag=null);c2.addEventListener("pointercancel",()=>drag=null)}
 ov.style.display="block";cv=document.getElementById("fpcv");const ajusta=()=>{const r=Math.min(1.25,devicePixelRatio||1);cv.width=innerWidth*r;cv.height=innerHeight*r};ajusta();addEventListener("resize",ajusta);cx=cv.getContext("2d");cancelAnimationFrame(raf);tAnt=0;vel={x:0,y:0};raf=requestAnimationFrame(passo)};
function sair(){on=false;J=null;if(document.pointerLockElement)document.exitPointerLock();cancelAnimationFrame(raf);const ov=document.getElementById("fp1");if(ov)ov.style.display="none";Object.keys(K).forEach(k=>K[k]=0)}
document.addEventListener("keydown",e=>{if(!on)return;const k=e.key.toLowerCase();if(k==="escape"){if(document.pointerLockElement)document.exitPointerLock();return sair()}if(k==="e")interagir();K[k]=1;e.preventDefault();e.stopPropagation()},true);
document.addEventListener("keyup",e=>{K[e.key.toLowerCase()]=0},true);
// botão na tela da loja
const oL=V.loja;V.loja=function(){const h=oL.apply(this,arguments);return `<div class="card" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><button class="b" style="font-size:16px;padding:12px 18px" onclick="entrar1P()">👁️ Entrar na loja em 1ª pessoa</button><span class="muted">Ande pela loja como se estivesse lá: WASD no PC, setas na tela no celular.</span></div>`+h};
})();
