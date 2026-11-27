// v68: R$1,5 milhão no caixa de cada loja aberta (uma vez)
(function(){
 function f(){
  try{
   if(typeof S==="undefined"||!S||!S.lojas)return setTimeout(f,1500);
   if(!S.v67ok)return setTimeout(f,1500);
   if(S.v68ok)return;
   S.lcx=S.lcx||{};let n=0;
   Object.values(S.lojas).forEach(l=>{if(!l||l.encerrada)return;S.lcx[l.id]=(S.lcx[l.id]||0)+1500000;n++});
   S.v68ok=1;
   if(typeof log==="function")log("💰 R$ 1,5 milhão colocado no caixa de "+n+" lojas");
   if(typeof toast==="function")toast("R$ 1,5 mi em "+n+" lojas");
   if(typeof save==="function")save();if(typeof render==="function")render();
  }catch(e){console.log("v68",e)}
 }
 setTimeout(f,4500);
})();
