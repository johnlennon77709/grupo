// v52: pedidos grandes (R$100 mil a R$1 mi), CDs em Cacoal e Cuiabá com transbordo, Acre direto,
// equipamentos por loja (pago com o caixa da loja), funcionários pedem equipamentos, relatório diário por loja,
// remove o passeio 3D dentro das lojas.
(function(){const W=window,H=36e5,D=24*H;
const PT={"Vibra (Lubrax)":"Duque de Caxias - RJ","Raízen (Shell)":"Rio de Janeiro - RJ","Ipiranga":"Rio de Janeiro - RJ","Petronas Lubrificantes":"Contagem - MG","Moove (Mobil)":"Rio de Janeiro - RJ","Tecfil / Sofape":"Guarulhos - SP","Votorantim Cimentos":"Porto Velho","Gerdau":"Ouro Branco - MG","Tigre":"Joinville - SC","Suvinil":"São Bernardo do Campo - SP","Distribuidora Norte Materiais":"Cacoal","Bosch Autopeças":"Campinas - SP","Pirelli/Distribuidor":"Campinas - SP"};
const XY={"Duque de Caxias - RJ":[-22.785,-43.311],"Rio de Janeiro - RJ":[-22.86,-43.25],"Contagem - MG":[-19.93,-44.05],"Guarulhos - SP":[-23.45,-46.53],"Ouro Branco - MG":[-20.52,-43.69],"Joinville - SC":[-26.30,-48.85],"São Bernardo do Campo - SP":[-23.69,-46.56],"Campinas - SP":[-22.90,-47.06],"São Paulo - SP":[-23.55,-46.63],"Cacoal":[-11.44,-61.45],"Cuiabá":[-15.60,-56.10],"Porto Velho":[-8.76,-63.90],"Rio Branco":[-9.97,-67.81]};
const cidF=n=>PT[n]||"São Paulo - SP";
const ll=c=>{if(typeof CID!=="undefined"&&CID[c])return[CID[c].lat,CID[c].lon];return XY[c]||null};
function km(a,b){const A=ll(a),B=ll(b);if(!A||!B||a===b)return 8;const t=x=>x*Math.PI/180,dl=t(B[0]-A[0]),dn=t(B[1]-A[1]),h=Math.sin(dl/2)**2+Math.cos(t(A[0]))*Math.cos(t(B[0]))*Math.sin(dn/2)**2;return Math.round(2*6371*Math.asin(Math.sqrt(h))*1.3)}
const hrs=k=>k<=600?k/65:k/65*2.4;
const MT=["Cuiabá","Campo Novo do Parecis","Juína","Brasnorte","Sinop","Sorriso","Lucas do Rio Verde","Rondonópolis","Várzea Grande","Tangará da Serra","Primavera do Leste","Cáceres","Barra do Garças"],AC=["Rio Branco","Cruzeiro do Sul","Sena Madureira","Tarauacá","Feijó"];
const uf=c=>{if(typeof CID!=="undefined"&&CID[c]&&CID[c].uf)return CID[c].uf;return MT.includes(c)?"MT":AC.includes(c)?"AC":"RO"};
const CDN={cac:"CD Cacoal",cui:"CD Cuiabá"},CDC={cac:"Cacoal",cui:"Cuiabá"};
function extras(){return (S.lg&&S.lg.cdx||[])}
function syncCD(){extras().forEach(c=>{const k="x"+c.cid;CDN[k]="CD "+c.cid;CDC[k]=c.cid;if(S.lg&&S.lg.cd&&!S.lg.cd[k])S.lg.cd[k]=[]})}
const reg=l=>{const u=uf(l.cid);let k=u==="MT"?"cui":"cac",d=km(l.cid,CDC[k]);extras().forEach(c=>{const e=km(l.cid,c.cid);if(e<=450&&e<d){d=e;k="x"+c.cid}});return k};
const hm=t=>new Date(t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
const hh=t=>new Date(t).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const dia=t=>new Date(t).toLocaleDateString("pt-BR");
function G(){if(!S.lg)S.lg={fila:[],cd:{cac:[],cui:[]},rotas:[],hist:[],eq:{},ped:[],rel:{},ult:0};const g=S.lg;g.cd=g.cd||{cac:[],cui:[]};g.eq=g.eq||{};g.ped=g.ped||[];g.rel=g.rel||{};g.rotas=g.rotas||[];return g}
const base=()=>{const t=S.lojas.find(l=>l.tipo==="transp"&&!l.encerrada);return t?t.cid:"Cacoal"};
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
function H_(x){const g=G();g.hist.unshift({t:S.simMs,x});g.hist=g.hist.slice(0,60);try{log(x)}catch(e){}}
// ---------------- relatório por loja ----------------
function R(id){const g=G(),k=dia(S.simMs);g.rel[id]=g.rel[id]||{};const r=g.rel[id];if(!r[k])r[k]={v:0,n:0,h:{},ab:null,fe:null,ev:[]};
 const ks=Object.keys(r);if(ks.length>7){ks.sort((a,b)=>{const p=s=>s.split("/").reverse().join("");return p(a)<p(b)?-1:1}).slice(0,ks.length-7).forEach(x=>delete r[x])}return r[k]}
function ev(id,x){if(id==null||!S.lojas[id])return;const r=R(id);r.ev.push([S.simMs,x]);if(r.ev.length>200)r.ev.splice(0,r.ev.length-200)}
const oLog=W.log;if(oLog&&!oLog.__v52){W.log=function(m){try{const s=String(m);if(!/^(📦 .*chegou em|✅ .*entregou)/.test(s)||true)S.lojas.forEach(l=>{if(!l.encerrada&&s.includes(nl(l.id)))ev(l.id,s.replace(/<[^>]*>/g,""))})}catch(e){}return oLog.apply(this,arguments)};W.log.__v52=1}
const oV=W.venda;if(oV&&!oV.__v52){W.venda=function(l){const a=l&&l.venda?+l.venda.dia||0:0;const r=oV.apply(this,arguments);try{if(l&&l.venda){const b=+l.venda.dia||0;if(b>a){const x=R(l.id);x.v+=b-a;x.n++;const h=new Date(S.simMs).getHours();x.h[h]=(x.h[h]||0)+(b-a);if(!x.ab)x.ab=S.simMs;x.fe=S.simMs}}}catch(e){}return r};W.venda.__v52=1}
// ---------------- pedidos grandes ----------------
function custo(i){try{return prod(i).custo||0}catch(e){return 0}}
function engorda(p){if(p.v52)return;p.v52=1;const g=G();
 const igual=g.fila.find(x=>x!==p&&x.loja===p.loja&&x.forn===p.forn);if(igual){p.itens.forEach(([i,q])=>{const e=igual.itens.find(z=>z[0]===i);if(e)e[1]+=q;else igual.itens.push([i,q])});igual.tot=(igual.tot||0)+(p.tot||0);p.__fund=1;return}
 g.big=g.big||{};const bk=p.loja+"|"+p.forn;if(g.big[bk]&&S.simMs-g.big[bk]<7*D)return;g.big[bk]=S.simMs;
 const alvo=Math.round((100000+Math.pow(Math.random(),2)*900000)/1000)*1000;const tot0=p.itens.reduce((a,[i,q])=>a+custo(i)*q,0)||p.tot||1;
 if(tot0<alvo){const f=alvo/tot0;p.itens=p.itens.map(([i,q])=>[i,Math.max(q,Math.ceil(q*f))]);const novo=p.itens.reduce((a,[i,q])=>a+custo(i)*q,0);const extra=Math.max(0,novo-(p.tot||0));
  if(extra>0){try{addConta(`Pedido grande ${p.forn} – ${nl(p.loja)}`,extra,S.simMs+30*D,"Fornecedores",p.forn);S.contas[S.contas.length-1].loja=p.loja}catch(e){}}p.tot=(p.tot||0)+extra}
 const un=p.itens.reduce((a,x)=>a+x[1],0);H_(`🧾 ${p.por||"Comprador"} fechou pedido grande com ${p.forn} para ${nl(p.loja)}: ${p.itens.length} produtos, ${un.toLocaleString("pt-BR")} un. – ${R$(p.tot)}`)}
function puxa(){if(!S.col||!S.col.fila||!S.col.fila.length)return;const g=G();const xs=S.col.fila.splice(0);const velhos=!g.ini;g.ini=1;xs.forEach(p=>{p.desde=p.desde||S.simMs;if(velhos)p.v52=1;g.fila.push(p);engorda(p)});g.fila=g.fila.filter(p=>!p.__fund)}
// ---------------- caminhões ----------------
const ocup=()=>new Set(G().rotas.map(r=>r.v));
function livres(){const o=ocup();return S.frota.filter(v=>v.status==="Garagem"&&!o.has(v.id)&&!["implemento","carretinha","carro"].includes(v.tipo))}
function ordem(ini,lista,cidDe){const out=[],rest=lista.slice();let cur=ini;while(rest.length){rest.sort((a,b)=>km(cur,cidDe(a))-km(cur,cidDe(b)));const x=rest.shift();out.push(x);cur=cidDe(x)}return out}
function monta(stops,ini){let t=S.simMs,cur=ini;return stops.map(s=>{const d=km(cur,s.cid);t+=hrs(d)*H;const o=Object.assign({},s,{c:s.cid,t,km:d});t+=(s.par||.6)*H;cur=s.cid;return o})}
function saiColeta(){const g=G();syncCD();if(!g.fila.length)return;const h=new Date(S.simMs).getHours();if(h<6||h>16)return;
 const lv=livres().sort((a,b)=>(b.cap||0)-(a.cap||0));const velho=Math.min(...g.fila.map(p=>p.desde||S.simMs));
 if(!lv.length){if(S.simMs-velho>2*D){g.fila.splice(0).forEach(p=>{p.chega=S.simMs+D;p.v24=1;p.v38d=1;S.compras.push(p)});H_("⚠️ Sem caminhão livre há 2 dias: fornecedores vão entregar direto nas lojas")}return}
 if(g.fila.length<2&&S.simMs-velho<3*H)return;
 const v=lv[0],b=base(),carga=g.fila.splice(0);const forns=ordem(b,[...new Set(carga.map(p=>p.forn))],cidF);
 const st=forns.map(f=>({tipo:"forn",nome:f,cid:cidF(f),par:1}));
 const ks=[...new Set(carga.filter(p=>S.lojas[p.loja]).map(p=>reg(S.lojas[p.loja])))].filter(k=>k!=="cac"&&k!=="acre");
 ordem(st.length?st[st.length-1].cid:b,ks,k=>CDC[k]).forEach(k=>st.push({tipo:"cd",cd:k,nome:CDN[k],cid:CDC[k],par:1.5}));
 const acre=[...new Set(carga.filter(p=>S.lojas[p.loja]&&reg(S.lojas[p.loja])==="acre").map(p=>p.loja))];
 ordem(st.length?st[st.length-1].cid:b,acre.map(i=>S.lojas[i]),l=>l.cid).forEach(l=>st.push({tipo:"loja",loja:l.id,nome:nl(l.id),cid:l.cid,par:1}));
 st.push({tipo:"cd",cd:"cac",nome:CDN.cac,cid:"Cacoal",par:1,fim:1});
 const r={id:S.nid++,k:"coleta",v:v.id,carga,par:monta(st,b),i:0,c:"coleta nos fornecedores"};g.rotas.push(r);v.status="Coleta";
 H_(`🚛 ${v.mod} ${v.placa} saiu de ${b} para coletar ${carga.length} pedido(s) (${R$(carga.reduce((a,p)=>a+(p.tot||0),0))}): ${forns.join(" → ")}${acre.length?" → Acre direto":""}`)}
function saiDist(cd){const g=G(),q=g.cd[cd];if(!q.length)return;const h=new Date(S.simMs).getHours();if(h<6||h>16)return;
 const lv=livres().sort((a,b)=>(a.cap||0)-(b.cap||0));if(!lv.length){const velho=Math.min(...q.map(p=>p.noCD||S.simMs));if(S.simMs-velho>2*D){q.splice(0).forEach(p=>{p.chega=S.simMs+6*H;p.v24=1;p.v38d=1;S.compras.push(p)});H_(`⚠️ ${CDN[cd]} sem caminhão livre há 2 dias: transportadora terceirizada vai entregar`)}return}
 const v=lv.find(x=>x.tipo==="rigido"||x.tipo==="pickup")||lv[0],b=base(),carga=q.splice(0);const st=[];
 if(cd!=="cac")st.push({tipo:"pega",nome:CDN[cd]+" (carregar)",cid:CDC[cd],par:1.5});
 const ls=[...new Set(carga.map(p=>p.loja))].map(i=>S.lojas[i]).filter(Boolean);ordem(CDC[cd],ls,l=>l.cid).forEach(l=>st.push({tipo:"loja",loja:l.id,nome:nl(l.id),cid:l.cid,par:.6}));
 st.push({tipo:"fim",nome:"Base "+b,cid:b,par:0});
 const r={id:S.nid++,k:"dist",cd,v:v.id,carga,par:monta(st,cd==="cac"?"Cacoal":b),i:0,c:cd!=="cac"?"buscar no "+CDN[cd]+" e entregar":"entregas a partir do CD Cacoal"};g.rotas.push(r);v.status="Entregando";
 H_(`🚚 ${v.mod} ${v.placa} saiu ${cd!=="cac"?"de "+b+" para buscar mercadoria no "+CDN[cd]:"do CD Cacoal"} – entregas: ${ls.map(l=>nl(l.id)).join(" → ")}`)}
function entrega(r,s,v){const l=S.lojas[s.loja];if(!l)return;const ps=r.carga.filter(p=>p.loja===s.loja&&!p.ok);let un=0,val=0;
 ps.forEach(p=>{p.ok=1;val+=p.tot||0;p.itens.forEach(([i,q])=>{l.est[i]=(l.est[i]||0)+q;un+=q})});if(ps.length)H_(`✅ ${v?v.placa:""} entregou em ${nl(l.id)}: ${ps.length} pedido(s), ${un.toLocaleString("pt-BR")} un. (${R$(val)})`)}
function anda(){const g=G();g.rotas.slice().forEach(r=>{const v=S.frota.find(x=>x.id===r.v);
 if(!v){r.carga.filter(p=>!p.ok&&!p.noCD).forEach(p=>{p.chega=S.simMs+D;p.v24=1;p.v38d=1;S.compras.push(p)});g.rotas.splice(g.rotas.indexOf(r),1);return}
 while(!r.pausa&&r.i<r.par.length&&S.simMs>=r.par[r.i].t){const s=r.par[r.i];if(s.tipo==="decide"){r.pausa=1;H_(`⏸️ ${v.placa} chegou em Porto Velho com carga pro Acre. Decida na aba Frota: seguir pra Rio Branco ou deixar no depósito.`);return}
  if(s.tipo==="forn"){const n=r.carga.filter(p=>p.forn===s.nome).length;H_(`📦 ${v.placa} carregou ${n} pedido(s) na ${s.nome} (${s.cid})`)}
  else if(s.tipo==="cd"){const ps=r.carga.filter(p=>!p.ok&&!p.noCD&&S.lojas[p.loja]&&reg(S.lojas[p.loja])===s.cd);ps.forEach(p=>{p.noCD=S.simMs;g.cd[s.cd].push(p)});
   if(ps.length)H_(`🏬 ${v.placa} descarregou ${ps.length} pedido(s) no ${s.nome} (lojas: ${[...new Set(ps.map(p=>nl(p.loja)))].join(", ")})`);
   if(s.fim){r.carga.filter(p=>!p.ok&&!p.noCD).forEach(p=>{p.noCD=S.simMs;g.cd.cac.push(p)});v.status="Garagem";H_(`🏁 ${v.mod} ${v.placa} chegou no CD Cacoal. Coleta concluída`);g.rotas.splice(g.rotas.indexOf(r),1);return}}
  else if(s.tipo==="pega")H_(`📥 ${v.placa} carregou no ${s.nome.replace(" (carregar)","")}`);
  else if(s.tipo==="loja")entrega(r,s,v);
  else if(s.tipo==="fim"){v.status="Garagem";H_(`🏠 ${v.mod} ${v.placa} voltou pra base`);g.rotas.splice(g.rotas.indexOf(r),1);return}
  r.i++}})}
// ---------------- equipamentos ----------------
const EQ=[["oleo","Oficina / troca de óleo",[["chaves","Jogo de chaves completo",1800],["filtro","Chaves de filtro (kit)",650],["coletor","Coletor de óleo usado 75L",1900],["bomba","Bomba de óleo pneumática",2600],["elev","Elevador automotivo 4t",19000],["rampa","Rampa de troca de óleo",7500],["macaco","Macaco jacaré 3t",1700],["impacto","Chave de impacto pneumática",1500],["compr","Compressor de ar 200L",8900],["lava","Lavadora de alta pressão",3200],["fosso","Fosso de troca de óleo (obra)",28000]]],
 ["est","Estoque",[["empi","Empilhadeira",125000],["paleteira","Paleteira hidráulica",3800],["porta","Estante porta-palete (módulo)",5200],["balanca","Balança 300kg",2300],["leitor","Leitor de código de barras",650],["carrinho","Carrinho de carga",900]]],
 ["esc","Escritório",[["pc","Computador",4200],["impr","Impressora multifuncional",1400],["mesa","Mesa + cadeira",1600],["ar","Ar-condicionado 18.000 BTU",3600],["cofre","Cofre",2800],["tel","Celular corporativo",1900],["pdv","Caixa PDV completo",5500]]]];
const ALL={};EQ.forEach(([c,n,xs])=>xs.forEach(([k,nm,p])=>ALL[k]={k,nm,p,c}));
let lojaSel52=null;
function compra(id,k,quem){const g=G(),e=ALL[k];if(!e||!S.lojas[id])return false;S.lcx=S.lcx||{};S.lcx[id]=(S.lcx[id]||0)-e.p;g.eq[id]=g.eq[id]||{};g.eq[id][k]=(g.eq[id][k]||0)+1;
 try{log(`🧰 Comprado ${e.nm} para ${nl(id)} – ${R$(e.p)} (pago pelo caixa da loja)${quem?" – pedido de "+quem:""}`)}catch(x){}return true}
W.v52compra=function(id,k){if(compra(+id,k)){toast("Comprado para "+nl(+id));try{save()}catch(e){}render()}};
W.v52loja=function(v){lojaSel52=+v;render()};
// funcionário pede equipamento
const CQ={est:["est"],ger:["est","esc","oleo"],mec:["oleo"],adm:["esc"],caixa:["esc"],fin:["esc"],comp:["esc","est"],aux:["oleo","est"]};
function pedeEquip(){const g=G();const d=dia(S.simMs);if(g.ult===d)return;const h=new Date(S.simMs).getHours();if(h<8||h>17)return;g.ult=d;
 S.lojas.forEach(l=>{if(l.encerrada||Math.random()>.18)return;if(g.ped.some(p=>p.loja===l.id&&p.st==="pend"))return;
  const fs=(S.func||[]).filter(f=>f.loja===l.id&&CQ[f.cargo]);if(!fs.length)return;const f=fs[Math.floor(Math.random()*fs.length)];
  let pool=CQ[f.cargo].flatMap(c=>EQ.find(x=>x[0]===c)[2].map(x=>x[0]));if(l.tipo!=="loja"&&l.tipo!=="transp")pool=pool.filter(k=>ALL[k].c!=="oleo");
  const tem=g.eq[l.id]||{};pool=pool.filter(k=>!tem[k]||Math.random()<.15);if(!pool.length)return;
  const n=Math.min(pool.length,2+Math.floor(Math.random()*4)),its=[];while(its.length<n){const k=pool[Math.floor(Math.random()*pool.length)];if(!its.includes(k))its.push(k)}
  const p={id:S.nid++,loja:l.id,fid:f.id,quem:f.nome,itens:its,t:S.simMs,st:"pend"};g.ped.push(p);g.ped=g.ped.slice(-40);
  const tot=its.reduce((a,k)=>a+ALL[k].p,0);
  try{const t=novaThread("papo",f.id,`${f.nome} – ${(typeof CG!=="undefined"&&CG[f.cargo])||f.cargo}`,"🧰");t.fid=f.id;
   msgAdd(t,"ele",`Chefe, aqui na ${esc(nl(l.id))} tá precisando disso:<br>${its.map(k=>`• ${ALL[k].nm} – ${R$(ALL[k].p)}`).join("<br>")}<br><b>Total: ${R$(tot)}</b> (sai do caixa da loja)<br><button class="b g" onclick="v52ped(${p.id},1)">✅ Comprar tudo</button> <button class="b s" onclick="v52ped(${p.id},0)">Agora não</button>`)}catch(e){}
  ev(l.id,`🧰 ${f.nome} pediu equipamentos (${its.map(k=>ALL[k].nm).join(", ")})`)})}
W.v52ped=function(id,sim){const g=G(),p=g.ped.find(x=>x.id===id);if(!p||p.st!=="pend")return toast("Esse pedido já foi resolvido");p.st=sim?"ok":"nao";
 if(sim)p.itens.forEach(k=>compra(p.loja,k,p.quem));const f=(S.func||[]).find(x=>x.id===p.fid);
 if(f){f.moral=Math.max(0,Math.min(100,(f.moral||70)+(sim?8:-5)));try{const t=novaThread("papo",f.id,`${f.nome}`,"🧰");msgAdd(t,"eu",sim?"Pode comprar tudo.":"Agora não.");msgAdd(t,"ele",sim?"Valeu, chefe! Já chegou tudo aqui, vai ajudar demais 💪":"Tudo bem, chefe. A gente se vira por enquanto.")}catch(e){}}
 toast(sim?"Equipamentos comprados":"Pedido recusado");try{save()}catch(e){}render()};
// ---------------- telas ----------------
function cardLog(){const g=G();const tot=g.fila.reduce((a,p)=>a+(p.tot||0),0);
 const lin=r=>{const v=S.frota.find(x=>x.id===r.v);const s=r.par[Math.min(r.i,r.par.length-1)];return `<tr><td>${r.k==="coleta"?"🚛 Coleta":"🚚 Entrega"}</td><td>${v?esc(v.mod)+" "+v.placa:""}</td><td>${esc(s.nome)} (${s.cid})</td><td>${hm(s.t)}</td></tr>`};
 return `<div class="card"><h3>🔁 Logística: fornecedores → CDs → lojas</h3>
 <p class="muted" style="font-size:13px">O comprador fecha pedidos grandes (R$ 100 mil a R$ 1 mi). O caminhão grande coleta nos fornecedores, deixa a carga de MT no <b>CD Cuiabá</b>, entrega o <b>Acre direto</b> e descarrega o resto no <b>CD Cacoal</b>. Outros caminhões levam dos CDs para as lojas.</p>
 <div class="row" style="gap:14px;flex-wrap:wrap;margin:6px 0"><span>Pedidos aguardando coleta: <b>${g.fila.length}</b> (${R$(tot)})</span>${Object.keys(g.cd).map(k=>`<span>${CDN[k]||k}: <b>${g.cd[k].length}</b> pedido(s)</span>`).join("")}</div>
 ${g.rotas.length?`<div class="tw"><table><tr><th>Viagem</th><th>Caminhão</th><th>Próxima parada</th><th>Chega</th></tr>${g.rotas.map(lin).join("")}</table></div>`:`<p class="muted">Nenhum caminhão em rota de logística agora.</p>`}
 ${g.hist.length?`<details><summary class="muted">Histórico</summary>${g.hist.slice(0,25).map(h=>`<div class="muted" style="font-size:12px">${hm(h.t)} · ${esc(h.x)}</div>`).join("")}</details>`:""}</div>`}
function lojasAt(){return S.lojas.filter(l=>!l.encerrada)}
function sel(fn){if(lojaSel52==null||!S.lojas[lojaSel52]||S.lojas[lojaSel52].encerrada)lojaSel52=lojasAt()[0].id;return `<select onchange="${fn}(this.value)">${lojasAt().map(l=>`<option value="${l.id}" ${l.id===lojaSel52?"selected":""}>${esc(nl(l.id))}</option>`).join("")}</select>`}
V.equip=function(){const g=G(),id=(sel("v52loja"),lojaSel52),tem=g.eq[id]||{},cx=(S.lcx||{})[id]||0;const pend=g.ped.filter(p=>p.st==="pend");
 const totG=Object.values(S.lcx||{}).reduce((a,b)=>a+b,0);
 return `<div class="card"><div class="row sb" style="flex-wrap:wrap;gap:8px"><h3 style="margin:0">🧰 Equipamentos por loja</h3><span class="muted">Caixa total das lojas: <b>${R$(totG)}</b></span></div>
 <div class="row" style="gap:10px;flex-wrap:wrap;margin-top:10px">Loja: ${sel("v52loja")} <span>Caixa desta loja: <b style="color:${cx<0?"#ef4444":"#22c55e"}">${R$(cx)}</b></span></div>
 <p class="muted" style="font-size:13px">Tudo que você compra aqui sai do caixa <b>desta loja</b> e fica só nela.</p></div>
 ${pend.length?`<div class="card"><h3>📋 Pedidos dos funcionários</h3>${pend.map(p=>`<div style="padding:8px 0;border-bottom:1px solid #ffffff14"><b>${esc(p.quem)}</b> – ${esc(nl(p.loja))}<br><span class="muted">${p.itens.map(k=>ALL[k].nm).join(", ")} · ${R$(p.itens.reduce((a,k)=>a+ALL[k].p,0))}</span><div class="row" style="gap:6px;margin-top:6px"><button class="b g" onclick="v52ped(${p.id},1)">Comprar tudo</button><button class="b s" onclick="v52ped(${p.id},0)">Recusar</button></div></div>`).join("")}</div>`:""}
 ${EQ.map(([c,n,xs])=>`<div class="card"><h3>${n}</h3><div class="tw"><table><tr><th>Item</th><th>Preço</th><th>Tem</th><th></th></tr>${xs.map(([k,nm,p])=>`<tr><td>${nm}</td><td>${R$(p)}</td><td>${tem[k]||0}</td><td><button class="b g" onclick="v52compra(${id},'${k}')">Comprar</button></td></tr>`).join("")}</table></div></div>`).join("")}`};
let diaSel=null;W.v52dia=function(v){diaSel=v;render()};W.v52lojaR=function(v){lojaSel52=+v;diaSel=null;render()};
V.relat=function(){const g=G();const s=sel("v52lojaR"),id=lojaSel52;const rr=g.rel[id]||{};const ds=Object.keys(rr).sort((a,b)=>{const p=x=>x.split("/").reverse().join("");return p(a)<p(b)?1:-1});
 if(!diaSel||!rr[diaSel])diaSel=ds[0];const r=diaSel&&rr[diaSel];const l=S.lojas[id];
 const head=`<div class="card"><h3>📑 Relatório da loja</h3><div class="row" style="gap:10px;flex-wrap:wrap">Loja: ${s} ${ds.length?`Dia: <select onchange="v52dia(this.value)">${ds.map(d=>`<option ${d===diaSel?"selected":""}>${d}</option>`).join("")}</select>`:""}</div></div>`;
 if(!r)return head+`<div class="card"><p class="muted">Ainda não tem registro desta loja. O relatório começa a ser montado a partir de agora, com tudo o que acontecer.</p></div>`;
 const mx=Math.max(1,...Object.values(r.h));const horas=[];for(let i=6;i<=22;i++)horas.push(i);
 return head+`<div class="card"><h3>${esc(nl(id))} – ${diaSel}</h3>
 <div class="row" style="gap:18px;flex-wrap:wrap;margin:6px 0"><div>🔓 Abriu (1ª venda)<br><b>${r.ab?hh(r.ab):"—"}</b></div><div>🔒 Fechou (última venda)<br><b>${r.fe?hh(r.fe):"—"}</b></div><div>🧾 Vendas<br><b>${r.n}</b></div><div>💰 Faturamento<br><b>${R$(r.v)}</b></div><div>🎯 Ticket médio<br><b>${R$(r.n?r.v/r.n:0)}</b></div><div>🏦 Caixa agora<br><b>${R$((S.lcx||{})[id]||0)}</b></div></div>
 <div style="display:flex;align-items:flex-end;gap:3px;height:110px;margin-top:12px">${horas.map(i=>`<div title="${i}h: ${R$(r.h[i]||0)}" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%"><div style="width:100%;background:#f5b301;border-radius:3px 3px 0 0;height:${Math.round((r.h[i]||0)/mx*90)}px"></div><div class="muted" style="font-size:10px">${i}</div></div>`).join("")}</div></div>
 <div class="card"><h3>🕒 Tudo o que aconteceu (${r.ev.length})</h3>${r.ev.length?r.ev.slice().reverse().map(([t,x])=>`<div style="font-size:13px;padding:4px 0;border-bottom:1px solid #ffffff10"><span class="muted">${hh(t)}</span> · ${esc(x)}</div>`).join(""):`<p class="muted">Nenhum evento registrado.</p>`}</div>`};
W.v52api={km,reg,CDN,CDC,syncCD,G,monta,livres,ordem,nl,H_,base};
// ---------------- instalação ----------------
let inst=false;function instala(){if(inst||typeof ABAS==="undefined"||typeof V==="undefined")return;inst=true;
 ABAS.equip=["🧰","Equipamentos"];ABAS.relat=["📑","Relatórios"];if(ABAS.loja)ABAS.loja[1]="Lojas";
 ["frota","estoque"].forEach(k=>{if(V[k]){const o=V[k];V[k]=function(){return cardLog()+o.apply(this,arguments)}}});try{nav()}catch(e){}}
function limpa(){document.querySelectorAll("h3").forEach(h=>{if(/^🔁 Logística própria \(coleta/.test(h.textContent.trim())){const c=h.closest(".card");if(c)c.remove()}});
 const cv=document.querySelector("main canvas, #main canvas, canvas");if(cv&&typeof aba!=="undefined"&&aba==="loja"){let c=cv.closest(".card");if(c&&!c.__v52){c.__v52=1;c.style.display="none"}}}
setTimeout(()=>{instala();try{render()}catch(e){}},8500);
setInterval(()=>{try{if(typeof S!=="undefined"&&S&&S.frota)puxa()}catch(e){}},100);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;puxa();syncCD();saiColeta();anda();pedeEquip();limpa()}catch(e){console.warn("v52",e)}},700);
})();
