// v65: pagamento automático de contas (no vencimento, com o caixa da própria loja) + botão "pagar todas as vencidas"
(function(){const W=window;
const X=()=>{S.v65=S.v65||{auto:true,pagas:0,tot:0};return S.v65};
function paga1(c){if(!c||c.pago||typeof pagar!=="function")return false;let el=document.getElementById("fp"+c.id),tmp=null;
 if(!el){tmp=document.createElement("select");tmp.id="fp"+c.id;tmp.style.display="none";tmp.innerHTML="<option>Pix</option>";document.body.appendChild(tmp)}
 const t0=W.toast;let falhou=false;W.toast=function(m){if(/insuficiente/i.test(String(m)))falhou=true;else return t0&&t0.apply(this,arguments)};
 try{pagar(c.id)}catch(e){falhou=true}finally{W.toast=t0;if(tmp)tmp.remove()}return !!c.pago&&!falhou}
function roda(forcar){const x=X();if(!x.auto&&!forcar)return 0;let n=0,v=0;const lim=forcar?500:15;
 S.contas.filter(c=>!c.pago&&c.venc<=S.simMs+(forcar?0:6e4)&&c.cat!=="Empréstimo").sort((a,b)=>a.venc-b.venc).slice(0,lim).forEach(c=>{const val=c.v;if(paga1(c)){n++;v+=val}});
 if(n){x.pagas+=n;x.tot+=v;try{log(`🤖 Pagamento automático: ${n} conta(s) pagas – ${R$(v)}`)}catch(e){}}return n}
W.v65todas=function(){const n=roda(true);toast(n?`${n} conta(s) vencida(s) pagas`:"Nenhuma conta vencida (ou caixa insuficiente)");try{save()}catch(e){}try{render()}catch(e){}};
W.v65tog=function(){const x=X();x.auto=!x.auto;toast(x.auto?"Pagamento automático LIGADO":"Pagamento automático desligado");try{save()}catch(e){}try{render()}catch(e){}};
function card(){const x=X();const venc=S.contas.filter(c=>!c.pago&&c.venc<S.simMs);const tv=venc.reduce((a,c)=>a+c.v,0);
 return `<div class="card" style="border:1px solid ${venc.length?"#ef444466":"#22c55e55"}"><div class="row sb" style="flex-wrap:wrap;gap:8px"><h3 style="margin:0">🤖 Pagamento automático</h3><button class="b ${x.auto?"s":"g"}" onclick="v65tog()">${x.auto?"✅ Ligado (desligar)":"Ligar"}</button></div>
 <p class="muted" style="font-size:12px;margin-top:6px">Paga sozinho toda conta no dia do vencimento, via Pix, com o caixa da loja dona da conta. Assim nenhuma empresa atrasa nem é negativada. Já pagou ${x.pagas} conta(s), ${R$(x.tot)}.</p>
 ${venc.length?`<p style="margin-top:6px">⚠️ <b>${venc.length} conta(s) vencida(s)</b> somando <b style="color:#ef4444">${R$(tv)}</b></p><button class="b g" onclick="v65todas()">💳 Pagar todas as vencidas agora</button>`:`<p style="color:#22c55e;margin-top:6px">✅ Nenhuma conta vencida.</p>`}</div>`}
let inst=false;function instala(){if(inst||typeof V==="undefined")return;inst=true;["contas","credito"].forEach(k=>{if(!V[k])return;const o=V[k];V[k]=function(){const a=o.apply(this,arguments);let c="";try{c=card()}catch(e){}return c+a}});try{render()}catch(e){}}
setTimeout(instala,9000);
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.contas)return;if(roda(false)){try{save()}catch(e){}}}catch(e){console.warn("v65",e)}},5000);
})();
