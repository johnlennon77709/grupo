// v66: conserta caixa com valor absurdo (bilhões negativos) e trava as causas: pedido com valor maluco e pagamento automático gigante
(function(){const W=window;
function conserta(){if(typeof S==="undefined"||!S||!S.ecx)return;const tot=Object.values(S.ecx).reduce((a,b)=>a+(+b||0),0)+Object.values(S.lcx||{}).reduce((a,b)=>a+(+b||0),0);
 // contas absurdas (acima de R$ 5 mi) em aberto: cancela
 let canc=0;(S.contas||[]).forEach(c=>{if(!c.pago&&c.v>5e6&&!/Financ|Empr/i.test(c.cat+c.desc)){c.pago=true;c.forma="Cancelada (valor inválido)";canc++}});
 // pedidos com quantidade maluca
 const fix=p=>{if(p&&p.itens)p.itens.forEach(it=>{if(it[1]>20000)it[1]=20000});if(p&&p.tot>2e6)p.tot=2e6};
 try{(S.lg&&S.lg.fila||[]).forEach(fix);Object.values(S.lg&&S.lg.cd||{}).forEach(q=>q.forEach(fix));(S.lg&&S.lg.rotas||[]).forEach(r=>(r.carga||[]).forEach(fix));(S.compras||[]).forEach(fix)}catch(e){}
 // estoque maluco
 (S.lojas||[]).forEach(l=>Object.keys(l.est||{}).forEach(k=>{if(l.est[k]>50000)l.est[k]=50000}));
 if(tot<-1e7){Object.keys(S.ecx).forEach(k=>S.ecx[k]=0);Object.keys(S.lcx||{}).forEach(k=>S.lcx[k]=0);try{log(`🛠️ Caixa corrigido: estava ${R$(tot)} por um erro de valores. Zerado (como você pediu).`)}catch(e){}try{toast("Caixa corrigido e zerado")}catch(e){}}
 if(canc)try{log(`🛠️ ${canc} conta(s) com valor inválido foram canceladas`)}catch(e){}
 if(tot<-1e7||canc)try{save();render()}catch(e){}}
// trava no pagamento automático: nunca paga sozinho conta acima de R$ 2 mi
const t=setInterval(()=>{if(typeof pagar!=="function")return;clearInterval(t);const o=W.pagar;W.pagar=function(id){const c=(S.contas||[]).find(x=>x.id===id);if(c&&c.v>2e6&&!/Financ|Empr/i.test(c.cat+c.desc)){try{toast("Conta acima de R$ 2 mi bloqueada (valor suspeito)")}catch(e){}return}return o.apply(this,arguments)}},500);
setTimeout(conserta,6000);setInterval(conserta,30000);
})();
