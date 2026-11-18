// v20: o limite da conta sobe de verdade – revisão mensal do banco (faturamento, score, contas em dia) + contas pagas por qualquer caminho contam
(function(){const W=window;const DIA_=86400000;
const C=()=>{if(!S.chq)S.chq={};const c=S.chq;if(c.lim==null)c.lim=100000;if(c.score==null)c.score=650;c.emDia=c.emDia||0;c.hist=c.hist||[];return c};
const hist=m=>{const c=C();c.hist.unshift(new Date(S.simMs).toLocaleDateString("pt-BR")+" • "+m);c.hist=c.hist.slice(0,40);try{log(m);toast(m)}catch(e){}};
// conta paga pelo botão já é contada pelo v6neg; marca para não contar 2x
const oP=W.pagar;if(oP)W.pagar=function(id){const k=S.contas.find(x=>x.id===id);const r=oP.apply(this,arguments);if(k&&k.pago)k.cnt=1;return r};
// contas pagas por outros caminhos (gerente, débito automático, negociação) também contam para o score
setInterval(()=>{if(typeof S==="undefined"||!S||!S.contas)return;const c=C();if(!c.v20){S.contas.forEach(k=>{if(k.pago)k.cnt=1});c.v20=1;return}let n=0;const e0=c.emDia;
 S.contas.forEach(k=>{if(k.pago&&!k.cnt){k.cnt=1;if(!k.multa){n++;c.emDia++;c.score=Math.min(1000,c.score+2)}}});
 if(n&&Math.floor(c.emDia/5)>Math.floor(e0/5)&&c.score>=600&&!c.serasa){const nv=Math.round(c.lim*1.08/1000)*1000;hist(`🏦 Banco aumentou seu limite: ${R$(c.lim)} → ${R$(nv)} (contas pagas em dia)`);c.lim=nv}},2000);
// revisão mensal: o gerente do banco olha faturamento, score e atrasos
function teto(c){const h30=(S.hist||[]).slice(-30),fat=h30.length>=20?h30.reduce((a,h)=>a+(h.v||0),0):S.lojas.filter(l=>!l.encerrada&&l.tipo!=="transp").reduce((a,l)=>a+(l.alvoHoje||10000)*26,0);
 const k=c.score>=850?.6:c.score>=750?.45:c.score>=650?.32:c.score>=550?.2:.1;return Math.max(100000,Math.round(fat*k/1000)*1000)}
function revisao(){const c=C();if(c.serasa)return;const atr=S.contas.filter(k=>!k.pago&&S.simMs>k.venc).length,t=teto(c);
 if(atr>2){hist(`🏦 Revisão do banco: limite mantido em ${R$(c.lim)} (${atr} contas em atraso)`);return}
 if(c.lim<t){const nv=Math.min(t,Math.round(c.lim*(c.score>=750?1.35:c.score>=650?1.2:1.1)/1000)*1000);hist(`🏦 Revisão mensal do banco: limite subiu de ${R$(c.lim)} para ${R$(nv)} (score ${c.score}, faturamento bom)`);c.lim=nv}
 else hist(`🏦 Revisão do banco: limite de ${R$(c.lim)} já está no máximo para o seu faturamento/score (teto ${R$(t)})`)}
let mes=null;setInterval(()=>{if(typeof S==="undefined"||!S||!S.contas)return;const d=new Date(S.simMs),m=d.getFullYear()*12+d.getMonth();
 const c=C();if(c.ultRev==null){c.ultRev=m;return}if(m!==c.ultRev&&d.getDate()>=5){c.ultRev=m;revisao()}},2000);
// botão para pedir revisão na hora (1 vez a cada 30 dias)
W.pedirRevisao=function(){const c=C();if(c.ultPed&&S.simMs-c.ultPed<30*DIA_)return toast("O banco só reavalia uma vez a cada 30 dias");c.ultPed=S.simMs;revisao();try{save();render()}catch(e){}};
if(V.credito){const o=V.credito;V.credito=function(){const c=C();return `<div class="card"><h3>📈 Como o limite sobe</h3><p class="muted">Todo mês (dia 5) o banco revisa: com score alto, contas em dia e bom faturamento o limite aumenta 10–35%. A cada 5 contas pagas em dia ganha +8%. Teto atual pelo seu faturamento/score: <b>${R$(teto(c))}</b>.</p><button class="b g" onclick="pedirRevisao()">🏦 Pedir revisão do limite agora</button></div>`+o.apply(this,arguments)}}
})();
