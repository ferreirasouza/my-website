'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-links');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.navigation')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

const board = document.querySelector('#merge-board');
const status = document.querySelector('#game-status');
const counter = document.querySelector('#merge-count');
const names = ['Seed', 'Sprout', 'Tree', 'Forest'];
const tree = '<path d="M36 58V30" stroke="#98765b" stroke-width="6" stroke-linecap="round"/><path d="M35 7c-12 0-18 10-15 18-15 9-10 24 2 24 6 9 19 8 24-1 15 0 20-15 10-24C58 14 48 5 35 7Z" fill="#7da96b"/><path d="M28 16c-5 2-8 6-7 11" stroke="#b3d68c" stroke-width="4" stroke-linecap="round"/><circle cx="44" cy="35" r="5" fill="#f0b179"/>';
const artwork = [
  '<ellipse cx="36" cy="57" rx="20" ry="6" fill="#ded6b8"/><ellipse cx="36" cy="36" rx="14" ry="21" transform="rotate(30 36 36)" fill="#b68a5e"/><path d="M33 20c-7 3-10 10-9 17" stroke="#e8bd83" stroke-width="5" stroke-linecap="round"/>',
  '<ellipse cx="36" cy="59" rx="22" ry="6" fill="#cad3ac"/><path d="M36 57V27" stroke="#6e8e57" stroke-width="5" stroke-linecap="round"/><path d="M35 43C14 46 9 30 12 20c15-1 26 8 23 23Z" fill="#86af6d"/><path d="M37 33c-1-19 12-29 27-23 2 14-9 26-27 23Z" fill="#a4cb76"/><path d="m36 34 16-13m-16 23-13-13" stroke="#6e8e57" stroke-width="2"/>',
  '<ellipse cx="36" cy="61" rx="24" ry="6" fill="#b8cea6"/>' + tree,
  '<ellipse cx="36" cy="62" rx="30" ry="6" fill="#b8c6c6"/><g transform="translate(-3 15) scale(.66)">' + tree + '</g><g transform="translate(25 15) scale(.66)">' + tree + '</g><g transform="translate(10 1) scale(.75)">' + tree + '</g>'
];
const initialTiles = [0, 0, 1, 0, 1, 0, 2, 1, 0, 1, 0, 0];
let tiles = [...initialTiles];
let selected = null;
let merges = 0;

function renderBoard(focusIndex) {
  board.replaceChildren();
  tiles.forEach((level, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'merge-tile' + (selected === index ? ' selected' : '');
    button.dataset.level = level;
    button.setAttribute('aria-label', names[level] + ', piece ' + (index + 1) + (level === 3 ? ', fully grown' : ''));
    button.setAttribute('aria-pressed', String(selected === index));
    button.innerHTML = '<svg viewBox="0 0 72 72" aria-hidden="true">' + artwork[level] + '</svg>';
    button.addEventListener('click', () => selectTile(index));
    board.append(button);
  });
  counter.textContent = merges + (merges === 1 ? ' merge' : ' merges');
  if (focusIndex !== undefined) board.children[focusIndex].focus({ preventScroll: true });
}

function selectTile(index) {
  if (tiles[index] === 3) {
    selected = null;
    status.textContent = 'A whole forest! This piece is fully grown. Keep combining the others.';
  } else if (selected === index) {
    selected = null;
    status.textContent = 'Pick any two matching pieces to discover something new.';
  } else if (selected === null) {
    selected = index;
    status.textContent = 'Now pick another ' + names[tiles[index]].toLowerCase() + ' to combine them.';
  } else if (tiles[selected] !== tiles[index]) {
    selected = index;
    status.textContent = 'These pieces are different. Find another ' + names[tiles[index]].toLowerCase() + '.';
  } else {
    tiles[index] += 1;
    tiles[selected] = 0;
    merges += 1;
    selected = null;
    status.textContent = tiles[index] === 3 ? 'You grew a forest! A little combination, a big discovery.' : 'Hello, ' + names[tiles[index]].toLowerCase() + '! A fresh seed is ready for your next discovery.';
    const canMerge = tiles.some((level, tileIndex) => level < 3 && tiles.indexOf(level) !== tileIndex);
    if (!canMerge) status.textContent = 'Your world is fully grown! Restart to discover it all again.';
  }
  renderBoard(index);
}
document.querySelector('#reset-game').addEventListener('click', () => {
  tiles = [...initialTiles];
  selected = null;
  merges = 0;
  status.textContent = 'A fresh start! Tap two matching pieces to see what grows.';
  renderBoard();
});
renderBoard();

const tasks = [...document.querySelectorAll('.task input')];
function updateTasks() {
  const complete = tasks.filter(task => task.checked).length;
  document.querySelector('#task-progress').style.width = (complete / tasks.length * 100) + '%';
  document.querySelector('#task-summary').textContent = complete + ' of ' + tasks.length + ' tasks complete';
}
tasks.forEach(task => task.addEventListener('change', updateTasks));
updateTasks();

// Native dialog preserves keyboard focus and supports Escape to close.
const screenshotDialog = document.querySelector('.screenshot-dialog');
const fullScreenshot = document.querySelector('#screenshot-full');
document.querySelectorAll('.screenshot-link').forEach(link => {
  link.addEventListener('click', event => {
    if (typeof screenshotDialog.showModal !== 'function' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    fullScreenshot.src = link.href;
    fullScreenshot.alt = link.querySelector('img').alt;
    document.querySelector('#screenshot-title').textContent = link.dataset.caption;
    screenshotDialog.querySelector(':scope > p').textContent = link.dataset.credit || 'Game preview';
    screenshotDialog.showModal();
  });
});
screenshotDialog.addEventListener('click', event => {
  const bounds = screenshotDialog.getBoundingClientRect();
  if (event.target === screenshotDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) screenshotDialog.close();
});
