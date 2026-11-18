// v9c: opcionais na compra de veículos (pelo chat) e de imóveis
(function(){
const W=window,N=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const K=(s,k)=>k.length<=3?new RegExp("\\b"+k+"\\b").test(s):s.includes(k);
const OPC={
 cam:[["Ar-condicionado na cabine",9800,["ar","climatiz"]],["Geladeira",4500,["geladeira","frigobar"]],["Cama / leito",7200,["cama","leito"]],["Câmbio automatizado",38000,["automatiz","cambio aut"],10],["Retarder (freio motor)",32000,["retarder","freio motor"],7],["Piloto automático adaptativo",12500,["piloto"]],["Rodas de alumínio",18000,["rodas","aluminio"]],["Defletor de ar",2800,["defletor"]],["Rastreador + telemetria",6500,["rastre","telemetr"]],["Pintura com logo LP",9900,["pintura","logo","adesiv","plotag"],5],["Tanque extra de diesel",8400,["tanque"]]],
 car:[["Teto solar",8900,["teto"]],["Bancos de couro",6500,["couro","banco"]],["Central multimídia",4900,["multimidia","som","central"]],["Rodas aro 19",7800,["rodas","aro"]],["Película nos vidros",1200,["pelicula","insulfilm"]],["Engate de reboque",2800,["engate"]],["Capota marítima",3200,["capota"]],["Kit faróis LED",2400,["led","farol"]],["Blindagem nível III-A",85000,["blind"],30],["Pintura especial",4500,["pintura","cor"],5],["Rastreador",1900,["rastre"]]],
 imp:[["Lona sider reforçada",6000,["lona","sider"]],["Pneus novos de fábrica",14000,["pneu"]],["Rastreador",3900,["rastre"]],["Logo LP plotado",4500,["logo","adesiv","plotag","pintura"],4],["Suspensão a ar",16500,["suspens"]]]};
function grupo(t){try{const it=DEALERS[t.ref[0]].itens[t.ref[1]];return it[1]==="carro"||it[1]==="pickup"?"car":it[1]==="implemento"||it[1]==="carretinha"?"imp":"cam"}catch(e){return "cam"}}
function lista(g){return OPC[g].map(o=>`• ${o[0]} – ${R$(o[1])}`).join("<br>")}
function aplica(t,g,s){const novos=OPC[g].filter(o=>o[2].some(k=>K(s,k))&&!(t.opc||[]).some(x=>x[0]===o[0]));if(!novos.length)return null;t.opc=(t.opc||[]).concat(novos.map(o=>[o[0],o[1]]));const soma=novos.reduce((a,o)=>a+o[1],0),dias=novos.reduce((a,o)=>a+(o[3]||0),0);
 if(t.preco)t.preco+=soma;if(t.min)t.min+=soma*.92;if(t.base)t.base+=soma;if(t.prop&&t.prop.v)t.prop.v+=soma;if(t.prazo&&dias){t.prazo+=dias;if(t.prop&&t.prop.prazo!=null)t.prop.prazo=t.prazo}
 return `Anotado! Incluí: <b>${novos.map(o=>o[0]).join(", ")}</b> (+${R$(soma)})${dias?`, isso acrescenta ${dias} dias na entrega`:""}.<br>Opcionais no pedido: ${t.opc.map(o=>o[0]).join(", ")}.<br>Valor atualizado: <b>${R$(t.prop&&t.prop.v||t.preco)}</b>. Quer mais alguma coisa ou faz sua proposta?`}
function tira(t,s){if(!t.opc||!/(tira|remove|sem o|sem a|nao quero o|nao quero a|cancela)/.test(s))return null;const g=t._g;const fora=t.opc.filter(o=>{const d=OPC[g].find(x=>x[0]===o[0]);return d&&d[2].some(k=>K(s,k))});if(!fora.length)return null;const soma=fora.reduce((a,o)=>a+o[1],0);t.opc=t.opc.filter(o=>!fora.includes(o));if(t.preco)t.preco-=soma;if(t.min)t.min-=soma*.92;if(t.base)t.base-=soma;if(t.prop&&t.prop.v)t.prop.v-=soma;return `Retirei ${fora.map(o=>o[0]).join(", ")} (−${R$(soma)}).`}
const oM=W.mandaTexto;W.mandaTexto=function(id){const t=th(id),el=document.getElementById("txtMsg");if(!t||!el||t.tipo!=="veic")return oM(id);const txt=el.value.trim();if(!txt)return oM(id);const s=N(txt),g=t._g=grupo(t);let resp=null;
 if(/opciona|acessori|opcoes|itens extra|o que tem de extra|equipad/.test(s)&&!aplica({...t,opc:t.opc},g,s))resp=`Temos estes opcionais para esse modelo:<br>${lista(g)}<br>É só me dizer quais você quer (ex.: "quero ar, geladeira e logo LP").`;
 if(!resp)resp=tira(t,s);
 if(!resp&&/(quero|coloca|inclui|adiciona|com |bota|põe|poe|acrescenta)/.test(s))resp=aplica(t,g,s);
 if(resp){msgAdd(t,"eu",esc(txt));el.value="";t.aguard=true;setTimeout(()=>{t.aguard=false;msgAdd(t,"ele",resp);try{abrirThread(id)}catch(e){render()}},ri(1200,3000));try{abrirThread(id)}catch(e){render()}return}
 return oM(id)};
// ao fechar, o veículo novo recebe os opcionais
const oF=W.fecharVeicTh;if(oF)W.fecharVeicTh=function(t){const antes=new Set(S.frota.map(v=>v.id));const r=oF.apply(this,arguments);try{if(t&&t.opc&&t.opc.length){S.frota.filter(v=>!antes.has(v.id)).forEach(v=>{v.opc=t.opc.map(o=>o[0]);v.val=(v.val||0)+t.opc.reduce((a,o)=>a+o[1],0)*.85;log(`🔧 ${v.mod} ${v.placa} veio com: ${v.opc.join(", ")}`)})}}catch(e){}return r};
// opcionais na compra de imóveis
const OI=[["Mobiliado (planejados)",.08],["Energia solar",.035],["Piscina",.06],["Reforma completa",.1],["Câmeras e alarme",.012],["Ar-condicionado em todos os cômodos",.02]];
const oC=W.comprarImv;if(oC)W.comprarImv=function(id){const x=(S.imvOf||[]).find(y=>y.id===id);if(x&&!x.opcOk&&!/Fazenda|Terreno|Galpão|Chácara/.test(x.tipo)){const esc2=prompt(`Opcionais para ${x.tipo} em ${x.bairro} (digite os números separados por vírgula, ou deixe vazio):\n`+OI.map((o,i)=>`${i+1}. ${o[0]} (+${R$(x.preco*o[1])})`).join("\n"),"");if(esc2===null)return;const sel=String(esc2).split(/[ ,;]+/).map(n=>OI[+n-1]).filter(Boolean);if(sel.length){const add=sel.reduce((a,o)=>a+x.preco*o[1],0);x.preco=Math.round((x.preco+add)/100)*100;x.opc=sel.map(o=>o[0]);log(`🏠 Opcionais escolhidos: ${x.opc.join(", ")} (+${R$(add)})`)}x.opcOk=1}return oC(id)};
})();
