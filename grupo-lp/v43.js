// v43: backup automático do progresso (1 por dia + a cada 30 min, guarda 10) + restaurar e baixar arquivo
(function(){const W=window,K="grupoLP_bk",API=(location.hostname.endsWith("freebuff.page")?"":"https://site-c1c35292136b4c749aabc6d8924009aa.freebuff.page")+"/api/sync";
function lista(){try{return JSON.parse(localStorage.getItem(K+"_idx")||"[]")}catch(e){return[]}}
function guarda(motivo){try{if(typeof S==="undefined"||!S||!S.lojas||S.lojas.length<2)return;const d=JSON.stringify(S),id="b"+Date.now();let ix=lista();
 const resumo={id,t:Date.now(),sim:S.simMs,lojas:S.lojas.length,frota:(S.frota||[]).length,caixa:Math.round((S.caixaGrupo||0)+Object.values(S.ecx||{}).reduce((a,b)=>a+b,0)),m:motivo};
 for(;;){try{localStorage.setItem(K+"_"+id,d);break}catch(e){if(!ix.length)return;const v=ix.shift();localStorage.removeItem(K+"_"+v.id)}}
 ix.push(resumo);while(ix.length>10){const v=ix.shift();localStorage.removeItem(K+"_"+v.id)}localStorage.setItem(K+"_idx",JSON.stringify(ix))}catch(e){console.warn(e)}}
let ultDia=null;setInterval(()=>{const ix=lista(),last=ix[ix.length-1],dia=new Date().toDateString();if(!last||Date.now()-last.t>30*60000||ultDia!==dia){ultDia=dia;guarda(last?"automático":"primeiro backup")}},60000);
setTimeout(()=>guarda("ao abrir o jogo"),20000);
W.restaurarBk=async function(id){const d=localStorage.getItem(K+"_"+id);if(!d)return alert("Backup não encontrado.");const r=lista().find(x=>x.id===id);
 if(!confirm(`Restaurar o backup de ${new Date(r.t).toLocaleString("pt-BR")}?\nO jogo volta exatamente para aquele momento (o progresso depois disso é substituído). Antes, salvo um backup do jeito que está agora.`))return;
 guarda("antes de restaurar");try{await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({codigo:"LPGRUPOLP01",dev:"restauracao-"+Date.now(),since:0,ver:Date.now(),data:JSON.parse(d)})})}catch(e){}
 localStorage.setItem("grupoLP4",d);toast("Backup restaurado! Recarregando…");setTimeout(()=>location.reload(),1200)};
W.baixarBk=function(id){const d=id?localStorage.getItem(K+"_"+id):JSON.stringify(S);const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([d],{type:"application/json"}));a.download=`grupo-lp-backup-${new Date().toISOString().slice(0,16).replace(/[:T]/g,"-")}.json`;a.click()};
W.importarBk=function(inp){const f=inp.files[0];if(!f)return;const rd=new FileReader();rd.onload=async()=>{try{const o=JSON.parse(rd.result);if(!o.lojas)throw 0;const id="b"+Date.now();localStorage.setItem(K+"_"+id,rd.result);const ix=lista();ix.push({id,t:Date.now(),sim:o.simMs,lojas:o.lojas.length,frota:(o.frota||[]).length,caixa:0,m:"arquivo importado"});localStorage.setItem(K+"_idx",JSON.stringify(ix));restaurarBk(id)}catch(e){alert("Arquivo inválido.")}};rd.readAsText(f)};
W.telaBk=function(){const ix=lista().slice().reverse();modal(`<h2 style="margin-top:0">💾 Backups do jogo</h2><p class="muted">O jogo guarda sozinho uma cópia a cada 30 minutos e todo dia (as 10 mais recentes, neste aparelho). Se algo der errado, é só restaurar.</p>
 <div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:10px"><button class="b g" onclick="guardaBk();telaBk()">Fazer backup agora</button><button class="b s" onclick="baixarBk()">⬇️ Baixar arquivo do jogo atual</button><label class="b s" style="cursor:pointer">📂 Importar arquivo<input type="file" accept=".json" style="display:none" onchange="importarBk(this)"></label></div>
 ${ix.length?`<div class="tw"><table><tr><th>Quando</th><th>Data no jogo</th><th>Lojas</th><th>Frota</th><th></th></tr>${ix.map(b=>`<tr><td>${new Date(b.t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}<br><span class="muted">${esc(b.m||"")}</span></td><td>${b.sim?new Date(b.sim).toLocaleDateString("pt-BR"):"-"}</td><td>${b.lojas}</td><td>${b.frota}</td><td><button class="b" onclick="restaurarBk('${b.id}')">Restaurar</button> <button class="b s" onclick="baixarBk('${b.id}')">⬇️</button></td></tr>`).join("")}</table></div>`:'<p class="muted">Ainda não há backups. O primeiro é feito em instantes.</p>'}
 <div style="margin-top:10px;text-align:right"><button class="b s" onclick="fecha()">Fechar</button></div>`)};
W.guardaBk=()=>guarda("manual");
// botão 💾 na barra de cima
function botao(){const c=document.querySelector("#top .chips");if(c&&!document.getElementById("v43b")){const b=document.createElement("button");b.id="v43b";b.className="b s";b.title="Backups";b.textContent="💾";b.style.cssText="width:auto;margin-left:6px";b.onclick=telaBk;c.appendChild(b)}}
setInterval(botao,1500);
})();
