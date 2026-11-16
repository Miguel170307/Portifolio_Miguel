(() => {
const hero=document.querySelector('.hero');
if(!hero||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const name=hero.querySelector('.hero__nome');if(!name)return;
hero.querySelectorAll('[data-reveal]').forEach(el=>el.removeAttribute('data-reveal'));
const original=name.textContent;name.setAttribute('aria-label',original);name.textContent='';
Array.from(original).forEach((letter,i)=>{const span=document.createElement('span');span.className='hero-character';span.setAttribute('aria-hidden','true');span.style.setProperty('--letter-delay',(0.15+i*.045)+'s');span.textContent=letter;name.appendChild(span)});
hero.classList.add('type-ready');
function play(){hero.classList.add('type-running')}
const loader=document.getElementById('introLoader');
if(loader&&!loader.hidden){const observer=new MutationObserver(()=>{if(loader.hidden){observer.disconnect();play()}});observer.observe(loader,{attributes:true,attributeFilter:['hidden']});}else play();
})();