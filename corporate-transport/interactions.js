(() => {
document.documentElement.classList.add('js');

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const revealItems = document.querySelectorAll('.section > .eyebrow, .section > h2, .section > .group, .group > .grid, .group > .card');
revealItems.forEach(item => item.classList.add('reveal'));
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries, watcher) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      watcher.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -15px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const dialog = document.querySelector('.zoom-dialog');
const content = dialog.querySelector('.zoom-content');
const closeButton = dialog.querySelector('.zoom-close');
let lastTrigger;
let animatedStage;

function sizeAnimatedStage() {
  if (!animatedStage) return;
  const scale = Math.min(1.6, (innerWidth - 32) / 274.784, (innerHeight - 120) / 560.704);
  animatedStage.style.width = `${274.784 * scale}px`;
  animatedStage.style.height = `${560.704 * scale}px`;
  animatedStage.firstElementChild.style.transform = `scale(${scale})`;
}

document.querySelectorAll('.visual > .phone').forEach(phone => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = phone.className;
  button.setAttribute('aria-label', `Увеличить: ${phone.querySelector('img').alt}`);
  button.title = 'Увеличить мокап';
  while (phone.firstChild) button.append(phone.firstChild);
  phone.replaceWith(button);
  button.addEventListener('click', () => {
    lastTrigger = button;
    const enlarged = button.cloneNode(true);
    enlarged.removeAttribute('title');
    enlarged.removeAttribute('aria-label');
    enlarged.removeAttribute('type');
    const display = document.createElement('div');
    display.className = 'phone';
    display.append(enlarged.querySelector('img'));
    content.append(display);
    dialog.showModal();
    closeButton.focus();
  });
});

document.querySelectorAll('.preorder-phone').forEach(phone => {
  const label = phone.getAttribute('aria-label') || phone.querySelector('iframe').title;
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'phone-zoom-trigger';
  trigger.setAttribute('aria-label', `Увеличить: ${label}`);
  trigger.title = 'Увеличить мокап';
  phone.removeAttribute('role');
  phone.append(trigger);
  trigger.addEventListener('click', () => {
    lastTrigger = trigger;
    const clone = phone.cloneNode(true);
    clone.querySelector('.phone-zoom-trigger').remove();
    clone.inert = true;
    clone.querySelectorAll('iframe, img').forEach(item => item.loading = 'eager');
    animatedStage = document.createElement('div');
    animatedStage.className = 'zoom-phone-stage';
    animatedStage.setAttribute('role', 'img');
    animatedStage.setAttribute('aria-label', label);
    animatedStage.append(clone);
    content.append(animatedStage);
    sizeAnimatedStage();
    dialog.showModal();
    closeButton.focus();
  });
});

addEventListener('resize', sizeAnimatedStage);
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  content.replaceChildren();
  animatedStage = null;
  lastTrigger?.focus({ preventScroll: true });
});
})();
