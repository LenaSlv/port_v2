(() => {
  const demo = document.querySelector('.demo');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const images = [...document.images];
  Promise.all(images.map(image => image.decode().catch(() => {}))).then(() => {
    if (reducedMotion.matches) return;
    const run = () => {
      demo.classList.remove('is-compact');
      setTimeout(() => demo.classList.add('is-compact'), 2200);
      setTimeout(() => demo.classList.remove('is-compact'), 5400);
    };
    run();
    setInterval(run, 8000);
  });
})();
