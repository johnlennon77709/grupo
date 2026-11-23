// v45: concorrência (lojas rivais), marketing (campanhas) e manutenção da frota (revisão, desgaste e quebras)
(function(){const W=window,H=36e5,D=864e5;const pk=a=>a[Math.random()*a.length|0],rnd=(a,b)=>a+Math.random()*(b-a);
const RIV={lub:["Lubri Center","Óleo Express","Rei dos Lubrificantes","Troca Fácil","Mega Lub"],const:["Casa do Construtor","Constrular","Material Forte","Obra Prima Materiais"],pecas:["Auto Peças Brasil","Peça Já","Distribuidora Rota"],veic:["Auto Prime Veículos","Multimarcas Norte","Car Center"],outro:["Comercial Norte","Mega Atacado"]};
const CAMP=[["carro","🚗 Carro de som",800,2,.08],["insta","📱 Instagram/Facebook pago",1500,5,.10],["radio","📻 Rádio local",3000,3,.15],["out","🪧 Outdoor",8000,10,.20],["tv","📺 Comercial na TV",18000,7,.30]];
function lojas(){return S.lojas.filter(l=>!l.encerrada&&l.tipo!=="transp")}
function seg(l){try{return segDe(l)}catch(e){return"outro"}}
function rivais(l){return (S.riv||[]).filter(r=>r.cid===l.cid&&r.seg===seg(l)&&!r.fechou)}
function boost(l){return (l.mkt||[]).filter(c=>c.fim>S.simMs).reduce((a,c)=>a+c.pct,0)}
function fator(l){const rv=rivais(l).reduce((a,r)=>a+r.forca,0);return Math.max(.45,(1+boost(l))*(1-rv))}
// vendas: aplica marketing e concorrência
if(typeof venda==="function"&&!venda.__v45){const o=venda;W.venda=function(l,v,c,...r){const f=l&&l.id!=null?fator(l):1;return o.call(this,l,v*f,(c||0)*f,...r)};W.venda.__v45=1}
// concorrentes aparecem / fecham
function dia(){S.riv=S.riv||[];const ls=lojas();
 if(ls.length&&Math.random()<.22){const l=pk(ls),s=seg(l);if(rivais(l).length<2){const n=pk(RIV[s]||RIV.outro);const r={id:S.nid++,n,cid:l.cid,seg:s,forca:+rnd(.06,.16).toFixed(2),desde:S.simMs};S.riv.push(r);log(`🏪 Concorrente novo: "${n}" abriu em ${l.cid} e vai disputar clientes com a ${nomeLoja(l)} (−${Math.round(r.forca*100)}% nas vendas)`);toast(`🏪 Concorrente abriu em ${l.cid}!`)}}
 S.riv.forEach(r=>{if(r.fechou)return;const minhas=ls.filter(l=>l.cid===r.cid&&seg(l)===r.seg);const mk=minhas.reduce((a,l)=>a+boost(l),0);r.forca=Math.max(0,+(r.forca-(mk>0?.015:0)+(Math.random()<.2?.01:0)).toFixed(3));
  if(r.forca<=.02||Math.random()<.015){r.fechou=S.simMs;log(`🎉 O concorrente "${r.n}" de ${r.cid} fechou as portas! Os clientes voltaram pra você.`);toast(`🎉 "${r.n}" fechou!`)}})}
W.campanha=function(lid,k){const l=S.lojas[lid],c=CAMP.find(x=>x[0]===k);if(!l||!c)return;if(!confirm(`${c[1]} para ${nomeLoja(l)}: ${R$(c[2])} por ${c[3]} dias (+${Math.round(c[4]*100)}% nas vendas). Confirmar?`))return;
 S.ecx[l.emp]=(S.ecx[l.emp]||0)-c[2];if(S.fat)S.fat.desp=(S.fat.desp||0)+c[2];l.mkt=(l.mkt||[]).filter(x=>x.fim>S.simMs);l.mkt.push({k,pct:c[4],fim:S.simMs+c[3]*D});log(`📣 Campanha ${c[1]} na ${nomeLoja(l)} até ${new Date(S.simMs+c[3]*D).toLocaleDateString("pt-BR")}`);save();render()};
// manutenção da frota
function pesado(v){return v.tipo!=="carro"&&v.tipo!=="carretinha"}
function custoRev(v){return v.tipo==="cavalo"?4800:v.tipo==="rigido"?3200:v.tipo==="implemento"?2200:v.tipo==="pickup"?1400:900}
let ultT=null;function desgaste(){if(ultT==null){ultT=S.simMs;return}const dh=(S.simMs-ultT)/H;ultT=S.simMs;if(dh<=0||dh>200)return;
 (S.frota||[]).forEach(v=>{v.kmRev=v.kmRev||0;if(v.status==="Oficina"){if(S.simMs>=v.oficAte){v.status="Garagem";v.kmRev=0;v.quebra=0;log(`🔧 ${v.mod} ${v.placa} saiu da oficina revisado`)}return}
  if(v.status!=="Garagem"&&pesado(v)){v.kmRev+=dh*55;const lim=20000;if(v.kmRev>lim&&Math.random()<dh*(v.kmRev-lim)/lim*.02){quebra(v)}}})}
function quebra(v){const c=Math.round(custoRev(v)*rnd(1.5,3.5));const t=S.lojas.find(l=>l.tipo==="transp");const e=t?t.emp:Object.keys(EMP)[0];S.ecx[e]=(S.ecx[e]||0)-c;if(S.fat)S.fat.desp=(S.fat.desp||0)+c;
 const a=S.fr&&S.fr.ativos.find(x=>x.v===v.id);if(a)a.par.forEach((p,i)=>{if(i>=a.i)p.t+=24*H});v.kmRev*=.6;
 log(`💥 ${v.mod} ${v.placa} quebrou na estrada por falta de revisão! Guincho + conserto ${R$(c)}${a?" e 24h de atraso":""}`);toast(`💥 ${v.placa} quebrou! Faça as revisões.`)}
W.revisar=function(id){const v=S.frota.find(x=>x.id===id);if(!v||v.status!=="Garagem")return alert("O veículo precisa estar na garagem.");const c=custoRev(v);if(!confirm(`Revisão completa do ${v.mod} ${v.placa}: troca de óleo e filtros, freios, pneus e suspensão. ${R$(c)}, fica 1 dia na oficina. Confirmar?`))return;
 const t=S.lojas.find(l=>l.tipo==="transp");const e=t?t.emp:Object.keys(EMP)[0];S.ecx[e]=(S.ecx[e]||0)-c;if(S.fat)S.fat.desp=(S.fat.desp||0)+c;v.status="Oficina";v.oficAte=S.simMs+D;log(`🔧 ${v.mod} ${v.placa} entrou na oficina para revisão (${R$(c)})`);save();render()};
let dAnt=null;setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.simMs)return;desgaste();const d=new Date(S.simMs).toDateString();if(dAnt&&d!==dAnt)dia();dAnt=d}catch(e){console.warn(e)}},3000);
// telas
function cardMkt(){const ls=lojas();const at=(S.riv||[]).filter(r=>!r.fechou);
 return `<div class="card"><h3>📣 Marketing e concorrência</h3>${at.length?`<div style="margin-bottom:8px">${at.map(r=>`<div style="padding:4px 0">🏪 <b>${esc(r.n)}</b> em ${r.cid} <span class="muted">– tirando ${Math.round(r.forca*100)}% das vendas das suas lojas de lá</span></div>`).join("")}<p class="muted" style="font-size:12px">Campanhas de marketing enfraquecem o concorrente dia após dia até ele fechar.</p></div>`:'<p class="muted">Nenhum concorrente forte por enquanto.</p>'}
 <div class="row" style="gap:8px;flex-wrap:wrap"><select id="mkL">${ls.map(l=>`<option value="${l.id}">${esc(nomeLoja(l))}${rivais(l).length?" ⚠️":""}${boost(l)?" 📣":""}</option>`).join("")}</select>${CAMP.map(c=>`<button class="b s" onclick="campanha(+document.getElementById('mkL').value,'${c[0]}')">${c[1]}<br><small>${R$(c[2])} · ${c[3]}d · +${Math.round(c[4]*100)}%</small></button>`).join("")}</div>
 ${ls.filter(l=>boost(l)).length?`<p class="muted" style="margin-top:8px;font-size:12px">Ativas: ${ls.filter(l=>boost(l)).map(l=>`${esc(nomeLoja(l))} (+${Math.round(boost(l)*100)}%)`).join(" · ")}</p>`:""}</div>`}
function cardFrota(){const vs=(S.frota||[]).filter(pesado);if(!vs.length)return"";
 return `<div class="card"><h3>🔧 Manutenção da frota</h3><p class="muted" style="margin:0 0 8px">Revise a cada 20.000 km. Depois disso o risco de quebrar na estrada sobe (guincho, conserto caro e atraso).</p>
 ${vs.map(v=>{const k=Math.round(v.kmRev||0),p=Math.min(100,k/200);const cor=k>20000?"#ef4444":k>15000?"#f59e0b":"#22c55e";return `<div class="row sb" style="padding:6px 0;border-bottom:1px solid #ffffff12;gap:8px"><span style="min-width:170px">${esc(v.mod)} <b>${v.placa}</b><br><span class="muted">${v.status==="Oficina"?"🔧 na oficina até "+new Date(v.oficAte).toLocaleString("pt-BR",{day:"2-digit",hour:"2-digit",minute:"2-digit"}):k.toLocaleString("pt-BR")+" km desde a revisão"}</span></span><div style="flex:1;height:8px;background:#1b232d;border-radius:5px;overflow:hidden"><i style="display:block;height:100%;width:${p}%;background:${cor}"></i></div>${v.status==="Garagem"?`<button class="b ${k>15000?"":"s"}" onclick="revisar(${v.id})">Revisar ${R$(custoRev(v))}</button>`:`<span class="muted">${v.status}</span>`}</div>`}).join("")}</div>`}
let ok=false;setTimeout(()=>{if(ok)return;ok=true;if(typeof V==="undefined")return;if(V.frota){const o=V.frota;V.frota=function(){return o.apply(this,arguments)+cardFrota()}}if(V.painel){const o=V.painel;V.painel=function(){return o.apply(this,arguments)+cardMkt()}}},3600);
})();
