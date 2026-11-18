const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
function closeMenu() {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menu.hidden = expanded;
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Открыть меню' : 'Закрыть меню');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
const lightbox = document.querySelector('.zoom-dialog');
const zoomImage = lightbox.querySelector('.zoom-image');
const zoomContent = lightbox.querySelector('.zoom-dialog-content');
const zoomClose = lightbox.querySelector('.zoom-close');
let lastZoomTrigger = null;
document.querySelectorAll('[data-zoom]').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    lastZoomTrigger = button;
    zoomImage.src = image.dataset.zoomSrc || image.src;
    zoomImage.alt = image.alt;
    zoomImage.style.width = `${Math.round(image.naturalWidth * 1.25)}px`;
    zoomImage.hidden = false;
    zoomContent.classList.remove('has-prototype');
    zoomContent.querySelector('.zoom-hint').hidden = false;
    document.body.classList.add('modal-open');
    lightbox.showModal();
    zoomClose.focus();
  });
});
zoomClose.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
let activePrototypeStage = null;
lightbox.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  zoomImage.removeAttribute('src');
  zoomImage.removeAttribute('alt');
  zoomImage.style.removeProperty('width');
  if (activePrototypeStage) {
    activePrototypeStage.remove();
    activePrototypeStage = null;
  }
  zoomContent.classList.remove('has-prototype');
  zoomImage.hidden = false;
  zoomContent.querySelector('.zoom-hint').hidden = false;
  lastZoomTrigger?.focus({ preventScroll: true });
});
const overviewScreen = document.querySelector('.prototype-screen');
const overviewFrame = overviewScreen.querySelector('iframe');
function sizeOverviewEmbed() {
  overviewFrame.style.transform = `scale(${overviewScreen.clientWidth / 1280})`;
}
new ResizeObserver(sizeOverviewEmbed).observe(overviewScreen);
window.addEventListener('resize', sizeOverviewEmbed);
sizeOverviewEmbed();
function sizePrototypeZoom() {
  if (!activePrototypeStage) return;
  const { width, height, frame } = activePrototypeStage.zoomDimensions;
  const scale = Math.min(1.6, (lightbox.clientWidth - 32) / width, (lightbox.clientHeight - 120) / height);
  activePrototypeStage.style.width = `${width * scale}px`;
  activePrototypeStage.style.height = `${height * scale}px`;
  frame.style.transform = `scale(${scale})`;
}
function openPrototypeZoom(button) {
  const frameSource = button.closest('.prototype-screen, .animation-monitor').querySelector('iframe');
  const width = frameSource.clientWidth;
  const height = frameSource.clientHeight;
  const frame = frameSource.cloneNode();
  frame.loading = 'eager';
  frame.inert = true;
  frame.setAttribute('aria-hidden', 'true');
  frame.style.position = 'absolute';
  frame.style.left = '0';
  frame.style.top = '0';
  frame.style.width = `${width}px`;
  frame.style.height = `${height}px`;
  frame.style.transformOrigin = '0 0';
  frame.style.pointerEvents = 'none';
  activePrototypeStage = document.createElement('div');
  activePrototypeStage.className = 'lightbox-prototype-stage';
  activePrototypeStage.setAttribute('role', 'img');
  activePrototypeStage.setAttribute('aria-label', frameSource.title || button.getAttribute('aria-label'));
  activePrototypeStage.zoomDimensions = { width, height, frame };
  activePrototypeStage.append(frame);
  zoomContent.classList.add('has-prototype');
  zoomImage.hidden = true;
  zoomContent.querySelector('.zoom-hint').hidden = true;
  lastZoomTrigger = button;
  zoomContent.append(activePrototypeStage);
  document.body.classList.add('modal-open');
  lightbox.showModal();
  sizePrototypeZoom();
  zoomClose.focus();
}
document.querySelectorAll('[data-prototype-zoom], [data-animation-zoom]').forEach(button => button.addEventListener('click', () => openPrototypeZoom(button)));
window.addEventListener('resize', sizePrototypeZoom);
const backTop = document.querySelector('.back-top');
(() => {
  const header = document.querySelector('.site-header');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateScrollState = () => {
    const scrolled = window.scrollY > 80;
    header.classList.toggle('is-scrolled', scrolled);
    backTop.classList.toggle('visible', window.innerWidth <= 900 ? scrolled : true);
  };

  document.documentElement.classList.add('js');
  const revealItems = document.querySelectorAll(
    '.hero h1, .hero-subtitle, .hero-tags, .nda, .section-label, .role h2, .role .panel, .case-section h2, .section-intro, .solution-summary, .solution-grid, .diagnostics-display .screen-figure, .portfolio-heading'
  );
  revealItems.forEach(item => item.classList.add('reveal'));

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -15px 0px' });
    revealItems.forEach(item => observer.observe(item));
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' }));
  updateScrollState();
})();
