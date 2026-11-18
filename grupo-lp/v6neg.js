// v6neg: limite da conta, juros reais, score e Serasa
(function(){
const W=window,DD=86400000;
function ini(){if(!S.chq)S.chq={};const c=S.chq;if(c.lim==null)c.lim=100000;if(c.score==null)c.score=650;if(c.jurosPagos==null)c.jurosPagos=0;c.emDia=c.emDia||0;c.serasa=c.serasa||false;c.cli=c.cli||{};c.hist=c.hist||[];c.diasNeg=c.diasNeg||0;return c}
function faixa(s){return s>=800?["Excelente","#22c55e"]:s>=650?["Bom","#84cc16"]:s>=500?["Regular","#eab308"]:s>=300?["Baixo","#f97316"]:["Muito baixo","#ef4444"]}
function taxa(c){return c.score>=800?5.9:c.score>=650?7.9:c.score>=500?10.9:13.9} // % a.m. do limite da conta
function hist(t){const c=ini();c.hist.unshift({t:S.simMs,x:t});c.hist=c.hist.slice(0,40);log(t)}
function cliScore(n){const c=ini();if(c.cli[n]==null)c.cli[n]=Math.round(450+Math.random()*400);return c.cli[n]}
W.LIMNEG=function(){try{const c=ini();return c.serasa?0:c.lim}catch(e){return 0}};
// pagamento de contas: registra se foi em dia
const oPag=W.pagar;if(oPag)W.pagar=function(id){const c=ini(),k=S.contas.find(x=>x.id===id),antes=k&&!k.pago,emDia=k&&S.simMs<=k.venc;oPag.apply(this,arguments);if(antes&&k.pago){if(emDia){c.emDia++;c.score=Math.min(1000,c.score+3);if(c.emDia%5===0&&c.score>=600&&!c.serasa){const n=Math.round(c.lim*1.1/1000)*1000;hist(`🏦 Banco aumentou seu limite: ${R$(c.lim)} → ${R$(n)} (contas pagas em dia)`);c.lim=n}}else{c.score=Math.max(0,c.score-10)}}};
function dia(){const c=ini(),agora=S.simMs;
 // contas atrasadas: multa 2% + juros de mora 1% a.m. + correção
 const atr=S.contas.filter(k=>!k.pago&&k.venc<agora);
 atr.forEach(k=>{if(!k.multa){k.multa=1;k.orig=k.orig||k.v;k.v=Math.round(k.v*1.02*100)/100;if(!c.jaAtrasou){c.jaAtrasou=1}const n=Math.round(c.lim*.85/1000)*1000;if(!c.serasa&&n<c.lim){c.lim=n;hist(`⚠️ Conta atrasada (${k.desc}). Banco reduziu seu limite para ${R$(n)}`)}}k.v=Math.round(k.v*(1+.0133/30)*100)/100});
 if(atr.length)c.score=Math.max(0,c.score-Math.min(40,atr.length*4));else c.score=Math.min(1000,c.score+1);
 // Serasa do grupo: dívida vencida há mais de 30 dias
 const grave=atr.filter(k=>agora-k.venc>30*DD);
 if(grave.length&&!c.serasa){c.serasa=true;c.score=Math.min(c.score,280);hist(`🚫 Seu CNPJ foi negativado no Serasa (${grave[0].credor||grave[0].desc} – ${R$(grave[0].v)}). Limite da conta bloqueado.`)}
 if(!grave.length&&c.serasa){c.serasa=false;c.score=Math.min(1000,c.score+60);hist(`✅ Nome limpo! Dívidas regularizadas, saiu do Serasa.`)}
 // juros do limite da conta (saldo negativo) + IOF
 if(S.caixaGrupo<0){const neg=-S.caixaGrupo,j=neg*(taxa(c)/100)/30+neg*.000082;S.caixaGrupo-=j;c.jurosPagos+=j;if(S.fat)S.fat.desp+=j;c.diasNeg++;if(c.diasNeg>45)c.score=Math.max(0,c.score-3);log(`🏦 Juros do limite da conta: ${R$(j)} (${taxa(c)}% a.m. + IOF)`)}else c.diasNeg=0;
 if(S.caixaGrupo<-LIMNEG()-1)hist(`🚨 Conta passou do limite da conta! Saldo ${R$(S.caixaGrupo)}`);
 // clientes inadimplentes
 S.rec.forEach(x=>{if(x.cheque||x.v<.5||x.venc>=agora)return;const d=(agora-x.venc)/DD;c.cli[x.cli]=Math.max(0,cliScore(x.cli)-2);
  const p=x.serasa?.06:d>60?.008:.015;if(Math.random()<p){S.caixaGrupo+=x.v;hist(`💰 ${x.cli} pagou ${R$(x.v)} em atraso${x.serasa?" (para sair do Serasa)":""}`);x.v=0;c.cli[x.cli]=Math.min(1000,cliScore(x.cli)+40);if(x.serasa){x.serasa=false}}});
 S.rec=S.rec.filter(x=>x.v>.5||x.cheque);
}
setInterval(function(){try{const c=ini(),d=new Date(S.simMs).toDateString();if(c.ultDia===d)return;const pri=!c.ultDia;c.ultDia=d;if(!pri)dia()}catch(e){console.warn(e)}},4000);
W.negativar=function(id){const x=S.rec.find(y=>y.id===id);if(!x)return;if(!confirm(`Negativar ${x.cli} no Serasa por ${R$(x.v)}? Custo do registro: R$ 15,00`))return;S.caixaGrupo-=15;x.serasa=true;ini().cli[x.cli]=Math.min(cliScore(x.cli),250);hist(`📛 ${x.cli} foi negativado no Serasa (${R$(x.v)})`);render()};
W.tirarSerasa=function(id){const x=S.rec.find(y=>y.id===id);if(!x)return;x.serasa=false;hist(`${x.cli} retirado do Serasa`);render()};
W.ajustaLim=function(){const c=ini(),l=prompt("Pedir ao banco novo limite da conta (R$):",c.lim);if(l===null)return;const n=+String(l).replace(/\D/g,"");const max=Math.round(c.score*c.score/650/650*100000*(1+c.emDia/20)/1000)*1000;if(c.serasa)return toast("Negado: nome no Serasa");if(n<=c.lim||n<=max){c.lim=n;hist(`🏦 Limite da conta alterado para ${R$(n)}`)}else toast(`Banco negou. Com seu score o máximo é ${R$(Math.max(max,c.lim))}`);render()};
// aba Crédito & Serasa
const novo={};Object.entries(ABAS).forEach(([k,v])=>{novo[k]=v;if(k==="contas")novo.credito=["📈","Crédito & Serasa"]});Object.keys(ABAS).forEach(k=>delete ABAS[k]);Object.assign(ABAS,novo);
V.credito=function(){const c=ini(),[fx,cor]=faixa(c.score),neg=S.caixaGrupo<0,atr=S.contas.filter(k=>!k.pago&&k.venc<S.simMs),inad=S.rec.filter(x=>!x.cheque&&x.venc<S.simMs);
 const emps=Object.keys(EMP).map(k=>{const cx=S.ecx&&S.ecx[k];const s=Math.max(0,Math.min(1000,Math.round(c.score+(cx==null?0:cx<0?-120:cx>500000?40:0))));return [EMP[k].n,s]});
 const g=s=>{const[f,co]=faixa(s);return `<b style="color:${co}">${s}</b> <span class="muted">${f}</span>`};
 return `<div class="card"><h3>📈 Score do Grupo LP</h3><div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><div style="font-size:46px;font-weight:900;color:${cor}">${c.score}</div><div><b style="color:${cor}">${fx}</b><div class="muted">de 0 a 1000 · ${c.emDia} contas pagas em dia</div>${c.serasa?`<div style="color:#ef4444;font-weight:800">🚫 NEGATIVADO NO SERASA – limite bloqueado</div>`:`<div style="color:#22c55e">✅ Nome limpo</div>`}</div></div>
 <div style="height:10px;border-radius:6px;background:linear-gradient(90deg,#ef4444,#f97316,#eab308,#84cc16,#22c55e);position:relative;margin:10px 0"><div style="position:absolute;left:${c.score/10}%;top:-4px;width:4px;height:18px;background:#fff"></div></div></div>
 <div class="card" style="border-left:4px solid ${neg?"#ef4444":"#22c55e"}"><h3>🏦 Limite da conta</h3>Limite: <b>${R$(c.serasa?0:c.lim)}</b> · juros ${taxa(c)}% a.m. + IOF 0,0082%/dia<br>${neg?`<span style="color:#ef4444;font-weight:800">Conta no vermelho: ${R$(S.caixaGrupo)} · ainda disponível ${R$(Math.max(0,LIMNEG()+S.caixaGrupo))}</span>`:`Saldo ${R$(S.caixaGrupo)} · disponível com limite ${R$(S.caixaGrupo+LIMNEG())}`}<br><span class="muted">Juros já pagos: ${R$(c.jurosPagos)} · A cada 5 contas pagas em dia o banco aumenta seu limite em 10%. Atrasos reduzem.</span><br><button class="b s" onclick="ajustaLim()">Pedir mais limite</button></div>
 <div class="card"><h3>⏰ Minhas contas atrasadas (${atr.length})</h3>${atr.length?`<table><tr><th>Conta</th><th>Credor</th><th>Vencida há</th><th>Valor c/ multa e juros</th></tr>${atr.map(k=>`<tr><td>${esc(k.desc)}</td><td>${esc(k.credor||"")}</td><td class="dn">${Math.floor((S.simMs-k.venc)/DD)} dias${S.simMs-k.venc>30*DD?" · SERASA":""}</td><td><b>${R$(k.v)}</b></td></tr>`).join("")}</table><div class="muted">Multa 2% + juros de mora 1% a.m. Mais de 30 dias = negativado. Pague na aba 💳 Contas.</div>`:`<div class="muted">Nenhuma conta atrasada 👍</div>`}</div>
 <div class="card"><h3>🏢 Score das empresas</h3><table>${emps.map(e=>`<tr><td>${e[0]}</td><td>${g(e[1])}</td></tr>`).join("")}</table></div>
 <div class="card"><h3>🧾 Clientes inadimplentes (${inad.length})</h3>${inad.length?`<table><tr><th>Cliente</th><th>Score</th><th>Valor</th><th>Atraso</th><th>Serasa</th></tr>${inad.map(x=>`<tr><td><b>${esc(x.cli)}</b><div class="muted">${esc(x.desc||"")}</div></td><td>${g(cliScore(x.cli))}</td><td><b>${R$(x.v)}</b></td><td class="dn">${Math.floor((S.simMs-x.venc)/DD)} dias</td><td>${x.serasa?`<span style="color:#ef4444">📛 Negativado</span> <button class="b s" onclick="tirarSerasa(${x.id})">Retirar</button>`:`<button class="b s" onclick="negativar(${x.id})">📛 Negativar</button>`}</td></tr>`).join("")}</table><div class="muted">Cliente negativado tem bem mais chance de pagar.</div>`:`<div class="muted">Nenhum cliente em atraso.</div>`}</div>
 <div class="card"><h3>📜 Histórico de crédito</h3>${c.hist.slice(0,15).map(h=>`<div class="muted">${new Date(h.t).toLocaleDateString("pt-BR")} – ${esc(h.x)}</div>`).join("")||"<div class='muted'>Sem registros</div>"}</div>`};
// aviso no painel
const oP=V.painel;if(oP)V.painel=function(){const c=ini(),h=oP.apply(this,arguments),neg=S.caixaGrupo<0,[fx,cor]=faixa(c.score);return `<div class="card" style="border-left:4px solid ${neg||c.serasa?"#ef4444":"#22c55e"};cursor:pointer" onclick="aba='credito';render()"><b>🏦 Limite da conta</b> ${R$(c.serasa?0:c.lim)} · <b style="color:${cor}">Score ${c.score} (${fx})</b>${c.serasa?' · <b style="color:#ef4444">NEGATIVADO NO SERASA</b>':""}<br>${neg?`<span style="color:#ef4444;font-weight:800">Conta no vermelho: ${R$(S.caixaGrupo)}</span>`:`Disponível com limite: ${R$(S.caixaGrupo+LIMNEG())}`}</div>`+h};
})();
