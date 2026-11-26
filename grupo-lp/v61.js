// v61: ticket médio por vendedor (quem vende mais por cliente)
(function(){const W=window;
const nl=id=>{const l=S.lojas[id];try{return l?nomeLoja(l):"?"}catch(e){return l?l.cid:"?"}};
const CG={vend:"Vendedor",caixa:"Caixa",ger:"Gerente",vext:"Vendedor externo"};
function X(){S.v61=S.v61||{};const x=S.v61;const d=new Date(S.simMs),mk=d.getFullYear()*12+d.getMonth();if(x.mk!==mk){if(x.v&&Object.keys(x.v).length)x.ant=x.v;x.v={};x.mk=mk}return x}
const hab=f=>{const s=(f.id*9301+49297)%233280/233280;return .75+s*.5};// "jeito" de vender de cada um (fixo)
const oV=W.venda;if(oV&&!oV.__v61){W.venda=function(l){const a=l&&l.venda?+l.venda.dia||0:0;const r=oV.apply(this,arguments);
 try{if(l&&l.venda){const d=(+l.venda.dia||0)-a;if(d>0){const fs=(S.func||[]).filter(f=>f.loja===l.id&&["vend","caixa","ger"].includes(f.cargo));if(fs.length){
  const pesos=fs.map(f=>(f.cargo==="vend"?3:f.cargo==="caixa"?2:1)*((f.moral??70)/70+.3));let t=pesos.reduce((a,b)=>a+b,0)*Math.random(),i=0;while(i<fs.length-1&&(t-=pesos[i])>0)i++;const f=fs[i];
  const x=X();const e=x.v[f.id]=x.v[f.id]||{n:0,t:0};e.n++;e.t+=d*hab(f)*(1+((f.moral??70)-70)/400);}}}}catch(e){}return r};W.venda.__v61=1}
W.v61prem=function(fid){try{v55prem(fid)}catch(e){toast("Prêmio indisponível")}};
function card(){const x=X();const fonte=Object.keys(x.v).length?x.v:(x.ant||{});const rows=Object.entries(fonte).map(([id,e])=>({f:(S.func||[]).find(z=>z.id===+id),...e})).filter(z=>z.f&&z.n>=3).map(z=>({...z,tk:z.t/z.n}));
 const media=rows.length?rows.reduce((a,z)=>a+z.t,0)/rows.reduce((a,z)=>a+z.n,0):0;rows.sort((a,b)=>b.tk-a.tk);
 return `<div class="card"><h3>🧾 Ticket médio por vendedor ${Object.keys(x.v).length?"(este mês)":"(mês passado)"}</h3><p class="muted" style="font-size:12px">Quanto cada um vende, em média, por cliente atendido. Média do grupo: <b>${R$(media)}</b>. Verde = acima da média; vermelho = abaixo (precisa de treinamento ou motivação).</p>
 ${rows.length?`<div class="tw" style="max-height:420px;overflow:auto"><table><tr><th>#</th><th>Vendedor</th><th>Loja</th><th>Atendimentos</th><th>Total vendido</th><th>Ticket médio</th><th></th></tr>${rows.map((z,i)=>`<tr><td>${i<3?["🥇","🥈","🥉"][i]:i+1}</td><td>${esc(z.f.nome)} <span class="muted" style="font-size:11px">${CG[z.f.cargo]||""}</span></td><td class="muted">${esc(nl(z.f.loja))}</td><td>${z.n}</td><td>${R$(z.t)}</td><td style="font-weight:700;color:${z.tk>=media?"#22c55e":"#ef4444"}">${R$(z.tk)}</td><td>${typeof v55prem==="function"?`<button class="b s" onclick="v61prem(${z.f.id})">Prêmio</button>`:""}</td></tr>`).join("")}</table></div>`:`<p class="muted">Contando os atendimentos… aparece assim que cada vendedor atender pelo menos 3 clientes.</p>`}</div>`}
let inst=false;function instala(){if(inst||typeof V==="undefined"||!V.equipe)return;inst=true;const o=V.equipe;V.equipe=function(){const a=o.apply(this,arguments);let c="";try{c=card()}catch(e){console.warn(e)}return c+a};try{render()}catch(e){}}
setTimeout(instala,13500);
})();
