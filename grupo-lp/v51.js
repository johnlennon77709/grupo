// v51: funcionários com IA de verdade (Claude + pesquisa na internet). Chave fica só neste aparelho.
(function(){
const K="lpAIkey",M="lpAImod";
const chave=()=>{try{return localStorage.getItem(K)||""}catch(e){return""}};
const modelo=()=>{try{return localStorage.getItem(M)||"claude-sonnet-5-5"}catch(e){return"claude-sonnet-5-5"}};
const CGx={mot:"Motorista de caminhão",vend:"Vendedor",caixa:"Caixa",ger:"Gerente de loja",mec:"Mecânico",est:"Estoquista",comp:"Comprador",fin:"Financeiro",cob:"Cobrança",adm:"Administrativo",aux:"Auxiliar",sup:"Supervisor",vext:"Vendedor externo"};
const tira=h=>String(h||"").replace(/<[^>]*>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const fmt=t=>esc(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\n/g,"<br>");
function contexto(f){const l=S.lojas[f.loja];const v=(S.frota||[]).find(x=>x.mot===f.id);
 let vg="";if(v){const a=S.fr&&S.fr.ativos&&S.fr.ativos.find(x=>x.v===v.id);if(a){const p=a.par[Math.min(a.i,a.par.length-1)];vg=`Está em viagem com carga (${a.c||""}), próxima parada ${p.c||p.nome}, chegada prevista ${new Date(p.t).toLocaleString("pt-BR")}.`}else vg="Está com o caminhão parado na base."}
 const frota=(S.frota||[]).slice(0,25).map(x=>`${x.mod} ${x.placa||""} (${x.status||""})`).join("; ");
 const lojas=(S.lojas||[]).filter(x=>!x.encerrada).slice(0,30).map(x=>{try{return nomeLoja(x)+" – "+x.cid}catch(e){return x.cid}}).join("; ");
 return `Você é ${f.nome}, ${CGx[f.cargo]||f.cargo} do Grupo LP (empresa de lubrificantes, peças, transporte e veículos, sede em Rondônia), dentro de um jogo simulador de empresas. Quem fala com você é o dono, seu chefe (${S.dono||"chefe"}).
Seus dados: trabalha em ${l?(function(){try{return nomeLoja(l)}catch(e){return l.cid}})()+" ("+l.cid+")":"empresa"}; salário R$ ${f.sal}; moral ${f.moral??70}/100 (abaixo de 40 você está desanimado e pode reclamar; acima de 80 está muito motivado).${v?` Dirige o ${v.mod} placa ${v.placa}. ${vg}`:""}
Data no jogo: ${new Date(S.simMs).toLocaleString("pt-BR")}. Data real hoje: ${new Date().toLocaleDateString("pt-BR")}.
Lojas do grupo: ${lojas}.
Frota: ${frota}.
Como responder: fale como um brasileiro de verdade do Norte, natural, com gírias leves, em português do Brasil, tratando o dono como "chefe" ou "patrão". Você sabe de tudo como uma pessoa bem informada: futebol, caminhões, carros, mecânica, economia, notícias, história. Para qualquer coisa atual (jogos do Flamengo ou outro time, resultados, tabela, escalação, preços, lançamentos de veículos, notícias, clima) USE A PESQUISA NA INTERNET e traga dados reais e completos (placar, gols e autores, data, adversário, próximos jogos etc.). Nunca invente resultado. Pode ter opinião e personalidade própria. Respostas de conversa de WhatsApp: diretas, sem listas enormes, sem citar fontes nem links, no máximo uns 8 parágrafos curtos quando o assunto pedir detalhe.`}
function historico(t){const out=[];(t.msgs||[]).slice(-30).forEach(m=>{const role=m[0]==="eu"?"user":"assistant";const txt=tira(m[1]).trim();if(!txt)return;if(out.length&&out[out.length-1].role===role)out[out.length-1].content+="\n"+txt;else out.push({role,content:txt})});while(out.length&&out[0].role!=="user")out.shift();return out}
async function pergunta(t,f){const body={model:modelo(),max_tokens:1500,system:contexto(f),messages:historico(t),tools:[{type:"web_search_20250305",name:"web_search",max_uses:4}]};
 const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":chave(),"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify(body)});
 const j=await r.json();if(!r.ok)throw new Error((j.error&&j.error.message)||("erro "+r.status));
 return (j.content||[]).filter(c=>c.type==="text").map(c=>c.text).join("").replace(/<\/?cite[^>]*>/g,"").trim()||"…"}
let pronto=false;
function instala(){if(pronto||typeof window.mandaTexto!=="function"||typeof th!=="function")return;pronto=true;const orig=window.mandaTexto;
 window.mandaTexto=function(id){const t=th(id);if(!chave()||!t||t.tipo!=="papo")return orig.apply(this,arguments);
  const f=(S.func||[]).find(x=>x.id===t.fid);const el=document.getElementById("txtMsg");const txt=el&&el.value.trim();if(!f||!txt)return orig.apply(this,arguments);
  const s=txt.toLowerCase();if(t.prop&&/^(aceito|sim|pode|ok|fechado|beleza|claro|nao|não|negado|agora nao)/.test(s))return orig.apply(this,arguments);
  el.value="";msgAdd(t,"eu",esc(txt));t.aguard=true;try{abrirThread(id)}catch(e){render()}
  pergunta(t,f).then(r=>{t.aguard=false;msgAdd(t,"ele",fmt(r));try{save()}catch(e){}try{abrirThread(id)}catch(e){render()}})
   .catch(e=>{t.aguard=false;msgAdd(t,"ele","<i>(IA indisponível: "+esc(e.message)+")</i>");try{abrirThread(id)}catch(x){render()}})}}
const iv=setInterval(()=>{instala();if(pronto)clearInterval(iv)},1000);
window.v51salva=function(){const k=document.getElementById("v51k").value.trim();const m=document.getElementById("v51m").value;try{if(k)localStorage.setItem(K,k);localStorage.setItem(M,m)}catch(e){}toast(k?"IA ligada! Converse com um funcionário.":"Modelo salvo");render()};
window.v51tira=function(){try{localStorage.removeItem(K)}catch(e){}toast("IA desligada");render()};
setTimeout(()=>{if(typeof V==="undefined"||!V.config)return;const o=V.config;V.config=function(){const on=!!chave(),m=modelo();
 return `<div class="card"><h3>🤖 Funcionários inteligentes (IA)</h3><p class="muted" style="font-size:13px">Com a chave da Anthropic, os funcionários respondem qualquer coisa de verdade (futebol, caminhões, notícias…) pesquisando na internet. A chave fica salva só neste aparelho.</p>
 <div style="margin:8px 0">Status: <b style="color:${on?"#22c55e":"#ef4444"}">${on?"LIGADA":"desligada"}</b></div>
 <input id="v51k" type="password" placeholder="${on?"chave já salva (cole outra para trocar)":"cole aqui a API key (sk-ant-...)"}" style="width:100%;max-width:420px">
 <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap"><select id="v51m"><option value="claude-sonnet-5-5" ${m==="claude-sonnet-5-5"?"selected":""}>Sonnet – mais inteligente</option><option value="claude-haiku-5-5" ${m==="claude-haiku-5-5"?"selected":""}>Haiku – mais barato e rápido</option></select>
 <button class="b g" onclick="v51salva()">Salvar</button>${on?'<button class="b s" onclick="v51tira()">Desligar</button>':""}</div></div>`+o.apply(this,arguments)}},7000);
})();
