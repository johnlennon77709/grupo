// v64: entregas no interior – pedidos dos vendedores pra cidades pequenas/fazendas; você seleciona, carrega,
// o caminhão sai no dia seguinte às 6h, faz as entregas e no fim você decide: voltar pra loja ou ir pra Cacoal.
(function(){const W=window,H=36e5,D=24*H;const pk=a=>a[Math.random()*a.length|0],ri=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const A=()=>W.v52api;const sv=()=>{try{save()}catch(e){}try{render()}catch(e){}};
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
const hm=t=>new Date(t).toLocaleString("pt-BR",{weekday:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"});
const INT={"Ministro Andreazza":["RO",-11.20,-61.52],"Espigão d'Oeste":["RO",-11.53,-61.01],"Alta Floresta d'Oeste":["RO",-11.93,-61.99],"Nova Brasilândia d'Oeste":["RO",-11.72,-62.31],"Presidente Médici":["RO",-11.17,-61.90],"Urupá":["RO",-11.13,-62.36],"São Miguel do Guaporé":["RO",-11.69,-62.71],"Seringueiras":["RO",-11.80,-63.02],"Costa Marques":["RO",-12.44,-64.23],"Chupinguaia":["RO",-12.56,-60.90],"Corumbiara":["RO",-12.96,-61.30],"Cerejeiras":["RO",-13.19,-60.81],"Colorado do Oeste":["RO",-13.12,-60.54],"Candeias do Jamari":["RO",-8.79,-63.70],"Itapuã do Oeste":["RO",-9.20,-63.18],"Nova Mamoré":["RO",-10.41,-65.33],"Theobroma":["RO",-10.25,-62.35],"Vale do Paraíso":["RO",-10.45,-62.13],"Sapezal":["MT",-12.99,-58.76],"Campos de Júlio":["MT",-13.72,-59.27],"Comodoro":["MT",-13.66,-59.79],"Diamantino":["MT",-14.41,-56.44],"Nova Mutum":["MT",-13.83,-56.08],"Castanheira":["MT",-11.13,-58.61],"Juruena":["MT",-10.32,-58.36],"Cotriguaçu":["MT",-9.86,-58.42],"Nobres":["MT",-14.72,-56.33],"Tangará da Serra":["MT",-14.62,-57.49],"Senador Guiomard":["AC",-10.15,-67.74],"Plácido de Castro":["AC",-10.33,-67.18],"Xapuri":["AC",-10.65,-68.50],"Brasiléia":["AC",-11.01,-68.74],"Bujari":["AC",-9.82,-67.95]};
function addCid(){if(typeof CID==="undefined")return;Object.entries(INT).forEach(([c,[u,a,o]])=>{if(!CID[c])CID[c]={uf:u,lat:a,lon:o}})}
const CLI=["Fazenda Santa Rita","Fazenda Bom Jesus","Oficina do Nego","Auto Mecânica Irmãos","Transportadora local","Posto Trevo","Retífica São José","Fazenda Primavera","Madeireira do Vale","Prefeitura (garagem)","Cerealista","Fazenda Três Marias","Borracharia Central","Mecânica Diesel"];
function X(){S.v64=S.v64||{};const x=S.v64;x.ped=x.ped||[];x.ext=x.ext||{};x.loc=x.loc||{};return x}
function perto(l){const a=A();return Object.keys(INT).filter(c=>INT[c][0]===((CID[l.cid]||{}).uf)).map(c=>({c,d:a?a.km(l.cid,c):999})).filter(z=>z.d<=380).sort((p,q)=>p.d-q.d)}
function novoPed(l,cli,v,pago,quem){const ps=perto(l);if(!ps.length)return;const c=pk(ps.slice(0,8)).c;const x=X();x.ped.push({id:S.nid++,loja:l.id,cid:c,cli,v,pago:!!pago,quem:quem||"",t:S.simMs,st:"pend"})}
// pedidos vindos dos vendedores externos (v57) + pedidos por telefone das fazendas
function gera(){addCid();const x=X();const e=(S.v57&&S.v57.ext)||{};Object.entries(e).forEach(([fid,r])=>{if(x.ext[fid]===r.t)return;x.ext[fid]=r.t;const f=(S.func||[]).find(z=>z.id===+fid);const l=f&&S.lojas[f.loja];if(!l)return;
  r.vis.filter(z=>z.v>0).forEach(z=>novoPed(l,z.c,z.v,true,f.nome))});
 const d=new Date(S.simMs).toDateString();if(x.gD===d)return;const h=new Date(S.simMs).getHours();if(h<9)return;x.gD=d;
 S.lojas.filter(l=>!l.encerrada&&l.tipo==="loja").forEach(l=>{const n=Math.random()<.5?ri(0,3):0;for(let i=0;i<n;i++){const vend=(S.func||[]).filter(f=>f.loja===l.id&&["vend","vext","ger"].includes(f.cargo));novoPed(l,pk(CLI),ri(3,45)*500,false,vend.length?pk(vend).nome:"")}});
 x.ped.filter(p=>p.st==="pend"&&!p.pago&&S.simMs-p.t>7*D).forEach(p=>{p.st="cancel";try{log(`❌ ${p.cli} (${p.cid}) cancelou o pedido de ${R$(p.v)}: ninguém entregou em 7 dias`)}catch(e){}})}
// montar a viagem
const SK=()=>{W.__v64sel=W.__v64sel||{};return W.__v64sel};
W.v64tog=function(id,el){SK()[id]=el.checked};
W.v64sai=function(lid){const a=A();if(!a)return;const x=X();const sel=x.ped.filter(p=>p.st==="pend"&&p.loja===lid&&SK()[p.id]!==false);if(!sel.length)return toast("Marque os pedidos");
 const vid=+document.getElementById("v64v"+lid).value;const v=S.frota.find(z=>z.id===vid);if(!v||v.status!=="Garagem")return toast("Escolha um caminhão livre");const l=S.lojas[lid];
 const d=new Date(S.simMs);d.setDate(d.getDate()+1);d.setHours(6,0,0,0);const sai=d.getTime();const de=x.loc[v.id]||a.base();
 const cids=[...new Set(sel.map(p=>p.cid))];const ord=a.ordem(l.cid,cids,c=>c);
 const st=[];if(de!==l.cid)st.push({tipo:"ir",nome:"Ir até "+nl(lid),cid:l.cid,par:0});st.push({tipo:"carga",nome:"Carregar em "+nl(lid),cid:l.cid,par:.8});
 ord.forEach(c=>{const ps=sel.filter(p=>p.cid===c);st.push({tipo:"ent",nome:`${c} (${ps.map(p=>p.cli).join(", ")})`,cid:c,par:.4*ps.length,ped:ps.map(p=>p.id)})});
 let t=sai,cur=de;const par=st.map(s=>{const k=a.km(cur,s.cid);t+=(k<=600?k/65:k/65*2.4)*H;const o=Object.assign({},s,{c:s.cid,t,km:k});t+=(s.par||.5)*H;cur=s.cid;return o});
 sel.forEach(p=>{p.st="carregado";p.v_=v.id});const r={id:S.nid++,k:"int",v:v.id,carga:[],par,i:0,c:"entregas no interior",loja:lid,sai,feitas:0};a.G().rotas.push(r);v.status="Entregando";
 a.H_(`🚜 ${v.mod} ${v.placa} carregado com ${sel.length} pedido(s) pro interior de ${l.cid} – sai ${hm(sai)}: ${ord.join(" → ")}`);sv()};
// acompanhar entregas
function anda(){const a=A();if(!a)return;const x=X();a.G().rotas.filter(r=>r.k==="int").forEach(r=>{const v=S.frota.find(z=>z.id===r.v);
 r.par.forEach((s,i)=>{if(s.tipo==="ent"&&!s.ok&&S.simMs>=s.t){s.ok=1;(s.ped||[]).forEach(id=>{const p=x.ped.find(z=>z.id===id);if(!p||p.st==="entregue")return;p.st="entregue";p.te=S.simMs;const l=S.lojas[p.loja];
   if(!p.pago&&l){l.venda.dia=(l.venda.dia||0)+p.v;l.venda.mes=(l.venda.mes||0)+p.v;S.lcx[l.id]=(S.lcx[l.id]||0)+p.v*.35}r.feitas++});try{log(`✅ ${v?v.placa:""} entregou em ${s.cid}: ${s.nome.replace(/^.*?\(/,"").replace(/\)$/,"")}`)}catch(e){}}});
 if(r.i>=r.par.length&&!r.fimAviso){r.fimAviso=1;r.espera=1;const u=r.par[r.par.length-1];try{log(`🏁 ${v?v.mod+" "+v.placa:""} terminou as entregas em ${u.cid}. Decida na aba Frota: voltar pra loja ou ir pra Cacoal.`)}catch(e){}}})}
W.v64volta=function(rid,dest){const a=A();if(!a)return;const r=a.G().rotas.find(z=>z.id===rid);if(!r||!r.espera)return;const v=S.frota.find(z=>z.id===r.v);const u=r.par[r.par.length-1];const cid=dest==="loja"?S.lojas[r.loja].cid:"Cacoal";
 const k=a.km(u.cid,cid);r.par.push({tipo:"fim",nome:dest==="loja"?"Voltar pra "+nl(r.loja):"Ir pra Cacoal",cid,c:cid,t:S.simMs+(k<=600?k/65:k/65*2.4)*H,km:k,par:0});r.espera=0;X().loc[r.v]=cid;
 a.H_(`↩️ ${v?v.placa:""} ${dest==="loja"?"voltando pra "+nl(r.loja):"indo pra Cacoal"} (${k} km)`);sv()};
// tela
function card(){addCid();const a=A();if(!a)return"";const x=X();const pend=x.ped.filter(p=>p.st==="pend");const livres=a.livres();const rotas=a.G().rotas.filter(r=>r.k==="int");
 let h=`<div class="card" style="border:1px solid #22c55e55"><h3>🚜 Entregas no interior</h3><p class="muted" style="font-size:12px">Pedidos que os vendedores fecharam com fazendas, oficinas e cidades pequenas. Marque os pedidos, escolha o caminhão: ele carrega e sai <b>amanhã às 6h</b>. Quando terminar, você decide se volta pra loja ou vai pra Cacoal. Pedido sem entrega em 7 dias é cancelado pelo cliente.</p>`;
 rotas.forEach(r=>{const v=S.frota.find(z=>z.id===r.v);const ents=r.par.filter(s=>s.tipo==="ent");const ok=ents.filter(s=>s.ok).length;
  h+=`<div style="padding:10px;margin:8px 0;border-radius:10px;background:#ffffff0a"><b>${v?esc(v.mod)+" "+v.placa:""}</b> – interior de ${esc(nl(r.loja))} · ${S.simMs<r.sai?`⏰ sai ${hm(r.sai)}`:`entregas ${ok}/${ents.length}`}<div class="muted" style="font-size:12px">${ents.map(s=>`${s.ok?"✅":"⬜"} ${esc(s.cid)} <span style="opacity:.7">${hm(s.t)}</span>`).join(" · ")}</div>
  ${r.espera?`<div style="margin-top:6px">🏁 Terminou em <b>${esc(r.par[r.par.length-1].cid)}</b>. Pra onde vai?<div class="row" style="gap:6px;margin-top:4px;flex-wrap:wrap"><button class="b g" onclick="v64volta(${r.id},'loja')">Voltar pra ${esc(nl(r.loja))}</button><button class="b g" onclick="v64volta(${r.id},'cac')">Ir pra Cacoal</button></div></div>`:""}</div>`});
 const lojasP=[...new Set(pend.map(p=>p.loja))];if(!lojasP.length)h+=`<p class="muted">Nenhum pedido pro interior esperando entrega.</p>`;
 lojasP.forEach(lid=>{const ps=pend.filter(p=>p.loja===lid);const tot=ps.reduce((s,p)=>s+p.v,0);
  h+=`<div style="padding:10px 0;border-top:1px solid #ffffff14"><b>${esc(nl(lid))}</b> – ${ps.length} pedido(s) · ${R$(tot)}
  ${ps.map(p=>`<label style="display:flex;gap:8px;align-items:flex-start;margin:4px 0"><input type="checkbox" ${SK()[p.id]===false?"":"checked"} onchange="v64tog(${p.id},this)"><span><b>${esc(p.cli)}</b> – ${esc(p.cid)} · ${R$(p.v)} <span class="muted" style="font-size:11px">${p.quem?"vendeu: "+esc(p.quem)+" · ":""}${a.km(S.lojas[lid].cid,p.cid)} km · pedido ${hm(p.t)}${p.pago?" · já faturado":""}</span></span></label>`).join("")}
  <div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap"><select id="v64v${lid}">${livres.length?livres.map(v=>`<option value="${v.id}">${esc(v.mod)} ${v.placa}${X().loc[v.id]?" (em "+esc(X().loc[v.id])+")":""}</option>`).join(""):`<option value="">Nenhum caminhão livre</option>`}</select><button class="b g" onclick="v64sai(${lid})" ${livres.length?"":"disabled"}>📦 Carregar – sai amanhã 6h</button></div></div>`});
 return h+`</div>`}
let inst=false;function instala(){if(inst||typeof V==="undefined"||!V.frota||!A())return;inst=true;const o=V.frota;V.frota=function(){const r=o.apply(this,arguments);let c="";try{c=card()}catch(e){console.warn(e)}return c+r};try{render()}catch(e){}}
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;instala();gera();anda()}catch(e){console.warn("v64",e)}},1500);
})();
