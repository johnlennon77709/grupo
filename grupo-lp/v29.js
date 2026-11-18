// v29: Central de monitoramento 3D (CFTV) – loja em 3D com clientes, funcionários, filas, troca de óleo, cenários e impacto financeiro
(function(){const W=window;let T=null,SIM=null;
const RS=v=>"R$ "+Math.round(v).toLocaleString("pt-BR");
const NOMES=["Carlos","Ana","João","Patrícia","Marcos","Juliana","Rafael","Fernanda","Diego","Luciana","Bruno","Camila","Thiago","Aline","Pedro","Bianca","Lucas","Renata","Felipe","Sandra","Gustavo","Débora","André","Priscila"];
const BUSCA=["óleo 5W30 sintético","filtro de óleo","fluido de freio DOT 4","aditivo de radiador","palheta 18\"","lâmpada H4","óleo 15W40 diesel","graxa de rolamento","filtro de ar","vela de ignição","limpa-bicos","pneu aro 14","bateria 60Ah","óleo de câmbio ATF"];
const CORES=[0x2563eb,0xdc2626,0x16a34a,0x7c3aed,0x0891b2,0xea580c,0x4b5563,0xdb2777,0x65a30d,0x0f766e,0x9333ea,0x1e40af];
async function three(){if(T)return T;T=await import("https://unpkg.com/three@0.160.0/build/three.module.js");return T}
// ---------------- motor da simulação (serve para a tela 3D e para comparar cenários sem desenhar) ----------------
function lojaInfo(l){const fs=(S.func||[]).filter(f=>f.loja===l.id);const c=k=>fs.filter(f=>f.cargo===k);
 return{nome:nomeLoja(l),troca:!!l.troca,caixas:Math.max(2,Math.min(6,c("caixa").length+1)),vend:c("vend"),mec:Math.max(l.troca?1:0,Math.min(4,c("mec").length)),est:c("est"),ger:c("ger"),f:l.f||1,staff:fs}}
function novoMotor(p){// p: {caixas,abertos,boxes,demanda,paciencia,ticket,custoH,margem,cenario,inicioMin}
 const M={t:p.inicioMin*60,cli:[],car:[],fila:[],ev:[],atend:0,desist:0,fat:0,carros:0,serie:[],nid:1,p,
  cx:Array.from({length:p.caixas},(_,i)=>({id:i,aberto:i<p.abertos,fila:[],ocup:null,fim:0,abreEm:null})),
  box:Array.from({length:p.boxes},(_,i)=>({id:i,car:null,fim:0})),filaCar:[],chegou:0,custo:0};
 M.lambda=()=>{const h=M.t/3600;const curva=h<8?.3:h<10?.8:h<12?1:h<14?.85:h<17?.75:h<19?1.25:.5;return p.demanda*curva};// clientes por minuto
 return M}
function abertos(M){return M.cx.filter(c=>c.aberto).length}
function passo(M,dt,cb){const p=M.p;M.t+=dt;
 // chegada de clientes
 if(Math.random()<M.lambda()*dt/60){const c={id:M.nid++,nome:NOMES[Math.random()*NOMES.length|0],busca:BUSCA[Math.random()*BUSCA.length|0],est:"entra",itens:1+(Math.random()*3|0),pac:(p.paciencia*60)*(.6+Math.random()*.8),espera:0,ticket:p.ticket*(.5+Math.random()*1.2),cor:CORES[Math.random()*CORES.length|0]};M.cli.push(c);M.chegou++;cb&&cb.novo&&cb.novo(c)}
 // chegada de carros (troca de óleo)
 if(p.boxes>0&&Math.random()<M.lambda()*.12*dt/60){const k={id:M.nid++,est:"chega",cor:CORES[Math.random()*CORES.length|0],espera:0};M.car.push(k);M.filaCar.push(k);cb&&cb.carro&&cb.carro(k)}
 // boxes de troca
 M.box.forEach(b=>{if(b.car&&M.t>=b.fim){b.car.est="sai";cb&&cb.carSai&&cb.carSai(b.car,b);M.fat+=p.ticket*3.2;M.carros++;b.car=null}
  if(!b.car&&M.filaCar.length){const k=M.filaCar.shift();b.car=k;k.est="box";k.box=b.id;b.fim=M.t+(18+Math.random()*14)*60;cb&&cb.carBox&&cb.carBox(k,b)}});
 // caixas: reabertura programada
 M.cx.forEach(c=>{if(c.abreEm!=null&&M.t>=c.abreEm){c.aberto=true;c.abreEm=null;cb&&cb.log&&cb.log(`CX ${String(c.id+1).padStart(2,"0")} reaberto`)}});
 M.cx.forEach(c=>{if(c.ocup&&M.t>=c.fim){const cl=c.ocup;cl.est="sai";M.atend++;M.fat+=cl.ticket;c.ocup=null;cb&&cb.pago&&cb.pago(cl,c)}
  if(!c.ocup&&c.aberto&&c.fila.length){const cl=c.fila.shift();c.ocup=cl;cl.est="paga";c.fim=M.t+(35+Math.random()*55);cb&&cb.paga&&cb.paga(cl,c)}});
 // fila: paciência e redistribuição quando caixa fecha
 M.cx.forEach(c=>{if(!c.aberto&&c.fila.length){const ab=M.cx.filter(x=>x.aberto);if(ab.length){c.fila.splice(0).forEach(cl=>{const d=ab.reduce((a,b)=>a.fila.length<=b.fila.length?a:b);d.fila.push(cl);cl.cx=d.id})}}});
 M.cx.forEach(c=>c.fila.forEach(cl=>{cl.espera+=dt;if(cl.espera>cl.pac){cl.est="desiste";M.desist++;c.fila.splice(c.fila.indexOf(cl),1);cb&&cb.desiste&&cb.desiste(cl)}}));
 M.custo+=abertos(M)*p.custoH*dt/3600;
 if(!M._ls||M.t-M._ls>=30){M._ls=M.t;M.serie.push([M.t,M.cx.reduce((a,c)=>a+c.fila.length,0)]);if(M.serie.length>400)M.serie.shift()}}
function entraFila(M,cl){const ab=M.cx.filter(c=>c.aberto);const d=(ab.length?ab:M.cx).reduce((a,b)=>(a.fila.length+(a.ocup?1:0))<=(b.fila.length+(b.ocup?1:0))?a:b);d.fila.push(cl);cl.cx=d.id;cl.est="fila";cl.espera=0}
function indicadores(M){const fila=M.cx.reduce((a,c)=>a+c.fila.length,0);const esp=[];M.cx.forEach(c=>c.fila.forEach(x=>esp.push(x.espera)));
 const cap=abertos(M)*60/62;const dem=M.lambda();return{fila,espera:esp.length?esp.reduce((a,b)=>a+b,0)/esp.length:0,desist:M.desist,atend:M.atend,cargaPct:cap?dem/cap*100:999,abertos:abertos(M)}}
// cenário rápido sem desenho (para comparar)
function rodaCenario(base,ajuste,minutos){const p=Object.assign({},base,ajuste.p||{});const M=novoMotor(p);if(ajuste.ini)ajuste.ini(M);
 const fim=M.t+minutos*60;const naLoja=[];
 while(M.t<fim){passo(M,2,{novo:c=>naLoja.push({c,t:M.t+60+c.itens*45})});
  for(let i=naLoja.length-1;i>=0;i--)if(M.t>=naLoja[i].t){entraFila(M,naLoja[i].c);naLoja.splice(i,1)}}
 const perdida=M.desist*p.ticket;return{nome:ajuste.nome,atend:M.atend,desist:M.desist,fat:M.fat,custo:M.custo,margemPerdida:perdida*p.margem,saldo:M.fat*p.margem-M.custo,maxFila:Math.max(0,...M.serie.map(s=>s[1])),serie:M.serie}}
// ---------------- interface ----------------
const css=`#cf3{position:fixed;inset:0;z-index:9999;background:#0b0f14;color:#e8edf3;font-family:Inter,system-ui,sans-serif;display:grid;grid-template-columns:1fr 340px;grid-template-rows:auto 1fr 150px}
#cf3 .tb{grid-column:1/3;display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #1f2731;background:#0e1319;flex-wrap:wrap}
#cf3 .tb b.t{font-family:Rajdhani,Inter;font-size:18px;letter-spacing:.5px;text-transform:uppercase;margin-right:6px}
#cf3 .kp{display:flex;gap:8px;flex-wrap:wrap}
#cf3 .k{background:#121922;border:1px solid #232d3a;border-radius:10px;padding:5px 10px;min-width:92px}
#cf3 .k small{display:block;font-size:9.5px;color:#8b97a6;text-transform:uppercase;letter-spacing:.6px}
#cf3 .k span{font-weight:700;font-size:15px;font-variant-numeric:tabular-nums}
#cf3 .k.al span{color:#f87171}#cf3 .k.ok span{color:#34d399}#cf3 .k.am span{color:#fbbf24}
#cf3 .vw{position:relative;overflow:hidden;background:#d9dde2}
#cf3 canvas.gl{display:block;width:100%;height:100%}
#cf3 .ov{position:absolute;left:10px;top:10px;display:flex;gap:6px;flex-wrap:wrap}
#cf3 .bt{background:rgba(15,20,26,.85);color:#e8edf3;border:1px solid #2a3542;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer}
#cf3 .bt.on{background:linear-gradient(135deg,#ffd45a,#f5b301 45%,#ff7a00);color:#1a1200;border-color:transparent}
#cf3 .rec{position:absolute;right:12px;top:10px;font:600 12px ui-monospace,monospace;color:#fff;text-shadow:0 1px 2px #000;display:none}
#cf3 .rec i{display:inline-block;width:9px;height:9px;border-radius:50%;background:#ef4444;margin-right:6px;animation:cfb 1s infinite}
@keyframes cfb{50%{opacity:.2}}
#cf3.cam .vw::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.06) 0 1px,transparent 1px 3px),radial-gradient(circle,transparent 55%,rgba(0,0,0,.45));}
#cf3.cam canvas.gl{filter:saturate(.35) contrast(1.1) brightness(.95)}
#cf3.cam .rec{display:block}
#cf3 .info{position:absolute;left:10px;bottom:10px;background:rgba(14,19,25,.92);border:1px solid #2a3542;border-radius:12px;padding:10px 12px;font-size:12.5px;max-width:270px;display:none}
#cf3 .side{grid-row:2/4;grid-column:2;border-left:1px solid #1f2731;background:#0e1319;overflow:auto;padding:12px}
#cf3 .tabs{display:flex;gap:4px;background:#121922;border:1px solid #232d3a;border-radius:10px;padding:3px;margin-bottom:10px}
#cf3 .tabs button{flex:1;background:none;border:0;color:#9aa4b1;padding:6px;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer}
#cf3 .tabs button.on{background:#1d2631;color:#fff}
#cf3 h4{font-size:10.5px;color:#8b97a6;text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px;border-left:3px solid #f5b301;padding-left:7px}
#cf3 .sc{display:grid;grid-template-columns:1fr 1fr;gap:6px}
#cf3 .sc button{background:#121922;border:1px solid #232d3a;color:#e8edf3;border-radius:9px;padding:8px;font-size:12px;text-align:left;cursor:pointer}
#cf3 .sc button.on{border-color:#f5b301;background:rgba(245,179,1,.1)}
#cf3 .cxr{display:flex;align-items:center;gap:8px;font-size:12px;padding:5px 0;border-bottom:1px solid #1a222c}
#cf3 .cxr .bar{flex:1;height:6px;border-radius:4px;background:#1b232d;overflow:hidden}
#cf3 .cxr .bar i{display:block;height:100%;background:linear-gradient(90deg,#34d399,#fbbf24,#ef4444)}
#cf3 .cxr button{background:none;border:1px solid #2a3542;color:#e8edf3;border-radius:7px;padding:3px 8px;font-size:11px;cursor:pointer}
#cf3 .rg{display:flex;justify-content:space-between;font-size:12px;margin-top:8px}
#cf3 input[type=range]{width:100%;accent-color:#f5b301}
#cf3 .ch{grid-column:1;border-top:1px solid #1f2731;background:#0e1319;position:relative}
#cf3 .ch canvas{width:100%;height:100%;display:block}
#cf3 .lg{font-size:11.5px;color:#aab4c0;max-height:140px;overflow:auto}
#cf3 .lg div{padding:3px 0;border-bottom:1px solid #18202a}
#cf3 table{width:100%;font-size:11.5px;border-collapse:collapse}#cf3 td,#cf3 th{padding:5px 4px;border-bottom:1px solid #1d2630;text-align:right}#cf3 td:first-child,#cf3 th:first-child{text-align:left}
@media(max-width:900px){#cf3{grid-template-columns:1fr;grid-template-rows:auto 55vh 110px auto}#cf3 .side{grid-row:4;grid-column:1;border-left:0;border-top:1px solid #1f2731}}`;
function abrir(lid){const l=S.lojas[lid]||S.lojas.find(x=>x.tipo!=="transp"&&!x.encerrada);if(!l)return toast("Nenhuma loja");
 if(!document.getElementById("cf3css")){const st=document.createElement("style");st.id="cf3css";st.textContent=css;document.head.appendChild(st)}
 fechar();const info=lojaInfo(l);const d=new Date(S.simMs);
 const p={caixas:info.caixas,abertos:info.caixas,boxes:info.troca?3:0,demanda:Math.max(.6,1.25*info.f),paciencia:7,ticket:Math.max(60,(l.venda&&l.venda.dia&&l.qtdDia)?l.venda.dia/Math.max(1,l.qtdDia):180),custoH:32,margem:.28,inicioMin:Math.max(7*60,d.getHours()*60+d.getMinutes())};
 const el=document.createElement("div");el.id="cf3";el.innerHTML=`
 <div class="tb"><b class="t">🎥 Monitoramento · ${esc(info.nome)}</b><div class="kp" id="cfK"></div><div style="margin-left:auto;display:flex;gap:6px;align-items:center">
 <span style="font-size:11px;color:#8b97a6">VELOCIDADE</span>${[1,5,20,60].map(v=>`<button class="bt" data-v="${v}">${v}x</button>`).join("")}<button class="bt" id="cfP">⏸</button><button class="bt" id="cfX">✕ Fechar</button></div></div>
 <div class="vw" id="cfV"><div class="ov"><button class="bt on" data-c="geral">Geral</button><button class="bt" data-c="cam1">CAM 01 Entrada</button><button class="bt" data-c="cam2">CAM 02 Caixas</button><button class="bt" data-c="cam3">CAM 03 Corredores</button>${info.troca?'<button class="bt" data-c="cam4">CAM 04 Troca de óleo</button>':""}<button class="bt" data-c="topo">Planta</button><button class="bt" id="cfH">🔥 Mapa de calor</button></div>
 <div class="rec" id="cfR"><i></i>REC · <span id="cfRt"></span></div><div class="info" id="cfI"></div></div>
 <div class="side"><div class="tabs"><button class="on" data-t="op">Operação</button><button data-t="ind">Indicadores</button><button data-t="par">Parâmetros</button><button data-t="cmp">Comparar</button></div><div id="cfS"></div></div>
 <div class="ch"><canvas id="cfC"></canvas></div>`;
 document.body.appendChild(el);
 SIM={l,info,p,M:novoMotor(p),vel:5,pausa:false,cam:"geral",aba:"op",cen:"normal",logs:[],heat:false,cmp:null};
 el.querySelector("#cfX").onclick=fechar;el.querySelector("#cfP").onclick=e=>{SIM.pausa=!SIM.pausa;e.target.textContent=SIM.pausa?"▶":"⏸"};
 el.querySelectorAll("[data-v]").forEach(b=>{b.onclick=()=>{SIM.vel=+b.dataset.v;el.querySelectorAll("[data-v]").forEach(x=>x.classList.toggle("on",x===b))};if(+b.dataset.v===5)b.classList.add("on")});
 el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{SIM.cam=b.dataset.c;el.querySelectorAll("[data-c]").forEach(x=>x.classList.toggle("on",x===b));el.classList.toggle("cam",/^cam/.test(SIM.cam));SIM.camReset=true});
 el.querySelector("#cfH").onclick=e=>{SIM.heat=!SIM.heat;e.target.classList.toggle("on",SIM.heat);if(SIM.heatMesh)SIM.heatMesh.visible=SIM.heat};
 el.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{SIM.aba=b.dataset.t;el.querySelectorAll("[data-t]").forEach(x=>x.classList.toggle("on",x===b));painel()});
 painel();iniciar3D().catch(e=>{semGL();document.getElementById("cfV").insertAdjacentHTML("beforeend",`<div style="position:absolute;inset:0;display:grid;place-items:center;color:#111">Não foi possível carregar o 3D (${esc(e.message)}). Verifique a internet.</div>`)})}
function semGL(){if(!SIM)return;SIM.vivo=true;const nl=[];const it=setInterval(()=>{if(!SIM||!SIM.vivo)return clearInterval(it);if(!SIM.pausa){let r=.4*SIM.vel;while(r>0){const s=Math.min(.5,r);passo(SIM.M,s,{novo:c=>nl.push({c,t:SIM.M.t+60+c.itens*45})});for(let i=nl.length-1;i>=0;i--)if(SIM.M.t>=nl[i].t){entraFila(SIM.M,nl[i].c);nl.splice(i,1)}r-=s}}kpis();grafico();if(SIM.aba==="op")atualizaOp();if(SIM.aba==="ind")atualizaInd()},400)}
function fechar(){const e=document.getElementById("cf3");if(e)e.remove();if(SIM){SIM.vivo=false;if(SIM.ren){SIM.ren.dispose()}}SIM=null}
W.abrirCF3=abrir;W.cf3Sim=()=>SIM;
function log(m){if(!SIM)return;const h=SIM.M.t,tx=`${String(h/3600|0).padStart(2,"0")}:${String(h/60%60|0).padStart(2,"0")}`;SIM.logs.unshift(tx+" · "+m);SIM.logs=SIM.logs.slice(0,40)}
// ---- painel lateral ----
function painel(){if(!SIM)return;const el=document.getElementById("cfS");if(!el)return;const M=SIM.M,p=SIM.p;
 if(SIM.aba==="op"){el.innerHTML=`<h4>Cenário</h4><div class="sc">${[["normal","Operação normal","Todos os caixas abertos"],["pico","Horário de pico","Fluxo +60% no fim da tarde"],["fech","Fechamento de caixas","Fecha metade dos caixas"],["recup","Recuperação","Reabre os caixas em 3 min"]].map(([k,n,d])=>`<button data-s="${k}" class="${SIM.cen===k?"on":""}"><b>${n}</b><br><span style="color:#8b97a6;font-size:11px">${d}</span></button>`).join("")}</div>
 <h4>Caixas</h4><div id="cfCx"></div>
 ${p.boxes?`<h4>Troca de óleo</h4><div id="cfBx"></div>`:""}
 <h4>Equipe nesta loja</h4><div style="font-size:12px;color:#aab4c0">${SIM.info.staff.length} funcionários · ${SIM.info.vend.length} vendedores · ${SIM.info.est.length} estoquistas · ${SIM.info.mec} mecânicos</div>
 <h4>Ocorrências</h4><div class="lg" id="cfL"></div>`;
  el.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>cenario(b.dataset.s));atualizaOp()}
 else if(SIM.aba==="ind"){const r=lojaReal();el.innerHTML=`<h4>Agora na simulação</h4><div id="cfInd"></div><h4>Loja no jogo (hoje)</h4><div style="font-size:12.5px;line-height:1.8">Faturamento: <b>${RS(r.fat)}</b><br>Vendas: <b>${r.vendas}</b> · Trocas: <b>${r.trocas}</b><br>Caixa da loja: <b>${RS(r.caixa)}</b></div>`;atualizaInd()}
 else if(SIM.aba==="par"){const sl=(k,n,min,max,st,fmt)=>`<div class="rg"><span>${n}</span><b id="pv_${k}">${fmt(p[k])}</b></div><input type="range" min="${min}" max="${max}" step="${st}" value="${p[k]}" data-k="${k}">`;
  el.innerHTML=`<h4>Comportamento do cliente</h4>${sl("demanda","Clientes por minuto (pico)",.2,4,.1,v=>(+v).toFixed(1))}${sl("paciencia","Paciência média na fila",2,20,1,v=>v+" min")}
  <h4>Premissas financeiras</h4>${sl("ticket","Ticket médio",30,600,10,v=>RS(v))}${sl("custoH","Custo do operador por hora",15,80,1,v=>RS(v)+"/h")}${sl("margem","Margem bruta",.1,.5,.01,v=>Math.round(v*100)+"%")}
  <p style="font-size:11px;color:#8b97a6;margin-top:10px">Alterar recalcula a simulação a partir de agora.</p>`;
  el.querySelectorAll("input[data-k]").forEach(i=>i.oninput=()=>{p[i.dataset.k]=+i.value;const f={demanda:v=>(+v).toFixed(1),paciencia:v=>v+" min",ticket:RS,custoH:v=>RS(v)+"/h",margem:v=>Math.round(v*100)+"%"}[i.dataset.k];document.getElementById("pv_"+i.dataset.k).textContent=f(i.value)})}
 else if(SIM.aba==="cmp"){el.innerHTML=`<h4>Comparar cenários (próximas 2h)</h4><p style="font-size:11.5px;color:#8b97a6">Simula, em segundos, o que aconteceria em cada decisão com os parâmetros atuais.</p><button class="bt on" id="cfRun" style="width:100%;margin:6px 0">▶ Rodar comparação</button><div id="cfCmp"></div>`;
  document.getElementById("cfRun").onclick=comparar;if(SIM.cmp)mostraCmp()}}
function lojaReal(){const l=SIM.l;return{fat:(l.venda&&l.venda.dia)||0,vendas:l.vendas||0,trocas:l.servs||0,caixa:(S.lcx&&S.lcx[l.id]!=null)?S.lcx[l.id]:(l.caixa||0)}}
function atualizaOp(){if(!SIM||SIM.aba!=="op")return;const M=SIM.M;const c=document.getElementById("cfCx");if(!c)return;
 c.innerHTML=M.cx.map(x=>`<div class="cxr"><span style="width:42px">● CX ${String(x.id+1).padStart(2,"0")}</span><div class="bar"><i style="width:${Math.min(100,x.fila.length*14)}%"></i></div><span style="width:52px;text-align:right">${x.aberto?x.fila.length+" na fila":x.abreEm!=null?"abrindo…":"fechado"}</span><button data-cx="${x.id}">${x.aberto?"Fechar":"Abrir"}</button></div>`).join("");
 c.querySelectorAll("[data-cx]").forEach(b=>b.onclick=()=>{const x=M.cx[+b.dataset.cx];if(x.aberto){x.aberto=false;log(`Você fechou o CX ${String(x.id+1).padStart(2,"0")}`)}else{x.abreEm=M.t+90;log(`Abrindo CX ${String(x.id+1).padStart(2,"0")} (leva 1 min 30 s)`)}atualizaOp()});
 const bx=document.getElementById("cfBx");if(bx)bx.innerHTML=M.box.map(b=>`<div class="cxr"><span>🔧 Box ${b.id+1}</span><div class="bar"><i style="width:${b.car?Math.max(5,100-(b.fim-M.t)/18/60*100):0}%"></i></div><span>${b.car?Math.ceil((b.fim-M.t)/60)+" min":"livre"}</span></div>`).join("")+`<div style="font-size:11.5px;color:#8b97a6;margin-top:4px">${M.filaCar.length} carro(s) esperando</div>`;
 const lg=document.getElementById("cfL");if(lg)lg.innerHTML=SIM.logs.map(x=>`<div>${esc(x)}</div>`).join("")||"<div>Sem ocorrências</div>"}
function atualizaInd(){const e=document.getElementById("cfInd");if(!e||!SIM)return;const M=SIM.M,p=SIM.p,k=indicadores(M);
 e.innerHTML=`<table><tr><td>Clientes atendidos</td><td>${M.atend}</td></tr><tr><td>Desistências</td><td style="color:#f87171">${M.desist}</td></tr><tr><td>Trocas de óleo</td><td>${M.carros}</td></tr><tr><td>Faturamento simulado</td><td>${RS(M.fat)}</td></tr><tr><td>Custo dos caixas</td><td>${RS(M.custo)}</td></tr><tr><td>Venda perdida (desistências)</td><td style="color:#f87171">${RS(M.desist*p.ticket)}</td></tr><tr><td><b>Lucro bruto estimado</b></td><td><b>${RS(M.fat*p.margem-M.custo)}</b></td></tr></table>`}
function cenario(k){const M=SIM.M,p=SIM.p;SIM.cen=k;p.demanda=SIM.p0d=SIM.p0d||p.demanda;
 if(k==="normal"){M.cx.forEach(c=>{c.aberto=true;c.abreEm=null});log("Cenário: operação normal")}
 if(k==="pico"){p.demanda=SIM.p0d*1.6;log("Cenário: horário de pico (+60% de clientes)")}
 if(k==="fech"){M.cx.forEach((c,i)=>{if(i>=Math.ceil(M.cx.length/2))c.aberto=false});log(`Cenário: ${M.cx.length-Math.ceil(M.cx.length/2)} caixas fechados`)}
 if(k==="recup"){M.cx.forEach(c=>{if(!c.aberto)c.abreEm=M.t+180});log("Cenário: recuperação – caixas reabrem em 3 min")}
 painel()}
function comparar(){const b=SIM.p,mins=120,n=b.caixas;const meio=Math.ceil(n/2);
 const ajs=[{nome:"A · Operação normal"},{nome:"B · Pico (+60%)",p:{demanda:b.demanda*1.6}},{nome:"C · Fechar caixas",ini:M=>M.cx.forEach((c,i)=>{if(i>=meio)c.aberto=false})},{nome:"D · Recuperação",p:{demanda:b.demanda*1.6},ini:M=>M.cx.forEach((c,i)=>{if(i>=meio){c.aberto=false;c.abreEm=M.t+180}})}];
 SIM.cmp=ajs.map(a=>rodaCenario(b,a,mins));mostraCmp()}
function mostraCmp(){const e=document.getElementById("cfCmp");if(!e)return;const r=SIM.cmp,base=r[0];
 e.innerHTML=`<table><tr><th>Cenário</th><th>Atend.</th><th>Desist.</th><th>Fila máx</th><th>Saldo</th></tr>${r.map(x=>`<tr><td>${x.nome}</td><td>${x.atend}</td><td style="color:${x.desist>base.desist?"#f87171":"inherit"}">${x.desist}</td><td>${x.maxFila}</td><td style="color:${x.saldo<base.saldo?"#f87171":"#34d399"}">${RS(x.saldo)}</td></tr>`).join("")}</table>
 <h4>Impacto financeiro em relação ao normal</h4>${r.slice(1).map(x=>`<div style="font-size:12px;padding:6px 0;border-bottom:1px solid #1d2630"><b>${x.nome}</b><br>Custo dos caixas: ${RS(x.custo)} (${x.custo<=base.custo?"economia de "+RS(base.custo-x.custo):"+"+RS(x.custo-base.custo)})<br>Margem não realizada: ${RS(x.margemPerdida)}<br>Saldo vs normal: <b style="color:${x.saldo<base.saldo?"#f87171":"#34d399"}">${x.saldo>=base.saldo?"+":"-"}${RS(Math.abs(x.saldo-base.saldo))}</b></div>`).join("")}
 <p style="font-size:10.5px;color:#8b97a6">Estimativa simulada: não inclui efeito de longo prazo (cliente que não volta).</p>`}
// ---- gráfico inferior ----
function grafico(){const c=document.getElementById("cfC");if(!c||!SIM)return;const w=c.clientWidth,h=c.clientHeight;if(c.width!==w*devicePixelRatio){c.width=w*devicePixelRatio;c.height=h*devicePixelRatio}
 const g=c.getContext("2d");g.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);g.clearRect(0,0,w,h);g.fillStyle="#8b97a6";g.font="600 10px Inter";g.fillText("PESSOAS AGUARDANDO NO TEMPO",12,16);
 const sr=[[SIM.M.serie,"#f5b301"]];if(SIM.cmp){sr.push([SIM.cmp[0].serie,"#38a3ff"])}
 const mx=Math.max(6,...sr.flatMap(([s])=>s.map(x=>x[1])));const t0=SIM.M.serie.length?SIM.M.serie[0][0]:0;
 sr.forEach(([s,cor],i)=>{if(s.length<2)return;const a=i===0?t0:s[0][0],span=Math.max(1800,(s[s.length-1][0]-a));g.strokeStyle=cor;g.lineWidth=2;g.beginPath();s.forEach(([t,v],j)=>{const x=40+(t-a)/span*(w-60),y=h-20-v/mx*(h-40);j?g.lineTo(x,y):g.moveTo(x,y)});g.stroke()});
 g.strokeStyle="#1f2731";g.beginPath();g.moveTo(40,h-20);g.lineTo(w-20,h-20);g.stroke();g.fillText(String(mx),12,30);g.fillText("0",12,h-22);
 if(SIM.cmp){g.fillStyle="#38a3ff";g.fillText("— normal (comparação)",w-170,16);g.fillStyle="#f5b301";g.fillText("— agora",w-60,16)}}
function kpis(){const e=document.getElementById("cfK");if(!e||!SIM)return;const M=SIM.M,k=indicadores(M);const hh=M.t;
 const it=(c,n,v)=>`<div class="k ${c}"><small>${n}</small><span>${v}</span></div>`;
 e.innerHTML=it("","Horário",`${String(hh/3600%24|0).padStart(2,"0")}:${String(hh/60%60|0).padStart(2,"0")}`)+it(k.abertos<M.cx.length?"am":"ok","Caixas operando",`${k.abertos} de ${M.cx.length}`)+it(k.fila>8?"al":"","Aguardando",k.fila)+it(k.espera>180?"al":"","Espera na fila",`${k.espera/60|0} min ${Math.round(k.espera%60)} s`)+it(M.desist?"al":"","Desistências",M.desist)+it(k.cargaPct>100?"al":k.cargaPct>80?"am":"ok","Demanda ÷ capacidade",Math.round(k.cargaPct)+"%");
 const rt=document.getElementById("cfRt");if(rt)rt.textContent=`${SIM.cam.toUpperCase()} · ${new Date(S.simMs).toLocaleDateString("pt-BR")} ${String(hh/3600%24|0).padStart(2,"0")}:${String(hh/60%60|0).padStart(2,"0")}:${String(hh%60|0).padStart(2,"0")}`}
// ---------------- 3D ----------------
async function iniciar3D(){const THREE=await three();if(!SIM)return;const vw=document.getElementById("cfV");
 const ren=new THREE.WebGLRenderer({antialias:true});ren.setPixelRatio(Math.min(2,devicePixelRatio));ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;ren.domElement.className="gl";vw.prepend(ren.domElement);SIM.ren=ren;
 const sc=new THREE.Scene();sc.background=new THREE.Color(0xe9ecef);sc.fog=new THREE.Fog(0xe9ecef,60,120);
 const cam=new THREE.PerspectiveCamera(42,1,.1,300);SIM.cam3=cam;
 sc.add(new THREE.HemisphereLight(0xffffff,0x9aa3ad,.9));const sun=new THREE.DirectionalLight(0xffffff,1.1);sun.position.set(-14,30,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-30,right:30,top:25,bottom:-25});sc.add(sun);
 const mat=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.75,metalness:.05},o));
 const box=(w,h,d,c,x,y,z,o)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==="number"?mat(c,o):c);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;sc.add(m);return m};
 const info=SIM.info,troca=info.troca,WX=troca?36:28,DZ=22,x0=-WX/2;
 // piso e paredes
 const piso=box(WX,.2,DZ,0xf4f5f7,0,-.1,0);piso.castShadow=false;
 const grid=new THREE.GridHelper(Math.max(WX,DZ),Math.max(WX,DZ)/2,0xdfe2e6,0xe6e9ec);grid.position.y=.01;sc.add(grid);
 box(WX,2.6,.3,0xffffff,0,1.3,-DZ/2);box(.3,2.6,DZ,0xffffff,x0,1.3,0);box(.3,2.6,DZ,0xffffff,-x0,1.3,0);
 box(WX/2-2.5,1.1,.3,0xffffff,x0+(WX/2-2.5)/2,.55,DZ/2);box(WX/2-2.5,1.1,.3,0xffffff,-x0-(WX/2-2.5)/2,.55,DZ/2);
 // faixa da marca na parede do fundo
 box(WX-.4,.5,.05,0xf5b301,0,2.3,-DZ/2+.17);
 const placa=(txt,x,y,z,s=1,bg="#0b3d2a",fg="#ffffff",rot=0)=>{const cv=document.createElement("canvas");cv.width=256;cv.height=64;const g=cv.getContext("2d");g.fillStyle=bg;g.fillRect(0,0,256,64);g.fillStyle=fg;g.font="bold 30px Inter,Arial";g.textAlign="center";g.textBaseline="middle";g.fillText(txt,128,34);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(2*s,.5*s),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=rot;sc.add(m);return m};
 placa(info.nome.slice(0,22).toUpperCase(),0,2.3,-DZ/2+.22,3.2,"#0b0f14","#f5b301");
 // gôndolas com produtos (frascos coloridos)
 const prodC=[0xf5b301,0x1e3a8a,0xdc2626,0x111827,0x15803d,0x0ea5e9,0xf97316,0x7c3aed];
 const shelfX=[];const nG=troca?5:6;for(let i=0;i<nG;i++)shelfX.push(x0+4+i*3.4);
 SIM.aisles=shelfX.map(x=>x-1.7).concat([shelfX[shelfX.length-1]+1.7]);
 shelfX.forEach((x,i)=>{box(1.1,.15,9,0xd7dbe0,x,.08,-3.5);box(.12,1.9,9,0xcfd4da,x,.95,-3.5);
  for(let n=0;n<3;n++){box(1.1,.05,9,0xe5e7eb,x,.45+n*.55,-3.5);
   for(let s=-1;s<=1;s+=2)for(let z=0;z<14;z++){const c=prodC[(i*3+n+z)%prodC.length];const b=box(.32,.38,.5,c,x+s*.33,.68+n*.55,-7.6+z*.6);b.castShadow=false}}
  placa(["ÓLEOS","FILTROS","ADITIVOS","FREIOS","ACESSÓRIOS","ELÉTRICA"][i%6],x,2.25,-8.2,1,"#111827","#f5b301")});
 // geladeira/expositor no fundo
 box(Math.min(16,WX-12),2,1,0xdde3ea,x0+3+Math.min(16,WX-12)/2,1,-DZ/2+.9,{metalness:.3,roughness:.4});
 // caixas (checkouts)
 const M=SIM.M;SIM.cxPos=M.cx.map((c,i)=>({x:x0+3+i*3.1,z:5.2}));
 SIM.cxObj=M.cx.map((c,i)=>{const p=SIM.cxPos[i];box(2.2,.95,.8,0x1f2937,p.x,.48,p.z);box(2.2,.05,.8,0xe5e7eb,p.x,.98,p.z);box(.5,.35,.05,0x0f172a,p.x-.6,1.25,p.z+.15);
  const pl=placa("CX "+String(i+1).padStart(2,"0"),p.x,2.2,p.z,.7,"#ffffff","#111827");const luz=box(.12,.12,.12,0x22c55e,p.x+.95,1.15,p.z,{emissive:0x22c55e,emissiveIntensity:1});return{pl,luz}});
 placa("ATENDIMENTO",-x0-(troca?12:5),1.4,6.6,1.4,"#ffffff","#0b3d2a");box(3,1,.8,0x0b3d2a,-x0-(troca?12:5),.5,6.0);
 // área de troca de óleo
 SIM.boxPos=[];if(troca){const bx0=-x0-6.5;box(.2,2.6,DZ,0xffffff,bx0-3.4,1.3,0);
  for(let i=0;i<M.box.length;i++){const z=-7+i*6;SIM.boxPos.push({x:bx0,z});box(5.5,.02,3.6,0xfacc15,bx0,.02,z);box(5.2,.03,3.2,0x9ca3af,bx0,.04,z);box(.15,1.6,.15,0x6b7280,bx0-2.3,.8,z-1.6);box(.15,1.6,.15,0x6b7280,bx0-2.3,.8,z+1.6);
   placa("BOX "+(i+1),bx0,2.2,z-1.9,.8,"#f5b301","#111827")}
  placa("TROCA DE ÓLEO",bx0,2.5,-DZ/2+.22,2.4,"#111827","#f5b301")}
 // pessoas
 const geoC=new THREE.CapsuleGeometry(.22,.7,4,8),geoH=new THREE.SphereGeometry(.17,12,10),pele=[0xf1c27d,0xe0ac69,0xc68642,0x8d5524,0xffdbac];
 const pessoa=(cor,colete)=>{const g=new THREE.Group();const b=new THREE.Mesh(geoC,mat(cor));b.position.y=.6;b.castShadow=true;g.add(b);const h=new THREE.Mesh(geoH,mat(pele[Math.random()*pele.length|0]));h.position.y=1.28;h.castShadow=true;g.add(h);
  if(colete){const v=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.45,10),mat(0xf97316,{emissive:0x7a2e00,emissiveIntensity:.25}));v.position.y=.75;g.add(v)}
  const sel=new THREE.Mesh(new THREE.RingGeometry(.32,.4,20),new THREE.MeshBasicMaterial({color:0xf5b301,side:THREE.DoubleSide}));sel.rotation.x=-Math.PI/2;sel.position.y=.02;sel.visible=false;g.add(sel);g.userData.sel=sel;sc.add(g);return g};
 SIM.pessoa=pessoa;SIM.sc=sc;SIM.THREE=THREE;
 // funcionários
 SIM.staff=[];M.cx.forEach((c,i)=>{const g=pessoa(0x0b3d2a,true);const p=SIM.cxPos[i];g.position.set(p.x,0,p.z+.9);g.rotation.y=Math.PI;g.userData={tipo:"func",nome:(SIM.info.staff.filter(f=>f.cargo==="caixa")[i]||{}).nome||"Operador(a) de caixa",cargo:"Caixa",cx:i};SIM.staff.push(g)});
 const vagando=(arr,cargo,qtd)=>{for(let i=0;i<qtd;i++){const g=pessoa(0x0b3d2a,true);const f=arr[i]||{};g.position.set(SIM.aisles[i%SIM.aisles.length],0,0);g.userData={tipo:"func",nome:f.nome||cargo,cargo,alvo:null,par:0};SIM.staff.push(g)}};
 vagando(SIM.info.vend,"Vendedor(a)",Math.max(1,Math.min(4,SIM.info.vend.length)));vagando(SIM.info.est,"Estoquista",Math.max(1,Math.min(2,SIM.info.est.length)));vagando(SIM.info.ger,"Gerente",1);
 SIM.mecs=[];SIM.boxPos.forEach((b,i)=>{if(i<Math.max(1,SIM.info.mec)){const g=pessoa(0x1f2937,true);g.position.set(b.x-1.6,0,b.z+1.2);g.userData={tipo:"func",nome:"Mecânico "+(i+1),cargo:"Mecânico/Trocador",box:i};SIM.mecs.push(g)}});
 // clientes e carros
 SIM.obj=new Map();SIM.carObj=new Map();const ent={x:0,z:DZ/2+2};SIM.ent=ent;SIM.DZ=DZ;SIM.x0=x0;
 const carro=cor=>{const g=new THREE.Group();const c1=new THREE.Mesh(new THREE.BoxGeometry(1.9,.6,4),mat(cor,{metalness:.5,roughness:.35}));c1.position.y=.55;c1.castShadow=true;g.add(c1);const c2=new THREE.Mesh(new THREE.BoxGeometry(1.7,.5,2.1),mat(0x111827,{metalness:.6,roughness:.2}));c2.position.set(0,1.05,-.2);g.add(c2);
  [[-.85,1.3],[.85,1.3],[-.85,-1.3],[.85,-1.3]].forEach(([x,z])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.33,.33,.25,14),mat(0x111111));w.rotation.z=Math.PI/2;w.position.set(x,.33,z);g.add(w)});sc.add(g);return g};
 SIM.cb={novo:c=>{const g=pessoa(c.cor);g.position.set(ent.x+(Math.random()-.5)*2,0,ent.z);g.userData={tipo:"cli",c};const rota=[];const ai=[...SIM.aisles].sort(()=>Math.random()-.5).slice(0,c.itens);
   rota.push({x:(Math.random()-.5)*3,z:8.2});ai.forEach(ax=>{rota.push({x:ax,z:2.4});rota.push({x:ax,z:-1-Math.random()*6.5,olha:3+Math.random()*7});rota.push({x:ax,z:2.4})});
   SIM.obj.set(c.id,{g,c,rota,i:0,espera:0,vel:1.1+Math.random()*.4})},
  paga:(cl,cx)=>{},pago:(cl,cx)=>{const o=SIM.obj.get(cl.id);if(o){o.rota=[{x:SIM.cxPos[cx.id].x,z:7.2},{x:ent.x,z:DZ/2+.5},{x:ent.x+(Math.random()-.5)*4,z:DZ/2+5}];o.i=0;o.sai=true}},
  desiste:cl=>{const o=SIM.obj.get(cl.id);log(`${cl.nome} desistiu da fila após ${Math.round(cl.espera/60)} min`);if(o){o.g.children[0].material=mat(0x9ca3af);o.rota=[{x:o.g.position.x,z:2.6},{x:ent.x,z:8.2},{x:ent.x,z:DZ/2+5}];o.i=0;o.sai=true}},
  carro:k=>{const g=carro(k.cor);g.position.set(-x0+6,0,DZ/2+3);g.rotation.y=Math.PI;SIM.carObj.set(k.id,{g,k,alvo:{x:-x0+4,z:DZ/2+3+SIM.M.filaCar.length*5}});log("Carro chegou para troca de óleo")},
  carBox:(k,b)=>{const o=SIM.carObj.get(k.id);if(o){const p=SIM.boxPos[b.id];o.alvo={x:p.x,z:p.z};o.box=b.id}},
  carSai:(k,b)=>{const o=SIM.carObj.get(k.id);if(o){o.alvo={x:-x0+6,z:DZ/2+8};o.sai=true}},log};
 // estado inicial: já tem clientes na loja
 for(let i=0;i<Math.round(6*SIM.info.f);i++){const c={id:M.nid++,nome:NOMES[Math.random()*NOMES.length|0],busca:BUSCA[Math.random()*BUSCA.length|0],est:"entra",itens:1+(Math.random()*2|0),pac:SIM.p.paciencia*60*(.6+Math.random()*.8),espera:0,ticket:SIM.p.ticket,cor:CORES[i%CORES.length]};M.cli.push(c);SIM.cb.novo(c);const o=SIM.obj.get(c.id);o.i=1+(Math.random()*o.rota.length-1|0);const r=o.rota[Math.max(0,o.i-1)];o.g.position.set(r.x,0,r.z)}
 // mapa de calor
 const hc=document.createElement("canvas");hc.width=hc.height=128;SIM.heatC=hc;SIM.heatA=new Float32Array(128*128);const ht=new THREE.CanvasTexture(hc);SIM.heatT=ht;
 const hm=new THREE.Mesh(new THREE.PlaneGeometry(WX,DZ),new THREE.MeshBasicMaterial({map:ht,transparent:true,opacity:.75,depthWrite:false}));hm.rotation.x=-Math.PI/2;hm.position.y=.05;hm.visible=false;sc.add(hm);SIM.heatMesh=hm;SIM.WX=WX;
 // controles de câmera (arrastar = girar, roda = zoom) e clique para ver quem é
 let az=-.55,el=.9,dist=troca?46:38,drag=null;const tgt=new THREE.Vector3(troca?2:0,0,0);
 ren.domElement.addEventListener("pointerdown",e=>{drag=[e.clientX,e.clientY,az,el,0];ren.domElement.setPointerCapture(e.pointerId)});
 ren.domElement.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag[0],dy=e.clientY-drag[1];drag[4]+=Math.abs(dx)+Math.abs(dy);if(SIM.cam!=="geral"&&SIM.cam!=="topo")return;az=drag[2]-dx*.006;el=Math.max(.25,Math.min(1.5,drag[3]+dy*.005))});
 ren.domElement.addEventListener("pointerup",e=>{const moved=drag&&drag[4]>6;drag=null;if(!moved)clique(e)});
 ren.domElement.addEventListener("wheel",e=>{e.preventDefault();dist=Math.max(12,Math.min(80,dist*(1+Math.sign(e.deltaY)*.1)))},{passive:false});
 const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
 function clique(e){const r=ren.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,cam);
  const alvos=[...SIM.obj.values()].map(o=>o.g).concat(SIM.staff,SIM.mecs);const hit=ray.intersectObjects(alvos,true)[0];
  if(SIM.selG)SIM.selG.userData.sel.visible=false;SIM.selG=null;const box=document.getElementById("cfI");if(!hit){box.style.display="none";return}
  let g=hit.object;while(g.parent&&!alvos.includes(g))g=g.parent;SIM.selG=g;g.userData.sel.visible=true;box.style.display="block";infoSel()}
 const cams={cam1:[[0,4.2,DZ/2-.6],[0,0,0]],cam2:[[x0+1,4,10],[x0+9,0,4]],cam3:[[x0+1,4.2,-DZ/2+1],[x0+12,0,-2]],cam4:[[-x0-1,4.2,DZ/2-1],[-x0-6.5,0,-3]]};
 function tamanho(){const w=vw.clientWidth,h=vw.clientHeight;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
 new ResizeObserver(tamanho).observe(vw);tamanho();
 SIM.vivo=true;let last=performance.now(),acc=0,ui=0;
 function frame(now){if(!SIM||!SIM.vivo)return;requestAnimationFrame(frame);const dtR=Math.min(.1,(now-last)/1000);last=now;
  if(!SIM.pausa){const dt=dtR*SIM.vel;let r=dt;while(r>0){const s=Math.min(.5,r);passo(SIM.M,s,SIM.cb);r-=s}mover(dt,dtR)}
  if(SIM.cam==="geral"||SIM.cam==="topo"){const e2=SIM.cam==="topo"?1.52:el;cam.fov=42;cam.position.set(tgt.x+dist*Math.cos(e2)*Math.sin(az),dist*Math.sin(e2),tgt.z+dist*Math.cos(e2)*Math.cos(az));cam.lookAt(tgt)}
  else{const [p,l]=cams[SIM.cam];cam.fov=78;cam.position.set(...p);cam.lookAt(...l)}cam.updateProjectionMatrix();
  // luz do caixa: verde aberto, vermelho fechado
  SIM.M.cx.forEach((c,i)=>{const o=SIM.cxObj[i];const col=c.aberto?0x22c55e:c.abreEm!=null?0xf59e0b:0xef4444;o.luz.material.color.setHex(col);o.luz.material.emissive.setHex(col);const st=SIM.staff[i];if(st)st.visible=c.aberto||c.abreEm!=null});
  ren.render(sc,cam);ui+=dtR;if(ui>.4){ui=0;kpis();grafico();if(SIM.aba==="op")atualizaOp();if(SIM.aba==="ind")atualizaInd();if(SIM.selG)infoSel();if(SIM.heat)pintaCalor()}}
 requestAnimationFrame(frame)}
function infoSel(){const g=SIM.selG,box=document.getElementById("cfI");if(!g||!box)return;const u=g.userData;
 if(u.tipo==="func")box.innerHTML=`<b>${esc(u.nome)}</b><br><span style="color:#8b97a6">${esc(u.cargo)} · ${esc(SIM.info.nome)}</span>`;
 else{const c=u.c;const est={entra:"Procurando produtos",fila:"Na fila do CX "+String((c.cx||0)+1).padStart(2,"0"),paga:"Pagando",sai:"Saindo da loja",desiste:"Desistiu e foi embora"}[c.est]||c.est;
  box.innerHTML=`<b>${esc(c.nome)}</b> <span style="color:#8b97a6">cliente</span><br>🔎 Procura: ${esc(c.busca)}<br>🛒 ${c.itens} item(ns) · ticket ~${RS(c.ticket)}<br>📍 ${est}${c.est==="fila"?`<br>⏱️ Esperando ${Math.floor(c.espera/60)} min ${Math.round(c.espera%60)} s (paciência ~${Math.round(c.pac/60)} min)`:""}`}}
function pintaCalor(){const a=SIM.heatA,g=SIM.heatC.getContext("2d"),img=g.createImageData(128,128);let mx=1;for(let i=0;i<a.length;i++)if(a[i]>mx)mx=a[i];
 for(let i=0;i<a.length;i++){const v=Math.pow(a[i]/mx,.5);const k=i*4;img.data[k]=255;img.data[k+1]=Math.round(255*(1-v));img.data[k+2]=0;img.data[k+3]=Math.round(v*200)}g.putImageData(img,0,0);SIM.heatT.needsUpdate=true}
function anda(g,alvo,v,dt){const dx=alvo.x-g.position.x,dz=alvo.z-g.position.z,d=Math.hypot(dx,dz);if(d<.05)return true;const s=Math.min(d,v*dt);g.position.x+=dx/d*s;g.position.z+=dz/d*s;g.rotation.y=Math.atan2(dx,dz);
 g.children[0].position.y=.6+Math.abs(Math.sin(performance.now()/120))*.04;return false}
function mover(dt,dtR){const M=SIM.M;
 for(const [id,o] of SIM.obj){const c=o.c,g=o.g;
  if(c.est==="entra"||o.sai){if(o.olhando>0){o.olhando-=dt;g.rotation.y+=Math.sin(performance.now()/400)*.02;continue}
   const r=o.rota[o.i];if(!r){if(o.sai){SIM.sc.remove(g);SIM.obj.delete(id);M.cli.splice(M.cli.indexOf(c),1);continue}entraFila(M,c);continue}
   if(anda(g,r,o.vel,dt)){if(r.olha){o.olhando=r.olha;g.rotation.y=r.x>g.position.x?Math.PI/2:-Math.PI/2}o.i++}}
  else if(c.est==="fila"){const cx=M.cx[c.cx];const pos=cx.fila.indexOf(c);const p=SIM.cxPos[c.cx];anda(g,{x:p.x,z:p.z-1-pos*.75},1.2,dt)}
  else if(c.est==="paga"){const p=SIM.cxPos[c.cx];anda(g,{x:p.x,z:p.z-.75},1.2,dt);g.rotation.y=0}
  // mapa de calor
  const hx=Math.floor((g.position.x-(-SIM.WX/2))/SIM.WX*128),hz=Math.floor((g.position.z+SIM.DZ/2)/SIM.DZ*128);if(hx>=0&&hx<128&&hz>=0&&hz<128)SIM.heatA[hz*128+hx]+=dt}
 // funcionários andando: vendedor vai até cliente procurando; estoquista repõe nos corredores; gerente circula
 SIM.staff.forEach(g=>{const u=g.userData;if(u.cx!=null)return;if(u.par>0){u.par-=dt;return}
  if(!u.alvo){if(u.cargo.startsWith("Vend")){const cs=[...SIM.obj.values()].filter(o=>o.olhando>0);const o=cs[Math.random()*cs.length|0];u.alvo=o?{x:o.g.position.x+.6,z:o.g.position.z}:{x:SIM.aisles[Math.random()*SIM.aisles.length|0],z:-1-Math.random()*6}}
   else if(u.cargo==="Estoquista"){u.alvo={x:SIM.aisles[Math.random()*SIM.aisles.length|0],z:-1-Math.random()*6.5}}
   else u.alvo={x:SIM.x0+3+Math.random()*(SIM.WX-8),z:Math.random()<.5?2.4:7}}
  if(anda(g,u.alvo,1,dt)){u.alvo=null;u.par=3+Math.random()*8}});
 SIM.mecs.forEach(g=>{const b=M.box[g.userData.box];const p=SIM.boxPos[g.userData.box];if(b&&b.car){anda(g,{x:p.x-1.3+Math.sin(performance.now()/1500)*.6,z:p.z-1.3},1,dt)}else anda(g,{x:p.x-2.6,z:p.z+1.4},1,dt)});
 for(const [id,o] of SIM.carObj){const g=o.g;const dx=o.alvo.x-g.position.x,dz=o.alvo.z-g.position.z,d=Math.hypot(dx,dz);
  if(d>.1){const s=Math.min(d,3*dt);g.position.x+=dx/d*s;g.position.z+=dz/d*s;g.rotation.y=Math.atan2(dx,dz)}else if(o.sai){SIM.sc.remove(g);SIM.carObj.delete(id)}
  else if(o.box!=null)g.position.y=.35+Math.sin(performance.now()/2000)*.0}}
// ---------------- botões na aba Câmeras ----------------
const oC=V.cftv;V.cftv=function(){const h=oC.apply(this,arguments);const ls=S.lojas.filter(l=>l.tipo!=="transp"&&!l.encerrada);
 return `<div class="card" style="border:1px solid rgba(245,179,1,.35)"><h3>🎥 Monitoramento 3D ao vivo</h3><p class="muted" style="margin:0 0 10px">Veja a loja em 3D: clientes procurando produtos, filas nos caixas, funcionários trabalhando e a troca de óleo. Abra/feche caixas, acelere o tempo, compare cenários e veja o impacto financeiro.</p>
 <div style="display:flex;flex-wrap:wrap;gap:8px">${ls.map(l=>`<button class="b ${l.id===ls[0].id?"g":"s"}" onclick="abrirCF3(${l.id})">${esc(nomeLoja(l))}</button>`).join("")}</div></div>`+h};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.getElementById("cf3"))fechar()});
})();
