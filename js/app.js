const API_URL = 'https://jsonplaceholder.typicode.com/todos'; 

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});

let todos = [];


async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        todos = data.slice(0, 10); 
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}


async function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
        userId: 1,
        title: taskText,
        completed: false
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        const createdTask = await response.json();
        todos.push(createdTask);
        taskInput.value = '';
        renderTasks();
    } catch (error) {
        console.error('Error adding task:', error);
    }
}


function renderTasks() {
    const todoList = document.getElementById('todo-list');
    if (!todoList) {
        console.error('Error: todo-list element not found');
        return;
    }
    todoList.innerHTML = '';
    todos.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'todo-item' + (task.completed ? ' completed' : '');
        taskItem.id = task.id;
        taskItem.innerHTML = `
            <span>${task.title}</span>
            <div class="buttons">
                <button class="update" onclick="editTask(${task.id})">Update</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        todoList.appendChild(taskItem);
    });
}


function editTask(id) {
    const taskItem = document.getElementById(id);
    const task = todos.find(task => task.id === id);
    if (!taskItem || !task) return;

    taskItem.innerHTML = `
        <input type="text" id="edit-task-${id}" value="${task.title}">
        <div class="buttons">
            <button onclick="saveTask(${id})">Save</button>
            <button onclick="renderTasks()">Cancel</button>
        </div>
    `;
}


async function saveTask(id) {
    const taskInput = document.getElementById(`edit-task-${id}`);
    const updatedText = taskInput.value.trim();
    if (updatedText === '') return;

    const task = todos.find(task => task.id === id);
    if (!task) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: updatedText })
        });

        const updatedTask = await response.json();
        task.title = updatedTask.title;
        renderTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        todos = todos.filter(task => task.id !== id);
        renderTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}
