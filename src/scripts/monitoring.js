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
const lightbox = document.querySelector('.lightbox');
const zoomImage = lightbox.querySelector('img');
const zoomContent = lightbox.querySelector('.lightbox-content');
const zoomSize = lightbox.querySelector('.zoom-size');
document.querySelectorAll('[data-zoom]').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    zoomImage.src = image.src;
    zoomImage.alt = image.alt;
    document.querySelector('#zoom-title').textContent = image.alt;
    zoomContent.classList.remove('actual-size');
    zoomSize.setAttribute('aria-pressed', 'false');
    document.body.classList.add('modal-open');
    lightbox.showModal();
  });
});
lightbox.querySelector('.zoom-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => document.body.classList.remove('modal-open'));
zoomSize.addEventListener('click', () => {
  const actual = zoomContent.classList.toggle('actual-size');
  zoomSize.setAttribute('aria-pressed', String(actual));
  zoomSize.setAttribute('aria-label', actual ? 'Вписать экран в окно' : 'Показать в исходном размере');
});
const backTop = document.querySelector('.back-top');
const updateBackTop = () => backTop.classList.toggle('visible', window.scrollY > 700);
window.addEventListener('scroll', updateBackTop, { passive: true });
updateBackTop();
