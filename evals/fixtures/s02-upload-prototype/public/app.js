const input = document.querySelector('#file-input');
const list = document.querySelector('#file-list');

function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function render(files) {
  list.replaceChildren();

  if (files.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Nothing chosen yet.';
    list.append(empty);
    return;
  }

  for (const file of files) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = file.name;
    const size = document.createElement('span');
    size.textContent = formatSize(file.size);
    item.append(name, size);
    list.append(item);
  }
}

const chosen = [];

input.addEventListener('change', () => {
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  chosen.push({ name: file.name, size: file.size, type: file.type });
  render(chosen);
  input.value = '';
});

render(chosen);
