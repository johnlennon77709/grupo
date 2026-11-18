// v8: dinheiro separado por empresa + imóveis no Brasil todo e no exterior
(function(){
const W=window;
// ---------- contas separadas por empresa ----------
W._ctx=null;
W.empCtx=function(x){const k=typeof x==="string"?x:(x&&x.emp);if(k&&EMP[k]){W._ctx=k;queueMicrotask(()=>{W._ctx=null})}};
function emp(){const k=W._ctx||S.empAt;return EMP[k]?k:Object.keys(EMP)[0]}
function instala(){const d=Object.getOwnPropertyDescriptor(S,"caixaGrupo");if(d&&d.get)return;S.ecx=S.ecx||{};
 if(!S.cxMig){const tot=+(d&&d.value)||0,ks=Object.keys(EMP),n={};ks.forEach(k=>n[k]=S.lojas.filter(l=>l.emp===k).length);const soma=Object.values(n).reduce((a,b)=>a+b,0)||1;ks.forEach(k=>{if(n[k])S.ecx[k]=(S.ecx[k]||0)+tot*n[k]/soma;else S.ecx[k]=S.ecx[k]||0});S.cxMig=1;S.empAt="LP";try{log("🏦 Agora cada empresa tem a sua própria conta. O caixa do grupo foi dividido entre as empresas.")}catch(e){}}
 if(!EMP[S.empAt])S.empAt=Object.keys(EMP)[0];
 delete S.caixaGrupo;Object.defineProperty(S,"caixaGrupo",{configurable:true,enumerable:true,get(){return S.ecx[emp()]||0},set(v){S.ecx[emp()]=v}})}
setInterval(()=>{try{instala()}catch(e){}},300);try{instala()}catch(e){}
const oV=W.venda;W.venda=function(l){const p=W._ctx;W._ctx=l&&l.emp;try{return oV.apply(this,arguments)}finally{W._ctx=p}};
const oIV=W.iniciarViagem;if(oIV)W.iniciarViagem=function(v,l){const p=W._ctx;W._ctx=l&&l.emp;try{return oIV.apply(this,arguments)}finally{W._ctx=p}};
W.trocaEmp=function(k){S.empAt=k;render()};
W.transf=function(){const de=tDe.value,para=tPa.value,v=+String(tV.value).replace(/[^\d,]/g,"").replace(",",".");if(!v||de===para)return;const lim=W.LIMNEG?LIMNEG():0;if((S.ecx[de]||0)+lim<v)return toast("Saldo insuficiente na "+EMP[de].n);S.ecx[de]-=v;S.ecx[para]=(S.ecx[para]||0)+v;log(`💸 Transferência (TED) de ${R$(v)}: ${EMP[de].n} → ${EMP[para].n}`);render()};
// esconde o "caixa do grupo" do topo
const st=document.createElement("style");st.textContent=".v8hide{display:none!important}";document.head.appendChild(st);
setInterval(()=>{const c=document.getElementById("cash");if(c&&c.parentElement)c.parentElement.classList.add("v8hide");document.querySelectorAll(".kpi,.chip,div").forEach(e=>{if(e.children.length<4&&/^\s*CAIXA DO GRUPO/i.test(e.textContent||"")&&e.textContent.length<60)e.classList.add("v8hide")})},700);
function cardContas(){const ks=Object.keys(EMP);return `<div class="card"><h3>🏦 Contas das empresas</h3><div class="muted">Cada empresa tem o seu dinheiro. Compras e pagamentos que você faz saem da <b>conta selecionada</b>; as vendas entram na conta da empresa que vendeu.</div>
 <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:8px 0">${ks.map(k=>{const v=S.ecx[k]||0,at=k===S.empAt;return `<div onclick="trocaEmp('${k}')" style="cursor:pointer;padding:10px;border-radius:10px;border:2px solid ${at?EMP[k].c:"#2a3350"};background:${at?EMP[k].c+"22":"transparent"}"><div style="font-weight:800;color:${EMP[k].c}">${EMP[k].n}${at?" ✓":""}</div><div style="font-size:18px;font-weight:900;color:${v<0?"#ef4444":"inherit"}">${R$(v)}</div><div class="muted">${S.lojas.filter(l=>l.emp===k).length} lojas</div></div>`}).join("")}</div>
 <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">Transferir <select id="tDe">${ks.map(k=>`<option value="${k}" ${k===S.empAt?"selected":""}>${EMP[k].n}</option>`).join("")}</select> → <select id="tPa">${ks.map(k=>`<option value="${k}">${EMP[k].n}</option>`).join("")}</select> R$ <input id="tV" style="width:110px" inputmode="decimal"> <button class="b s" onclick="transf()">Transferir</button></div></div>`}
const oP=V.painel;V.painel=function(){const h=oP.apply(this,arguments);return cardContas()+h.replace(/Caixa do grupo/gi,"Conta "+(EMP[S.empAt]||{}).n)};
if(V.empresas){const oE=V.empresas;V.empresas=function(){return cardContas()+oE.apply(this,arguments)}}
// ---------- imóveis no Brasil todo e no exterior ----------
const LOC={ // cidade: [UF/país, preço m², bairros]
 "Porto Velho":["RO",420,["Embratel","Nova Porto Velho","Olaria","Centro","Lagoa"]],"Cacoal":["RO",260,["Centro","Princesa Isabel","Village do Sol"]],"Ji-Paraná":["RO",270,["Centro","Nova Brasília","Urupá"]],"Vilhena":["RO",280,["Centro","Jardim América"]],
 "Rio Branco":["AC",360,["Bosque","Floresta","Centro"]],"Cuiabá":["MT",520,["Jardim das Américas","Goiabeiras","Centro Sul"]],"Sinop":["MT",380,["Jardim Botânico","Centro"]],
 "Manaus":["AM",520,["Adrianópolis","Ponta Negra","Vieiralves","Centro"]],"Belém":["PA",560,["Umarizal","Nazaré","Batista Campos"]],"Boa Vista":["RR",380,["Centro","Caçari"]],"Macapá":["AP",360,["Centro","Jardim Felicidade"]],"Palmas":["TO",480,["Plano Diretor Sul","Plano Diretor Norte"]],
 "São Luís":["MA",470,["Renascença","Calhau","Ponta d'Areia"]],"Teresina":["PI",420,["Jóquei","Fátima","Centro"]],"Fortaleza":["CE",650,["Meireles","Aldeota","Cocó"]],"Natal":["RN",600,["Ponta Negra","Petrópolis","Tirol"]],"João Pessoa":["PB",620,["Cabo Branco","Manaíra","Tambaú"]],"Recife":["PE",720,["Boa Viagem","Casa Forte","Graças"]],"Maceió":["AL",620,["Ponta Verde","Pajuçara","Jatiúca"]],"Aracaju":["SE",540,["Jardins","Atalaia","13 de Julho"]],"Salvador":["BA",700,["Barra","Pituba","Rio Vermelho","Caminho das Árvores"]],
 "Goiânia":["GO",650,["Setor Bueno","Setor Marista","Jardim Goiás"]],"Brasília":["DF",1100,["Asa Sul","Asa Norte","Lago Sul","Águas Claras"]],"Campo Grande":["MS",520,["Jardim dos Estados","Chácara Cachoeira"]],
 "Belo Horizonte":["MG",900,["Savassi","Lourdes","Funcionários","Pampulha"]],"Uberlândia":["MG",600,["Centro","Santa Mônica"]],"Vitória":["ES",850,["Praia do Canto","Jardim Camburi"]],"Rio de Janeiro":["RJ",1400,["Copacabana","Ipanema","Barra da Tijuca","Botafogo","Leblon"]],
 "São Paulo":["SP",1600,["Jardins","Moema","Pinheiros","Vila Mariana","Itaim Bibi"]],"Campinas":["SP",900,["Cambuí","Taquaral"]],"Ribeirão Preto":["SP",750,["Jardim Botânico","Centro"]],
 "Curitiba":["PR",950,["Batel","Água Verde","Bigorrilho"]],"Londrina":["PR",650,["Gleba Palhano","Centro"]],"Florianópolis":["SC",1300,["Jurerê","Centro","Lagoa da Conceição"]],"Balneário Camboriú":["SC",2200,["Barra Sul","Centro"]],"Porto Alegre":["RS",900,["Moinhos de Vento","Bela Vista","Petrópolis"]],
 "Miami (EUA)":["EUA",3800,["Brickell","Downtown","Coral Gables"]],"Orlando (EUA)":["EUA",2400,["Lake Nona","Windermere","Kissimmee"]],"Lisboa (Portugal)":["Portugal",3600,["Chiado","Parque das Nações","Alfama"]],"Porto (Portugal)":["Portugal",2600,["Foz do Douro","Boavista"]],
 "Assunção (Paraguai)":["Paraguai",900,["Villa Morra","Carmelitas"]],"Santa Cruz de la Sierra (Bolívia)":["Bolívia",700,["Equipetrol","Urubó"]],"Buenos Aires (Argentina)":["Argentina",1500,["Palermo","Recoleta","Puerto Madero"]],"Dubai (Emirados)":["Emirados",5200,["Dubai Marina","Downtown","Palm Jumeirah"]]
};
const TIPOS=[["Casa",1,[200,520],"🏠"],["Apartamento",.95,[60,220],"🏢"],["Sala comercial",1.25,[40,300],"🏬"],["Ponto comercial",1.35,[120,900],"🏪"],["Galpão",.55,[800,4000],"🏭"],["Terreno",.35,[360,5000],"📐"],["Chácara",.12,[6000,30000],"🌳"],["Fazenda",.01,[1000000,10000000],"🐄"],["Kitnet (4 unidades)",1,[150,260],"🏘️"]];
const oPM=W.precoM2;W.precoM2=function(c){return LOC[c]?LOC[c][1]:oPM(c)};
W.regiaoImv=W.regiaoImv||"todas";
function gerar(reg){const cs=Object.keys(LOC).filter(c=>{const u=LOC[c][0];if(reg==="todas")return true;if(reg==="norte")return ["RO","AC","AM","PA","RR","AP","TO"].includes(u);if(reg==="nordeste")return ["MA","PI","CE","RN","PB","PE","AL","SE","BA"].includes(u);if(reg==="centro")return ["GO","DF","MS","MT"].includes(u);if(reg==="sudeste")return ["MG","ES","RJ","SP"].includes(u);if(reg==="sul")return ["PR","SC","RS"].includes(u);return u.length>2});
 const o=[];for(let i=0;i<20;i++){let tp=pick(TIPOS);const cid=pick(cs),loc=LOC[cid],fora=loc[0].length>2;if(fora&&/Fazenda|Chácara/.test(tp[0]))tp=TIPOS[0];const ar=Math.round(r(tp[2][0],tp[2][1]));let p=Math.round(loc[1]*ar*tp[1]*r(3.2,5.5)/1000)*1000;if(tp[0]==="Fazenda")p=Math.round(ar/10000*r(9000,22000)*(["MT","GO","MS","PR"].includes(loc[0])?1.6:1))*10;
  o.push({id:S.nid++,tipo:tp[0],ic:tp[3],cid:cid,uf:loc[0],bairro:pick(loc[2]),area:ar,preco:p,quartos:/Casa|Apart/.test(tp[0])?ri(1,4):0,exterior:fora})}S.imvOf=o;S.imvRef=S.simMs}
W.filtraImv=function(reg){W.regiaoImv=reg;gerar(reg);render()};
setInterval(()=>{try{if(S.imvOf&&S.imvOf.length&&!S.imvOf.some(x=>x.uf))gerar("todas")}catch(e){}},2000);
if(V.imoveis){const oI=V.imoveis;V.imoveis=function(){if(!S.imvOf||!S.imvOf.some(x=>x.uf))gerar(W.regiaoImv);let h=oI.apply(this,arguments);
 const regs=[["todas","🇧🇷 Brasil + exterior"],["norte","Norte"],["nordeste","Nordeste"],["centro","Centro-Oeste"],["sudeste","Sudeste"],["sul","Sul"],["exterior","🌎 Exterior"]];
 const bar=`<div style="display:flex;gap:4px;flex-wrap:wrap;margin:6px 0">${regs.map(([k,n])=>`<button class="b s" style="${W.regiaoImv===k?"outline:2px solid #3b82f6":""}" onclick="filtraImv('${k}')">${n}</button>`).join("")}</div><div class="muted">Imóveis em todos os estados do Brasil e no exterior (preço convertido em reais; no exterior há custos de câmbio e IOF de 1,1% na remessa).</div>`;
 return h.replace("🔎 Imóveis à venda (imobiliárias)</h3>","🔎 Imóveis à venda – Brasil e exterior</h3>"+bar).replace(/(\s)([A-Za-zÀ-ú' ()\-]+), ([A-Za-zÀ-ú' ()\-]+) · /g,(m,a,b,c)=>m)}}
const oC=W.comprarImv;if(oC)W.comprarImv=function(id){const x=(S.imvOf||[]).find(y=>y.id===id);oC(id);if(x&&x.exterior&&S.imv.some(y=>y.id===id)){const iof=x.preco*.011;S.caixaGrupo-=iof;log(`🌎 IOF e câmbio da compra no exterior: ${R$(iof)}`)}};
})();
