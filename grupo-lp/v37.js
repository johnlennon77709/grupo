// v37: tudo que você compra é entregue na hora (veículos, mercadoria, carros do pátio, obras)
(function(){function f(){try{if(typeof S==="undefined"||!S||!S.simMs)return;const n=S.simMs-1000;
(S.pedidos||[]).forEach(p=>{if(p.chega>n)p.chega=n});(S.compras||[]).forEach(p=>{if(p.chega>n)p.chega=n});
(S.lojas||[]).forEach(l=>(l.vei||[]).forEach(c=>{if(c.chega&&c.chega>n)c.chega=0}));
(S.ter||[]).forEach(t=>["obra","obraB","amplia"].forEach(k=>{if(t[k]&&t[k].fim>n)t[k].fim=n}))}catch(e){}}f();setInterval(f,1000)})();
