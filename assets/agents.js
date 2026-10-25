(function(){
const root=document.querySelector(".bza");if(!root)return;
const $=s=>root.querySelector(s);
const BASE="https://bizos-api-v2.onrender.com/api/public",ORG="5fea8e74-cb00-4d06-a2ab-588f5c18d2f1";
// nodes: [id, x, y, icon, label, sub, ai?]  edges: [from, to]
const A=[
 {tab:"WhatsApp Assistant",title:"Your WhatsApp replies itself, 24x7",
  text:"Customer messages are understood by AI, answered instantly, and every chat becomes a lead in your CRM.",
  nodes:[["t",70,230,"💬","On New Message","WhatsApp"],["ai",230,230,"🤖","Understand Intent","Claude AI",1],["faq",400,120,"📄","Answer FAQ","Reply: Text"],["qr",400,340,"💳","Send Payment QR","UPI"],["bk",570,230,"📅","Book Appointment","Calendar"],["crm",740,230,"🗂️","Save Lead","BizOS CRM"],["rp",900,230,"✅","Send Confirmation","WhatsApp"]],
  edges:[["t","ai"],["ai","faq"],["ai","qr"],["faq","bk"],["qr","bk"],["bk","crm"],["crm","rp"]]},
 {tab:"Lead Gen & Follow-ups",title:"Leads found, emailed and followed up",
  text:"The agent finds prospects, writes a personal email for each one and follows up until they book a call.",
  nodes:[["t",70,230,"⏰","Every Morning","Schedule"],["mp",230,120,"📍","Find Leads","Google Maps"],["li",230,340,"🔗","Find Leads","LinkedIn"],["mg",390,230,"🔀","Combine","Merge"],["ai",550,230,"🤖","Write Email","Claude AI",1],["em",710,230,"📧","Send Email","Gmail"],["fu",870,230,"🔁","Follow-up","Day 1 · 3 · 7"]],
  edges:[["t","mp"],["t","li"],["mp","mg"],["li","mg"],["mg","ai"],["ai","em"],["em","fu"]]},
 {tab:"SEO + AI Search",title:"Found on Google and in ChatGPT answers",
  text:"Every week the agent checks your rankings, improves your pages for search and AI engines, and sends a report.",
  nodes:[["t",70,230,"🗓️","Every Week","Schedule"],["kw",230,120,"🔍","Check Keywords","Search Console"],["cp",230,340,"🕵️","Competitors","Scrape"],["ai",410,230,"🤖","Optimise Pages","Claude AI",1],["wp",580,120,"🌐","Update Site","WordPress"],["ix",580,340,"📡","Request Indexing","IndexNow"],["rp",780,230,"📊","Weekly Report","WhatsApp"]],
  edges:[["t","kw"],["t","cp"],["kw","ai"],["cp","ai"],["ai","wp"],["ai","ix"],["wp","rp"],["ix","rp"]]},
 {tab:"Social Media Manager",title:"Fresh posts every day, without the effort",
  text:"The agent spots trending topics in your niche, writes the post and image, and publishes to Instagram and Facebook.",
  nodes:[["t",70,230,"🔥","Trending Topics","Daily"],["ai",240,230,"🤖","Write Post","Claude AI",1],["img",410,230,"🎨","Create Image","Design"],["ig",590,120,"📸","Post","Instagram"],["fb",590,340,"👍","Post","Facebook"],["st",780,230,"📈","Track Results","Insights"]],
  edges:[["t","ai"],["ai","img"],["img","ig"],["img","fb"],["ig","st"],["fb","st"]]},
 {tab:"Website Chatbot",title:"Website visitors turned into enquiries",
  text:"An AI chat on your site answers questions any time, collects name and number, and alerts you on WhatsApp.",
  nodes:[["t",70,230,"🌐","Visitor Asks","Website Chat"],["ai",240,230,"🤖","Answer","Claude AI",1],["cap",410,230,"📝","Capture Details","Name · Phone"],["crm",590,120,"🗂️","Create Lead","BizOS CRM"],["wa",590,340,"🔔","Alert Owner","WhatsApp"],["fu",780,230,"✉️","Auto Follow-up","Email"]],
  edges:[["t","ai"],["ai","cap"],["cap","crm"],["cap","wa"],["crm","fu"],["wa","fu"]]}];

const H=46,svg=$(".bza-canvas svg"),tabs=$(".bza-tabs"),copy=$(".bza-copy");
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let cur=0,timer;
function draw(i){
  cur=i;const a=A[i],pos={};a.nodes.forEach(n=>pos[n[0]]=n);
  tabs.querySelectorAll(".bza-tab").forEach((t,j)=>{t.classList.toggle("on",j==i);t.setAttribute("aria-selected",j==i)});
  copy.innerHTML=`<div class="fade"><h2>${esc(a.title)}</h2><p>${esc(a.text)}</p><button class="bza-go" data-get="${i}">Get yours</button></div>`;
  let w="",n="";
  a.edges.forEach(([f,t])=>{const p=pos[f],q=pos[t],x1=p[1]+H,y1=p[2],x2=q[1]-H,y2=q[2],m=(x1+x2)/2;
    w+=`<path class="w" d="M${x1},${y1} C${m},${y1} ${m},${y2} ${x2},${y2}"/><circle class="port" cx="${x1}" cy="${y1}" r="4"/><circle class="port" cx="${x2}" cy="${y2}" r="4"/>`;});
  a.nodes.forEach(([id,x,y,ic,lb,sb,ai])=>{n+=`<g class="n${ai?" ai":""}"><rect x="${x-H}" y="${y-H}" width="${H*2}" height="${H*2}" rx="${id=="t"?H:16}"/><text class="ic" x="${x}" y="${y}">${ic}</text><text class="lb" x="${x}" y="${y+H+20}">${esc(lb)}</text><text class="sb" x="${x}" y="${y+H+36}">${esc(sb)}</text></g>`;});
  const l=a.nodes[a.nodes.length-1];
  n+=`<path class="w" d="M${l[1]+H},${l[2]} H${l[1]+H+28}"/><g class="plus"><rect x="${l[1]+H+28}" y="${l[2]-14}" width="28" height="28" rx="6"/><text x="${l[1]+H+42}" y="${l[2]}">+</text></g>`;
  svg.setAttribute("aria-label",a.tab+" workflow: "+a.nodes.map(x=>x[4]).join(", "));
  svg.innerHTML=`<g class="fade">${w}${n}</g>`;
}
tabs.innerHTML=A.map((a,i)=>`<button class="bza-tab" role="tab" data-i="${i}">${esc(a.tab)}</button>`).join("");
tabs.onclick=e=>{const b=e.target.closest(".bza-tab");if(b){clearInterval(timer);draw(+b.dataset.i);}};
draw(0);timer=setInterval(()=>draw((cur+1)%A.length),7000);

const dlg=$(".bza-dlg"),lf=$(".bza-lf"),lmsg=$(".bza-lmsg");let pick="";
root.addEventListener("click",e=>{const b=e.target.closest("[data-get]");if(!b)return;
  pick=b.dataset.get!==""?A[+b.dataset.get].tab:"AI Agent";
  dlg.querySelector("h3").textContent="Get your "+pick;lmsg.textContent="";dlg.showModal();});
$(".bza-cancel").onclick=()=>dlg.close();
lf.onsubmit=async e=>{e.preventDefault();const f=new FormData(lf),sb=$(".bza-lsub");sb.disabled=true;lmsg.textContent="Sending…";
  const body={org_key:ORG,name:f.get("name").trim(),phone:f.get("phone").trim(),source:"agents-page",
    message:`Wants: ${pick}\nBusiness: ${f.get("business")||"-"}\n${f.get("note")||""}`};
  if(f.get("email"))body.email=f.get("email").trim();
  try{const r=await fetch(BASE+"/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});if(!r.ok)throw 0;
    lmsg.textContent="✅ Done! Our team will WhatsApp you soon.";lf.reset();setTimeout(()=>dlg.close(),2500);
  }catch(_){lmsg.innerHTML='Could not send. Please <a href="https://wa.me/918368883484">WhatsApp us</a>.';}
  sb.disabled=false;};

const log=$(".bza-log"),inp=$(".bza-cf input"),sendB=$(".bza-cf button");let msgs=[];
function add(r,t){const d=document.createElement("div");d.className="bza-m "+(r=="user"?"u":"a");d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight;return d;}
add("assistant","Hi! 👋 What does your business do, and what would you like to automate?");
$(".bza-cf").onsubmit=async e=>{e.preventDefault();const t=inp.value.trim();if(!t||sendB.disabled)return;
  add("user",t);msgs.push({role:"user",content:t});inp.value="";sendB.disabled=true;const w=add("assistant","…");
  try{const r=await fetch(BASE+"/agent-chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({org_key:ORG,messages:msgs.slice(-40)})});
    if(!r.ok)throw 0;const j=await r.json();w.textContent=j.reply;msgs.push({role:"assistant",content:j.reply});
  }catch(_){w.textContent="Connection issue. Please WhatsApp us at +91 83688 83484.";msgs.pop();}
  sendB.disabled=false;inp.focus();};
})();
