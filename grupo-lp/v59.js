// v59: trocar o texto de sugestão/dica do chat pelas suas próprias frases (Config + toque na dica pra editar)
(function(){const W=window;
const PAD="Escreva do seu jeito: valor, forma de pagamento, parcelas, prazo… Para fechar a proposta dele, digite <b>aceito</b>; para encerrar, <b>não</b>.";
const C=()=>{S.v59=S.v59||{dica:null,ph:null,on:true};return S.v59};
const fmt=t=>esc(t).replace(/\*(.+?)\*/g,"<b>$1</b>").replace(/\n/g,"<br>");
function aplica(){if(typeof S==="undefined"||!S)return;const c=C();const inp=document.getElementById("txtMsg");if(!inp)return;
 if(c.ph!=null&&inp.placeholder!==c.ph)inp.placeholder=c.ph;
 const box=inp.closest("div")&&inp.closest("div").parentElement;if(!box)return;
 const d=[...box.querySelectorAll("div.muted")].find(x=>x.dataset.v59||/Escreva do seu jeito/.test(x.textContent));if(!d)return;
 d.dataset.v59=1;d.style.cursor="pointer";d.title="Toque para trocar esta dica";
 const html=c.dica==null?PAD:(c.dica?fmt(c.dica):"");const want=html+' <span style="opacity:.6">✏️</span>';
 if(d.innerHTML!==want)d.innerHTML=want;d.style.display=c.dica===""?"none":"";
 if(!d.__v59){d.__v59=1;d.onclick=()=>{const nv=prompt("Escreva a sua dica (deixe vazio pra esconder; use *palavra* pra negrito):",c.dica==null?"Escreva do seu jeito: valor, forma de pagamento, parcelas, prazo… Para fechar a proposta dele, digite *aceito*; para encerrar, *não*.":c.dica);if(nv===null)return;c.dica=nv;try{save()}catch(e){}aplica()}}}
setInterval(()=>{try{aplica()}catch(e){}},400);
W.v59salva=function(){const c=C();c.dica=document.getElementById("v59d").value;const p=document.getElementById("v59p").value;c.ph=p||null;try{save()}catch(e){}toast("Textos do chat salvos");render()};
W.v59pad=function(){const c=C();c.dica=null;c.ph=null;try{save()}catch(e){}toast("Voltou ao texto original");render()};
setTimeout(()=>{if(typeof V==="undefined"||!V.config)return;const o=V.config;V.config=function(){const c=C();
 return `<div class="card"><h3>✏️ Textos do chat (suas sugestões)</h3><p class="muted" style="font-size:13px">Troque a dica que aparece embaixo da caixa de mensagem pelas suas próprias frases. Use *palavra* pra deixar em negrito. Deixe vazio pra esconder a dica.</p>
 <label style="display:block;margin-top:6px">Dica embaixo da caixa:<textarea id="v59d" rows="3" style="width:100%;margin-top:4px">${esc(c.dica==null?"Escreva do seu jeito: valor, forma de pagamento, parcelas, prazo… Para fechar a proposta dele, digite *aceito*; para encerrar, *não*.":c.dica)}</textarea></label>
 <label style="display:block;margin-top:6px">Texto dentro da caixa (antes de digitar):<input id="v59p" style="width:100%;margin-top:4px" value="${esc(c.ph||"")}" placeholder="Digite sua mensagem..."></label>
 <div class="row" style="gap:8px;margin-top:8px"><button class="b g" onclick="v59salva()">Salvar</button><button class="b s" onclick="v59pad()">Voltar ao original</button></div>
 <p class="muted" style="font-size:12px;margin-top:6px">Dica: no próprio chat, toque na dica (✏️) pra trocar na hora.</p></div>`+o.apply(this,arguments)}},8000);
})();
