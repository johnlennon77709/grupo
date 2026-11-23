// v48: organiza as abas – Marketing na Sala do Chefe, Clientes fiéis em Clientes & Dívidas, Impostos em Crédito & Serasa, Sócios em Concorrência
(function(){const MAP=[["📣","chefe"],["🤝 Clientes fiéis","fin"],["🧾 Impostos","credito"],["🤝 Sócios","concorr"]];
function liga(){if(typeof V==="undefined"||!V.painel||V.painel.__v48)return false;const P=V.painel;
 function parte(html){const t=document.createElement("template");t.innerHTML=html;const out={};t.content.querySelectorAll(".card").forEach(c=>{const h=c.querySelector("h3");if(!h)return;const tx=h.textContent.trim();const m=MAP.find(([p])=>tx.startsWith(p));if(m&&c.parentNode===t.content||m&&!c.parentElement.closest(".card")){(out[m[1]]=out[m[1]]||[]).push(c.outerHTML);c.remove()}});return{resto:t.innerHTML,out}}
 V.painel=function(){return parte(P.apply(this,arguments)).resto};V.painel.__v48=1;
 MAP.forEach(([,k])=>{const o=V[k];if(!o)return;V[k]=function(){let extra="";try{extra=(parte(P()).out[k]||[]).join("")}catch(e){}return extra+o.apply(this,arguments)}});return true}
setTimeout(()=>{let n=0;const it=setInterval(()=>{n++;if(liga()||n>40)clearInterval(it)},1000)},5000);
})();
