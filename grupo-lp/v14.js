// v14: vender/fechar lojas e empresas + compras de acordo com o ramo e com o que cada loja vende
(function(){const W=window;
const fech=l=>l&&l.encerrada;
// ---- loja encerrada/vendida não abre, não compra, não gera contas ----
const oAb=W.aberto;W.aberto=function(d,l){if(fech(l))return false;return oAb.apply(this,arguments)};
const oLV=W.lojasVenda;W.lojasVenda=function(){return oLV().filter(l=>!fech(l))};
const oNL=W.nomeLoja;W.nomeLoja=function(l){const n=oNL(l);return fech(l)?n+(l.encerrada==="vendida"?" (vendida)":" (fechada)"):n};
const oGC=W.gerarContasMes;W.gerarContasMes=function(d){const n0=S.contas.length;oGC.apply(this,arguments);
 const fora=S.lojas.filter(fech).map(l=>oNL(l));
 S.contas=S.contas.filter((c,i)=>i<n0||!(fora.some(n=>c.desc.endsWith("– "+n))||c.desc.startsWith("Compra de lubrificantes – reposição")))};
// ---- avaliação ----
function valLoja(l){const est=S.prods.reduce((a,p)=>a+(l.est[p.id]||0)*p.custo,0);const t=S.ter.find(t=>t.loja===l.id);
 const imovel=t&&t.proprio?(t.val||0)*1.6:0,mes=Math.max(l.venda.mes,(l.alvoHoje||12000)*26),pontoComercial=mes*.12*14,equip=l.tipo==="loja"?180000*(l.troca?1.4:1):350000;
 return {est,imovel,ponto:pontoComercial,equip,tot:est+imovel+pontoComercial+equip+(l.caixa>0?0:0)}}
function demitir(l){const fs=S.func.filter(f=>f.loja===l.id);let rc=0;fs.forEach(f=>rc+=f.sal*1.8);S.func=S.func.filter(f=>f.loja!==l.id);return{n:fs.length,rc}}
W.venderLoja=function(id){const l=S.lojas[id];if(!l||fech(l))return;const v=valLoja(l),of=Math.round(v.tot*(.82+Math.random()*.25)/1000)*1000;
 const comp=pick(["Grupo Rondon Investimentos","Auto Center Amazônia","Rede Norte Distribuidora","Fundo Pantanal Participações","Família Bortolini","Grupo Cerrado Holdings","Distribuidora Guaporé"]);
 if(!confirm(`💼 ${comp} oferece ${R$(of)} pela ${oNL(l)}\n\nAvaliação: estoque ${R$(v.est)} + ponto comercial ${R$(v.ponto)} + equipamentos ${R$(v.equip)}${v.imovel?" + imóvel "+R$(v.imovel):""} = ${R$(v.tot)}\n\nOs funcionários vão junto com a loja. Aceitar a venda?`))return;
 S.ecx[l.emp]=(S.ecx[l.emp]||0)+of+Math.max(0,l.caixa);S.func=S.func.filter(f=>f.loja!==l.id);
 S.prods.forEach(p=>l.est[p.id]=0);const t=S.ter.find(t=>t.loja===l.id);if(t)S.ter=S.ter.filter(x=>x!==t);
 l.caixa=0;l.encerrada="vendida";S.compras=(S.compras||[]).filter(p=>p.loja!==l.id);
 log(`💼 ${oNL(l)} vendida para ${comp} por ${R$(of)}`);toast("Loja vendida!");save();render()};
W.fecharLoja=function(id){const l=S.lojas[id];if(!l||fech(l))return;const v=valLoja(l),liq=v.est*.55,fs=S.func.filter(f=>f.loja===l.id),rc=fs.reduce((a,f)=>a+f.sal*1.8,0);
 if(!confirm(`🔒 Fechar ${oNL(l)}?\n\n• Liquidação do estoque (55% do custo): +${R$(liq)}\n• Rescisão de ${fs.length} funcionário(s): -${R$(rc)}\n• Saldo: ${R$(liq-rc)}\n\nA loja para de funcionar e não gera mais contas.`))return;
 demitir(l);S.ecx[l.emp]=(S.ecx[l.emp]||0)+liq-rc+Math.max(0,l.caixa);S.prods.forEach(p=>l.est[p.id]=0);l.caixa=0;l.encerrada="fechada";
 S.compras=(S.compras||[]).filter(p=>p.loja!==l.id);log(`🔒 ${oNL(l)} foi fechada. Estoque liquidado ${R$(liq)}, rescisões ${R$(rc)}`);toast("Loja fechada");save();render()};
W.reabrirLoja=function(id){const l=S.lojas[id];if(!l||l.encerrada!=="fechada")return;const c=150000;if(!confirm(`Reabrir ${oNL(l)} por ${R$(c)} (reforma + licenças)? Depois contrate funcionários e o comprador repõe o estoque.`))return;S.ecx[l.emp]=(S.ecx[l.emp]||0)-c;delete l.encerrada;log(`🔓 ${oNL(l)} reaberta`);save();render()};
W.venderEmpresa=function(k){const ls=S.lojas.filter(l=>l.emp===k&&!fech(l));if(!ls.length)return toast("Essa empresa não tem unidades ativas");
 const tot=ls.reduce((a,l)=>a+valLoja(l).tot,0),of=Math.round(tot*(.85+Math.random()*.22)/1000)*1000,cx=S.ecx[k]||0;
 if(!confirm(`💼 Proposta pela empresa ${EMP[k].n} inteira (${ls.length} unidade(s)): ${R$(of)}\nAvaliação total: ${R$(tot)}\n\nO dinheiro da venda e o caixa da empresa (${R$(cx)}) vão para a Lubriporto. Aceitar?`))return;
 ls.forEach(l=>{S.func=S.func.filter(f=>f.loja!==l.id);S.prods.forEach(p=>l.est[p.id]=0);l.caixa=0;l.encerrada="vendida";S.ter=S.ter.filter(t=>t.loja!==l.id)});
 const dest=k==="LP"?Object.keys(EMP).find(x=>x!==k&&S.lojas.some(l=>l.emp===x&&!fech(l))):"LP";S.ecx[dest]=(S.ecx[dest]||0)+of+cx;S.ecx[k]=0;
 log(`💼 Empresa ${EMP[k].n} vendida por ${R$(of)} – dinheiro foi para ${EMP[dest].n}`);toast("Empresa vendida!");save();render()};
W.fecharEmpresa=function(k){const ls=S.lojas.filter(l=>l.emp===k&&!fech(l));if(!ls.length)return toast("Essa empresa não tem unidades ativas");
 const liq=ls.reduce((a,l)=>a+valLoja(l).est*.55,0),rc=ls.reduce((a,l)=>a+S.func.filter(f=>f.loja===l.id).reduce((b,f)=>b+f.sal*1.8,0),0);
 if(!confirm(`🔒 Fechar a empresa ${EMP[k].n} (${ls.length} unidade(s))?\nLiquidação de estoque +${R$(liq)} • rescisões -${R$(rc)}`))return;
 ls.forEach(l=>{demitir(l);S.prods.forEach(p=>l.est[p.id]=0);S.ecx[k]=(S.ecx[k]||0)+Math.max(0,l.caixa);l.caixa=0;l.encerrada="fechada"});S.ecx[k]=(S.ecx[k]||0)+liq-rc;
 log(`🔒 Empresa ${EMP[k].n} encerrou as atividades`);save();render()};
// ---- botões nas telas ----
const oE=V.empresas;V.empresas=function(){let h=oE.apply(this,arguments);
 const blocos=Object.keys(EMP).map(k=>{const ls=S.lojas.filter(l=>l.emp===k);if(!ls.length)return"";
  return `<div class="card" style="border-left:4px solid ${EMP[k].c}"><div class="row sb"><h3 style="margin:0">${esc(EMP[k].n)}</h3><div class="row"><button class="b bl" onclick="venderEmpresa('${k}')">💼 Vender empresa</button><button class="b r" onclick="fecharEmpresa('${k}')">🔒 Fechar empresa</button></div></div>
  <div class="tw"><table><tr><th>Unidade</th><th>Situação</th><th>Valor estimado</th><th></th></tr>${ls.map(l=>{const v=valLoja(l);return `<tr><td>${esc(oNL(l))}</td><td>${l.encerrada==="vendida"?'<span class="pill r">Vendida</span>':l.encerrada?'<span class="pill y">Fechada</span>':'<span class="pill g">Ativa</span>'}</td><td>${fech(l)?"–":R$(v.tot)}</td>
  <td style="white-space:nowrap">${fech(l)?(l.encerrada==="fechada"?`<button class="b s" onclick="reabrirLoja(${l.id})">🔓 Reabrir</button>`:""):`<button class="b bl" onclick="venderLoja(${l.id})">💼 Vender</button><button class="b r" onclick="fecharLoja(${l.id})">🔒 Fechar</button>`}</td></tr>`}).join("")}</table></div></div>`}).join("");
 return h+`<h3 style="margin:16px 0 6px">Vender ou fechar unidades e empresas</h3>`+blocos};
// ---- compras inteligentes: só produtos do ramo da empresa, na quantidade que a loja realmente vende ----
function aprende(l){const ps=S.prods.filter(p=>p.seg===segDe(l));l.ult=l.ult||{};l.vel=l.vel||{};
 ps.forEach(p=>{const e=l.est[p.id]||0,u=l.ult[p.id];const sold=u!=null&&u>e?u-e:0;l.vel[p.id]=(l.vel[p.id]||0)*.96+sold*.04;l.ult[p.id]=e})}
W.rotinaCompras=function(){const d=new Date(S.simMs);if(d.getMinutes()!==0||d.getDay()===0)return;
 lojasVenda().forEach(aprende);if(d.getHours()<7||d.getHours()>18)return;S.compras=S.compras||[];
 lojasVenda().forEach(l=>{const c=cfgCompra(l);if(!c.on)return;const f=quemCompra(l);if(!f)return;if(W.empCtx)empCtx(l);
  const pend={};S.compras.filter(p=>p.loja===l.id).forEach(p=>p.itens.forEach(([i,q])=>pend[i]=(pend[i]||0)+q));
  const seg=segDe(l),ps=S.prods.filter(p=>p.seg===seg),tem=p=>(l.est[p.id]||0)+(pend[p.id]||0);
  const alvo=p=>{const dia=(l.vel[p.id]||0)*12;return Math.max(c.alvo,Math.min(400,Math.ceil(dia*10)))}; // ~10 dias de venda, mínimo o alvo
  let itens=ps.filter(p=>tem(p)<Math.max(c.min,Math.ceil((l.vel[p.id]||0)*12*3))).sort((a,b)=>(l.vel[b.id]||0)-(l.vel[a.id]||0)||tem(a)-tem(b)).map(p=>[p.id,alvo(p)-tem(p)]).filter(x=>x[1]>0);if(!itens.length)return;
  const lim=W.LIMNEG?LIMNEG():0;let disp=S.caixaGrupo+lim,tot=0,cort=0;
  itens=itens.filter(([i,q])=>{const v=prod(i).custo*q;if(v<=disp-tot){tot+=v;return true}cort++;return false});
  if(!itens.length){log(`⚠️ ${f.nome} não conseguiu comprar para ${nomeLoja(l)}: caixa insuficiente`);return}
  if(cort)log(`⚠️ ${f.nome}: faltou caixa para ${cort} produto(s) de ${nomeLoja(l)}`);
  S.caixaGrupo-=tot;const forn=seg==="const"?pick(["Votorantim Cimentos","Gerdau","Tigre","Suvinil","Deca","Distribuidora Norte Materiais"]):pick(["Vibra (Lubrax)","Raízen (Shell)","Ipiranga","Petronas Lubrificantes","Moove (Mobil)","Tecfil / Sofape","Bosch Autopeças","Pirelli/Distribuidor"]);
  const un=itens.reduce((a,x)=>a+x[1],0),top=itens.slice(0,3).map(x=>prod(x[0]).nome.split(" ").slice(0,3).join(" ")).join(", ");
  S.compras.push({id:S.nid++,loja:l.id,itens,tot,forn,por:f.nome,chega:S.simMs+ri(1,3)*DIA+ri(0,6)*36e5});
  log(`📋 ${f.nome} fez um pedido completo para ${nomeLoja(l)} (${SEGS[seg]}): ${itens.length} produtos, ${un} un. com ${forn} – ${R$(tot)}. Mais vendidos: ${top}`)})};
})();
