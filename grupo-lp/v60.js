// v60: ranking de produtos (mais vendidos e parados) + consumo de diesel da frota
(function(){const W=window,H=36e5,D=24*H;
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
function X(){S.v60=S.v60||{};const x=S.v60;const mk=new Date(S.simMs).getFullYear()*12+new Date(S.simMs).getMonth();if(x.mk!==mk){x.ant=x.pv&&Object.keys(x.pv).length?{mk:x.mk,pv:x.pv}:x.ant;x.pv={};x.mk=mk}x.ult=x.ult||{};x.ini=x.ini||S.simMs;return x}
const P=i=>{try{return prod(i)}catch(e){return null}};
// ----- registra cada venda por produto -----
const oV=W.venda;if(oV&&!oV.__v60){W.venda=function(l){let ant=null;try{if(l&&l.est)ant=Object.assign({},l.est)}catch(e){}const r=oV.apply(this,arguments);
 try{if(ant){const x=X();for(const k in ant){const d=(ant[k]||0)-(l.est[k]||0);if(d>0&&d<5000){const p=P(k);const e=x.pv[k]=x.pv[k]||{q:0,r:0,lj:{}};e.q+=d;e.r+=d*((p&&p.preco)||0);e.lj[l.id]=(e.lj[l.id]||0)+d;x.ult[k]=S.simMs}}}}catch(e){}return r};W.venda.__v60=1}
// ----- diesel -----
const KML={cavalo:2.3,rigido:3.4,pickup:9.5,toco:4.2,van:8};
const PRECO=6.15;
function diesel(){const x=X(),mk=x.mk;if(!x.dk){x.dk=S.simMs;return}const dh=(S.simMs-x.dk)/H;x.dk=S.simMs;if(dh<=0||dh>48)return;
 S.frota.forEach(v=>{if(["implemento","carretinha"].includes(v.tipo))return;v.dsl=v.dsl&&v.dsl.mk===mk?v.dsl:{mk,km:0,L:0,ant:v.dsl&&v.dsl.mk!==mk?{km:v.dsl.km,L:v.dsl.L}:(v.dsl&&v.dsl.ant)};
  if(v.status&&v.status!=="Garagem"){const km=dh*(v.tipo==="carro"?40:60);const kml=(KML[v.tipo]||3)*(v.ano&&v.ano<2015?.9:1)*(v.kmO>30000?.93:1);v.dsl.km+=km;v.dsl.L+=km/kml}})}
// ----- telas -----
function cardProd(){const x=X();const fonte=Object.keys(x.pv).length?x.pv:(x.ant?x.ant.pv:{});const top=Object.entries(fonte).map(([k,e])=>({k,p:P(k),...e})).filter(z=>z.p).sort((a,b)=>b.r-a.r).slice(0,20);
 const tot=Object.values(fonte).reduce((a,e)=>a+e.r,0)||1;
 const est={};S.lojas.filter(l=>!l.encerrada).forEach(l=>Object.entries(l.est||{}).forEach(([k,q])=>{if(q>0)est[k]=(est[k]||0)+q}));
 const dias=(S.simMs-x.ini)/D;const lim=S.simMs-Math.min(30,Math.max(3,dias))*D;
 const par=Object.entries(est).filter(([k])=>!(x.ult[k]>lim)).map(([k,q])=>{const p=P(k);return{k,p,q,v:q*((p&&p.custo)||0)}}).filter(z=>z.p).sort((a,b)=>b.v-a.v).slice(0,20);const parT=par.reduce((a,z)=>a+z.v,0);
 return `<div class="card"><h3>🏆 Produtos mais vendidos ${Object.keys(x.pv).length?"(este mês)":"(mês passado)"}</h3>${top.length?`<div class="tw"><table><tr><th>#</th><th>Produto</th><th>Unid.</th><th>Faturamento</th><th>%</th><th>Onde vende mais</th></tr>${top.map((z,i)=>{const lj=Object.entries(z.lj).sort((a,b)=>b[1]-a[1])[0];return `<tr><td>${i+1}</td><td>${esc(z.p.nome)}</td><td>${Math.round(z.q).toLocaleString("pt-BR")}</td><td>${R$(z.r)}</td><td>${(z.r/tot*100).toFixed(1).replace(".",",")}%</td><td class="muted">${lj?esc(nl(+lj[0])):""}</td></tr>`}).join("")}</table></div>`:`<p class="muted">Ainda contando… o ranking aparece conforme as lojas forem vendendo.</p>`}</div>
 <div class="card"><h3>🐌 Produtos parados no estoque</h3><p class="muted" style="font-size:12px">Sem nenhuma venda ${dias<30?`desde que comecei a contar (${Math.max(0,dias).toFixed(0)} dia(s))`:"nos últimos 30 dias"}. Dinheiro parado: <b style="color:#ef4444">${R$(parT)}</b>. Dica: faça promoção ou pare de comprar esses itens.</p>
 ${par.length?`<div class="tw"><table><tr><th>Produto</th><th>Estoque (todas as lojas)</th><th>Valor parado</th></tr>${par.map(z=>`<tr><td>${esc(z.p.nome)}</td><td>${Math.round(z.q).toLocaleString("pt-BR")}</td><td>${R$(z.v)}</td></tr>`).join("")}</table></div>`:`<p class="muted">Nenhum produto parado. 👍</p>`}</div>`}
function cardDiesel(){X();const vs=S.frota.filter(v=>v.dsl);const tot=vs.reduce((a,v)=>a+v.dsl.L,0);const kmT=vs.reduce((a,v)=>a+v.dsl.km,0);
 return `<div class="card"><h3>⛽ Consumo de diesel da frota (este mês)</h3><div class="row" style="gap:18px;flex-wrap:wrap"><span>Litros: <b>${Math.round(tot).toLocaleString("pt-BR")} L</b></span><span>Gasto: <b style="color:#ef4444">${R$(tot*PRECO)}</b></span><span>Rodado: <b>${Math.round(kmT).toLocaleString("pt-BR")} km</b></span><span class="muted">Diesel a ${R$(PRECO)}/L</span></div>
 <div class="tw" style="margin-top:8px"><table><tr><th>Veículo</th><th>km no mês</th><th>Litros</th><th>Média</th><th>Gasto</th><th>Mês passado</th></tr>${vs.sort((a,b)=>b.dsl.L-a.dsl.L).map(v=>{const d=v.dsl,m=d.L?d.km/d.L:0,ant=d.ant;return `<tr><td>${esc(v.mod)} ${v.placa||""}</td><td>${Math.round(d.km).toLocaleString("pt-BR")}</td><td>${Math.round(d.L).toLocaleString("pt-BR")}</td><td style="color:${m&&m<(KML[v.tipo]||3)*.95?"#f5b301":"inherit"}">${m?m.toFixed(1).replace(".",",")+" km/L":"—"}</td><td>${R$(d.L*PRECO)}</td><td class="muted">${ant?R$(ant.L*PRECO):"—"}</td></tr>`}).join("")}</table></div>
 <p class="muted" style="font-size:12px">Média em amarelo = gastando mais que o normal (caminhão velho ou óleo vencido). Trocar o óleo em dia melhora o consumo.</p></div>`}
let inst=false;function instala(){if(inst||typeof V==="undefined")return;inst=true;const w=(k,fn)=>{if(!V[k])return;const o=V[k];V[k]=function(){const a=o.apply(this,arguments);let c="";try{c=fn()}catch(e){console.warn(e)}return c+a}};
 w("estoque",cardProd);w("frota",cardDiesel);try{render()}catch(e){}}
setTimeout(instala,13000);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.frota)return;diesel()}catch(e){console.warn("v60",e)}},1000);
})();
