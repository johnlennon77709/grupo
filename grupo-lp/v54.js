// v54: painel de lucro por loja, manutenção (óleo/pneu), motoristas com nota, clientes B2B, CD novo,
// metas por loja, estações do ano, concorrente agressivo, notificações e foto da fachada
(function(){const W=window,H=36e5,D=24*H;const pk=a=>a[Math.random()*a.length|0],ri=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
const at=()=>S.lojas.filter(l=>!l.encerrada);
const transp=()=>{const t=S.lojas.find(l=>l.tipo==="transp"&&!l.encerrada);return t?t.id:0};
const paga=(id,v,desc)=>{S.lcx=S.lcx||{};S.lcx[id]=(S.lcx[id]||0)-v;try{log(`${desc} – ${nl(id)} – ${R$(v)}`)}catch(e){}};
function X(){S.v54=S.v54||{};const x=S.v54;x.b2b=x.b2b||[];x.ofe=x.ofe||[];x.metas=x.metas||{};x.rival=x.rival||[];x.mesV=x.mesV||{};x.notif=x.notif||false;return x}
const mesDe=t=>{const d=new Date(t);return d.getFullYear()*12+d.getMonth()};
const caminhoes=()=>S.frota.filter(v=>!["implemento","carretinha","carro"].includes(v.tipo));
// ===== 7) estações do ano =====
function epoca(){const m=new Date(S.simMs).getMonth()+1;return{chuva:m>=11||m<=4,safra:(m>=1&&m<=4)?"soja":(m>=6&&m<=8)?"milho":null}}
// ===== vendas: estação, concorrente =====
const oV=W.venda;if(oV&&!oV.__v54){W.venda=function(l){const a=l&&l.venda?+l.venda.dia||0:0;const r=oV.apply(this,arguments);
 try{if(l&&l.venda){const d=(+l.venda.dia||0)-a;if(d>0){let f=0;const e=epoca();let uf="";try{uf=(CID[l.cid]||{}).uf||""}catch(x){}
  if(e.safra&&uf==="MT")f+=.3;const rv=X().rival.find(z=>z.loja===l.id&&z.ate>S.simMs);if(rv)f-=rv.resp==="preco"?.08:rv.resp==="mkt"?0:.22;
  if(f){const ex=d*f;l.venda.dia+=ex;l.venda.mes=(l.venda.mes||0)+ex;S.lcx[l.id]=(S.lcx[l.id]||0)+ex}}}}catch(x){}return r};W.venda.__v54=1}
// chuva deixa as viagens mais lentas (rotas novas da logística)
function chuva(){if(!epoca().chuva||!S.lg)return;(S.lg.rotas||[]).forEach(r=>{if(r.v54)return;r.v54=1;const t0=S.simMs;r.par.forEach(p=>{p.t=t0+(p.t-t0)*1.25})})}
// ===== 2) manutenção: óleo e pneus =====
const LIM={oleo:30000,pneu:110000};
function desgaste(){const x=X(),agora=S.simMs;if(!x.uk){x.uk=agora;return}const dh=(agora-x.uk)/H;x.uk=agora;if(dh<=0||dh>48)return;
 caminhoes().forEach(v=>{v.kmO=v.kmO||0;v.kmP=v.kmP||0;if(v.status&&v.status!=="Garagem"){const k=dh*60;v.kmO+=k;v.kmP+=k;
  const m=(S.func||[]).find(f=>f.id===v.mot),risco=m?ris(m):1;
  const venc=(v.kmO>LIM.oleo?1:0)+(v.kmP>LIM.pneu?1:0);if(venc&&Math.random()<.004*dh*venc*risco)quebra(v,venc>1||v.kmO>LIM.oleo*1.3?"motor":"pneu");
  if(m&&Math.random()<.0008*dh*risco)multa(m,v)}})}
function atrasa(v,h){const add=a=>{for(let i=a.i||0;i<a.par.length;i++)a.par[i].t+=h*H};(S.lg&&S.lg.rotas||[]).filter(r=>r.v===v.id).forEach(add);(S.fr&&S.fr.ativos||[]).filter(a=>a.v===v.id).forEach(add)}
function quebra(v,tipo){const h=tipo==="motor"?ri(24,48):ri(4,10),c=tipo==="motor"?ri(18000,45000):ri(3500,9000);atrasa(v,h);paga(transp(),c,`🔧 ${v.mod} ${v.placa} quebrou na estrada (${tipo==="motor"?"motor – óleo vencido":"pneu estourado"}), atraso de ${h}h`);
 if(tipo==="motor")v.kmO=0;else v.kmP=0;aviso("🔧 Caminhão quebrou",`${v.mod} ${v.placa}: ${tipo}, atraso de ${h}h`)}
W.v54troca=function(id,o){const v=S.frota.find(x=>x.id===id);if(!v)return;const c=o==="oleo"?1800:28000;paga(transp(),c,o==="oleo"?`🛢️ Troca de óleo ${v.placa}`:`🛞 Pneus novos ${v.placa}`);if(o==="oleo")v.kmO=0;else v.kmP=0;try{save()}catch(e){}render()};
// ===== 3) motoristas com nota =====
function nota(f){f.v54=f.v54||{exp:ri(1,4),mult:0};return f.v54}
const ris=f=>[1.8,1.4,1,.75,.5][Math.min(4,Math.max(0,nota(f).exp-1))];
function multa(m,v){const n=nota(m);n.mult++;const val=pk([195.23,293.47,880.41,1467.35]);paga(transp(),val,`🚨 Multa de trânsito – ${m.nome} (${v.placa})`);try{m.moral=Math.max(0,(m.moral||70)-3)}catch(e){}}
W.v54trein=function(fid){const f=S.func.find(x=>x.id===fid);if(!f)return;const n=nota(f);if(n.exp>=5)return toast("Já é nota máxima");paga(f.loja,2500,`🎓 Curso de direção defensiva – ${f.nome}`);n.exp++;f.moral=Math.min(100,(f.moral||70)+5);try{save()}catch(e){}render()};
W.v54aum=function(fid){const f=S.func.find(x=>x.id===fid);if(!f)return;f.sal=Math.round(f.sal*1.1);f.moral=Math.min(100,(f.moral||70)+12);toast(`Salário de ${f.nome}: ${R$(f.sal)}`);try{save()}catch(e){}render()};
const est=n=>"★".repeat(n)+"☆".repeat(5-n);
function cardFrota(){const cs=caminhoes(),ms=(S.func||[]).filter(f=>f.cargo==="mot");
 return `<div class="card"><h3>🔧 Manutenção da frota</h3><p class="muted" style="font-size:13px">Óleo a cada ${(LIM.oleo/1000)} mil km e pneus a cada ${(LIM.pneu/1000)} mil km. Vencido = risco de quebrar na estrada e atrasar a entrega. Pago pelo caixa da transportadora.</p>
 <div class="tw"><table><tr><th>Caminhão</th><th>Óleo</th><th>Pneus</th><th></th></tr>${cs.map(v=>{const o=v.kmO||0,p=v.kmP||0,c=(a,l)=>`<span style="color:${a>l?"#ef4444":a>l*.8?"#f5b301":"#22c55e"}">${Math.round(a).toLocaleString("pt-BR")} km</span>`;
  return `<tr><td>${esc(v.mod)} ${v.placa}</td><td>${c(o,LIM.oleo)}</td><td>${c(p,LIM.pneu)}</td><td style="white-space:nowrap"><button class="b s" onclick="v54troca(${v.id},'oleo')">Óleo R$1,8 mil</button> <button class="b s" onclick="v54troca(${v.id},'pneu')">Pneus R$28 mil</button></td></tr>`}).join("")}</table></div></div>
 <div class="card"><h3>🧑‍✈️ Motoristas</h3><div class="tw"><table><tr><th>Motorista</th><th>Nota</th><th>Multas</th><th>Salário</th><th></th></tr>${ms.map(f=>{const n=nota(f);return `<tr><td>${esc(f.nome)}</td><td style="color:#f5b301">${est(n.exp)}</td><td>${n.mult}</td><td>${R$(f.sal)}</td><td style="white-space:nowrap"><button class="b s" onclick="v54trein(${f.id})">Curso R$2,5 mil</button> <button class="b s" onclick="v54aum(${f.id})">+10% salário</button></td></tr>`}).join("")||`<tr><td colspan="5" class="muted">Nenhum motorista contratado</td></tr>`}</table></div><p class="muted" style="font-size:12px">Motorista com nota alta toma menos multa e quebra menos o caminhão.</p></div>`}
// ===== 4) clientes B2B =====
const B2BN=["Transportadora Rota Norte","Fazenda Santa Luzia","Agropecuária Boa Vista","Construtora Amazônia","Viação Rondônia","Frigorífico Vale do Guaporé","Mineradora Serra Azul","Cooperativa Agro Parecis","Transportes Pantanal","Usina Rio Madeira","Fazenda Três Irmãos","Locadora de Máquinas Norte"];
function novaOferta(){const x=X();if(x.ofe.length>=3)return;const ls=at().filter(l=>l.tipo==="loja"||l.tipo==="mat");if(!ls.length)return;const l=pk(ls);
 x.ofe.push({id:S.nid++,nome:pk(B2BN)+" ("+l.cid+")",loja:l.id,vol:ri(4,40)*5000,desc:ri(3,12),prazo:pk([28,30,45,60]),meses:pk([6,12,24]),ate:S.simMs+5*D});
 aviso("🤝 Proposta de contrato","Um cliente grande quer fechar contrato. Veja na Sala do Chefe.")}
W.v54b2b=function(id,ok){const x=X(),o=x.ofe.find(z=>z.id===id);if(!o)return;x.ofe=x.ofe.filter(z=>z!==o);if(ok){o.ini=S.simMs;o.fim=S.simMs+o.meses*30*D;x.b2b.push(o);try{log(`🤝 Contrato fechado: ${o.nome} com ${nl(o.loja)} – ${R$(o.vol)}/mês, ${o.desc}% de desconto, ${o.prazo} dias`)}catch(e){}}try{save()}catch(e){}render()};
W.v54b2bx=function(id){const x=X();const o=x.b2b.find(z=>z.id===id);if(!o)return;x.b2b=x.b2b.filter(z=>z!==o);try{log(`❌ Contrato encerrado: ${o.nome}`)}catch(e){}try{save()}catch(e){}render()};
function b2bDia(){const x=X(),d=new Date(S.simMs).toDateString();if(x.b2bD===d)return;x.b2bD=d;
 x.b2b=x.b2b.filter(o=>{if(S.simMs>o.fim){try{log(`📄 Contrato terminou: ${o.nome}`)}catch(e){}return false}const l=S.lojas[o.loja];if(!l||l.encerrada)return false;
  const fat=o.vol/30*(1-o.desc/100),lucro=o.vol/30*(.38-o.desc/100);l.venda.dia=(l.venda.dia||0)+fat;l.venda.mes=(l.venda.mes||0)+fat;S.lcx[l.id]=(S.lcx[l.id]||0)+lucro;return true});
 x.ofe=x.ofe.filter(o=>o.ate>S.simMs);if(Math.random()<.2)novaOferta()}
// ===== 5) CD novo =====
W.v54cd=function(){const c=document.getElementById("v54cdc").value;if(!c)return;S.lg=S.lg||{};S.lg.cdx=S.lg.cdx||[];if(c==="Cacoal"||c==="Cuiabá"||S.lg.cdx.some(z=>z.cid===c))return toast("Já tem CD nessa cidade");
 paga(transp(),380000,`🏬 Novo CD em ${c}`);S.lg.cdx.push({cid:c,t:S.simMs});try{W.v52api&&W.v52api.syncCD()}catch(e){}try{save()}catch(e){}render()};
function cardCD(){const ex=(S.lg&&S.lg.cdx)||[];const cids=[...new Set(at().map(l=>l.cid))].filter(c=>c!=="Cacoal"&&c!=="Cuiabá"&&!ex.some(z=>z.cid===c));
 const api=W.v52api;const atend=c=>api?at().filter(l=>api.reg(l)==="x"+c).map(l=>nl(l.id)).join(", "):"";
 return `<div class="card"><h3>🏬 Centros de distribuição</h3><p style="margin:4px 0">CD Cacoal · CD Cuiabá${ex.map(c=>` · <b>CD ${esc(c.cid)}</b>`).join("")}</p>
 ${ex.map(c=>`<div class="muted" style="font-size:12px">CD ${esc(c.cid)} atende: ${atend(c.cid)||"—"}</div>`).join("")}
 <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px"><select id="v54cdc">${cids.map(c=>`<option>${esc(c)}</option>`).join("")}</select><button class="b g" onclick="v54cd()">Abrir CD – R$ 380 mil</button></div>
 <p class="muted" style="font-size:12px">As lojas a até 450 km do CD novo (e mais perto dele) passam a receber por ele: o caminhão grande descarrega lá e outro caminhão faz as entregas.</p></div>`}
// ===== 6) metas por loja =====
W.v54meta=function(id){const v=+String(document.getElementById("v54m"+id).value).replace(/\D/g,"");X().metas[id]=v||0;toast("Meta salva");try{save()}catch(e){}render()};
function metas(){const x=X(),m=mesDe(S.simMs);if(x.mes==null){x.mes=m;return}
 at().forEach(l=>{if(l.venda)x.mesV[l.id]=Math.max(x.mesV[l.id]&&x.mes===m?x.mesV[l.id]:0,l.venda.mes||0)});
 if(m===x.mes)return;// virou o mês
 at().forEach(l=>{const meta=x.metas[l.id];if(!meta)return;const fez=x.mesV[l.id]||0;const g=(S.func||[]).find(f=>f.loja===l.id&&f.cargo==="ger");
  if(fez>=meta){paga(l.id,3000,`🏆 Bônus de meta batida (${R$(fez)} de ${R$(meta)})`);if(g){g.moral=Math.min(100,(g.moral||70)+20);fala(g,`Chefe, batemos a meta! Fizemos ${R$(fez)} de ${R$(meta)}. Obrigado pelo bônus, a equipe tá voando! 🚀`)}}
  else{if(g){g.moral=Math.max(0,(g.moral||70)-15);fala(g,`Chefe, não deu… fizemos ${R$(fez)} de ${R$(meta)} (${Math.round(fez/meta*100)}%). Vou ajustar a equipe e mês que vem a gente bate.`)}try{log(`📉 ${nl(l.id)} não bateu a meta: ${R$(fez)} de ${R$(meta)}`)}catch(e){}}});
 x.mes=m;x.mesV={}}
function fala(f,txt){try{const t=novaThread("papo",f.id,`${f.nome}`,"👔");t.fid=f.id;msgAdd(t,"ele",txt)}catch(e){}}
// ===== 8) concorrente agressivo =====
const RIVN=["Lubri Center","Óleo Express","Rei dos Lubrificantes","Mega Lub","Troca Fácil","Super Óleo"];
function rivalDia(){const x=X(),d=new Date(S.simMs).toDateString();if(x.rvD===d)return;x.rvD=d;x.rival=x.rival.filter(r=>r.ate>S.simMs);
 if(Math.random()>.07)return;const ls=at().filter(l=>l.tipo==="loja"&&!x.rival.some(r=>r.loja===l.id));if(!ls.length)return;const l=pk(ls);
 const r={id:S.nid++,loja:l.id,nome:pk(RIVN),ate:S.simMs+30*D,resp:null};x.rival.push(r);
 const g=(S.func||[]).find(f=>f.loja===l.id&&f.cargo==="ger")||(S.func||[]).find(f=>f.loja===l.id);
 if(g)fala(g,`Chefe, problema: a <b>${r.nome}</b> abriu aqui em ${esc(l.cid)} e tá vendendo óleo bem mais barato. Nossas vendas vão cair uns 20%. O que a gente faz?<br><button class="b g" onclick="v54riv(${r.id},'preco')">Baixar nosso preço 10%</button> <button class="b g" onclick="v54riv(${r.id},'mkt')">Campanha forte (R$ 15 mil)</button> <button class="b s" onclick="v54riv(${r.id},'nada')">Ignorar</button>`);
 aviso("⚔️ Concorrente",`${r.nome} abriu em ${l.cid} com preço baixo`)}
W.v54riv=function(id,o){const r=X().rival.find(z=>z.id===id);if(!r)return toast("Já resolvido");if(r.resp)return toast("Você já decidiu");r.resp=o;
 if(o==="mkt")paga(r.loja,15000,`📣 Campanha contra a ${r.nome}`);try{log(`⚔️ Resposta à ${r.nome} em ${nl(r.loja)}: ${o==="preco"?"baixou o preço":o==="mkt"?"campanha de marketing":"ignorou"}`)}catch(e){}toast("Decisão tomada");try{save()}catch(e){}render()};
// ===== 9) notificações =====
function aviso(t,b){if(!X().notif||!("Notification" in W)||Notification.permission!=="granted")return;try{if(document.hidden||true){navigator.serviceWorker&&navigator.serviceWorker.ready.then(r=>r.showNotification(t,{body:b,icon:"lp-icon-192.png",tag:t})).catch(()=>{new Notification(t,{body:b})})}}catch(e){}}
const oLog=W.log;if(oLog&&!oLog.__v54){W.log=function(m){try{const s=String(m).replace(/<[^>]*>/g,"");if(/^(✅ .*entregou|🏁|🧰 .*pediu|🚨 Multa|📉|🏆)/.test(s)&&document.hidden)aviso("Grupo LP",s.slice(0,140))}catch(e){}return oLog.apply(this,arguments)};W.log.__v54=1;W.log.__v52=oLog.__v52}
W.v54notif=async function(){if(!("Notification" in W))return toast("Este aparelho não suporta notificações");const p=await Notification.requestPermission();X().notif=p==="granted";toast(p==="granted"?"Notificações ligadas":"Permissão negada no aparelho");try{save()}catch(e){}render()};
// ===== 1) painel do grupo =====
function semana(id){const r=S.lg&&S.lg.rel&&S.lg.rel[id];if(!r)return 0;return Object.values(r).reduce((a,d)=>a+(d.v||0),0)}
function cardPainel(){const rows=at().map(l=>{const fol=(S.func||[]).filter(f=>f.loja===l.id).reduce((a,f)=>a+f.sal,0);const mes=(l.venda&&l.venda.mes)||0;const luc=mes*.35-fol*1.36-(l.tipo==="transp"?0:2500);return{l,dia:(l.venda&&l.venda.dia)||0,sem:semana(l.id),mes,luc}}).sort((a,b)=>b.luc-a.luc);
 const e=epoca();
 return `<div class="card"><h3>📊 Lucro por loja (estimado no mês)</h3><div class="tw"><table><tr><th>Loja</th><th>Hoje</th><th>7 dias</th><th>Mês</th><th>Lucro mês</th></tr>${rows.map(r=>`<tr><td>${esc(nl(r.l.id))}</td><td>${R$(r.dia)}</td><td>${R$(r.sem)}</td><td>${R$(r.mes)}</td><td style="font-weight:700;color:${r.luc<0?"#ef4444":"#22c55e"}">${R$(r.luc)}</td></tr>`).join("")}</table></div>
 <p class="muted" style="font-size:12px">Lucro = margem média de 35% das vendas − folha com encargos − custos fixos. ${rows.length?`🥇 Melhor: <b>${esc(nl(rows[0].l.id))}</b>. ${rows[rows.length-1].luc<0?`🔴 No vermelho: <b>${rows.filter(r=>r.luc<0).map(r=>esc(nl(r.l.id))).join(", ")}</b>`:""}`:""}</p>
 <p style="font-size:13px;margin-top:6px">${e.chuva?"🌧️ Época de chuva: as viagens estão 25% mais lentas.":"☀️ Época seca: estradas boas."} ${e.safra?`🌾 Safra de ${e.safra} no MT: lojas do Mato Grosso vendendo +30%.`:""}</p></div>`}
// ===== Sala do Chefe: B2B, metas, concorrentes, CD, notificações =====
function cardChefe(){const x=X();const hm=t=>new Date(t).toLocaleDateString("pt-BR");
 const ofe=x.ofe.map(o=>`<div style="padding:8px 0;border-bottom:1px solid #ffffff14"><b>${esc(o.nome)}</b> → ${esc(nl(o.loja))}<br><span class="muted">${R$(o.vol)}/mês · ${o.desc}% desconto · ${o.prazo} dias pra pagar · ${o.meses} meses</span><div class="row" style="gap:6px;margin-top:6px"><button class="b g" onclick="v54b2b(${o.id},1)">Fechar contrato</button><button class="b s" onclick="v54b2b(${o.id},0)">Recusar</button></div></div>`).join("");
 const ct=x.b2b.map(o=>`<tr><td>${esc(o.nome)}</td><td>${esc(nl(o.loja))}</td><td>${R$(o.vol)}</td><td>${o.desc}%</td><td>${hm(o.fim)}</td><td><button class="b s" onclick="v54b2bx(${o.id})">Encerrar</button></td></tr>`).join("");
 const rv=x.rival.filter(r=>r.ate>S.simMs).map(r=>`<div>⚔️ <b>${esc(r.nome)}</b> em ${esc(nl(r.loja))} até ${hm(r.ate)} – ${r.resp==="preco"?"você baixou o preço":r.resp==="mkt"?"campanha feita (vendas protegidas)":r.resp==="nada"?"ignorado (vendas −22%)":`<button class="b g" onclick="v54riv(${r.id},'preco')">Baixar preço</button> <button class="b g" onclick="v54riv(${r.id},'mkt')">Campanha R$15 mil</button> <button class="b s" onclick="v54riv(${r.id},'nada')">Ignorar</button>`}</div>`).join("");
 return `<div class="card"><h3>🤝 Clientes grandes (contratos)</h3>${ofe||`<p class="muted">Nenhuma proposta nova agora. Elas aparecem de vez em quando.</p>`}
 ${ct?`<div class="tw" style="margin-top:8px"><table><tr><th>Cliente</th><th>Loja</th><th>Volume/mês</th><th>Desc.</th><th>Até</th><th></th></tr>${ct}</table></div>`:""}</div>
 ${rv?`<div class="card"><h3>⚔️ Concorrentes agressivos</h3>${rv}</div>`:""}
 <div class="card"><h3>🎯 Metas do mês por loja</h3><p class="muted" style="font-size:12px">Bateu: bônus de R$ 3 mil pra equipe e gerente motivado. Não bateu: gerente leva bronca.</p><div class="tw"><table><tr><th>Loja</th><th>Vendido no mês</th><th>Meta</th><th></th></tr>${at().filter(l=>l.tipo!=="transp").map(l=>{const m=x.metas[l.id]||0,v=(l.venda&&l.venda.mes)||0;return `<tr><td>${esc(nl(l.id))}</td><td>${R$(v)}${m?` <span class="muted">(${Math.round(v/m*100)}%)</span>`:""}</td><td><input id="v54m${l.id}" inputmode="numeric" style="width:120px" value="${m||""}" placeholder="R$"></td><td><button class="b s" onclick="v54meta(${l.id})">Salvar</button></td></tr>`}).join("")}</table></div></div>
 ${cardCD()}
 <div class="card"><h3>🔔 Notificações</h3><p class="muted" style="font-size:13px">Aviso no celular quando o caminhão chegar, um funcionário pedir algo, cair multa, aparecer concorrente ou proposta de contrato. Funciona enquanto o app estiver aberto ou em segundo plano.</p><button class="b ${x.notif?"s":"g"}" onclick="v54notif()">${x.notif?"✅ Ligadas":"Ligar notificações"}</button></div>`}
// ===== 10) foto da fachada =====
function cardFoto(){let l;try{l=S.lojas[lojaSel]}catch(e){}if(!l)return"";let src="";try{src=(S.fotos&&S.fotos[l.id])||(typeof FOTO_PADRAO!=="undefined"&&FOTO_PADRAO[l.id]&&!(S.fotosOff&&S.fotosOff[l.id])?FOTO_PADRAO[l.id]:"")}catch(e){}
 return `<div class="card"><div class="row sb" style="flex-wrap:wrap;gap:8px"><h3 style="margin:0">📷 Fachada – ${esc(nl(l.id))}</h3><label class="b g" style="cursor:pointer">Trocar foto<input type="file" accept="image/*" hidden onchange="fotoUp(this)"></label></div>
 ${src?`<img src="${src}" style="width:100%;max-height:340px;object-fit:cover;border-radius:12px;margin-top:10px">`:`<p class="muted" style="margin-top:8px">Sem foto ainda. Tire uma foto da loja de verdade e coloque aqui.</p>`}</div>`}
// ===== instalação =====
let inst=false;function instala(){if(inst||typeof V==="undefined")return;inst=true;
 const w=(k,fn,antes)=>{if(!V[k])return;const o=V[k];V[k]=function(){const a=o.apply(this,arguments);let c="";try{c=fn()}catch(e){console.warn(e)}return antes?c+a:a+c}};
 w("painel",cardPainel,true);w("frota",cardFrota,false);w("chefe",cardChefe,true);w("loja",cardFoto,true);try{render()}catch(e){}}
setTimeout(instala,10500);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;chuva();desgaste();b2bDia();metas();rivalDia()}catch(e){console.warn("v54",e)}},1000);
})();
