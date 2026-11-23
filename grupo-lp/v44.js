// v44: relatório do mês + imprevistos do dia a dia + metas e conquistas
(function(){const W=window,H=36e5;const pk=a=>a[Math.random()*a.length|0],rnd=(a,b)=>a+Math.random()*(b-a);
function caixaTot(){return (S.caixaGrupo||0)+Object.values(S.ecx||{}).reduce((a,b)=>a+b,0)+Object.values(S.lcx||{}).reduce((a,b)=>a+b,0)}
function vm(l){return (l.venda&&l.venda.mes)||0}
// ---------- imprevistos ----------
function emDe(v){const t=S.lojas.find(l=>l.tipo==="transp");return t?t.emp:Object.keys(EMP)[0]}
function paga(k,v,txt){S.ecx[k]=(S.ecx[k]||0)-v;if(S.fat)S.fat.desp=(S.fat.desp||0)+v;aviso("⚠️",txt+` (−${R$(v)})`)}
function aviso(ic,txt){S.imp=S.imp||[];S.imp.unshift({t:S.simMs,x:ic+" "+txt});S.imp=S.imp.slice(0,30);log(ic+" "+txt);toast(ic+" "+txt.slice(0,80))}
const EVENTOS=[
 ()=>{const vs=(S.frota||[]).filter(v=>v.status!=="Garagem"&&v.tipo!=="carro");if(!vs.length)return false;const v=pk(vs);paga(emDe(v),Math.round(rnd(1800,3800)),`Pneu estourou no ${v.mod} ${v.placa} na estrada. Borracheiro e pneu novo`)},
 ()=>{const vs=(S.frota||[]).filter(v=>v.status!=="Garagem"&&v.tipo!=="carro");if(!vs.length)return false;const v=pk(vs);if(Math.random()<.6){aviso("👮",`Fiscalização da PRF parou o ${v.placa}: documentação em ordem, liberado!`)}else paga(emDe(v),Math.round(rnd(1300,5200)),`PRF multou o ${v.placa} por excesso de peso/tacógrafo`)},
 ()=>{const ls=S.lojas.filter(l=>!l.encerrada&&l.tipo!=="transp");if(!ls.length)return false;const l=pk(ls);l.alvoHoje=(l.alvoHoje||0)*1.25;aviso("🌾",`Safra recorde! Movimento forte hoje na ${nomeLoja(l)} (+25% de clientes)`)},
 ()=>{aviso("⛽",`Diesel subiu ${pk(["R$ 0,12","R$ 0,18","R$ 0,25"])} no litro. Fretes ficam mais caros nos próximos dias`)},
 ()=>{const f=S.fr&&S.fr.ativos;if(!f||!f.length)return false;f.forEach(a=>a.par.forEach((p,i)=>{if(i>=a.i)p.t+=12*H}));aviso("✊",`Greve de caminhoneiros na BR-364: viagens em andamento atrasam 12 horas`)},
 ()=>{const rs=(S.rec||[]).filter(r=>!r.pago&&r.v>2000);if(!rs.length)return false;const r=pk(rs);r.calote=1;aviso("💸",`${r.cli} não pagou ${R$(r.v)} e sumiu. Mande a cobrança negociar!`)},
 ()=>{const ls=S.lojas.filter(l=>!l.encerrada&&l.tipo!=="transp");if(!ls.length)return false;const l=pk(ls);paga(l.emp,Math.round(rnd(900,4200)),`Ar-condicionado/compressor quebrou na ${nomeLoja(l)}. Conserto`)},
 ()=>{const ls=S.lojas.filter(l=>!l.encerrada&&l.tipo!=="transp");if(!ls.length)return false;const l=pk(ls);const v=Math.round(rnd(8000,45000));S.ecx[l.emp]=(S.ecx[l.emp]||0)+v;aviso("🤝",`Prefeitura/frota grande fechou compra à vista na ${nomeLoja(l)}: +${R$(v)}`)},
 ()=>{const ls=S.lojas.filter(l=>!l.encerrada&&l.tipo!=="transp");if(!ls.length)return false;const l=pk(ls);if(Math.random()<.5)paga(l.emp,Math.round(rnd(2000,9000)),`Fiscal da Receita/Vigilância autuou a ${nomeLoja(l)}`);else aviso("🧾",`Fiscalização na ${nomeLoja(l)}: tudo regular. Parabéns pela organização!`)},
 ()=>{aviso("🌧️",`Chuva forte em Rondônia: estradas de terra com atoleiro, movimento menor nas lojas do interior hoje`);S.lojas.forEach(l=>{if(!l.encerrada&&l.alvoHoje)l.alvoHoje*=.9})}];
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.simMs)return;if(!S.impT){S.impT=S.simMs;return}if(S.simMs-S.impT<rnd(6,14)*H)return;S.impT=S.simMs;const h=new Date(S.simMs).getHours();if(h<6||h>22)return;
 for(let k=0;k<5;k++){if(pk(EVENTOS)()!==false)break}}catch(e){console.warn(e)}},4000);
// ---------- metas e conquistas ----------
const METAS=[["fat1m","💰 Faturar R$ 1 milhão no mês",()=>S.lojas.reduce((a,l)=>a+vm(l),0)>=1e6],["fat5m","💎 Faturar R$ 5 milhões no mês",()=>S.lojas.reduce((a,l)=>a+vm(l),0)>=5e6],
 ["cx5m","🏦 Ter R$ 5 milhões em caixa",()=>caixaTot()>=5e6],["fro10","🚛 10 veículos na frota",()=>(S.frota||[]).length>=10],["fro25","🚚 25 veículos na frota",()=>(S.frota||[]).length>=25],
 ["lj20","🏬 20 lojas abertas",()=>S.lojas.filter(l=>!l.encerrada).length>=20],["func100","👥 100 funcionários",()=>(S.func||[]).length>=100],
 ["emp5","🏢 5 empresas no grupo",()=>Object.keys(EMP).length>=5],["frete10","🧾 Completar 10 fretes",()=>((S.fr&&S.fr.hist)||[]).filter(h=>/Frete entregue/.test(h.x)).length>=10||(S.conqFr||0)>=10],
 ["cba","📍 Ter loja em Cuiabá",()=>S.lojas.some(l=>!l.encerrada&&l.cid==="Cuiabá")],["sp","🌆 Ter loja fora de RO/MT",()=>S.lojas.some(l=>!l.encerrada&&typeof CID!=="undefined"&&CID[l.cid]&&!["RO","MT"].includes(CID[l.cid].uf))],
 ["semdiv","✅ Fechar o dia sem nenhuma conta no negativo",()=>Object.values(S.ecx||{}).every(v=>v>=0)&&(S.caixaGrupo||0)>=0]];
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.lojas)return;S.conq=S.conq||{};METAS.forEach(([k,n,f])=>{if(!S.conq[k]){let ok=false;try{ok=f()}catch(e){}if(ok){S.conq[k]=S.simMs;toast("🏆 Conquista: "+n);log("🏆 Conquista desbloqueada: "+n)}}})}catch(e){}},5000);
// ---------- relatório ----------
function card(){const d=new Date(S.simMs),mes=d.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});const ls=S.lojas.filter(l=>!l.encerrada&&l.tipo!=="transp");
 const porEmp={};ls.forEach(l=>{const e=porEmp[l.emp]=porEmp[l.emp]||{fat:0,n:0};e.fat+=vm(l);e.n++});
 const rank=ls.slice().sort((a,b)=>vm(b)-vm(a));const tot=ls.reduce((a,l)=>a+vm(l),0);const fh=((S.fr&&S.fr.hist)||[]).filter(h=>/Frete entregue/.test(h.x));
 const recF=fh.reduce((a,h)=>{const m=h.x.match(/recebido R\$\s?([\d.]+)/);return a+(m?+m[1].replace(/\./g,""):0)},0);
 const ok=Object.keys(S.conq||{}).length;
 return `<div class="card"><h3>📊 Relatório de ${mes}</h3>
 <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:8px"><div class="kpi"><small>Faturamento no mês</small><b>${R$(tot)}</b></div><div class="kpi"><small>Caixa total do grupo</small><b style="color:${caixaTot()<0?"#f87171":"inherit"}">${R$(caixaTot())}</b></div><div class="kpi"><small>Fretes entregues</small><b>${fh.length} · ${R$(recF)}</b></div><div class="kpi"><small>Conquistas</small><b>🏆 ${ok}/${METAS.length}</b></div></div>
 <details><summary class="muted">Por empresa e por loja</summary><div class="tw"><table><tr><th>Empresa</th><th>Lojas</th><th>Faturamento mês</th><th>Conta da empresa</th></tr>${Object.entries(porEmp).map(([k,e])=>`<tr><td>${esc((EMP[k]||{}).n||k)}</td><td>${e.n}</td><td>${R$(e.fat)}</td><td style="color:${(S.ecx[k]||0)<0?"#f87171":"#34d399"}">${R$(S.ecx[k]||0)}</td></tr>`).join("")}</table></div>
 <div class="tw"><table><tr><th>#</th><th>Loja</th><th>Faturamento mês</th><th>Caixa da loja</th></tr>${rank.map((l,i)=>`<tr><td>${i+1}</td><td>${i===0?"🥇 ":i===rank.length-1&&rank.length>2?"⚠️ ":""}${esc(nomeLoja(l))}</td><td>${R$(vm(l))}</td><td style="color:${((S.lcx||{})[l.id]||0)<0?"#f87171":"inherit"}">${R$((S.lcx||{})[l.id]||0)}</td></tr>`).join("")}</table></div></details>
 <details><summary class="muted">🏆 Metas e conquistas (${ok}/${METAS.length})</summary>${METAS.map(([k,n])=>`<div style="padding:4px 0;${S.conq&&S.conq[k]?"":"opacity:.55"}">${S.conq&&S.conq[k]?"✅":"⬜"} ${n}${S.conq&&S.conq[k]?` <span class="muted">– ${new Date(S.conq[k]).toLocaleDateString("pt-BR")}</span>`:""}</div>`).join("")}</details>
 ${(S.imp||[]).length?`<details><summary class="muted">⚠️ Imprevistos recentes (${S.imp.length})</summary>${S.imp.slice(0,12).map(e=>`<div class="muted" style="font-size:12px;padding:3px 0">${new Date(e.t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})} · ${esc(e.x)}</div>`).join("")}</details>`:""}</div>`}
let ok=false;setTimeout(()=>{if(ok)return;ok=true;if(typeof V!=="undefined"&&V.painel){const o=V.painel;V.painel=function(){return card()+o.apply(this,arguments)}}},3400);
})();
