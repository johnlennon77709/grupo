// v10: andar dentro da loja (WASD/setas no PC, botões de seta no celular)
(function(){
const W=window,P={x:8,y:10.2,dir:1,anda:false},K={};let ultLoja=null;
const ativo=()=>typeof aba!=="undefined"&&aba==="loja"&&typeof visao!=="undefined"&&visao==="dentro";
document.addEventListener("keydown",e=>{if(!ativo())return;if(/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||""))return;const k=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k)){K[k]=1;e.preventDefault()}});
document.addEventListener("keyup",e=>{K[e.key.toLowerCase()]=0});
W.vsBtn=(k,v)=>{K[k]=v};
setInterval(()=>{if(!ativo()){P.anda=false;return}if(ultLoja!==lojaSel){ultLoja=lojaSel;P.x=8;P.y=10.2}
 let dx=0,dy=0;const sp=.09;
 // na visão isométrica: cima = sobe na tela (x-1,y-1), direita = (x+1,y-1)
 if(K.w||K.arrowup||K.up){dx-=sp;dy-=sp}if(K.s||K.arrowdown||K.down){dx+=sp;dy+=sp}if(K.a||K.arrowleft||K.left){dx-=sp;dy+=sp}if(K.d||K.arrowright||K.right){dx+=sp;dy-=sp}
 P.anda=!!(dx||dy);if(dx||dy){const n=Math.hypot(dx,dy)/sp*.7;P.x=Math.max(.4,Math.min(15.6,P.x+dx/n));P.y=Math.max(.4,Math.min(10.7,P.y+dy/n));
  if(typeof VW!=="undefined"&&VW.seguir!==false){const p=iso(P.x,P.y);VW.x+=((450-p[0])*VW.z-VW.x)*.12;VW.y+=((330-p[1])*VW.z-VW.y)*.12}}},16);
const oC=W.cena;W.cena=function(c,vis){const r=oC.apply(this,arguments);if(vis==="dentro"){try{pessoa(c,P.x,P.y,{cor:"#111827",anda:P.anda?1:0,f:0,pele:"#c98f62",cabelo:"#2b1a0e",estilo:"curto",calca:"#1f2937",s:1.08});const p=iso(P.x,P.y,62);c.fillStyle="rgba(0,0,0,.6)";c.fillRect(p[0]-22,p[1]-14,44,16);c.fillStyle="#ffd34d";c.font="800 11px Inter,sans-serif";c.textAlign="center";c.fillText("VOCÊ",p[0],p[1]-2)}catch(e){}}return r};
// setas na tela
const st=document.createElement("style");st.textContent=`#vsPad{position:fixed;right:14px;bottom:86px;z-index:60;display:none;grid-template-columns:52px 52px 52px;grid-template-rows:52px 52px;gap:6px;user-select:none;-webkit-user-select:none;touch-action:none}
#vsPad button{border:none;border-radius:12px;background:rgba(17,24,39,.82);color:#fff;font-size:22px;box-shadow:0 2px 8px rgba(0,0,0,.4)}#vsPad button:active{background:#2563eb}
#vsHint{position:fixed;left:50%;transform:translateX(-50%);bottom:90px;z-index:60;display:none;background:rgba(17,24,39,.85);color:#fff;padding:6px 12px;border-radius:999px;font-size:12px}`;document.head.appendChild(st);
const pad=document.createElement("div");pad.id="vsPad";pad.innerHTML=`<span></span><button data-k="up">▲</button><span></span><button data-k="left">◀</button><button data-k="down">▼</button><button data-k="right">▶</button>`;document.body.appendChild(pad);
const hint=document.createElement("div");hint.id="vsHint";hint.textContent="Use W A S D ou as setas do teclado para andar na loja";document.body.appendChild(hint);
pad.querySelectorAll("button").forEach(b=>{const k=b.dataset.k,on=e=>{e.preventDefault();K[k]=1},off=e=>{e.preventDefault();K[k]=0};b.addEventListener("pointerdown",on);b.addEventListener("pointerup",off);b.addEventListener("pointerleave",off);b.addEventListener("pointercancel",off)});
const toque=matchMedia("(pointer:coarse)").matches||"ontouchstart" in W;let dica=0;
setInterval(()=>{const a=ativo();pad.style.display=a&&toque?"grid":"none";if(a&&!toque&&dica<1){hint.style.display="block";dica=1;setTimeout(()=>hint.style.display="none",5000)}if(!a)hint.style.display="none"},300);
})();
