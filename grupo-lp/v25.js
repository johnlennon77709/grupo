// v25: bots mais inteligentes – entendem gírias/abreviações, ofertas em forma de pergunta, entrada+parcelas, contexto, não repetem resposta, conhecimento por assunto
(function(){const W=window;
const N=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/(.)\1{2,}/g,"$1$1");
const AB={vc:"voce",vcs:"voces",q:"que",pq:"porque",tb:"tambem",tbm:"tambem",blz:"beleza",mto:"muito",mt:"muito",oq:"o que",qto:"quanto",qnt:"quanto",qnto:"quanto",cmg:"comigo",ctg:"contigo",hj:"hoje",amn:"amanha",msg:"mensagem",obg:"obrigado",vlw:"valeu",flw:"falou",td:"tudo",nd:"nada",ngm:"ninguem",pfv:"por favor",pf:"por favor",tmj:"tamo junto",sla:"sei la",n:"nao",ss:"sim",dps:"depois",agr:"agora",entao:"entao",kd:"cade",mn:"mano",vdd:"verdade",pra:"para",pro:"para o",ta:"esta",to:"estou",tô:"estou",cê:"voce"};
const norm=s=>N(s).split(/(\s+|[,.!?;:])/).map(w=>AB[w]!=null?AB[w]:w).join("");
const has=(t,a)=>a.some(w=>t.includes(w));
function num(txt){let best=null;const re=/(\d[\d.,]*)\s*(milh(?:ão|ões|oes|ao)|mi\b|mil|k\b|conto|pau)?/gi;let m;const s=N(txt);
 while((m=re.exec(s))){const after=s.slice(m.index+m[0].length,m.index+m[0].length+8);if(/^\s*(x|vez|%|dia|mes|ano|m2|km|parcela)/.test(after))continue;let a=m[1];if(/,\d{1,2}$/.test(a))a=a.replace(/\./g,"").replace(",",".");else a=a.replace(/[.,]/g,"");let v=parseFloat(a);if(isNaN(v))continue;const u=(m[2]||"").toLowerCase();if(u.startsWith("milh")||u==="mi")v*=1e6;else if(u==="mil"||u==="k"||u==="conto"||u==="pau")v*=1e3;if(best==null||v>best)best=v}
 if(best==null){const pal={"cem mil":1e5,"duzentos mil":2e5,"trezentos mil":3e5,"meio milhao":5e5,"um milhao":1e6};for(const k in pal)if(s.includes(k))best=pal[k]}return best}
function parcelas(s){const m=s.match(/(\d{1,3})\s*(x|vezes|parcelas)/);return m?+m[1]:null}
function entrada(s){const m=s.match(/entrada\s*(?:de)?\s*(\d[\d.,]*\s*(?:mil|k|%)?)/);if(!m)return null;if(/%/.test(m[1]))return {pct:parseFloat(m[1])};return {v:num(m[1])}}
const pickN=(t,arr)=>{const ia=t.ia2=t.ia2||{usad:{}};const livres=arr.filter(x=>!ia.usad[x]);const r=pick(livres.length?livres:arr);ia.usad[r]=1;return r};
const ref=t=>(t.prop&&t.prop.v)||t.preco||t.base||(t.k&&t.k.v)||null;
function conhece(t,s){const tp=t.tipo;
 if(tp==="veic"){
  if(has(s,["consumo","km por litro","km/l","gasta"]))return pickN(t,["Na estrada faz de 2,4 a 2,8 km/l carregado, depende do motorista e do peso.","Consumo médio de 2,5 km/l com carga cheia; vazio passa de 3 km/l."]);
  if(has(s,["potencia","cavalo","cv","torque","motor"]))return "Motor diesel Euro 6, com bastante torque em baixa rotação. Na serra ele sobe tranquilo carregado.";
  if(has(s,["cor","branco","prata","vermelho","azul"]))return "Tenho em branco à pronta entrega; outras cores sob encomenda, chegam em até 5 dias.";
  if(has(s,["revisao","manutencao"]))return "Revisões a cada 40 mil km, com preço fixo nas 3 primeiras. Posso incluir um plano de manutenção no pacote.";
  if(has(s,["seguro"]))return "Consigo cotar o seguro com nossa corretora parceira, normalmente fica entre 3% e 5% do valor ao ano.";
  if(has(s,["troca","usado","meu caminhao","meu carro","dou na troca"]))return "Aceitamos seu usado na troca sim! Me passa modelo, ano e km que eu já avalio pela FIPE.";
  if(has(s,["brinde","incluir","de brinde","acessorio","tanque cheio","emplacamento"]))return pickN(t,["Se fechar hoje eu incluo o emplacamento e o tanque cheio.","Consigo dar o kit de tapetes, película e o primeiro tanque cheio se fechar agora.","Brinde dá para negociar: te dou a primeira revisão grátis se fechar hoje."])}
 if(tp==="cand"){
  if(has(s,["beneficio","vale","vr","va","plano","saude","convenio"]))return "Vale-refeição e plano de saúde contam bastante para mim. Se tiver isso, posso flexibilizar o salário.";
  if(has(s,["horario","escala","sabado","folga","hora extra"]))return "Sem problema com sábado até meio-dia. Hora extra eu faço, desde que seja paga certinha.";
  if(has(s,["experiencia","ja trabalhou","curriculo"]))return `Tenho ${t.k&&t.k.exp!=null?t.k.exp:"alguns"} anos de experiência na área, posso começar rápido.`;
  if(has(s,["quando pode comecar","comecar","inicio"]))return "Posso começar na segunda-feira que vem."}
 if(tp==="conta"){
  if(has(s,["boleto","segunda via","pix","chave"]))return "Mando o boleto atualizado ou a chave Pix assim que a gente acertar o valor.";
  if(has(s,["multa","juros"]))return "A multa é de 2% mais juros de 1% ao mês, mas se fechar hoje eu consigo tirar parte dos juros."}
 if(tp==="rec"){
  if(has(s,["serasa","protesto","cartorio","justica","advogado","processo","negativar"]))return pickN(t,["Por favor, não precisa disso! Vou dar um jeito de pagar, me dá uma condição.","Calma, não me negativa… Consigo te pagar uma parte agora e o resto em poucos dias.","Entendo… não quero meu nome sujo. Me diz um valor de entrada que eu tento."]);
  if(has(s,["quando","que dia","prazo"]))return "Consigo pagar uma parte na sexta e o restante em até 30 dias."}
 if(tp==="ter"){
  if(has(s,["documento","escritura","matricula","itbi"]))return "Matrícula atualizada e sem ônus. O ITBI fica por conta do comprador, como é o normal.";
  if(has(s,["agua","luz","energia","asfalto","esgoto"]))return "Tem rede de energia na frente, água da concessionária e a rua é asfaltada."}
 return null}
function bate(t,txt){const s=norm(txt),v=num(txt),px=parcelas(s),en=entrada(s);t.ia2=t.ia2||{usad:{},topicos:[]};const ia=t.ia2;
 // oferta disfarçada de pergunta: "faz por 80 mil?", "sai por 1,2 mi?", "fecha em 300k?"
 if(v&&/\b(faz|sai|fecha|consegue|aceita|pode ser|topa|deixa|vende)\b/.test(s))return {oferta:true};
 // proposta estruturada: entrada + parcelas
 if((en||px)&&ref(t)){const r=ref(t);let msg=`Deixa eu ver se entendi: `;if(en)msg+=`entrada de ${en.pct?en.pct+"%":R$(en.v)}`;if(px)msg+=`${en?" e o restante em ":""}${px}x`;msg+=". ";
  if(px&&px>60)return {txt:msg+"Mais de 60 parcelas o banco não aprova. Consigo em até 60x."};
  if(en&&en.pct&&en.pct<15)return {txt:msg+"Com menos de 15% de entrada fica difícil aprovar. Consegue pelo menos 20%?"};
  return {oferta:true}}
 // conhecimento específico do assunto
 const k=conhece(t,s);if(k){ia.topicos.push(s.slice(0,20));return {txt:k}}
 // conversa fiada / sentimentos
 if(has(s,["como vai","tudo bem com voce","e a familia","como esta"]))return {txt:pickN(t,["Tudo certo por aqui, graças a Deus! Correria, mas é bom sinal. E aí, vamos fechar?","Vou bem, obrigado por perguntar! O movimento tá bom. Me diz o que você precisa."])};
 if(has(s,["kk","haha","rsrs","hehe"]))return {txt:pickN(t,["Haha, boa! Mas vamos ao que interessa 😄","Kkkk gostei. E então, qual sua proposta?"])};
 if(has(s,["sem dinheiro","sem grana","ta dificil","esta dificil","crise","apertado","quebrado"]))return {txt:pickN(t,["Entendo, o momento tá difícil para todo mundo. Posso facilitar no prazo ou parcelar, que tal?","Te entendo. Vamos achar uma condição que caiba no seu bolso: prefere entrada menor ou mais parcelas?"])};
 if(has(s,["urgente","preciso hoje","rapido","pra ontem"]))return {txt:"Consigo agilizar sim. Fechando agora já deixo tudo encaminhado para hoje."};
 if(has(s,["pensar","vou ver","depois te falo","vou analisar"]))return {txt:pickN(t,["Claro, pensa com calma. Só aviso que essa condição é válida até o fim do dia.","Fica à vontade. Qualquer dúvida me chama aqui que eu respondo rapidinho."])};
 if(has(s,["sim","beleza","ok","certo","entendi","show","top"])&&s.length<12&&!t.prop)return {txt:"Perfeito! Então me manda sua proposta de valor que eu já vejo aqui."};
 if(/^(oi|ola|e ai|eai|bom dia|boa tarde|boa noite|opa)\b/.test(s))return null;
 // pergunta genérica que o bot antigo não entendia: responde com o que já sabe do negócio
 if(/\?/.test(txt)&&!v&&ref(t))return {txt:pickN(t,[`O valor de referência hoje é ${R$(ref(t))}. À vista consigo melhorar. Qual sua ideia?`,`Hoje estamos em ${R$(ref(t))}. Me diz quanto você pode pagar e de que forma (à vista, entrada + parcelas) que eu monto a melhor condição.`])};
 return null}
const oM=W.mandaTexto;W.mandaTexto=function(id){const t=typeof th==="function"?th(id):null,el=document.getElementById("txtMsg");if(!t||!el)return oM.apply(this,arguments);const txt=el.value.trim();if(!txt)return;
 const b=bate(t,txt);
 if(b&&b.oferta){// converte em proposta explícita para o motor de negociação entender
  const v=num(txt);if(v&&!/(dou|ofere|pago|proponho)/.test(N(txt)))el.value=`Ofereço ${Math.round(v)} `+txt;return oM.apply(this,arguments)}
 if(b&&b.txt){msgAdd(t,"eu",esc(txt));el.value="";t.aguard=true;const dl=Math.min(4500,900+b.txt.length*25);setTimeout(()=>{t.aguard=false;msgAdd(t,"ele",b.txt);try{abrirThread(id)}catch(e){render()}},dl);try{abrirThread(id)}catch(e){render()}return}
 return oM.apply(this,arguments)};
})();
