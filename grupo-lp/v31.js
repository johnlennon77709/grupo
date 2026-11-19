// v31: avisa quando sai versão nova e atualiza com um toque (sem reinstalar o app)
(function(){let base=null,aviso=false;
async function ver(){try{const t=await (await fetch('sw.js?'+Date.now(),{cache:'no-store'})).text();const m=t.match(/CACHE\s*=\s*'([^']+)'/);return m&&m[1]}catch(e){return null}}
async function checa(){if(aviso)return;const v=await ver();if(!v)return;if(!base){base=v;return}if(v!==base)mostra(v)}
function mostra(v){aviso=true;const b=document.createElement('div');b.id='v31up';b.innerHTML='🔄 <b>Nova versão disponível</b> – toque para atualizar';
 b.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:100000;background:linear-gradient(135deg,#ffd45a,#f5b301 45%,#ff7a00);color:#1a1200;padding:12px 18px;border-radius:14px;font:600 14px Inter,system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.5);cursor:pointer;white-space:nowrap';
 b.onclick=atualiza;document.body.appendChild(b)}
async function atualiza(){const b=document.getElementById('v31up');if(b)b.textContent='Atualizando…';try{if(typeof save==='function')save()}catch(e){}
 try{const r=await navigator.serviceWorker.getRegistration();if(r)await r.update()}catch(e){}
 try{const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}catch(e){}
 setTimeout(()=>location.reload(),1200)}
window.atualizarApp=atualiza;
checa();setInterval(checa,120000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checa()});
})();
