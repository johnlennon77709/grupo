// v30: comprar/pagar sem saldo – a conta fica negativa sem bloqueio. Passou do limite do banco = "limite estourado": juros mais altos e score caindo
(function(){const W=window,BIG=1e12,REAL=W.LIMNEG||function(){return 0};let tela=false;
W.LIMREAL=function(){try{return REAL()}catch(e){return 0}};
W.LIMNEG=function(){return tela?W.LIMREAL():BIG};
function embrulhaV(){if(typeof V==="undefined")return;Object.keys(V).forEach(k=>{const f=V[k];if(typeof f!=="function"||f.__v30)return;const g=function(){tela=true;try{return f.apply(this,arguments)}finally{tela=false}};g.__v30=1;V[k]=g})}
embrulhaV();setInterval(embrulhaV,1500);
// mensagens de "insuficiente" que ainda escaparem: não bloqueiam mais (só avisa)
const oT=W.toast;if(oT)W.toast=function(m){if(/insuficiente|Sem dinheiro|não tem caixa|não tem esse valor/i.test(String(m)))return;return oT.apply(this,arguments)};
// limite estourado: juros extras de 0,5% ao dia sobre o que passar do limite + score cai
let dia=null;setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.simMs)return;const d=new Date(S.simMs).toDateString();if(d===dia)return;const pri=dia===null;dia=d;if(pri)return;
 const L=W.LIMREAL();let tot=0,n=0;const cobra=(o,k)=>{const v=o[k];if(v<-L){const j=(-L-v)*.005;o[k]-=j;tot+=j;n++}};
 cobra(S,"caixaGrupo");Object.keys(S.ecx||{}).forEach(k=>cobra(S.ecx,k));Object.keys(S.lcx||{}).forEach(k=>cobra(S.lcx,k));
 if(tot>0){if(S.fat)S.fat.desp=(S.fat.desp||0)+tot;log(`🚨 Limite estourado em ${n} conta(s): juros extras ${R$(tot)} (15% a.m.). Coloque dinheiro nas contas!`);
  for(const k of Object.keys(S))if(S[k]&&typeof S[k]==="object"&&"score" in S[k]&&"lim" in S[k]){S[k].score=Math.max(0,S[k].score-4);break}}}catch(e){}},2000);
})();
