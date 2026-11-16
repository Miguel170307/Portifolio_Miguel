(() => {
const loader=document.getElementById('introLoader');
if(!loader)return;
const fill=loader.querySelector('.intro-loader__fill');
const track=loader.querySelector('[role="progressbar"]');
const skip=loader.querySelector('button');
const started=performance.now();
let loaded=document.readyState==='complete',done=false,frame;
const previousOverflow=document.body.style.overflow;
const background=Array.from(document.body.children).filter(el=>el!==loader&&!['SCRIPT','STYLE','LINK'].includes(el.tagName));
const inertState=background.map(el=>el.inert);
document.body.style.overflow='hidden';
background.forEach(el=>el.inert=true);
function finish(){
if(done)return;done=true;cancelAnimationFrame(frame);clearTimeout(safety);
background.forEach((el,i)=>el.inert=inertState[i]);
document.body.style.overflow=previousOverflow;
fill.style.width='100%';track.setAttribute('aria-valuenow','100');
const focused=loader.contains(document.activeElement);
loader.classList.add('is-leaving');
setTimeout(()=>{loader.hidden=true;if(focused){const target=document.querySelector('main');if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});}}},450);
}
const safety=setTimeout(finish,8000);
skip.addEventListener('click',finish);
window.addEventListener('load',()=>loaded=true,{once:true});
window.addEventListener('pageshow',event=>{if(event.persisted)finish()});
function tick(now){
if(done)return;
const elapsed=now-started;
const progress=loaded?Math.min(100,elapsed/42):Math.min(90,elapsed/65);
fill.style.width=progress+'%';track.setAttribute('aria-valuenow',String(Math.round(progress)));
if(loaded&&elapsed>=4200){finish();return;}
frame=requestAnimationFrame(tick);
}
frame=requestAnimationFrame(tick);
})();