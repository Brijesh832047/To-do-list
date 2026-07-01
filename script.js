const STORAGE_KEY = 'todo-list-items';
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let lastAddedId = '';

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  if (!todos.length) {
    todoList.innerHTML = '<li class="empty-state">No tasks yet. Add one above.</li>';
    return;
  }

  todoList.innerHTML = todos
    .map(
      (todo) => `
        <li class="todo-item ${todo.completed ? 'completed' : ''} ${todo.id === lastAddedId ? 'animate-in' : ''}">
          <div class="todo-left">
            <input
              class="todo-checkbox"
              type="checkbox"
              ${todo.completed ? 'checked' : ''}
              data-id="${todo.id}"
            />
            <span class="todo-text">${todo.text}</span>
          </div>
          <button class="delete-btn" data-id="${todo.id}" aria-label="Delete task">×</button>
        </li>
      `
    )
    .join('');
}

function addTodo(text) {
  const id = Date.now().toString();
  todos.unshift({
    id,
    text,
    completed: false,
  });
  lastAddedId = id;
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  lastAddedId = '';
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  lastAddedId = '';
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = todoInput.value.trim();
  if (!value) return;

  addTodo(value);
  todoInput.value = '';
  todoInput.focus();
});

todoList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-btn');
  if (deleteButton) {
    deleteTodo(deleteButton.dataset.id);
    return;
  }

  const checkbox = event.target.closest('.todo-checkbox');
  if (checkbox) {
    toggleTodo(checkbox.dataset.id);
  }
});

renderTodos();
