// v57: vendedor externo, garantia/devolução, reputação, curso de vendas, reforma, previsão 3 meses, patrocínio, painel de dívidas, modo férias
(function(){const W=window,H=36e5,D=24*H;const pk=a=>a[Math.random()*a.length|0],ri=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
const at=()=>S.lojas.filter(l=>!l.encerrada),lojas=()=>at().filter(l=>l.tipo!=="transp");
const sv=()=>{try{save()}catch(e){}try{render()}catch(e){}};
const dia=()=>new Date(S.simMs).toDateString();
const paga=(id,v,d)=>{S.lcx[id]=(S.lcx[id]||0)-v;try{log(`${d} – ${nl(id)} – ${R$(v)}`)}catch(e){}};
const fala=(f,t)=>{try{const th=novaThread("papo",f.id,`${f.nome}`,"💬");th.fid=f.id;msgAdd(th,"ele",t)}catch(e){}};
const ger=id=>(S.func||[]).find(f=>f.loja===id&&f.cargo==="ger")||(S.func||[]).find(f=>f.loja===id);
function X(){S.v57=S.v57||{};const x=S.v57;["rep","coment","trein","ref","obra","pat","ext"].forEach(k=>x[k]=x[k]||{});x.gar=x.gar||[];x.fer=x.fer||null;return x}
// ===== 3) reputação =====
function rep(id){const x=X();if(x.rep[id]==null){x.rep[id]=+(3.6+Math.random()*.9).toFixed(2)}return x.rep[id]}
function mexe(id,d,txt,est){const x=X();x.rep[id]=Math.max(1,Math.min(5,rep(id)+d));if(txt){x.coment[id]=x.coment[id]||[];x.coment[id].unshift({t:S.simMs,txt,est:est||Math.round(rep(id))});x.coment[id]=x.coment[id].slice(0,12)}}
const BOM=["Atendimento nota 10, trocaram meu óleo rapidinho!","Preço justo e o pessoal entende do assunto.","Sempre compro aqui, nunca tive problema.","Loja limpa, organizada e tem tudo.","O vendedor me explicou direitinho qual óleo usar.","Fui bem atendido mesmo chegando quase fechando."],RUIM=["Demorou demais pra me atender.","Achei o preço meio salgado.","Faltou o filtro que eu precisava.","Atendente com cara fechada.","Fila enorme na troca de óleo."];
function reviews(){const x=X();if(x.rvD===dia())return;x.rvD=dia();lojas().forEach(l=>{if(Math.random()>.35)return;const f=(S.func||[]).filter(z=>z.loja===l.id);const mor=f.length?f.reduce((a,z)=>a+(z.moral??70),0)/f.length:70;
 const bom=Math.random()<.45+mor/200+(x.trein[l.id]||0)*.05+Object.keys(x.ref[l.id]||{}).length*.04;if(bom)mexe(l.id,.04,pk(BOM),5-(Math.random()<.3?1:0));else mexe(l.id,-.06,pk(RUIM),ri(1,2))})}
// ===== efeitos nas vendas =====
const REF={pint:["🎨 Pintura nova",15000,.2,.03],fach:["🏗️ Fachada nova com letreiro",45000,.3,.06],ar:["❄️ Ar-condicionado no salão",22000,.2,.03],esp:["🛋️ Sala de espera + banheiro",18000,.2,.02]};
const PAT={time:["⚽ Patrocínio do time local",8000,.06,"mês"],radio:["📻 Propaganda na rádio",4000,.03,"mês"],rodeio:["🤠 Rodeio / festa da cidade",25000,.15,"15 dias"]};
function fator(l){const x=X();let f=(rep(l.id)-4)*.08+(x.trein[l.id]||0)*.05;Object.keys(x.ref[l.id]||{}).forEach(k=>f+=REF[k][3]);if(x.obra[l.id]>S.simMs)f-=.3;
 const p=x.pat[l.cid]||{};Object.keys(p).forEach(k=>{if(p[k]>S.simMs)f+=PAT[k][2]});return f}
const oV=W.venda;if(oV&&!oV.__v57){W.venda=function(l){const a=l&&l.venda?+l.venda.dia||0:0;const r=oV.apply(this,arguments);
 try{if(l&&l.venda){const d=(+l.venda.dia||0)-a;if(d>0){const f=fator(l);if(f){const ex=d*f;l.venda.dia+=ex;l.venda.mes=(l.venda.mes||0)+ex;S.lcx[l.id]=(S.lcx[l.id]||0)+ex*.4}}}}catch(e){}return r};W.venda.__v57=1}
// ===== 4) curso de vendas =====
W.v57trein=function(id){const x=X(),n=x.trein[id]||0;if(n>=3)return toast("Equipe já fez os 3 cursos");paga(id,6000,`🎓 Curso de vendas nível ${n+1} pra equipe`);x.trein[id]=n+1;mexe(id,.1);(S.func||[]).filter(f=>f.loja===id).forEach(f=>f.moral=Math.min(100,(f.moral||70)+5));sv()};
// ===== 5) reforma =====
W.v57ref=function(id,k){const x=X();x.ref[id]=x.ref[id]||{};if(x.ref[id][k])return toast("Já feito");const r=REF[k];paga(id,r[1],`${r[0]} (obra de 3 dias)`);x.ref[id][k]=S.simMs;x.obra[id]=S.simMs+3*D;mexe(id,r[2],"Loja ficou linda depois da reforma! 👏",5);sv()};
// ===== 8) patrocínio =====
W.v57pat=function(k){const c=document.getElementById("v57pc").value;const x=X();x.pat[c]=x.pat[c]||{};const p=PAT[k];const dur=k==="rodeio"?15*D:30*D;const l=lojas().find(z=>z.cid===c)||lojas()[0];
 paga(l.id,p[1],`${p[0]} em ${c}`);x.pat[c][k]=Math.max(x.pat[c][k]||0,S.simMs)+dur;if(k!=="rodeio")x.pat[c][k+"_r"]=1;lojas().filter(z=>z.cid===c).forEach(z=>mexe(z.id,.05));sv()};
W.v57patx=function(c,k){const x=X();if(x.pat[c]){delete x.pat[c][k+"_r"]}toast("Renovação automática cancelada");sv()};
function patRenova(){const x=X();Object.keys(x.pat).forEach(c=>{Object.keys(PAT).forEach(k=>{if(k==="rodeio")return;const p=x.pat[c];if(p[k+"_r"]&&p[k]&&p[k]<=S.simMs){const l=lojas().find(z=>z.cid===c);if(!l)return;paga(l.id,PAT[k][1],`${PAT[k][0]} em ${c} (renovação)`);p[k]=S.simMs+30*D}})})}
// ===== 1) vendedor externo =====
const CLI=["Fazenda Santa Rita","Fazenda Bom Jesus","Oficina do Nego","Auto Center Rota","Transportadora Irmãos Silva","Mecânica Diesel Norte","Fazenda Primavera","Agropecuária São José","Posto Trevo","Retífica Central","Madeireira Vale","Construtora Horizonte","Usina de Asfalto","Fazenda Tradição","Pátio de Máquinas Agro"];
function externo(){const x=X();if(x.exD===dia())return;const h=new Date(S.simMs).getHours();if(h<17)return;x.exD=dia();
 (S.func||[]).filter(f=>f.cargo==="vext").forEach(f=>{const l=S.lojas[f.loja];if(!l||l.encerrada)return;const n=ri(3,6);const vis=[];let tot=0;
  for(let i=0;i<n;i++){const c=pk(CLI);const fechou=Math.random()<.45+(f.moral||70)/400;const v=fechou?ri(2,30)*1000:0;tot+=v;vis.push({c,v})}
  if(tot){l.venda.dia=(l.venda.dia||0)+tot;l.venda.mes=(l.venda.mes||0)+tot;S.lcx[l.id]=(S.lcx[l.id]||0)+tot*.35}
  x.ext[f.id]={t:S.simMs,vis,tot};try{log(`🚗 ${f.nome} (vendedor externo) visitou ${n} clientes e fechou ${R$(tot)} pra ${nl(l.id)}`)}catch(e){}})}
W.v57vext=function(){const id=+document.getElementById("v57vl").value;const nm=pk(["Rogério","Valdir","Cléber","Sueli","Adriano","Kátia","Reinaldo","Elaine"])+" "+pk(["Moura","Teixeira","Cardoso","Batista","Ribeiro","Gomes"]);const mod=(S.func||[])[0]||{};
 S.func.push({id:S.nid++,nome:nm,cargo:"vext",loja:id,sal:3400,adm:S.simMs,vis:mod.vis?JSON.parse(JSON.stringify(mod.vis)):undefined,moral:80});try{log(`🤝 Contratado: ${nm} (Vendedor externo) para ${nl(id)} – ${R$(3400)} + comissão`)}catch(e){}sv()};
// ===== 2) garantia / devolução =====
const PROD=["óleo 15W40 com lote vazando","filtro de óleo que veio amassado","bateria que não segurou carga","graxa com embalagem estourada","óleo sintético que o cliente diz ter dado barulho no motor","pneu com bolha","palheta de para-brisa quebrada"];
function garantia(){const x=X();if(x.gaD===dia())return;x.gaD=dia();if(Math.random()>.3)return;const l=pk(lojas());const g=ger(l.id);if(!g)return;const v=ri(15,300)*10;const p={id:S.nid++,loja:l.id,prod:pk(PROD),v,cli:pk(["Seu Antônio","Dona Cida","Marcos (taxista)","Fazenda Boa Vista","Oficina do Zé","Carla"])};x.gar.push(p);x.gar=x.gar.slice(-20);
 fala(g,`Chefe, o cliente <b>${p.cli}</b> voltou reclamando: ${p.prod}. Quer trocar (${R$(v)}). Ele tá bem bravo, ameaçou falar mal no Google. O que eu faço?<br><button class="b g" onclick="v57gar(${p.id},1)">Trocar / devolver dinheiro</button> <button class="b s" onclick="v57gar(${p.id},0)">Negar</button>`)}
W.v57gar=function(id,ok){const x=X(),p=x.gar.find(z=>z.id===id);if(!p||p.r)return toast("Já resolvido");p.r=ok?"trocou":"negou";if(ok){paga(p.loja,p.v,`🔁 Garantia: troca para ${p.cli}`);mexe(p.loja,.08,`Tive um problema mas trocaram na hora, sem enrolação. Recomendo!`,5)}else mexe(p.loja,-.25,`Comprei produto com defeito e não quiseram trocar. Nunca mais volto!`,1);toast(ok?"Trocado, cliente satisfeito":"Negado, reputação caiu");sv()};
// ===== 9) dívidas =====
W.v57ant=function(i){const f=(S.fin||[])[i];if(!f)return;const rest=(f.n-f.pagas)*f.parc;const ab=S.contas.filter(c=>!c.pago&&c.desc.includes(f.desc)&&/Parcela/.test(c.desc));const tot=(rest+ab.reduce((a,c)=>a+c.v,0))*.9;
 const id=+document.getElementById("v57dl").value;if(!confirm(`Quitar ${f.desc} por ${R$(tot)} (10% de desconto)? Sai do caixa de ${nl(id)}.`))return;paga(id,tot,`✅ Financiamento quitado: ${f.desc}`);f.pagas=f.n;ab.forEach(c=>{c.pago=true;c.forma="Quitação"});sv()};
function cardDiv(){const fin=(S.fin||[]).map((f,i)=>({f,i,rest:(f.n-f.pagas)*f.parc+S.contas.filter(c=>!c.pago&&c.desc.includes(f.desc)&&/Parcela/.test(c.desc)).reduce((a,c)=>a+c.v,0)})).filter(z=>z.rest>1);
 const emp=S.contas.filter(c=>!c.pago&&c.cat==="Empréstimo");const empT=emp.reduce((a,c)=>a+c.v,0);const venc=S.contas.filter(c=>!c.pago&&c.venc<S.simMs);const tot=fin.reduce((a,z)=>a+z.rest,0)+empT;
 const mes=fin.reduce((a,z)=>a+z.f.parc,0)+emp.filter(c=>c.venc<S.simMs+30*D).reduce((a,c)=>a+c.v,0);
 return `<div class="card"><h3>📉 Painel de dívidas</h3><div class="row" style="gap:18px;flex-wrap:wrap"><span>Total devendo: <b style="color:#ef4444">${R$(tot)}</b></span><span>Parcelas por mês: <b>${R$(mes)}</b></span><span>Contas vencidas: <b style="color:${venc.length?"#ef4444":"#22c55e"}">${venc.length} (${R$(venc.reduce((a,c)=>a+c.v,0))})</b></span></div>
 <div class="tw" style="margin-top:8px"><table><tr><th>Dívida</th><th>Banco</th><th>Parcelas</th><th>Parcela</th><th>Falta pagar</th><th></th></tr>
 ${fin.map(z=>`<tr><td>${esc(z.f.desc)}</td><td>${esc(z.f.banco||"")}</td><td>${z.f.pagas}/${z.f.n}</td><td>${R$(z.f.parc)}</td><td>${R$(z.rest)}</td><td><button class="b g" onclick="v57ant(${z.i})">Quitar −10%</button></td></tr>`).join("")}
 ${empT?`<tr><td>Empréstimos (capital de giro)</td><td>Banco do Brasil</td><td>${emp.length} em aberto</td><td>${R$(emp[0]?emp[0].v:0)}</td><td>${R$(empT)}</td><td>${typeof quitarEmp==="function"?`<button class="b g" onclick="quitarEmp()">Quitar −8%</button>`:""}</td></tr>`:""}
 ${!fin.length&&!empT?`<tr><td colspan="6" class="muted">Nenhuma dívida bancária 🎉</td></tr>`:""}</table></div>
 <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap"><span class="muted">Pagar quitação com o caixa de:</span><select id="v57dl">${at().map(l=>`<option value="${l.id}">${esc(nl(l.id))} (${R$((S.lcx||{})[l.id]||0)})</option>`).join("")}</select></div></div>`}
// ===== 7) previsão 3 meses =====
function prev(l){const d=new Date(S.simMs),dm=Math.max(1,d.getDate()),fim=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();const base=((l.venda&&l.venda.mes)||0)/dm*fim;const out=[];
 for(let k=1;k<=3;k++){const m=(d.getMonth()+k)%12+1;let f=1;let uf="";try{uf=CID[l.cid].uf}catch(e){}if(uf==="MT"&&((m>=1&&m<=4)||(m>=6&&m<=8)))f+=.25;if(m===12)f+=.12;if(m===2)f-=.08;if(m>=11||m<=4)f-=.04;f+=fator(l)*.5;out.push({m,v:base*f})}return{base,out}}
function cardPrev(){const MS=["","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];const ps=lojas().map(l=>({l,...prev(l)}));const mx=Math.max(1,...ps.flatMap(p=>p.out.map(o=>o.v)));const tot=[0,1,2].map(i=>ps.reduce((a,p)=>a+p.out[i].v,0));
 return `<div class="card"><h3>🔮 Previsão de vendas – próximos 3 meses</h3><p class="muted" style="font-size:12px">Baseada no ritmo deste mês, época do ano (safra, chuva, Natal), reputação, reformas e patrocínios. Grupo: ${tot.map((v,i)=>`<b>${MS[ps[0]?ps[0].out[i].m:1]} ${R$(v)}</b>`).join(" · ")}</p>
 <div class="tw"><table><tr><th>Loja</th>${(ps[0]?ps[0].out:[]).map(o=>`<th>${MS[o.m]}</th>`).join("")}</tr>${ps.map(p=>`<tr><td>${esc(nl(p.l.id))}</td>${p.out.map(o=>`<td><div style="display:flex;align-items:center;gap:6px"><div style="height:8px;width:${Math.round(o.v/mx*80)}px;background:${o.v>=p.base?"#22c55e":"#f5b301"};border-radius:4px"></div>${R$(o.v)}</div></td>`).join("")}</tr>`).join("")}</table></div></div>`}
// ===== 10) modo férias =====
W.v57ferias=function(){const x=X();if(x.fer&&x.fer.on){x.fer.on=0;x.fer.vol=S.simMs;x.fer.cx1=cxT();try{log(`🏖️ Você voltou das férias. Relatório pronto na Sala do Chefe.`)}catch(e){}return sv()}
 const g=(S.func||[]).find(f=>f.cargo==="ger"&&S.lojas[f.loja]&&S.lojas[f.loja].emp==="LP")||(S.func||[]).find(f=>f.cargo==="ger");x.fer={on:1,ini:S.simMs,quem:g?g.nome:"Gerente-geral",dec:[],cx0:cxT(),v0:lojas().reduce((a,l)=>a+((l.venda&&l.venda.mes)||0),0)};try{log(`🏖️ Você saiu de férias. ${x.fer.quem} assumiu como gerente-geral.`)}catch(e){}sv()};
const cxT=()=>Object.values(S.lcx||{}).reduce((a,b)=>a+b,0)+Object.values(S.ecx||{}).reduce((a,b)=>a+b,0);
function gerente(){const x=X(),F=x.fer;if(!F||!F.on)return;const k=Math.floor(S.simMs/H);if(F.h===k)return;F.h=k;const dec=t=>{F.dec.push({t:S.simMs,x:t});F.dec=F.dec.slice(-80)};
 try{(S.lg&&S.lg.ped||[]).filter(p=>p.st==="pend").forEach(p=>{if(Math.random()<.7){W.v52ped(p.id,1);dec(`Aprovou os equipamentos pedidos por ${p.quem} (${nl(p.loja)})`)}else{W.v52ped(p.id,0);dec(`Recusou equipamentos pedidos por ${p.quem} pra economizar`)}})}catch(e){}
 try{(S.v55&&S.v55.pedA||[]).slice().forEach(p=>{const ok=p.pct<=15;W.v55aum(p.id,ok?1:0);const f=(S.func||[]).find(z=>z.id===p.fid);dec(`${ok?"Deu":"Negou"} aumento de ${p.pct}% ${f?"pra "+f.nome:""}`)})}catch(e){}
 try{(S.v54&&S.v54.rival||[]).filter(r=>!r.resp&&r.ate>S.simMs).forEach(r=>{W.v54riv(r.id,"mkt");dec(`Fez campanha de R$ 15 mil contra a ${r.nome} em ${nl(r.loja)}`)})}catch(e){}
 try{(S.v54&&S.v54.ofe||[]).slice().forEach(o=>{const ok=o.desc<=8;W.v54b2b(o.id,ok?1:0);dec(`${ok?"Fechou":"Recusou"} contrato com ${o.nome} (${o.desc}% de desconto)`)})}catch(e){}
 try{(S.v56&&S.v56.ofr||[]).slice().forEach(o=>{W.v56fr(o.id,1);dec(`Vendeu franquia em ${o.cid} pra ${o.quem} (${R$(o.taxa)})`)})}catch(e){}
 try{x.gar.filter(g=>!g.r).forEach(g=>{W.v57gar(g.id,1);dec(`Trocou produto com defeito de ${g.cli} (${nl(g.loja)})`)})}catch(e){}}
function cardFerias(){const x=X(),F=x.fer;const dur=F?((F.on?S.simMs:F.vol)-F.ini)/D:0;
 return `<div class="card"><div class="row sb" style="flex-wrap:wrap;gap:8px"><h3 style="margin:0">🏖️ Modo férias</h3><button class="b ${F&&F.on?"r":"g"}" onclick="v57ferias()">${F&&F.on?"Voltar das férias":"Sair de férias"}</button></div>
 <p class="muted" style="font-size:12px;margin-top:6px">${F&&F.on?`Você está de férias há ${dur.toFixed(1)} dia(s). <b>${esc(F.quem)}</b> está tomando as decisões: aprova pedidos, responde concorrentes, fecha contratos bons e troca produtos com defeito.`:"O gerente-geral assume e decide tudo sozinho enquanto você está fora. Quando voltar, recebe o relatório."}</p>
 ${F&&!F.on&&F.dec?`<div style="margin-top:8px"><b>Relatório das férias (${dur.toFixed(1)} dias):</b> caixa ${R$(F.cx0)} → ${R$(F.cx1)} (<b style="color:${F.cx1>=F.cx0?"#22c55e":"#ef4444"}">${F.cx1>=F.cx0?"+":""}${R$(F.cx1-F.cx0)}</b>)${F.dec.length?F.dec.slice().reverse().map(d=>`<div style="font-size:13px">• ${new Date(d.t).toLocaleString("pt-BR",{day:"2-digit",hour:"2-digit",minute:"2-digit"})} – ${esc(d.x)}</div>`).join(""):`<div class="muted">Nenhuma decisão importante foi necessária.</div>`}</div>`:""}
 ${F&&F.on&&F.dec.length?`<div style="margin-top:6px">${F.dec.slice(-5).reverse().map(d=>`<div style="font-size:12px" class="muted">• ${esc(d.x)}</div>`).join("")}</div>`:""}</div>`}
// ===== telas =====
const est=n=>{const c=Math.round(n);return "★".repeat(c)+"☆".repeat(5-c)};
function cardLoja(){let l;try{l=S.lojas[lojaSel]}catch(e){}if(!l||l.encerrada||l.tipo==="transp")return"";const x=X();const r=rep(l.id),cm=(x.coment[l.id]||[]).slice(0,5),tr=x.trein[l.id]||0,rf=x.ref[l.id]||{};
 return `<div class="card"><h3>⭐ Reputação – ${esc(nl(l.id))}</h3><div style="font-size:26px;color:#f5b301">${est(r)} <span style="font-size:18px;color:inherit">${r.toFixed(1).replace(".",",")}</span></div><p class="muted" style="font-size:12px">Nota alta traz mais cliente (cada estrela acima de 4 = +8% nas vendas).</p>
 ${cm.map(c=>`<div style="font-size:13px;padding:4px 0;border-bottom:1px solid #ffffff10"><span style="color:#f5b301">${"★".repeat(c.est)}</span> "${esc(c.txt)}" <span class="muted" style="font-size:11px">${new Date(c.t).toLocaleDateString("pt-BR")}</span></div>`).join("")||`<p class="muted">Sem avaliações ainda.</p>`}</div>
 <div class="card"><h3>🎓 Curso de vendas da equipe</h3><p>Nível ${tr}/3 ${tr?`(+${tr*5}% no ticket médio)`:""}</p><button class="b g" onclick="v57trein(${l.id})" ${tr>=3?"disabled":""}>${tr>=3?"Completo":"Fazer curso nível "+(tr+1)+" – R$ 6 mil"}</button></div>
 <div class="card"><h3>🏗️ Reforma da loja</h3>${x.obra[l.id]>S.simMs?`<p style="color:#f5b301">🚧 Em obra até ${new Date(x.obra[l.id]).toLocaleDateString("pt-BR")} (vendas −30%)</p>`:""}<div class="tw"><table>${Object.entries(REF).map(([k,v])=>`<tr><td>${v[0]}</td><td>${R$(v[1])}</td><td>+${Math.round(v[3]*100)}% vendas</td><td>${rf[k]?"✅ feito":`<button class="b g" onclick="v57ref(${l.id},'${k}')">Fazer</button>`}</td></tr>`).join("")}</table></div></div>`}
function cardEquipe(){const x=X();const ve=(S.func||[]).filter(f=>f.cargo==="vext");
 return `<div class="card"><h3>🚗 Vendedores externos</h3><p class="muted" style="font-size:12px">Visitam fazendas, oficinas e transportadoras da região todo dia e voltam com pedidos (relatório às 17h).</p>
 ${ve.map(f=>{const e=x.ext[f.id];return `<div style="padding:6px 0;border-bottom:1px solid #ffffff14"><b>${esc(f.nome)}</b> – ${esc(nl(f.loja))}${e?` · último dia: <b>${R$(e.tot)}</b><br><span class="muted" style="font-size:12px">${e.vis.map(v=>`${esc(v.c)} ${v.v?"✅ "+R$(v.v):"❌"}`).join(" · ")}</span>`:" · <span class='muted'>ainda sem rota</span>"}</div>`}).join("")||`<p class="muted">Nenhum vendedor externo.</p>`}
 <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap"><select id="v57vl">${lojas().map(l=>`<option value="${l.id}">${esc(nl(l.id))}</option>`).join("")}</select><button class="b g" onclick="v57vext()">Contratar vendedor externo (R$ 3.400)</button></div></div>`}
function cardChefe(){const x=X();const cids=[...new Set(lojas().map(l=>l.cid))];
 const ativos=Object.entries(x.pat).flatMap(([c,p])=>Object.keys(PAT).filter(k=>p[k]>S.simMs).map(k=>`<div style="font-size:13px">${PAT[k][0]} em <b>${esc(c)}</b> até ${new Date(p[k]).toLocaleDateString("pt-BR")} ${p[k+"_r"]?`(renova sozinho) <button class="b s" onclick="v57patx('${c.replace(/'/g,"\\'")}','${k}')">Cancelar</button>`:""}</div>`));
 return cardFerias()+`<div class="card"><h3>🎪 Patrocínios</h3><div class="row" style="gap:8px;flex-wrap:wrap"><select id="v57pc">${cids.map(c=>`<option>${esc(c)}</option>`).join("")}</select>${Object.entries(PAT).map(([k,v])=>`<button class="b g" onclick="v57pat('${k}')">${v[0]} – ${R$(v[1])}${v[3]==="mês"?"/mês":""}</button>`).join("")}</div>
 <p class="muted" style="font-size:12px">Aumenta as vendas de todas as suas lojas na cidade: time +6%, rádio +3%, rodeio +15% por 15 dias. Sai do caixa da loja da cidade.</p>${ativos.join("")}</div>`}
let inst=false;function instala(){if(inst||typeof V==="undefined")return;inst=true;const w=(k,fn,antes)=>{if(!V[k])return;const o=V[k];V[k]=function(){const a=o.apply(this,arguments);let c="";try{c=fn()}catch(e){console.warn(e)}return antes?c+a:a+c}};
 w("loja",cardLoja,false);w("equipe",cardEquipe,false);w("chefe",cardChefe,true);w("credito",cardDiv,true);w("painel",cardPrev,false);try{render()}catch(e){}}
setTimeout(instala,12000);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;lojas().forEach(l=>rep(l.id));reviews();patRenova();externo();garantia();gerente()}catch(e){console.warn("v57",e)}},1000);
})();
