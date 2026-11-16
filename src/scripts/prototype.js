const playbackOptions = new URLSearchParams(location.search);
const autoplay = playbackOptions.has('autoplay');
if (playbackOptions.has('embed')) document.documentElement.classList.add('is-embed');

const prototype = document.querySelector('.prototype');
const screenRail = document.querySelector('.screen-rail');
const homeScreen = document.querySelector('.home-screen');
const cardsScreen = document.querySelector('.cards-screen');
const selection = document.querySelector('.selection-outline');
const scrim = document.querySelector('.scrim');
const sheets = {
  management: document.querySelector('.management-sheet'),
  subscription: document.querySelector('.subscription-sheet')
};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let currentSheet = null;
let openingTimer = null;
let transitionBusy = false;

function showScreen(name) {
  clearTimeout(openingTimer);
  prototype.dataset.view = name;
  homeScreen.inert = name !== 'home';
  cardsScreen.inert = name !== 'cards';
  homeScreen.setAttribute('aria-hidden', String(name !== 'home'));
  cardsScreen.setAttribute('aria-hidden', String(name !== 'cards'));
  if (name === 'home') selection.classList.remove('is-visible');
}

function waitForMotion(sheet) {
  if (reducedMotion.matches) return Promise.resolve();
  return new Promise(resolve => {
    const done = event => {
      if (event?.target !== sheet || event?.propertyName !== 'transform') return;
      sheet.removeEventListener('transitionend', done);
      clearTimeout(timeout);
      resolve();
    };
    const timeout = setTimeout(() => done({target:sheet,propertyName:'transform'}), 500);
    sheet.addEventListener('transitionend', done);
  });
}

async function openSheet(name) {
  if (transitionBusy || currentSheet === name) return;
  transitionBusy = true;
  const sheet = sheets[name];
  if (name === 'subscription') {
    sheets.management.inert = true;
    sheets.management.classList.remove('is-open');
    await waitForMotion(sheets.management);
    sheets.management.setAttribute('aria-hidden', 'true');
  }
  screenRail.inert = true;
  sheet.inert = false;
  sheet.setAttribute('aria-hidden', 'false');
  scrim.classList.add('is-visible');
  sheet.getBoundingClientRect();
  sheet.classList.add('is-open');
  currentSheet = name;
  await waitForMotion(sheet);
  if (!autoplay) sheet.querySelector('[data-action="close"]').focus({preventScroll:true});
  transitionBusy = false;
}

async function closeSheet() {
  if (!currentSheet || transitionBusy) return;
  transitionBusy = true;
  const name = currentSheet;
  const sheet = sheets[name];
  sheet.classList.remove('is-open','is-dragging');
  sheet.style.removeProperty('--drag-y');
  if (name === 'management') scrim.classList.remove('is-visible');
  await waitForMotion(sheet);
  sheet.inert = true;
  sheet.setAttribute('aria-hidden','true');
  if (name === 'subscription') {
    currentSheet = 'management';
    sheets.management.inert = false;
    sheets.management.setAttribute('aria-hidden', 'false');
    sheets.management.classList.add('is-open');
    await waitForMotion(sheets.management);
    if (!autoplay) sheets.management.querySelector('.management-close').focus({preventScroll:true});
  } else {
    currentSheet = null;
    screenRail.inert = false;
    if (!autoplay) document.querySelector('.primary-card').focus({preventScroll:true});
  }
  transitionBusy = false;
}

document.addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'cards' || action === 'home') return showScreen(action);
  if (action === 'manage') {
    selection.classList.add('is-visible');
    clearTimeout(openingTimer);
    openingTimer = setTimeout(() => openSheet('management'), reducedMotion.matches ? 0 : 150);
  }
  if (action === 'pass') openSheet('subscription');
  if (action === 'close') closeSheet();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (currentSheet) { event.preventDefault(); closeSheet(); }
    else if (prototype.dataset.view === 'cards') showScreen('home');
  }
  if (event.key === 'Tab' && currentSheet) {
    const buttons = [...sheets[currentSheet].querySelectorAll('button')];
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

for (const sheet of Object.values(sheets)) {
  const handle = sheet.querySelector('.drag-handle');
  let origin = 0, distance = 0;
  handle.addEventListener('pointerdown', event => {
    if (!sheet.classList.contains('is-open') || transitionBusy || sheets[currentSheet] !== sheet) return;
    origin = event.clientY;
    distance = 0;
    sheet.classList.add('is-dragging');
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', event => {
    if (!sheet.classList.contains('is-dragging')) return;
    distance = Math.max(0, event.clientY - origin);
    sheet.style.setProperty('--drag-y', `${distance}px`);
  });
  const endDrag = () => {
    if (!sheet.classList.contains('is-dragging')) return;
    sheet.classList.remove('is-dragging');
    if (distance > 80) closeSheet();
    else sheet.style.removeProperty('--drag-y');
  };
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
}

showScreen('home');

if (autoplay) {
  prototype.inert = true;
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function playLoop() {
    let cycle = 0;
    while (true) {
      prototype.dataset.cycle = String(++cycle);
      showScreen('home');
      await pause(1800);
      showScreen('cards');
      await pause(1400);
      selection.classList.add('is-visible');
      await pause(450);
      await openSheet('management');
      await pause(2400);
      await openSheet('subscription');
      await pause(3000);
      await closeSheet();
      await pause(1000);
      await closeSheet();
      await pause(700);
    }
  }
  playLoop();
}
