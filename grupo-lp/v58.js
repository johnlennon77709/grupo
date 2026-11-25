// v58: licitações, posto de combustível, marketing digital, auditoria (desvio), diretor regional, inventário, prêmios do setor
(function(){const W=window,H=36e5,D=24*H;const pk=a=>a[Math.random()*a.length|0],ri=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
const at=()=>S.lojas.filter(l=>!l.encerrada),lojas=()=>at().filter(l=>l.tipo!=="transp");
const sv=()=>{try{save()}catch(e){}try{render()}catch(e){}};
const dia=()=>new Date(S.simMs).toDateString();
const paga=(id,v,d)=>{S.lcx[id]=(S.lcx[id]||0)-v;try{log(`${d} – ${nl(id)} – ${R$(v)}`)}catch(e){}};
const fala=(f,t)=>{try{const th=novaThread("papo",f.id,`${f.nome}`,"💬");th.fid=f.id;msgAdd(th,"ele",t)}catch(e){}};
const uf=c=>{try{return CID[c].uf}catch(e){return"RO"}};
const CGN={mot:"Motorista",vend:"Vendedor",caixa:"Caixa",ger:"Gerente",mec:"Mecânico",est:"Estoquista",adm:"Administrativo",aux:"Auxiliar",vext:"Vendedor externo",comp:"Comprador"};
function X(){S.v58=S.v58||{};const x=S.v58;x.lic=x.lic||[];x.cont=x.cont||[];x.posto=x.posto||{};x.mkt=x.mkt||{};x.dir=x.dir||{};x.inv=x.inv||{};x.prem=x.prem||[];x.mesV=x.mesV||0;return x}
const add=(l,v,marg)=>{l.venda.dia=(l.venda.dia||0)+v;l.venda.mes=(l.venda.mes||0)+v;S.lcx[l.id]=(S.lcx[l.id]||0)+v*marg};
// ===== 1) licitações =====
const ORG=["Prefeitura de","Câmara Municipal de","DER","Polícia Militar","Corpo de Bombeiros","Exército – 17ª Brigada","Secretaria de Saúde de","Consórcio Intermunicipal","Hospital Regional de","Secretaria de Obras de"];
const OBJ=["óleo lubrificante para a frota","lubrificantes e filtros para máquinas pesadas","troca de óleo da frota de ambulâncias","óleo diesel e graxa para patrolas e caçambas","lubrificantes para viaturas","filtros e óleo para ônibus escolares"];
function novaLic(){const x=X();if(x.lcD===dia())return;x.lcD=dia();x.lic=x.lic.filter(z=>z.ate>S.simMs||z.res);if(x.lic.filter(z=>!z.res).length>=3||Math.random()>.25)return;
 const l=pk(lojas());const o=pk(ORG);const quem=/de$/.test(o)?o+" "+l.cid:o+(o.startsWith("DER")?"-"+uf(l.cid):"");x.lic.push({id:S.nid++,quem,obj:pk(OBJ),loja:l.id,val:ri(20,200)*10000,ate:S.simMs+5*D,rivais:ri(2,6)})}
W.v58lance=function(id){const x=X(),z=x.lic.find(q=>q.id===id);if(!z||z.res)return;const d=+document.getElementById("v58d"+id).value;let melhor=0;for(let i=0;i<z.rivais;i++)melhor=Math.max(melhor,4+Math.random()*16);
 z.lance=d;z.melhor=+melhor.toFixed(1);if(d>melhor){z.res="ganhou";x.cont.push({id:z.id,quem:z.quem,obj:z.obj,loja:z.loja,val:z.val,desc:d,ini:S.simMs,fim:S.simMs+365*D});try{log(`🏛️ GANHOU a licitação: ${z.quem} – ${z.obj} (${R$(z.val)}/ano, ${d}% de desconto)`)}catch(e){}toast("🏆 Você ganhou a licitação!")}
 else{z.res="perdeu";try{log(`🏛️ Perdeu a licitação de ${z.quem}: concorrente deu ${z.melhor}% de desconto`)}catch(e){}toast(`Perdeu: o concorrente deu ${z.melhor}% de desconto`)}sv()};
function contratos(){const x=X();if(x.ctD===dia())return;x.ctD=dia();x.cont=x.cont.filter(c=>{if(S.simMs>c.fim)return false;const l=S.lojas[c.loja];if(!l||l.encerrada)return false;add(l,c.val/365*(1-c.desc/100),Math.max(.05,.36-c.desc/100));return true})}
// ===== 3) posto de combustível =====
W.v58posto=function(id){const x=X();if(x.posto[id])return;if(!confirm(`Construir posto de combustível junto à ${nl(id)} por R$ 850.000? (obra de 20 dias)`))return;paga(id,850000,"⛽ Construção de posto de combustível");x.posto[id]={ini:S.simMs,pronto:S.simMs+20*D,lit:0};sv()};
function postos(){const x=X();if(x.psD===dia())return;x.psD=dia();Object.entries(x.posto).forEach(([id,p])=>{const l=S.lojas[id];if(!l||l.encerrada||S.simMs<p.pronto)return;const lit=ri(6000,16000);const fat=lit*6.1;p.lit+=lit;p.fat=(p.fat||0)+fat;add(l,fat,.065);if(!p.ok){p.ok=1;try{log(`⛽ Posto da ${nl(id)} inaugurado!`)}catch(e){}}})}
// ===== 4) marketing digital =====
const PLANO={0:["Sem anúncios",0,0],1:["Anúncios básicos",1500,.03],2:["Anúncios fortes",5000,.08]};
W.v58plano=function(id,p){const x=X();x.mkt[id]=x.mkt[id]||{seg:ri(300,1500),p:0};x.mkt[id].p=p;try{log(`📱 Marketing digital da ${nl(id)}: ${PLANO[p][0]}`)}catch(e){}sv()};
W.v58post=function(id){const x=X();const m=x.mkt[id]=x.mkt[id]||{seg:ri(300,1500),p:0};if(m.post===dia())return toast("Já postou hoje");m.post=dia();const g=ri(15,120)*(m.p+1);m.seg+=g;m.boost=S.simMs+D;toast(`📸 Post publicado: +${g} seguidores`);sv()};
function mktDia(){const x=X();if(x.mkD===dia())return;x.mkD=dia();Object.entries(x.mkt).forEach(([id,m])=>{const c=PLANO[m.p||0];if(c[1])S.lcx[id]=(S.lcx[id]||0)-c[1]/30;m.seg+=Math.round((m.p||0)*ri(20,90)+ri(0,10))})}
// ===== 8) diretor regional =====
W.v58dir=function(reg){const sel=document.getElementById("v58dr"+reg);const fid=+sel.value;const f=S.func.find(z=>z.id===fid);if(!f)return;const x=X();if(x.dir[reg]){const o=S.func.find(z=>z.id===x.dir[reg]);if(o){o.sal-=6000;o.dirReg=null}}
 x.dir[reg]=fid;f.sal+=6000;f.dirReg=reg;f.moral=100;try{log(`👔 ${f.nome} promovido a Diretor Regional ${reg} (+R$ 6.000/mês)`)}catch(e){}fala(f,`Chefe, muito obrigado pela confiança! Vou cuidar de todas as lojas de ${reg} como se fossem minhas. 💪`);sv()};
function diretores(){const x=X();Object.entries(x.dir).forEach(([reg,fid])=>{const f=S.func.find(z=>z.id===fid);if(!f){delete x.dir[reg];return}
 try{(S.lg&&S.lg.ped||[]).filter(p=>p.st==="pend"&&uf(S.lojas[p.loja].cid)===reg&&S.simMs-p.t>4*H).forEach(p=>{W.v52ped(p.id,1);try{log(`👔 Diretor ${f.nome} aprovou equipamentos pra ${nl(p.loja)}`)}catch(e){}})}catch(e){}
 try{(S.v57&&S.v57.gar||[]).filter(g=>!g.r&&uf(S.lojas[g.loja].cid)===reg).forEach(g=>W.v57gar(g.id,1))}catch(e){}})}
// ===== 6) auditoria / desvio =====
function desvio(){const x=X();if(x.dvD===dia())return;x.dvD=dia();const d=x.desv;
 if(d&&!d.fim){const l=S.lojas[d.loja];if(l){const p=ri(800,6000);d.perda+=p;S.lcx[l.id]=(S.lcx[l.id]||0)-p;const ks=Object.keys(l.est||{});for(let i=0;i<3&&ks.length;i++){const k=pk(ks);l.est[k]=Math.max(0,(l.est[k]||0)-ri(1,6))}}
  if(!d.avisou&&d.perda>8000){d.avisou=1;const g=(S.func||[]).find(f=>f.loja===d.loja&&f.cargo==="ger");if(g)fala(g,`Chefe, tô desconfiado… tá sumindo produto do estoque da ${esc(nl(d.loja))}. Já são uns ${R$(d.perda)}. Acho que é alguém de dentro. Veja na aba Equipe → Auditoria.`)}return}
 if(Math.random()>.03)return;const l=pk(lojas());const fs=(S.func||[]).filter(f=>f.loja===l.id&&f.cargo!=="ger");if(fs.length<3)return;const cul=pk(fs);const sus=[cul,...fs.filter(f=>f!==cul).sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);
 x.desv={loja:l.id,cul:cul.id,sus:sus.map(f=>f.id),perda:0,ini:S.simMs,pistas:[]}}
W.v58aud=function(){const x=X(),d=x.desv;if(!d||d.fim)return;if(d.aud)return toast("Auditoria já feita");paga(d.loja,12000,"🕵️ Auditoria externa contratada");d.aud=1;const c=S.func.find(f=>f.id===d.cul);d.pistas.push(`Câmeras e notas fiscais apontam para ${c?c.nome:"?"}: saídas de estoque sem venda no turno dele.`);sv()};
W.v58acusa=function(fid){const x=X(),d=x.desv;if(!d||d.fim)return;const f=S.func.find(z=>z.id===fid);if(!f)return;
 if(fid===d.cul){d.fim="pego";const rec=d.perda*.5;S.lcx[d.loja]=(S.lcx[d.loja]||0)+rec;S.func=S.func.filter(z=>z!==f);(S.frota||[]).forEach(v=>{if(v.mot===f.id)v.mot=null});try{log(`🚔 Desvio descoberto na ${nl(d.loja)}: ${f.nome} foi demitido por justa causa. Recuperados ${R$(rec)}.`)}catch(e){}toast("✅ Culpado pego!")}
 else{f.moral=Math.max(0,(f.moral||70)-40);(S.func||[]).filter(z=>z.loja===d.loja).forEach(z=>z.moral=Math.max(0,(z.moral||70)-10));d.erros=(d.erros||0)+1;d.pistas.push(`${f.nome} era inocente… a equipe ficou chateada com a acusação.`);toast("❌ Era inocente! A equipe ficou chateada")}sv()};
// ===== 9) inventário =====
W.v58inv=function(id){const l=S.lojas[id];if(!l)return;paga(id,3000,"📋 Inventário completo do estoque");const x=X(),d=x.desv;let perda=0,venc=0,itens=0;const ks=Object.keys(l.est||{});
 ks.forEach(k=>{const q=l.est[k]||0;if(!q)return;let c=0;try{c=prod(k).custo||0}catch(e){}const pct=(d&&!d.fim&&d.loja===id?.04:.012)*Math.random();const sum=Math.floor(q*pct);const vc=Math.random()<.04?Math.floor(q*Math.random()*.05):0;if(sum||vc){l.est[k]=Math.max(0,q-sum-vc);perda+=sum*c;venc+=vc*c;itens++}});
 const tot=ks.reduce((a,k)=>{let c=0;try{c=prod(k).custo||0}catch(e){}return a+(l.est[k]||0)*c},0);x.inv[id]={t:S.simMs,perda,venc,itens,tot,suspeita:!!(d&&!d.fim&&d.loja===id)};
 try{log(`📋 Inventário ${nl(id)}: estoque ${R$(tot)}, perdas ${R$(perda)}, vencidos ${R$(venc)}`)}catch(e){}if(d&&!d.fim&&d.loja===id){d.pistas.push("Inventário confirmou: a perda é bem acima do normal. Tem desvio mesmo.")}sv()};
// ===== 10) prêmios do setor =====
const PREM=[[1e6,"🥉 Revendedor Destaque Regional",50000,1],[3e6,"🥈 Melhor Revendedor Lubrax do Norte",120000,2],[6e6,"🥇 Revendedor Diamante Shell/Lubrax Brasil",250000,3]];
function premios(){const x=X();const d=new Date(S.simMs),mk=d.getFullYear()*12+d.getMonth();const v=lojas().reduce((a,l)=>a+((l.venda&&l.venda.mes)||0),0);if(x.pmM==null){x.pmM=mk;x.mesV=v;return}
 if(mk===x.pmM){x.mesV=Math.max(x.mesV,v);return}const fez=x.mesV;x.pmM=mk;x.mesV=0;const p=PREM.slice().reverse().find(z=>fez>=z[0]);if(!p)return;
 const k=(typeof EMP!=="undefined"&&EMP.LP)?"LP":Object.keys(S.ecx)[0];S.ecx[k]=(S.ecx[k]||0)+p[2];x.prem.unshift({t:S.simMs,n:p[1],b:p[2],v:fez,desc:p[3]*2});x.prem=x.prem.slice(0,24);x.descF=p[3]*2;
 try{log(`🏆 PRÊMIO: ${p[1]}! Vendas de ${R$(fez)} no mês. Bônus de ${R$(p[2])} e ${p[3]*2}% de desconto nas compras do mês`)}catch(e){}try{S.v56&&S.v56.marcos&&S.v56.marcos.push({t:S.simMs,x:"🏆 "+p[1]})}catch(e){}}
// ===== telas =====
function cardChefe(){const x=X();const ab=x.lic.filter(z=>!z.res&&z.ate>S.simMs),fe=x.lic.filter(z=>z.res).slice(-4).reverse();const mes=lojas().reduce((a,l)=>a+((l.venda&&l.venda.mes)||0),0);const prox=PREM.find(z=>mes<z[0]);
 return `<div class="card"><h3>🏛️ Licitações públicas</h3>${ab.map(z=>`<div style="padding:8px 0;border-bottom:1px solid #ffffff14"><b>${esc(z.quem)}</b> – ${esc(z.obj)}<br><span class="muted">Valor estimado ${R$(z.val)}/ano · atende ${esc(nl(z.loja))} · ${z.rivais} concorrentes · encerra ${new Date(z.ate).toLocaleDateString("pt-BR")}</span>
  <div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap">Seu desconto: <select id="v58d${z.id}">${[3,5,8,10,12,15,18,20,25].map(d=>`<option value="${d}" ${d===10?"selected":""}>${d}%</option>`).join("")}</select><button class="b g" onclick="v58lance(${z.id})">Dar lance</button></div></div>`).join("")||`<p class="muted">Nenhum edital aberto agora.</p>`}
  ${fe.map(z=>`<div style="font-size:12px">${z.res==="ganhou"?"🏆":"❌"} ${esc(z.quem)}: seu ${z.lance}% × melhor rival ${z.melhor}%</div>`).join("")}
  ${x.cont.length?`<div class="tw" style="margin-top:8px"><table><tr><th>Contrato público</th><th>Loja</th><th>Valor/ano</th><th>Desc.</th><th>Até</th></tr>${x.cont.map(c=>`<tr><td>${esc(c.quem)}</td><td>${esc(nl(c.loja))}</td><td>${R$(c.val)}</td><td>${c.desc}%</td><td>${new Date(c.fim).toLocaleDateString("pt-BR")}</td></tr>`).join("")}</table></div>`:""}
  <p class="muted" style="font-size:12px">Quanto maior o desconto, mais chance de ganhar, mas menos lucro. Acima de 20% quase não sobra margem.</p></div>
 <div class="card"><h3>🏆 Prêmios do setor</h3><p>Vendido no mês pelo grupo: <b>${R$(mes)}</b>${prox?` · próximo prêmio: <b>${prox[1]}</b> com ${R$(prox[0])} (faltam ${R$(prox[0]-mes)})`:" · 🔥 nível máximo!"}</p>
 <div style="height:10px;background:#ffffff14;border-radius:6px;overflow:hidden"><div style="height:100%;width:${Math.min(100,mes/(prox?prox[0]:mes)*100)}%;background:#f5b301"></div></div>
 ${x.prem.map(p=>`<div style="font-size:13px;margin-top:4px">${new Date(p.t).toLocaleDateString("pt-BR")} · ${p.n} · bônus ${R$(p.b)}</div>`).join("")||`<p class="muted" style="font-size:12px;margin-top:6px">Os fornecedores premiam no fim de cada mês: R$ 1 mi, R$ 3 mi e R$ 6 mi em vendas.</p>`}</div>`}
function cardLoja(){let l;try{l=S.lojas[lojaSel]}catch(e){}if(!l||l.encerrada||l.tipo==="transp")return"";const x=X();const p=x.posto[l.id],m=x.mkt[l.id]||{seg:0,p:0},iv=x.inv[l.id];
 return `<div class="card"><h3>⛽ Posto de combustível</h3>${p?(S.simMs<p.pronto?`<p>🚧 Em obra, inaugura ${new Date(p.pronto).toLocaleDateString("pt-BR")}</p>`:`<p>Vendidos <b>${Math.round(p.lit).toLocaleString("pt-BR")} litros</b> · faturamento ${R$(p.fat||0)} · margem ~6,5%</p>`):`<p class="muted" style="font-size:13px">Posto junto da loja: vende diesel e gasolina (8 a 16 mil litros por dia) e traz cliente pra troca de óleo na pista.</p><button class="b g" onclick="v58posto(${l.id})">Construir posto – R$ 850 mil</button>`}</div>
 <div class="card"><h3>📱 Marketing digital</h3><p>Instagram/Google: <b>${(m.seg||0).toLocaleString("pt-BR")} seguidores</b> · plano: <b>${PLANO[m.p||0][0]}</b></p><div class="row" style="gap:6px;flex-wrap:wrap">${Object.entries(PLANO).map(([k,v])=>`<button class="b ${+k===(m.p||0)?"s":"g"}" onclick="v58plano(${l.id},${k})">${v[0]}${v[1]?` ${R$(v[1])}/mês (+${v[2]*100}%)`:""}</button>`).join("")}<button class="b g" onclick="v58post(${l.id})">📸 Postar promoção hoje</button></div></div>
 <div class="card"><h3>📋 Inventário</h3>${iv?`<p>Último: ${new Date(iv.t).toLocaleDateString("pt-BR")} · estoque ${R$(iv.tot)} · perdas <b style="color:#ef4444">${R$(iv.perda)}</b> · vencidos ${R$(iv.venc)}${iv.suspeita?" · ⚠️ perda acima do normal!":""}</p>`:""}<button class="b g" onclick="v58inv(${l.id})">Fazer inventário – R$ 3 mil</button></div>`}
function cardEquipe(){const x=X(),d=x.desv;const regs=[...new Set(lojas().map(l=>uf(l.cid)))];
 let h=`<div class="card"><h3>👔 Diretores regionais</h3><p class="muted" style="font-size:12px">Promova um gerente pra cuidar de todas as lojas do estado: +4% nas vendas da região, aprova sozinho os pedidos de equipamento e resolve as garantias. Custa +R$ 6 mil/mês de salário.</p>
 ${regs.map(r=>{const cur=S.func.find(f=>f.id===x.dir[r]);const gs=S.func.filter(f=>f.cargo==="ger"&&S.lojas[f.loja]&&uf(S.lojas[f.loja].cid)===r);return `<div class="row" style="gap:8px;flex-wrap:wrap;margin:6px 0"><b style="min-width:40px">${r}</b> ${cur?`Diretor: <b>${esc(cur.nome)}</b>`:`<span class="muted">sem diretor</span>`} <select id="v58dr${r}">${gs.map(f=>`<option value="${f.id}">${esc(f.nome)} (${esc(nl(f.loja))})</option>`).join("")}</select><button class="b g" onclick="v58dir('${r}')" ${gs.length?"":"disabled"}>${cur?"Trocar":"Promover"}</button></div>`}).join("")}</div>`;
 if(d&&!d.fim&&d.avisou){const sus=d.sus.map(id=>S.func.find(f=>f.id===id)).filter(Boolean);h+=`<div class="card" style="border:1px solid #ef444466"><h3>🕵️ Auditoria – desvio na ${esc(nl(d.loja))}</h3><p>Prejuízo até agora: <b style="color:#ef4444">${R$(d.perda)}</b> (continua todo dia até você resolver)</p>
  ${d.pistas.map(p=>`<div style="font-size:13px">🔎 ${esc(p)}</div>`).join("")}<p style="margin-top:8px"><b>Suspeitos:</b></p>${sus.map(f=>`<div class="row" style="gap:8px;margin:4px 0">${esc(f.nome)} <span class="muted">(${CGN[f.cargo]||f.cargo}, ${new Date(f.adm||S.simMs).getFullYear()})</span> <button class="b r" onclick="v58acusa(${f.id})">Acusar e demitir</button></div>`).join("")}
  ${d.aud?"":`<button class="b g" style="margin-top:8px" onclick="v58aud()">Contratar auditoria externa – R$ 12 mil (descobre quem é)</button>`}<p class="muted" style="font-size:12px">Dica: um inventário nessa loja também confirma o desvio.</p></div>`}
 return h}
const oV=W.venda;if(oV&&!oV.__v58){W.venda=function(l){const a=l&&l.venda?+l.venda.dia||0:0;const r=oV.apply(this,arguments);
 try{if(l&&l.venda){const d=(+l.venda.dia||0)-a;if(d>0){const x=X();let f=0;const m=x.mkt[l.id];if(m){f+=PLANO[m.p||0][2]+(m.boost>S.simMs?.02:0)+Math.min(.04,(m.seg||0)/250000)}if(x.posto[l.id]&&S.simMs>=x.posto[l.id].pronto)f+=.05;if(x.dir[uf(l.cid)])f+=.04;if(f){const ex=d*f;l.venda.dia+=ex;l.venda.mes=(l.venda.mes||0)+ex;S.lcx[l.id]=(S.lcx[l.id]||0)+ex*.4}}}}catch(e){}return r};W.venda.__v58=1}
let inst=false;function instala(){if(inst||typeof V==="undefined")return;inst=true;const w=(k,fn,antes)=>{if(!V[k])return;const o=V[k];V[k]=function(){const a=o.apply(this,arguments);let c="";try{c=fn()}catch(e){console.warn(e)}return antes?c+a:a+c}};
 w("chefe",cardChefe,false);w("loja",cardLoja,false);w("equipe",cardEquipe,true);try{render()}catch(e){}}
setTimeout(instala,12500);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;novaLic();contratos();postos();mktDia();diretores();desvio();premios()}catch(e){console.warn("v58",e)}},1000);
})();
