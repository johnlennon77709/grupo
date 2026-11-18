// v21: negociar o preço do imóvel direto com o dono (contraproposta, paciência, à vista ajuda)
(function(){const W=window;let NI=null;
const DONOS=["Seu Antônio","Dona Maria Helena","Sr. Ricardo Bortolini","Dona Cleusa","Sr. Valdir","Imobiliária Rondon (corretor Paulo)","Sra. Fernanda","Sr. Jorge Takahashi","Família Oliveira","Dr. Marcos (advogado do espólio)"];
W.negImv=function(id){const x=(S.imvOf||[]).find(y=>y.id===id);if(!x)return;
 if(x.bloq&&S.simMs<x.bloq)return toast("O dono não quer mais conversar sobre esse imóvel por enquanto");
 if(!x.dono)x.dono=pick(DONOS);if(x.pedido==null)x.pedido=x.preco;
 const pressa=Math.random();x.min=x.min||Math.round(x.pedido*(x.exterior?r(.9,.96):pressa<.25?r(.78,.86):r(.86,.95))/100)*100;
 NI={id,pac:ri(3,5),ult:x.pedido,msgs:[["ele",`Olá! Aqui é ${esc(x.dono)}, dono(a) do(a) <b>${esc(x.tipo)}</b> em ${esc(x.bairro)}, ${esc(x.cid)}. Estou pedindo <b>${R$(x.pedido)}</b>. ${pressa<.25?"Preciso vender logo, mudei de cidade.":"Imóvel muito bem conservado."} Qual a sua proposta?`]]};tela()};
function tela(){const x=S.imvOf.find(y=>y.id===NI.id);if(!x)return fecha();
 modal(`<div class="row sb"><h2 style="margin:0">🤝 Negociar imóvel</h2><button class="b s" onclick="fecha()">✕</button></div>
 <div class="muted" style="margin:4px 0 8px">${esc(x.tipo)} – ${esc(x.bairro)}, ${esc(x.cid)} · pedido ${R$(x.pedido)} · paciência do dono: ${"😊".repeat(Math.max(0,NI.pac))}</div>
 <div style="max-height:300px;overflow:auto;display:flex;flex-direction:column;gap:6px">${NI.msgs.map(([q,t])=>`<div style="align-self:${q==="eu"?"flex-end":"flex-start"};max-width:85%;padding:8px 11px;border-radius:12px;background:${q==="eu"?"#2563eb":q==="sys"?"#334155":"#1f2937"};color:#fff">${t}</div>`).join("")}</div>
 ${NI.fim?`<div class="row" style="margin-top:10px">${NI.fim==="ok"?`<button class="b g" onclick="fecha();comprarImv(${x.id})">✅ Fechar compra por ${R$(x.preco)}</button>`:""}<button class="b s" onclick="fecha()">Fechar</button></div>`:
 `<div class="row" style="margin-top:10px;flex-wrap:wrap"><input id="niV" type="number" placeholder="Sua oferta R$" style="width:150px"><label style="display:flex;gap:4px;align-items:center"><input id="niAv" type="checkbox" checked> à vista</label><button class="b bl" onclick="ofertaImv()">Enviar oferta</button><button class="b g" onclick="aceitaImv()">Aceitar ${R$(NI.ult)}</button><button class="b r" onclick="desisteImv()">Desistir</button></div>`}`)}
W.ofertaImv=function(){const x=S.imvOf.find(y=>y.id===NI.id),v=+(document.getElementById("niV").value||0),av=document.getElementById("niAv").checked;if(!v)return;
 NI.msgs.push(["eu",`Ofereço <b>${R$(v)}</b>${av?" à vista":" financiado"}.`]);const min=x.min*(av?.97:1.02);
 if(v>=NI.ult){NI.msgs.push(["ele","Fechado! 🤝"]);fechar(x,Math.min(v,NI.ult));return tela()}
 if(v>=min){const aceita=Math.random()<.55||NI.pac<=1;if(aceita){NI.msgs.push(["ele",pick(["Tá bom, vamos fechar.","Você negocia bem... aceito!","Ok, fechado. Pode preparar a documentação."])]);fechar(x,v);return tela()}}
 if(v<x.pedido*.65){NI.pac-=2;NI.msgs.push(["ele",pick(["Isso é uma ofensa! Nem pensar.","Assim não dá, o imóvel vale muito mais.","Você tá de brincadeira né?"])])}
 else{NI.pac--;const c=Math.max(min,Math.round((NI.ult*.6+Math.max(v,min)*.4)/100)*100);NI.ult=Math.min(NI.ult,c);NI.msgs.push(["ele",`${pick(["Não consigo por esse valor.","Fica difícil...","Tenho outra pessoa interessada."])} Faço por <b>${R$(NI.ult)}</b>${av?" à vista":""}.`])}
 if(NI.pac<=0){NI.msgs.push(["ele","Olha, acho melhor pararmos por aqui. Não vou mais negociar."]);NI.msgs.push(["sys","O dono encerrou a negociação. Tente de novo daqui a 15 dias."]);x.bloq=S.simMs+15*86400000;NI.fim="nao"}
 tela()};
W.aceitaImv=function(){const x=S.imvOf.find(y=>y.id===NI.id);NI.msgs.push(["eu",`Aceito ${R$(NI.ult)}.`]);NI.msgs.push(["ele","Ótimo, negócio fechado! 🤝"]);fechar(x,NI.ult);tela()};
W.desisteImv=function(){NI.msgs.push(["eu","Vou pensar melhor, obrigado."]);NI.fim="nao";tela()};
function fechar(x,v){const desc=x.pedido-v;x.preco=Math.round(v/100)*100;NI.fim="ok";NI.msgs.push(["sys",`Preço combinado: ${R$(x.preco)}${desc>0?` (economia de ${R$(desc)})`:""}. Clique em fechar compra para escolher à vista ou financiado.`]);try{log(`🤝 Negociado com ${x.dono}: ${x.tipo} em ${x.cid} de ${R$(x.pedido)} por ${R$(x.preco)}`)}catch(e){}}
// botão "Negociar" ao lado de "Comprar"
const oV=V.imoveis;if(oV)V.imoveis=function(){return oV.apply(this,arguments).replace(/onclick="comprarImv\((\d+)\)">Comprar<\/button>/g,(m,id)=>m+`<button class="b bl" onclick="negImv(${id})">🤝 Negociar</button>`)};
})();
