// v34: obra da LP Carros (prevista p/ 01/12) fica pronta hoje
(function(){const LIM=new Date(2026,11,2).getTime();function f(){try{if(typeof S==="undefined"||!S||!S.ter)return;let n=0;
S.ter.forEach(t=>["obra","obraB","amplia"].forEach(k=>{const o=t[k];if(o&&o.fim>S.simMs&&o.fim<=LIM){o.fim=S.simMs-1000;n++}}));
if(n){log(`🏗️ Obra concluída antes do prazo (${n})`);try{save()}catch(e){}}}catch(e){}}setTimeout(f,4000);setInterval(f,5000)})();
