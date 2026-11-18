// v12: compradores fazem um pedido único com tudo que a loja precisa; repõe quando qualquer item fica abaixo de 30 un.
(function(){const W=window;
W.cfgCompra=function(l){if(!l.cmp||!l.cmp.v12){const o=l.cmp||{};l.cmp={on:o.on!==false,min:30,alvo:60,v12:1}}return l.cmp};
W.rotinaCompras=function(){const d=new Date(S.simMs);if(d.getMinutes()!==0||d.getHours()<7||d.getHours()>18||d.getDay()===0)return;
 S.compras=S.compras||[];
 lojasVenda().forEach(l=>{const c=cfgCompra(l);if(!c.on)return;const f=quemCompra(l);if(!f)return;
  if(W.empCtx)empCtx(l);
  const pend={};S.compras.filter(p=>p.loja===l.id).forEach(p=>p.itens.forEach(([i,q])=>pend[i]=(pend[i]||0)+q));
  const ps=S.prods.filter(p=>p.seg===segDe(l));const tem=p=>(l.est[p.id]||0)+(pend[p.id]||0);
  // tudo que está abaixo do mínimo entra num pedido só, repondo até o alvo (mais faltantes primeiro)
  let itens=ps.filter(p=>tem(p)<c.min).sort((a,b)=>tem(a)-tem(b)).map(p=>[p.id,c.alvo-tem(p)]);if(!itens.length)return;
  const lim=W.LIMNEG?LIMNEG():0;let disp=S.caixaGrupo+lim,tot=0,cort=0;
  itens=itens.filter(([i,q])=>{const v=prod(i).custo*q;if(v<=disp-tot){tot+=v;return true}cort++;return false});
  if(!itens.length){log(`⚠️ ${f.nome} não conseguiu comprar para ${nomeLoja(l)}: caixa insuficiente`);return}
  if(cort)log(`⚠️ ${f.nome}: faltou caixa para ${cort} produto(s) de ${nomeLoja(l)}`);
  S.caixaGrupo-=tot;const forn=segDe(l)==="const"?pick(["Votorantim Cimentos","Gerdau","Tigre","Suvinil","Distribuidora Norte Materiais"]):pick(["Vibra (Lubrax)","Raízen (Shell)","Ipiranga","Petronas Lubrificantes","Moove (Mobil)","Tecfil / Sofape"]);
  const un=itens.reduce((a,x)=>a+x[1],0);
  S.compras.push({id:S.nid++,loja:l.id,itens,tot,forn,por:f.nome,chega:S.simMs+ri(1,3)*DIA+ri(0,6)*36e5});
  log(`📋 ${f.nome} fez um pedido completo para ${nomeLoja(l)}: ${itens.length} produtos (${un} un.) com ${forn} – ${R$(tot)}`)})};
})();
