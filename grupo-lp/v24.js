// v24: ao comprar, o vendedor confere o estoque dele: se tem, entrega na hora; se não tem, vem com prazo (até 5 dias)
(function(){const W=window,D=86400000;
function confere(){if(typeof S==="undefined"||!S)return;const agora=S.simMs;
 // veículos/implementos comprados em concessionárias
 (S.pedidos||[]).forEach(p=>{if(p.v24)return;p.v24=1;if(Math.random()<.55){p.chega=agora;log(`✅ ${p.marca||""} ${p.mod||""}: a concessionária tinha no estoque – entrega imediata`)}else{p.chega=Math.min(p.chega||agora+5*D,agora+(1+Math.floor(Math.random()*5))*D);log(`⏳ ${p.marca||""} ${p.mod||""}: sem estoque na concessionária – vem da fábrica em até ${Math.ceil((p.chega-agora)/D)} dia(s)`)}});
 // mercadoria de fornecedores: o que tem no CD do fornecedor chega na hora, o resto vem depois
 const novos=[];(S.compras||[]).forEach(p=>{if(p.v24)return;p.v24=1;const tem=[],falta=[];p.itens.forEach(it=>(Math.random()<.85?tem:falta).push(it));
  if(!falta.length){p.chega=agora;log(`✅ ${p.forn} tinha tudo no estoque – pedido para ${nomeLoja(S.lojas[p.loja])} entregue na hora`);return}
  if(!tem.length){p.chega=Math.min(p.chega,agora+5*D);log(`⏳ ${p.forn} sem estoque – pedido chega em até ${Math.ceil((p.chega-agora)/D)} dia(s)`);return}
  const custo=it=>{const pr=prod(it[0]);return pr?pr.custo*it[1]:0},tf=falta.reduce((a,it)=>a+custo(it),0);
  p.itens=tem;p.tot=Math.max(0,(p.tot||0)-tf);p.chega=agora;
  novos.push({id:S.nid++,loja:p.loja,itens:falta,tot:tf,forn:p.forn,por:p.por,chega:agora+(1+Math.floor(Math.random()*5))*D,v24:1});
  log(`📦 ${p.forn}: ${tem.length} produto(s) entregues na hora em ${nomeLoja(S.lojas[p.loja])}; ${falta.length} em falta chegam em até 5 dias`)});
 if(novos.length)S.compras.push(...novos);
 // carros zero km da concessionária própria (LP Carros etc.)
 (S.lojas||[]).forEach(l=>(l.vei||[]).forEach(c=>{if(c.v24||!c.chega)return;c.v24=1;if(Math.random()<.5){c.chega=0;log(`✅ ${c.m} ${c.mod}: a montadora tinha no estoque – já está no pátio da ${nomeLoja(l)}`)}}))}
// pedidos que já existiam antes desta versão ficam como estão
function marcaAntigos(){if(typeof S==="undefined"||!S||!S.lojas)return setTimeout(marcaAntigos,500);if(!S.v24ini){(S.pedidos||[]).forEach(p=>p.v24=1);(S.compras||[]).forEach(p=>p.v24=1);S.lojas.forEach(l=>(l.vei||[]).forEach(c=>c.v24=1));S.v24ini=1}setInterval(confere,250)}
marcaAntigos();
})();
