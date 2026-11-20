(() => {
  const original = document.querySelector('body > .home-header, body > .site-header, body > .header');
  if (!original) return;
  const identity = original.querySelector('.home-identity, .identity');
  if (!identity) return;
  const mobile = matchMedia('(max-width: 1200px)');
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
  toggle.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const icon = toggle.querySelector('path');
  const row = document.createElement('div');
  row.className = 'portfolio-mobile-header-row';
  row.append(author, toggle);
  header.append(row);
  const menu = document.createElement('div');
  menu.id = 'portfolio-mobile-menu';
  menu.className = 'portfolio-mobile-menu';
  menu.hidden = true;
  menu.innerHTML = '<nav aria-label="Разделы портфолио"></nav>';
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
  header.append(menu);
  document.body.prepend(header);
  document.documentElement.classList.add('has-mobile-header');

  const setOpen = open => {
    menu.hidden = !open;
    header.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    icon.setAttribute('d', open ? 'M6 6l12 12M18 6 6 18' : 'M4 6h16M4 12h16M4 18h16');
  };
  const close = (restoreFocus = true) => {
    if (menu.hidden) return;
    setOpen(false);
    if (restoreFocus) (mobile.matches ? toggle : identity).focus({ preventScroll: true });
  };
  toggle.addEventListener('click', () => {
    setOpen(menu.hidden);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault();
      close();
    }
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
  author.addEventListener('click', () => close(false));
  document.addEventListener('pointerdown', event => { if (!header.contains(event.target)) close(false); });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) close(false);
  });
  mobile.addEventListener('change', event => { if (!event.matches) close(); });
})();
