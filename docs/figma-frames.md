# Фреймы Figma

Основной файл: [портфолио и транспортные проекты](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/).

Список перенесён из ранее утверждённых материалов репозитория. Состояние удалённых фреймов при реорганизации не проверялось. Перед изменением дизайна нужно прочитать актуальный фрейм; локальные изображения — вспомогательные материалы.

| Страница / элемент | Фрейм | Применение в репозитории |
| --- | --- | --- |
| Главная портфолио | [3169:28182](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3169-28182) | Прочитан 16 ноября 2026; реализован в `index.html`, `src/styles/home.css`. |
| «Связаться со мной» | [3169:28399](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3169-28399) | Прочитан 16 ноября 2026; панель 480 px на референсном холсте 600 × 536 px. Общий компонент `contact-dialog.css` / `contact-dialog.js`. |
| Единый транспортный сервис | [2810:18183](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2810-18183) | `transport-case/index.html`, стили и скрипты в `src/`, изображения в `src/assets/`. |
| Корпоративный транспорт | [2905:27022](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2905-27022) | `corporate-transport/index.html`, локальная ссылка в каталоге и на главной. |
| «Орбита»: мониторинг бортовых систем | [2883:26896](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2883-26896) | `monitoring-case/index.html`, ресурсы в `monitoring-case/assets/`. |
| Soul | [3181:30837](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3181-30837) | `soul-case/index.html`, экраны в `src/assets/soul/`. |
| «Другие проекты» | [3181:32861](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3181-32861) | Общая карусель: `src/scripts/portfolio-carousel.js`, `src/styles/portfolio-carousel.css`. Подключена в транспортном кейсе. |
| Покупка абонемента | [2835:17450](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2835-17450) | Дополнительный референс блока абонемента, указан в комментарии `src/styles/layout.css`. |
| Пополнение баланса | [2837:18611](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2837-18611) | Дополнительный референс в `src/styles/figma-alignment.css`. |
| Выпуск виртуальной карты | [2810:18611](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2810-18611) | Дополнительный референс в `src/styles/layout.css`. |
| Управление картой | [2883:26825](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=2883-26825) | Дополнительный референс в `src/styles/layout.css`; веб-сценарий описан в реестре правок. |

Все основные утверждённые фреймы относятся к десктопу. Мобильная адаптация фиксируется отдельно в [правках сайта](site-adjustments.md).

Дополнительный референс анимаций: [Troy Designs](https://troydesigns.vercel.app/ru/). Это референс движения, а не источник содержания или композиции кейсов.

Кейс АРМ Кассира: [фрейм `3181:31620`](https://www.figma.com/design/ZGvSZcFNYGG8ePhMb3iuk0/?node-id=3181-31620). Основные секции: обложка `3181:31636`, контекст `3181:32969`, изменение заказа `3181:31663`, смешанная оплата `3205:29268`, возврат наличных `3181:31933`.
