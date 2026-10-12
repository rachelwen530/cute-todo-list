const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const bar = document.querySelector('#bar');
const progressText = document.querySelector('#progress-text');
const progressNumber = document.querySelector('#progress-number');
const clearDone = document.querySelector('#clear-done');

let tasks = JSON.parse(localStorage.getItem('cute-todo-tasks') || '[]');

function save() { localStorage.setItem('cute-todo-tasks', JSON.stringify(tasks)); }

function render() {
  list.innerHTML = '';
  if (!tasks.length) list.innerHTML = '<li class="empty">把想做的第一件小事写在上面吧 ✨</li>';
  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task${task.done ? ' done' : ''}`;
    item.innerHTML = `<button class="check" aria-label="${task.done ? '标记为未完成' : '标记为完成'}">✓</button><span class="label"></span><button class="delete" aria-label="删除这项待办">✕</button>`;
    item.querySelector('.label').textContent = task.text;
    item.querySelector('.check').onclick = () => { task.done = !task.done; save(); render(); };
    item.querySelector('.delete').onclick = () => { tasks = tasks.filter((entry) => entry.id !== task.id); save(); render(); };
    list.append(item);
  });
  const done = tasks.filter((task) => task.done).length;
  const percent = tasks.length ? (done / tasks.length) * 100 : 0;
  bar.style.width = `${percent}%`;
  progressNumber.textContent = `${done} / ${tasks.length}`;
  progressText.textContent = !tasks.length ? '今天从一件小事开始' : done === tasks.length ? '全部完成，猫猫为你鼓掌！' : '一步一步，也很了不起';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: crypto.randomUUID(), text, done: false });
  save(); render(); input.value = ''; input.focus();
});

clearDone.addEventListener('click', () => { tasks = tasks.filter((task) => !task.done); save(); render(); });
render();
