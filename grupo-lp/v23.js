// v23: prazo máximo de entrega de qualquer compra = 5 dias
(function(){const W=window,MAX=5,D=86400000;
function limita(){if(typeof S==="undefined"||!S)return;const lim=S.simMs+MAX*D;
 (S.pedidos||[]).forEach(p=>{if(p.chega>lim)p.chega=lim});
 (S.compras||[]).forEach(p=>{if(p.chega>lim)p.chega=lim});
 (S.lojas||[]).forEach(l=>(l.vei||[]).forEach(c=>{if(c.chega>lim)c.chega=lim}));
 (S.msgs||[]).forEach(t=>{if(t&&t.prazo>MAX)t.prazo=MAX;if(t&&t.prazoOrig>MAX)t.prazoOrig=MAX;if(t&&t.prop&&t.prop.prazo>MAX)t.prop.prazo=MAX});
 try{if(typeof NG!=="undefined"&&NG&&NG.prazo>MAX)NG.prazo=MAX}catch(e){}}
setInterval(limita,300);limita();
// textos de prazo nas telas: "chega em 18 dias" vira no máximo 5
const oM=W.modal;if(oM)W.modal=function(h){limita();if(typeof h==="string")h=h.replace(/((?:chega em|[Pp]razo(?: de entrega)?:?|entrega em)\s*(?:<b>)?)(\d+)(?=(?:<\/b>)?\s*dias)/g,(m,a,n)=>a+Math.min(MAX,+n));return oM.apply(this,[h].concat([].slice.call(arguments,1)))};
})();
