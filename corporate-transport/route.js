const screens=[...document.querySelectorAll('.screen')];
let current=0;
function show(index){
 const old=screens[current],next=screens[index];
 next.className='screen'+(index===0?' back':'');
 void next.offsetWidth;
 old.className='screen '+(index===0?'out-right':'out');
 next.className='screen active';
 current=index;
 setTimeout(()=>{if(old!==screens[current])old.className='screen';},450);
}
async function start(){
 await Promise.all(screens.map(img=>img.decode()));
 setInterval(()=>show(current===0?1:0),4000);
}
start();
