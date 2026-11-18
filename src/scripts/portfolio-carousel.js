(() => {
// Shared catalogue: each case carousel excludes its own stable id.
const portfolioCases = [
  { id: 'transport', title: 'Единый транспортный сервис для городских и междугородних поездок', badge: 'Мобильное приложение · B2C', tags: 'iOS / Android', href: 'transport-case/index.html', image: 'src/assets/figma-audit/hero.png', alt: 'Экраны единого транспортного приложения' },
  { id: 'corporate', title: 'Сервис по заказу корпоративного транспорта', badge: 'Внутренний продукт · B2B2E', tags: 'iOS / Android · NDA', href: 'corporate-transport/index.html', image: 'src/assets/portfolio/corporate.png', alt: 'Оплата корпоративной поездки по QR-коду на телефоне' },
  { id: 'soul', title: 'Платформа для поиска компании и активностей в путешествиях', badge: 'Telegram MiniApp · B2C', tags: 'iOS / Android · MVP', href: 'soul-case/index.html', image: 'src/assets/home/soul.png', alt: 'Приложение Soul для путешествий рядом с посадочным талоном' },
  { id: 'cashier', title: 'АРМ Кассира', description: 'Рабочее пространство с функционалом продажи билетов, формирования отчетов кассовой смены', badge: 'Внутренний продукт · B2B', tags: 'WEB · B2B · NDA', href: 'cashier-case/index.html', image: 'src/assets/portfolio/cashier.png', alt: 'Рабочее пространство кассира для продажи билетов' },
  { id: 'monitoring', title: 'Мониторинг бортовых систем общественного транспорта', badge: 'Внутренний продукт · B2B', tags: 'WEB · NDA', href: 'monitoring-case/index.html', image: 'monitoring-case/assets/overview.png', alt: 'Обзор состояния оборудования общественного транспорта' }
];

// Resolve paths from this script so the component can be used on nested case pages.
const portfolioBase = new URL('../../', document.currentScript.src);
document.querySelectorAll('[data-portfolio-carousel]').forEach(carousel => {
  const currentId = carousel.dataset.currentCase;
  const track = carousel.querySelector('.portfolio-track');
  const previous = carousel.querySelector('[data-project-direction="-1"]');
  const next = carousel.querySelector('[data-project-direction="1"]');
  for (const project of portfolioCases.filter(project => project.id !== currentId)) {
    const card = document.createElement('a');
    card.className = 'portfolio-card';
    card.dataset.caseId = project.id;
    card.href = new URL(project.href, portfolioBase).href;
    const copy = document.createElement('div');
    copy.className = 'portfolio-card-copy';
    const add = (tag, className, text) => {
      const element = document.createElement(tag);
      element.className = className;
      element.textContent = text;
      copy.append(element);
    };
    add('span', 'portfolio-badge', project.badge);
    add('h3', 'portfolio-card-title', project.title);
    if (project.description) add('p', 'portfolio-card-description', project.description);
    add('p', 'portfolio-card-tags', project.tags);
    add('span', 'portfolio-card-link', 'Смотреть кейс →');
    const image = document.createElement('img');
    image.className = 'portfolio-card-image';
    image.src = new URL(project.image, portfolioBase).href;
    image.alt = project.alt;
    image.width = 305;
    image.height = 252;
    image.loading = 'lazy';
    image.decoding = 'async';
    card.append(copy, image);
    track.append(card);
  }
  const update = () => {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const scroll = left => track.scrollTo({left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  const move = direction => {
    const first = track.querySelector('.portfolio-card');
    if (first) scroll(track.scrollLeft + direction * (first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap)));
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'Home') scroll(0);
      else if (event.key === 'End') scroll(track.scrollWidth);
      else move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  track.addEventListener('scroll', update, {passive: true});
  new ResizeObserver(update).observe(track);
  carousel.querySelector('.portfolio-controls').hidden = false;
  update();
});
})();
