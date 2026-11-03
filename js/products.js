const WA="971558431820",EM="supply@mideastmarine.com",PER=48;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
function card(code,desc,unit,grp){const sec=code.slice(0,2),t=`IMPA ${code} – ${desc}`;
const msg=encodeURIComponent(`Hello Mideast Marine, please quote:\nIMPA ${code} – ${desc}${unit?' ('+unit+')':''}\nQty: \nVessel: \nPort: \nETA: `);
return `<div class="pc2"><div class="pimg">${SVGCARD(sec,(grp||desc).split(" > ").pop(),code)}</div><h4>${esc(t)}</h4><p class="un">Unit: ${esc(unit||'-')}</p><a class="rtq" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${msg}">Request to Quote</a><a class="eml" href="mailto:${EM}?subject=${encodeURIComponent('RFQ - IMPA '+code)}&body=${msg}">or email us</a></div>`}
function initTiles(){document.querySelectorAll('.cti').forEach(e=>{e.innerHTML=SVGCARD(e.dataset.s,'IMPA '+e.dataset.s,'IMPA '+e.dataset.s)})}
let SD=null;
function initGlobal(){const q=document.getElementById('gq'),r=document.getElementById('gres'),tiles=document.getElementById('tiles');let tm;
q.oninput=()=>{clearTimeout(tm);tm=setTimeout(async()=>{const s=q.value.trim().toUpperCase();if(s.length<2){r.innerHTML='';tiles.style.display='';return}
if(!SD){r.innerHTML='<p class="none">Loading catalogue…</p>';SD=await (await fetch('data/search.json')).json()}
const words=s.split(/\s+/);const hit=SD.filter(([c,d])=>words.every(w=>c.startsWith(w)||d.toUpperCase().includes(w)));
tiles.style.display='none';r.innerHTML=`<div class="cbar"><span>${hit.length.toLocaleString()} results for "${esc(q.value)}"${hit.length>96?' (showing first 96)':''}</span></div><div class="pgrid2">${hit.slice(0,96).map(([c,d,u])=>card(c,d,u,'')).join('')||'<p class="none">No matching code. Send your requisition to '+EM+' and we will quote.</p>'}</div>`},250)}}
async function initSection(sec,base){const D=await (await fetch(base+sec+'.json')).json();const G=D.g;
const fg=document.getElementById('fg'),fu=document.getElementById('fu'),q=document.getElementById('q'),so=document.getElementById('so'),grid=document.getElementById('grid'),pg=document.getElementById('pg'),cnt=document.getElementById('cnt');
G.forEach((g,i)=>fg.insertAdjacentHTML('beforeend',`<option value="${i}">${esc(g)}</option>`));
[...new Set(D.i.map(x=>x[2]))].sort().forEach(u=>fu.insertAdjacentHTML('beforeend',`<option>${esc(u)}</option>`));
let page=1;function go(){const s=q.value.trim().toUpperCase().split(/\s+/).filter(Boolean),g=fg.value,u=fu.value;
let L=D.i.filter(x=>(g===''||x[3]==g)&&(!u||x[2]===u)&&s.every(w=>x[0].startsWith(w)||x[1].toUpperCase().includes(w)));
const o=so.value;L.sort((a,b)=>o==='az'?a[1].localeCompare(b[1]):o==='za'?b[1].localeCompare(a[1]):o==='code-d'?b[0].localeCompare(a[0]):a[0].localeCompare(b[0]));
const n=Math.max(1,Math.ceil(L.length/PER));page=Math.min(page,n);
cnt.textContent=`${L.length.toLocaleString()} items · page ${page} of ${n}`;
grid.innerHTML=L.slice((page-1)*PER,page*PER).map(x=>card(x[0],x[1],x[2],G[x[3]])).join('')||'<p class="none">No matching items. Send your requisition to '+EM+'.</p>';
let p='';const btn=(i,l)=>`<button ${i===page?'class="on"':''} data-p="${i}">${l||i}</button>`;if(page>1)p+=btn(page-1,'‹ Prev');
for(let i=Math.max(1,page-2);i<=Math.min(n,page+2);i++)p+=btn(i);if(page<n)p+=btn(page+1,'Next ›');pg.innerHTML=p;
pg.querySelectorAll('button').forEach(b=>b.onclick=()=>{page=+b.dataset.p;go();window.scrollTo({top:grid.offsetTop-120})})}
[fg,fu,so].forEach(e=>e.onchange=()=>{page=1;go()});let tm;q.oninput=()=>{clearTimeout(tm);tm=setTimeout(()=>{page=1;go()},200)};go()}
