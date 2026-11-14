const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
function setMobileMenu(open, restoreFocus = true) {
  mobileMenuToggle.setAttribute('aria-expanded', String(open));
  mobileMenuToggle.setAttribute('aria-label', open ? 'Закрыть меню разделов' : 'Открыть меню разделов');
  mobileMenuPanel.hidden = !open;
  mobileMenuBackdrop.hidden = !open;
  document.body.classList.toggle('mobile-menu-open', open);
  if (open) mobileMenuPanel.querySelector('a').focus({preventScroll:true});
  else if (restoreFocus) mobileMenuToggle.focus({preventScroll:true});
}
mobileMenuToggle.addEventListener('click', () => setMobileMenu(mobileMenuPanel.hidden));
mobileMenuBackdrop.addEventListener('click', () => setMobileMenu(false));
mobileMenuPanel.addEventListener('click', event => {
  if (event.target.closest('a')) setMobileMenu(false, false);
});
document.addEventListener('keydown', event => {
  if (mobileMenuPanel.hidden) return;
  if (event.key === 'Escape') { event.preventDefault(); setMobileMenu(false); }
  if (event.key === 'Tab') {
    const targets = [mobileMenuToggle, ...mobileMenuPanel.querySelectorAll('a')];
    const index = targets.indexOf(document.activeElement);
    if (event.shiftKey && index === 0) { event.preventDefault(); targets.at(-1).focus(); }
    else if (!event.shiftKey && index === targets.length - 1) { event.preventDefault(); targets[0].focus(); }
  }
});
matchMedia('(max-width:900px)').addEventListener('change', event => {
  if (!event.matches) setMobileMenu(false, false);
});
document.querySelectorAll('.phone-grid--four,.trip-grid,.transfer-grid').forEach(gallery => {
  const hint = document.createElement('p');
  hint.className = 'mobile-swipe-hint';
  hint.textContent = 'Листайте экраны →';
  gallery.before(hint);
  gallery.tabIndex = 0;
  gallery.setAttribute('role', 'region');
  gallery.setAttribute('aria-label', 'Галерея экранов. Можно прокручивать по горизонтали');
});

// Touch devices use native scrolling. Mouse users can drag the same galleries.
document.querySelectorAll('.hero-stage,.phone-grid--four,.trip-grid,.transfer-grid').forEach(gallery => {
  let drag = null;
  let suppressClickUntil = 0;
  gallery.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || gallery.scrollWidth <= gallery.clientWidth + 1) return;
    drag = {id:event.pointerId, x:event.clientX, scroll:gallery.scrollLeft, moved:false};
    event.preventDefault();
  });
  gallery.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const delta = event.clientX - drag.x;
    if (!drag.moved && Math.abs(delta) > 6) {
      drag.moved = true;
      gallery.setPointerCapture(event.pointerId);
      gallery.classList.add('is-dragging-gallery');
    }
    if (drag.moved) gallery.scrollLeft = drag.scroll - delta;
  });
  function endDrag(event) {
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.moved) suppressClickUntil = performance.now() + 400;
    if (gallery.hasPointerCapture(event.pointerId)) gallery.releasePointerCapture(event.pointerId);
    gallery.classList.remove('is-dragging-gallery');
    drag = null;
  }
  gallery.addEventListener('pointerup', endDrag);
  gallery.addEventListener('pointercancel', endDrag);
  gallery.addEventListener('pointerleave', event => {
    if (drag && !drag.moved) endDrag(event);
  });
  gallery.addEventListener('click', event => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
});
