// ---- Data ----
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ---- Element references ----
const form = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const deadlineInput = document.getElementById('deadline');

const listEl = document.getElementById('taskList');
const emptyStateEl = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');

// ---- Add task ----
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const newTask = {
    id: Date.now(),
    name: taskNameInput.value.trim(),
    deadline: deadlineInput.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  form.reset();
  taskNameInput.focus();
});

// ---- Toggle complete + delete (event delegation) ----
listEl.addEventListener('click', function (e) {
  const id = Number(e.target.closest('[data-id]')?.dataset.id);
  if (!id) return;

  if (e.target.classList.contains('task-checkbox')) {
    const task = tasks.find(t => t.id === id);
    task.completed = e.target.checked;
    saveTasks();
    renderTasks();
  }

  if (e.target.closest('.delete-btn')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
});

// ---- Filter buttons ----
filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ---- Save to localStorage ----
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ---- Render ----
function renderTasks() {
  listEl.innerHTML = '';

  let filtered = tasks;
  if (currentFilter === 'pending') filtered = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

  emptyStateEl.style.display = filtered.length === 0 ? 'block' : 'none';

  const sorted = [...filtered].sort((a, b) => b.id - a.id);

  sorted.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <div class="task-info">
        <span class="task-name">${escapeHTML(task.name)}</span>
        ${task.deadline ? `<span class="task-deadline">Due: ${formatDate(task.deadline)}</span>` : ''}
      </div>
      <button class="delete-btn" aria-label="Delete ${escapeHTML(task.name)}">✕</button>
    `;
    listEl.appendChild(li);
  });
}

// ---- Helpers ----
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Initial render ----
renderTasks();
