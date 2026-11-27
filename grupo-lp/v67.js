// v67: desfaz venda acidental do Centrão e da Petrolub (uma vez)
(function(){
 function fix(){
  try{
   if(typeof S==="undefined"||!S||!S.lojas)return setTimeout(fix,1500);
   if(S.v67ok)return;
   let n=0;
   Object.values(S.lojas).forEach(l=>{
    if(!l)return;
    const nm=(l.nome||"")+" "+(typeof nomeLoja==="function"?nomeLoja(l):"");
    const alvo=l.emp==="CT"||l.emp==="PT"||/centr[aã]o|petrolub/i.test(nm);
    if(alvo&&(l.encerrada||l.vendida||l.fechada)){
     l.encerrada=false;delete l.vendida;delete l.fechada;delete l.encerradaEm;
     if(l.nome)l.nome=l.nome.replace(/\s*\((vendida|encerrada)\)/i,"");
     n++;
    }
   });
   S.v67ok=1;
   if(n){if(typeof log==="function")log(`🔄 ${n} loja(s) do Centrão/Petrolub reabertas`);if(typeof toast==="function")toast(`${n} loja(s) reabertas`);}
   if(typeof save==="function")save();if(typeof render==="function")render();
  }catch(e){console.log("v67",e)}
 }
 setTimeout(fix,3000);
})();
