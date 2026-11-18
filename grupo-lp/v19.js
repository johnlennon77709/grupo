// v19: cada unidade (loja) tem o seu próprio caixa. A empresa (matriz) fica com um caixa separado para custos gerais.
(function(){const W=window;W._lctx=null;
const ativa=l=>l&&!l.encerrada;
function empK(){const k=W._ctx||S.empAt;return EMP[k]?k:Object.keys(EMP)[0]}
function migra(){if(S.lcxMig)return;S.lcx=S.lcx||{};S.ecx=S.ecx||{};
 Object.keys(EMP).forEach(k=>{const ls=S.lojas.filter(l=>l.emp===k&&ativa(l));if(!ls.length)return;const tot=S.ecx[k]||0,parte=tot*.6/ls.length;ls.forEach(l=>S.lcx[l.id]=(S.lcx[l.id]||0)+parte);S.ecx[k]=tot*.4});
 S.lcxMig=1;try{log("🏦 Agora cada loja tem o seu próprio caixa (60% do dinheiro de cada empresa foi dividido entre as lojas; 40% ficou na matriz)")}catch(e){}}
function getC(){const i=W._lctx;if(i!=null&&ativa(S.lojas[i]))return S.lcx[i]||0;return S.ecx[empK()]||0}
function setC(v){const i=W._lctx;if(i!=null&&ativa(S.lojas[i])){S.lcx[i]=v;return}S.ecx[empK()]=v}
getC.__v19=1;
function instala(){if(typeof S==="undefined"||!S||!S.lojas)return;S.ecx=S.ecx||{};S.lcx=S.lcx||{};const d=Object.getOwnPropertyDescriptor(S,"caixaGrupo");
 if(!(d&&d.get&&d.get.__v19)){if(d&&!d.get&&!S.cxMig)return;/* deixa o v8 migrar primeiro */delete S.caixaGrupo;Object.defineProperty(S,"caixaGrupo",{configurable:true,enumerable:false,get:getC,set:setC})}
 migra();S.lojas.forEach(l=>{if(S.lcx[l.id]==null)S.lcx[l.id]=0})}
setInterval(()=>{try{instala()}catch(e){}},300);try{instala()}catch(e){}
// contexto de loja
W.lojaCtx=function(id){W._lctx=id;queueMicrotask(()=>{W._lctx=null})};
function comLoja(id,fn,self,args){const p=W._lctx;W._lctx=id;try{return fn.apply(self,args)}finally{W._lctx=p}}
const oV=W.venda;W.venda=function(l){return comLoja(l&&l.id,oV,this,arguments)};
const oEC=W.empCtx;W.empCtx=function(x){oEC.apply(this,arguments);if(x&&typeof x==="object"&&x.id!=null)lojaCtx(x.id)};
["comprar","comprarConc","cdParaLoja"].forEach(n=>{const o=W[n];if(typeof o==="function")W[n]=function(){const l=S.lojas[typeof lojaSel!=="undefined"?lojaSel:0];return comLoja(l&&l.id,o,this,arguments)}});
const oT=W.treinar;if(oT)W.treinar=function(id){const f=fun(id);return comLoja(f&&f.loja,oT,this,arguments)};
function lojaDaConta(c){if(c.loja!=null)return c.loja;const l=S.lojas.find(l=>c.desc&&c.desc.endsWith(" "+(l.suf?`${EMP[l.emp].n} ${l.suf}${l.tipo==="transp"?"":" "+l.cid}`:`${EMP[l.emp].n} ${l.cid}`)));return l?l.id:null}
const oP=W.pagar;if(oP)W.pagar=function(id){const c=S.contas.find(x=>x.id===id);const li=c?lojaDaConta(c):null;return li!=null?comLoja(li,oP,this,arguments):oP.apply(this,arguments)};
// folha e impostos por loja
const oGC=W.gerarContasMes;W.gerarContasMes=function(d){const n0=S.contas.length;oGC.apply(this,arguments);
 const novas=S.contas.slice(n0),glob=novas.filter(c=>/^(Folha de pagamento|INSS\/FGTS|ICMS\/PIS\/COFINS)/.test(c.desc));if(!glob.length)return;
 S.contas=S.contas.filter(c=>!glob.includes(c));const venc=(glob[0]||{}).venc||S.simMs+10*86400000;
 S.lojas.filter(ativa).forEach(l=>{const nl=nomeLoja(l),fol=S.func.filter(f=>f.loja===l.id).reduce((a,f)=>a+f.sal,0);
  if(fol){addConta(`Folha de pagamento – ${nl}`,fol,venc,"Pessoal");S.contas[S.contas.length-1].loja=l.id;addConta(`INSS/FGTS – ${nl}`,fol*.36,venc,"Impostos");S.contas[S.contas.length-1].loja=l.id}
  if(l.tipo!=="transp"){const imp=Math.max(1500,(l.venda.mes||0)*.12);addConta(`ICMS/PIS/COFINS – ${nl}`,imp,venc,"Impostos");S.contas[S.contas.length-1].loja=l.id}})};
// juros diários quando o caixa da loja fica negativo
let dia=null;setInterval(()=>{if(typeof S==="undefined"||!S||!S.lcx)return;const d=new Date(S.simMs).toDateString();if(dia===null){dia=d;return}if(d===dia)return;dia=d;
 let tot=0;S.lojas.forEach(l=>{const v=S.lcx[l.id];if(v<0){const j=-v*.0027;S.lcx[l.id]-=j;tot+=j}});if(tot>0)try{log(`🏦 Juros do limite da conta das lojas: ${R$(tot)}`)}catch(e){}},1000);
// venda/fechamento: o caixa da loja volta para a empresa
["venderLoja","fecharLoja"].forEach(n=>{const o=W[n];if(typeof o==="function")W[n]=function(id){const l=S.lojas[id],antes=l&&l.encerrada;const r=o.apply(this,arguments);if(l&&!antes&&l.encerrada&&S.lcx[id]){S.ecx[l.emp]=(S.ecx[l.emp]||0)+S.lcx[id];S.lcx[id]=0}return r}});
// transferir entre a loja e a matriz
W.movLoja=function(id,sinal){const l=S.lojas[id],v=+String((document.getElementById("mv"+id)||{}).value||"").replace(/[^\d,]/g,"").replace(",",".");if(!v||!l)return;
 const lim=W.LIMNEG?LIMNEG():0;if(sinal>0){if((S.ecx[l.emp]||0)+lim<v)return toast("A matriz não tem esse valor");S.ecx[l.emp]-=v;S.lcx[id]=(S.lcx[id]||0)+v;log(`💸 ${EMP[l.emp].n} (matriz) → ${nomeLoja(l)}: ${R$(v)}`)}
 else{if((S.lcx[id]||0)+lim<v)return toast("A loja não tem esse valor");S.lcx[id]-=v;S.ecx[l.emp]=(S.ecx[l.emp]||0)+v;log(`💸 ${nomeLoja(l)} → ${EMP[l.emp].n} (matriz): ${R$(v)}`)}save();render()};
const linha=l=>{const v=S.lcx[l.id]||0;return `<tr><td>${esc(nomeLoja(l))}</td><td style="color:${v<0?"#ef4444":"#22c55e"};font-weight:800">${R$(v)}</td><td style="white-space:nowrap"><input id="mv${l.id}" type="number" placeholder="R$" style="width:100px"><button class="b g" onclick="movLoja(${l.id},1)">⬅ Matriz → loja</button><button class="b s" onclick="movLoja(${l.id},-1)">Loja → matriz ➡</button></td></tr>`};
const oE=V.empresas;V.empresas=function(){const h=oE.apply(this,arguments);
 return h+`<div class="card"><h3>💰 Caixa de cada unidade</h3><p class="muted">Cada loja vende, compra mercadoria e paga as próprias contas (luz, água, aluguel, folha, impostos) com o seu caixa. O "Caixa próprio" da empresa é a matriz.</p>${Object.keys(EMP).map(k=>{const ls=S.lojas.filter(l=>l.emp===k&&ativa(l));if(!ls.length)return"";return `<h4 style="margin:10px 0 4px;color:${EMP[k].c}">${esc(EMP[k].n)} – matriz ${R$(S.ecx[k]||0)}</h4><div class="tw"><table><tr><th>Unidade</th><th>Caixa</th><th>Transferir</th></tr>${ls.map(linha).join("")}</table></div>`}).join("")}</div>`};
const oL=V.loja;V.loja=function(){const h=oL.apply(this,arguments),l=S.lojas[typeof lojaSel!=="undefined"?lojaSel:0];if(!l)return h;
 return `<div class="card"><h3>💰 Caixa desta loja</h3><div class="tw"><table>${linha(l)}</table></div></div>`+h};
})();
