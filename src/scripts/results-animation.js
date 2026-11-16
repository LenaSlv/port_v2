(() => {
  const root = document.querySelector('.results-animation');
  if (!root) return;
  const definitions = {
    date: { label: 'Дата теста' },
    classes: { label: 'Классы объектов', options: ['Служебный транспорт', 'Легковые авто', 'Автобусы', 'Грузовые авто', 'Пешеходы', 'Велосипеды', 'Мотоциклы'], short: ['Служ. трансп.', 'Легковые', 'Автобусы', 'Грузовые', 'Пешеходы', 'Велосипеды', 'Мотоциклы'] },
    quality: { label: 'Качество метрик', options: ['От 95 %', 'От 90 до 95 %', 'Менее 90 %'], short: ['От 95 %', '90–95 %', 'Менее 90 %'] },
    version: { label: 'Версия модели', options: ['1.4.2', '1.4.1', '1.4.0', '1.2.1', '1.2.2'] }
  };
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  const field = (key, def) => `<span class="demo-field" data-filter="${key}"><span class="demo-value">${def.label}</span>${key === 'date' ? '' : '<span class="demo-arrow"></span>'}</span>`;
  layer.innerHTML = `<div class="demo-filters">${Object.entries(definitions).map(([key, def]) => field(key, def)).join('')}<span class="demo-apply">Применить фильтры</span></div>`;
  for (const key of ['classes', 'quality', 'version']) {
    const popup = document.createElement('div');
    popup.className = 'demo-popup';
    popup.dataset.popup = key;
    popup.hidden = true;
    popup.innerHTML = ['Выбрать все', ...definitions[key].options].map((label, index) => `<span class="demo-option" data-option="${index - 1}"><span class="demo-check"></span>${label}</span>`).join('');
    layer.append(popup);
  }
  const calendar = document.createElement('div');
  calendar.className = 'demo-popup demo-calendar';
  calendar.dataset.popup = 'date';
  calendar.hidden = true;
  calendar.innerHTML = `<div class="calendar-presets"><span>Сегодня</span><span>Вчера</span><span data-preset>Последние 7 дней</span><span>Последний месяц</span></div><div class="calendar-months">${['Январь 2024', 'Февраль 2024'].map((month, index) => `<div class="calendar-month"><h4>${month}</h4><div class="calendar-week">${['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(day => `<span>${day}</span>`).join('')}</div><div class="calendar-days">${index ? '<span></span>'.repeat(3) : ''}${Array.from({ length: index ? 29 : 31 }, (_, day) => `<span data-day="${index}-${day + 1}">${day + 1}</span>`).join('')}</div></div>`).join('')}</div><div class="calendar-footer"><span>Выберите дату или период<strong data-date-summary>Не выбрано</strong></span><span class="calendar-actions"><span>Отменить</span><span class="calendar-confirm">Применить</span></span></div>`;
  calendar.querySelectorAll('h4').forEach((heading, index) => {
    const icon = document.createElement('img');
    icon.src = `../assets/monitoring/filter-calendar/${index ? 'next' : 'previous'}.svg`;
    icon.alt = '';
    icon.className = index ? 'calendar-next' : 'calendar-previous';
    heading.append(icon);
  });
  calendar.querySelectorAll('[data-day]').forEach(cell => {
    const [month, day] = cell.dataset.day.split('-').map(Number);
    const unavailable = (month ? [5, 7, 8, 9, 10, 12, 14] : [5, 7, 8, 9, 10, 12]).includes(day);
    cell.classList.toggle('is-unavailable', unavailable);
    const icon = document.createElement('img');
    icon.src = `../assets/monitoring/filter-calendar/${unavailable ? 'unavailable' : 'available'}.svg`;
    icon.alt = '';
    cell.append(icon);
  });
  layer.append(calendar);
  const results = document.createElement('div');
  results.className = 'demo-results';
  results.hidden = true;
  const metrics = [
    ['Precision B', 90, '96,0%', '93,4%', '94,8%', '92,2%'],
    ['Precision M', 92, '94,0%', '91,4%', '92,8%', '90,2%'],
    ['Recall B', 74, '93,0%', '90,4%', '91,8%', '89,2%'],
    ['Recall M', 76, '91,0%', '88,4%', '89,8%', '87,2%'],
    ['mAP50 B', 81, '95,0%', '92,4%', '93,8%', '91,2%'],
    ['mAP50 M', 83, '92,0%', '89,4%', '90,8%', '88,2%'],
    ['mAP50–95 B', 98, '83,0%', '80,4%', '81,8%', '79,2%'],
    ['mAP50–95 M', 100, '80,0%', '77,4%', '78,8%', '76,2%'],
    ['mAP50', 74, '89,0%', '86,4%', '87,8%', '85,2%']
  ];
  const column = (label, width, values) => `<div class="result-column" style="--column-width:${width}"><div class="result-heading">${label}</div>${values.map(value => `<div class="result-cell">${value}</div>`).join('')}</div>`;
  results.innerHTML = `<div class="results-scroll"><div class="results-wide">${
    column('ID', 76, ['1', '2']) + column('Версия', 76, ['1.4.2', '1.4.1']) +
    column('Классы объектов', 228, ['<span class="result-tag">Служебный транспорт</span><span class="result-tag">+1</span>', '<span class="result-tag">Легковые авто</span><span class="result-tag">+2</span>']) +
    column('Выборка<br>кадров', 88, ['1 240', '1 180'])
  }<div class="result-metrics"><div class="result-metrics-title">Метрики</div><div class="result-metric-columns">${metrics.map(([label, width, ...values]) => column(label, width, [0, 2].map(index => `<span>${values[index]}<small>${values[index + 1]}</small></span>`))).join('')}</div></div>${
    column('Условия', 148, ['Дневной рейс', 'Ночной рейс']) + column('Дата теста', 92, ['<span>14:32:08<small>18.12.2025</small></span>', '<span>11:18:42<small>17.12.2025</small></span>'])
  }</div></div><div class="result-actions"><div class="result-heading">Действия</div><div class="result-cell"><span class="result-action-button">⋮</span></div><div class="result-cell"><span class="result-action-button">⋮</span></div></div><div class="results-scroll-track"><span class="results-scroll-thumb"></span></div>`;
  layer.append(results);
  const scroller = results.querySelector('.results-scroll');
  const thumb = results.querySelector('.results-scroll-thumb');
  const actionButton = results.querySelector('.result-action-button');
  const actionMenu = document.createElement('div');
  actionMenu.className = 'demo-action-menu';
  actionMenu.hidden = true;
  actionMenu.innerHTML = '<img src="../assets/monitoring/action-trash.svg" alt=""><span>Удалить</span>';
  const dialog = document.createElement('div');
  dialog.className = 'demo-dialog-backdrop';
  dialog.hidden = true;
  dialog.innerHTML = '<div class="demo-delete-dialog"><img src="../assets/monitoring/dialog-trash.svg" alt=""><strong>Удалить версию модели?</strong><div class="demo-dialog-actions"><span class="demo-delete-confirm">Да, удалить</span><span class="demo-delete-cancel">Отменить</span></div></div>';
  layer.append(actionMenu, dialog);
  const pagination = document.createElement('div');
  pagination.className = 'demo-pagination';
  pagination.hidden = true;
  pagination.textContent = '1–2 из 2';
  const lastPage = document.createElement('div');
  lastPage.className = 'demo-page-last';
  lastPage.hidden = true;
  layer.append(pagination, lastPage);
  root.insertBefore(layer, root.querySelector('.animation-cursor'));
  const cursor = root.querySelector('.animation-cursor');
  const apply = root.querySelector('.demo-apply');
  let selected;
  const move = (x, y) => { cursor.style.left = `${x / 12.8}%`; cursor.style.top = `${y / 8.32}%`; cursor.style.opacity = '1'; };
  function close() {
    root.querySelectorAll('.demo-popup').forEach(popup => { popup.hidden = true; });
    root.querySelectorAll('.demo-field').forEach(input => input.classList.remove('is-open'));
    root.dataset.openFilter = '';
  }
  function open(key) {
    close();
    root.querySelector(`[data-popup="${key}"]`).hidden = false;
    root.querySelector(`[data-filter="${key}"]`).classList.add('is-open');
    root.dataset.openFilter = key;
  }
  function select(key, index) {
    selected[key].push(index);
    const def = definitions[key];
    const input = root.querySelector(`[data-filter="${key}"]`);
    input.querySelector('.demo-value').replaceChildren(...selected[key].map(value => {
      const tag = document.createElement('span');
      tag.className = 'demo-selected-tag';
      tag.textContent = (def.short || def.options)[value];
      tag.title = def.options[value];
      return tag;
    }));
    input.classList.add('is-selected');
    root.querySelector(`[data-popup="${key}"] [data-option="${index}"]`).classList.add('is-checked');
    apply.classList.add('is-ready');
  }
  function reset() {
    close();
    selected = { classes: [], quality: [], version: [] };
    root.querySelectorAll('.demo-field').forEach(input => { input.classList.remove('is-selected'); input.querySelector('.demo-value').textContent = definitions[input.dataset.filter].label; });
    root.querySelectorAll('.is-checked,.is-picked,.is-range,.is-endpoint').forEach(item => item.classList.remove('is-checked', 'is-picked', 'is-range', 'is-endpoint'));
    root.querySelector('[data-date-summary]').textContent = 'Не выбрано';
    apply.classList.remove('is-ready', 'is-pressed');
    results.hidden = pagination.hidden = lastPage.hidden = true;
    actionMenu.hidden = dialog.hidden = true;
    actionButton.classList.remove('is-pressed');
    root.querySelector('.demo-delete-cancel').classList.remove('is-pressed');
    scroller.scrollLeft = 0;
    thumb.style.transform = 'translateX(0)';
    root.dataset.applied = 'false';
    cursor.style.opacity = '0';
    cursor.classList.remove('is-dragging');
  }
  const steps = [
    [0, reset], [800, () => move(360, 218)], [1500, () => open('date')], [2400, () => move(574, 270)],
    [3100, () => {
      root.querySelector('[data-preset]').classList.add('is-picked');
      root.querySelector('[data-date-summary]').textContent = 'Последние 7 дней';
      for (let day = 15; day <= 21; day++) root.querySelector(`[data-day="0-${day}"]`).classList.add(day === 15 || day === 21 ? 'is-endpoint' : 'is-range');
    }],
    [4000, () => move(818, 580)],
    [4700, () => { close(); const input = root.querySelector('[data-filter=date]'); input.classList.add('is-selected'); input.querySelector('.demo-value').textContent = '7 дней'; apply.classList.add('is-ready'); }],
    [5400, () => move(530, 218)], [6100, () => open('classes')],
    [6800, () => move(463, 289)], [7300, () => select('classes', 0)],
    [8100, () => move(463, 317)], [8600, () => select('classes', 1)], [9700, close],
    [10400, () => move(729, 218)], [11100, () => open('quality')],
    [11800, () => move(665, 289)], [12300, () => select('quality', 0)],
    [13100, () => move(665, 317)], [13600, () => select('quality', 1)], [14700, close],
    [15400, () => move(932, 218)], [16100, () => open('version')],
    [16800, () => move(865, 289)], [17300, () => select('version', 0)],
    [18100, () => move(865, 317)], [18600, () => select('version', 1)], [19700, close],
    [20500, () => move(1127, 218)],
    [21400, () => { apply.classList.add('is-pressed'); results.hidden = pagination.hidden = lastPage.hidden = false; root.dataset.applied = 'true'; }],
    [21800, () => apply.classList.remove('is-pressed')],
    [22800, () => { move(1030, 480); cursor.style.opacity = '0'; }],
    [24000, () => move(540, 732)],
    [25000, () => cursor.classList.add('is-dragging')],
    [27800, () => cursor.classList.remove('is-dragging')],
    [28200, () => move(1206, 380)],
    [29000, () => { actionButton.classList.add('is-pressed'); actionMenu.hidden = false; }],
    [29900, () => move(1040, 426)],
    [30800, () => { actionMenu.hidden = true; dialog.hidden = false; actionButton.classList.remove('is-pressed'); }],
    [31800, () => { cursor.style.opacity = '0'; }],
    [34800, () => move(640, 487)],
    [35600, () => root.querySelector('.demo-delete-cancel').classList.add('is-pressed')],
    [36000, () => { dialog.hidden = true; cursor.style.opacity = '0'; }],
    [38000, () => move(370, 182)], [39000, reset]
  ];
  let elapsed = 0;
  let previous = null;
  let next = 0;
  let inView = false;
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; previous = null; }, { threshold: 0.15 }).observe(root);
  function tick(now) {
    if (inView && !document.hidden) {
      if (previous !== null) elapsed += now - previous;
      previous = now;
      if (elapsed >= 42000) { elapsed %= 42000; next = 0; }
      while (next < steps.length && elapsed >= steps[next][0]) { steps[next][1](); root.dataset.step = String(next++); }
      if (elapsed >= 25000 && elapsed < 39000) {
        const progress = Math.min(1, (elapsed - 25000) / 2500);
        const eased = progress * progress * (3 - 2 * progress);
        scroller.scrollLeft = eased * (scroller.scrollWidth - scroller.clientWidth);
        thumb.style.transform = `translateX(${eased * 31.4375}cqw)`;
        if (elapsed < 27800) move(540 + eased * 402.4, 732);
      }
    } else previous = null;
    requestAnimationFrame(tick);
  }
  reset();
  requestAnimationFrame(tick);
})();
