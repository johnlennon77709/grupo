// v9b: negociar prazo de entrega menor nos chats
(function(){
const W=window,N=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
function pedePrazo(t,txt){const s=N(txt);if(!t.prazo)return null;
 if(!/(entrega|prazo|chegar|chega|antecip|mais rapido|mais cedo|urgente|pressa|adiant)/.test(s))return null;
 if(!/(menor|diminu|reduz|antecip|mais rapido|mais cedo|urgente|pressa|adiant|em \d+|ate \d+|\d+ dias)/.test(s))return null;
 t.prazoOrig=t.prazoOrig||t.prazo;const minimo=Math.max(5,Math.ceil(t.prazoOrig*.4));
 const m=s.match(/(\d+)\s*dias?/);let quer=m?+m[1]:Math.max(minimo,Math.round(t.prazo*.6));
 if(quer>=t.prazo)return `O prazo já está em ${t.prazo} dias. Consigo manter isso tranquilo.`;
 if(quer<minimo){const diasC=t.prazoOrig-minimo,ac=Math.round(diasC*.35*10)/10;t.prazo=minimo;if(t.min)t.min*=1+diasC*.0035;if(t.preco)t.preco*=1+diasC*.0035;if(t.prop&&t.prop.prazo!=null){t.prop.prazo=minimo;if(t.prop.v)t.prop.v=Math.round(t.prop.v*(1+diasC*.0035))}
  return `Em ${quer} dias é impossível, o caminhão ainda está saindo da fábrica. O mais rápido que consigo é <b>${minimo} dias</b>, com frete expresso (+${ac.toFixed(1)}% no valor). Fica assim?`}
 const diasC=t.prazo-quer,pct=diasC*.35;t.prazo=quer;if(t.min)t.min*=1+diasC*.0035;if(t.preco)t.preco*=1+diasC*.0035;if(t.prop&&t.prop.prazo!=null){t.prop.prazo=quer;if(t.prop.v)t.prop.v=Math.round(t.prop.v*(1+diasC*.0035))}
 return pick([`Consegui com a fábrica! Antecipamos a entrega para <b>${quer} dias</b>. O frete expresso acrescenta ${pct.toFixed(1)}% no valor.`,`Falei com a logística: dá para entregar em <b>${quer} dias</b>, com um custo de urgência de ${pct.toFixed(1)}%.`,`Posso priorizar seu pedido e entregar em <b>${quer} dias</b>, mas sai ${pct.toFixed(1)}% mais caro pela antecipação.`])}
const oM=W.mandaTexto;W.mandaTexto=function(id){const t=th(id),el=document.getElementById("txtMsg");if(!t||!el)return oM(id);const txt=el.value.trim();if(!txt)return oM(id);
 const resp=t.tipo==="veic"||t.prazo?pedePrazo(t,txt):null;
 if(resp){msgAdd(t,"eu",esc(txt));el.value="";t.aguard=true;setTimeout(()=>{t.aguard=false;msgAdd(t,"ele",resp);try{abrirThread(id)}catch(e){render()}},ri(1500,4000));try{abrirThread(id)}catch(e){render()}return}
 return oM(id)};
})();
