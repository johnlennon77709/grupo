// v9: IA de negociação nos chats (entende perguntas, humor, argumentos, concorrência, memória)
(function(){
const W=window;
function num(txt){let best=null;const re=/(\d[\d.,]*)\s*(milh(?:ão|ões|oes|ao)|mi\b|mil|k\b)?(?!\s*(?:x|%|dias?|mes|meses|m²))/gi;let m;while((m=re.exec(txt))){let s=m[1];if(/,\d{1,2}$/.test(s))s=s.replace(/\./g,"").replace(",",".");else s=s.replace(/[.,]/g,"");let v=parseFloat(s);if(isNaN(v))continue;const u=(m[2]||"").toLowerCase();if(u.startsWith("milh")||u==="mi")v*=1e6;else if(u==="mil"||u==="k")v*=1e3;if(best==null||v>best)best=v}return best}
const N=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const has=(t,arr)=>arr.some(w=>t.includes(w));
const PERS=[["direto","Sou direto: "],["simpatico","Olha, "],["durao","Veja bem, "],["tecnico","Analisando tecnicamente, "]];
function mente(t){if(!t.ia){t.ia={humor:60,pers:pick(PERS)[0],hist:[],conc:0,elog:0,ofens:0}}return t.ia}
function pre(ia){return (PERS.find(p=>p[0]===ia.pers)||PERS[0])[1]}
function valorRef(t){return t.prop&&t.prop.v||t.preco||t.base||(t.k&&t.k.v)||null}
function quem(t){return {conta:"o credor",rec:"o cliente",veic:"o vendedor",ter:"o corretor",cand:"o candidato",cli:"o cliente"}[t.tipo]||"ele"}
function responde(t,txt){const ia=mente(t),s=N(txt),v=num(txt),ref=valorRef(t);
 // educação / ofensa mexem no humor e na paciência
 if(has(s,["por favor","obrigad","agradec","parceiro","amigo","bom dia","boa tarde","boa noite","prazer","confio"])){ia.humor=Math.min(100,ia.humor+6);ia.elog++;if(ia.elog===2)t.pac=(t.pac||3)+1}
 if(has(s,["ladrao","safado","pilantra","idiota","burro","otario","vagabund","porra","caralho","merda","roubo","palhaçada","palhacada"])){ia.humor-=25;ia.ofens++;t.pac=Math.max(0,(t.pac||3)-1);if(t.min)t.min*=1.03;
  if(ia.ofens>=2){t.fim=true;t.prop=null;return "Não vou continuar a conversa nesse tom. Encerramos por aqui."}return pick(["Vamos manter o respeito, por favor. Assim fica difícil negociar.","Calma… desse jeito não chegamos a lugar nenhum.","Entendo a frustração, mas peço respeito."])}
 // saudações / conversa
 if(/^(oi|ola|e ai|eai|bom dia|boa tarde|boa noite|tudo bem|blz|beleza)\b/.test(s)&&!v)return pick(["Olá! Tudo ótimo, e com você? Vamos fechar esse negócio?","Opa, tudo certo! Em que posso ajudar?","Boa! Estou aqui, pode mandar sua proposta."]);
 // concorrência / outra oferta
 if(has(s,["concorrente","outra loja","outro lugar","em outra","la na","fulano faz","me ofereceram","proposta melhor","mais barato em","cotei"])){ia.conc++;
  if(v&&t.min&&v<t.min*.9)return pre(ia)+`duvido que alguém entregue nesse valor de ${R$(v)} com a mesma qualidade e garantia. Se for verdade, me manda o orçamento por escrito.`;
  if(t.min&&ia.conc===1){t.min*=.975;return pre(ia)+"não quero perder você para a concorrência. Me faz uma nova proposta que eu tento cobrir."}
  return "Já fiz o que podia para cobrir a concorrência. Agora é com você."}
 // perguntas
 if(/\?|qual|quanto|como|quando|onde|por que|porque|tem /.test(s)&&!(v&&/(dou|ofere|pago|proponho|fecho|faco|faço)/.test(s))){
  if(has(s,["minimo","menor valor","melhor preco","melhor valor","ultimo preco","ultima proposta","quanto voce faz","qual o preco","quanto sai","valor final"])){if(!t.min)return "Me fala quanto você quer pagar que eu vejo.";const blef=t.min*r(1.04,1.1);return pre(ia)+`abaixo de ${R$(blef)} fica muito difícil. Mas me faz uma proposta firme que eu levo adiante.`}
  if(has(s,["desconto"]))return t.min&&ref?`Consigo trabalhar um desconto sim, principalmente à vista. Hoje estamos em ${R$(ref)}. Quanto você propõe?`:"Depende da forma de pagamento. À vista sempre sai melhor.";
  if(has(s,["juros","taxa"]))return t.tipo==="veic"?"Financiamento sai por volta de 1,49% a 1,89% ao mês, depende da entrada. Consórcio não tem juros, só taxa de administração.":"À vista não tem juros. Parcelado tem correção de mais ou menos 1,2% por parcela.";
  if(has(s,["prazo","entrega","quando chega","demora"]))return t.prazo?`A entrega é em ${t.prazo} dias na Lubriporto Transportes, em Cacoal.`:"Consigo te dar um prazo de 15 a 30 dias para o primeiro pagamento.";
  if(has(s,["garantia"]))return t.tipo==="veic"?"Garantia de fábrica de 2 anos sem limite de km no trem de força, e revisões com preço fixo.":"Fica tudo em contrato, com nota e recibo.";
  if(has(s,["parcel","vezes","x?"]))return t.tipo==="conta"?"Consigo parcelar em até 12x dependendo do valor. Quanto e em quantas vezes?":t.tipo==="veic"?"Financiamos em 36, 48 ou 60 vezes com 20 a 30% de entrada.":"Dá para parcelar, sim. Me diz a proposta.";
  if(has(s,["frete","transporte"]))return "O frete até Cacoal fica por nossa conta se a gente fechar hoje.";
  if(has(s,["documento","nota","contrato","assina"]))return "Emitimos nota fiscal e contrato. Assim que fechar eu já mando para assinatura digital.";
  if(has(s,["estoque","pronta entrega","disponivel"]))return t.tipo==="veic"?"Tenho uma unidade no pátio e outras chegando da fábrica.":"Tenho disponível sim.";
  if(has(s,["por que","porque","motivo"]))return pre(ia)+(t.tipo==="rec"?"a safra atrasou e o caixa apertou. Mas quero resolver com você.":t.tipo==="cand"?"tenho outras propostas e preciso pensar no meu futuro.":"os custos subiram muito esse ano, combustível, frete, impostos…");
  if(has(s,["voce e","vc e","quem e voce","seu nome"]))return `Sou ${t.com}. Pode contar comigo.`;
  return pick(["Boa pergunta. Me fala mais o que você precisa que eu te respondo certinho.","Posso te explicar melhor: o que você quer saber exatamente, valor, prazo ou forma de pagamento?"])}
 // ameaça de desistir
 if(has(s,["vou desistir","nao quero mais","vou embora","deixa pra la"])&&t.min){t.min*=.985;return pick(["Calma, não vamos perder o negócio por pouco! Me faz uma última proposta.","Espera… vamos achar um meio-termo. Qual seu último valor?"])}
 // memória: oferta igual/menor que a anterior
 if(v){const ant=ia.hist[ia.hist.length-1];ia.hist.push(v);if(ant&&t.tipo!=="rec"&&t.tipo!=="cand"&&v<ant){ia.humor-=8;return pre(ia)+`antes você ofereceu ${R$(ant)} e agora ${R$(v)}? Assim a gente anda pra trás. Mantém pelo menos o valor anterior.`}
  if(t.min&&t.tipo!=="rec"&&t.tipo!=="cand"&&t.tipo!=="cli"&&v<t.min*.55){ia.humor-=10;t.pac=Math.max(1,(t.pac||3)-1);return pick(["Aí não dá, né? Esse valor está muito longe da realidade.","Com todo respeito, isso não cobre nem o custo. Faz uma proposta séria.","Fica difícil levar isso para o meu gerente…"])}}
 return null}
// humor bom deixa a contraparte mais flexível
setInterval(()=>{try{(S.msgs||[]).forEach(t=>{const ia=t.ia;if(!ia||t.fim||ia.aplic===t.msgs.length)return;ia.aplic=t.msgs.length;if(t.min&&ia.humor>=80&&!ia.bon){t.min*=.98;ia.bon=1}})}catch(e){}},3000);
const oM=W.mandaTexto;W.mandaTexto=function(id){const t=th(id),el=document.getElementById("txtMsg");if(!t||!el)return oM(id);const txt=el.value.trim();if(!txt)return;const s=N(txt);
 if(t.prop&&/^(aceito|fechado|fechou|fecha|ok|beleza|topo|negocio fechado|pode ser|combinado)/.test(s))return oM(id);
 const resp=responde(t,txt);
 if(resp){msgAdd(t,"eu",esc(txt));el.value="";t.aguard=true;setTimeout(()=>{t.aguard=false;msgAdd(t,"ele",resp);if(t.fim)msgAdd(t,"sys","Negociação encerrada.");try{abrirThread(id)}catch(e){render()}},ri(1200,3500));try{abrirThread(id)}catch(e){render()}return}
 return oM(id)};
})();
