const screens = [...document.querySelectorAll('.screen')];
let current=0;
function show(index,back=false){
 const old=screens[current],next=screens[index];
 if(old===next)return;
 next.classList.remove('active','out','out-right','back');
 if(back)next.classList.add('back');
 void next.offsetWidth;
 old.classList.remove('active');old.classList.add(back?'out-right':'out');
 next.classList.remove('back');next.classList.add('active');
 current=index;
 setTimeout(()=>{if(old!==screens[current])old.classList.remove('out','out-right');},350);
}
async function start(){
 await Promise.all([...document.images].map(img=>img.decode()));
 const steps=[[2200,1,false],[5200,2,true],[7600,3,false],[10600,4,true],[15800,5,false],[20800,0,true]];
 function cycle(){
 screens[4].classList.remove('date-chosen','time-chosen');
 for(const [at,state,back] of steps)setTimeout(()=>show(state,back),at);
 setTimeout(()=>screens[4].classList.add('date-chosen'),12600);
 setTimeout(()=>screens[4].classList.add('time-chosen'),14200);
}
 cycle();setInterval(cycle,24000);
}
start();
