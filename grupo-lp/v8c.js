// v8c: some com o chip "Caixa do grupo", tira o quadro de contas do Painel e deixa as vendas realistas
(function(){
const W=window;
const st=document.createElement("style");st.textContent=".chip:has(#cash){display:none!important}";document.head.appendChild(st);
setInterval(()=>{const c=document.getElementById("cash");if(c&&c.parentElement)c.parentElement.style.display="none"},500);
// quadro das contas fica só na aba Empresas
const oP=V.painel;V.painel=function(){return oP.apply(this,arguments).replace(/<div class="card"><h3>🏦 Contas das empresas[\s\S]*?onclick="transf\(\)">Transferir<\/button><\/div><\/div>/,"")};
// ---------- vendas realistas: cada loja vende ~R$ 5 mil a 22 mil por dia ----------
function alvo(l){if(l.alvoDia==null){const base=l.tipo==="transp"?0:segDe(l)==="const"?r(9000,22000):r(5000,18000);l.alvoDia=Math.round(base/100)*100}return l.alvoDia}
const oV=W.venda;W.venda=function(l,v,custo,h,fat,cli){try{const d=new Date(S.simMs),k=d.toDateString();if(l.rawD!==k){l.rawD=k;l.rawDia=0;l.alvoHoje=Math.round(alvo(l)*r(.6,1.45)*(d.getDay()===6?.55:1))}
 const bruto=(+v||0)+(+fat||0);l.rawDia+=bruto;const hh=d.getHours()+d.getMinutes()/60,frac=Math.min(1,Math.max(.06,(hh-7.5)/10.5)),proj=l.rawDia/frac,fator=Math.min(1,l.alvoHoje/Math.max(1,proj));
 if(l.venda&&l.venda.dia>l.alvoHoje*1.25&&Math.random()<.85)return;
 v=(+v||0)*fator;custo=(+custo||0)*fator;fat=fat!=null?(+fat||0)*fator:fat}catch(e){}
 return oV.call(this,l,v,custo,h,fat,cli)};
// recebíveis gerados fora da venda (vendas externas a prazo) também ficam proporcionais
setInterval(()=>{try{(S.rec||[]).forEach(x=>{if(!x.v8c&&/Venda ext/.test(x.desc||"")&&x.v>6000){x.v=Math.round(x.v*r(.08,.2));x.orig=x.v;x.v8c=1}else x.v8c=1})}catch(e){}},3000);
})();
