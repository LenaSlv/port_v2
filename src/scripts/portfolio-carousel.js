(() => {
// Shared catalogue: each case carousel excludes its own stable id.
const portfolioCases = [
  { id: 'transport', title: 'Единый транспортный сервис для городских\nи междугородних поездок', badge: 'IOS/Android B2B2E', tags: 'Product concept · Information architecture · User flows · Mobile UX/UI · Edge cases', href: 'transport-case/index.html', image: 'src/assets/carousel/a1ecb.png', alt: 'Экраны единого транспортного сервиса' },
  { id: 'corporate', title: 'Сервис заказа\nкорпоративного транспорта', badge: 'iOS / Android B2B2E', tags: 'Product logic · User flows · Mobile UX/UI', href: 'corporate-transport/index.html', image: 'src/assets/carousel/6fd54.png', alt: 'Телефон с QR-билетом рядом с зелёным валидатором' },
  { id: 'soul', title: 'Платформа\nдля поиска компании\nи активностей\nв путешествиях', badge: 'Telegram MiniApp', tags: 'UX Research · Synthesis · Product hypotheses · User Flow · Mobile UX/UI', href: 'soul-case/index.html', image: 'src/assets/carousel/ad0b2.png', alt: 'Приложение Soul для путешествий рядом с посадочным талоном' },
  { id: 'cashier', title: 'АРМ Кассира', badge: 'Web B2B', tags: 'Complex B2B flows · Payment scenarios · Edge cases · Web UI', href: 'cashier-case/index.html', image: 'src/assets/carousel/ca50c.png', alt: 'Рабочее место кассира' },
  { id: 'monitoring', title: 'Мониторинг бортовых систем', badge: 'Web B2B', tags: 'UX design', href: 'monitoring-case/index.html', image: 'src/assets/carousel/3d395.png', alt: 'Мониторинг оборудования на экране ноутбука' }
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
    image.className = 'portfolio-preview-image';
    image.src = new URL(project.image, portfolioBase).href;
    image.alt = project.alt;
    image.width = 305;
    image.height = 252;
    image.loading = 'lazy';
    image.decoding = 'async';
    const preview = document.createElement('div');
    preview.className = 'portfolio-card-image';
    if (project.id === 'monitoring') {
      preview.setAttribute('role', 'img');
      preview.setAttribute('aria-label', project.alt);
      image.alt = '';
      const scene = document.createElement('div');
      scene.className = 'portfolio-monitoring-scene';
      const layer = (className, asset) => {
        const element = document.createElement(asset ? 'img' : 'div');
        element.className = className;
        if (asset) {
          element.src = new URL(`src/assets/carousel/${asset}`, portfolioBase).href;
          element.alt = '';
          element.loading = 'lazy';
          element.decoding = 'async';
        }
        scene.append(element);
        return element;
      };
      layer('monitoring-glow monitoring-glow-blue', '9a308.svg');
      layer('monitoring-glow monitoring-glow-violet', 'd05b7.svg');
      layer('monitoring-device-shadow', '7ba71.svg');
      layer('monitoring-device-lid');
      layer('monitoring-device-dark');
      const screen = layer('monitoring-device-screen');
      screen.append(image);
      const label = layer('monitoring-device-label');
      label.textContent = 'Macbook Pro';
      layer('monitoring-device-base', '40f2e.png');
      layer('monitoring-device-curve', '4c67a.svg');
      layer('monitoring-device-groove', 'e2732.svg');
      preview.append(scene);
    } else {
      preview.append(image);
    }
    card.append(copy, preview);
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
