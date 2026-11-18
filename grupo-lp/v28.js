// v28: total do grupo (faturamento do dia/mês/ano, custo, vendas) sempre bate com a soma real das lojas
(function(){
function ajusta(){if(typeof S==="undefined"||!S||!S.fat||!S.lojas)return;const f=S.fat;
 const soma=S.lojas.reduce((a,l)=>a+((l.venda&&l.venda.dia)||0),0);const ex=(f.dia||0)-soma;if(ex<=1)return;
 const k=f.dia>0?soma/f.dia:1;f.custo=(f.custo||0)*k;f.vendas=Math.round((f.vendas||0)*k);f.trocas=Math.round((f.trocas||0)*k);
 f.dia=soma;f.mes=Math.max(soma,(f.mes||0)-ex);f.ano=Math.max(f.mes,(f.ano||0)-ex)}
ajusta();setInterval(ajusta,1000);
})();
