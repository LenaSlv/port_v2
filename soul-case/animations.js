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
  const viewport = zoom.querySelector('.zoom-viewport');
  const stage = zoom.querySelector('.zoom-stage');
  const tools = zoom.querySelector('[data-zoom-tools]');
  const imageModes = ['fit', '1', '2', '3'];
  let opener = null;
  let imageMode = '2';
  let pan = null;
  let panMoved = false;
  let imageClick = false;

  const isImageZoom = () => zoom.classList.contains('is-image-zoom');

  const sizeImage = () => {
    const image = stage.querySelector('img');
    if (!image?.naturalWidth) return;
    const naturalWidth = image.naturalWidth;
    const width = imageMode === 'fit'
      ? Math.min(naturalWidth, Math.max(280, innerWidth - 40))
      : Math.round(naturalWidth * Number(imageMode));
    stage.style.width = `${width}px`;
    stage.style.height = 'auto';
    zoom.classList.toggle('is-pixelated', width >= naturalWidth * 2);
    tools.querySelectorAll('[data-zoom-mode]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.zoomMode === imageMode));
    });
  };

  const sizeZoom = () => {
    if (!zoom.open) return;
    if (isImageZoom()) {
      sizeImage();
      return;
    }
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
  document.querySelectorAll('.flow-zoom[data-zoom]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      const source = button.querySelector('img');
      const image = document.createElement('img');
      image.alt = source.alt;
      image.draggable = false;
      image.addEventListener('load', sizeZoom, {once: true});
      image.src = source.dataset.zoomSrc || source.currentSrc || source.src;
      stage.replaceChildren(image);
      imageMode = '2';
      zoom.classList.add('is-image-zoom');
      zoom.setAttribute('aria-label', 'Карта пользовательских сценариев Soul — увеличенный просмотр');
      tools.hidden = false;
      zoom.showModal();
      sizeZoom();
      viewport.scrollTo(0, 0);
      zoom.querySelector('.zoom-close').focus({preventScroll: true});
    });
  });

  tools.addEventListener('click', event => {
    const button = event.target.closest('[data-zoom-mode]');
    if (!button || !isImageZoom()) return;
    imageMode = button.dataset.zoomMode;
    sizeImage();
  });

  viewport.addEventListener('wheel', event => {
    if (!isImageZoom() || !event.ctrlKey) return;
    event.preventDefault();
    const index = imageModes.indexOf(imageMode);
    const next = imageModes[Math.min(imageModes.length - 1, Math.max(0, index + (event.deltaY < 0 ? 1 : -1)))];
    if (next === imageMode) return;
    imageMode = next;
    sizeImage();
  }, {passive: false});

  viewport.addEventListener('pointerdown', event => {
    if (!isImageZoom() || event.button !== 0 || event.pointerType !== 'mouse') return;
    if (event.target.closest('button')) return;
    imageClick = event.target !== viewport;
    pan = {x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop};
    panMoved = false;
    viewport.setPointerCapture(event.pointerId);
    zoom.classList.add('is-panning');
  });
  viewport.addEventListener('pointermove', event => {
    if (!pan) return;
    const dx = event.clientX - pan.x;
    const dy = event.clientY - pan.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) panMoved = true;
    viewport.scrollLeft = pan.left - dx;
    viewport.scrollTop = pan.top - dy;
  });
  const endPan = event => {
    if (!pan) return;
    pan = null;
    zoom.classList.remove('is-panning');
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
  };
  viewport.addEventListener('pointerup', endPan);
  viewport.addEventListener('pointercancel', endPan);

  zoom.querySelector('.zoom-close').addEventListener('click', () => zoom.close());
  zoom.addEventListener('click', event => {
    if (event.target !== zoom && event.target !== viewport) return;
    if (panMoved) {
      panMoved = false;
      return;
    }
    if (imageClick) {
      imageClick = false;
      return;
    }
    zoom.close();
  });
  zoom.addEventListener('close', () => {
    stage.replaceChildren();
    stage.removeAttribute('style');
    pan = null;
    panMoved = false;
    imageClick = false;
    tools.hidden = true;
    zoom.classList.remove('is-image-zoom', 'is-pixelated', 'is-panning');
    zoom.setAttribute('aria-label', 'Увеличенный экран Soul');
    opener?.focus({preventScroll: true});
  });
  addEventListener('resize', sizeZoom);
})();
