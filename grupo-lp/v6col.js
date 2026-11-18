// v6col: caminhões buscam mercadoria nas fábricas dos fornecedores e trazem ao CD da Lubriporto Transportes (Cacoal)
(function(){
const W=window;
const FAB=[ // nome, cidade/UF, lat, lon, marcas, seg
 ["Petrobras Lubrax – Fábrica de Lubrificantes","Duque de Caxias/RJ",-22.71,-43.27,["Lubrax"],"lub"],
 ["Shell / Raízen – Planta Ilha do Governador","Rio de Janeiro/RJ",-22.81,-43.21,["Shell"],"lub"],
 ["Ipiranga Lubrificantes – Planta Rio","Rio de Janeiro/RJ",-22.86,-43.25,["Ipiranga"],"lub"],
 ["Moove (Mobil) – Planta Ilha do Governador","Rio de Janeiro/RJ",-22.80,-43.20,["Mobil"],"lub"],
 ["Castrol – Planta Rio","Rio de Janeiro/RJ",-22.87,-43.30,["Castrol"],"lub"],
 ["Petronas Lubrificantes Brasil","Contagem/MG",-19.93,-44.05,["Petronas","Selenia"],"lub"],
 ["YPF Brasil (Elaion)","Diadema/SP",-23.69,-46.62,["Elaion"],"lub"],
 ["Valvoline Brasil","Duque de Caxias/RJ",-22.70,-43.30,["Valvoline"],"lub"],
 ["Chevron (Havoline)","Rio de Janeiro/RJ",-22.84,-43.28,["Havoline"],"lub"],
 ["Vox Lubrificantes","Paulínia/SP",-22.76,-47.15,["Vox","Fortlub","Uni","Motul"],"lub"],
 ["Distribuidora de Filtros e Baterias (Tecfil/Moura/Heliar)","Guarulhos/SP",-23.45,-46.53,null,"lub"],
 ["Votorantim Cimentos – Porto Velho","Porto Velho/RO",-8.76,-63.90,null,"const"],
 ["Gerdau – Centro de Distribuição","Cuiabá/MT",-15.60,-56.10,null,"const"]
];
function ini(){S.cd=S.cd||{};S.colHist=S.colHist||[]}
function base(){return S.lojas.find(x=>x.tipo==="transp")}
function fabProds(i){const f=FAB[i];return S.prods.filter(p=>p.seg===f[5]&&(!f[4]||f[4].includes(p.marca))&&(f[4]||!["Lubrax","Shell","Ipiranga","Mobil","Castrol","Petronas","Elaion","Valvoline","Havoline","Vox","Fortlub","Uni","Motul","Selenia"].includes(p.marca)))}
function capV(v,im){return (v.tipo==="cavalo"?0:v.cap)+(im?im.cap:0)}
W.colPrev=function(){const fi=+cF.value,v=S.frota.find(x=>x.id===+cV.value),im=window.cI&&cI.value?S.frota.find(x=>x.id===+cI.value):null;if(!v)return;const f=FAB[fi],km=Math.round(dist(base(),{lat:f[2],lon:f[3]})),ps=fabProds(fi),cap=capV(v,im);const itens=ps.map(p=>[p.id,Math.round(r(40,120)*cap*(p.cat==="bat"||p.cat==="agreg"||p.cat==="tij"?.3:1))]),val=itens.reduce((a,[i,q])=>a+prod(i).custo*q*.92,0);W._colItens=itens;
 cP.innerHTML=`📍 ${f[1]} – <b>${km.toLocaleString("pt-BR")} km</b> de Cacoal (ida e volta ${(km*2).toLocaleString("pt-BR")} km, ~${Math.ceil(km*2/650)} dias)<br>📦 ${ps.length} produtos · ${itens.reduce((a,x)=>a+x[1],0).toLocaleString("pt-BR")} unidades · mercadoria <b>${R$(val)}</b> (8% mais barato que comprar do distribuidor)<br>⛽ Diesel estimado ${R$(km*2/consumo(v)*DIESEL)}`};
W.coletar=function(){ini();const fi=+cF.value,v=S.frota.find(x=>x.id===+cV.value),iid=window.cI&&cI.value?+cI.value:null,im=iid&&S.frota.find(x=>x.id===iid),m=S.func.find(x=>x.id===+cM.value),pg=cG.value;
 if(!v||!m)return toast("Escolha caminhão e motorista");if(v.tipo==="cavalo"&&!im)return toast("Cavalo mecânico precisa de carreta");if(!motLivre(m))return toast("Motorista indisponível");
 colPrev();const itens=W._colItens,val=Math.round(itens.reduce((a,[i,q])=>a+prod(i).custo*q*.92,0)*100)/100,f=FAB[fi];
 if(pg==="vista"){const v2=val*.97;if((S.caixaGrupo+(window.LIMNEG?LIMNEG():0))<v2)return toast("Caixa insuficiente");S.caixaGrupo-=v2;log(`💸 Pago à vista (Pix/TED) ${R$(v2)} para ${f[0]} (3% de desconto)`)}
 else{const n=pg==="b28"?1:3;for(let k=0;k<n;k++)addConta(`Mercadoria ${f[0]} (${k+1}/${n})`,val/n,S.simMs+(28+k*14)*DIA,"Fornecedor",f[0])}
 const km=Math.max(15,dist(base(),{lat:f[2],lon:f[3]}));v.tanqueL=tanque(v);if(v.comb==null)v.comb=v.tanqueL;
 Object.assign(v,{status:"Viagem",dest:base().id,col:{fab:fi,nome:f[0],cid:f[1]},dist:Math.round(km),kmRest:km,itens,engate:im?im.id:null,mot:m.id,dirCont:0,dirJor:0,ref:false,irreg:false,sobrepeso:Math.random()<.05});if(im)im.status="Engatada";
 v.diario=[];fase(v,"carregando",ri(20,40),`🏭 Saindo de Cacoal (vazio) para buscar mercadoria em ${f[0]} – ${f[1]} (${Math.round(km)} km) – ${m.nome}`);
 log(`🏭 ${v.mod} ${v.placa} foi buscar mercadoria em ${f[0]} (${f[1]}) • ${m.nome}`);fecha&&fecha();render()};
// estado: na fábrica carrega e volta; na garagem descarrega no CD
const oT=W.tickCaminhao;W.tickCaminhao=function(v){if(v.col&&v.status==="Viagem"&&v.fase==="descarregando"){if(S.simMs<v.faseAte)return;v.fase="rodando";v.faseAte=0;v.status="Retornando";v.kmRest=v.dist;v.sobrepeso=Math.random()<.12;diario(v,`📦 Carregou ${v.itens.reduce((a,x)=>a+x[1],0)} volumes na ${v.col.nome} – voltando para Cacoal`);log(`📦 ${v.placa} carregado na ${v.col.nome}, voltando para Cacoal`);return}
 if(v.col&&v.status==="Viagem"&&v.fase==="rodando"&&v.kmRest<=1.2){v.kmRest=0;fase(v,"descarregando",ri(120,300),`🏭 Chegou na ${v.col.nome} – aguardando carregamento na doca`);return}
 return oT.apply(this,arguments)};
const oF=W.fimViagem;W.fimViagem=function(v){const c=v.col;oF.apply(this,arguments);if(c){ini();let tot=0;(v.itens||[]).forEach(([id,q])=>{S.cd[id]=(S.cd[id]||0)+q;tot+=q});v.col=null;v.itens=[];S.colHist.unshift({d:S.simMs,placa:v.placa,fab:c.nome,q:tot});S.colHist=S.colHist.slice(0,30);log(`📥 ${v.placa} descarregou ${tot.toLocaleString("pt-BR")} volumes da ${c.nome} no CD da Lubriporto Transportes`);toast("Mercadoria chegou no CD de Cacoal!")}};
// entregas para as lojas usam primeiro o estoque do CD (não compra de novo)
const oI=W.iniciarViagem;W.iniciarViagem=function(v,l){ini();const ok=oI.apply(this,arguments);if(ok&&v.itens){let dev=0;v.itens.forEach(it=>{const t=Math.min(it[1],S.cd[it[0]]||0);if(t>0){S.cd[it[0]]-=t;dev+=t*prod(it[0]).custo}});if(dev>0){S.caixaGrupo+=dev;diario(v,`🏬 Mercadoria saiu do CD de Cacoal (economia ${R$(dev)})`);log(`🏬 Carga para ${nomeLoja(l)} saiu do CD (economizou ${R$(dev)} em compras)`)}}return ok};
W.cdParaLoja=function(){ini();const l=S.lojas[+cdL.value];let n=0;Object.keys(S.cd).forEach(id=>{const p=prod(id);if(!p||p.seg!==segDe(l)||!S.cd[id])return;const q=Math.min(S.cd[id],Math.ceil(S.cd[id]/3));l.est[id]=(l.est[id]||0)+q;S.cd[id]-=q;n+=q});toast(n?`Separado ${n} volumes – entregue pela van local`:"Nada no CD para essa loja");render()};
// tela na Frota
const oV=V.frota;V.frota=function(){ini();const h=oV.apply(this,arguments),imp=S.frota.filter(v=>v.status==="Garagem"&&(v.tipo==="implemento"||v.tipo==="carretinha")),mots=motoristas().filter(motLivre);
 const cdIt=Object.entries(S.cd).filter(([i,q])=>q>0&&prod(i)),cdQ=cdIt.reduce((a,x)=>a+x[1],0),cdV=cdIt.reduce((a,[i,q])=>a+prod(i).custo*q,0);
 const viag=S.frota.filter(v=>v.col);
 return `<div class="card"><h3>🏭 Buscar mercadoria nas fábricas dos fornecedores</h3>
 <div class="muted">O caminhão sai vazio de Cacoal, carrega na fábrica e traz para o CD da Lubriporto Transportes. Depois as entregas para as lojas usam o estoque do CD.</div>
 <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:8px">
 <label>Fábrica<select id="cF" onchange="colPrev()">${FAB.map((f,i)=>`<option value="${i}">${f[0]} – ${f[1]}</option>`).join("")}</select></label>
 <label>Caminhão<select id="cV" onchange="colPrev()">${S.frota.filter(v=>v.status==="Garagem"&&["cavalo","rigido","leve"].includes(v.tipo)).map(v=>`<option value="${v.id}">${v.mod} ${v.placa}</option>`).join("")||"<option>Nenhum na garagem</option>"}</select></label>
 <label>Carreta/implemento<select id="cI" onchange="colPrev()"><option value="">— nenhum —</option>${imp.map(v=>`<option value="${v.id}">${v.mod} ${v.placa}</option>`).join("")}</select></label>
 <label>Motorista<select id="cM">${mots.map(f=>`<option value="${f.id}">${f.nome}</option>`).join("")||"<option>Nenhum livre</option>"}</select></label>
 <label>Pagamento ao fornecedor<select id="cG"><option value="vista">À vista Pix/TED (-3%)</option><option value="b28">Boleto 28 dias</option><option value="b3x">Boleto 28/42/56 dias</option></select></label></div>
 <div id="cP" class="muted" style="margin:8px 0">Escolha o caminhão para ver a estimativa.</div><button class="b" onclick="coletar()">🚛 Mandar buscar</button></div>
 <div class="card"><h3>🏬 CD Lubriporto Transportes – Cacoal</h3><div class="kpis"><div class="kpi"><span>Volumes</span><b>${cdQ.toLocaleString("pt-BR")}</b></div><div class="kpi"><span>Valor em estoque</span><b>${K$(cdV)}</b></div><div class="kpi"><span>Em coleta</span><b>${viag.length}</b></div></div>
 ${viag.map(v=>`<div class="muted">🚛 ${v.placa} – ${v.status==="Viagem"?"indo para":"voltando de"} ${v.col.nome} · faltam ${Math.round(v.kmRest)} km · ${FASES[v.fase]||"🛣️ Rodando"}</div>`).join("")}
 <div style="margin-top:6px">Mandar parte do CD para loja (van local): <select id="cdL">${S.lojas.map((l,i)=>l.tipo==="transp"?"":`<option value="${i}">${nomeLoja(l)}</option>`).join("")}</select> <button class="b s" onclick="cdParaLoja()">Enviar</button></div>
 ${cdIt.length?`<details style="margin-top:6px"><summary>Ver itens do CD (${cdIt.length})</summary><table>${cdIt.slice(0,200).map(([i,q])=>`<tr><td>${esc(prod(i).nome)}</td><td>${q}</td></tr>`).join("")}</table></details>`:""}
 ${S.colHist.slice(0,5).map(x=>`<div class="muted">${new Date(x.d).toLocaleDateString("pt-BR")} – ${x.placa} trouxe ${x.q} volumes da ${esc(x.fab)}</div>`).join("")}</div>`+h};
})();
