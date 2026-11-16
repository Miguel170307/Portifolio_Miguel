(() => {
const links=document.querySelectorAll('.card__preview');
function size(link){const frame=link.querySelector('iframe');if(frame)frame.style.transform='scale('+(link.clientWidth/1200)+')';}
links.forEach(size);
if('ResizeObserver' in window){const observer=new ResizeObserver(entries=>entries.forEach(entry=>size(entry.target)));links.forEach(link=>observer.observe(link));}
else window.addEventListener('resize',()=>links.forEach(size),{passive:true});
})();