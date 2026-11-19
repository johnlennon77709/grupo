// v32: libera já o Constellation 24.280 (pedido que chegaria 21/11) em qualquer aparelho
(function(){function f(){try{if(typeof S==="undefined"||!S||!S.pedidos)return;S.pedidos.forEach(p=>{if(/Constellation 24\.280/.test(p.mod)&&p.chega>S.simMs)p.chega=S.simMs-1000})}catch(e){}}f();setInterval(f,3000)})();
