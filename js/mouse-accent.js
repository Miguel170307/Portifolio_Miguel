(() => {
const media=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
if(!media.matches)return;
const accent=document.createElement('div');accent.className='mouse-accent';accent.setAttribute('aria-hidden','true');document.body.appendChild(accent);
let x=-50,y=-50,frame=0;
function draw(){frame=0;accent.style.transform='translate3d('+x+'px,'+y+'px,0) scale(var(--cursor-scale))';}
function hide(){accent.classList.remove('is-visible');if(frame)cancelAnimationFrame(frame);frame=0;}
document.addEventListener('pointermove',e=>{
if(e.pointerType!=='mouse'||!media.matches)return;
x=e.clientX;y=e.clientY;accent.classList.add('is-visible');if(!frame)frame=requestAnimationFrame(draw);
},{passive:true});
document.addEventListener('pointerover',e=>{
if(e.pointerType!=='mouse')return;
accent.classList.toggle('is-hover',e.target instanceof Element&&!!e.target.closest('a,button,input,select,textarea,[role="button"]'));
},{passive:true});
document.documentElement.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);
document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});media.addEventListener('change',hide);
})();