// v35: empréstimo bancário (capital de giro) – valor cai na conta da empresa e vira parcelas mensais em 💳 Contas
(function(){const W=window,D=86400000;
function chq(){return (S.chq)||{score:650,lim:100000,serasa:false}}
function taxa(){const s=chq().score||650;return s>=800?1.49:s>=650?1.99:s>=500?2.79:3.89}
function teto(){const f=S.fat||{};const mes=Math.max(f.mes||0,(f.dia||0)*26);return Math.max(300000,Math.round((mes*3+(chq().lim||0)*5)/10000)*10000)}
function devendo(){return (S.contas||[]).filter(c=>!c.pago&&c.cat==="Empréstimo").reduce((a,c)=>a+c.v,0)}
function pmt(v,n,i){i/=100;return v*i/(1-Math.pow(1+i,-n))}
W.simEmp=function(){const v=+String(document.getElementById("eV").value).replace(/\D/g,"")||0,n=+document.getElementById("eN").value,i=taxa(),p=pmt(v,n,i);
 document.getElementById("eR").innerHTML=v?`Parcela: <b>${R$(p)}</b> × ${n} · total ${R$(p*n)} · juros ${R$(p*n-v)} (${i.toFixed(2).replace(".",",")}% a.m.)`:""};
W.pegarEmp=function(){const c=chq();if(c.serasa)return alert("Banco recusou: CNPJ negativado no Serasa. Limpe o nome primeiro.");
 const k=document.getElementById("eE").value,v=+String(document.getElementById("eV").value).replace(/\D/g,"")||0,n=+document.getElementById("eN").value,i=taxa();
 if(v<5000)return alert("Valor mínimo R$ 5.000");const disp=teto()-devendo();if(v>disp)return alert(`O banco aprova no máximo ${R$(Math.max(0,disp))} agora (teto ${R$(teto())}, já devendo ${R$(devendo())}).`);
 const p=pmt(v,n,i);if(!confirm(`Pegar ${R$(v)} para ${EMP[k].n} em ${n}x de ${R$(p)} (${i.toFixed(2).replace(".",",")}% a.m.)?`))return;
 S.ecx[k]=(S.ecx[k]||0)+v;const id=S.nid++;for(let j=1;j<=n;j++)addConta(`Empréstimo ${EMP[k].n} – parcela ${j}/${n}`,p,S.simMs+j*30*D,"Empréstimo","Banco do Brasil – Capital de Giro");
 S.empr=S.empr||[];S.empr.push({id,emp:k,v,n,parc:p,tx:i,em:S.simMs});c.hist&&c.hist.unshift({t:S.simMs,x:`🏦 Empréstimo de ${R$(v)} aprovado para ${EMP[k].n} (${n}x ${R$(p)})`});
 log(`🏦 Empréstimo aprovado: ${R$(v)} na conta da ${EMP[k].n} – ${n}x de ${R$(p)}`);toast("Dinheiro na conta!");save();render()};
W.quitarEmp=function(){const ab=(S.contas||[]).filter(c=>!c.pago&&c.cat==="Empréstimo");if(!ab.length)return;const tot=ab.reduce((a,c)=>a+c.v,0)*.92;
 if(!confirm(`Quitar tudo agora por ${R$(tot)} (8% de desconto dos juros futuros)? Sai do caixa do grupo/empresa.`))return;ab.forEach(c=>{c.pago=true;c.forma="Quitação"});S.caixaGrupo-=tot;if(S.fat)S.fat.desp=(S.fat.desp||0)+tot;log(`✅ Empréstimos quitados: ${R$(tot)}`);save();render()};
function card(){const ks=Object.keys(EMP),dv=devendo(),ab=(S.contas||[]).filter(c=>!c.pago&&c.cat==="Empréstimo").length;
 return `<div class="card"><h3>🏦 Pegar empréstimo</h3><p class="muted" style="margin:0 0 8px">Capital de giro: o dinheiro cai na hora na conta da empresa e as parcelas entram em 💳 Contas todo mês. Taxa pelo seu score: <b>${taxa().toFixed(2).replace(".",",")}% a.m.</b> · banco aprova até <b>${R$(Math.max(0,teto()-dv))}</b></p>
 <div class="row" style="gap:8px;flex-wrap:wrap"><select id="eE">${ks.map(k=>`<option value="${k}">${esc(EMP[k].n)}</option>`).join("")}</select>
 <input id="eV" placeholder="Valor (R$)" inputmode="numeric" oninput="simEmp()" style="width:140px">
 <select id="eN" onchange="simEmp()">${[6,12,24,36,48,60].map(n=>`<option ${n===24?"selected":""}>${n}</option>`).join("")}</select> parcelas
 <button class="b g" onclick="pegarEmp()">Pegar empréstimo</button></div><div id="eR" class="muted" style="margin-top:6px"></div>
 ${dv?`<div style="margin-top:8px">Devendo em empréstimos: <b>${R$(dv)}</b> (${ab} parcelas) <button class="b s" onclick="quitarEmp()">Quitar tudo (-8%)</button></div>`:""}</div>`}
function liga(){if(typeof V==="undefined"||!V.credito||V.credito.__v35)return;const o=V.credito;const g=function(){return card()+o.apply(this,arguments)};g.__v35=1;V.credito=g}
let ok=false;setTimeout(()=>{if(!ok){ok=true;liga()}},2500)})();
