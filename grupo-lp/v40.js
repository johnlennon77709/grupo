// v40: Fretes – mural de cargas para seus caminhões (escolhe o frete mais vantajoso) + "buscar direto": caminhão vai no fornecedor e leva direto pra loja
(function(){const W=window,H=36e5,D=864e5;
const CIDS={"Porto Velho":[-8.76,-63.90],"Cacoal":[-11.44,-61.45],"Vilhena":[-12.74,-60.15],"Ji-Paraná":[-10.88,-61.95],"Ariquemes":[-9.91,-63.04],"Rio Branco":[-9.97,-67.81],"Cuiabá":[-15.60,-56.10],"Rondonópolis":[-16.47,-54.64],"Sinop":[-11.86,-55.50],"Sorriso":[-12.55,-55.71],"Lucas do Rio Verde":[-13.05,-55.91],"Campo Novo do Parecis":[-13.66,-57.89],"Manaus":[-3.12,-60.02],"Goiânia":[-16.68,-49.25],"Campo Grande":[-20.47,-54.62],"São Paulo":[-23.55,-46.63],"Campinas":[-22.90,-47.06],"Rio de Janeiro":[-22.91,-43.17],"Belo Horizonte":[-19.92,-43.94],"Curitiba":[-25.43,-49.27],"Paranaguá":[-25.52,-48.51],"Santos":[-23.96,-46.33],"Uberlândia":[-18.92,-48.28],"Brasília":[-15.79,-47.88]};
const CARGAS=[["Soja a granel","granel"],["Milho a granel","granel"],["Fertilizante","granel"],["Arroz ensacado","seca"],["Cimento","seca"],["Material de construção","seca"],["Lubrificantes (tambores)","seca"],["Eletrodomésticos","seca"],["Bebidas","seca"],["Madeira serrada","seca"],["Carne congelada","refrig"],["Combustível","tanque"],["Peças automotivas","seca"],["Algodão em pluma","seca"]];
function km(a,b){const A=CIDS[a]||pos(a),B=CIDS[b]||pos(b);if(!A||!B||a===b)return 15;const R=6371,t=x=>x*Math.PI/180,la1=A[0]??A.lat,lo1=A[1]??A.lon,la2=B[0]??B.lat,lo2=B[1]??B.lon,dl=t(la2-la1),dn=t(lo2-lo1),h=Math.sin(dl/2)**2+Math.cos(t(la1))*Math.cos(t(la2))*Math.sin(dn/2)**2;return Math.round(2*R*Math.asin(Math.sqrt(h))*1.3)}
function pos(c){if(typeof CID!=="undefined"&&CID[c])return[CID[c].lat,CID[c].lon];return null}
const hrs=k=>k<=600?k/65:k/65*2.4;
const pick=a=>a[Math.random()*a.length|0],rnd=(a,b)=>a+Math.random()*(b-a);
function base(){const t=S.lojas.find(l=>l.tipo==="transp"&&!l.encerrada);return t?t.cid:"Cacoal"}
function empT(){const t=S.lojas.find(l=>l.tipo==="transp"&&!l.encerrada);return t?t.emp:Object.keys(EMP)[0]}
function F(){if(!S.fr)S.fr={of:[],ativos:[],hist:[],ger:0};return S.fr}
function gera(){const f=F();if(S.simMs-f.ger<6*H&&f.of.length>=6)return;f.ger=S.simMs;f.of=f.of.filter(o=>o.vence>S.simMs);
 const cs=Object.keys(CIDS);while(f.of.length<10){const o=pick(cs);let d=pick(cs);if(d===o)continue;const [c,tp]=pick(CARGAS);const t=Math.round(rnd(8,37));const dist=km(o,d);
  const tarifa=rnd(.17,.27)*(tp==="refrig"?1.35:tp==="tanque"?1.25:1);const val=Math.round(dist*t*tarifa/10)*10+Math.round(rnd(800,2500));
  f.of.push({id:S.nid++,o,d,c,tp,t,dist,val,prazo:Math.ceil(hrs(dist)/24)+1+Math.round(rnd(0,2)),vence:S.simMs+rnd(1,3)*D,emb:pick(["Bunge","Amaggi","Cargill","Coamo","Votorantim","Ambev","Vibra","Magalu","JBS","ADM","Petrobras","Gerdau","Suzano"])})}}
function livres(){return S.frota.filter(v=>v.status==="Garagem"&&v.tipo!=="carro"&&v.tipo!=="implemento"&&v.tipo!=="carretinha")}
function capT(v){return v.tipo==="cavalo"?((S.frota.find(x=>x.tipo==="implemento"&&x.status==="Garagem")||{}).cap||1)*30:v.tipo==="rigido"?Math.max(8,(v.cap||.6)*25):v.tipo==="pickup"?1.2:10}
function custo(o,v){const vazio=km(base(),o.o)+km(o.d,base());const kmT=vazio+o.dist;const diesel=kmT/2.6*6.1;const ped=kmT*.18*(v&&v.tipo==="cavalo"?1.6:1);const dias=Math.ceil(hrs(kmT)/24)+1;const mot=dias*220;return{kmT,diesel,ped,mot,tot:diesel+ped+mot,dias}}
// andamento
function anda(){const f=F();f.ativos.slice().forEach(a=>{const v=S.frota.find(x=>x.id===a.v);while(a.i<a.par.length&&S.simMs>=a.par[a.i].t){const s=a.par[a.i];
  if(s.k==="col"){hist(`📦 ${v?v.placa:""} carregou ${a.t||""}${a.t?" t de ":""}${a.c} em ${s.c}`)}
  if(s.k==="ent"){if(a.tipo==="frete"){const e=empT();S.ecx[e]=(S.ecx[e]||0)+a.val;if(S.fat)S.fat.dia=(S.fat.dia||0);hist(`💰 Frete entregue em ${s.c}: ${a.c} – recebido ${R$(a.val)} (lucro ~${R$(a.val-a.custo)})`)}
   else{const l=S.lojas[a.loja];let un=0;(a.ped||[]).forEach(p=>p.itens.forEach(([i,q])=>{l.est[i]=(l.est[i]||0)+q;un+=q}));hist(`✅ ${v?v.placa:""} entregou direto em ${nomeLoja(l)}: ${un} un. de ${a.c}`)}}
  if(s.k==="fim"){if(v){v.status="Garagem";v.dest=null}const im=a.imp&&S.frota.find(x=>x.id===a.imp);if(im)im.status="Garagem";hist(`🏠 ${v?v.mod+" "+v.placa:"Caminhão"} voltou pra base`);f.ativos=f.ativos.filter(x=>x!==a);try{save()}catch(e){}return}
  a.i++}})}
function hist(t){const f=F();f.hist.unshift({t:S.simMs,x:t});f.hist=f.hist.slice(0,40);log(t)}
function rota(pontos){let t=S.simMs,cur=base();return pontos.map(([k,c,par])=>{t+=hrs(km(cur,c))*H;const r={k,c,t};t+=(par||0)*H;cur=c;return r})}
W.pegarFrete=function(id){const f=F(),o=f.of.find(x=>x.id===id);if(!o)return;const ls=livres();if(!ls.length)return alert("Nenhum caminhão livre na garagem.");
 const sel=document.getElementById("frv"+id);const v=S.frota.find(x=>x.id===+(sel&&sel.value))||ls[0];if(capT(v)<o.t)return alert(`${v.mod} não aguenta ${o.t} t (capacidade ~${Math.round(capT(v))} t). Escolha outro.`);
 let imp=null;if(v.tipo==="cavalo"){imp=S.frota.find(x=>x.tipo==="implemento"&&x.status==="Garagem");if(!imp)return alert("Esse cavalo precisa de uma carreta livre na garagem.");imp.status="Frete"}
 const c=custo(o,v);if(!confirm(`${v.mod} ${v.placa} vai levar ${o.t} t de ${o.c}\n${base()} → ${o.o} → ${o.d} → ${base()} (${c.kmT} km, ~${c.dias} dias)\nFrete: ${R$(o.val)} · custo estimado: ${R$(c.tot)} · lucro: ${R$(o.val-c.tot)}\n\nConfirmar?`))return;
 const e=empT();S.ecx[e]=(S.ecx[e]||0)-c.tot;if(S.fat)S.fat.desp=(S.fat.desp||0)+c.tot;
 v.status="Frete";f.ativos.push({id:o.id,tipo:"frete",v:v.id,imp:imp&&imp.id,c:o.c,t:o.t,val:o.val,custo:c.tot,par:rota([["col",o.o,1.5],["ent",o.d,1.5],["fim",base()]]),i:0});
 f.of=f.of.filter(x=>x!==o);hist(`🚛 ${v.mod} ${v.placa} pegou frete: ${o.t} t de ${o.c} (${o.emb}) ${o.o} → ${o.d} por ${R$(o.val)}`);save();render()};
W.buscarDireto=function(pid){const c=S.col;if(!c)return;const p=c.fila.find(x=>x.id===pid);if(!p)return;const ls=livres().sort((a,b)=>(b.cap||0)-(a.cap||0));if(!ls.length)return alert("Nenhum caminhão livre na garagem.");
 const v=ls[0];const fc=(FC[p.forn]||"São Paulo"),l=S.lojas[p.loja];if(!confirm(`${v.mod} ${v.placa} vai buscar em ${p.forn} (${fc}) e levar direto para ${nomeLoja(l)}?`))return;
 c.fila=c.fila.filter(x=>x!==p);v.status="Frete";F().ativos.push({id:p.id,tipo:"direto",v:v.id,c:p.forn,loja:p.loja,ped:[p],par:rota([["col",fc,1],["ent",l.cid,.5],["fim",base()]]),i:0});
 hist(`🚚 ${v.mod} ${v.placa} saiu pra buscar direto em ${p.forn} (${fc}) → ${nomeLoja(l)}`);save();render()};
const FC={"Vibra (Lubrax)":"Rio de Janeiro","Raízen (Shell)":"Rio de Janeiro","Ipiranga":"Rio de Janeiro","Petronas Lubrificantes":"Belo Horizonte","Moove (Mobil)":"Rio de Janeiro","Tecfil / Sofape":"São Paulo","Votorantim Cimentos":"Porto Velho","Gerdau":"Belo Horizonte","Tigre":"Curitiba","Suvinil":"São Paulo","Distribuidora Norte Materiais":"Cacoal","Bosch Autopeças":"Campinas","Pirelli/Distribuidor":"Campinas"};
function card(){gera();const f=F(),ls=livres(),hm=t=>new Date(t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
 const ofs=f.of.map(o=>{const c=custo(o,ls[0]);return{o,c,luc:o.val-c.tot}}).sort((a,b)=>b.luc/b.c.dias-a.luc/a.c.dias);const melhor=ofs[0]&&ofs[0].o.id;
 const opV=o=>ls.map(v=>`<option value="${v.id}" ${capT(v)<o.t?"disabled":""}>${esc(v.mod)} ${v.placa} (~${Math.round(capT(v))} t)</option>`).join("");
 const fila=(S.col&&S.col.fila)||[];
 return `<div class="card"><h3>🧾 Fretes disponíveis (mural de cargas)</h3><p class="muted" style="margin:0 0 8px">Seus caminhões não ficam parados: escolha a carga, o caminhão e veja o lucro antes de aceitar. Saída e volta pela base (${base()}). Caminhões livres: <b>${ls.length}</b></p>
 <div class="tw"><table><tr><th>Carga</th><th>Rota</th><th>km</th><th>Frete</th><th>Custo</th><th>Lucro</th><th>Dias</th><th>Caminhão</th><th></th></tr>
 ${ofs.map(({o,c,luc})=>`<tr ${o.id===melhor?'style="background:rgba(245,179,1,.08)"':""}><td>${o.id===melhor?"⭐ ":""}<b>${esc(o.c)}</b><br><span class="muted">${o.t} t · ${o.emb} · vence ${hm(o.vence)}</span></td><td>${o.o} → ${o.d}</td><td>${o.dist}</td><td><b>${R$(o.val)}</b></td><td>${R$(c.tot)}</td><td style="color:${luc>0?"#34d399":"#f87171"}"><b>${R$(luc)}</b></td><td>${c.dias}</td>
 <td>${ls.length?`<select id="frv${o.id}">${opV(o)}</select>`:'<span class="muted">sem caminhão</span>'}</td><td>${ls.length?`<button class="b g" onclick="pegarFrete(${o.id})">Pegar</button>`:""}</td></tr>`).join("")}</table></div>
 <p class="muted" style="font-size:12px">⭐ = melhor lucro por dia de viagem. Custo = diesel + pedágio + diária do motorista, contando ida vazia até a origem e volta pra base.</p>
 ${f.ativos.length?`<h3 style="margin-top:12px">🚛 Em viagem</h3>${f.ativos.map(a=>{const v=S.frota.find(x=>x.id===a.v);const s=a.par[Math.min(a.i,a.par.length-1)];return `<div style="padding:6px 0;border-bottom:1px solid #ffffff12"><b>${v?esc(v.mod)+" "+v.placa:""}</b> – ${a.tipo==="frete"?esc(a.c)+" · "+R$(a.val):"busca direta "+esc(a.c)} · próxima parada: <b>${s.c}</b> (${{col:"coleta",ent:"entrega",fim:"volta à base"}[s.k]}) em ${hm(s.t)}</div>`}).join("")}`:""}
 ${fila.length?`<h3 style="margin-top:12px">📦 Mercadoria grande / urgente: buscar direto e levar pra loja</h3>${fila.map(p=>`<div class="row sb" style="padding:6px 0;border-bottom:1px solid #ffffff12"><span>${esc(p.forn)} → <b>${esc(nomeLoja(S.lojas[p.loja]))}</b> · ${p.itens.length} itens · ${R$(p.tot||0)}</span><button class="b" onclick="buscarDireto(${p.id})">🚚 Buscar direto</button></div>`).join("")}`:""}
 ${f.hist.length?`<details style="margin-top:8px"><summary class="muted">Histórico de viagens</summary>${f.hist.slice(0,15).map(h=>`<div class="muted" style="font-size:12px">${hm(h.t)} · ${esc(h.x)}</div>`).join("")}</details>`:""}</div>`}
setInterval(()=>{try{if(typeof S!=="undefined"&&S&&S.frota){gera();anda()}}catch(e){console.warn(e)}},1000);
let ok=false;setTimeout(()=>{if(ok)return;ok=true;if(typeof V!=="undefined"&&V.frota){const o=V.frota;V.frota=function(){return card()+o.apply(this,arguments)}}},3000);
})();
