// v38: logística própria – o comprador monta os pedidos, o caminhão grande sai da base, passa fornecedor por fornecedor,
// volta pra base, faz o transbordo pro caminhão pequeno e ele entrega loja por loja
(function(){const W=window,H=36e5;
const FCID={"Vibra (Lubrax)":["Duque de Caxias - RJ",-22.785,-43.311],"Raízen (Shell)":["Rio de Janeiro - RJ",-22.81,-43.20],"Ipiranga":["Rio de Janeiro - RJ",-22.88,-43.25],"Petronas Lubrificantes":["Contagem - MG",-19.93,-44.05],"Moove (Mobil)":["Rio de Janeiro - RJ",-22.86,-43.25],"Tecfil / Sofape":["Guarulhos - SP",-23.45,-46.53],"Votorantim Cimentos":["Porto Velho",-8.76,-63.90],"Gerdau":["Ouro Branco - MG",-20.52,-43.69],"Tigre":["Joinville - SC",-26.30,-48.85],"Suvinil":["São Bernardo do Campo - SP",-23.69,-46.56],"Distribuidora Norte Materiais":["Cacoal",-11.44,-61.45],"Bosch Autopeças":["Campinas - SP",-22.90,-47.06],"Pirelli/Distribuidor":["Campinas - SP",-22.90,-47.06]};
const PT={};Object.values(FCID).forEach(([n,la,lo])=>PT[n]={lat:la,lon:lo});
const cidF=n=>FCID[n]?FCID[n][0]:"São Paulo - SP";PT["São Paulo - SP"]={lat:-23.55,lon:-46.63};
const pos=c=>CID[c]||PT[c];
function km(a,b){const A=pos(a),B=pos(b);if(!A||!B||a===b)return 8;const R=6371,t=x=>x*Math.PI/180,dl=t(B.lat-A.lat),dn=t(B.lon-A.lon),h=Math.sin(dl/2)**2+Math.cos(t(A.lat))*Math.cos(t(B.lat))*Math.sin(dn/2)**2;return Math.round(2*R*Math.asin(Math.sqrt(h))*1.3)}
const hrs=k=>k<=600?k/65:k/65*2.4; // viagem longa: motorista roda ~10h por dia
function C(){if(!S.col)S.col={on:true,fila:[],rota:null,hist:[]};return S.col}
function base(){const t=S.lojas.find(l=>l.tipo==="transp"&&!l.encerrada);return t?t.cid:S.lojas[0].cid}
function livres(){return S.frota.filter(v=>v.status==="Garagem"&&!["implemento","carretinha","carro"].includes(v.tipo))}
function grande(){const ls=livres().sort((a,b)=>(b.cap||0)-(a.cap||0));return ls[0]}
function pequeno(ex){const ls=livres().filter(v=>v!==ex).sort((a,b)=>(a.cap||0)-(b.cap||0));return ls.find(v=>v.tipo==="rigido"||v.tipo==="pickup")||ls[0]||ex}
function ordem(ini,lista,cidDe){const out=[],rest=lista.slice();let cur=ini;while(rest.length){rest.sort((a,b)=>km(cur,cidDe(a))-km(cur,cidDe(b)));const x=rest.shift();out.push(x);cur=cidDe(x)}return out}
function hist(t){const c=C();c.hist.unshift({t:S.simMs,x:t});c.hist=c.hist.slice(0,40);log(t)}
// 1) pedidos novos do comprador entram na fila de coleta (não vêm mais pelo fornecedor)
function captura(){const c=C();if(!S.compras)S.compras=[];const arr=S.compras;if(arr.__v38)return;const orig=Array.prototype.push;
 arr.push=function(...xs){const cc=C(),tem=S.frota.some(v=>!["implemento","carretinha","carro"].includes(v.tipo));const dir=[];
  xs.forEach(p=>{if(cc.on&&tem&&p&&p.itens&&!p.v38d){p.v38=1;p.v24=1;p.desde=S.simMs;cc.fila.push(p)}else dir.push(p)});return orig.apply(this,dir)};
 Object.defineProperty(arr,"__v38",{value:1,enumerable:false});arr.push.toJSON=undefined}
// 2) monta a rota de coleta
function inicia(){const c=C();if(c.rota||!c.fila.length)return;const h=new Date(S.simMs).getHours();if(h<6||h>16)return;
 const velho=Math.min(...c.fila.map(p=>p.desde||S.simMs));if(c.fila.length<3&&S.simMs-velho<2*H)return;
 const g=grande();if(!g)return;const p=pequeno(g);const b=base();const carga=c.fila.splice(0);
 const forns=[...new Set(carga.map(x=>x.forn))];const seq=ordem(b,forns,cidF);let t=S.simMs,cur=b;const par=[];
 seq.forEach(f=>{const d=km(cur,cidF(f));t+=hrs(d)*H;par.push({tipo:"forn",nome:f,cid:cidF(f),t,km:d});t+=.75*H;cur=cidF(f)});
 const d=km(cur,b);t+=hrs(d)*H;par.push({tipo:"base",nome:"Base "+b,cid:b,t,km:d});
 c.rota={fase:"coleta",g:g.id,p:p.id,carga,par,i:0,ini:S.simMs};g.status="Coleta";g.dest=null;
 hist(`🚛 ${g.mod} ${g.placa} saiu da base (${b}) para coletar ${carga.length} pedido(s) em ${seq.length} fornecedor(es): ${seq.join(" → ")}`)}
// 3) andamento
function anda(){const c=C(),r=c.rota;if(!r)return;const g=S.frota.find(v=>v.id===r.g),pq=S.frota.find(v=>v.id===r.p)||g;
 while(r.i<r.par.length&&S.simMs>=r.par[r.i].t){const s=r.par[r.i];
  if(s.tipo==="forn"){const ps=r.carga.filter(x=>x.forn===s.nome);hist(`📦 ${g?g.placa:""} chegou em ${s.nome} (${s.cid}, ${s.km} km): carregou ${ps.length} pedido(s)`)}
  else if(s.tipo==="base"&&r.fase==="coleta"){hist(`🏁 ${g?g.mod+" "+g.placa:"Caminhão"} voltou pra base. Transbordo para ${pq.mod} ${pq.placa}`);if(g&&g!==pq)g.status="Garagem";
   const b=base(),lojas=[...new Set(r.carga.map(x=>x.loja))].map(id=>S.lojas[id]).filter(Boolean);const seq=ordem(b,lojas,l=>l.cid);let t=S.simMs+1*H,cur=b;const par=[];
   seq.forEach(l=>{const d=km(cur,l.cid);t+=hrs(d)*H;par.push({tipo:"loja",nome:nomeLoja(l),loja:l.id,cid:l.cid,t,km:d});t+=.5*H;cur=l.cid});const d=km(cur,b);t+=hrs(d)*H;par.push({tipo:"fim",nome:"Base "+b,cid:b,t,km:d});
   r.fase="entrega";r.par=par;r.i=-1;pq.status="Entregando";hist(`🚚 ${pq.mod} ${pq.placa} saiu para entregar: ${seq.map(l=>nomeLoja(l)).join(" → ")}`)}
  else if(s.tipo==="loja"){const l=S.lojas[s.loja];const ps=r.carga.filter(x=>x.loja===s.loja);let un=0;ps.forEach(p=>p.itens.forEach(([i,q])=>{l.est[i]=(l.est[i]||0)+q;un+=q}));hist(`✅ ${pq.placa} entregou em ${s.nome}: ${ps.length} pedido(s), ${un} un.`)}
  else if(s.tipo==="fim"){pq.status="Garagem";if(g)g.status="Garagem";hist(`🏠 ${pq.mod} ${pq.placa} voltou pra base. Rota concluída`);c.rota=null;try{save()}catch(e){}return}
  r.i++}}
// segurança: caminhão sumiu/vendido → entrega direta
function seguro(){const c=C(),r=c.rota;if(r&&!S.frota.some(v=>v.id===r.g)&&!S.frota.some(v=>v.id===r.p)){r.carga.forEach(p=>{p.chega=S.simMs;p.v24=1;p.v38d=1;S.compras.push(p)});c.rota=null}}
setInterval(()=>{try{if(typeof S!=="undefined"&&S&&S.frota)captura()}catch(e){}},50);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;inicia();anda();seguro()}catch(e){console.warn(e)}},1000);
W.togColeta=function(){const c=C();c.on=!c.on;if(!c.on){c.fila.forEach(p=>{p.chega=S.simMs;p.v24=1;p.v38d=1;S.compras.push(p)});c.fila=[]}save();render()};
function card(){const c=C(),r=c.rota;const g=r&&S.frota.find(v=>v.id===r.g),p=r&&S.frota.find(v=>v.id===r.p);
 const hm=t=>new Date(t).toLocaleString("pt-BR",{day:"2-digit",hour:"2-digit",minute:"2-digit"});
 return `<div class="card"><h3>🔁 Logística própria (coleta nos fornecedores)</h3><div class="row sb" style="flex-wrap:wrap;gap:8px"><span class="muted">${c.on?"Ligada: o comprador monta os pedidos, o caminhão grande coleta nos fornecedores e o pequeno entrega nas lojas.":"Desligada: os fornecedores entregam direto nas lojas."}</span><button class="b ${c.on?"r":"g"}" onclick="togColeta()">${c.on?"Desligar":"Ligar"}</button></div>
 <p style="margin:8px 0">Pedidos aguardando coleta: <b>${c.fila.length}</b>${c.fila.length?` (${[...new Set(c.fila.map(x=>x.forn))].join(", ")})`:""}</p>
 ${r?`<p><b>${r.fase==="coleta"?"🚛 Coletando":"🚚 Entregando"}</b> – ${r.fase==="coleta"?(g?g.mod+" "+g.placa:""):(p?p.mod+" "+p.placa:"")}</p><div class="tw"><table><tr><th>Parada</th><th>Cidade</th><th>Previsão</th><th></th></tr>${r.par.map((s,i)=>`<tr><td>${esc(s.nome)}</td><td>${s.cid}</td><td>${hm(s.t)}</td><td>${i<r.i||S.simMs>=s.t?"✅":i===Math.max(0,r.i)?"🚚 a caminho":"⏳"}</td></tr>`).join("")}</table></div>`:`<p class="muted">Nenhuma rota em andamento. Fornecedores ficam nas fábricas reais (RJ, SP, MG, SC): viagens longas levam vários dias. A rota sai entre 6h e 16h quando há 3+ pedidos ou o mais antigo espera 2h.</p>`}
 ${c.hist.length?`<details><summary class="muted">Histórico</summary>${c.hist.slice(0,15).map(h=>`<div class="muted" style="font-size:12px">${hm(h.t)} · ${esc(h.x)}</div>`).join("")}</details>`:""}</div>`}
let ok=false;setTimeout(()=>{if(ok)return;ok=true;["frota","estoque"].forEach(k=>{if(typeof V!=="undefined"&&V[k]){const o=V[k];V[k]=function(){return card()+o.apply(this,arguments)}}})},2500);
})();
