const demo = document.querySelector('.pass-demo');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function play() {
  await Promise.all([...document.images].map(img => img.decode()));
  let cycle = 0;
  while (true) {
    demo.dataset.cycle = String(++cycle);
    demo.dataset.state = 'warning';
    await pause(2600);
    demo.dataset.state = 'topup';
    document.querySelector('.topup-screen').setAttribute('aria-hidden', 'false');
    await pause(2800);
    demo.dataset.state = 'details';
    await pause(4000);
    demo.dataset.state = 'topup';
    await pause(1400);
    demo.dataset.state = 'warning';
    document.querySelector('.topup-screen').setAttribute('aria-hidden', 'true');
    await pause(1000);
  }
}
play();
