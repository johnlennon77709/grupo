// v39: Modo jogo – concessionária em 3D: você anda com seu personagem, o vendedor te atende, leva até o veículo, negocia, bate papo e fecha a venda
(function(){const W=window;let G=null;
// conserta botões "invisíveis" (button.b sem cor): ficam dourados e legíveis
(function(){const st=document.createElement("style");st.id="v39btn";st.textContent=`button.b:not(.g):not(.r):not(.s):not(.bl){background:linear-gradient(135deg,#ffd45a,#f5b301 45%,#ff9500)!important;color:#1a1200!important;border:1px solid #f5b301!important;opacity:1!important}button.b:disabled{opacity:.5!important}`;document.head.appendChild(st)})();
const CDN="https://esm.sh/three@0.160.0",EX=CDN+"/examples/jsm/";
async function libs(){const [T,{GLTFLoader},{DRACOLoader},{RoomEnvironment},SK]=await Promise.all([import(CDN),import(EX+"loaders/GLTFLoader.js"),import(EX+"loaders/DRACOLoader.js"),import(EX+"environments/RoomEnvironment.js"),import(EX+"utils/SkeletonUtils.js")]);return{T,GLTFLoader,DRACOLoader,RoomEnvironment,SK}}
const PAPO={
 "Como tá o movimento?":["Graças a Deus tá bom! Mês passado bati a meta, o agro tá puxando tudo aqui em Rondônia.","Tá aquecido. Muita transportadora renovando frota por causa da safra.","Fim de ano é sempre forte. Quem deixa pra dezembro pega fila."],
 "E o futebol?":["Rapaz, nem me fala… meu time tá me dando desgosto esse ano 😅","Aqui na loja é metade Flamengo, metade Corinthians, dá briga todo dia.","Domingo tem jogo, a gente coloca na TV ali do café, aparece!"],
 "Esse calor de hoje, hein?":["Nem me fala, por isso o ar-condicionado aqui é no máximo! Quer uma água gelada?","Rondônia é assim: ou é sol de rachar ou é chuva de alagar.","Lá fora tá uns 38 graus. Aqui dentro pelo menos é fresquinho."],
 "Como tá a economia?":["Juros ainda altos, mas quem tem caixa tá aproveitando pra negociar bem.","O pessoal tá comprando à vista pra fugir dos juros, e a gente dá desconto melhor.","Diesel subiu de novo, por isso o pessoal procura modelo mais econômico."],
 "Tem café?":["Claro! Tem café passado agora, pão de queijo também. Fica à vontade.","Tem sim, a Dona Rose acabou de passar. Já peço pra trazer.","Café é a primeira coisa que a gente oferece aqui! Açúcar ou adoçante?"]};
const FICHA={carro:"Motor turbo, câmbio automático, 6 airbags, central multimídia, garantia de 3 anos",pickup:"Motor diesel/turbo, 4x4, tração reduzida, caçamba com capota, garantia de 3 anos",rigido:"Motor diesel Euro 6, câmbio automatizado, freio motor, cabine leito, garantia de 2 anos",cavalo:"Motor diesel Euro 6, 540+ cv, câmbio automatizado, retarder, cabine leito teto alto, telemetria",implemento:"Chassi reforçado, suspensão pneumática, freios ABS/EBS, pneus novos",carretinha:"Chassi galvanizado, engate padrão, luzes LED"};
function tipoTxt(t){return{carro:"Carro",pickup:"Caminhonete",rigido:"Caminhão",cavalo:"Cavalo mecânico",implemento:"Semirreboque",carretinha:"Reboque"}[t]||"Veículo"}
// ---------------- UI ----------------
const CSS=`#sr{position:fixed;inset:0;z-index:99999;background:#000;font-family:Inter,system-ui,sans-serif;color:#fff;touch-action:none}
#sr canvas{display:block;width:100%;height:100%}
#sr .top{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:10px;padding:10px 14px;background:linear-gradient(#000a,#0000)}
#sr .top b{font-family:Rajdhani,Inter;font-size:20px;letter-spacing:.5px;text-transform:uppercase}
#sr .bt{background:rgba(15,20,26,.75);color:#fff;border:1px solid #fff3;border-radius:10px;padding:8px 12px;font:600 13px Inter;cursor:pointer;backdrop-filter:blur(6px)}
#sr .bt.g{background:linear-gradient(135deg,#ffd45a,#f5b301 45%,#ff7a00);color:#1a1200;border:0}
#sr .dlg{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:min(720px,94vw);background:rgba(10,13,18,.88);border:1px solid #ffffff22;border-radius:16px;padding:14px 16px;backdrop-filter:blur(10px);display:none;box-shadow:0 20px 60px #0009}
#sr .dlg .who{font:700 12px Inter;color:#f5b301;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
#sr .dlg .txt{font-size:15.5px;line-height:1.45;min-height:22px}
#sr .ops{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
#sr .ops button{background:#ffffff12;border:1px solid #ffffff26;color:#fff;border-radius:10px;padding:9px 12px;font:600 13px Inter;cursor:pointer}
#sr .ops button:hover{background:#f5b30133;border-color:#f5b301}
#sr .ops input{background:#0007;border:1px solid #fff4;color:#fff;border-radius:10px;padding:9px 12px;font:600 14px Inter;width:170px}
#sr .hint{position:absolute;right:14px;bottom:18px;font:600 12px Inter;color:#fffb;text-shadow:0 1px 3px #000;text-align:right}
#sr .joy{position:absolute;left:26px;bottom:26px;width:130px;height:130px;border-radius:50%;background:#ffffff14;border:2px solid #ffffff30;display:none}
#sr .joy i{position:absolute;left:40px;top:40px;width:50px;height:50px;border-radius:50%;background:#ffffffaa}
#sr .ld{position:absolute;inset:0;display:grid;place-items:center;background:#07090c;font:600 15px Inter;z-index:3}
#sr .ld .bar{width:260px;height:4px;background:#222;border-radius:4px;margin-top:12px;overflow:hidden}#sr .ld .bar i{display:block;height:100%;width:0;background:#f5b301;transition:width .3s}
#sr .tag{position:absolute;pointer-events:none;font:700 12px Inter;background:#000a;padding:3px 8px;border-radius:8px;white-space:nowrap;transform:translate(-50%,-100%)}
@media(pointer:coarse){#sr .joy{display:block}#sr .hint{display:none}}`;
function esc2(s){return String(s).replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c]))}
function dlg(quem,txt,ops){const d=G.ui.dlg;d.style.display="block";d.innerHTML=`<div class="who">${esc2(quem)}</div><div class="txt"></div><div class="ops"></div>`;const t=d.querySelector(".txt"),o=d.querySelector(".ops");
 let i=0;clearInterval(G.tw);G.tw=setInterval(()=>{i+=2;t.innerHTML=txt.slice(0,i);if(i>=txt.length){clearInterval(G.tw);t.innerHTML=txt;mostra()}},16);
 function mostra(){(ops||[]).forEach(op=>{if(op.input){const inp=document.createElement("input");inp.placeholder=op.input;inp.inputMode="numeric";o.appendChild(inp);G.inp=inp;return}const b=document.createElement("button");b.textContent=op.t;b.onclick=()=>op.f();o.appendChild(b)})}
 G.falando=true}
function fechaDlg(){G.ui.dlg.style.display="none";G.falando=false;clearInterval(G.tw)}
// ---------------- abrir ----------------
W.showroom=async function(di,ii){const d=DEALERS[di];if(!d)return;if(!document.getElementById("srcss")){const s=document.createElement("style");s.id="srcss";s.textContent=CSS;document.head.appendChild(s)}
 sair();const el=document.createElement("div");el.id="sr";el.innerHTML=`<div class="ld"><div style="text-align:center">🚗 Entrando na ${esc2(d.loja)}…<div class="bar"><i id="srb"></i></div><div id="srm" style="font-size:12px;color:#888;margin-top:8px">carregando gráficos</div></div></div>
 <div class="top"><b>${esc2(d.loja)}</b><span style="opacity:.7;font-size:13px">${new Date(S.simMs).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span><span style="margin-left:auto"></span><button class="bt" id="srCam">🎥 Câmera</button><button class="bt" id="srX">✕ Sair da loja</button></div>
 <div class="dlg"></div><div class="joy"><i></i></div><div class="hint">WASD / setas: andar · Shift: correr · arraste o mouse: girar câmera · roda: zoom · E: falar</div>`;
 document.body.appendChild(el);G={di,ii,d,el,ui:{dlg:el.querySelector(".dlg")},keys:{},vivo:true,falando:false,estado:"livre",desc:0,pac:3,ger:false};
 el.querySelector("#srX").onclick=sair;document.addEventListener("keydown",kd);document.addEventListener("keyup",ku);
 try{await monta()}catch(e){console.error(e);el.querySelector(".ld").innerHTML=`<div style="text-align:center;max-width:420px">Não consegui carregar o modo 3D (${esc2(e.message)}).<br>Verifique a internet e tente de novo.<br><br><button class="bt" onclick="document.getElementById('sr').remove()">Fechar</button></div>`}};
function kd(e){if(!G)return;G.keys[e.key.toLowerCase()]=true;if(e.key==="Escape")sair();if(e.key.toLowerCase()==="e"&&!G.falando&&G.vend&&G.player.position.distanceTo(G.vend.position)<3)atende()}
function ku(e){if(G)G.keys[e.key.toLowerCase()]=false}
function sair(){if(G){G.vivo=false;try{G.ren.dispose()}catch(e){}G.el.remove();document.removeEventListener("keydown",kd);document.removeEventListener("keyup",ku)}G=null}
function prog(p,m){const b=document.getElementById("srb");if(b)b.style.width=p+"%";const t=document.getElementById("srm");if(t&&m)t.textContent=m}
// ---------------- cena ----------------
async function monta(){const L=await libs();prog(20,"montando o showroom");const {T}=L;G.L=L;
 const ren=new T.WebGLRenderer({antialias:true,powerPreference:"high-performance"});ren.setPixelRatio(Math.min(2,devicePixelRatio));ren.setSize(innerWidth,innerHeight);
 ren.shadowMap.enabled=true;ren.shadowMap.type=T.PCFSoftShadowMap;ren.toneMapping=T.ACESFilmicToneMapping;ren.toneMappingExposure=1.05;ren.outputColorSpace=T.SRGBColorSpace;
 G.el.prepend(ren.domElement);G.ren=ren;
 const sc=new T.Scene();G.sc=sc;const pm=new T.PMREMGenerator(ren);sc.environment=pm.fromScene(new L.RoomEnvironment(),.04).texture;
 sc.background=new T.Color(0xdfe6ee);sc.fog=new T.Fog(0xdfe6ee,45,95);
 const cam=new T.PerspectiveCamera(55,innerWidth/innerHeight,.1,300);G.cam=cam;
 addEventListener("resize",rs);function rs(){if(!G)return removeEventListener("resize",rs);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)}
 // luz
 sc.add(new T.HemisphereLight(0xffffff,0x8a8f99,.6));const sun=new T.DirectionalLight(0xfff4e0,2.2);sun.position.set(-25,30,20);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-30,right:30,top:25,bottom:-25,far:90});sun.shadow.bias=-.0004;sc.add(sun);
 const WX=40,DZ=26;
 // piso porcelanato polido com reflexo
 const fc=document.createElement("canvas");fc.width=fc.height=1024;const g=fc.getContext("2d");g.fillStyle="#eceff2";g.fillRect(0,0,1024,1024);for(let i=0;i<4000;i++){g.fillStyle=`rgba(${150+Math.random()*60|0},${150+Math.random()*60|0},${160+Math.random()*60|0},.05)`;g.fillRect(Math.random()*1024,Math.random()*1024,2+Math.random()*6,1+Math.random()*3)}
 g.strokeStyle="#c9ced5";g.lineWidth=3;for(let i=0;i<=1024;i+=256){g.beginPath();g.moveTo(i,0);g.lineTo(i,1024);g.moveTo(0,i);g.lineTo(1024,i);g.stroke()}
 const ft=new T.CanvasTexture(fc);ft.wrapS=ft.wrapT=T.RepeatWrapping;ft.repeat.set(WX/4,DZ/4);ft.colorSpace=T.SRGBColorSpace;ft.anisotropy=8;
 const piso=new T.Mesh(new T.PlaneGeometry(WX,DZ),new T.MeshPhysicalMaterial({map:ft,roughness:.08,metalness:0,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.2}));piso.rotation.x=-Math.PI/2;piso.receiveShadow=true;sc.add(piso);
 // calçada e estacionamento externo
 const ext=new T.Mesh(new T.PlaneGeometry(140,140),new T.MeshStandardMaterial({color:0x3a3d42,roughness:.9}));ext.rotation.x=-Math.PI/2;ext.position.y=-.02;ext.receiveShadow=true;sc.add(ext);
 const cal=new T.Mesh(new T.BoxGeometry(WX+6,.15,5),new T.MeshStandardMaterial({color:0xbfc3c8,roughness:.8}));cal.position.set(0,.06,DZ/2+2.5);cal.receiveShadow=true;sc.add(cal);
 const box=(w,h,dd,m,x,y,z)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,dd),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;sc.add(o);return o};
 const parede=new T.MeshStandardMaterial({color:0xf4f5f7,roughness:.6}),grafite=new T.MeshStandardMaterial({color:0x22262c,roughness:.4,metalness:.3}),corM=new T.MeshStandardMaterial({color:new T.Color(d2c(G.d.cor)),roughness:.35,metalness:.2});
 box(WX,7,.4,parede,0,3.5,-DZ/2);box(.4,7,DZ,parede,-WX/2,3.5,0);box(.4,7,DZ,parede,WX/2,3.5,0);
 // fachada de vidro com montantes
 const vidro=new T.MeshPhysicalMaterial({color:0xcfe3f0,transmission:.9,roughness:.02,thickness:.1,transparent:true,opacity:.25,metalness:0});
 const fach=new T.Mesh(new T.PlaneGeometry(WX,7),vidro);fach.position.set(0,3.5,DZ/2);sc.add(fach);for(let x=-WX/2;x<=WX/2;x+=4)box(.12,7,.12,grafite,x,3.5,DZ/2);box(WX,.3,.3,grafite,0,7,DZ/2);
 // teto com luminárias
 const teto=new T.Mesh(new T.PlaneGeometry(WX,DZ),new T.MeshStandardMaterial({color:0xffffff,roughness:.9}));teto.rotation.x=Math.PI/2;teto.position.y=7;sc.add(teto);
 const lum=new T.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:2});
 for(let x=-15;x<=15;x+=7.5)for(let z=-8;z<=8;z+=8){box(3,.06,.35,lum,x,6.95,z);}
 [-12,0,12].forEach(x=>{const s=new T.SpotLight(0xfff2dd,180,22,Math.PI/5,.5,1.6);s.position.set(x,6.8,0);s.target.position.set(x,0,0);s.castShadow=x===0;sc.add(s,s.target)});
 // faixa da marca + letreiro
 box(WX-.6,1.1,.1,corM,0,5.9,-DZ/2+.26);
 const letreiro=placa(G.d.m.toUpperCase(),"#ffffff",d2c(G.d.cor),14,1.6);letreiro.position.set(0,5.9,-DZ/2+.33);sc.add(letreiro);
 const lt2=placa(G.d.loja,"#ffffff","#22262c",14,1.1);lt2.position.set(0,8.2,DZ/2+.3);sc.add(lt2);box(WX,1.5,.4,grafite,0,7.9,DZ/2+.05);
 // balcão de atendimento, mesas, sofá, plantas
 box(5,1.1,1.2,grafite,-WX/2+5,.55,-DZ/2+3);box(5.2,.06,1.4,new T.MeshStandardMaterial({color:0xffffff,roughness:.2}),-WX/2+5,1.13,-DZ/2+3);
 const mesa=new T.MeshStandardMaterial({color:0xffffff,roughness:.25});[[WX/2-6,-6],[WX/2-6,0],[WX/2-6,6]].forEach(([x,z])=>{const t=new T.Mesh(new T.CylinderGeometry(.6,.6,.05,32),mesa);t.position.set(x,.76,z);t.castShadow=true;sc.add(t);box(.08,.75,.08,grafite,x,.38,z);[[-1,0],[1,0]].forEach(([a])=>box(.55,.5,.55,new T.MeshStandardMaterial({color:0x1f2937,roughness:.7}),x+a*1.1,.25,z))});
 const sofa=new T.MeshStandardMaterial({color:0x3b3f46,roughness:.85});box(4,.5,1,sofa,-WX/2+5,.25,8);box(4,.7,.25,sofa,-WX/2+5,.7,8.4);
 for(const [x,z] of [[-WX/2+1.2,DZ/2-1.2],[WX/2-1.2,DZ/2-1.2],[-WX/2+1.2,-DZ/2+1.2],[WX/2-1.2,-DZ/2+1.2]]){box(.6,.7,.6,grafite,x,.35,z);const f=new T.Mesh(new T.IcosahedronGeometry(.75,1),new T.MeshStandardMaterial({color:0x2f6b3a,roughness:.8,flatShading:true}));f.position.set(x,1.3,z);f.castShadow=true;sc.add(f)}
 // TV na parede
 const tv=box(4,2.25,.08,new T.MeshStandardMaterial({color:0x0a0a0a,roughness:.2,metalness:.6}),-WX/2+.25,3.2,0);tv.rotation.y=Math.PI/2;
 const tvs=placa("OFERTA DO MÊS · TAXA 0,99%","#f5b301","#0b0f14",20,1.2);tvs.scale.set(.9,.9,.9);tvs.position.set(-WX/2+.31,3.2,0);tvs.rotation.y=Math.PI/2;sc.add(tvs);
 prog(35,"carregando os veículos");
 // carros
 const loader=new L.GLTFLoader();const dr=new L.DRACOLoader();dr.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");loader.setDRACOLoader(dr);
 const [car,bot]=await Promise.all([loader.loadAsync("https://threejs.org/examples/models/gltf/ferrari.glb"),loader.loadAsync("https://threejs.org/examples/models/gltf/Xbot.glb")]);
 prog(75,"preparando o atendimento");
 const itens=G.d.itens.slice(0,8);const n=itens.length,cols=Math.min(4,n),rows=Math.ceil(n/cols);G.carros=[];
 const cores=[0xb91c1c,0x111827,0xe5e7eb,0x1e3a8a,0x6b7280,0xf5b301,0x14532d,0xffffff];
 itens.forEach((it,i)=>{const cx=(i%cols-(cols-1)/2)*8.5,cz=rows>1?(Math.floor(i/cols)?4.5:-4.5):0;
  const pod=new T.Mesh(new T.CylinderGeometry(3.3,3.4,.18,64),new T.MeshPhysicalMaterial({color:0x1b1e23,roughness:.15,metalness:.6,clearcoat:1}));pod.position.set(cx,.09,cz);pod.receiveShadow=pod.castShadow=true;sc.add(pod);
  const ring=new T.Mesh(new T.TorusGeometry(3.35,.03,8,96),new T.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:1.5}));ring.rotation.x=Math.PI/2;ring.position.set(cx,.19,cz);sc.add(ring);
  const m=car.scene.clone(true);const grande=["rigido","cavalo","implemento"].includes(it[1]),pick=["pickup"].includes(it[1]);const k=grande?2.1:pick?1.3:1.15;m.scale.set(k*(grande?1.1:1),k*(grande?1.35:pick?1.15:1),k*(grande?1.5:1));
  const cor=new T.MeshPhysicalMaterial({color:cores[i%cores.length],metalness:1,roughness:.45,clearcoat:1,clearcoatRoughness:.03});
  m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.name==="body"||/body/i.test(o.material&&o.material.name||""))o.material=cor;if(o.name==="glass"||/glass/i.test(o.name))o.material=new T.MeshPhysicalMaterial({color:0xffffff,metalness:.25,roughness:0,transmission:1})}});
  m.position.set(cx,.18,cz);m.rotation.y=-.6+i*.35;sc.add(m);
  const pl=placa(`${it[0]}  ·  ${R$(it[3])}`,"#ffffff","#0b0f14",15,1);pl.position.set(cx,.75,cz+3.6);pl.rotation.x=-.5;sc.add(pl);
  const totem=box(.9,1.1,.12,grafite,cx+2.8,.55,cz+2.2);totem.rotation.y=-.6;
  G.carros.push({it,idx:G.d.itens.indexOf(it),pos:new T.Vector3(cx,0,cz),m,cor})});
 // pessoas
 const mkBot=(corpo,junta)=>{const o=L.SK.clone(bot.scene);o.traverse(c=>{if(c.isMesh){c.castShadow=true;c.material=c.material.clone();if(/Body/i.test(c.material.name))c.material.color.set(corpo);if(/Joints/i.test(c.material.name))c.material.color.set(junta)}});
  const mx=new T.AnimationMixer(o);const a={};bot.animations.forEach(cl=>{a[cl.name]=mx.clipAction(cl)});sc.add(o);return{o,mx,a,cur:null}};
 const play=(p,n)=>{if(p.cur===n)return;const nx=p.a[n];if(!nx)return;nx.reset().fadeIn(.25).play();if(p.cur&&p.a[p.cur])p.a[p.cur].fadeOut(.25);p.cur=n};G.play=play;
 const P=mkBot(0x2b4a7a,0xf0c9a0);P.o.position.set(0,0,DZ/2+3);P.o.rotation.y=Math.PI;play(P,"idle");G.P=P;G.player=P.o;
 const Vd=mkBot(0x14161a,0xffffff);Vd.o.position.set(-WX/2+5,0,-DZ/2+4.4);play(Vd,"idle");G.V=Vd;G.vend=Vd.o;
 // clientes passeando
 G.npcs=[];for(let i=0;i<3;i++){const c=mkBot([0x7c2d12,0x166534,0x6b21a8][i],0xd9a77a);c.o.position.set(-10+i*9,0,8-i*3);play(c,"walk");c.alvo=null;G.npcs.push(c)}
 G.WX=WX;G.DZ=DZ;G.clock=new T.Clock();G.camYaw=Math.PI;G.camPitch=.35;G.camDist=6;G.camModo=0;
 // controles de câmera
 let drag=null;ren.domElement.addEventListener("pointerdown",e=>{if(e.pointerType==="touch"&&e.clientX<innerWidth*.45&&e.clientY>innerHeight*.5)return;drag=[e.clientX,e.clientY,G.camYaw,G.camPitch]});
 addEventListener("pointermove",e=>{if(!drag||!G)return;G.camYaw=drag[2]-(e.clientX-drag[0])*.006;G.camPitch=Math.max(.05,Math.min(1.2,drag[3]+(e.clientY-drag[1])*.004))});addEventListener("pointerup",()=>drag=null);
 ren.domElement.addEventListener("wheel",e=>{e.preventDefault();G.camDist=Math.max(2.5,Math.min(16,G.camDist*(1+Math.sign(e.deltaY)*.1)))},{passive:false});
 G.el.querySelector("#srCam").onclick=()=>{G.camModo=(G.camModo+1)%2;G.camDist=G.camModo?2.2:6};
 // joystick
 const jy=G.el.querySelector(".joy"),jk=jy.querySelector("i");G.jx=0;G.jz=0;let jid=null;
 jy.addEventListener("pointerdown",e=>{jid=e.pointerId;jy.setPointerCapture(jid);mj(e)});jy.addEventListener("pointermove",e=>{if(e.pointerId===jid)mj(e)});jy.addEventListener("pointerup",()=>{jid=null;G.jx=G.jz=0;jk.style.left="40px";jk.style.top="40px"});
 function mj(e){const r=jy.getBoundingClientRect();let x=e.clientX-r.left-65,y=e.clientY-r.top-65;const d=Math.hypot(x,y);if(d>50){x*=50/d;y*=50/d}jk.style.left=40+x+"px";jk.style.top=40+y+"px";G.jx=x/50;G.jz=y/50}
 G.tags=[];
 prog(100);setTimeout(()=>{const ld=G&&G.el.querySelector(".ld");if(ld)ld.remove()},300);
 setTimeout(()=>{if(G&&G.estado==="livre")G.estado="vindo"},2500);
 loop()}
function d2c(c){return c||"#1f2937"}
function placa(txt,fg,bg,larg,alt){const {T}=G.L;const cv=document.createElement("canvas");cv.width=1024;cv.height=Math.round(1024*alt/larg*4)||128;cv.height=Math.max(96,Math.min(256,cv.height));const g=cv.getContext("2d");g.fillStyle=bg;g.fillRect(0,0,cv.width,cv.height);g.fillStyle=fg;
 let fs=cv.height*.55;g.font=`800 ${fs}px Inter,Arial`;while(g.measureText(txt).width>cv.width*.92&&fs>10){fs-=2;g.font=`800 ${fs}px Inter,Arial`}g.textAlign="center";g.textBaseline="middle";g.fillText(txt,cv.width/2,cv.height/2+2);
 const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;const w=larg*.5,h=w*cv.height/cv.width;return new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t,toneMapped:false}))}
// ---------------- loop ----------------
function anda(p,alvo,vel,dt){const o=p.o,dx=alvo.x-o.position.x,dz=alvo.z-o.position.z,d=Math.hypot(dx,dz);if(d<.15){G.play(p,"idle");return true}
 const s=Math.min(d,vel*dt);o.position.x+=dx/d*s;o.position.z+=dz/d*s;const ry=Math.atan2(dx,dz);o.rotation.y=lerpA(o.rotation.y,ry,Math.min(1,dt*8));G.play(p,vel>3?"run":"walk");return false}
function lerpA(a,b,t){let d=((b-a+Math.PI)%(2*Math.PI))-Math.PI;if(d<-Math.PI)d+=2*Math.PI;return a+d*t}
function colide(v){const lim=[G.WX/2-.6,G.DZ/2+8];v.x=Math.max(-lim[0],Math.min(lim[0],v.x));v.z=Math.max(-G.DZ/2+.6,Math.min(lim[1],v.z));
 if(v.z<G.DZ/2&&v.z>G.DZ/2-.5&&Math.abs(v.x)>3){v.z=v.z>G.DZ/2-.25?G.DZ/2:G.DZ/2-.5} // porta central aberta
 G.carros.forEach(c=>{const dx=v.x-c.pos.x,dz=v.z-c.pos.z,d=Math.hypot(dx,dz);if(d<2.6){v.x=c.pos.x+dx/d*2.6;v.z=c.pos.z+dz/d*2.6}})}
function loop(){if(!G||!G.vivo)return;requestAnimationFrame(loop);const {T}=G.L;const dt=Math.min(.05,G.clock.getDelta());
 // jogador
 let ix=0,iz=0;const k=G.keys;if(k.w||k.arrowup)iz-=1;if(k.s||k.arrowdown)iz+=1;if(k.a||k.arrowleft)ix-=1;if(k.d||k.arrowright)ix+=1;ix+=G.jx||0;iz+=G.jz||0;
 const P=G.P,o=P.o;if(!G.falando&&(ix||iz)){const corre=k.shift||Math.hypot(G.jx||0,G.jz||0)>.95;const sp=corre?4.2:1.7;const ang=Math.atan2(ix,iz)+G.camYaw+Math.PI;const nv=new T.Vector3(o.position.x+Math.sin(ang)*sp*dt,0,o.position.z+Math.cos(ang)*sp*dt);colide(nv);o.position.copy(nv);o.rotation.y=lerpA(o.rotation.y,ang,Math.min(1,dt*10));G.play(P,corre?"run":"walk")}else G.play(P,"idle");
 // vendedor
 const V=G.V;if(G.estado==="vindo"){const alvo=o.position.clone().add(new T.Vector3(Math.sin(o.rotation.y)*1.6,0,Math.cos(o.rotation.y)*1.6));if(anda(V,alvo,1.9,dt)||V.o.position.distanceTo(o.position)<1.8){G.estado="falando";V.o.lookAt(o.position.x,0,o.position.z);G.play(V,"idle");saudacao()}}
 else if(G.estado==="levando"){const c=G.carros[G.alvoCar];const alvo={x:c.pos.x+3.3,z:c.pos.z+.8};if(anda(V,alvo,1.5,dt)){V.o.lookAt(c.pos.x,0,c.pos.z);if(o.position.distanceTo(V.o.position)<2.8){G.estado="nocarro";noCarro()}}}
 else if(G.estado==="falando"||G.estado==="nocarro"){V.o.rotation.y=lerpA(V.o.rotation.y,Math.atan2(o.position.x-V.o.position.x,o.position.z-V.o.position.z),dt*5);G.play(V,"idle")}
 else if(G.estado==="espera"){if(V.o.position.distanceTo(o.position)>4)anda(V,o.position,1.6,dt);else G.play(V,"idle")}
 // clientes
 G.npcs.forEach(n=>{if(!n.alvo||n.par>0){if(n.par>0){n.par-=dt;G.play(n,"idle");return}const c=G.carros[Math.random()*G.carros.length|0];n.alvo={x:c.pos.x+(Math.random()-.5)*7,z:c.pos.z+(Math.random()<.5?-3:3)}}
  if(anda(n,n.alvo,1.1,dt)){n.alvo=null;n.par=3+Math.random()*7}});
 [P,V,...G.npcs].forEach(p=>p.mx.update(dt));
 // carro em destaque gira devagar
 G.carros.forEach((c,i)=>{if(i===G.alvoCar&&G.estado==="nocarro")c.m.rotation.y+=dt*.25});
 // câmera
 const cam=G.cam,alvo=o.position.clone().add(new T.Vector3(0,G.camModo?1.6:1.4,0));
 const cp=new T.Vector3(alvo.x+Math.sin(G.camYaw)*Math.cos(G.camPitch)*G.camDist,alvo.y+Math.sin(G.camPitch)*G.camDist,alvo.z+Math.cos(G.camYaw)*Math.cos(G.camPitch)*G.camDist);
 if(G.falando&&!G.camModo){const m=o.position.clone().lerp(V.o.position,.5);cp.set(m.x+Math.sin(G.camYaw+.9)*4.2,2.1,m.z+Math.cos(G.camYaw+.9)*4.2);alvo.set(m.x,1.4,m.z)}
 cp.y=Math.min(6.5,Math.max(.4,cp.y));cam.position.lerp(cp,Math.min(1,dt*6));cam.lookAt(alvo);
 G.ren.render(G.sc,cam)}
// ---------------- atendimento ----------------
function nomeV(){return G.d.vend||"Vendedor"}
function saudacao(){const h=new Date(S.simMs).getHours(),cump=h<12?"Bom dia":h<18?"Boa tarde":"Boa noite";
 dlg(nomeV(),`${cump}! Seja bem-vindo à ${G.d.loja}. Meu nome é ${nomeV().replace(/^(Sr\.|Sra\.|Dona) /,"")}. Posso te ajudar? Tá de olho em algum modelo?`,[
  ...G.carros.map((c,i)=>({t:`👉 ${c.it[0]}`,f:()=>levar(i)})),{t:"💬 Só olhando, obrigado",f:()=>{dlg(nomeV(),"Fica à vontade! Qualquer coisa é só me chamar (aperte E perto de mim).",[{t:"Valeu",f:()=>{fechaDlg();G.estado="espera"}}])}},...papoOps()])}
function papoOps(){return Object.keys(PAPO).slice(0,2).map(q=>({t:"🗨️ "+q,f:()=>papo(q)}))}
function papo(q){const r=PAPO[q][Math.random()*PAPO[q].length|0];dlg(nomeV(),r,[...Object.keys(PAPO).filter(x=>x!==q).slice(0,3).map(x=>({t:"🗨️ "+x,f:()=>papo(x)})),{t:"🚗 Voltar aos carros",f:()=>G.alvoCar!=null&&G.estado==="nocarro"?noCarro():saudacao()}])}
function atende(){G.estado=G.alvoCar!=null?"nocarro":"falando";G.alvoCar!=null?noCarro():saudacao()}
function levar(i){G.alvoCar=i;G.desc=0;G.pac=3+(Math.random()*2|0);G.ger=false;G.preco=G.carros[i].it[3];G.min=G.preco*(G.carros[i].it[4]?.95:.88+Math.random()*.04);
 dlg(nomeV(),`Ótima escolha! O ${G.carros[i].it[0]} é um dos que mais sai. Vem comigo que eu te mostro.`,[]);setTimeout(()=>{fechaDlg();G.estado="levando"},1600)}
function noCarro(){const c=G.carros[G.alvoCar],it=c.it;
 dlg(nomeV(),`Esse aqui é o <b>${esc2(it[0])}</b> (${tipoTxt(it[1])}). ${FICHA[it[1]]||""}. Tabela: <b>${R$(it[3])}</b>${G.preco<it[3]?` – pra você faço <b>${R$(G.preco)}</b>`:""}. E aí, o que achou?`,[
  {t:"💰 Qual o melhor preço?",f:negocia},{t:"✍️ Fazer proposta",f:proposta},{t:"🎨 Trocar cor",f:()=>{c.cor.color.setHSL(Math.random(),.6,.35);noCarro()}},{t:"✅ Fechar negócio",f:pagamento},{t:"🔄 Ver outro modelo",f:saudacao},...papoOps(),{t:"👋 Vou pensar",f:()=>{dlg(nomeV(),"Sem problema! Meu cartão tá aqui, qualquer coisa me chama.",[{t:"Até mais",f:()=>{fechaDlg();G.estado="espera"}}])}}])}
function negocia(){if(G.preco>G.min*1.02){const novo=Math.max(G.min*1.01,G.preco*(.97-Math.random()*.02));G.preco=Math.round(novo/100)*100;
  dlg(nomeV(),pick2(["Deixa eu ver aqui no sistema…","Olha, consigo melhorar um pouco.","Vou fazer um esforço aqui pra você."])+` Fica em <b>${R$(G.preco)}</b>.`,[{t:"✍️ Fazer contraproposta",f:proposta},{t:"✅ Fechar nesse valor",f:pagamento},{t:"⬅️ Voltar",f:noCarro}])}
 else if(!G.ger){G.ger=true;G.preco=Math.round(G.min/100)*100;dlg(nomeV(),`Esse já é meu limite… mas peraí, vou falar com meu gerente. <i>(alguns segundos depois)</i> Consegui! <b>${R$(G.preco)}</b>, mas só se fechar hoje.`,[{t:"✅ Fechar",f:pagamento},{t:"✍️ Proposta",f:proposta},{t:"⬅️ Voltar",f:noCarro}])}
 else dlg(nomeV(),`Aí não tem mais como, chefe. <b>${R$(G.preco)}</b> é o menor valor que a fábrica libera.`,[{t:"✅ Fechar",f:pagamento},{t:"⬅️ Voltar",f:noCarro}])}
function proposta(){dlg(nomeV(),"Quanto você quer pagar? Me fala o valor.",[{input:"Ex: "+Math.round(G.preco*.9)},{t:"Enviar",f:()=>{const v=+String(G.inp.value).replace(/\D/g,"");if(!v)return;
 if(v>=G.min){G.preco=v;dlg(nomeV(),`Fechado! 🤝 <b>${R$(v)}</b>. Vamos ver a forma de pagamento?`,[{t:"💳 Forma de pagamento",f:pagamento}])}
 else if(--G.pac<=0){dlg(nomeV(),"Com esse valor não consigo mesmo. Se mudar de ideia, estou aqui.",[{t:"Tá bom",f:()=>{fechaDlg();G.estado="espera";G.pac=2}}])}
 else{G.preco=Math.round(Math.max(G.min,(v+G.preco)/2)/100)*100;dlg(nomeV(),pick2(["Esse valor é abaixo da tabela…","Vou falar com o gerente.","Aí fica difícil, mas…"])+` Consigo <b>${R$(G.preco)}</b>.`,[{t:"✅ Aceitar",f:pagamento},{t:"✍️ Nova proposta",f:proposta},{t:"⬅️ Voltar",f:noCarro}])}}}])}
function pick2(a){return a[Math.random()*a.length|0]}
function pagamento(){const p=G.preco,ks=Object.keys(EMP);
 dlg(nomeV(),`Perfeito! Valor final <b>${R$(p)}</b>. Como vai ser o pagamento? E fica no nome de qual empresa?`,[
  ...ks.slice(0,4).map(k=>({t:`🏢 ${EMP[k].n}${G.emp===k?" ✓":""}`,f:()=>{G.emp=k;pagamento()}})),
  {t:"💵 À vista (PIX/TED)",f:()=>fecha("vista")},{t:"🏦 Financiar 30% entrada + 48x",f:()=>fecha("fin")},{t:"⬅️ Voltar",f:noCarro}])}
function fecha(forma){const c=G.carros[G.alvoCar],it=c.it,p=G.preco,k=G.emp||Object.keys(EMP)[0];S.ecx=S.ecx||{};
 if(forma==="vista"){S.ecx[k]=(S.ecx[k]||0)-p}else{const e=p*.3,fin=p-e,i=.0139,n=48,parc=fin*i/(1-Math.pow(1+i,-n));S.ecx[k]=(S.ecx[k]||0)-e;for(let j=1;j<=n;j++)addConta(`Financiamento ${it[0]} – ${j}/${n}`,parc,S.simMs+j*30*864e5,"Financiamento",G.d.loja)}
 const cap=it[2]||0;const v=addVeic(G.d.m,it[0],it[1],cap,2026,p);if(S.fat)S.fat.desp=(S.fat.desp||0)+(forma==="vista"?p:p*.3);
 log(`🔑 Comprou na ${G.d.loja}: ${it[0]} por ${R$(p)} (${forma==="vista"?"à vista":"financiado 48x"}) – placa ${v.placa}`);try{save()}catch(e){}
 dlg(nomeV(),`Parabéns pela compra! 🎉 Aqui estão as chaves do seu <b>${esc2(it[0])}</b>, placa <b>${v.placa}</b>. Documentação pronta, já pode levar! Foi um prazer.`,[{t:"🔑 Pegar as chaves e levar pra base",f:()=>{toast(`${it[0]} na frota! 🚚`);sair();try{render()}catch(e){}}},{t:"🛍️ Continuar na loja",f:()=>{fechaDlg();G.estado="espera"}}])}
// ---------------- botão na concessionária ----------------
function liga(){if(typeof V==="undefined"||!V.conc||V.conc.__v39)return;const o=V.conc;const g=function(){return o.apply(this,arguments).replace(/onclick="negVeic\((\d+),(\d+)\)">Negociar<\/button>/g,(m,a,b)=>`onclick="negVeic(${a},${b})">Negociar</button><button class="b g" style="margin-left:6px" onclick="showroom(${a},${b})">🎮 Ir à loja</button>`)};g.__v39=1;V.conc=g}
setTimeout(liga,2600);setTimeout(liga,6000);
})();
