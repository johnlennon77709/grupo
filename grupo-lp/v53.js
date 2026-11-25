// v53: conversa muito mais esperta com os funcionários (sem IA paga): personalidade própria, futebol, caminhões, carros, papo do dia a dia
(function(){const W=window;
const pk=a=>a[Math.floor(Math.random()*a.length)];
const N=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const wd=(s,w)=>new RegExp("(^|[^a-z])"+w.replace(/[?]/g,"\\?")+"([^a-z]|$)").test(s);
const has=(s,ws)=>ws.some(w=>w.length<=6&&!w.includes(" ")?wd(s,w):s.includes(w));
const semente=(id,n)=>{let x=(id*9301+49297)%233280;return Math.floor(x/233280*n)};
// ---------- personalidade fixa de cada funcionário ----------
const TIMES=["flamengo","vasco","corinthians","palmeiras","sao paulo","gremio","cruzeiro","atletico","botafogo","fluminense","remo","paysandu","santos","internacional","bahia"];
const NOMET={flamengo:"Flamengo",vasco:"Vasco",corinthians:"Corinthians",palmeiras:"Palmeiras","sao paulo":"São Paulo",gremio:"Grêmio",cruzeiro:"Cruzeiro",atletico:"Atlético-MG",botafogo:"Botafogo",fluminense:"Fluminense",remo:"Remo",paysandu:"Paysandu",santos:"Santos",internacional:"Internacional",bahia:"Bahia",fortaleza:"Fortaleza",ceara:"Ceará",sport:"Sport"};
const TERRA=["Ji-Paraná","Ariquemes","Rolim de Moura","Pimenta Bueno","Cuiabá","Rio Branco","Maringá","Goiânia","Cascavel","Toledo","Santarém","Manaus","Campo Grande","Londrina"];
const HOB=["pescar no rio no fim de semana","jogar bola na pelada de quinta","churrasco com a família no domingo","mexer em carro velho","assistir corrida de caminhão (Copa Truck)","ir pra igreja com a esposa","jogar sinuca no bar do Zé","andar de moto","criar galinha no sítio do pai"];
const FAM=["casado, dois filhos","casado, uma filha pequena","solteiro, mora com a mãe","noivo, casa no fim do ano","casado, três filhos e um cachorro","separado, vê o filho no fim de semana"];
const CAMS=["Scania R 450","Volvo FH 540","Mercedes Actros","DAF XF","Mercedes Axor","VW Constellation","Iveco S-Way"];
function P(f){const id=f.id||1;f.v53=f.v53||{time:TIMES[semente(id,TIMES.length)],terra:TERRA[semente(id*7,TERRA.length)],hob:HOB[semente(id*13,HOB.length)],fam:FAM[semente(id*17,FAM.length)],cam:CAMS[semente(id*23,CAMS.length)],idade:22+semente(id*29,35)};return f.v53}
// ---------- conhecimento ----------
const TIMEINFO={
 flamengo:["Mengão é o time mais popular do Brasil, chefe, mais de 40 milhões de torcedores","Maracanã lotado com a Nação cantando não tem igual","Zico é o maior ídolo da história do clube, ganhou o Mundial de 81 em cima do Liverpool","Libertadores de 2019 com aqueles dois gols do Gabigol no fim contra o River foi a coisa mais louca que já vi","o Mengão de 2019 do Jorge Jesus foi um dos melhores times que o Brasil já teve","o Flamengo virou potência: elenco caro, briga por tudo todo ano, Brasileirão e Libertadores"],
 vasco:["Vasco é time de massa, chefe, São Januário pegando fogo","Roberto Dinamite é o maior ídolo, maior artilheiro do Brasileirão","Vasco foi pioneiro em botar negro e pobre pra jogar, isso é história","o Vasco tem a Libertadores de 98, com Juninho Pernambucano fazendo golaço de falta"],
 corinthians:["Timão é paixão, chefe, a Fiel é a torcida mais doida","Corinthians ganhou o Mundial em 2012 em cima do Chelsea, gol do Guerrero","Sócrates e a Democracia Corinthiana marcaram época"],
 palmeiras:["Verdão virou máquina de ganhar título nos últimos anos","Palmeiras tem a Libertadores de 2020 e 2021 com o Abel Ferreira","Allianz Parque é estádio de primeiro mundo"],
 "sao paulo":["Tricolor tem três Mundiais, chefe","Rogério Ceni goleiro artilheiro, mais de 100 gols, coisa de outro mundo","Morumbi cheio é bonito demais"],
 gremio:["Grêmio é Imortal, chefe","Renato Gaúcho é ídolo como jogador e técnico, ganhou o Mundial de 83","Libertadores de 2017 foi um passeio"],
 cruzeiro:["Cabuloso tem a tríplice coroa de 2003","Mineirão azul é bonito","Tostão e Dirceu Lopes marcaram época"],
 atletico:["Galo doido, chefe! Libertadores de 2013 com Ronaldinho","a Massa atleticana empurra demais","Reinaldo é o maior ídolo do Galo"],
 botafogo:["Fogão tem Garrincha, Nilton Santos, a Estrela Solitária","o Botafogo ganhou Libertadores e Brasileirão em 2024, ano histórico"],
 fluminense:["Fluzão tem a Libertadores de 2023 com o Cano fazendo gol","Fred é ídolo eterno no Flu"],
 remo:["Leão Azul é paixão no Pará, chefe, Re-Pa é clássico pesado","Baenão lotado é festa"],
 paysandu:["Papão da Curuzu! Re-Pa é o maior clássico do Norte","o Paysandu ganhou do Boca na Bombonera em 2003, história pura"],
 santos:["Santos é o time do Pelé, chefe, o Rei","Neymar saiu da Vila Belmiro","Santos tem Libertadores de 62, 63 e 2011"],
 internacional:["Colorado tem o Mundial de 2006 em cima do Barcelona","Beira-Rio é bonito demais","Falcão é o maior ídolo do Inter"],
 bahia:["Bahêa minha porra! Esquadrão de aço","o Bahia foi campeão brasileiro em 59 e 88"]};
const CAMINFO={
 scania:["Scania é sueca, chefe. O R 450 e o R 540 são o sonho de todo motorista: cabine boa, motor forte, econômico na estrada","Scania tem a famosa V8, ronco que arrepia. O R 540 na serra é outra coisa","Scania antigo, o 113 e o 112, eram os 'jacarés', motorista velho chora quando lembra","o Scania novo tem câmbio Opticruise automatizado, muito mais descansado pro motorista"],
 volvo:["Volvo FH é referência em segurança, chefe, tem frenagem automática, alerta de faixa, piloto adaptativo","o FH 540 puxa rodotrem com 74 toneladas tranquilo","a cabine Globetrotter do Volvo parece um quarto de hotel","Volvo tem o I-Shift, câmbio automatizado que todo mundo elogia","no futuro a Volvo já tem o FH Elétrico rodando na Europa"],
 mercedes:["Mercedes é robusto, chefe, peça acha em qualquer canto do Brasil","o Actros é o top da Mercedes, cheio de tecnologia, até retrovisor por câmera (MirrorCam)","o Axor foi muito usado em frota, aguenta judiação","o velho 1113 e o 1313 são lenda, até hoje tem rodando no interior","a Mercedes tem o eActros elétrico lá fora"],
 constellation:["Constellation é da VW, chefe, feito em Resende-RJ, muito usado no Brasil","o Constellation é bom de custo, manutenção barata, fácil de achar mecânico","o VW 24.280 é cavalinho de batalha no frete urbano e regional","a VW tem o e-Delivery, caminhão elétrico feito no Brasil"],
 daf:["DAF é holandês mas fabrica em Ponta Grossa-PR, chefe. O XF é muito confortável","o DAF XF tem cabine larga e motor PACCAR econômico"],
 iveco:["Iveco é italiano, o S-Way é o top deles, cabine moderna","a Iveco fabrica em Sete Lagoas-MG","Iveco tem caminhão a gás (GNV/biometano) também"]};
const CARINFO={
 hilux:["Hilux é tanque de guerra, chefe. Não quebra, revende fácil, aguenta estrada de chão","a Hilux diesel 2.8 é a preferida do pessoal do agro"],
 s10:["S10 é boa de motor, a 2.8 diesel anda bem","a S10 tem bom custo-benefício pra pegar estrada"],
 ranger:["Ranger nova é a mais moderna das picapes, tem até V6 diesel","a Ranger Raptor é coisa de doido, motor a gasolina forte"],
 ram:["RAM é picapão americano, chefe, chama atenção onde passa","a RAM 2500 tem aquele motor Cummins 6.7, força bruta pra puxar barco ou carreta"],
 toro:["Toro é boa pra cidade e estradinha, mais confortável que picape grande"],
 strada:["Strada é a mais vendida do Brasil faz tempo, barata de manter"],
 porsche:["Porsche é outro mundo, chefe! O 911 é ícone, Cayenne é o SUV dos ricos","Porsche Taycan é elétrico e acelera igual foguete"],
 corolla:["Corolla é tranquilidade, não dá dor de cabeça, revende bem","o Corolla Cross híbrido faz muito km por litro"],
 civic:["Civic é gostoso de dirigir, o Type R é brabo"],
 onix:["Onix é carro de entrada mais vendido por muitos anos, econômico"],
 gol:["Gol foi o carro mais vendido do Brasil por 27 anos seguidos, chefe, lenda","Gol bolinha, Gol quadrado... todo mundo já teve um"],
 fusca:["Fusca é a história do Brasil sobre rodas, chefe, meu avô tinha um"]};
const PIADA=["Por que o caminhoneiro levou escada pra estrada? Porque o frete tava muito alto! 😂","Sabe qual é o caminhão mais educado? O que dá passagem! kkk","Chefe, o motorista chegou no posto e pediu: enche o tanque! O frentista: de quê? Ele: de esperança, que o diesel tá caro! 😅","Qual é o cúmulo da paciência? Esperar o caminhão da Prefeitura tapar buraco na BR-364 kkkk"];
// ---------- respostas ----------
function resp(f,txt){const s=N(txt),p=P(f),meuT=NOMET[p.time];
 // futebol
 const tc=TIMES.concat(["fortaleza","ceara"]).find(t=>wd(s,t)||(t==="internacional"&&wd(s,"inter"))||(t==="atletico"&&s.includes("galo"))||(t==="flamengo"&&(s.includes("mengao")||s.includes("fla ")))||(t==="corinthians"&&s.includes("timao"))||(t==="palmeiras"&&s.includes("verdao")));
 if(tc){const info=TIMEINFO[tc]||[`${NOMET[tc]} é time tradicional, chefe`];const meu=tc===p.time;
  const ult=has(s,["ultimo jogo","ultima partida","jogou","ontem","placar","resultado","ganhou","perdeu","proximo jogo","tabela","escalacao"]);
  let r=meu?pk([`Opa, chefe, falou do meu time! Sou ${meuT} desde moleque lá em ${p.terra}. `,`Ah chefe, aí o senhor me pegou, sou ${meuT} doente! `]):(p.time==="vasco"&&tc==="flamengo"||p.time==="flamengo"&&tc==="vasco"||p.time==="corinthians"&&tc==="palmeiras"||p.time==="palmeiras"&&tc==="corinthians"||p.time==="remo"&&tc==="paysandu"||p.time==="paysandu"&&tc==="remo"?pk([`Ihh chefe, aí não... sou ${meuT}, rival! Mas respeito. `,`Rapaz, eu sou ${meuT}, esse aí é rival, kkk. Mas vou falar a verdade: `]):pk([`Eu sou ${meuT}, chefe, mas gosto de futebol em geral. `,`Não é meu time (sou ${meuT}), mas acompanho. `]));
  const a1=pk(info);r+=a1+". "+(info.length>1?pk(info.filter(x=>x!==a1))+".":"");
  if(ult)r+=` Sobre o último jogo e o placar certinho, ${f.cargo==="mot"?"tava na estrada sem sinal, não consegui ver":"não consegui assistir, tava no serviço"}. ${pk(["Vou ver os gols no intervalo do almoço e te conto.","Se o senhor quiser eu pergunto pro pessoal da loja.","Pra saber na hora mesmo só ligando a IA nas configurações, aí eu pesquiso na internet."])}`;
  return r}
 if(has(s,["seu time","teu time","torce","qual time","futebol","jogo de hoje","brasileirao","libertadores","copa do mundo","selecao"])){
  if(has(s,["selecao","copa do mundo"]))return pk(["Seleção brasileira é penta, chefe: 58, 62, 70, 94 e 2002. Espero ver o hexa!","Copa de 2002 com Ronaldo, Rivaldo e Ronaldinho foi a última. Tô doido pelo hexa, chefe.","Pelé, Garrincha, Romário, Ronaldo... o Brasil sempre teve craque. Agora tem que voltar a ganhar Copa."]);
  return `Sou ${meuT}, chefe! ${pk(TIMEINFO[p.time]||["time de coração"])}. ${pk(["E o senhor, torce pra quem?","O senhor é de qual time?","Bora marcar de ver um jogo juntos qualquer dia!"])}`}
 // caminhões
 const ck=Object.keys(CAMINFO).find(k=>wd(s,k)||(k==="constellation"&&s.includes("vw "))||(k==="mercedes"&&(s.includes("benz")||s.includes("actros")||s.includes("axor")))||(k==="scania"&&s.includes("r 450")));
 if(ck){let r=pk(CAMINFO[ck])+". ";if(has(s,["velho","antigo","antes","antigamente"]))r+="Os antigos eram mais simples, sem eletrônica: motorista resolvia na estrada com chave de boca. Os novos são mais econômicos e seguros, mas se der pane eletrônica tem que ir pra concessionária.";else if(has(s,["futuro","eletrico","amanha","vai ser"]))r+="O futuro é caminhão elétrico, a gás e até hidrogênio, chefe. E tem os autônomos sendo testados lá fora. Mas aqui no Norte, com essas distâncias, diesel ainda vai reinar uns bons anos.";else if(has(s,["novo","zero","comprar","vale"]))r+=pk(["Se for comprar, chefe, eu pegaria um "+p.cam+", é o que eu mais gosto.","Pra BR-364 eu recomendo cavalo 6x4 com mais de 500 cv, por causa das subidas e do peso.","Novo é caro, mas economiza diesel e manutenção. Usado com 3, 4 anos às vezes é melhor negócio."]);else r+=pk([`Meu sonho é dirigir um ${p.cam}, chefe.`,"Caminhão bom é o que tem peça fácil e motorista bem treinado.","O que mata caminhão é óleo velho e pneu ruim, ainda bem que nós vende lubrificante kkk"]);return r}
 if(has(s,["caminhao","carreta","bitrem","rodotrem","cavalo mecanico","truck"])){
  if(has(s,["velho","antigo","antigamente"]))return "Caminhão antigo era raiz, chefe: Mercedes 1113, Scania 113 jacaré, FNM 'Fenemê'. Sem ar-condicionado, sem direção leve, motorista sofria. Mas era fácil de consertar na beira da estrada.";
  if(has(s,["futuro","eletrico"]))return "O futuro é elétrico e autônomo, chefe. A Volvo, a Mercedes e a VW já têm elétrico. Pra viagem longa vão vir hidrogênio e biometano. Aqui no Brasil o primeiro passo é o caminhão a gás.";
  if(has(s,["novo","presente","hoje","atual"]))return "Hoje os caminhões novos têm câmbio automatizado, piloto automático adaptativo, frenagem de emergência, telemetria e consumo bem menor. Os melhores pra estrada: Scania R, Volvo FH, Mercedes Actros e DAF XF.";
  return `${pk(["Caminhão é minha paixão, chefe.","Eu respeito demais quem vive na boleia."])} ${pk(CAMINFO[Object.keys(CAMINFO)[semente(f.id*31,6)]])}. ${pk(["Qual o senhor acha melhor?","Pensa em aumentar a frota?","Se for comprar, me chama pra dar uma olhada."])}`}
 // carros
 const ca=Object.keys(CARINFO).find(k=>wd(s,k));
 if(ca)return pk(CARINFO[ca])+". "+pk(["O senhor tá pensando em comprar um?","Eu ainda chego lá, chefe kkk","Pra nossa região, picape diesel é o que manda."]);
 if(has(s,["carro","picape","suv","moto"]))return pk(["Hoje picape diesel é o que mais vende aqui no Norte, chefe: Hilux, S10, Ranger e a Strada nas menores.","Eu ando de "+pk(["um Gol 2012","uma Strada","uma moto Titan","um Onix","uma S10 velha do meu pai"])+", chefe, mas sonho com uma Hilux.","O futuro dos carros é elétrico e híbrido, a BYD tá crescendo muito no Brasil."]);
 // pessoal
 if(has(s,["tudo bem","como vai","como voce ta","como vc ta","beleza?","e ai","suave"]))return pk([`Tudo certo, chefe! ${f.moral<40?"Meio cansado, pra falar a verdade...":"Firme e forte."}`,`Tô bem, graças a Deus. ${f.moral>80?"Animado demais com o serviço!":"Correria de sempre."}`,`De boa, chefe. E o senhor?`]);
 if(has(s,["familia","filho","esposa","mulher","casado","namorada"]))return `Sou ${p.fam}, chefe. ${pk(["Família é tudo, é por eles que eu trabalho.","Tô sempre mandando foto pra eles quando posso.","Fim de semana é sagrado com eles."])}`;
 if(has(s,["de onde","nasceu","sua cidade","terra natal","onde mora"]))return `Sou de ${p.terra}, chefe. ${pk(["Vim pra cá atrás de serviço e graças a Deus achei.","Saudade de lá, mas aqui tô bem.","Lugar bom de viver."])}`;
 if(has(s,["idade","quantos anos"]))return `Tenho ${p.idade} anos, chefe.`;
 if(has(s,["hobby","fim de semana","folga","diversao","gosta de fazer"]))return `No fim de semana eu gosto de ${p.hob}, chefe. ${pk(["Desestressa.","Recarrega a bateria pra semana.","O senhor gosta também?"])}`;
 if(has(s,["piada","conta uma","me faz rir"]))return pk(PIADA);
 if(has(s,["clima","tempo","chuva","calor","sol"]))return pk(["Aqui o calor tá de rachar, chefe, mais de 35 graus.","Tá vindo um temporal daqueles, época de chuva no Norte é assim.","Fumaça das queimadas atrapalhando a estrada, chefe. Visibilidade ruim."]);
 if(has(s,["comida","almoco","fome","janta","churrasco"]))return pk(["Hoje foi marmita de arroz, feijão, farofa e frango, chefe.","Churrasco no domingo é sagrado!","Tambaqui assado é o melhor prato daqui, chefe, o senhor já comeu?"]);
 if(has(s,["musica","sertanejo","forro","ouve"]))return pk(["Eu ouço sertanejo, chefe: Henrique e Juliano, Jorge e Mateus, Zezé di Camargo.","Na estrada é modão: Tião Carreiro, Milionário e José Rico.","Gosto de um forró e de brega também kkk."]);
 if(has(s,["diesel","combustivel","gasolina","preco do"]))return "O diesel pesa demais no frete, chefe. Por isso tem que cuidar do consumo: pneu calibrado, motorista sem acelerar à toa e óleo trocado no prazo.";
 if(has(s,["oleo","lubrificante","troca"]))return pk(["Óleo bom é o que segue a especificação da montadora, chefe. Pra diesel pesado é 15W40 API CK-4.","Caminhão pesado troca óleo de 20 a 40 mil km, depende do óleo e do uso.","O que mais vende na loja é o 15W40 pra diesel e o 5W30 sintético pros carros novos."]);
 if(has(s,["obrigado","valeu"]))return null; // deixa a resposta antiga cuidar
 return null}
let pronto=false;function instala(){if(pronto||typeof W.mandaTexto!=="function"||typeof th!=="function")return;pronto=true;const orig=W.mandaTexto;
 W.mandaTexto=function(id){let k="";try{k=localStorage.getItem("lpAIkey")||""}catch(e){}const t=th(id);if(k||!t||t.tipo!=="papo"||t.prop)return orig.apply(this,arguments);
  const f=(S.func||[]).find(x=>x.id===t.fid);const el=document.getElementById("txtMsg");const txt=el&&el.value.trim();if(!f||!txt)return orig.apply(this,arguments);
  let r=null;try{r=resp(f,txt)}catch(e){}if(!r)return orig.apply(this,arguments);r=r.replace(/(^|[.!?]\s+)([a-zà-ú])/g,(m,a,b)=>a+b.toUpperCase());
  el.value="";msgAdd(t,"eu",esc(txt));t.aguard=true;try{abrirThread(id)}catch(e){render()}
  setTimeout(()=>{t.aguard=false;msgAdd(t,"ele",r);try{save()}catch(e){}try{abrirThread(id)}catch(e){render()}},900+Math.random()*1800)}}
// instala DEPOIS do v51 (que verifica a chave): se não tiver chave, v53 tenta primeiro; senão cai no antigo
const iv=setInterval(()=>{if(document.readyState==="complete"){setTimeout(instala,9500);clearInterval(iv)}},500);
})();
