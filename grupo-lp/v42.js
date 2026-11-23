// v42: conversa com qualquer pessoa – funcionários, motoristas, clientes e vendedores puxam assunto, pedem, negociam e respondem ao que você escrever
(function(){const W=window,H=36e5;
const N=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");const has=(s,a)=>a.some(w=>s.includes(w));const pk=a=>a[Math.random()*a.length|0];
const CG={mot:"Motorista",vend:"Vendedor",caixa:"Caixa",ger:"Gerente",mec:"Mecânico",est:"Estoquista",comp:"Comprador",fin:"Financeiro",cob:"Cobrança",adm:"Administrativo",aux:"Auxiliar",sup:"Supervisor",vext:"Vendedor externo"};
const AV={mot:"🚛",vend:"🧑‍💼",caixa:"🧾",ger:"👔",mec:"🔧",est:"📦",comp:"🛒",fin:"💼",cob:"📞",adm:"🗂️",aux:"🧹",sup:"🧭",vext:"🚗",cli:"🙋",forn:"🏭"};
function fu(id){return (S.func||[]).find(f=>f.id===id)}
function loja(f){return f&&S.lojas[f.loja]}
function veicDe(f){return (S.frota||[]).find(v=>v.mot===f.id)}
function viagemDe(f){const v=veicDe(f);if(!v)return null;const a=S.fr&&S.fr.ativos.find(x=>x.v===v.id);const c=S.col&&S.col.rota&&(S.col.rota.g===v.id||S.col.rota.p===v.id)?S.col.rota:null;return{v,a,c}}
function abre(f,intro){const t=novaThread("papo",f.id,`${f.nome} – ${CG[f.cargo]||f.cargo}`,AV[f.cargo]||"👤",intro);t.fid=f.id;return t}
W.falarCom=function(fid){const f=fu(+fid);if(!f)return;const t=abre(f);if(!t.msgs.length)msgAdd(t,"ele",pk(["Oi, chefe! Pode falar.","Fala, patrão! Tô por aqui.","Bom falar com o senhor! O que precisa?"]));abrirThread(t.id)};
// ---------- respostas ----------
function responde(t,txt){const f=fu(t.fid);if(!f)return"…";const s=N(txt),l=loja(f),hoje=l&&l.venda?l.venda.dia||0:0;f.moral=f.moral??70;
 if(has(s,["idiota","burro","incompetente","vagabund","otario","inutil","porra","merda","lixo"])){f.moral=Math.max(0,f.moral-15);return pk(["Chefe, com todo respeito… não precisa falar assim. Tô dando o meu melhor.","Puxa… isso me chateou. Mas vou fazer o meu trabalho.","Desse jeito fica difícil, patrão. Respeito é bom e eu gosto."])}
 if(has(s,["parabens","obrigad","bom trabalho","mandou bem","orgulho","valeu","excelente","otimo trabalho"])){f.moral=Math.min(100,f.moral+6);return pk(["Opa, obrigado chefe! Isso motiva demais! 💪","Valeu, patrão! Pode contar comigo sempre.","Fico feliz em ouvir isso! Vamos pra cima!"])}
 if(f.cargo==="mot"){const vg=viagemDe(f);
  if(has(s,["onde","cade","local","posicao","ta aonde","esta aonde","chegou"])){if(!vg)return"Tô aqui na base, chefe. Caminhão na garagem esperando serviço.";const a=vg.a||vg.c;if(!a)return `Tô com o ${vg.v.mod} ${vg.v.placa}, status: ${vg.v.status}.`;const s2=a.par[Math.min(a.i,a.par.length-1)];return `Tô rodando com o ${vg.v.mod}, chefe. Próxima parada: <b>${s2.c||s2.nome}</b>, previsão ${new Date(s2.t).toLocaleString("pt-BR",{day:"2-digit",hour:"2-digit",minute:"2-digit"})}. Estrada ${pk(["tranquila","com muito caminhão","com uns buracos na BR","com chuva forte"])}.`}
  if(has(s,["acelera","corre","mais rapido","pressa","rapido"]))return pk(["Chefe, consigo puxar um pouco, mas acima do limite é multa e risco. Vou no máximo permitido.","Entendido, vou reduzir as paradas pra ganhar tempo, mas respeitando a lei do descanso."]);
  if(has(s,["descans","dorme","para um pouco","pausa"]))return"Obrigado, chefe! Vou parar no próximo posto, tomar um banho e descansar umas horas. Segurança em primeiro lugar.";
  if(has(s,["volta","retorna","base"]))return vg&&(vg.a||vg.c)?"Chefe, tô com carga no caminhão. Assim que entregar eu volto direto pra base, combinado?":"Já tô na base, chefe!";
  if(has(s,["frete","carga","servico"]))return"Se tiver frete bom no mural, é só me escalar que eu pego a estrada na hora. Prefiro rota com asfalto bom 😅";
  if(has(s,["diesel","combustivel","abastec"]))return `Tanque ${pk(["cheio","pela metade","com 3/4"])}. Diesel tá saindo ${R$(5.9+Math.random()*.6)} o litro aqui.`;
  if(has(s,["comeu","almoco","janta","comida","fome"]))return pk(["Parei num restaurante de beira de estrada, prato feito com farofa. Tava bom demais!","Ainda não, chefe. No próximo posto eu como."])}
 if(has(s,["aumento","salario","ganhar mais","reajuste"])){if(t.aum)return"Já falamos disso, chefe. Fico no aguardo.";t.aum=1;const p=Math.round(f.sal*(.06+Math.random()*.06));t.prop={tipo:"aum",v:p,aceita:1};return `Já que tocou no assunto… tô há um tempo na empresa e queria um reajuste de <b>${R$(p)}</b> (fica ${R$(f.sal+p)}). Aceita? Responda <b>aceito</b> ou <b>não</b>.`}
 if(has(s,["folga","ferias","descanso","day off"])){t.prop={tipo:"folga",aceita:1};return "Seria ótimo, chefe! Posso tirar folga amanhã? Responda <b>aceito</b> ou <b>não</b>."}
 if(has(s,["venda","meta","faturamento","movimento"])&&l)return `Hoje a ${nomeLoja(l)} já vendeu <b>${R$(hoje)}</b>. ${hoje>((l.alvoHoje||1)*0.8)?"Tá batendo a meta! 🚀":"Tá mais fraco, mas a tarde costuma melhorar."}`;
 if(has(s,["estoque","falta","acabou","produto"])&&l){const ps=(S.prods||[]).filter(p=>(l.est[p.id]||0)<3).slice(0,3).map(p=>p.nome);return ps.length?`Tá faltando: <b>${ps.join(", ")}</b>. Bom pedir pro comprador.`:"Estoque tá em ordem, chefe."}
 if(has(s,["cliente","reclam"]))return pk(["Clientes tão satisfeitos, chefe. Hoje uma senhora elogiou o atendimento!","Teve um cliente reclamando da demora no caixa, mas já resolvemos.","Movimento bom, cliente fiel voltando sempre."]);
 if(has(s,["demit","rua","mandar embora"])){f.moral=Math.max(0,f.moral-20);return "Chefe… fiz alguma coisa errada? Me dá uma chance de melhorar, por favor."}
 if(has(s,["familia","filho","esposa","mulher","casa"]))return pk(["Tá todo mundo bem, graças a Deus! Meu filho começou na escolinha de futebol.","Minha esposa mandou um abraço pro senhor!","Família tá bem, obrigado por perguntar, chefe."]);
 if(has(s,["futebol","jogo","flamengo","corinthians","palmeiras","time"]))return pk(["Rapaz, meu time tá me matando do coração esse ano 😂","Domingo vou assistir o jogo no bar do Zé, bora?","Nem me fale, perdemos de novo…"]);
 if(has(s,["tudo bem","como vai","como voce ta","como ce ta","beleza","blz"]))return pk(["Tudo ótimo, chefe! E o senhor?","Tudo certo por aqui, trabalhando firme!","Na luta, mas feliz! E aí, tudo bem?"]);
 if(/^(oi|ola|bom dia|boa tarde|boa noite|e ai|eai|fala)/.test(s))return pk(["Oi, chefe! Tudo bem? Precisa de alguma coisa?","Opa, fala patrão!","Bom dia! Pode mandar."]);
 if(has(s,["tchau","ate mais","falou","abraco"]))return pk(["Até mais, chefe!","Valeu, qualquer coisa me chama!","Abraço, patrão!"]);
 return pk(["Entendi, chefe. Pode deixar que eu resolvo.","Certo! Vou ver isso agora mesmo.","Combinado. Mais alguma coisa?","Hum, deixa eu ver… pode ficar tranquilo que eu cuido disso."])}
function aplica(t){const f=fu(t.fid),p=t.prop;if(!f||!p)return;if(p.tipo==="aum"){f.sal+=p.v;f.moral=Math.min(100,(f.moral||70)+15);msgAdd(t,"ele","Muito obrigado, chefe! Pode contar comigo! 🙏");log(`💰 Aumento para ${f.nome}: +${R$(p.v)}`)}if(p.tipo==="folga"){f.moral=Math.min(100,(f.moral||70)+8);f.folga=S.simMs+24*H;msgAdd(t,"ele","Valeu demais, chefe! Volto com tudo depois de amanhã.")}t.prop=null}
const oM=W.mandaTexto;W.mandaTexto=function(id){const t=th(id);if(!t||t.tipo!=="papo")return oM(id);const el=document.getElementById("txtMsg");const txt=el&&el.value.trim();if(!txt)return;el.value="";msgAdd(t,"eu",esc(txt));const s=N(txt);
 if(t.prop&&/^(aceito|sim|pode|ok|fechado|beleza|claro)/.test(s)){aplica(t);try{save()}catch(e){}return abrirThread(id)}
 if(t.prop&&/^(nao|não|negado|agora nao)/.test(s)){const f=fu(t.fid);if(f)f.moral=Math.max(0,(f.moral||70)-8);t.prop=null;msgAdd(t,"ele",pk(["Tudo bem, chefe. Entendo.","Ok… quem sabe mais pra frente.","Beleza, sem problema."]));return abrirThread(id)}
 t.aguard=true;abrirThread(id);setTimeout(()=>{t.aguard=false;msgAdd(t,"ele",responde(t,txt));try{abrirThread(id)}catch(e){render()}},800+Math.random()*2200)};
// RESP para o tipo novo (caso o jogo chame)
try{if(typeof RESP!=="undefined")RESP.papo=function(){}}catch(e){}
const oA=W.aceitarTh;if(oA)W.aceitarTh=function(id){const t=th(id);if(t&&t.tipo==="papo"){aplica(t);save();return abrirThread(id)}return oA(id)};
const oR=W.recusarTh;if(oR)W.recusarTh=function(id){const t=th(id);if(t&&t.tipo==="papo"){t.prop=null;msgAdd(t,"ele","Tudo bem, chefe.");return abrirThread(id)}return oR(id)};
// ---------- eles puxam assunto sozinhos ----------
const ESP={mot:[f=>{const vg=viagemDe(f);return vg&&(vg.a||vg.c)?`Chefe, passando pra avisar: tô com o ${vg.v.mod} ${vg.v.placa} na estrada, tudo certo até aqui. 🚛`:"Chefe, caminhão revisado e pronto. Tem algum frete pra mim?"},()=>"Patrão, a BR tá cheia de buraco perto de Vilhena, vou mais devagar pra não estragar pneu.",()=>"Chefe, parei pra descansar no posto. Daqui a 8h sigo viagem, beleza?",()=>"Tem um frete bom de soja saindo de Sorriso, se quiser eu pego!"],
 geral:[f=>`Chefe, posso falar um minutinho? Queria conversar sobre um reajuste… tô há um tempo aqui na ${nomeLoja(loja(f))}.`,()=>"Bom dia, chefe! Hoje o movimento começou forte por aqui! 💪",f=>`Chefe, o ar-condicionado da ${nomeLoja(loja(f))} tá fazendo barulho, vale chamar a manutenção.`,()=>"Patrão, um cliente grande perguntou se a gente faz preço especial pra frota dele. Posso negociar?",()=>"Chefe, consegue me liberar mais cedo sexta? É aniversário do meu filho.",()=>"Bati minha meta da semana! 🎉"]};
function espontaneo(){if(!S.func||!S.func.length)return;const fs=S.func.filter(f=>!f.dem);if(!fs.length)return;const f=pk(fs);const lista=f.cargo==="mot"?ESP.mot:ESP.geral;const msg=pk(lista)(f);
 const t=abre(f);msgAdd(t,"ele",msg);if(/reajuste/.test(msg)){t.aum=1;const p=Math.round(f.sal*.08);t.prop={tipo:"aum",v:p,aceita:1};msgAdd(t,"ele",`Seria <b>${R$(p)}</b> a mais por mês. Aceita?`)}if(/mais cedo/.test(msg))t.prop={tipo:"folga",aceita:1};
 toast(`💬 ${f.nome} mandou mensagem`)}
let ult=0;setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.simMs)return;if(!S.papoT)S.papoT=S.simMs;if(S.simMs-S.papoT>(3+Math.random()*4)*H){S.papoT=S.simMs;const h=new Date(S.simMs).getHours();if(h>=7&&h<=21&&Date.now()-ult>90000){ult=Date.now();espontaneo()}}}catch(e){}},5000);
// ---------- lista "Falar com" na aba de mensagens ----------
function card(){const fs=(S.func||[]).filter(f=>!f.dem);const mot=fs.filter(f=>f.cargo==="mot");const lojas=[...new Set(fs.map(f=>f.loja))];
 return `<div class="card"><h3>💬 Falar com alguém</h3><p class="muted" style="margin:0 0 8px">Mande mensagem para qualquer funcionário ou motorista. Pergunte onde está, peça relatório de vendas e estoque, elogie, dê ordens, negocie aumento e folga ou só bata papo.</p>
 ${mot.length?`<div style="margin-bottom:8px"><b>🚛 Motoristas:</b> ${mot.map(f=>`<button class="b s" style="margin:3px" onclick="falarCom(${f.id})">${esc(f.nome)}${veicDe(f)?" · "+veicDe(f).placa:""}</button>`).join("")}</div>`:""}
 <div class="row" style="gap:8px;flex-wrap:wrap"><select id="fcSel" style="flex:1;min-width:220px">${lojas.map(li=>{const l=S.lojas[li];return `<optgroup label="${esc(l?nomeLoja(l):"")}">${fs.filter(f=>f.loja===li&&f.cargo!=="mot").map(f=>`<option value="${f.id}">${esc(f.nome)} – ${CG[f.cargo]||f.cargo}</option>`).join("")}</optgroup>`}).join("")}</select><button class="b g" onclick="falarCom(document.getElementById('fcSel').value)">Abrir conversa</button></div></div>`}
let ok=false;setTimeout(()=>{if(ok)return;ok=true;if(typeof V!=="undefined"&&V.msgs){const o=V.msgs;V.msgs=function(){return card()+o.apply(this,arguments)}}},3200);
})();
