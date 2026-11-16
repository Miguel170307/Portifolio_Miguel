(() => {
const eligible=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
if(!eligible.matches)return;
const halo=document.createElement('div');
halo.className='cursor-halo';halo.setAttribute('aria-hidden','true');document.body.appendChild(halo);
let targetX=0,targetY=0,x=0,y=0,scale=1,targetScale=1,frame=0,visible=false,last=0;
function animate(now){
frame=0;
if(!visible||document.hidden||!eligible.matches)return;
const dt=last?Math.min(50,now-last):16.67;last=now;
const ease=1-Math.exp(-dt/12);
x+=(targetX-x)*ease;y+=(targetY-y)*ease;scale+=(targetScale-scale)*ease;
halo.style.transform='translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,0) scale('+scale.toFixed(3)+')';
if(Math.abs(targetX-x)+Math.abs(targetY-y)+Math.abs(targetScale-scale)>0.08)frame=requestAnimationFrame(animate);
else last=0;
}
function schedule(){if(!frame)frame=requestAnimationFrame(animate);}
function hide(){visible=false;last=0;cancelAnimationFrame(frame);frame=0;halo.classList.remove('is-visible');}
document.addEventListener('pointermove',e=>{
if(e.pointerType!=='mouse'||!eligible.matches)return;
targetX=e.clientX;targetY=e.clientY;
if(!visible){x=targetX;y=targetY;visible=true;halo.classList.add('is-visible');}
schedule();
},{passive:true});
document.addEventListener('pointerover',e=>{
if(e.pointerType!=='mouse')return;
const interactive=!!(e.target instanceof Element&&e.target.closest('a,button,input,select,textarea,[role="button"]'));
targetScale=interactive?1.45:1;halo.classList.toggle('is-link',interactive);schedule();
},{passive:true});
document.documentElement.addEventListener('pointerleave',hide);
window.addEventListener('blur',hide);
document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});
eligible.addEventListener('change',hide);
})();

