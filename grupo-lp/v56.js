// v56: estudo de mercado p/ abrir filial, franquias, delivery, agenda da oficina, CDB e linha do tempo + conquistas
(function(){const W=window,H=36e5,D=24*H;const pk=a=>a[Math.random()*a.length|0],ri=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
const at=()=>S.lojas.filter(l=>!l.encerrada);
const sv=()=>{try{save()}catch(e){}try{render()}catch(e){}};
const dia=()=>new Date(S.simMs).toDateString();
function X(){S.v56=S.v56||{};const x=S.v56;x.fr=x.fr||[];x.ofr=x.ofr||[];x.del=x.del||{};x.of=x.of||{};x.cdb=x.cdb||0;x.marcos=x.marcos||[];x.conq=x.conq||{};return x}
const matriz=()=>(typeof EMP!=="undefined"&&EMP.LP)?"LP":Object.keys(S.ecx||{})[0];
// ===== cidades extras + população =====
const NOVAS={"Várzea Grande":["MT",-15.646,-56.132],"Sorriso":["MT",-12.545,-55.711],"Lucas do Rio Verde":["MT",-13.05,-55.91],"Primavera do Leste":["MT",-15.56,-54.29],"Jaru":["RO",-10.439,-62.466],"Pimenta Bueno":["RO",-11.672,-61.193],"Ouro Preto do Oeste":["RO",-10.716,-62.256],"Buritis":["RO",-10.212,-63.829],"Machadinho d'Oeste":["RO",-9.443,-61.982],"Sena Madureira":["AC",-9.066,-68.657],"Cáceres":["MT",-16.07,-57.68],"Alta Floresta":["MT",-9.875,-56.086],"Pontes e Lacerda":["MT",-15.226,-59.335],"Colíder":["MT",-10.81,-55.45]};
function addCid(){if(typeof CID==="undefined")return;Object.entries(NOVAS).forEach(([c,[uf,la,lo]])=>{if(!CID[c])CID[c]={uf,lat:la,lon:lo}})}
const POP={"Porto Velho":460,"Rio Branco":364,"Cacoal":86,"Vilhena":95,"Campo Novo do Parecis":46,"Cuiabá":650,"Juína":45,"Brasnorte":20,"Ji-Paraná":124,"Ariquemes":96,"Rolim de Moura":50,"Guajará-Mirim":39,"Sinop":196,"Rondonópolis":245,"Cruzeiro do Sul":92,"Tangará da Serra":106,"Várzea Grande":300,"Sorriso":110,"Lucas do Rio Verde":83,"Primavera do Leste":85,"Jaru":50,"Pimenta Bueno":35,"Ouro Preto do Oeste":37,"Buritis":40,"Machadinho d'Oeste":40,"Sena Madureira":45,"Cáceres":89,"Alta Floresta":58,"Pontes e Lacerda":45,"Colíder":33};
const AGRO=["Sorriso","Lucas do Rio Verde","Sinop","Campo Novo do Parecis","Primavera do Leste","Rondonópolis","Tangará da Serra","Brasnorte","Vilhena"];
function estudo(c){const pop=POP[c]||40;const conc=(S.conc||[]).filter(z=>z.cid===c&&z.seg==="lub").length+(pop>150?2:pop>80?1:0);const minhas=at().filter(l=>l.cid===c&&l.tipo==="loja").length;
 const agro=AGRO.includes(c)?1.35:1;const prev=Math.round(pop*1000*0.9*agro/(1+conc*.35+minhas*.6)/1000)*1000;const nota=Math.max(1,Math.min(5,Math.round(prev/60000)));return{pop,conc,minhas,prev,nota,agro:agro>1}}
W.v56abre=function(c){try{abrirBarracao(undefined,c)}catch(e){toast("Abra pela tela de barracão")}};
function cardEstudo(){addCid();const cs=Object.keys(CID).map(c=>({c,...estudo(c)})).sort((a,b)=>b.prev-a.prev);const est=n=>"★".repeat(n)+"☆".repeat(5-n);
 return `<div class="card"><h3>🗺️ Onde abrir a próxima filial? (estudo de mercado)</h3><p class="muted" style="font-size:12px">Previsão de vendas por mês de uma loja de lubrificantes nova, pela população, força do agro e concorrência.</p>
 <div class="tw" style="max-height:340px;overflow:auto"><table><tr><th>Cidade</th><th>População</th><th>Concorrentes</th><th>Suas lojas</th><th>Previsão/mês</th><th>Nota</th><th></th></tr>${cs.map(z=>`<tr><td>${esc(z.c)} <span class="muted">${CID[z.c].uf}</span>${z.agro?" 🌾":""}</td><td>${z.pop} mil</td><td>${z.conc}</td><td>${z.minhas}</td><td><b>${R$(z.prev)}</b></td><td style="color:#f5b301">${est(z.nota)}</td><td><button class="b g" onclick="v56abre('${z.c.replace(/'/g,"\\'")}')">Abrir aqui</button></td></tr>`).join("")}</table></div></div>`}
// ===== franquias =====
const INV=["Marcos Antônio","Juliana Rocha","Grupo Araújo","Família Bortolini","Dr. Ricardo Menezes","Sandra Lopes","Irmãos Zanella","Cooperativa Vale Verde"];
function ofertaFr(){const x=X();if(x.frD===dia())return;x.frD=dia();x.ofr=x.ofr.filter(o=>o.ate>S.simMs);if(x.ofr.length>=2||Math.random()>.12)return;addCid();
 const cs=Object.keys(CID).filter(c=>!at().some(l=>l.cid===c&&l.emp==="LP")&&!x.fr.some(f=>f.cid===c));if(!cs.length)return;const c=pk(cs),e=estudo(c);
 x.ofr.push({id:S.nid++,quem:pk(INV),cid:c,taxa:ri(8,15)*10000,roy:6,vend:Math.round(e.prev*(.7+Math.random()*.5)),ate:S.simMs+6*D})}
W.v56fr=function(id,ok){const x=X(),o=x.ofr.find(z=>z.id===id);if(!o)return;x.ofr=x.ofr.filter(z=>z!==o);if(ok){const k=matriz();S.ecx[k]=(S.ecx[k]||0)+o.taxa;o.ini=S.simMs;o.q=1;x.fr.push(o);marco(`🏪 Primeira franquia Lubriporto em ${o.cid} (${o.quem})`,"fr1");try{log(`🤝 Franquia Lubriporto ${o.cid} vendida para ${o.quem}: taxa de ${R$(o.taxa)} recebida`)}catch(e){}}sv()};
function royalties(){const x=X();if(x.ryD===dia())return;x.ryD=dia();const k=matriz();x.fr.forEach(f=>{f.q=Math.max(.3,Math.min(1.6,(f.q||1)+(Math.random()-.48)*.05));const r=f.vend*f.q*f.roy/100/30;S.ecx[k]=(S.ecx[k]||0)+r;f.tot=(f.tot||0)+r})}
// ===== delivery =====
W.v56del=function(id){const x=X();x.del[id]=x.del[id]?0:S.simMs;try{log(`🛵 Delivery ${x.del[id]?"ligado":"desligado"} em ${nl(id)}`)}catch(e){}sv()};
function delDia(){const x=X();if(x.dlD===dia())return;x.dlD=dia();Object.keys(x.del).forEach(id=>{if(x.del[id])S.lcx[id]=(S.lcx[id]||0)-(2200*2+900)/30})}// 2 motoboys + app
const oV=W.venda;if(oV&&!oV.__v56){W.venda=function(l){const a=l&&l.venda?+l.venda.dia||0:0;const r=oV.apply(this,arguments);
 try{if(l&&l.venda&&X().del[l.id]){const d=(+l.venda.dia||0)-a;if(d>0){const ex=d*.12;l.venda.dia+=ex;l.venda.mes=(l.venda.mes||0)+ex;S.lcx[l.id]=(S.lcx[l.id]||0)+ex;X().dlN=(X().dlN||0)+1}}}catch(e){}return r};W.venda.__v56=1}
// ===== agenda da oficina =====
function rng(seed){let s=seed%2147483647;if(s<=0)s+=2147483646;return()=>(s=s*16807%2147483647)/2147483647}
const CARROS=["Hilux","S10","Strada","Gol","Onix","HB20","Corolla","Ranger","Toro","Saveiro","Fiorino","Scania R 450","Volvo FH","Mercedes Atego","Moto CG 160","Compass","Kwid","Amarok"];
const SERV=[["Troca de óleo + filtro",220],["Troca de óleo sintético",380],["Óleo + filtros (ar, comb.)",450],["Óleo diesel 15W40 caminhão",1250],["Lubrificação + graxa",180],["Óleo de câmbio",520],["Fluido de freio",160]];
const NOMEC=["Seu João","Dona Maria","Pedro","Fazenda Boa Vista","Transp. Rota Norte","Carlos","Ana","Prefeitura","Taxista Zé","Uber Marcos","Igreja Batista","Roberto"];
function boxes(l){const eq=(S.lg&&S.lg.eq&&S.lg.eq[l.id])||{};return Math.min(6,1+(eq.elev||0)+(eq.rampa||0)+(eq.fosso||0))}
function agenda(l){const d=new Date(S.simMs);d.setHours(0,0,0,0);const r=rng(d.getTime()/1000+l.id*7919);const nb=boxes(l);const out=[];const livre=Array(nb).fill(7.5);
 const n=Math.round((4+r()*6)*nb*(1+(POP[l.cid]||60)/400));for(let i=0;i<n;i++){const b=livre.indexOf(Math.min(...livre));const ini=livre[b]+(r()<.3?.5:0);if(ini>17.5)break;const s=SERV[Math.floor(r()*SERV.length)];const dur=s[1]>1000?1.5:.75;livre[b]=ini+dur;
  out.push({box:b+1,ini,fim:ini+dur,cli:NOMEC[Math.floor(r()*NOMEC.length)],carro:CARROS[Math.floor(r()*CARROS.length)],serv:s[0],v:s[1]})}return{nb,out}}
function oficina(){const x=X(),h=new Date(S.simMs);const hd=h.getHours()+h.getMinutes()/60;const k=dia();at().filter(l=>l.troca&&l.tipo==="loja").forEach(l=>{const a=agenda(l);x.of[l.id]=x.of[l.id]&&x.of[l.id].d===k?x.of[l.id]:{d:k,n:0};const pron=a.out.filter(z=>z.fim<=hd);
  for(let i=x.of[l.id].n;i<pron.length;i++){const v=pron[i].v;l.venda.dia=(l.venda.dia||0)+v;l.venda.mes=(l.venda.mes||0)+v;S.lcx[l.id]=(S.lcx[l.id]||0)+v*.55}x.of[l.id].n=pron.length})}
function cardLoja(){let l;try{l=S.lojas[lojaSel]}catch(e){}if(!l||l.encerrada)return"";const x=X();let h="";
 if(l.tipo==="loja")h+=`<div class="card"><div class="row sb" style="flex-wrap:wrap;gap:8px"><h3 style="margin:0">🛵 Delivery – ${esc(nl(l.id))}</h3><button class="b ${x.del[l.id]?"s":"g"}" onclick="v56del(${l.id})">${x.del[l.id]?"✅ Ligado (desligar)":"Ligar delivery"}</button></div><p class="muted" style="font-size:12px;margin-top:6px">Pedidos pelo app/WhatsApp com entrega de moto na cidade: +12% nas vendas. Custo: 2 motoboys + app ≈ ${R$(5300)}/mês.</p></div>`;
 if(l.troca&&l.tipo==="loja"){const a=agenda(l),t=new Date(S.simMs),hd=t.getHours()+t.getMinutes()/60;const hm=v=>String(Math.floor(v)).padStart(2,"0")+":"+String(Math.round(v%1*60)).padStart(2,"0");
  const fat=a.out.filter(z=>z.fim<=hd).reduce((s,z)=>s+z.v,0);
  h+=`<div class="card"><h3>🔧 Agenda da oficina (hoje) – ${a.nb} box${a.nb>1?"es":""}</h3><p class="muted" style="font-size:12px">Mais elevadores/rampas/fosso (aba Equipamentos) = mais boxes = mais carros por dia. Faturado hoje na oficina: <b>${R$(fat)}</b></p>
  <div class="tw" style="max-height:300px;overflow:auto"><table><tr><th>Hora</th><th>Box</th><th>Cliente</th><th>Veículo</th><th>Serviço</th><th>Valor</th><th>Status</th></tr>${a.out.map(z=>`<tr><td>${hm(z.ini)}</td><td>${z.box}</td><td>${esc(z.cli)}</td><td>${esc(z.carro)}</td><td>${esc(z.serv)}</td><td>${R$(z.v)}</td><td>${z.fim<=hd?"✅ pronto":z.ini<=hd?"🔧 no box":"🕒 agendado"}</td></tr>`).join("")}</table></div></div>`}
 return h}
// ===== CDB =====
W.v56cdb=function(op){const sel=document.getElementById("v56cl"),inp=document.getElementById("v56cv");const id=+sel.value,v=+String(inp.value).replace(/\D/g,"");if(!v)return toast("Digite o valor");const x=X();
 if(op==="ap"){S.lcx[id]=(S.lcx[id]||0)-v;x.cdb+=v;x.cdbI=(x.cdbI||0)+v;try{log(`🏦 Aplicou ${R$(v)} no CDB (caixa de ${nl(id)})`)}catch(e){}}
 else{const r=Math.min(v,x.cdb);x.cdb-=r;S.lcx[id]=(S.lcx[id]||0)+r;x.cdbI=Math.max(0,(x.cdbI||0)-r);try{log(`🏦 Resgatou ${R$(r)} do CDB para ${nl(id)}`)}catch(e){}}sv()};
function juros(){const x=X();if(x.jD===dia())return;x.jD=dia();if(x.cdb>0){const j=x.cdb*(Math.pow(1.0105,1/30)-1);x.cdb+=j;x.jTot=(x.jTot||0)+j}}
function cardCDB(){const x=X();return `<div class="card"><h3>🏦 Investimentos – CDB (1,05% ao mês)</h3><div class="row" style="gap:16px;flex-wrap:wrap"><span>Saldo aplicado: <b style="color:#22c55e">${R$(x.cdb)}</b></span><span>Juros ganhos: <b>${R$(x.jTot||0)}</b></span><span class="muted">Rende por mês: ${R$(x.cdb*.0105)}</span></div>
 <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px"><select id="v56cl">${at().map(l=>`<option value="${l.id}">${esc(nl(l.id))} (${R$((S.lcx||{})[l.id]||0)})</option>`).join("")}</select><input id="v56cv" inputmode="numeric" placeholder="Valor R$" style="width:140px"><button class="b g" onclick="v56cdb('ap')">Aplicar</button><button class="b s" onclick="v56cdb('re')">Resgatar</button></div>
 <p class="muted" style="font-size:12px">O dinheiro sai do caixa da loja escolhida e volta pra ela (ou pra outra) quando você resgatar. Liquidez diária.</p></div>`}
// ===== linha do tempo e conquistas =====
function marco(txt,k){const x=X();if(k){if(x.conq["m_"+k])return;x.conq["m_"+k]=S.simMs}x.marcos.push({t:S.simMs,x:txt});if(x.marcos.length>300)x.marcos.splice(0,x.marcos.length-300)}
const oL=W.log;if(oL&&!oL.__v56){W.log=function(m){try{const s=String(m).replace(/<[^>]*>/g,"");if(/(Novo CD|Contrato fechado|Arrematou|Franquia|nova unidade|inaugur|Barracão|abriu a|Comprou o caminhão|comprou.*caminh|Empréstimo|Contratado:.*Gerente)/i.test(s))marco(s)}catch(e){}return oL.apply(this,arguments)};W.log.__v56=1;W.log.__v52=oL.__v52;W.log.__v54=oL.__v54}
const CONQ=[["l5","🏪 5 lojas abertas",()=>at().filter(l=>l.tipo!=="transp").length>=5],["l10","🏬 10 lojas abertas",()=>at().filter(l=>l.tipo!=="transp").length>=10],["l20","🏙️ 20 lojas",()=>at().filter(l=>l.tipo!=="transp").length>=20],
 ["c10","🚛 10 veículos na frota",()=>S.frota.length>=10],["c25","🚚 25 veículos na frota",()=>S.frota.length>=25],["f50","👷 50 funcionários",()=>S.func.length>=50],["f100","👥 100 funcionários",()=>S.func.length>=100],
 ["cx1","💰 R$ 1 milhão em caixa",()=>cx()>=1e6],["cx5","💎 R$ 5 milhões em caixa",()=>cx()>=5e6],["cx10","🏆 R$ 10 milhões em caixa",()=>cx()>=1e7],["cx50","👑 R$ 50 milhões em caixa",()=>cx()>=5e7],
 ["m1","📈 R$ 1 mi vendido no mês (grupo)",()=>vm()>=1e6],["m3","🚀 R$ 3 mi vendidos no mês",()=>vm()>=3e6],["m10","🌎 R$ 10 mi vendidos no mês",()=>vm()>=1e7],
 ["uf3","🗺️ Presente em 3 estados",()=>new Set(at().map(l=>(CID[l.cid]||{}).uf)).size>=3],["cd3","🏬 3 centros de distribuição",()=>2+((S.lg&&S.lg.cdx)||[]).length>=3],
 ["b2b","🤝 Primeiro contrato B2B",()=>(S.v54&&S.v54.b2b||[]).length>0],["fr1","🏪 Primeira franquia",()=>X().fr.length>0],["fr5","🌐 5 franquias",()=>X().fr.length>=5],["cdb","🏦 R$ 1 mi aplicado no CDB",()=>X().cdb>=1e6],["del","🛵 Delivery em 3 lojas",()=>Object.values(X().del).filter(Boolean).length>=3]];
const cx=()=>Object.values(S.lcx||{}).reduce((a,b)=>a+b,0)+Object.values(S.ecx||{}).reduce((a,b)=>a+b,0);
const vm=()=>at().reduce((a,l)=>a+((l.venda&&l.venda.mes)||0),0);
function conquistas(){const x=X();CONQ.forEach(([k,n,f])=>{try{if(!x.conq[k]&&f()){x.conq[k]=S.simMs;x.marcos.push({t:S.simMs,x:"🏅 Conquista: "+n});try{toast("🏅 Conquista desbloqueada: "+n)}catch(e){}}}catch(e){}})}
function iniHist(){const x=X();if(x.ini)return;x.ini=1;x.marcos.unshift({t:S.simMs-1,x:`📜 Grupo LP hoje: ${at().filter(l=>l.tipo!=="transp").length} lojas, ${S.frota.length} veículos, ${S.func.length} funcionários. A história começa a ser contada a partir daqui.`});
 at().forEach(l=>x.marcos.unshift({t:0,x:`🏪 ${nl(l.id)} (${l.cid}) faz parte do grupo`}))}
V.hist=function(){const x=X();const ms=x.marcos.slice().sort((a,b)=>b.t-a.t);const ok=CONQ.filter(([k])=>x.conq[k]).length;
 return `<div class="card"><h3>🏅 Conquistas (${ok}/${CONQ.length})</h3><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px">${CONQ.map(([k,n])=>`<div style="padding:10px;border-radius:10px;background:${x.conq[k]?"#22c55e22":"#ffffff08"};border:1px solid ${x.conq[k]?"#22c55e66":"#ffffff14"};opacity:${x.conq[k]?1:.55}">${n}<br><span class="muted" style="font-size:11px">${x.conq[k]?"✅ "+new Date(x.conq[k]).toLocaleDateString("pt-BR"):"🔒 bloqueada"}</span></div>`).join("")}</div></div>
 <div class="card"><h3>📜 Linha do tempo do Grupo LP</h3><div style="border-left:3px solid #f5b301;padding-left:14px">${ms.map(m=>`<div style="padding:6px 0;position:relative"><span style="position:absolute;left:-21px;top:10px;width:11px;height:11px;border-radius:50%;background:#f5b301"></span><span class="muted" style="font-size:12px">${m.t?new Date(m.t).toLocaleDateString("pt-BR"):"início"}</span><br>${esc(m.x)}</div>`).join("")}</div></div>`};
// ===== Sala do Chefe: franquias =====
function cardFr(){const x=X();const of=x.ofr.filter(o=>o.ate>S.simMs);
 return `<div class="card"><h3>🏪 Franquias Lubriporto</h3>${of.map(o=>`<div style="padding:8px 0;border-bottom:1px solid #ffffff14"><b>${esc(o.quem)}</b> quer abrir uma Lubriporto em <b>${esc(o.cid)}</b><br><span class="muted">Taxa de franquia ${R$(o.taxa)} à vista · royalties ${o.roy}% das vendas (previsão ${R$(o.vend)}/mês → ${R$(o.vend*o.roy/100)}/mês pra você)</span><div class="row" style="gap:6px;margin-top:6px"><button class="b g" onclick="v56fr(${o.id},1)">Aceitar</button><button class="b s" onclick="v56fr(${o.id},0)">Recusar</button></div></div>`).join("")||`<p class="muted">Nenhum interessado agora. Investidores aparecem de vez em quando.</p>`}
 ${x.fr.length?`<div class="tw" style="margin-top:8px"><table><tr><th>Franquia</th><th>Franqueado</th><th>Desempenho</th><th>Royalties recebidos</th></tr>${x.fr.map(f=>`<tr><td>Lubriporto ${esc(f.cid)}</td><td>${esc(f.quem)}</td><td>${Math.round((f.q||1)*100)}%</td><td>${R$(f.tot||0)}</td></tr>`).join("")}</table></div>`:""}</div>`}
// ===== instalação =====
let inst=false;function instala(){if(inst||typeof V==="undefined")return;inst=true;addCid();iniHist();
 if(typeof ABAS!=="undefined")ABAS.hist=["📜","História"];
 const w=(k,fn,antes)=>{if(!V[k])return;const o=V[k];V[k]=function(){const a=o.apply(this,arguments);let c="";try{c=fn()}catch(e){console.warn(e)}return antes?c+a:a+c}};
 w("loja",()=>cardLoja()+cardEstudo(),false);w("chefe",cardFr,true);w("contas",cardCDB,true);try{nav()}catch(e){}try{render()}catch(e){}}
setTimeout(instala,11500);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;ofertaFr();royalties();delDia();oficina();juros();conquistas()}catch(e){console.warn("v56",e)}},1000);
})();
