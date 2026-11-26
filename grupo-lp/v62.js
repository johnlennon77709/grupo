// v62: economia (crise/boom), comprar concorrentes, holding com novas empresas, LP Auto Center, logística pra terceiros,
// rede rival inteligente, sucessão familiar, valuation da empresa + propostas de fundos
(function(){const W=window,H=36e5,D=24*H;const pk=a=>a[Math.random()*a.length|0],ri=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
const at=()=>S.lojas.filter(l=>!l.encerrada),lojas=()=>at().filter(l=>l.tipo!=="transp");
const sv=()=>{try{save()}catch(e){}try{render()}catch(e){}};const dia=()=>new Date(S.simMs).toDateString();
const paga=(id,v,d)=>{S.lcx[id]=(S.lcx[id]||0)-v;try{log(`${d} – ${nl(id)} – ${R$(v)}`)}catch(e){}};
const MZ=()=>(typeof EMP!=="undefined"&&EMP.LP)?"LP":Object.keys(S.ecx||{})[0];
const tr=()=>{const t=S.lojas.find(l=>l.tipo==="transp"&&!l.encerrada);return t?t.id:0};
const uf=c=>{try{return CID[c].uf}catch(e){return"RO"}};
const fala=(f,t)=>{try{const th=novaThread("papo",f.id,`${f.nome}`,"💬");th.fid=f.id;msgAdd(th,"ele",t)}catch(e){}};
const cx=()=>Object.values(S.lcx||{}).reduce((a,b)=>a+b,0)+Object.values(S.ecx||{}).reduce((a,b)=>a+b,0);
const dt=t=>new Date(t).toLocaleDateString("pt-BR");
function X(){S.v62=S.v62||{};const x=S.v62;x.ofC=x.ofC||[];x.ac=x.ac||{};x.lg=x.lg||[];x.ofL=x.ofL||[];x.val=x.val||[];x.ofF=x.ofF||[];x.vend=x.vend||0;x.suc=x.suc||{ger:1,nivel:0};
 x.riv=x.riv||{nome:"Rede MaxLub",cids:["Porto Velho"],forca:1,caixa:2e6};return x}
// ===== 1) economia =====
const FASES={normal:["😐 Economia normal",0,"Nada de especial."],rec:["📉 Recessão",-.15,"Vendas caem 15% e os bancos cobram mais juros."],dolar:["💵 Dólar alto",-.05,"Fornecedores sobem preço: vendas −5% e margem menor."],safra:["🌾 Safra recorde",.12,"Agro bombando: +12% em tudo, +25% no MT."],juros:["📈 Juros caindo / crédito fácil",.07,"Clientes comprando mais: +7%."],boom:["🚀 Boom econômico",.18,"Economia aquecida: +18% nas vendas."]};
function eco(){const x=X();if(!x.eco||S.simMs>x.eco.ate){const ant=x.eco&&x.eco.f;let f;do{f=pk(["normal","normal","rec","dolar","safra","juros","boom"])}while(f===ant);x.eco={f,ini:S.simMs,ate:S.simMs+ri(25,55)*D};try{log(`🌎 Economia mudou: ${FASES[f][0]} – ${FASES[f][2]}`)}catch(e){}}}
function fatorEco(l){const x=X();if(!x.eco)return 0;let f=FASES[x.eco.f][1];if(x.eco.f==="safra"&&uf(l.cid)==="MT")f+=.13;return f}
// ===== 8) rede rival inteligente =====
function rival(){const x=X(),r=x.riv;if(x.rvD===dia())return;x.rvD=dia();r.caixa+=r.cids.length*ri(3000,9000)*(1+fatorEco({cid:""}));
 const minhas=[...new Set(lojas().map(l=>l.cid))];if(r.caixa>900000&&Math.random()<.08){const alvo=pk(minhas);r.cids.push(alvo);r.caixa-=700000;r.forca+=.1;try{log(`⚔️ A ${r.nome} abriu mais uma loja em ${alvo}! Agora tem ${r.cids.length} lojas.`)}catch(e){}
  const l=lojas().find(z=>z.cid===alvo);const g=l&&(S.func||[]).find(f=>f.loja===l.id&&f.cargo==="ger");if(g)fala(g,`Chefe, a <b>${r.nome}</b> abriu uma loja aqui do lado em ${esc(alvo)}. Vão tentar roubar nossos clientes.`)}
 const promo=S.v55&&(S.v55.promo||[]).find(p=>p.ate>S.simMs);if(promo&&!r.copiou){r.copiou=promo.ate;try{log(`⚔️ A ${r.nome} copiou sua promoção e também baixou preço em ${S.lojas[promo.loja].cid}.`)}catch(e){}}if(r.copiou&&r.copiou<S.simMs)r.copiou=0;
 if(fatorEco({cid:""})<0&&Math.random()<.04&&r.cids.length>=3&&!x.ofC.some(o=>o.riv))x.ofC.push({id:S.nid++,riv:1,nome:r.nome,cids:r.cids.slice(0,Math.min(r.cids.length,4)),preco:r.cids.length*ri(450,700)*1000,ate:S.simMs+10*D})}
function fatorRiv(l){const r=X().riv;let n=r.cids.filter(c=>c===l.cid).length;let f=-.04*n;if(r.copiou&&S.v55&&(S.v55.promo||[]).some(p=>p.loja===l.id&&p.ate>S.simMs))f-=.04;return f}
// ===== 2) comprar concorrentes =====
const REDES=["Lubri Norte","Óleo Forte","Center Lub Amazônia","Auto Óleo Express","Rede TopLub","Lubrificantes Pantanal"];
function ofertaC(){const x=X();if(x.ocD===dia())return;x.ocD=dia();x.ofC=x.ofC.filter(o=>o.ate>S.simMs);if(x.ofC.length>=2||Math.random()>.08)return;const n=ri(1,3);const cs=[];const todas=Object.keys(CID);for(let i=0;i<n;i++)cs.push(pk(todas));
 x.ofC.push({id:S.nid++,nome:pk(REDES),cids:cs,preco:n*ri(380,650)*1000,ate:S.simMs+8*D})}
function novaLoja(cid,emp){const base=lojas().find(l=>l.emp===emp&&l.tipo==="loja")||lojas().find(l=>l.tipo==="loja");const l=JSON.parse(JSON.stringify(base));const id=S.lojas.length;
 Object.assign(l,{id,cid,emp,encerrada:false,lat:(CID[cid]||{}).lat,lon:(CID[cid]||{}).lon,venda:{dia:0,mes:0},vendas:0,end:`Av. Principal, ${ri(100,3000)} – ${cid}`});
 Object.keys(l.est||{}).forEach(k=>l.est[k]=Math.floor((l.est[k]||0)*.5));if(S.lojas.some(z=>z.cid===cid&&z.emp===emp&&!z.encerrada))l.suf=(l.suf||"")+" II";S.lojas.push(l);S.lcx[id]=0;
 const mod=(S.func||[])[0]||{};[["ger",5200],["vend",2400],["vend",2400],["caixa",1900],["est",2100]].forEach(([c,s])=>S.func.push({id:S.nid++,nome:pk(["Paulo","Aline","Marcos","Rita","Jonas","Cleide","Tiago","Vera"])+" "+pk(["Lima","Souza","Prado","Melo","Dias"]),cargo:c,loja:id,sal:s,adm:S.simMs,vis:mod.vis?JSON.parse(JSON.stringify(mod.vis)):undefined,moral:60}));return l}
W.v62compra=function(id){const x=X(),o=x.ofC.find(z=>z.id===id);if(!o)return;if(!confirm(`Comprar a ${o.nome} (${o.cids.length} loja(s): ${o.cids.join(", ")}) por ${R$(o.preco)}? Sai do caixa da matriz. As lojas viram Lubriporto com a equipe atual.`))return;
 const k=MZ();S.ecx[k]=(S.ecx[k]||0)-o.preco;o.cids.forEach(c=>novaLoja(c,"LP"));x.ofC=x.ofC.filter(z=>z!==o);if(o.riv){x.riv={nome:pk(REDES.filter(n=>n!==o.nome)),cids:[pk(Object.keys(CID))],forca:1,caixa:1e6}}
 try{log(`🏢 AQUISIÇÃO: o Grupo LP comprou a ${o.nome} por ${R$(o.preco)}! ${o.cids.length} loja(s) nova(s): ${o.cids.join(", ")}`)}catch(e){}try{S.v56&&S.v56.marcos.push({t:S.simMs,x:`🏢 Comprou a rede ${o.nome}`})}catch(e){}sv()};
// ===== 3) holding: novas empresas =====
const NOVAS={LPN:["LP Pneus","#0ea5e9","lub"],LPA:["LP Auto Peças","#8b5cf6","lub"],LPM:["LP Máquinas","#f97316","const"],LPT:["LP Combustíveis","#16a34a","lub"]};
function regEmp(){if(typeof EMP==="undefined")return;Object.entries((S.v62&&S.v62.emp)||{}).forEach(([k,e])=>{if(!EMP[k])EMP[k]=e})}
W.v62emp=function(k){const x=X();x.emp=x.emp||{};if(x.emp[k])return;const n=NOVAS[k];const e={n:n[0],c:n[1],seg:n[2],cnpj:`${ri(10,99)}.${ri(100,999)}.${ri(100,999)}/0001-${ri(10,99)}`,criada:S.simMs};x.emp[k]=e;EMP[k]=e;S.emps=S.emps||{};S.emps[k]=e;S.ecx[k]=0;
 const m=MZ();S.ecx[m]=(S.ecx[m]||0)-60000;try{log(`🏢 Nova empresa no grupo: ${e.n} (CNPJ ${e.cnpj}) – abertura R$ 60 mil. Abra a 1ª loja pela tela de barracão.`)}catch(e){}sv();try{abrirBarracao(k)}catch(e){}};
// ===== 6) LP Auto Center =====
W.v62ac=function(id){const x=X();if(x.ac[id])return;if(!confirm(`Transformar a ${nl(id)} em LP Auto Center (revisão, freio, suspensão, alinhamento) por R$ 280.000?`))return;paga(id,280000,"🔧 Obra do LP Auto Center");x.ac[id]={pronto:S.simMs+15*D,fat:0};sv()};
function autoC(){const x=X();if(x.acD===dia())return;x.acD=dia();Object.entries(x.ac).forEach(([id,a])=>{const l=S.lojas[id];if(!l||l.encerrada||S.simMs<a.pronto)return;const v=ri(8,25)*1000*(1+fatorEco(l));a.fat+=v;l.venda.dia+=v;l.venda.mes=(l.venda.mes||0)+v;S.lcx[id]=(S.lcx[id]||0)+v*.45})}
// ===== 7) logística pra terceiros =====
const CLT=["Frigorífico Boi Gordo","Cerealista Planalto","Distribuidora de Bebidas Norte","Atacadão do Vale","Cooperativa de Leite Ji-Paraná","Madeireira Amazonas","Fábrica de Ração Agromix"];
function ofertaL(){const x=X();if(x.olD===dia())return;x.olD=dia();x.ofL=x.ofL.filter(o=>o.ate>S.simMs);if(x.ofL.length>=3||Math.random()>.2)return;const cs=Object.keys(CID);const a=pk(cs);let b=pk(cs);if(b===a)b=pk(cs);
 x.ofL.push({id:S.nid++,cli:pk(CLT),a,b,sem:ri(9,28)*1000,meses:pk([3,6,12]),ate:S.simMs+6*D})}
W.v62lg=function(id){const x=X(),o=x.ofL.find(z=>z.id===id);if(!o)return;const v=S.frota.find(z=>z.status==="Garagem"&&["cavalo","rigido"].includes(z.tipo));if(!v)return toast("Nenhum caminhão livre na garagem");
 v.status="Contrato";o.v=v.id;o.ini=S.simMs;o.fim=S.simMs+o.meses*30*D;o.pg=S.simMs;x.lg.push(o);x.ofL=x.ofL.filter(z=>z!==o);try{log(`🚚 Contrato de transporte: ${o.cli} (${o.a} ⇄ ${o.b}) – ${R$(o.sem)}/semana com o ${v.mod} ${v.placa}`)}catch(e){}sv()};
W.v62lgx=function(id){const x=X(),o=x.lg.find(z=>z.id===id);if(!o)return;const v=S.frota.find(z=>z.id===o.v);if(v)v.status="Garagem";x.lg=x.lg.filter(z=>z!==o);sv()};
function logT(){const x=X();x.lg=x.lg.filter(o=>{const v=S.frota.find(z=>z.id===o.v);if(!v||S.simMs>o.fim){if(v)v.status="Garagem";try{log(`📄 Contrato de transporte com ${o.cli} terminou`)}catch(e){}return false}
 if(S.simMs-o.pg>=7*D){o.pg+=7*D;const liq=o.sem*.62;S.lcx[tr()]=(S.lcx[tr()]||0)+liq;o.tot=(o.tot||0)+liq;v.km=(v.km||0)+ri(1500,3500)}if(v.status!=="Contrato")v.status="Contrato";return true})}
// ===== 9) sucessão =====
W.v62her=function(){const x=X();const s=x.suc;const sel=document.getElementById("v62hs");const nm=sel.value==="novo"?(prompt("Nome do herdeiro(a):")||"").trim():sel.value;if(!nm)return;s.her=nm;s.nivel=0;try{log(`👨‍👦 ${nm} foi escolhido(a) como sucessor(a) do Grupo LP`)}catch(e){}sv()};
W.v62trein=function(){const x=X(),s=x.suc;if(!s.her||s.nivel>=5)return;const custo=[20,35,50,80,120][s.nivel]*1000;const k=MZ();S.ecx[k]=(S.ecx[k]||0)-custo;s.nivel++;const et=["estágio nas lojas","faculdade de administração","gerente de uma loja","diretor regional","MBA e mentoria com o dono"][s.nivel-1];try{log(`🎓 ${s.her} concluiu: ${et} (${R$(custo)})`)}catch(e){}sv()};
W.v62passa=function(){const x=X(),s=x.suc;if(s.nivel<5)return;if(!confirm(`Passar o comando do Grupo LP para ${s.her}? Começa a ${s.ger+1}ª geração.`))return;const ant=S.dono;S.dono=s.her;s.hist=s.hist||[];s.hist.push({t:S.simMs,de:ant,para:s.her,g:s.ger});s.ger++;s.her=null;s.nivel=0;
 lojas().forEach(l=>{(S.func||[]).filter(f=>f.loja===l.id).forEach(f=>f.moral=Math.min(100,(f.moral||70)+10))});try{log(`👑 ${S.dono} assumiu o Grupo LP! Começa a ${s.ger}ª geração.`)}catch(e){}try{S.v56&&S.v56.marcos.push({t:S.simMs,x:`👑 ${S.dono} assumiu o comando (${s.ger}ª geração)`})}catch(e){}sv()};
// ===== 10) valuation =====
function valuation(){const fr=S.frota.reduce((a,v)=>a+(v.val||0)*Math.max(.35,1-(2026-(v.ano||2020))*.06),0);let est=0;lojas().forEach(l=>Object.entries(l.est||{}).forEach(([k,q])=>{try{est+=q*(prod(k).custo||0)}catch(e){}}));
 const lucro=lojas().reduce((a,l)=>{const fol=(S.func||[]).filter(f=>f.loja===l.id).reduce((s,f)=>s+f.sal,0);return a+((l.venda&&l.venda.mes)||0)*.35-fol*1.36},0);
 const div=(S.contas||[]).filter(c=>!c.pago&&/Empr|Financ|Parcela/.test(c.cat+c.desc)).reduce((a,c)=>a+c.v,0);const v=Math.max(0,cx()+fr+est+Math.max(0,lucro)*12*5-div);return{v,fr,est,lucro,div,cx:cx()}}
function valMes(){const x=X();const d=new Date(S.simMs),mk=d.getFullYear()*12+d.getMonth();const last=x.val[x.val.length-1];if(!last||last.mk!==mk){x.val.push({mk,t:S.simMs,v:valuation().v});x.val=x.val.slice(-36)}else last.v=valuation().v;
 if(x.fvD!==dia()){x.fvD=dia();x.ofF=x.ofF.filter(o=>o.ate>S.simMs);if(x.ofF.length<1&&Math.random()<.04&&x.vend<49){const pct=pk([10,15,20,25]);const v=valuation().v;x.ofF.push({id:S.nid++,fundo:pk(["XP Private Equity","BTG Pactual Capital","Patria Investimentos","Fundo Amazônia Growth","Vinci Partners"]),pct,valor:Math.round(v*pct/100*(.8+Math.random()*.45)/1000)*1000,ate:S.simMs+7*D})}}}
W.v62fundo=function(id,ok){const x=X(),o=x.ofF.find(z=>z.id===id);if(!o)return;x.ofF=x.ofF.filter(z=>z!==o);if(ok){if(x.vend+o.pct>49)return toast("Você não pode vender mais de 49% (perderia o controle)");const k=MZ();S.ecx[k]=(S.ecx[k]||0)+o.valor;x.vend+=o.pct;x.soc=x.soc||[];x.soc.push({f:o.fundo,pct:o.pct,v:o.valor,t:S.simMs});try{log(`💼 Vendeu ${o.pct}% do Grupo LP para ${o.fundo} por ${R$(o.valor)}`)}catch(e){}}sv()};
// ===== efeito nas vendas =====
const oV=W.venda;if(oV&&!oV.__v62){W.venda=function(l){const a=l&&l.venda?+l.venda.dia||0:0;const r=oV.apply(this,arguments);
 try{if(l&&l.venda){const d=(+l.venda.dia||0)-a;if(d>0){const f=fatorEco(l)+fatorRiv(l);if(f){const ex=d*f;l.venda.dia+=ex;l.venda.mes=(l.venda.mes||0)+ex;S.lcx[l.id]=(S.lcx[l.id]||0)+ex*.4}}}}catch(e){}return r};W.venda.__v62=1}
// ===== telas =====
function cardPainel(){const x=X(),e=x.eco;const vv=valuation();const hist=x.val;const mx=Math.max(1,...hist.map(h=>h.v));const MS=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
 return `${e?`<div class="card" style="border-left:4px solid ${FASES[e.f][1]<0?"#ef4444":FASES[e.f][1]>0?"#22c55e":"#94a3b8"}"><b>${FASES[e.f][0]}</b> até ${dt(e.ate)} · <span class="muted">${FASES[e.f][2]}</span></div>`:""}
 <div class="card"><h3>💎 Quanto vale o Grupo LP</h3><div style="font-size:28px;font-weight:800;color:#f5b301">${R$(vv.v)}</div>
 <div class="muted" style="font-size:12px">Caixa ${R$(vv.cx)} + frota ${R$(vv.fr)} + estoque ${R$(vv.est)} + 5 anos de lucro (${R$(Math.max(0,vv.lucro))}/mês) − dívidas ${R$(vv.div)}${x.vend?` · você tem ${100-x.vend}% (sua parte: <b>${R$(vv.v*(100-x.vend)/100)}</b>)`:""}</div>
 ${hist.length>1?`<div style="display:flex;align-items:flex-end;gap:4px;height:90px;margin-top:10px">${hist.map(h=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%" title="${R$(h.v)}"><div style="width:100%;background:#f5b301;border-radius:3px 3px 0 0;height:${Math.round(h.v/mx*72)}px"></div><span class="muted" style="font-size:10px">${MS[h.mk%12]}</span></div>`).join("")}</div>`:""}
 ${x.ofF.map(o=>`<div style="margin-top:10px;padding:10px;border:1px solid #f5b30155;border-radius:10px">💼 <b>${esc(o.fundo)}</b> quer comprar <b>${o.pct}%</b> do Grupo LP por <b>${R$(o.valor)}</b> (avalia a empresa em ${R$(o.valor/o.pct*100)}).<div class="row" style="gap:6px;margin-top:6px"><button class="b g" onclick="v62fundo(${o.id},1)">Vender</button><button class="b s" onclick="v62fundo(${o.id},0)">Recusar</button></div></div>`).join("")}
 ${(x.soc||[]).length?`<div class="muted" style="font-size:12px;margin-top:6px">Sócios investidores: ${x.soc.map(s=>`${esc(s.f)} ${s.pct}%`).join(" · ")}</div>`:""}</div>`}
function cardChefe(){const x=X(),s=x.suc;const ger=(S.func||[]).filter(f=>f.cargo==="ger").slice(0,15);
 return `<div class="card"><h3>🏢 Aquisições</h3>${x.ofC.filter(o=>o.ate>S.simMs).map(o=>`<div style="padding:8px 0;border-bottom:1px solid #ffffff14">${o.riv?"⚔️ ":""}<b>${esc(o.nome)}</b> ${o.riv?"(seu rival, em crise) ":""}está à venda: ${o.cids.length} loja(s) em ${o.cids.map(esc).join(", ")}<br><span class="muted">Preço ${R$(o.preco)} · vem com equipe e estoque · até ${dt(o.ate)}</span><br><button class="b g" style="margin-top:6px" onclick="v62compra(${o.id})">Comprar a rede</button></div>`).join("")||`<p class="muted">Nenhuma rede à venda agora. Em crises aparecem mais oportunidades.</p>`}</div>
 <div class="card"><h3>🏛️ Holding – empresas do grupo</h3><p class="muted" style="font-size:12px">Abra novos negócios dentro do grupo (R$ 60 mil de abertura). Depois é só abrir lojas dela pela tela de barracão.</p><div class="row" style="gap:6px;flex-wrap:wrap">${Object.entries(NOVAS).map(([k,n])=>(x.emp||{})[k]?`<span class="b s">✅ ${n[0]}</span>`:`<button class="b g" onclick="v62emp('${k}')">Abrir ${n[0]}</button>`).join("")}</div></div>
 <div class="card"><h3>🚚 Logística pra terceiros</h3>${x.ofL.filter(o=>o.ate>S.simMs).map(o=>`<div style="padding:6px 0;border-bottom:1px solid #ffffff14"><b>${esc(o.cli)}</b>: rota fixa ${esc(o.a)} ⇄ ${esc(o.b)} · <b>${R$(o.sem)}/semana</b> · ${o.meses} meses<br><button class="b g" style="margin-top:4px" onclick="v62lg(${o.id})">Fechar (usa 1 caminhão livre)</button></div>`).join("")||`<p class="muted">Sem propostas agora.</p>`}
 ${x.lg.map(o=>{const v=S.frota.find(z=>z.id===o.v);return `<div style="font-size:13px;margin-top:4px">✅ ${esc(o.cli)} (${esc(o.a)} ⇄ ${esc(o.b)}) · ${v?esc(v.mod)+" "+v.placa:""} · já rendeu ${R$(o.tot||0)} · até ${dt(o.fim)} <button class="b s" onclick="v62lgx(${o.id})">Encerrar</button></div>`}).join("")}<p class="muted" style="font-size:12px">O caminhão fica dedicado ao contrato. Você recebe por semana (já descontado diesel e motorista, ~62% líquido).</p></div>
 <div class="card"><h3>👑 Sucessão – ${s.ger}ª geração · dono: ${esc(S.dono||"Você")}</h3>${s.her?`<p>Sucessor(a): <b>${esc(s.her)}</b> · preparo ${s.nivel}/5</p><div style="height:8px;background:#ffffff14;border-radius:5px"><div style="height:100%;width:${s.nivel*20}%;background:#22c55e;border-radius:5px"></div></div>
 <div class="row" style="gap:6px;margin-top:8px">${s.nivel<5?`<button class="b g" onclick="v62trein()">Próxima etapa (${R$([20,35,50,80,120][s.nivel]*1000)})</button>`:`<button class="b g" onclick="v62passa()">👑 Passar o comando</button>`}</div>`:
 `<div class="row" style="gap:6px;flex-wrap:wrap"><select id="v62hs"><option value="novo">Filho(a) / outra pessoa…</option>${ger.map(f=>`<option>${esc(f.nome)}</option>`).join("")}</select><button class="b g" onclick="v62her()">Escolher sucessor</button></div>`}
 ${(s.hist||[]).map(h=>`<div class="muted" style="font-size:12px">${dt(h.t)}: ${esc(h.de||"")} → ${esc(h.para)} (${h.g+1}ª geração)</div>`).join("")}</div>`}
function cardLoja(){let l;try{l=S.lojas[lojaSel]}catch(e){}if(!l||l.encerrada||l.tipo!=="loja")return"";const a=X().ac[l.id];
 return `<div class="card"><h3>🔧 LP Auto Center</h3>${a?(S.simMs<a.pronto?`<p>🚧 Em obra até ${dt(a.pronto)}</p>`:`<p>✅ Funcionando: revisão completa, freio, suspensão e alinhamento · já faturou <b>${R$(a.fat)}</b> (margem 45%)</p>`):`<p class="muted" style="font-size:13px">Vira oficina completa: fatura R$ 8 a 25 mil por dia a mais com serviços.</p><button class="b g" onclick="v62ac(${l.id})">Montar Auto Center – R$ 280 mil</button>`}</div>`}
function cardRival(){const r=X().riv;const minhas=lojas().length;return `<div class="card"><h3>⚔️ Rival: ${esc(r.nome)}</h3><div class="row" style="gap:18px;flex-wrap:wrap"><span>Lojas deles: <b>${r.cids.length}</b></span><span>Suas: <b>${minhas}</b></span><span>Caixa estimado: <b>${R$(r.caixa)}</b></span></div>
 <p style="font-size:13px;margin-top:6px">Cidades: ${r.cids.map(esc).join(", ")}</p><p class="muted" style="font-size:12px">Cada loja deles na mesma cidade que a sua tira ~4% das suas vendas. Eles copiam suas promoções. Em crise econômica podem ficar à venda (veja Sala do Chefe → Aquisições).</p></div>`}
let inst=false;function instala(){if(inst||typeof V==="undefined")return;inst=true;regEmp();const w=(k,fn,antes)=>{if(!V[k])return;const o=V[k];V[k]=function(){const a=o.apply(this,arguments);let c="";try{c=fn()}catch(e){console.warn(e)}return antes?c+a:a+c}};
 w("painel",cardPainel,true);w("chefe",cardChefe,false);w("loja",cardLoja,false);w("concorr",cardRival,true);try{render()}catch(e){}}
setTimeout(()=>{regEmp();instala()},14000);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;eco();rival();ofertaC();ofertaL();autoC();logT();valMes()}catch(e){console.warn("v62",e)}},1000);
})();
