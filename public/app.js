document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('todo-list');
    const formEl = document.getElementById('todo-form');
    const inputEl = document.getElementById('todo-input');
    const loaderEl = document.getElementById('loader');
    const emptyStateEl = document.getElementById('empty-state');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = [];
    let currentFilter = 'all';

    // API Base URL
    const API_URL = '/api/todos';

    // Initialization
    loadTodos();

    // Event Listeners
    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = inputEl.value.trim();
        if(!body) return;

        inputEl.value = '';
        await createTodo(body);
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Core Functions
    async function loadTodos() {
        showLoader();
        try {
            const res = await fetch(API_URL);
            todos = await res.json();
            renderTodos();
        } catch (error) {
            console.error('Failed to load todos:', error);
        } finally {
            hideLoader();
        }
    }

    async function createTodo(body) {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body })
            });
            const newTodo = await res.json();
            todos.push(newTodo);
            
            // Switch filter to 'all' if user adds while in completed filter
            if(currentFilter === 'completed') {
                document.querySelector('[data-filter="all"]').click();
            } else {
                renderTodos();
            }
        } catch (error) {
            console.error('Failed to create todo:', error);
        }
    }

    async function toggleTodo(id) {
        // Optimistic UI update
        const todo = todos.find(t => t.id === id);
        if(!todo) return;
        
        todo.completed = !todo.completed;
        renderTodos(); 

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH'
            });
            if(!res.ok) {
                // Revert if failed
                todo.completed = !todo.completed;
                renderTodos();
            }
        } catch (error) {
            console.error('Failed to toggle todo:', error);
            todo.completed = !todo.completed;
            renderTodos();
        }
    }

    async function deleteTodo(id) {
        // Optimistic list removal with animation setup
        const itemEl = document.getElementById(`todo-${id}`);
        if(itemEl) {
            itemEl.style.animation = 'slideOut 0.3s ease forwards';
        }

        setTimeout(async () => {
            const originalTodos = [...todos];
            todos = todos.filter(t => t.id !== id);
            renderTodos();

            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                });
                
                if(!res.ok) throw new Error('Delete failed');
            } catch (error) {
                console.error('Failed to delete todo:', error);
                todos = originalTodos;
                renderTodos();
            }
        }, 250);
    }

    // UI Updates
    function renderTodos() {
        listEl.innerHTML = '';
        
        let filteredTodos = todos;
        if(currentFilter === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        if(todos.length === 0) {
            emptyStateEl.style.display = 'block';
            emptyStateEl.querySelector('h3').textContent = 'All caught up!';
            emptyStateEl.querySelector('p').textContent = 'You have no tasks taking up space.';
        } else if (filteredTodos.length === 0) {
            emptyStateEl.style.display = 'block';
            emptyStateEl.querySelector('h3').textContent = 'No tasks found';
            emptyStateEl.querySelector('p').textContent = `No ${currentFilter} tasks to display.`;
        } else {
            emptyStateEl.style.display = 'none';
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.id = `todo-${todo.id}`;

            li.innerHTML = `
                <div class="todo-content">
                    <div class="checkbox">
                        <i class="fas fa-check"></i>
                    </div>
                    <span class="todo-text">${escapeHtml(todo.body)}</span>
                </div>
                <button class="delete-btn" aria-label="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;

            // Setup events
            li.querySelector('.todo-content').addEventListener('click', () => toggleTodo(todo.id));
            li.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
            });

            listEl.appendChild(li);
        });
    }

    function showLoader() {
        loaderEl.style.display = 'flex';
        listEl.style.display = 'none';
        emptyStateEl.style.display = 'none';
    }

    function hideLoader() {
        loaderEl.style.display = 'none';
        listEl.style.display = 'flex';
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
});
