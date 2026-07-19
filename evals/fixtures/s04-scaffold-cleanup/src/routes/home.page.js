export const path = '/';
export const title = 'Sparkboard';

const boards = [
  { name: 'Inbox', open: 4 },
  { name: 'In progress', open: 2 },
  { name: 'Done', open: 11 },
];

export default function render() {
  const rows = boards
    .map((board) => `<li><span>${board.name}</span><b>${board.open}</b></li>`)
    .join('');
  return `<main><h1>${title}</h1><ul class="boards">${rows}</ul></main>`;
}
