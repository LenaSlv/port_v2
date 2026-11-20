(() => {
  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.header');
  const topButton = document.querySelector('.to-top');
  const updateScroll = () => {
    const scrolled = scrollY > 80;
    header.classList.toggle('is-scrolled', scrolled);
    topButton.classList.toggle('is-visible', scrolled);
  };
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  topButton.addEventListener('click', () => scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }));

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries, watcher) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        watcher.unobserve(entry.target);
      });
    }, { threshold: .06, rootMargin: '0px 0px -15px 0px' });
    reveals.forEach(item => observer.observe(item));
  } else reveals.forEach(item => item.classList.add('is-visible'));

  const dialog = document.querySelector('.zoom-dialog');
  const zoomImage = dialog.querySelector('img');
  const close = dialog.querySelector('.zoom-close');
  let trigger;
  document.querySelectorAll('.zoom-trigger').forEach(button => button.addEventListener('click', () => {
    trigger = button;
    const source = button.querySelector('img');
    const demo = button.closest('.payment-demo');
    if (demo) {
      const preview = demo.querySelector('iframe').cloneNode(false);
      preview.className = 'payment-preview';
      preview.loading = 'eager';
      zoomImage.hidden = true;
      zoomImage.after(preview);
    } else {
      zoomImage.src = source.src;
      zoomImage.alt = source.alt;
    }
    dialog.showModal();
    close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    zoomImage.removeAttribute('src');
    dialog.querySelector('.payment-preview')?.remove();
    zoomImage.hidden = false;
    trigger?.focus({ preventScroll: true });
  });
})();
