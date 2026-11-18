const topButton = document.querySelector('.to-top');
const caseHeader = document.querySelector('.header');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function updateTopButton() {
  const isScrolled = window.scrollY > 80;
  topButton.classList.toggle('is-visible', isScrolled);
  caseHeader.classList.toggle('is-scrolled', isScrolled);
}
window.addEventListener('scroll', updateTopButton, { passive: true });
updateTopButton();
topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
});
