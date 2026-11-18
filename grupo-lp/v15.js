// v15: o jogo reconhece sempre as empresas criadas e as lojas abertas/fechadas (também depois da sincronização PC↔celular)
(function(){const W=window;let assin="";
function reconhecer(){if(typeof S==="undefined"||!S||!S.lojas)return;S.emps=S.emps||{};S.ecx=S.ecx||{};
 let mudou=false;
 Object.entries(S.emps).forEach(([k,e])=>{if(EMP[k]!==e){EMP[k]=e;mudou=true}if(!e.seg)e.seg="lub";if(S.ecx[k]==null)S.ecx[k]=0});
 // loja de uma empresa que este aparelho ainda não conhecia: cria a empresa para não quebrar nada
 S.lojas.forEach((l,i)=>{if(!EMP[l.emp]){const e={n:"Empresa "+l.emp,c:"#7c3aed",seg:"lub",criada:S.simMs};S.emps[l.emp]=e;EMP[l.emp]=e;S.ecx[l.emp]=S.ecx[l.emp]||0;mudou=true}
  l.est=l.est||{};l.venda=l.venda||{dia:0,mes:0};if(l.caixa==null)l.caixa=0;
  // loja nova: recebe todos os produtos do ramo da empresa no catálogo
  if(l.tipo!=="transp"&&!l.encerrada&&!l.v15){const sg=segDe(l);S.prods.forEach(p=>{if(p.seg===sg&&l.est[p.id]==null)l.est[p.id]=0});l.v15=1;mudou=true}});
 const a=Object.keys(EMP).join()+"|"+S.lojas.map(l=>l.emp+(l.encerrada||"")).join();
 if(a!==assin){if(assin)mudou=true;assin=a}
 if(mudou){try{if(typeof aba!=="undefined"&&["empresas","lojas","painel","mapa"].includes(aba))render()}catch(e){}}}
W.reconhecerEmpresas=reconhecer;reconhecer();setInterval(reconhecer,1500);
// toda vez que uma obra terminar ou uma empresa for criada, reconhece na hora
["checaObras","criarEmpresa","fecharLoja","venderLoja","reabrirLoja","venderEmpresa","fecharEmpresa"].forEach(n=>{const o=W[n];if(typeof o==="function")W[n]=function(){const r=o.apply(this,arguments);reconhecer();return r}});
})();
