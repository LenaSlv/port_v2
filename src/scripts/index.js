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

const zoomAssets = new URL('../assets/zoom/', document.currentScript.src);
const dialog = document.querySelector('.zoom-dialog');
const dialogImage = dialog.querySelector('img');
const closeButton = dialog.querySelector('.zoom-close');
let lastTrigger = null;
let zoomPhoneStage = null;

function sizeZoomPhone() {
  if (!zoomPhoneStage) return;
  const scale = Math.min(1.6, (window.innerWidth - 32) / 274.784, (window.innerHeight - 120) / 560.704);
  zoomPhoneStage.style.width = `${274.784 * scale}px`;
  zoomPhoneStage.style.height = `${560.704 * scale}px`;
  zoomPhoneStage.firstElementChild.style.transform = `scale(${scale})`;
}

document.querySelectorAll('.management-phone').forEach(phone => {
  const animation = phone.querySelector('iframe');
  const label = animation ? animation.title : phone.getAttribute('aria-label');
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'phone-zoom-trigger';
  trigger.setAttribute('aria-label', `Увеличить: ${label}`);
  trigger.title = 'Увеличить мокап';
  if (phone.getAttribute('role') === 'img') phone.removeAttribute('role');
  trigger.addEventListener('click', () => {
    const enlargedPhone = phone.cloneNode(true);
    enlargedPhone.querySelector('.phone-zoom-trigger').remove();
    enlargedPhone.inert = true;
    enlargedPhone.querySelectorAll('iframe, img').forEach(element => element.loading = 'eager');
    zoomPhoneStage = document.createElement('div');
    zoomPhoneStage.className = 'zoom-phone-stage';
    zoomPhoneStage.setAttribute('role', 'img');
    zoomPhoneStage.setAttribute('aria-label', label);
    zoomPhoneStage.append(enlargedPhone);
    dialog.append(zoomPhoneStage);
    dialog.classList.add('is-phone-zoom');
    lastTrigger = trigger;
    sizeZoomPhone();
    dialog.showModal();
    closeButton.focus();
  });
  phone.append(trigger);
});
window.addEventListener('resize', sizeZoomPhone);

document.querySelectorAll('[data-zoom]').forEach(button => {
  button.addEventListener('click', () => {
    const source = button.querySelector('img');
    lastTrigger = button;
    const thumbnail = source.getAttribute('src');
    const filename = thumbnail.split('/').pop();
    if (source.dataset.zoomSrc) {
      dialogImage.src = source.dataset.zoomSrc;
    } else if (location.protocol === 'file:') {
      dialogImage.src = thumbnail;
    } else {
      dialogImage.src = new URL(filename, zoomAssets).href;
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
  zoomPhoneStage?.remove();
  zoomPhoneStage = null;
  dialog.classList.remove('is-phone-zoom');
  dialogImage.removeAttribute('src');
  dialogImage.style.removeProperty('width');
  dialogImage.style.removeProperty('mask-image');
  dialogImage.style.removeProperty('-webkit-mask-image');
  lastTrigger?.focus({ preventScroll: true });
});

