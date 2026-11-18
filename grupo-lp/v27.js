// v27: visual premium "lubrificantes automotivos" – slim, moderno, preto grafite + âmbar/ouro do óleo, detalhes metálicos e faixa de corrida
(function(){const W=window;
const css=`
:root{--bg:#07090c;--pn:#0f1318;--pn2:#141a21;--ln:#1f2730;--ln2:#2a3540;--tx:#e9edf2;--mu:#8792a0;--ac:#f5b301;--ac2:#ff7a00;--ok:#22c55e;--bad:#ef4444;--blue:#38a3ff;--rad:14px;
 --gold:linear-gradient(135deg,#ffd45a 0%,#f5b301 40%,#ff7a00 100%);--metal:linear-gradient(180deg,#1a2129 0%,#0f1419 100%);--sh:0 1px 0 rgba(255,255,255,.03) inset,0 10px 30px rgba(0,0,0,.35)}
html.claro{--bg:#f3f4f6;--pn:#ffffff;--pn2:#f8f9fb;--ln:#e5e7eb;--ln2:#d6dae0;--tx:#111418;--mu:#6b7280;--metal:linear-gradient(180deg,#ffffff,#f7f8fa);--sh:0 1px 2px rgba(17,20,24,.05),0 8px 24px rgba(17,20,24,.06)}
*{scrollbar-width:thin;scrollbar-color:var(--ln2) transparent}
body{background:radial-gradient(1200px 600px at 85% -10%,rgba(245,179,1,.07),transparent 60%),radial-gradient(900px 500px at -10% 110%,rgba(255,122,0,.05),transparent 60%),var(--bg)!important;color:var(--tx);font-family:Inter,system-ui,sans-serif!important;font-weight:400;font-feature-settings:"tnum" 1,"cv11" 1;-webkit-font-smoothing:antialiased}
html.claro body{background:var(--bg)!important}
h1,h2,h3,.kpi b,#top h2,.brand b{font-family:Rajdhani,Inter,sans-serif!important;letter-spacing:.3px}
/* ---------- barra lateral ---------- */
#side{background:#05070a!important;border-right:1px solid var(--ln)!important;border-top:3px solid #f5b301!important;box-sizing:border-box}
html.claro #side{background:#0b0e12!important;--tx:#e9edf2;--mu:#8792a0;color:#e9edf2}
.brand{padding:18px 16px 16px!important;border-bottom:1px solid rgba(255,255,255,.06)}
.brand b{font-size:20px!important;font-weight:700!important;background:var(--gold);-webkit-background-clip:text;background-clip:text;color:transparent!important;text-transform:uppercase}
.brand span{color:#6f7a87!important;font-size:10px!important;letter-spacing:1.4px;text-transform:uppercase}
.brand img{border-radius:10px!important;box-shadow:0 0 0 1px rgba(245,179,1,.35),0 6px 16px rgba(245,179,1,.15)}
#nav{padding-top:8px}
#nav button{border-radius:10px!important;color:#9aa4b1!important;font-weight:500!important;font-size:13.5px!important;margin:2px 10px!important;width:calc(100% - 20px)!important;padding:9px 12px!important;transition:all .18s ease;border:1px solid transparent!important}
#nav button i{filter:grayscale(.35) saturate(.9);transition:filter .18s}
#nav button:hover{background:rgba(255,255,255,.035)!important;color:#fff!important}
#nav button:hover i{filter:none}
#nav button.on{background:linear-gradient(90deg,rgba(245,179,1,.16),rgba(245,179,1,.02))!important;color:#fff!important;border-color:rgba(245,179,1,.22)!important;box-shadow:inset 3px 0 0 var(--ac)!important}
#nav button.on i{filter:none}
.sidefoot{border-top:1px solid rgba(255,255,255,.06)!important;color:#6f7a87!important;font-size:11.5px!important}
/* ---------- topo ---------- */
#top{background:color-mix(in srgb,var(--bg) 78%,transparent)!important;backdrop-filter:blur(14px) saturate(1.2);border-bottom:1px solid var(--ln)!important;position:sticky;top:0;z-index:20;padding-top:14px!important;padding-bottom:14px!important}
#top h2{font-size:24px!important;font-weight:700!important;text-transform:uppercase;letter-spacing:1px!important}
#top h2::after{content:"";display:block;width:34px;height:3px;border-radius:3px;background:var(--gold);margin-top:4px}
.chip{background:var(--pn)!important;border:1px solid var(--ln)!important;border-radius:12px!important;box-shadow:none!important;padding:6px 12px!important}
.chip small{color:var(--mu)!important;letter-spacing:.8px;font-size:9.5px!important;text-transform:uppercase}
/* ---------- conteúdo ---------- */
main{max-width:1480px;padding-top:18px!important}
.grid{gap:14px!important}
.card{background:var(--metal)!important;border:1px solid var(--ln)!important;border-radius:var(--rad)!important;box-shadow:var(--sh)!important;padding:18px!important;position:relative;overflow:hidden}
.card h3{font-family:Inter,sans-serif!important;font-size:11.5px!important;text-transform:uppercase;letter-spacing:1.2px;color:var(--mu)!important;font-weight:600!important;margin:0 0 14px!important;padding-left:10px!important;border-left:3px solid var(--ac)}
.kpis{gap:12px!important}
.kpi{background:var(--metal)!important;border:1px solid var(--ln)!important;border-radius:var(--rad)!important;box-shadow:var(--sh)!important;padding:14px 16px!important;position:relative;overflow:hidden;transition:transform .18s,border-color .18s}
.kpi:hover{transform:translateY(-2px);border-color:rgba(245,179,1,.35)!important}
.kpi::after{content:""!important;position:absolute!important;inset:auto 0 0 0!important;height:2px!important;background:var(--gold)!important;opacity:.0!important;transition:opacity .18s;border-radius:0!important;width:auto!important}
.kpi:hover::after{opacity:.9!important}
.kpi b{font-size:21px!important;white-space:nowrap;font-weight:700!important;letter-spacing:.2px}
.kpi span{color:var(--mu)!important;text-transform:uppercase;font-size:10.5px!important;letter-spacing:1px;font-weight:600}
.kpi em{color:var(--mu)!important;font-style:normal}
.up{color:#34d399!important}.dn{color:#f87171!important}
/* destaque principal (faturamento do grupo) */
main>.card:first-of-type b,main .card [style*="font-size:4"],main .card [style*="font-size: 4"]{font-family:Rajdhani,Inter,sans-serif!important}
/* ---------- tabelas ---------- */
.tw{border:1px solid var(--ln);border-radius:12px;overflow:auto;background:var(--pn)}
table{border-collapse:separate!important;border-spacing:0!important;font-size:13px}
th{background:var(--pn2)!important;color:var(--mu)!important;font-size:10.5px!important;text-transform:uppercase;letter-spacing:1px;font-weight:600!important;border-bottom:1px solid var(--ln)!important;position:sticky;top:0;z-index:1}
th,td{padding:10px 12px!important;border-bottom:1px solid var(--ln)!important}
tr:last-child td{border-bottom:none!important}
tr:hover td{background:rgba(245,179,1,.05)!important}
td{font-variant-numeric:tabular-nums}
/* ---------- botões e campos ---------- */
button.b{border-radius:10px!important;font-weight:600!important;font-size:13px!important;letter-spacing:.2px;padding:8px 14px!important;box-shadow:none!important;background-image:none!important;border:1px solid transparent!important;transition:all .16s ease}
button.b:hover{transform:translateY(-1px);filter:brightness(1.08)}
button.b:active{transform:translateY(0)}
button.g{background:var(--gold)!important;color:#1a1200!important;box-shadow:0 6px 18px rgba(245,179,1,.22)!important}
button.r{background:transparent!important;color:#f87171!important;border-color:rgba(239,68,68,.45)!important}
button.r:hover{background:rgba(239,68,68,.1)!important}
button.bl{background:#1d2a38!important;color:#cfe6ff!important;border-color:#2b4157!important}
html.claro button.bl{background:#e8f2ff!important;color:#0f4a8a!important;border-color:#bcd7f5!important}
button.s{background:transparent!important;color:var(--tx)!important;border-color:var(--ln2)!important}
button.s:hover{background:rgba(255,255,255,.04)!important}
select,input,textarea{background:var(--pn2)!important;color:var(--tx)!important;border:1px solid var(--ln2)!important;border-radius:10px!important;padding:8px 10px!important}
select:focus,input:focus,textarea:focus{outline:none!important;border-color:var(--ac)!important;box-shadow:0 0 0 3px rgba(245,179,1,.18)!important}
/* ---------- etiquetas ---------- */
.pill{border-radius:999px!important;font-weight:600!important;font-size:10.5px!important;letter-spacing:.4px;padding:3px 9px!important;border:1px solid currentColor;background:transparent!important}
.pill.g{color:#34d399!important}.pill.r{color:#f87171!important}.pill.y{color:#fbbf24!important}.pill.b{color:#60a5fa!important}
.tag{border-radius:6px!important;font-weight:600!important;letter-spacing:.3px}
.muted{color:var(--mu)!important}
/* ---------- janelas, avisos, log ---------- */
#modal{background:rgba(3,5,8,.7)!important;backdrop-filter:blur(6px)}
.mw{background:var(--pn)!important;border:1px solid var(--ln2)!important;border-radius:18px!important;box-shadow:0 30px 80px rgba(0,0,0,.6)!important;position:relative;overflow:hidden}
.mw::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--gold)}
.mw h2{font-family:Rajdhani,Inter,sans-serif!important;text-transform:uppercase;letter-spacing:.8px}
#toast{border-radius:12px!important;background:#11161c!important;border:1px solid rgba(245,179,1,.35)!important;box-shadow:0 12px 30px rgba(0,0,0,.45)!important;color:#fff!important}
.log div{border-bottom:1px solid var(--ln)!important;padding:7px 0!important;font-size:12.5px;color:var(--tx)}
.msg.eu{background:linear-gradient(135deg,#f5b301,#ff8a00)!important;color:#1a1200!important}
.msg.ele{background:var(--pn2)!important;border:1px solid var(--ln)!important}
/* ---------- gráficos ---------- */
.bars div{border-radius:4px 4px 0 0!important;background:linear-gradient(180deg,#5a6675,#2b333d)!important}
.bars div.cur{background:var(--gold)!important;box-shadow:0 0 14px rgba(245,179,1,.35)}
.seg{background:var(--pn2)!important;border:1px solid var(--ln)!important;border-radius:10px!important;padding:3px!important}
.seg button{border-radius:8px!important}
.seg button.on{background:var(--gold)!important;color:#1a1200!important}
/* tema claro: textos que eram brancos fixos */
html.claro main b,html.claro main strong{color:inherit}
html.claro main [style*="color:#fff"]:not(button),html.claro main [style*="color: #fff"]:not(button){color:var(--tx)!important}
html.claro .bars div{background:linear-gradient(180deg,#9aa4b1,#c9ced6)!important}
::-webkit-scrollbar{width:9px;height:9px}::-webkit-scrollbar-thumb{background:var(--ln2);border-radius:9px;border:2px solid var(--bg)}::-webkit-scrollbar-track{background:transparent}
@media(max-width:820px){.card{padding:14px!important;border-radius:12px!important}#top h2{font-size:19px!important}.kpi b{font-size:20px!important}th,td{padding:8px 9px!important}}
`;
try{if(!document.getElementById("v27font")){const l=document.createElement("link");l.id="v27font";l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap";document.head.appendChild(l)}}catch(e){}
const old=document.getElementById("v27css");if(old)old.remove();
const st=document.createElement("style");st.id="v27css";st.textContent=css;document.head.appendChild(st);
try{if(localStorage.getItem("lpTema")==="claro")document.documentElement.classList.add("claro")}catch(e){}
W.trocaTema=function(){const c=document.documentElement.classList.toggle("claro");try{localStorage.setItem("lpTema",c?"claro":"escuro")}catch(e){}};
function topo(){const t=document.getElementById("top");if(!t)return;if(document.getElementById("v27bar"))return;
 const b=document.createElement("div");b.id="v27bar";b.style.cssText="display:flex;gap:8px;align-items:center;margin-left:8px";
 b.innerHTML='<button class="b s" onclick="trocaTema()" title="Tema claro/escuro" style="padding:7px 10px!important">🌓</button>';(t.querySelector(".chips")||t).appendChild(b)}
setInterval(()=>{try{topo()}catch(e){}},1000);
})();
