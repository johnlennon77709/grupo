// v27: visual mais realista (estilo sistema de gestão/ERP): paleta sóbria, tipografia, cards, tabelas, menu e tema claro/escuro
(function(){const W=window;
const css=`
:root{--bg:#0b111b;--pn:#121a27;--pn2:#172131;--ln:#243247;--tx:#e6ebf2;--mu:#8a97ab;--ac:#f2a516;--ok:#1fa463;--bad:#e05252;--blue:#2f7fe0;--rad:10px;--sh:0 1px 2px rgba(0,0,0,.35),0 6px 18px rgba(0,0,0,.18)}
html.claro{--bg:#eef1f5;--pn:#ffffff;--pn2:#f6f8fb;--ln:#dde3ea;--tx:#1b2430;--mu:#66748a;--ac:#d98a00;--ok:#16884f;--bad:#c93c3c;--blue:#1f6fd1;--sh:0 1px 2px rgba(16,24,40,.06),0 4px 12px rgba(16,24,40,.06)}
body{background:var(--bg)!important;color:var(--tx);font-feature-settings:"tnum" 1,"cv11" 1;-webkit-font-smoothing:antialiased;letter-spacing:.1px}
#side{background:linear-gradient(180deg,#0e1622,#0b121c)!important;border-right:1px solid var(--ln)!important}
html.claro #side{background:#14202f!important;--tx:#e6ebf2;--mu:#9aa6b8;color:#e6ebf2}
html.claro #side .brand b,html.claro #side .sidefoot b{color:#fff!important}
html.claro main b,html.claro main strong{color:inherit}
html.claro main [style*="color:#fff"]:not(button),html.claro main [style*="color: #fff"]:not(button){color:var(--tx)!important}
html.claro .pill.g,html.claro [class*=pill]{filter:saturate(1.2) brightness(.85)}
.brand{border-bottom:1px solid rgba(255,255,255,.06);padding-bottom:12px!important}
#nav button{border-radius:8px!important;color:#b7c2d3!important;font-weight:500!important;margin:1px 8px!important;width:calc(100% - 16px)!important;transition:background .15s,color .15s}
#nav button:hover{background:rgba(255,255,255,.05)!important;color:#fff!important}
#nav button.on{background:rgba(242,165,22,.12)!important;color:#fff!important;box-shadow:inset 3px 0 0 var(--ac)!important}
#top{background:color-mix(in srgb,var(--bg) 88%,transparent)!important;backdrop-filter:blur(8px);border-bottom:1px solid var(--ln)!important;position:sticky;top:0;z-index:20}
#top h2{font-weight:700!important;letter-spacing:.2px}
.chip{background:var(--pn)!important;border:1px solid var(--ln)!important;border-radius:8px!important;box-shadow:none!important}
main{max-width:1500px}
.card{background:var(--pn)!important;border:1px solid var(--ln)!important;border-radius:var(--rad)!important;box-shadow:var(--sh)!important;background-image:none!important}
.card h3{font-size:13px!important;text-transform:uppercase;letter-spacing:.6px;color:var(--mu)!important;font-weight:700!important;border-bottom:1px solid var(--ln);padding-bottom:8px;margin-bottom:10px!important}
.kpi{background:var(--pn)!important;border:1px solid var(--ln)!important;border-radius:var(--rad)!important;box-shadow:var(--sh)!important;background-image:none!important}
.kpi::after{opacity:.0!important}
.kpi b{font-weight:800!important;letter-spacing:-.3px}
.kpi span{color:var(--mu)!important;text-transform:uppercase;font-size:11px!important;letter-spacing:.5px}
table{border-collapse:separate!important;border-spacing:0!important}
th{background:var(--pn2)!important;color:var(--mu)!important;font-size:11px!important;text-transform:uppercase;letter-spacing:.5px;font-weight:700!important;border-bottom:1px solid var(--ln)!important;position:sticky;top:0}
th,td{padding:9px 10px!important;border-bottom:1px solid var(--ln)!important}
tbody tr:nth-child(even) td,tr:nth-child(even) td{background:color-mix(in srgb,var(--pn2) 55%,transparent)}
tr:hover td{background:color-mix(in srgb,var(--blue) 10%,transparent)!important}
td{font-variant-numeric:tabular-nums}
.tw{border:1px solid var(--ln);border-radius:8px;overflow:auto}
button.b{border-radius:7px!important;font-weight:600!important;box-shadow:0 1px 0 rgba(0,0,0,.25)!important;background-image:none!important;transition:filter .15s,transform .05s}
button.b:hover{filter:brightness(1.08)}
button.b:active{transform:translateY(1px)}
button.g{background:var(--ok)!important;color:#fff!important}button.r{background:var(--bad)!important;color:#fff!important}
button.bl{background:var(--blue)!important;color:#fff!important}button.s{background:var(--pn2)!important;color:var(--tx)!important;border:1px solid var(--ln)!important}
select,input,textarea{background:var(--pn2)!important;color:var(--tx)!important;border:1px solid var(--ln)!important;border-radius:7px!important}
select:focus,input:focus,textarea:focus{outline:none!important;border-color:var(--blue)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--blue) 25%,transparent)!important}
.pill{border-radius:999px!important;font-weight:700!important;font-size:11px!important;letter-spacing:.2px}
.muted{color:var(--mu)!important}
.mw{background:var(--pn)!important;border:1px solid var(--ln)!important;border-radius:12px!important;box-shadow:0 20px 60px rgba(0,0,0,.45)!important}
#modal{background:rgba(5,9,15,.62)!important;backdrop-filter:blur(3px)}
#toast{border-radius:10px!important;box-shadow:var(--sh)!important}
.log div{border-bottom:1px dashed var(--ln)!important;padding:5px 0!important;font-size:12.5px}
.bars div{border-radius:3px 3px 0 0!important;background:color-mix(in srgb,var(--blue) 70%,#9cc4ff)!important}
.bars div.cur{background:var(--ac)!important}
.seg button.on{background:var(--blue)!important;color:#fff!important}
.tag{border-radius:5px!important;font-weight:700!important}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--ln);border-radius:8px;border:2px solid var(--bg)}::-webkit-scrollbar-track{background:transparent}
#v27rel{font-variant-numeric:tabular-nums;font-weight:700}
@media(max-width:820px){.card{border-radius:8px!important}th,td{padding:7px 8px!important}}
`;
const st=document.createElement("style");st.id="v27css";st.textContent=css;document.head.appendChild(st);
// tema claro/escuro (lembra a escolha neste aparelho)
try{if(localStorage.getItem("lpTema")==="claro")document.documentElement.classList.add("claro")}catch(e){}
W.trocaTema=function(){const c=document.documentElement.classList.toggle("claro");try{localStorage.setItem("lpTema",c?"claro":"escuro")}catch(e){}};
// relógio/data do jogo + botão de tema no topo
function topo(){const t=document.getElementById("top");if(!t||typeof S==="undefined"||!S)return;let b=document.getElementById("v27bar");
 if(!b){b=document.createElement("div");b.id="v27bar";b.style.cssText="display:flex;gap:8px;align-items:center;margin-left:auto";b.innerHTML='<button class="b s" onclick="trocaTema()" title="Tema claro/escuro">🌓</button>';const ch=t.querySelector(".chips");(ch||t).appendChild(b)}
}
setInterval(()=>{try{topo()}catch(e){}},1000);
})();
