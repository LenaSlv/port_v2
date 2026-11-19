(() => {
  const assets = new URL('../assets/home/', document.currentScript.src);
  const dialog = document.createElement('dialog');
  dialog.className = 'portfolio-contact-dialog';
  dialog.id = 'portfolio-contact-dialog';
  dialog.setAttribute('aria-labelledby', 'portfolio-contact-title');
  dialog.setAttribute('aria-describedby', 'portfolio-contact-description');
  dialog.innerHTML = `<h2 id="portfolio-contact-title">Свяжитесь со мной</h2>
    <p id="portfolio-contact-description">Расскажу о&nbsp;своих проектах подробнее и&nbsp;отвечу на&nbsp;вопросы</p>
    <div class="portfolio-contact-options">
      <a href="https://t.me/Lena_Suloeva" target="_blank" rel="noopener noreferrer"><small>Telegram</small><span><img src="${new URL('telegram.svg', assets)}" width="20" height="20" alt="">@Lena_Suloeva</span></a>
      <a href="mailto:lensuloeva@yandex.ru"><small>Почта</small><span><img src="${new URL('email.svg', assets)}" width="24" height="24" alt="">lensuloeva@yandex.ru</span></a>
    </div>
    <button class="portfolio-contact-close" type="button" aria-label="Закрыть окно контактов" autofocus><img src="${new URL('close.svg', assets)}" width="18" height="18" alt=""></button>`;
  document.body.append(dialog);
  let opener;
  const triggers = document.querySelectorAll('[data-contact-dialog], .contact-cta, .contact-button, .mobile-contact-link');
  triggers.forEach(trigger => {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    trigger.addEventListener('click', event => {
      event.preventDefault();
      // Let an enclosing mobile menu finish closing before opening the dialog.
      queueMicrotask(() => {
        if (dialog.open) return;
        opener = trigger;
        document.documentElement.classList.add('portfolio-contact-open');
        dialog.showModal();
      });
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const targets = [...dialog.querySelectorAll('a, button')];
    const first = targets[0], last = targets.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  let backdropDown = false;
  const outside = event => {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropDown && event.target === dialog && outside(event)) dialog.close();
    backdropDown = false;
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('portfolio-contact-open');
    const target = opener?.getClientRects().length ? opener : [...document.querySelectorAll('.portfolio-mobile-toggle, .mobile-menu-toggle, .menu-toggle, .home-contact, .contact-button, .contact-cta')].find(element => element.getClientRects().length);
    target?.focus({preventScroll: true});
  });
})();
