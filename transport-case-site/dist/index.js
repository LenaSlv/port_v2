document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const siteHeader = document.querySelector('.site-header');
const topButton = document.querySelector('.to-top');
let scrollScheduled = false;
function updateHeader() {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 80);
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateHeader);
  }
}, { passive: true });
updateHeader();
topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
});
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries, watcher) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        watcher.unobserve(entry.target);
      }
    }
  }, { threshold: 0.06, rootMargin: '0px 0px -15px 0px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
}

const dialog = document.querySelector('.zoom-dialog');
const dialogImage = dialog.querySelector('img');
const closeButton = dialog.querySelector('.zoom-close');
let lastTrigger = null;

document.querySelectorAll('[data-zoom]').forEach(button => {
  button.addEventListener('click', () => {
    const source = button.querySelector('img');
    lastTrigger = button;
    const thumbnail = source.getAttribute('src');
    const filename = thumbnail.split('/').pop();
    if (location.protocol === 'file:') {
      dialogImage.src = thumbnail;
    } else {
      dialogImage.src = `assets/zoom/${filename}`;
      dialogImage.style.maskImage = `url("${thumbnail}")`;
      dialogImage.style.webkitMaskImage = `url("${thumbnail}")`;
    }
    dialogImage.alt = source.alt;
    dialogImage.style.width = `${Math.round(source.naturalWidth * 1.25)}px`;
    dialog.showModal();
    closeButton.focus();
  });
});

closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  dialogImage.removeAttribute('src');
  dialogImage.style.removeProperty('width');
  dialogImage.style.removeProperty('mask-image');
  dialogImage.style.removeProperty('-webkit-mask-image');
  lastTrigger?.focus({ preventScroll: true });
});
