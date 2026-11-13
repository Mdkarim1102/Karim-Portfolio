(function(){
"use strict";
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const small=()=>innerWidth<800;
const icon=(d)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I={code:'<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',brain:'<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.5 7.5 11 16.5M16.5 7.5 13 16.5M8 6h8"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',tool:'<path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.5 2.5-2.2-.5-.5-2.2Z"/>',cloud:'<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9Z"/>',server:'<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M7 7h.01M7 17h.01"/>'};

/* ---------- content (from resume) ---------- */
const skills=[
 ["Programming",I.code,["Python","Java","JavaScript"]],
 ["AI & Machine Learning",I.brain,["NumPy","Pandas","Scikit-learn","Linear Regression","Decision Tree","Random Forest"]],
 ["Web development",I.globe,["HTML","CSS","React","REST API integration"]],
 ["Tools",I.tool,["Git","GitHub","VS Code","Jupyter Notebook"]],
 ["Cloud & ITSM",I.cloud,["AWS fundamentals","Microsoft Azure","ServiceNow ITSM"]],
 ["Systems & networking",I.server,["Windows","Linux","TCP/IP","DNS","DHCP","Troubleshooting"]]
];
const projects=[
 {t:"Smart Side-Collision Prevention System",tech:["ESP32","Ultrasonic sensors"],d:["Academic project focused on motorcycle rider safety.","Designed to detect nearby vehicles and support collision alerts.","Worked on hardware integration, sensor reliability and response testing."],gh:"https://www.linkedin.com/in/mdkarimulla/details/projects/",buttonLabel:"LinkedIn",live:null},
 {t:"Currency Converter Web Application",tech:["React","JavaScript","Frankfurter API"],d:["Developed a React currency converter using live exchange rates.","Implemented currency selection, conversion, loading and error handling.","Practised responsive UI development and deployment workflows."],gh:"https://mdkarim1102.github.io/React-Deploy/",live:null}
];
$("#skillGrid").innerHTML=skills.map(s=>`<article class="card sk tilt">${icon(s[1])}<h3>${s[0]}</h3><ul class="tags">${s[2].map(x=>`<li>${x}</li>`).join("")}</ul></article>`).join("");
const btn=(u,l)=>u?`<a class="btn" href="${u}" target="_blank" rel="noopener">${l}</a>`:`<a class="btn" aria-disabled="true" tabindex="-1">${l}</a>`;
$("#projGrid").innerHTML=projects.map(p=>`<article class="card pj tilt"><h3>${p.t}</h3><ul class="tags">${p.tech.map(x=>`<li>${x}</li>`).join("")}</ul><ul>${p.d.map(x=>`<li>${x}</li>`).join("")}</ul><div class="acts">${btn(p.gh,p.buttonLabel||"GitHub")}${p.live?btn(p.live,"Live demo"):""}</div></article>`).join("");

/* ---------- nav ---------- */
const burger=$("#burger"),links=$("#links"),nav=$("nav");
const navA=$$("#links a");
const sectionEls=$$("main section");

function setActiveNav(id){
  navA.forEach(a=>{
    const active=a.getAttribute("href") === `#${id}`;
    a.classList.toggle("on",active);
    if(active) a.setAttribute("aria-current","location");
    else a.removeAttribute("aria-current");
  });
}

function setMenuOpen(open){
  links.classList.toggle("open",open);
  burger.setAttribute("aria-expanded",String(open));
  burger.setAttribute("aria-label",open?"Close menu":"Open menu");
}

burger.onclick=()=>setMenuOpen(!links.classList.contains("open"));
$(".brand").addEventListener("click",()=>setMenuOpen(false));
navA.forEach(a=>a.addEventListener("click",e=>{
  const target=a.getAttribute("href");
  if(target && target.startsWith("#")){
    e.preventDefault();
    const id=target.slice(1);
    const section=document.getElementById(id);
    setActiveNav(id);
    if(section){
      section.scrollIntoView({behavior: reduce ? "auto" : "smooth", block:"start"});
    }
  }
  setMenuOpen(false);
}));
document.addEventListener("click",e=>{
  if(links.classList.contains("open")&&!nav.contains(e.target)) setMenuOpen(false);
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&links.classList.contains("open")){
    setMenuOpen(false);
    burger.focus();
  }
});

const io=new IntersectionObserver(entries=>{
  const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(visible) setActiveNav(visible.target.id);
},{rootMargin:"-30% 0px -45% 0px",threshold:[0.2,0.4,0.6]});
sectionEls.forEach(s=>io.observe(s));

const topBtn=$("#top");topBtn.onclick=()=>scrollTo({top:0,behavior:reduce?"auto":"smooth"});

/* ---------- 3D background (greyscale, matches design.md) ---------- */
let mx=0,my=0,scrollY_=0;
if(window.THREE){
 const cv=$("#bg"),r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:!small()});
 r.setPixelRatio(Math.min(devicePixelRatio,1.75));
 const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.z=14;
 const grey=[0x666666,0x888888,0xaaaaaa,0x333333];
 const group=new THREE.Group();sc.add(group);
 const geos=[new THREE.IcosahedronGeometry(1,1),new THREE.OctahedronGeometry(1),new THREE.TorusGeometry(.9,.25,10,28),new THREE.BoxGeometry(1.2,1.2,1.2)];
 const objs=[];const N=small()?7:14;
 for(let i=0;i<N;i++){
  const g=geos[i%4],m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:grey[i%4],wireframe:true,transparent:true,opacity:.45}));
  m.position.set((Math.random()-.5)*(small()?9:22),(Math.random()-.5)*26-4,(Math.random()-.5)*8-2);
  m.scale.setScalar(.6+Math.random()*1.3);m.userData={s:Math.random()*.004+.001,f:Math.random()*2+1,y:m.position.y};
  group.add(m);objs.push(m);
 }
 // glowing spheres: soft shaded greys
 const sphG=new THREE.SphereGeometry(.5,24,24);
 sc.add(new THREE.AmbientLight(0xffffff,.8));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(4,6,8);sc.add(dl);
 for(let i=0;i<(small()?3:6);i++){
  const m=new THREE.Mesh(sphG,new THREE.MeshStandardMaterial({color:0xd8d8d8,roughness:.35,metalness:.1,transparent:true,opacity:.9}));
  m.position.set((Math.random()-.5)*(small()?8:20),(Math.random()-.5)*24-4,(Math.random()-.5)*6-4);
  m.scale.setScalar(.6+Math.random()*1.4);m.userData={s:0,f:Math.random()*2+1,y:m.position.y};group.add(m);objs.push(m);
 }
 // particles
 const pc=small()?220:700,pa=new Float32Array(pc*3);
 for(let i=0;i<pc;i++){pa[i*3]=(Math.random()-.5)*40;pa[i*3+1]=(Math.random()-.5)*40-4;pa[i*3+2]=(Math.random()-.5)*20-4}
 const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pa,3));
 const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x666666,size:.06,transparent:true,opacity:.6}));sc.add(pts);
 function size(){const w=innerWidth,h=innerHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
 size();addEventListener("resize",size);
 addEventListener("pointermove",e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2},{passive:true});
 addEventListener("scroll",()=>{scrollY_=scrollY},{passive:true});
 let vis=true;document.addEventListener("visibilitychange",()=>{vis=!document.hidden;if(vis)loop()});
 const clock=new THREE.Clock();let cx=0,cy=0,camY=0;
 function loop(){
  if(!vis)return;requestAnimationFrame(loop);
  const t=clock.getElapsedTime();
  if(!reduce){objs.forEach((o,i)=>{o.rotation.x+=o.userData.s;o.rotation.y+=o.userData.s*1.3;o.position.y=o.userData.y+Math.sin(t*.4*o.userData.f+i)*.4});pts.rotation.y=t*.01}
  cx+=(mx*1.2-cx)*.04;cy+=(-my*.8-cy)*.04;
  const target=-scrollY_*.012;camY+=(target-camY)*.06;
  cam.position.set(cx,camY+cy,14);cam.lookAt(cx*.2,camY-1,0);
  r.render(sc,cam);
 }
 loop();
 window.__bg={objs,group};
}

/* ---------- GSAP ---------- */
function splitChars(el){
 const text=el.textContent;el.textContent="";
 text.split(" ").forEach((w,wi,arr)=>{
  const word=document.createElement("span");word.style.cssText="display:inline-block;white-space:nowrap";word.setAttribute("aria-hidden","true");
  [...w].forEach(c=>{const s=document.createElement("span");s.className="ch";s.textContent=c;word.appendChild(s)});
  el.appendChild(word);if(wi<arr.length-1)el.appendChild(document.createTextNode(" "));
 });
 return $$(".ch",el);
}
if(window.gsap&&window.ScrollTrigger&&!reduce){
 gsap.registerPlugin(ScrollTrigger);
 // one orchestrated hero entrance
 const chars=splitChars($("#hero-title"));
 gsap.set("nav",{y:-60,opacity:0});
 const tl=gsap.timeline({defaults:{ease:"power3.out"}});
 tl.from(chars,{yPercent:110,rotateX:-70,opacity:0,duration:.9,stagger:.025})
   .from("#home .sub",{y:24,opacity:0,duration:.7},"-=.4")
   .from("#home .sup",{y:24,opacity:0,duration:.7},"-=.5")
   .from(".hero-actions .btn",{y:20,opacity:0,duration:.6,stagger:.12},"-=.4")
   .to("nav",{y:0,opacity:1,duration:.7},"-=.8");
 // restrained section reveals: headings only, plus cards in staggered groups
 $$(".reveal").forEach(el=>gsap.from(el,{y:30,opacity:0,duration:.8,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 85%",once:true}}));
 $$(".reveal-group p").forEach((p,i)=>gsap.from(p,{y:24,opacity:0,duration:.7,delay:i*.12,scrollTrigger:{trigger:".about",start:"top 80%",once:true}}));
 [["#skillGrid .card"],["#projGrid .card"],[".stats .card"],["#form"]].forEach(([s])=>{
  gsap.from(s,{y:40,opacity:0,duration:.8,stagger:.1,ease:"power3.out",scrollTrigger:{trigger:s,start:"top 88%",once:true}});
 });
 // timelines: line grows with scroll, cards slide in
 ["#tl1","#tl2"].forEach(id=>{
  const box=$(id);
  gsap.to($(".line",box),{height:"calc(100% - 12px)",ease:"none",scrollTrigger:{trigger:box,start:"top 70%",end:"bottom 60%",scrub:.6}});
  gsap.from($$(".item",box),{x:-30,opacity:0,duration:.8,stagger:.18,ease:"power3.out",scrollTrigger:{trigger:box,start:"top 80%",once:true}});
 });
 // counters
 $$(".stat b").forEach(b=>{const n=+b.dataset.n,o={v:0};ScrollTrigger.create({trigger:b,start:"top 90%",once:true,onEnter:()=>gsap.to(o,{v:n,duration:1.6,ease:"power2.out",onUpdate:()=>b.textContent=Math.round(o.v)})})});
 // hero parallax
 gsap.to("#home .wrap",{yPercent:-12,opacity:.2,ease:"none",scrollTrigger:{trigger:"#home",start:"top top",end:"bottom top",scrub:true}});
 // 3D objects react to scroll
 if(window.__bg)gsap.to(window.__bg.group.rotation,{y:Math.PI/2,ease:"none",scrollTrigger:{trigger:document.body,start:"top top",end:"bottom bottom",scrub:1.2}});
 // back to top visibility
 ScrollTrigger.create({start:600,onUpdate:s=>gsap.to(topBtn,{opacity:scrollY>600?1:0,pointerEvents:scrollY>600?"auto":"none",duration:.3,overwrite:true})});
 // 3D tilt on cards (fine pointers only)
 if(matchMedia("(hover:hover) and (pointer:fine)").matches){
  $$(".tilt").forEach(el=>{
   gsap.set(el,{transformPerspective:900});
   const rx=gsap.quickTo(el,"rotationX",{duration:.4,ease:"power2.out"}),ry=gsap.quickTo(el,"rotationY",{duration:.4,ease:"power2.out"});
   el.addEventListener("pointermove",e=>{const b=el.getBoundingClientRect();ry(((e.clientX-b.left)/b.width-.5)*10);rx(-((e.clientY-b.top)/b.height-.5)*10)});
   el.addEventListener("pointerleave",()=>{rx(0);ry(0)});
  });
  $$(".btn").forEach(b=>{const x=gsap.quickTo(b,"x",{duration:.3}),y=gsap.quickTo(b,"y",{duration:.3});
   b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.12);y((e.clientY-r.top-r.height/2)*.2)});
   b.addEventListener("pointerleave",()=>{x(0);y(0)})});
 }
}else{
 $$(".stat b").forEach(b=>b.textContent=b.dataset.n);
 $("#top").style.opacity=1;$("#top").style.pointerEvents="auto";
}

/* ---------- contact form ---------- */
const f=$("#form"),st=$("#status");
const WEB3FORMS_ACCESS_KEY="f8f7581a-a8a9-4920-bad9-c219982e0868";
const submitButton=$('button[type="submit"]',f);
const rules={
 name:[v=>v.trim().length>=2,"Enter your name (at least 2 characters)."],
 email:[v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),"Enter a valid email address, like name@example.com."],
 msg:[v=>v.trim().length>=10,"Write a message of at least 10 characters."]
};
function check(k){const i=$("#f-"+k),ok=rules[k][0](i.value);i.setAttribute("aria-invalid",!ok);$("#e-"+k).textContent=ok?"":rules[k][1];return ok}
Object.keys(rules).forEach(k=>$("#f-"+k).addEventListener("blur",()=>check(k)));
f.addEventListener("submit",e=>{
 e.preventDefault();
 const ok=Object.keys(rules).map(check).every(Boolean);
 if(!ok){st.textContent="Fix the highlighted fields and send again.";return}
 if(WEB3FORMS_ACCESS_KEY==="YOUR_WEB3FORMS_ACCESS_KEY"){
  st.textContent="Contact form setup is incomplete. Add your Web3Forms access key in app.js.";
  return;
 }
 const n=$("#f-name").value.trim(),m=$("#f-msg").value.trim(),em=$("#f-email").value.trim();
 submitButton.disabled=true;
 st.textContent="Sending your message...";
 fetch("https://api.web3forms.com/submit",{
  method:"POST",
  headers:{"Content-Type":"application/json","Accept":"application/json"},
  body:JSON.stringify({
   access_key:WEB3FORMS_ACCESS_KEY,
   name:n,
   email:em,
   message:m,
   subject:"Portfolio message from "+n
  })
 })
 .then(async response=>{
  const result=await response.json();
  if(!response.ok||result.success!==true){
   throw new Error(result.message||(result.body&&result.body.message)||"The email service rejected the message.");
  }
  st.textContent="Thank you for your message. Mohammed will contact you by email.";
  f.reset();
 })
 .catch(error=>{
  console.error("Contact form submission failed:",error);
  st.textContent="We couldn't send your message. Please try again or email Karimd1102@gmail.com.";
 })
 .finally(()=>{submitButton.disabled=false});
});
})();
