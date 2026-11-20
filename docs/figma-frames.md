# Фреймы Figma

Основной файл: [портфолио и транспортные проекты](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/).

Список перенесён из ранее утверждённых материалов репозитория. Состояние удалённых фреймов при реорганизации не проверялось. Перед изменением дизайна нужно прочитать актуальный фрейм; локальные изображения — вспомогательные материалы.

| Страница / элемент | Фрейм | Применение в репозитории |
| --- | --- | --- |
| Компетенции главной: мобильная / десктопная версии | [3336:41281](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3336-41281) / [3373:52224](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3373-52224) | Прочитаны 20 ноября 2026; заменяют прежний блок компетенций, включая эту часть WEB-053. `src/styles/home-skills.css`, WEB-078. |
| Мобильное вступление главной | [3336:41267](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3336-41267) | Актуальный референс контактов, заголовка и четырёх карточек компетенций на мобильной главной; `src/styles/home-hero-mobile.css`, WEB-053. |
| Мобильная шкала шрифтов и отступов | [2346:4584](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2346-4584) | Прочитан 19 ноября 2026. По указанию пользователя перенесены только размеры текста, межстрочные интервалы и отступы; существующее оформление сохраняется. Общий файл `src/styles/mobile-scale.css`, WEB-051. |
| Главная портфолио | [3169:28182](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3169-28182) | Прочитан 16 ноября 2026; реализован в `index.html`, `src/styles/home.css`. |
| Блок проектов главной | [3364:41566](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3364-41566) | Прочитан 20 ноября 2026; заменяет блок проектов прежней главной. Две колонки, превью сверху и текстовая панель с круглой стрелкой поверх нижнего края; `index.html`, `src/styles/home.css`, `src/assets/home/projects-*`. До 900 px — одна колонка, WEB-072. |
| Превью корпоративного транспорта на главной | [3169:28304](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3169-28304) | Изображение из вложенного фрейма `3328:40920`, экспортировано в `src/assets/home/corporate-preview.png`. |
| Карточки «Другие проекты» | [3169:28818](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3169-28818) | Общие карточки пяти кейсов: `src/scripts/portfolio-carousel.js`, `src/styles/portfolio-carousel.css`, ресурсы `src/assets/carousel/`. Обновлены только карточки; логика, кнопки и обрезка ленты сохраняются. |
| «Связаться со мной» | [3169:28399](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3169-28399) | Прочитан 16 ноября 2026; панель 480 px на референсном холсте 600 × 536 px. Общий компонент `contact-dialog.css` / `contact-dialog.js`. |
| Единый транспортный сервис | [2810:18183](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2810-18183) | `transport-case/index.html`, стили и скрипты в `src/`, изображения в `src/assets/`. |
| Корпоративный транспорт | [2905:27022](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2905-27022) | `corporate-transport/index.html`, локальная ссылка в каталоге и на главной. |
| «Орбита»: мониторинг бортовых систем | [2883:26896](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2883-26896) | `monitoring-case/index.html`, ресурсы в `monitoring-case/assets/`. |
| «Орбита»: мобильная обложка | [3340:41435](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3340-41435) | Холст 357 × 180, мобильная композиция до 900 px; `.mobile-hero-art` в `monitoring-case/index.html`, стили в `monitoring-case/figma-case.css`. |
| «Орбита»: увеличенная диагностика устройства | [3169:28878](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3169-28878) | Полный экран для увеличенного просмотра: `monitoring-case/assets/diagnostics-detail.png`. |
| Soul | [3181:30837](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3181-30837) | `soul-case/index.html`, экраны в `src/assets/soul/`. |
| «Другие проекты» | [3181:32861](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3181-32861) | Общая карусель: `src/scripts/portfolio-carousel.js`, `src/styles/portfolio-carousel.css`. Подключена в транспортном кейсе. |
| Покупка абонемента | [2835:17450](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2835-17450) | Дополнительный референс блока абонемента, указан в комментарии `src/styles/layout.css`. |
| После покупки абонемента | [2837:19227](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2837-19227) | Четыре мокапа `2837:19232`, `2837:19240`, `2837:19248`, `2837:19256` в порядке слева направо; `src/assets/figma-audit/after-pass-1.png` — `after-pass-4.png`, блок `.after-pass` в `transport-case/index.html`. |
| Пополнение баланса | [2837:18611](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2837-18611) | Дополнительный референс в `src/styles/figma-alignment.css`. |
| Поиск междугороднего маршрута | [2837:19417](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2837-19417) | Мокап `2837:19485` экспортирован в `src/assets/figma-audit/route-search.png`; блок «Поиск маршрута» и увеличенный просмотр в `transport-case/index.html`. |
| Выпуск виртуальной карты | [2810:18611](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2810-18611) | Дополнительный референс в `src/styles/layout.css`. |
| Управление картой | [2883:26825](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2883-26825) | Дополнительный референс в `src/styles/layout.css`; веб-сценарий описан в реестре правок. |

Мобильный контактный финал на главной и всех пяти кейсах: [3336:41408](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3336-41408), прочитан 19 ноября 2026 года. Реализация — `src/styles/collaboration-footer-mobile.css`, WEB-061. Заголовок «Открыта к сотрудничеству», карточки Telegram и почты, подпись автора и синяя линия; применяется до 900 px.

Основные фреймы страниц относятся к десктопу; отдельно указаны мобильные эталоны. Мобильная адаптация фиксируется также в [правках сайта](site-adjustments.md).

Дополнительный референс анимаций: [Troy Designs](https://troydesigns.vercel.app/ru/). Это референс движения, а не источник содержания или композиции кейсов.

Кейс АРМ Кассира: [фрейм `3181:31620`](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3181-31620). Основные секции: обложка `3181:31636`, контекст `3181:32969`, изменение заказа `3181:31663`, смешанная оплата `3205:29268`, возврат наличных `3181:31933`.

Мобильная обложка АРМ кассира: [3350:41461](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3350-41461), холст 357 × 180 px, радиус 28 px. Отдельная композиция `.cashier-mobile-cover` до 900 px, ресурсы `cashier-case/assets/hero-mobile-*`; десктопная обложка сохраняется.

Плашки Telegram и почты мобильного контактного финала: [3336:41414](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3336-41414), прочитаны контекст и снимок 20 ноября 2026 года. Уточняют размеры карточек внутри 3336:41408 на главной и всех пяти кейсах: поля 12 × 16 px, контакты Montserrat Medium 16 px с normal-интерлиньяжем; WEB-078.
