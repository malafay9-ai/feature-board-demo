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
let sequence = 0;
async function load(params = new URLSearchParams()) {
  const current = ++sequence;
  board.setAttribute('aria-busy', 'true');
  document.querySelector('#error').hidden = true;
  try {
    const response = await fetch(`/api/requests?${params}`);
    if (!response.ok) throw new Error('Could not load requests');
    const data = await response.json();
    if (current !== sequence) return;
    render(data.items);
  } catch {
    if (current !== sequence) return;
    board.replaceChildren();
    const error = document.querySelector('#error');
    error.textContent = 'Could not load requests. Please refresh to try again.';
    error.hidden = false;
  } finally { if (current === sequence) board.setAttribute('aria-busy', 'false'); }
}
const form = document.querySelector('#filters');
form.addEventListener('submit', event => {
  event.preventDefault();
  load(new URLSearchParams(new FormData(form)));
});
document.querySelector('#clear').addEventListener('click', () => { form.reset(); load(); });
load();
