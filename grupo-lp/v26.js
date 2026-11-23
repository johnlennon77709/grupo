
(function(){var s=document.createElement('script');s.src='v44.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v43.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v42.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v41.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v40.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v39.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v38.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v37.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v36.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v35.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v34.js';document.head.appendChild(s)})();
(function(){var s=document.createElement('script');s.src='v33.js';document.head.appendChild(s)})();// v26: trava de faturamento diário real (R$ 5–22 mil por loja/dia) – vale para qualquer caminho de venda (produtos, troca de óleo, simulação offline)
(function(){const W=window;
const hoje=()=>new Date(S.simMs).toDateString();
function cap(l){if(l.tipo==="transp"||l.encerrada)return null;try{if(segDe(l)==="veic")return null}catch(e){}
 if(l.rawD!==hoje()||!l.alvoHoje){const c=/centr/i.test((EMP[l.emp]||{}).n||"");l.alvoHoje=Math.round((c?9000+Math.random()*13000:5000+Math.random()*13000)*(l.f>1.4?1.15:1));l.rawD=hoje();l.rawDia=0}
 return l.alvoHoje*1.25}
function trava(){if(typeof S==="undefined"||!S||!S.lojas)return;const d=hoje();let tot=0;
 S.lojas.forEach(l=>{if(!l.venda)return;
  if(l.v26d!==d){if(l.v26d)l.venda.dia=0;l.v26d=d}// zera o dia na virada
  const c=cap(l);if(c==null)return;const ex=l.venda.dia-c;if(ex<=1)return;
  l.venda.dia-=ex;l.venda.mes=Math.max(0,(l.venda.mes||0)-ex);
  if(S.lcx&&S.lcx[l.id]!=null)S.lcx[l.id]-=ex;else if(S.ecx&&S.ecx[l.emp]!=null)S.ecx[l.emp]-=ex;
  if(l.caixa>ex)l.caixa-=ex;tot+=ex});
 if(tot>1000)try{console.log("v26: faturamento acima do realista removido",Math.round(tot))}catch(e){}}
trava();setInterval(trava,1000);
})();

// carrega o visual novo (v27)
(function(){var s=document.createElement('script');s.src='v27.js';document.head.appendChild(s)})();

(function(){var s=document.createElement('script');s.src='v28.js';document.head.appendChild(s)})();

(function(){var s=document.createElement('script');s.src='v29.js';document.head.appendChild(s)})();

(function(){var s=document.createElement('script');s.src='v30.js';document.head.appendChild(s)})();

(function(){var s=document.createElement('script');s.src='v31.js';document.head.appendChild(s)})();

(function(){var s=document.createElement('script');s.src='v32.js';document.head.appendChild(s)})();
