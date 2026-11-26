// v63: mercadoria fica nos CDs (Cacoal / Cuiabá / depósito Porto Velho) e VOCÊ manda o caminhão buscar e entregar.
// Carga pro Acre para em Porto Velho e você decide: seguir pra Rio Branco ou deixar no depósito de Porto Velho.
(function(){const W=window,H=36e5,D=24*H;
const A=()=>W.v52api;const sv=()=>{try{save()}catch(e){}try{render()}catch(e){}};
const uf=c=>{try{return CID[c].uf}catch(e){return"RO"}};
const hm=t=>new Date(t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
function prep(){const a=A();if(!a)return null;a.CDN.pv="Depósito Porto Velho";a.CDC.pv="Porto Velho";const g=a.G();g.cd.pv=g.cd.pv||[];return a}
const KEY=cd=>"v63s_"+cd;
W.v63tog=function(cd,id,el){W[KEY(cd)]=W[KEY(cd)]||{};W[KEY(cd)][id]=!el.checked};
W.v63envia=function(cd){const a=prep();if(!a)return;const g=a.G();const q=g.cd[cd]||[];const off=W[KEY(cd)]||{};const vid=+document.getElementById("v63v_"+cd).value;const v=S.frota.find(z=>z.id===vid);
 if(!v||v.status!=="Garagem")return toast("Escolha um caminhão livre");const sel=q.filter(p=>!off[p.loja]);if(!sel.length)return toast("Marque pelo menos uma loja");
 g.cd[cd]=q.filter(p=>off[p.loja]);const b=a.base();const st=[];const orig=a.CDC[cd];
 st.push({tipo:"pega",nome:a.CDN[cd]+" (carregar)",cid:orig,par:1});
 const ls=[...new Set(sel.map(p=>p.loja))].map(i=>S.lojas[i]).filter(Boolean);const acre=ls.filter(l=>uf(l.cid)==="AC"),resto=ls.filter(l=>uf(l.cid)!=="AC");
 a.ordem(orig,resto,l=>l.cid).forEach(l=>st.push({tipo:"loja",loja:l.id,nome:a.nl(l.id),cid:l.cid,par:.6}));
 if(acre.length){if(cd!=="pv")st.push({tipo:"decide",nome:"Porto Velho (decidir carga do Acre)",cid:"Porto Velho",par:.3});a.ordem("Porto Velho",acre,l=>l.cid).forEach(l=>st.push({tipo:"loja",loja:l.id,nome:a.nl(l.id),cid:l.cid,par:.8}))}
 st.push({tipo:"fim",nome:"Base "+b,cid:b,par:0});
 const r={id:S.nid++,k:"dist",cd,v:v.id,carga:sel,par:a.monta(st,b),i:0,c:"buscar no "+a.CDN[cd]+" e entregar"};g.rotas.push(r);v.status="Entregando";delete W[KEY(cd)];
 a.H_(`🚚 Você mandou o ${v.mod} ${v.placa} buscar no ${a.CDN[cd]}: ${ls.map(l=>a.nl(l.id)).join(" → ")}${acre.length&&cd!=="pv"?" (para em Porto Velho antes do Acre)":""}`);sv()};
function refaz(r,a,ini,from){const rest=r.par.slice(from);let t=S.simMs,cur=ini;r.par=r.par.slice(0,from).concat(rest.map(s=>{const d=a.km(cur,s.cid);t+=(d<=600?d/65:d/65*2.4)*H;const o=Object.assign({},s,{t,km:d});t+=(s.par||.6)*H;cur=s.cid;return o}))}
W.v63dec=function(rid,op){const a=prep();if(!a)return;const g=a.G();const r=g.rotas.find(z=>z.id===rid);if(!r||!r.pausa)return;const v=S.frota.find(z=>z.id===r.v);
 if(op==="segue"){a.H_(`➡️ ${v?v.placa:""} seguiu de Porto Velho para o Acre`)}
 else{const ps=r.carga.filter(p=>!p.ok&&S.lojas[p.loja]&&uf(S.lojas[p.loja].cid)==="AC");ps.forEach(p=>{p.ok=1;const c=Object.assign({},p);delete c.ok;c.noCD=S.simMs;g.cd.pv.push(c)});
  r.par=r.par.filter((s,i)=>i<=r.i||!(s.tipo==="loja"&&uf(s.cid)==="AC"));a.H_(`🏬 ${v?v.placa:""} deixou ${ps.length} pedido(s) do Acre no Depósito Porto Velho`)}
 r.pausa=0;r.i++;refaz(r,a,"Porto Velho",r.i);sv()};
function card(){const a=prep();if(!a)return"";const g=a.G();const livres=a.livres();
 const pend=Object.keys(g.cd).filter(k=>g.cd[k].length);const paus=g.rotas.filter(r=>r.pausa);
 let h=`<div class="card" style="border:1px solid #f5b30155"><h3>📦 Mercadoria nos CDs esperando caminhão</h3><p class="muted" style="font-size:12px">O caminhão da coleta deixa tudo nos CDs (MT → Cuiabá, RO e Acre → Cacoal). Você escolhe quais lojas e qual caminhão vai buscar. Carga pro Acre sempre para em Porto Velho pra você decidir.</p>`;
 paus.forEach(r=>{const v=S.frota.find(z=>z.id===r.v);const ac=r.carga.filter(p=>!p.ok&&S.lojas[p.loja]&&uf(S.lojas[p.loja].cid)==="AC");h+=`<div style="padding:10px;margin:8px 0;border-radius:10px;background:#f5b30122">⏸️ <b>${v?esc(v.mod)+" "+v.placa:""}</b> está em <b>Porto Velho</b> com ${ac.length} pedido(s) pra ${[...new Set(ac.map(p=>a.nl(p.loja)))].map(esc).join(", ")} (${R$(ac.reduce((s,p)=>s+(p.tot||0),0))}). O que fazer?<div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap"><button class="b g" onclick="v63dec(${r.id},'segue')">Seguir pra Rio Branco</button><button class="b s" onclick="v63dec(${r.id},'deixa')">Deixar no depósito de Porto Velho</button></div></div>`});
 if(!pend.length)h+=`<p class="muted">Nenhuma mercadoria parada nos CDs agora.</p>`;
 pend.forEach(k=>{const q=g.cd[k];const por={};q.forEach(p=>{por[p.loja]=por[p.loja]||{n:0,v:0,desde:p.noCD||S.simMs};por[p.loja].n++;por[p.loja].v+=p.tot||0});const off=W[KEY(k)]||{};
  h+=`<div style="padding:10px 0;border-top:1px solid #ffffff14"><b>🏬 ${esc(a.CDN[k]||k)}</b> – ${q.length} pedido(s), ${R$(q.reduce((s,p)=>s+(p.tot||0),0))}
  ${Object.entries(por).map(([id,o])=>`<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" ${off[id]?"":"checked"} onchange="v63tog('${k}',${id},this)"> Mercadoria para <b>${esc(a.nl(+id))}</b> · ${o.n} pedido(s) · ${R$(o.v)} <span class="muted" style="font-size:11px">desde ${hm(o.desde)}</span></label>`).join("")}
  <div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap"><select id="v63v_${k}">${livres.length?livres.map(v=>`<option value="${v.id}">${esc(v.mod)} ${v.placa}</option>`).join(""):`<option value="">Nenhum caminhão livre</option>`}</select><button class="b g" onclick="v63envia('${k}')" ${livres.length?"":"disabled"}>🚚 Mandar buscar e entregar</button></div></div>`});
 return h+`</div>`}
let inst=false;function instala(){if(inst||typeof V==="undefined"||!V.frota||!A())return;inst=true;const o=V.frota;V.frota=function(){const x=o.apply(this,arguments);let c="";try{c=card()}catch(e){console.warn(e)}return c+x};try{render()}catch(e){}}
let avis={};setInterval(()=>{try{instala();const a=prep();if(!a)return;const g=a.G();Object.keys(g.cd).forEach(k=>{const n=g.cd[k].length;if(n>(avis[k]||0)){try{log(`📦 Chegou mercadoria no ${a.CDN[k]}: ${n} pedido(s) esperando você mandar um caminhão`)}catch(e){}}avis[k]=n})}catch(e){}},2000);
})();
