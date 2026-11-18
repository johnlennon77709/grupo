// v18: QUALQUER compra/pagamento pode deixar a conta negativa até o limite da conta (todas as telas, inclusive as antigas)
(function(){const W=window;let infl=false,pSave=false,pRender=false;
const oS=W.save;if(oS)W.save=function(){if(infl){pSave=true;return}return oS.apply(this,arguments)};
const oR=W.render;if(oR)W.render=function(){if(infl){pRender=true;return}return oR.apply(this,arguments)};
const oT=W.toast;let ctxK=null;if(oT)W.toast=function(m){if(infl&&/insuficiente|Sem dinheiro|não tem caixa/.test(m)){const L=lim(),k=ctxK;const sal=(W._lctx!=null&&S.lcx&&S.lcx[W._lctx]!=null)?S.lcx[W._lctx]-L:(k!=null&&S.ecx[k]!=null?S.ecx[k]-L:null);m+=` • limite da conta ${R$(L)}`+(sal!=null?` • saldo atual ${R$(sal)} (disponível ${R$(sal+L)})`:"")}return oT.call(this,m)};
const oLN=W.LIMNEG;function lim(){try{return oLN?oLN():100000}catch(e){return 100000}}
if(oLN)W.LIMNEG=function(){return infl?0:oLN.apply(this,arguments)};
function embrulha(nome){const o=W[nome];if(typeof o!=="function"||o.__v18)return;
 const f=function(){if(infl)return o.apply(this,arguments);const L=lim(),ks=Object.keys(S.ecx||{}),kl=Object.keys(S.lcx||{});
  try{ctxK=(W._ctx||S.empAt||null)}catch(e){}infl=true;ks.forEach(k=>S.ecx[k]+=L);kl.forEach(k=>S.lcx[k]+=L);
  try{return o.apply(this,arguments)}finally{ks.forEach(k=>S.ecx[k]-=L);kl.forEach(k=>S.lcx[k]-=L);infl=false;
   if(pSave){pSave=false;try{oS()}catch(e){}}if(pRender){pRender=false;try{oR()}catch(e){}}}};
 f.__v18=1;W[nome]=f}
function varre(){Object.getOwnPropertyNames(W).forEach(n=>{let fn;try{fn=W[n]}catch(e){return}if(typeof fn!=="function"||fn.__v18||/^(rotina|tick|render|hdr|save|load|V)$|^rotina|^tick/.test(n))return;
 let s;try{s=Function.prototype.toString.call(fn)}catch(e){return}if(s.length>20000||s.includes("[native code]"))return;
 if(/insuficiente|Sem dinheiro|não tem caixa/.test(s)&&n!=="toast")embrulha(n)})}
varre();setTimeout(varre,0);setTimeout(varre,3000);
// também libera os cofres das próprias lojas quando o jogo usa caixa de loja
W.v18Lista=()=>Object.getOwnPropertyNames(W).filter(n=>{try{return W[n]&&W[n].__v18}catch(e){return false}});
})();
