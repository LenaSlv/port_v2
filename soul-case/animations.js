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
  const imageModes = ['fit', '1', '1.5', '2'];
  let opener = null;
  let imageMode = '1.5';
  let pan = null;
  let panMoved = false;
  let imageClick = false;

  const isImageZoom = () => zoom.classList.contains('is-image-zoom');

  const sizeImage = () => {
    const image = stage.querySelector('img');
    if (!image?.naturalWidth) return;
    const naturalWidth = image.naturalWidth;
    const fitWidth = Math.min(naturalWidth, Math.max(280, innerWidth - 40));
    const width = imageMode === 'fit'
      ? fitWidth
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
  const changeImageMode = (mode, x = viewport.clientWidth / 2, y = viewport.clientHeight / 2) => {
    const before = stage.getBoundingClientRect();
    const bounds = viewport.getBoundingClientRect();
    const pointX = (bounds.left + x - before.left) / before.width;
    const pointY = (bounds.top + y - before.top) / before.height;
    imageMode = mode;
    sizeImage();
    const after = stage.getBoundingClientRect();
    viewport.scrollLeft += after.left + pointX * after.width - bounds.left - x;
    viewport.scrollTop += after.top + pointY * after.height - bounds.top - y;
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
      image.decoding = 'async';
      zoom.classList.add('is-loading');
      zoom.setAttribute('aria-busy', 'true');
      const showStart = () => {
        if (!zoom.open || stage.firstElementChild !== image || !image.naturalWidth) return;
        zoom.classList.remove('is-loading');
        zoom.setAttribute('aria-busy', 'false');
        sizeZoom();
        // Start at the entry/onboarding branch, beyond the empty left margin.
        viewport.scrollTo(stage.offsetLeft + stage.offsetWidth * 0.24, 0);
      };
      image.addEventListener('load', async () => {
        try { await image.decode(); } catch { /* load succeeded; use the loaded image */ }
        showStart();
      }, {once: true});
      image.addEventListener('error', () => {
        if (stage.firstElementChild !== image) return;
        zoom.classList.remove('is-loading');
        zoom.setAttribute('aria-busy', 'false');
        stage.textContent = 'Не удалось загрузить карту. Закройте окно и попробуйте снова.';
      }, {once: true});
      image.src = source.dataset.zoomSrc || source.currentSrc || source.src;
      stage.replaceChildren(image);
      imageMode = '1.5';
      zoom.classList.add('is-image-zoom');
      zoom.setAttribute('aria-label', 'Карта пользовательских сценариев Soul — увеличенный просмотр');
      tools.hidden = false;
      zoom.showModal();
      sizeZoom();
      if (image.complete && image.naturalWidth) image.decode().then(showStart, showStart);
      zoom.querySelector('.zoom-close').focus({preventScroll: true});
    });
  });

  tools.addEventListener('click', event => {
    const button = event.target.closest('[data-zoom-mode]');
    if (!button || !isImageZoom()) return;
    changeImageMode(button.dataset.zoomMode);
  });

  viewport.addEventListener('wheel', event => {
    if (!isImageZoom() || !event.ctrlKey) return;
    event.preventDefault();
    const index = imageModes.indexOf(imageMode);
    const next = imageModes[Math.min(imageModes.length - 1, Math.max(0, index + (event.deltaY < 0 ? 1 : -1)))];
    if (next === imageMode) return;
    const bounds = viewport.getBoundingClientRect();
    changeImageMode(next, event.clientX - bounds.left, event.clientY - bounds.top);
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
    zoom.classList.remove('is-image-zoom', 'is-pixelated', 'is-panning', 'is-loading');
    zoom.setAttribute('aria-busy', 'false');
    zoom.setAttribute('aria-label', 'Увеличенный экран Soul');
    opener?.focus({preventScroll: true});
  });
  addEventListener('resize', sizeZoom);
})();
