// v8b: organiza o formulário "Buscar mercadoria nas fábricas" na Frota
(function(){
const st=document.createElement("style");
st.textContent=`
.colbox{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;margin-top:10px!important}
@media(min-width:760px){.colbox{grid-template-columns:1fr 1fr!important}}
.colbox label{display:flex!important;flex-direction:column!important;gap:4px;font-weight:700;font-size:13px;padding:10px;border:1px solid #2a3350;border-radius:10px;background:rgba(255,255,255,.03)}
.colbox select{width:100%!important;min-height:38px;font-size:14px;padding:6px 8px;border-radius:8px}
#cP{display:block;padding:10px;border-radius:10px;background:rgba(59,130,246,.08);border:1px dashed #3b82f6;line-height:1.6}
.colbtn{width:100%;min-height:44px;font-size:15px;margin-top:4px}
.cdbox{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.cdbox select{width:100%;min-height:36px}
`;document.head.appendChild(st);
function arruma(){const f=document.getElementById("cF");if(!f)return;const g=f.closest("div[style*='grid']");if(g&&!g.classList.contains("colbox")){g.removeAttribute("style");g.classList.add("colbox");
 const ic={cF:"🏭",cV:"🚛",cI:"🔗",cM:"👷",cG:"💳"};g.querySelectorAll("label").forEach(l=>{const s=l.querySelector("select");if(s&&ic[s.id]&&!l.dataset.ok){l.dataset.ok=1;l.firstChild.textContent=ic[s.id]+" "+l.firstChild.textContent}})}
 const b=[...document.querySelectorAll("button")].find(x=>/Mandar buscar/.test(x.textContent));if(b)b.classList.add("colbtn");
 const cd=document.getElementById("cdL");if(cd&&!cd.parentElement.classList.contains("cdbox"))cd.parentElement.classList.add("cdbox")}
new MutationObserver(arruma).observe(document.body,{childList:true,subtree:true});arruma();
})();
