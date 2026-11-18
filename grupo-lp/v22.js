// v22: concessionária/revenda de veículos funcionando (ex.: LP Carros): comprar carros para o pátio e vender de verdade
(function(){const W=window;
const CAT=[["Fiat","Mobi Like 1.0",78900],["Renault","Kwid Zen 1.0",74990],["Chevrolet","Onix LT 1.0",96490],["Hyundai","HB20 Comfort 1.0",92990],["Volkswagen","Polo Track 1.0",89990],["Fiat","Argo Drive 1.0",91990],["Fiat","Strada Freedom CS",109990],["Volkswagen","Saveiro Robust CS",103990],["Fiat","Toro Freedom 1.3T",159990],["Chevrolet","Tracker LT 1.0T",139990],["Volkswagen","T-Cross 200 TSI",149990],["Hyundai","Creta Comfort 1.0T",146990],["Jeep","Renegade Longitude",149990],["Jeep","Compass Longitude",199990],["Toyota","Corolla XEi 2.0",164990],["Toyota","Corolla Cross XRE",189990],["Honda","HR-V EXL",179990],["Nissan","Kicks Advance",129990],["Chevrolet","S10 LT 2.8 Diesel",259990],["Toyota","Hilux SRV 2.8 Diesel",289990],["Ford","Ranger XLS 2.0 Diesel",249990],["Mitsubishi","L200 Triton Sport",259990],["BYD","Dolphin Mini (elétrico)",115800],["BYD","Song Plus DM-i",229800],["Honda","CG 160 Titan (moto)",19990],["Yamaha","Fazer FZ25 (moto)",24990]];
const veic=l=>l&&!l.encerrada&&l.tipo!=="transp"&&segDe(l)==="veic";
let OFS=[];
function ofertas(){const out=[];CAT.forEach(([m,mod,p])=>{out.push({m,mod,ano:2026,km:0,novo:1,custo:Math.round(p*r(.86,.9)/100)*100,fipe:p,prazo:ri(5,20)})});
 for(let i=0;i<10;i++){const [m,mod,p]=pick(CAT),ano=ri(2017,2024),idade=2026-ano,f=Math.max(.38,1-idade*.075-r(0,.06));const fipe=Math.round(p*f/100)*100;out.push({m,mod,ano,km:idade*ri(9000,18000),novo:0,custo:Math.round(fipe*r(.78,.88)/100)*100,fipe,prazo:0,orig:pick(["Leilão Copart","Leilão Sodré Santoro","Troca de cliente","Locadora (renovação de frota)","Particular"])})}
 return out}
W.comprarParaRevenda=function(){const l=S.lojas[lojaSel];if(!veic(l))return toast("Selecione uma loja de concessionária/revenda");OFS=ofertas();telaCompra()};
function telaCompra(){const l=S.lojas[lojaSel],cx=(S.lcx&&S.lcx[l.id]!=null)?S.lcx[l.id]:(S.ecx[l.emp]||0);
 modal(`<div class="row sb"><h2 style="margin:0">🚗 Comprar veículos para o pátio</h2><button class="b s" onclick="fecha()">✕</button></div>
 <p class="muted">${esc(nomeLoja(l))} · caixa da loja ${R$(cx)} (pode usar o limite da conta). Zero km chegam da montadora no prazo; seminovos entram no pátio na hora.</p>
 <div class="tw" style="max-height:430px"><table><tr><th>Veículo</th><th>Origem</th><th>FIPE</th><th>Custo</th><th></th></tr>${OFS.map((o,i)=>`<tr><td><b>${o.m} ${esc(o.mod)}</b><div class="muted">${o.ano}${o.novo?" · 0 km":" · "+o.km.toLocaleString("pt-BR")+" km"}</div></td><td>${o.novo?"Montadora (chega em "+o.prazo+" dias)":esc(o.orig)}</td><td>${R$(o.fipe)}</td><td><b>${R$(o.custo)}</b></td><td><button class="b g" onclick="compraCarro(${i})">Comprar</button></td></tr>`).join("")}</table></div>
 <div class="row" style="margin-top:8px"><button class="b s" onclick="comprarParaRevenda()">🔄 Novas ofertas</button></div>`)}
W.compraCarro=function(i){const l=S.lojas[lojaSel],o=OFS[i];if(!o||!veic(l))return;const lim=W.LIMNEG?LIMNEG():0;
 lojaCtx(l.id);if(S.caixaGrupo+lim<o.custo)return toast("Caixa insuficiente");lojaCtx(l.id);S.caixaGrupo-=o.custo;
 l.vei=l.vei||[];const c={id:S.nid++,m:o.m,mod:o.mod,ano:o.ano,km:o.km,novo:o.novo,custo:o.custo,fipe:o.fipe,preco:Math.round(o.fipe*(o.novo?1.0:1.04)/100)*100,chega:o.novo?S.simMs+o.prazo*86400000:0};l.vei.push(c);
 OFS.splice(i,1);log(`🚗 ${nomeLoja(l)} comprou ${o.m} ${o.mod} ${o.ano} por ${R$(o.custo)}${o.novo?" – chega em "+o.prazo+" dias":""}`);save();telaCompra()};
W.precoCarro=function(lid,cid){const l=S.lojas[lid],c=(l.vei||[]).find(x=>x.id===cid);if(!c)return;const v=prompt(`Preço de venda do ${c.m} ${c.mod} (FIPE ${R$(c.fipe)}, custo ${R$(c.custo)}):`,c.preco);if(!v)return;c.preco=+String(v).replace(/\D/g,"")||c.preco;save();render()};
// bloqueia a venda "genérica" que não mexe no estoque; a venda real é feita abaixo
const oV=W.venda;W.venda=function(l){if(veic(l)&&!W._v22)return;return oV.apply(this,arguments)};
function vendeCarro(l,h){const pat=(l.vei||[]).filter(c=>!c.chega||S.simMs>=c.chega);if(!pat.length)return;
 const vend=S.func.filter(f=>f.loja===l.id&&(f.cargo==="vend"||f.cargo==="ger")).length;
 // preço acima da FIPE espanta cliente; abaixo vende rápido
 const c=pick(pat),rel=c.preco/c.fipe,p=.07*(1+vend*.25)*(l.f||1)*Math.max(.15,Math.min(2.2,(1.12-rel)*6));if(Math.random()>p)return;
 const desc=r(0,.035),v=Math.round(c.preco*(1-desc)/100)*100,fin=Math.random()<.6,cli=pick(["Carlos","Ana","João","Patrícia","Marcos","Juliana","Rafael","Fernanda","Diego","Luciana"])+" "+pick(["Souza","Lima","Pereira","Costa","Almeida","Rocha","Oliveira"]);
 l.vei=l.vei.filter(x=>x!==c);const k=new Date(S.simMs).toDateString(),ra=l.rawD,aa=l.alvoHoje,rd=l.rawDia;l.rawD=k;l.rawDia=0;l.alvoHoje=1e12;W._v22=1;
 try{venda(l,v,c.custo,h,null,cli)}finally{W._v22=0;l.alvoHoje=aa;l.rawD=ra;l.rawDia=rd}
 if(fin){const com=Math.round(v*.8*r(.015,.03));lojaCtx(l.id);S.caixaGrupo+=com;log(`🏦 Retorno do financiamento (${pick(["Santander","BV","Itaú","Bradesco"])} Financiamentos): +${R$(com)}`)}
 log(`🚗✅ ${nomeLoja(l)} vendeu ${c.m} ${c.mod} ${c.ano} para ${cli} por ${R$(v)}${fin?" (financiado)":" (à vista)"} – lucro ${R$(v-c.custo)}`);try{toast(`🚗 Carro vendido: ${c.mod} – ${R$(v)}`)}catch(e){}}
W._vc=vendeCarro;let hAnt=null;setInterval(()=>{if(typeof S==="undefined"||!S||!S.lojas)return;const d=new Date(S.simMs),hk=d.toDateString()+d.getHours();if(hk===hAnt)return;const pulou=hAnt!==null;hAnt=hk;if(!pulou)return;
 S.lojas.filter(veic).forEach(l=>{(l.vei||[]).forEach(c=>{if(c.chega&&S.simMs>=c.chega){c.chega=0;log(`🚚 Chegou no pátio da ${nomeLoja(l)}: ${c.m} ${c.mod} 0 km`)}});if(aberto(d,l))vendeCarro(l,d.getHours())})},500);
// tela da loja
const oL=V.loja;V.loja=function(){const h=oL.apply(this,arguments),l=S.lojas[lojaSel];if(!veic(l))return h;const vs=l.vei||[];
 return `<div class="card"><div class="row sb"><h3 style="margin:0">🚗 Pátio de veículos – ${esc(nomeLoja(l))}</h3><button class="b g" onclick="comprarParaRevenda()">➕ Comprar veículos para revenda</button></div>
 <p class="muted">Clientes compram sozinhos quando a loja está aberta (com vendedores vende mais). Preço perto ou abaixo da FIPE vende mais rápido. ${vs.length} veículo(s) no pátio · valor de estoque ${R$(vs.reduce((a,c)=>a+c.custo,0))}</p>
 ${vs.length?`<div class="tw"><table><tr><th>Veículo</th><th>Custo</th><th>FIPE</th><th>Preço de venda</th><th></th></tr>${vs.map(c=>`<tr><td><b>${c.m} ${esc(c.mod)}</b> <span class="muted">${c.ano}${c.novo?" 0 km":" · "+c.km.toLocaleString("pt-BR")+" km"}</span>${c.chega&&S.simMs<c.chega?' <span class="pill y">a caminho</span>':""}</td><td>${R$(c.custo)}</td><td>${R$(c.fipe)}</td><td><b>${R$(c.preco)}</b></td><td><button class="b s" onclick="precoCarro(${l.id},${c.id})">✏️ Preço</button></td></tr>`).join("")}</table></div>`:'<p>Pátio vazio – compre veículos para começar a vender.</p>'}</div>`+h};
})();
// caminhão viaja mesmo sem dinheiro: o que passar do limite da conta vira boleto do fornecedor (28 dias)
(function(){const W=window,BIG=1e12;
function semTrava(nome){const o=W[nome];if(typeof o!=="function"||o.__v22)return;const f=function(){
 const ke=Object.keys(S.ecx||{}),kl=Object.keys(S.lcx||{}),be={},bl={};ke.forEach(k=>{be[k]=S.ecx[k];S.ecx[k]+=BIG});kl.forEach(k=>{bl[k]=S.lcx[k];S.lcx[k]+=BIG});let r;
 try{r=o.apply(this,arguments)}finally{ke.forEach(k=>S.ecx[k]-=BIG);kl.forEach(k=>S.lcx[k]-=BIG);
  const lim=W.LIMNEG?LIMNEG():0;let bol=0;
  ke.forEach(k=>{if(S.ecx[k]<be[k]&&S.ecx[k]<-lim){const x=Math.min(be[k]-S.ecx[k],-lim-S.ecx[k]);S.ecx[k]+=x;bol+=x}});
  kl.forEach(k=>{if(S.lcx[k]<bl[k]&&S.lcx[k]<-lim){const x=Math.min(bl[k]-S.lcx[k],-lim-S.lcx[k]);S.lcx[k]+=x;bol+=x}});
  if(bol>1){addConta("Mercadoria/frete da viagem – boleto do fornecedor",bol,S.simMs+28*86400000,"Fornecedor");log(`🧾 Sem saldo: ${R$(bol)} da viagem foi faturado no boleto (vence em 28 dias)`)}}
 return r};f.__v22=1;W[nome]=f}
function aplica(){["iniciarViagem","coletar","dirigirCam","despachoAuto","enviarCaminhao","mandarViagem"].forEach(semTrava)}
aplica();setTimeout(aplica,3500);
})();
