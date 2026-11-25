// v55: seguro, roubo de carga (escolta/rastreador), pedido de aumento/demissão, contratação por entrevista,
// férias/13º/atestados, fiscalização, fluxo de caixa 30 dias, promoções, leilão de caminhões, ranking da equipe
(function(){const W=window,H=36e5,D=24*H;const pk=a=>a[Math.random()*a.length|0],ri=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
const at=()=>S.lojas.filter(l=>!l.encerrada);
const tr=()=>{const t=S.lojas.find(l=>l.tipo==="transp"&&!l.encerrada);return t?t.id:0};
const paga=(id,v,d)=>{S.lcx=S.lcx||{};S.lcx[id]=(S.lcx[id]||0)-v;try{log(`${d} – ${nl(id)} – ${R$(v)}`)}catch(e){}};
const ganha=(id,v,d)=>{S.lcx=S.lcx||{};S.lcx[id]=(S.lcx[id]||0)+v;try{log(`${d} – ${nl(id)} – ${R$(v)}`)}catch(e){}};
const sv=()=>{try{save()}catch(e){}try{render()}catch(e){}};
function X(){S.v55=S.v55||{};const x=S.v55;x.seg=x.seg||{frota:false,lojas:false};x.cand=x.cand||[];x.promo=x.promo||[];x.leil=x.leil||[];x.pedA=x.pedA||[];x.fisc=x.fisc||[];return x}
const CG2={mot:"Motorista",vend:"Vendedor",caixa:"Caixa",ger:"Gerente",mec:"Mecânico",est:"Estoquista",adm:"Administrativo",aux:"Auxiliar"};
const fala=(f,t)=>{try{const th=novaThread("papo",f.id,`${f.nome}`,"💬");th.fid=f.id;msgAdd(th,"ele",t)}catch(e){}};
const dia=()=>new Date(S.simMs).toDateString();
const caminhoes=()=>S.frota.filter(v=>!["implemento","carretinha","carro"].includes(v.tipo));
// ===== 1) seguro =====
const premio=()=>{const x=X();return (x.seg.frota?caminhoes().reduce((a,v)=>a+(v.val||300000),0)*.025/12:0)+(x.seg.lojas?at().length*1400:0)};
W.v55seg=function(k){const x=X();x.seg[k]=!x.seg[k];try{log(`🛡️ Seguro ${k==="frota"?"da frota":"das lojas"} ${x.seg[k]?"contratado":"cancelado"}`)}catch(e){}sv()};
function seguroDia(){const x=X();if(x.sgD===dia())return;x.sgD=dia();const p=premio()/30;if(p>0)S.lcx[tr()]=(S.lcx[tr()]||0)-p;
 // incêndio/alagamento raro nas lojas
 if(Math.random()<.004){const l=pk(at());const dano=ri(40000,250000);if(x.seg.lojas){paga(l.id,dano*.1,`🔥 Incêndio/sinistro (seguro cobriu 90%, franquia)`)}else paga(l.id,dano,`🔥 Incêndio/sinistro SEM seguro`)}}
// ===== 2) roubo de carga =====
W.v55rast=function(id){const v=S.frota.find(z=>z.id===id);if(!v||v.rast)return;v.rast=1;paga(tr(),3500,`📡 Rastreador instalado ${v.placa}`);sv()};
W.v55esc=function(){const x=X();x.esc=!x.esc;toast(x.esc?"Escolta armada ligada (R$ 450 por caminhão por dia na estrada)":"Escolta desligada");sv()};
function roubo(){const x=X(),h=new Date(S.simMs).getHours();if(!(h>=22||h<=5))return;const k=Math.floor(S.simMs/H);if(x.rbH===k)return;x.rbH=k;
 const rot=[];(S.lg&&S.lg.rotas||[]).forEach(r=>rot.push({r,v:S.frota.find(z=>z.id===r.v),lg:1}));(S.fr&&S.fr.ativos||[]).forEach(a=>rot.push({r:a,v:S.frota.find(z=>z.id===a.v)}));
 rot.forEach(({r,v,lg})=>{if(!v)return;let p=.0012;if(v.rast)p*=.5;if(x.esc)p*=.2;if(Math.random()>p)return;
  let perda=0,desc="";if(lg){const ps=(r.carga||[]).filter(q=>!q.ok&&!q.noCD);if(!ps.length)return;const q=pk(ps);perda=q.tot||50000;q.ok=1;desc=`pedido de ${q.forn} para ${nl(q.loja)}`}else{perda=ri(30000,120000);desc="carga do frete"}
  const rec=v.rast&&Math.random()<.7;if(rec){try{log(`🚨 Tentativa de roubo no ${v.placa}: rastreador ajudou a polícia a recuperar a carga!`)}catch(e){}return}
  const cob=x.seg.frota?.8:0;paga(tr(),perda*(1-cob),`🚨 ROUBO DE CARGA no ${v.mod} ${v.placa} (${desc})${cob?" – seguro cobriu 80%":" – sem seguro"}`)})}
function escoltaDia(){const x=X();if(!x.esc||x.esD===dia())return;x.esD=dia();const n=caminhoes().filter(v=>v.status&&v.status!=="Garagem").length;if(n)S.lcx[tr()]=(S.lcx[tr()]||0)-450*n}
// ===== 3) pedido de aumento / demissão =====
function insatisfeitos(){const x=X();if(x.inD===dia())return;x.inD=dia();
 (S.func||[]).forEach(f=>{if((f.moral??70)>=30||Math.random()>.05||x.pedA.some(p=>p.fid===f.id))return;const pct=pk([10,15,20]);const p={id:S.nid++,fid:f.id,pct,t:S.simMs};x.pedA.push(p);
  fala(f,`Chefe, preciso falar sério… tô desanimado e recebi proposta de outra empresa. Se o senhor me der <b>${pct}% de aumento</b> (${R$(f.sal*(1+pct/100))}), eu fico.<br><button class="b g" onclick="v55aum(${p.id},1)">Dar aumento</button> <button class="b s" onclick="v55aum(${p.id},0)">Não dá</button>`)})}
W.v55aum=function(id,ok){const x=X(),p=x.pedA.find(z=>z.id===id);if(!p)return toast("Já resolvido");x.pedA=x.pedA.filter(z=>z!==p);const f=(S.func||[]).find(z=>z.id===p.fid);if(!f)return sv();
 if(ok){f.sal=Math.round(f.sal*(1+p.pct/100));f.moral=Math.min(100,(f.moral||0)+35);fala(f,"Muito obrigado, chefe! Pode contar comigo 🙏")}
 else if(Math.random()<.55){demite(f,"pediu demissão (foi pra concorrência)")}else{f.moral=Math.max(0,(f.moral||0)-5);fala(f,"Tá bom, chefe… vou ficar, mas tô chateado.")}sv()};
function demite(f,motivo){S.func=S.func.filter(z=>z!==f);(S.frota||[]).forEach(v=>{if(v.mot===f.id)v.mot=null});try{log(`👋 ${f.nome} (${CG2[f.cargo]||f.cargo}) ${motivo} – ${nl(f.loja)}`)}catch(e){}}
// ===== 4) contratação por entrevista =====
const NOMES=["Carlos","Ana","José","Maria","Paulo","Juliana","Rafael","Fernanda","Marcos","Patrícia","Diego","Camila","Lucas","Aline","Bruno","Simone","Edson","Rosana","Wellington","Daiane"],SOB=["Silva","Souza","Oliveira","Pereira","Lima","Costa","Rodrigues","Almeida","Nascimento","Araújo","Ferreira","Barbosa"];
const BASE={mot:3800,vend:2400,caixa:1900,ger:5200,mec:3200,est:2100,adm:2600,aux:1700};
function geraCand(){const x=X();if(x.cdD===dia()&&x.cand.length)return;if(x.cand.length>=6&&x.cdD)return;x.cdD=dia();while(x.cand.length<6){const c=pk(Object.keys(BASE)),e=ri(1,5);
 x.cand.push({id:S.nid++,nome:pk(NOMES)+" "+pk(SOB),cargo:c,exp:e,sal:Math.round(BASE[c]*(.85+e*.1)/50)*50,anos:ri(e,e*4),cid:pk(at()).cid,obs:pk(["Muito educado na entrevista","Chegou atrasado","Tem referência boa do último emprego","Ficou nervoso mas parece honesto","Já trabalhou na concorrência","Tem CNH E e curso MOPP","Mora perto da loja","Pediu pra começar só mês que vem"])})}}
W.v55contr=function(id){const x=X(),c=x.cand.find(z=>z.id===id);if(!c)return;const sel=document.getElementById("v55l"+id);const loja=sel?+sel.value:at()[0].id;
 const mod=(S.func||[])[0]||{};const f={id:S.nid++,nome:c.nome,cargo:c.cargo,loja,sal:c.sal,adm:S.simMs,vis:mod.vis?JSON.parse(JSON.stringify(mod.vis)):undefined,moral:75};
 if(c.cargo==="mot")f.v54={exp:c.exp,mult:0};S.func.push(f);x.cand=x.cand.filter(z=>z!==c);try{log(`🤝 Contratado: ${c.nome} (${CG2[c.cargo]}) para ${nl(loja)} – ${R$(c.sal)}`)}catch(e){}sv()};
W.v55disp=function(id){const x=X();x.cand=x.cand.filter(z=>z.id!==id);sv()};
// ===== 5) férias, 13º e atestados =====
function rh(){const x=X(),d=new Date(S.simMs),mk=d.getFullYear()*12+d.getMonth();if(x.rhM==null){x.rhM=mk;return}
 if(x.rhD!==dia()){x.rhD=dia();if(Math.random()<.25&&S.func.length){const f=pk(S.func);const n=ri(1,3);try{log(`🩺 ${f.nome} entregou atestado de ${n} dia(s) – ${nl(f.loja)}`)}catch(e){}f.atest=S.simMs+n*D}}
 if(x.rhM===mk)return;x.rhM=mk;const venc=S.simMs+10*D;
 at().forEach(l=>{const fol=S.func.filter(f=>f.loja===l.id).reduce((a,f)=>a+f.sal,0);if(!fol)return;
  try{addConta(`Férias (1/12 + 1/3) – ${nl(l.id)}`,fol/12*1.333,venc,"Pessoal");S.contas[S.contas.length-1].loja=l.id;
   if(d.getMonth()===11){addConta(`13º salário – ${nl(l.id)}`,fol,venc,"Pessoal");S.contas[S.contas.length-1].loja=l.id}}catch(e){}});
 if(d.getMonth()===11)try{log("🎄 13º salário lançado nas contas de todas as lojas")}catch(e){}}
// ===== 6) fiscalização =====
function fiscal(){const x=X();if(x.fsD===dia())return;x.fsD=dia();if(Math.random()>.035)return;const l=pk(at());const tipo=pk(["trabalho","receita","ibama"]);let ok=true,mot="";
 if(tipo==="ibama"){const eq=S.lg&&S.lg.eq&&S.lg.eq[l.id]||{};if(l.tipo==="loja"&&!eq.coletor){ok=false;mot="sem coletor de óleo usado"}}
 if(tipo==="trabalho"){const ruim=S.func.filter(f=>f.loja===l.id&&(f.moral??70)<25).length;if(ruim>0&&Math.random()<.6){ok=false;mot=`${ruim} funcionário(s) reclamando de condições de trabalho`}}
 if(tipo==="receita"){const atras=S.contas.filter(c=>!c.pago&&c.venc<S.simMs-5*D&&/Imposto|ICMS/.test(c.cat+c.desc)).length;if(atras){ok=false;mot=`${atras} imposto(s) atrasado(s)`}}
 const nm={trabalho:"👷 Fiscal do Trabalho",receita:"🧾 Receita Estadual",ibama:"🌳 Ibama / meio ambiente"}[tipo];
 if(ok){try{log(`${nm} visitou ${nl(l.id)}: tudo certo ✅`)}catch(e){}x.fisc.unshift({t:S.simMs,l:l.id,tipo,ok:1})}
 else{const m=ri(5,60)*1000;paga(l.id,m,`${nm} autuou ${nl(l.id)}: ${mot}`);x.fisc.unshift({t:S.simMs,l:l.id,tipo,ok:0,m,mot})}x.fisc=x.fisc.slice(0,20)}
// ===== 7) fluxo de caixa 30 dias =====
function cardFluxo(){const saldo=Object.values(S.lcx||{}).reduce((a,b)=>a+b,0)+Object.values(S.ecx||{}).reduce((a,b)=>a+b,0);
 const dm=Math.max(1,new Date(S.simMs).getDate());const entra=at().reduce((a,l)=>a+((l.venda&&l.venda.mes)||0)/dm,0)*.35;
 const dias=[];let s=saldo;for(let i=0;i<30;i++){const ini=S.simMs+i*D,fim=ini+D;const sai=S.contas.filter(c=>!c.pago&&c.venc>=ini&&c.venc<fim).reduce((a,c)=>a+c.v,0)+(i===0?S.contas.filter(c=>!c.pago&&c.venc<ini).reduce((a,c)=>a+c.v,0):0);s+=entra-sai;dias.push({sai,s,d:new Date(ini)})}
 const mx=Math.max(1,...dias.map(z=>Math.abs(z.s))),mn=Math.min(...dias.map(z=>z.s));const W_=600,Hh=150,y=v=>Hh/2-(v/mx)*(Hh/2-8);
 const pts=dias.map((z,i)=>`${10+i*(W_-20)/29},${y(z.s)}`).join(" ");
 return `<div class="card"><h3>📈 Fluxo de caixa – próximos 30 dias</h3><p class="muted" style="font-size:12px">Saldo de hoje + lucro médio por dia (${R$(entra)}) − contas a vencer. Linha abaixo do zero = vai faltar dinheiro.</p>
 <svg viewBox="0 0 ${W_} ${Hh}" style="width:100%;height:auto;background:#0a1626;border-radius:10px"><line x1="0" x2="${W_}" y1="${Hh/2}" y2="${Hh/2}" stroke="#ffffff33" stroke-dasharray="4 4"/>${dias.map((z,i)=>z.sai?`<rect x="${6+i*(W_-20)/29}" y="${Hh/2}" width="8" height="${Math.min(Hh/2,z.sai/mx*(Hh/2))}" fill="#ef444488"/>`:"").join("")}<polyline points="${pts}" fill="none" stroke="${mn<0?"#ef4444":"#22c55e"}" stroke-width="3"/></svg>
 <div class="row" style="gap:16px;flex-wrap:wrap;margin-top:8px"><span>Hoje: <b>${R$(saldo)}</b></span><span>Em 30 dias: <b style="color:${dias[29].s<0?"#ef4444":"#22c55e"}">${R$(dias[29].s)}</b></span><span>Pior dia: <b style="color:${mn<0?"#ef4444":"#22c55e"}">${R$(mn)}</b> (${dias.find(z=>z.s===mn).d.toLocaleDateString("pt-BR")})</span></div></div>`}
// ===== 8) promoções =====
W.v55promo=function(){const l=+document.getElementById("v55pl").value,p=+document.getElementById("v55pp").value;const x=X();x.promo=x.promo.filter(z=>z.loja!==l);x.promo.push({loja:l,p,ate:S.simMs+7*D,v0:0});try{log(`🏷️ Promoção de ${p}% por 7 dias em ${nl(l)}`)}catch(e){}sv()};
const oV=W.venda;if(oV&&!oV.__v55){W.venda=function(l){const a=l&&l.venda?+l.venda.dia||0:0;const r=oV.apply(this,arguments);
 try{if(l&&l.venda){const d=(+l.venda.dia||0)-a;const pr=X().promo.find(z=>z.loja===l.id&&z.ate>S.simMs);if(d>0&&pr){const extra=d*pr.p*.03,custo=(d+extra)*pr.p/100;l.venda.dia+=extra;l.venda.mes=(l.venda.mes||0)+extra;S.lcx[l.id]=(S.lcx[l.id]||0)+extra-custo;pr.v0=(pr.v0||0)+d+extra}}}catch(x){}return r};W.venda.__v55=1}
// ===== 9) leilão de caminhões =====
const LEI=[["Scania","R 450 6x2","cavalo",640000],["Volvo","FH 460 6x2","cavalo",620000],["Mercedes-Benz","Actros 2651","cavalo",700000],["VW","Constellation 24.280","rigido",420000],["Mercedes-Benz","Atego 2430","rigido",390000],["DAF","XF 480","cavalo",650000],["Iveco","Tector 240E30","rigido",380000],["Volvo","VM 330","rigido",450000]];
const placa=()=>{const L="ABCDEFGHJKLMNPRSTUVWXYZ";return L[ri(0,22)]+L[ri(0,22)]+L[ri(0,22)]+ri(0,9)+L[ri(0,22)]+ri(10,99)};
function geraLeil(){const x=X();x.leil=x.leil.filter(z=>z.ate>S.simMs);if(x.leil.length>=4||x.lD===dia())return;x.lD=dia();if(Math.random()<.5)return;const m=pk(LEI),ano=ri(2014,2022),km=ri(250,900)*1000;const novo=m[3],val=Math.round(novo*Math.max(.3,1-(2026-ano)*.07)/1000)*1000,lance=Math.round(val*(.6+Math.random()*.2)/1000)*1000;
 x.leil.push({id:S.nid++,marca:m[0],mod:m[1],tipo:m[2],ano,km,val,lance,ate:S.simMs+3*D,estado:pk(["bom","regular","precisa de revisão","ótimo, pneus novos"])})}
W.v55arr=function(id){const x=X(),o=x.leil.find(z=>z.id===id);if(!o)return;x.leil=x.leil.filter(z=>z!==o);if(Math.random()<.3){try{log(`🔨 Você perdeu o leilão do ${o.marca} ${o.mod} ${o.ano} – outro comprador deu lance maior`)}catch(e){}toast("Perdeu o leilão 😕");return sv()}
 paga(tr(),o.lance,`🔨 Arrematou ${o.marca} ${o.mod} ${o.ano} (${o.km.toLocaleString("pt-BR")} km) no leilão`);S.frota.push({id:S.nid++,marca:o.marca,mod:o.mod,tipo:o.tipo,cap:o.tipo==="cavalo"?1:14,ano:o.ano,placa:placa(),km:o.km,val:o.val,status:"Garagem",base:tr(),kmO:o.estado.includes("revisão")?32000:5000,kmP:o.estado.includes("pneus novos")?0:70000});toast("Arrematado! Já está na garagem");sv()};
W.v55vend=function(id){const v=S.frota.find(z=>z.id===id);if(!v)return;if(v.status&&v.status!=="Garagem")return toast("Só dá pra vender caminhão parado na garagem");const p=Math.round((v.val||200000)*Math.max(.35,1-(2026-(v.ano||2018))*.06)*.85/1000)*1000;
 if(!confirmV(id,p))return;S.frota=S.frota.filter(z=>z!==v);ganha(tr(),p,`💵 Vendeu ${v.marca||""} ${v.mod} ${v.placa}`);sv()};
const conf={};function confirmV(id,p){if(conf[id]&&Date.now()-conf[id]<6000){delete conf[id];return true}conf[id]=Date.now();toast(`Oferta: ${R$(p)}. Toque de novo em Vender pra confirmar`);return false}
// ===== 10) ranking =====
function ranking(){const vs=(S.func||[]).filter(f=>["vend","caixa","ger"].includes(f.cargo)).map(f=>{const l=S.lojas[f.loja];const base=((l&&l.venda&&l.venda.mes)||0)/Math.max(1,S.func.filter(z=>z.loja===f.loja&&["vend","caixa","ger"].includes(z.cargo)).length);return{f,v:base*(.6+((f.id*7919)%100)/100*.4+(f.moral||70)/250)}}).sort((a,b)=>b.v-a.v).slice(0,5);
 const ms=(S.func||[]).filter(f=>f.cargo==="mot").map(f=>{const n=f.v54||{exp:3,mult:0};const v=S.frota.find(z=>z.mot===f.id);return{f,v:n.exp*20-n.mult*8+(v?(v.km||0)%5000/250:0)}}).sort((a,b)=>b.v-a.v).slice(0,5);return{vs,ms}}
W.v55prem=function(fid){const f=S.func.find(z=>z.id===fid);if(!f)return;const x=X();const mk=new Date(S.simMs).getMonth();x.prem=x.prem||{};if(x.prem[fid]===mk)return toast("Já premiado este mês");x.prem[fid]=mk;paga(f.loja,1000,`🏅 Prêmio de destaque do mês para ${f.nome}`);f.moral=Math.min(100,(f.moral||70)+15);S.func.filter(z=>z.loja===f.loja&&z!==f).forEach(z=>z.moral=Math.min(100,(z.moral||70)+3));fala(f,"Caramba chefe, prêmio de destaque?! Muito obrigado, vou dar mais ainda! 🏅");sv()};
// ===== telas =====
const est=n=>"★".repeat(n)+"☆".repeat(5-n);
function cardEquipe(){const x=X(),{vs,ms}=ranking();const opt=at().map(l=>`<option value="${l.id}">${esc(nl(l.id))}</option>`).join("");
 return `<div class="card"><h3>🏅 Ranking do mês</h3><div class="row" style="gap:20px;flex-wrap:wrap;align-items:flex-start"><div style="flex:1;min-width:240px"><b>Vendedores</b>${vs.map((r,i)=>`<div style="padding:4px 0">${["🥇","🥈","🥉","4º","5º"][i]} ${esc(r.f.nome)} <span class="muted">– ${esc(nl(r.f.loja))} · ${R$(r.v)}</span> <button class="b s" onclick="v55prem(${r.f.id})">Prêmio R$1 mil</button></div>`).join("")||'<div class="muted">—</div>'}</div>
 <div style="flex:1;min-width:240px"><b>Motoristas</b>${ms.map((r,i)=>`<div style="padding:4px 0">${["🥇","🥈","🥉","4º","5º"][i]} ${esc(r.f.nome)} <span class="muted">– ${est((r.f.v54||{exp:3}).exp)} · ${(r.f.v54||{mult:0}).mult} multa(s)</span> <button class="b s" onclick="v55prem(${r.f.id})">Prêmio R$1 mil</button></div>`).join("")||'<div class="muted">—</div>'}</div></div></div>
 <div class="card"><h3>🧑‍💼 Candidatos (entrevistas)</h3><div class="tw"><table><tr><th>Nome</th><th>Vaga</th><th>Experiência</th><th>Pretensão</th><th>Entrevista</th><th>Loja</th><th></th></tr>${x.cand.map(c=>`<tr><td>${esc(c.nome)}<br><span class="muted" style="font-size:11px">${esc(c.cid)}</span></td><td>${CG2[c.cargo]}</td><td style="color:#f5b301">${est(c.exp)} <span class="muted">${c.anos} anos</span></td><td>${R$(c.sal)}</td><td class="muted" style="font-size:12px">${esc(c.obs)}</td><td><select id="v55l${c.id}">${opt.replace(`value="${(at().find(l=>l.cid===c.cid)||at()[0]).id}"`,`value="${(at().find(l=>l.cid===c.cid)||at()[0]).id}" selected`)}</select></td><td style="white-space:nowrap"><button class="b g" onclick="v55contr(${c.id})">Contratar</button> <button class="b s" onclick="v55disp(${c.id})">✕</button></td></tr>`).join("")}</table></div><p class="muted" style="font-size:12px">Novos candidatos aparecem todo dia. Experiência alta = menos erro, mas pede salário maior.</p></div>`}
function cardFrota(){const x=X();return `<div class="card"><h3>🛡️ Segurança da frota</h3><div class="row" style="gap:10px;flex-wrap:wrap"><button class="b ${x.seg.frota?"s":"g"}" onclick="v55seg('frota')">${x.seg.frota?"✅ Seguro da frota ativo":"Contratar seguro da frota"}</button><button class="b ${x.esc?"s":"g"}" onclick="v55esc()">${x.esc?"✅ Escolta armada ligada":"Ligar escolta armada (R$450/dia por caminhão)"}</button></div>
 <p class="muted" style="font-size:12px;margin-top:6px">Roubo de carga acontece mais à noite (22h–5h). Rastreador corta o risco pela metade e ajuda a recuperar 70% das cargas. Escolta corta 80%. Seguro cobre 80% do prejuízo (${R$(caminhoes().reduce((a,v)=>a+(v.val||300000),0)*.025/12)}/mês).</p>
 <div class="tw"><table><tr><th>Caminhão</th><th>Rastreador</th><th>Venda</th></tr>${caminhoes().map(v=>`<tr><td>${esc(v.mod)} ${v.placa} <span class="muted">${v.ano||""}</span></td><td>${v.rast?"✅":`<button class="b s" onclick="v55rast(${v.id})">Instalar R$3,5 mil</button>`}</td><td><button class="b s" onclick="v55vend(${v.id})">Vender</button></td></tr>`).join("")}</table></div></div>
 <div class="card"><h3>🔨 Leilão de caminhões usados</h3>${x.leil.filter(z=>z.ate>S.simMs).map(o=>`<div style="padding:8px 0;border-bottom:1px solid #ffffff14"><b>${o.marca} ${o.mod}</b> ${o.ano} · ${o.km.toLocaleString("pt-BR")} km · estado: ${o.estado}<br><span class="muted">Tabela ${R$(o.val)} · lance mínimo <b style="color:#22c55e">${R$(o.lance)}</b> · termina ${new Date(o.ate).toLocaleDateString("pt-BR")}</span><br><button class="b g" style="margin-top:6px" onclick="v55arr(${o.id})">Dar lance</button></div>`).join("")||`<p class="muted">Nenhum leilão agora. Aparecem novos a cada poucos dias.</p>`}</div>`}
function cardChefe(){const x=X();const ls=at().filter(l=>l.tipo!=="transp");const pr=x.promo.filter(z=>z.ate>S.simMs);
 return `<div class="card"><h3>🏷️ Promoções</h3><div class="row" style="gap:8px;flex-wrap:wrap"><select id="v55pl">${ls.map(l=>`<option value="${l.id}">${esc(nl(l.id))}</option>`).join("")}</select><select id="v55pp">${[5,10,15,20].map(p=>`<option value="${p}">${p}% off</option>`).join("")}</select><button class="b g" onclick="v55promo()">Lançar por 7 dias</button></div>
 <p class="muted" style="font-size:12px">Cada 1% de desconto aumenta as vendas em ~3%, mas a margem cai.</p>${pr.map(p=>`<div>🏷️ ${esc(nl(p.loja))}: ${p.p}% off até ${new Date(p.ate).toLocaleDateString("pt-BR")} · vendido na promo ${R$(p.v0||0)}</div>`).join("")}</div>
 <div class="card"><h3>🛡️ Seguro das lojas</h3><button class="b ${x.seg.lojas?"s":"g"}" onclick="v55seg('lojas')">${x.seg.lojas?"✅ Ativo":"Contratar"}</button> <span class="muted" style="font-size:12px">R$ 1.400/mês por loja. Cobre 90% de incêndio, alagamento e sinistros.</span></div>
 ${x.fisc.length?`<div class="card"><h3>🕵️ Fiscalizações</h3>${x.fisc.slice(0,8).map(f=>`<div style="font-size:13px">${new Date(f.t).toLocaleDateString("pt-BR")} · ${esc(nl(f.l))} · ${f.tipo} · ${f.ok?"✅ sem problema":`❌ multa ${R$(f.m)} (${esc(f.mot)})`}</div>`).join("")}<p class="muted" style="font-size:12px">Dica: coletor de óleo usado evita multa do Ibama; impostos em dia evitam a Receita; equipe motivada evita o fiscal do trabalho.</p></div>`:""}`}
let inst=false;function instala(){if(inst||typeof V==="undefined")return;inst=true;const w=(k,fn,antes)=>{if(!V[k])return;const o=V[k];V[k]=function(){const a=o.apply(this,arguments);let c="";try{c=fn()}catch(e){console.warn(e)}return antes?c+a:a+c}};
 w("equipe",cardEquipe,true);w("frota",cardFrota,false);w("chefe",cardChefe,false);w("contas",cardFluxo,true);try{render()}catch(e){}}
setTimeout(instala,11000);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;seguroDia();roubo();escoltaDia();insatisfeitos();geraCand();rh();fiscal();geraLeil()}catch(e){console.warn("v55",e)}},1000);
})();
