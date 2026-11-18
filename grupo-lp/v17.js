// v17: remove de vez a Porto Lubri Porto Velho do jogo (e reorganiza as referências das outras lojas)
(function(){const W=window;
const alvo=l=>l&&l.emp==="PL"&&l.cid==="Porto Velho"&&l.tipo!=="transp";
function remove(){if(typeof S==="undefined"||!S||!S.lojas)return;const i=S.lojas.findIndex(alvo);if(i<0)return;const l=S.lojas[i];
 // dinheiro da loja volta para a empresa; funcionários são desligados; pedidos cancelados (reembolso)
 S.ecx=S.ecx||{};S.ecx.PL=(S.ecx.PL||0)+Math.max(0,l.caixa||0);
 (S.compras||[]).filter(p=>p.loja===i).forEach(p=>S.ecx.PL+=p.tot||0);S.compras=(S.compras||[]).filter(p=>p.loja!==i);
 S.func=(S.func||[]).filter(f=>f.loja!==i);
 S.ter=(S.ter||[]).filter(t=>t.loja!==i);
 (S.frota||[]).forEach(v=>{if(v.dest===i&&(v.status==="Viagem"||v.status==="Engatada")){v.status="Retornando";v.dest=0}});
 const nm=(EMP.PL&&EMP.PL.n||"Porto Lubri")+" ";S.contas=(S.contas||[]).filter(c=>c.pago||!/Porto Velho$/.test(c.desc)||!c.desc.includes(nm));
 S.lojas.splice(i,1);
 // ajusta todos os números de loja (loja, dest, de) maiores que a removida em todo o estado
 const vistos=new Set();(function walk(o,d){if(!o||typeof o!=="object"||vistos.has(o)||d>6)return;vistos.add(o);
  if(o===S.lojas)return S.lojas.forEach((x,j)=>{x.id=j});
  for(const k in o){const v=o[k];if((k==="loja"||k==="dest"||k==="de"||k==="lojaSel")&&typeof v==="number"){if(v===i)o[k]=0;else if(v>i)o[k]=v-1}else if(v&&typeof v==="object")walk(v,d+1)}})(S,0);
 S.lojas.forEach((x,j)=>x.id=j);
 if(S.eu&&typeof S.eu.loja==="number"&&!S.lojas[S.eu.loja])S.eu.loja=0;
 try{if(typeof lojaSel!=="undefined"&&lojaSel>=S.lojas.length)lojaSel=0}catch(e){}
 try{lojaSel=0}catch(e){}
 log(`🗑️ Porto Lubri Porto Velho removida do grupo`);try{save()}catch(e){}try{render()}catch(e){}}
W.removerPLPV=remove;remove();setInterval(remove,1500);
})();
