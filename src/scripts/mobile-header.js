(() => {
  const original = document.querySelector('body > .home-header, body > .site-header, body > .header');
  if (!original) return;
  const identity = original.querySelector('.home-identity, .identity');
  if (!identity) return;
  const mobile = matchMedia('(max-width: 900px)');
  const header = document.createElement('header');
  header.className = 'portfolio-mobile-header';
  header.setAttribute('aria-label', 'Мобильная навигация');
  const author = identity.cloneNode(true);
  author.className = 'portfolio-mobile-identity';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'portfolio-mobile-toggle';
  toggle.setAttribute('aria-label', 'Открыть меню');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'portfolio-mobile-menu');
  toggle.setAttribute('aria-haspopup', 'dialog');
  toggle.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  header.append(author, toggle);
  const menu = document.createElement('dialog');
  menu.id = 'portfolio-mobile-menu';
  menu.className = 'portfolio-mobile-menu';
  menu.setAttribute('aria-labelledby', 'portfolio-mobile-menu-title');
  menu.innerHTML = '<div class="portfolio-mobile-menu-heading"><span id="portfolio-mobile-menu-title">Меню</span><button type="button" class="portfolio-mobile-close" aria-label="Закрыть меню"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div><nav aria-label="Разделы страницы"></nav>';
  const nav = menu.querySelector('nav');
  // WEB-056: the same portfolio navigation on every page, per the approved screenshot.
  const home = new URL('../../index.html', document.currentScript.src);
  const onHome = location.pathname === home.pathname || location.pathname === home.pathname.replace(/index\.html$/, '');
  const sections = [
    ['about', 'Обо мне'],
    ['projects', 'Проекты'],
    ['experience', 'Опыт работы'],
    ['contact', 'Контакты'],
  ];
  sections.forEach(([id, label]) => {
    const link = document.createElement('a');
    link.href = onHome || id === 'contact' ? `#${id}` : `${home.href}#${id}`;
    link.textContent = label;
    nav.append(link);
  });
  const contact = document.createElement('a');
  contact.href = '#contact';
  contact.className = 'portfolio-mobile-contact';
  contact.dataset.contactDialog = '';
  contact.textContent = 'Связаться со мной';
  menu.append(contact);
  document.body.prepend(header);
  document.body.append(menu);
  document.documentElement.classList.add('has-mobile-header');

  const close = () => { if (menu.open) menu.close(); };
  toggle.addEventListener('click', () => {
    menu.showModal();
    toggle.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('mobile-header-menu-open');
  });
  menu.querySelector('button').addEventListener('click', close);
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const targets = [...menu.querySelectorAll('a, button')];
    if (event.shiftKey && document.activeElement === targets[0]) {
      event.preventDefault(); targets.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === targets.at(-1)) {
      event.preventDefault(); targets[0].focus();
    }
  });
  menu.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('mobile-header-menu-open');
    (mobile.matches ? toggle : identity).focus({ preventScroll: true });
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) {
      close();
      // The contact dialog must return focus to a visible header control.
      if (event.target.closest('[data-contact-dialog]')) return;
      const href = event.target.closest('a').getAttribute('href');
      if (href?.startsWith('#')) {
        const target = document.getElementById(href.slice(1));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
      }
    }
  });
  let backdropDown = false;
  const outside = event => {
    const box = menu.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  menu.addEventListener('pointerdown', event => { backdropDown = event.target === menu && outside(event); });
  menu.addEventListener('click', event => { if (backdropDown && event.target === menu && outside(event)) close(); backdropDown = false; });
  mobile.addEventListener('change', event => { if (!event.matches) close(); });
})();
