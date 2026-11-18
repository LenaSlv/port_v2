(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const revealTargets = document.querySelectorAll('.hero h1, .hero-sub, .chips, .hero-art, .case-section .eyebrow, .case-section h2, .case-section .section-board, .case-section .limitation, .portfolio-heading, .portfolio-track, .portfolio-footer h2, .portfolio-footer .contact-grid');
  revealTargets.forEach(element => element.classList.add('reveal'));
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.documentElement.classList.add('js');
    const observer = new IntersectionObserver((entries, watcher) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          watcher.unobserve(entry.target);
        }
      }
    }, {threshold: .06, rootMargin: '0px 0px -15px 0px'});
    revealTargets.forEach(element => observer.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  }

  const zoom = document.querySelector('.zoom-dialog');
  const stage = zoom.querySelector('.zoom-stage');
  let opener = null;
  const sizeZoom = () => {
    if (!zoom.open) return;
    const scale = Math.min(1.6, (innerWidth - 32) / 244, (innerHeight - 80) / 499);
    stage.style.width = `${244 * scale}px`;
    stage.style.height = `${499 * scale}px`;
    stage.firstElementChild.style.transform = `scale(${scale})`;
  };
  document.querySelectorAll('.soul-phone[data-zoom]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      const phone = document.createElement('div');
      phone.className = button.className.replace(/\bmockup\b/g, '').trim();
      phone.innerHTML = button.innerHTML;
      phone.inert = true;
      phone.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
      stage.replaceChildren(phone);
      zoom.showModal();
      sizeZoom();
      zoom.querySelector('.zoom-close').focus();
    });
  });
  zoom.querySelector('.zoom-close').addEventListener('click', () => zoom.close());
  zoom.addEventListener('click', event => { if (event.target === zoom) zoom.close(); });
  zoom.addEventListener('close', () => {
    stage.replaceChildren();
    stage.removeAttribute('style');
    opener?.focus({preventScroll: true});
  });
  addEventListener('resize', sizeZoom);
})();
