const board = document.querySelector('#board');
const count = document.querySelector('#count');
const statuses = ['Planned', 'In progress', 'Review', 'Done'];
function text(tag, value, className) {
  const element = document.createElement(tag);
  element.textContent = value;
  if (className) element.className = className;
  return element;
}
export function render(items) {
  board.replaceChildren();
  count.textContent = `${items.length} requests`;
  for (const status of statuses) {
    const column = text('section', '', 'column');
    const matches = items.filter(item => item.status === status);
    column.append(text('h3', `${status} · ${matches.length}`));
    for (const item of matches) {
      const card = text('article', '', 'card');
      card.append(text('span', item.app, 'app'), text('h4', item.title), text('p', item.description), text('span', item.priority, `priority ${item.priority.toLowerCase()}`));
      column.append(card);
    }
    if (!matches.length) column.append(text('p', 'No requests', 'empty'));
    board.append(column);
  }
}
async function load() {
  try {
    const response = await fetch('/api/requests');
    if (!response.ok) throw new Error('Could not load requests');
    render((await response.json()).items);
  } catch {
    board.replaceChildren();
    const error = document.querySelector('#error');
    error.textContent = 'Could not load requests. Please refresh to try again.';
    error.hidden = false;
  } finally { board.setAttribute('aria-busy', 'false'); }
}
load();
