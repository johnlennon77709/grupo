// v16: comprar ou alugar barracão pronto para qualquer empresa (inclusive as criadas no jogo) direto na aba Lojas 3D e em Empresas
(function(){const W=window;let OF=[];
const qIni=p=>Math.max(2,Math.min(40,Math.round(2500/p.custo)));
const tamanhos=[["Barracão pequeno",ri.bind(null,300,600)],["Barracão médio",ri.bind(null,700,1500)],["Barracão grande",ri.bind(null,1800,4000)]];
function ofertas(cid){return tamanhos.map(([n,f])=>{const m2=f(),pm=precoM2(cid)*r(2.1,2.8),val=Math.round(m2*pm/1000)*1000;
 return{n,m2,val,alug:Math.round(val*r(.0055,.0075)/10)*10,end:`${pick(["Av.","Rua","Rod.","Estrada"])} ${pick(["Industrial","das Indústrias","Brasil","JK","Amazonas","dos Imigrantes","Rio Madeira","Marechal Rondon"])}, ${ri(100,4999)}`,cid}})}
W.abrirBarracao=function(k,cid){k=k||Object.keys(EMP).find(x=>!S.lojas.some(l=>l.emp===x&&!l.encerrada))||Object.keys(EMP)[0];cid=cid||"Cacoal";OF=ofertas(cid);
 const cx=S.ecx[k]||0,seg=EMP[k].seg||"lub";
 modal(`<div class="row sb"><h2 style="margin:0">🏭 Barracão para empresa</h2><button class="b s" onclick="fecha()">✕</button></div>
 <div class="formg" style="margin:10px 0"><label>Empresa<select id="bK" onchange="abrirBarracao(this.value,bC.value)">${Object.keys(EMP).map(x=>`<option value="${x}" ${x===k?"selected":""}>${esc(EMP[x].n)}</option>`).join("")}</select></label>
 <label>Cidade<select id="bC" onchange="abrirBarracao(bK.value,this.value)">${Object.keys(CID).sort().map(c=>`<option ${c===cid?"selected":""}>${c}</option>`).join("")}</select></label>
 <label><span>Troca de óleo / oficina</span><select id="bT"><option value="1">Sim</option><option value="0" ${seg==="const"?"selected":""}>Não</option></select></label></div>
 <p class="muted">Caixa da ${esc(EMP[k].n)}: <b>${R$(cx)}</b> (ramo: ${SEGS[seg]||seg}). Mais a adequação (R$ 90 mil) e o estoque inicial, pagos pela empresa. A loja abre em 5 a 10 dias com equipe contratada.</p>
 ${OF.map((o,i)=>`<div class="veh row sb" style="margin:6px 0"><div><b>${o.n}</b> – ${o.m2.toLocaleString("pt-BR")} m²<div class="muted">${esc(o.end)}, ${o.cid}</div></div>
 <div class="row"><button class="b g" onclick="fecharBarracao(${i},1)">Comprar ${K$(o.val)}</button><button class="b bl" onclick="fecharBarracao(${i},0)">Alugar ${R$(o.alug)}/mês</button></div></div>`).join("")}
 <div class="row" style="margin-top:8px"><button class="b s" onclick="abrirBarracao(bK.value,bC.value)">🔄 Ver outros barracões</button></div>`)};
W.fecharBarracao=function(i,compra){const o=OF[i],k=bK.value,troca=bT.value==="1",seg=EMP[k].seg||"lub";
 const ps=S.prods.filter(p=>p.seg===seg),estIni=ps.reduce((a,p)=>a+p.custo*qIni(p),0),adeq=90000,entrada=compra?o.val:o.alug*3;
 const tot=entrada+adeq+estIni,lim=W.LIMNEG?LIMNEG():0;
 if(!confirm(`${compra?"Comprar":"Alugar"} ${o.n} (${o.m2} m²) em ${o.cid} para ${EMP[k].n}?\n\n${compra?"Compra: "+R$(o.val):"Caução 3 aluguéis: "+R$(entrada)+" e "+R$(o.alug)+"/mês"}\nAdequação da loja: ${R$(adeq)}\nEstoque inicial (${ps.length} produtos do ramo): ${R$(estIni)}\nTotal agora: ${R$(tot)}`))return;
 if((S.ecx[k]||0)+lim<tot)return toast(`Caixa da ${EMP[k].n} insuficiente – mande dinheiro em 🏢 Empresas`);
 S.ecx[k]=(S.ecx[k]||0)-tot;const dias=ri(5,10);
 S.ter.push({id:S.nid++,cid:o.cid,end:o.end,m2:o.m2,val:compra?Math.round(o.val/2.2):0,uso:`Barracão em adequação – ${EMP[k].n}`,proprio:!!compra,alug:compra?0:o.alug,obra:{emp:k,troca,fim:S.simMs+dias*DIA,v16:1}});
 log(`🏭 ${EMP[k].n} ${compra?"comprou":"alugou"} ${o.n} em ${o.cid} (${o.m2} m²) – inaugura em ${dias} dias`);toast("Barracão fechado! Loja em adequação");fecha();save();render()};
// ajusta estoque inicial da loja aberta via barracão (só os produtos do ramo) e cobra aluguel
const oCO=W.checaObras;W.checaObras=function(){const pend=S.ter.filter(t=>t.obra&&t.obra.v16&&S.simMs>=t.obra.fim);const n0=S.lojas.length;oCO.apply(this,arguments);
 S.lojas.slice(n0).forEach(l=>{const t=pend.find(t=>t.loja===l.id);if(!t)return;const sg=segDe(l);S.prods.forEach(p=>l.est[p.id]=p.seg===sg?qIni(p):0);l.caixa=0;if(t.alug)t.val=0})};
const oGC=W.gerarContasMes;W.gerarContasMes=function(d){oGC.apply(this,arguments);S.ter.filter(t=>t.alug&&t.loja==null&&t.obra).forEach(t=>addConta(`Aluguel – barracão ${t.cid} (${EMP[t.obra.emp].n})`,t.alug,S.simMs+5*DIA,"Imóvel"))};
// botões
const card=()=>{const sem=Object.keys(EMP).filter(k=>!S.lojas.some(l=>l.emp===k&&!l.encerrada));
 return `<div class="card" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><button class="b g" style="font-size:15px;padding:11px 16px" onclick="abrirBarracao()">🏭 Comprar/alugar barracão</button><span class="muted">${sem.length?`Empresas ainda sem loja: <b>${sem.map(k=>esc(EMP[k].n)).join(", ")}</b>`:"Abra uma nova unidade para qualquer empresa do grupo."}</span></div>`};
const oL=V.loja;V.loja=function(){return card()+oL.apply(this,arguments)};
const oE=V.empresas;V.empresas=function(){return card()+oE.apply(this,arguments)};
})();
