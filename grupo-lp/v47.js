// v47: sócios e investidores (vender participação, dividendos, recomprar, comprar concorrente) + telas em cartões no celular
(function(){const W=window,D=864e5;const pk=a=>a[Math.random()*a.length|0],rnd=(a,b)=>a+Math.random()*(b-a);
const INV=["XP Private Equity","Fundo Amazônia Capital","Grupo Rovema","BTG Pactual Investimentos","Sr. Ademir (empresário de Ji-Paraná)","Família Maggi Participações","Vinci Partners","Investidor-anjo Dr. Paulo"];
function P(){if(!S.soc)S.soc={part:{},ofs:[],hist:[],ger:0};return S.soc}
function fatMes(k){return S.lojas.filter(l=>l.emp===k&&!l.encerrada).reduce((a,l)=>a+((l.venda&&l.venda.mes)||0),0)}
function valor(k){const lj=S.lojas.filter(l=>l.emp===k&&!l.encerrada).length;return Math.max(lj*350000,Math.round(fatMes(k)*12*.9/10000)*10000)}
function meu(k){return 100-((P().part[k]||[]).reduce((a,s)=>a+s.pct,0))}
function gera(){const p=P();if(S.simMs-p.ger<3*D&&p.ofs.length)return;p.ger=S.simMs;p.ofs=p.ofs.filter(o=>o.vence>S.simMs);const ks=Object.keys(EMP).filter(k=>meu(k)>51&&S.lojas.some(l=>l.emp===k&&!l.encerrada));
 while(p.ofs.length<3&&ks.length){const k=pk(ks),pct=pk([5,10,15,20,25]);if(meu(k)-pct<51)continue;const v=Math.round(valor(k)*pct/100*rnd(.85,1.2)/1000)*1000;p.ofs.push({id:S.nid++,k,pct,v,inv:pk(INV),vence:S.simMs+rnd(3,7)*D})}}
W.venderPart=function(id){const p=P(),o=p.ofs.find(x=>x.id===id);if(!o)return;if(!confirm(`${o.inv} quer comprar ${o.pct}% da ${EMP[o.k].n} por ${R$(o.v)}.\nVocê recebe o dinheiro agora, mas todo mês paga ${o.pct}% do lucro estimado como dividendos. Você continua com o controle (${meu(o.k)-o.pct}%). Aceitar?`))return;
 S.ecx[o.k]=(S.ecx[o.k]||0)+o.v;(p.part[o.k]=p.part[o.k]||[]).push({nome:o.inv,pct:o.pct,aporte:o.v,desde:S.simMs});p.ofs=p.ofs.filter(x=>x!==o);p.hist.unshift({t:S.simMs,x:`🤝 ${o.inv} comprou ${o.pct}% da ${EMP[o.k].n} por ${R$(o.v)}`});log(p.hist[0].x);save();render()};
W.recomprar=function(k,i){const p=P(),s=(p.part[k]||[])[i];if(!s)return;const v=Math.round(valor(k)*s.pct/100*1.15);if(!confirm(`Recomprar os ${s.pct}% de ${s.nome} na ${EMP[k].n} por ${R$(v)} (valor de mercado + 15%)?`))return;
 S.ecx[k]=(S.ecx[k]||0)-v;p.part[k].splice(i,1);p.hist.unshift({t:S.simMs,x:`🔙 Recomprou ${s.pct}% da ${EMP[k].n} de ${s.nome} por ${R$(v)}`});log(p.hist[0].x);save();render()};
W.comprarRival=function(id){const r=(S.riv||[]).find(x=>x.id===id);if(!r)return;const v=Math.round((180000+r.forca*2.5e6)/1000)*1000;const k=(S.lojas.find(l=>l.cid===r.cid&&!l.encerrada)||{}).emp||Object.keys(EMP)[0];
 if(!confirm(`Comprar o concorrente "${r.n}" de ${r.cid} por ${R$(v)}? Ele fecha, os clientes voltam pra você e suas lojas de lá ganham +5% de vendas por 30 dias.`))return;
 S.ecx[k]=(S.ecx[k]||0)-v;r.fechou=S.simMs;r.comprado=1;S.lojas.filter(l=>l.cid===r.cid&&!l.encerrada).forEach(l=>{l.mkt=l.mkt||[];l.mkt.push({k:"aq",pct:.05,fim:S.simMs+30*D})});
 P().hist.unshift({t:S.simMs,x:`🏢 Comprou o concorrente "${r.n}" de ${r.cid} por ${R$(v)}`});log(P().hist[0].x);toast(`🏢 "${r.n}" agora é seu!`);save();render()};
// dividendos mensais
let mAnt=null;setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.simMs)return;gera();const m=new Date(S.simMs).toISOString().slice(0,7);if(mAnt&&m!==mAnt){const p=P();Object.entries(p.part).forEach(([k,ss])=>{const luc=Math.max(0,fatMes(k)*.08);ss.forEach(s=>{const v=Math.round(luc*s.pct/100);if(v>0){S.ecx[k]=(S.ecx[k]||0)-v;if(S.fat)S.fat.desp=(S.fat.desp||0)+v;log(`💵 Dividendos para ${s.nome} (${s.pct}% da ${EMP[k].n}): ${R$(v)}`)}})})}mAnt=m}catch(e){console.warn(e)}},4000);
function card(){gera();const p=P(),ks=Object.keys(EMP),riv=(S.riv||[]).filter(r=>!r.fechou);
 return `<div class="card"><h3>🤝 Sócios e investidores</h3>
 ${p.ofs.length?`<p class="muted" style="margin:0 0 6px">Propostas de investidores:</p>${p.ofs.map(o=>`<div class="row sb" style="padding:6px 0;border-bottom:1px solid #ffffff12;gap:8px;flex-wrap:wrap"><span><b>${esc(o.inv)}</b> quer <b>${o.pct}%</b> da ${esc(EMP[o.k].n)} por <b style="color:#34d399">${R$(o.v)}</b><br><span class="muted">avaliação da empresa: ${R$(valor(o.k))} · vence ${new Date(o.vence).toLocaleDateString("pt-BR")}</span></span><button class="b g" onclick="venderPart(${o.id})">Aceitar</button></div>`).join("")}`:'<p class="muted">Sem propostas no momento.</p>'}
 <p class="muted" style="margin:10px 0 4px">Quem é dono de quê:</p>${ks.map(k=>`<div style="padding:4px 0"><b>${esc(EMP[k].n)}</b>: você ${meu(k)}%${(p.part[k]||[]).map((s,i)=>` · ${esc(s.nome)} ${s.pct}% <button class="b s" style="padding:2px 8px!important" onclick="recomprar('${k}',${i})">recomprar</button>`).join("")}</div>`).join("")}
 ${riv.length?`<p class="muted" style="margin:10px 0 4px">Comprar concorrente:</p>${riv.map(r=>`<div class="row sb" style="padding:4px 0;gap:8px"><span>🏪 ${esc(r.n)} (${r.cid})</span><button class="b" onclick="comprarRival(${r.id})">Comprar ${R$(Math.round((180000+r.forca*2.5e6)/1000)*1000)}</button></div>`).join("")}`:""}</div>`}
let ok=false;setTimeout(()=>{if(ok)return;ok=true;if(typeof V!=="undefined"&&V.painel){const o=V.painel;V.painel=function(){return o.apply(this,arguments)+card()}}},4000);
// ===== telas em cartões no celular =====
const st=document.createElement("style");st.textContent=`@media(max-width:760px){
.tw{overflow:visible!important}.tw table,.tw tbody{display:block;width:100%}
.tw tr:first-child:has(th){display:none}
.tw tr{display:flex;flex-wrap:wrap;gap:4px 14px;padding:10px 12px;margin:0 0 8px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.025)}
.tw td{display:block;border:0!important;padding:0!important;text-align:left!important;font-size:13px}
.tw td[data-l]::before{content:attr(data-l);display:block;font-size:10px;color:#8b97a6;text-transform:uppercase;letter-spacing:.5px}
.tw td:first-child{flex-basis:100%;font-size:14px}
.tw td select,.tw td input{max-width:100%}
.card .row{flex-wrap:wrap}
button.b{min-height:36px}}`;document.head.appendChild(st);
setInterval(()=>{document.querySelectorAll(".tw table:not([data-lb])").forEach(t=>{t.setAttribute("data-lb",1);const hs=[...t.querySelectorAll("tr:first-child th")].map(h=>h.textContent.trim());if(!hs.length)return;t.querySelectorAll("tr").forEach(tr=>[...tr.children].forEach((td,i)=>{if(td.tagName==="TD"&&hs[i]&&i>0)td.setAttribute("data-l",hs[i])}))})},800);
})();
