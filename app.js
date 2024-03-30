document.addEventListener('DOMContentLoaded', function () {
    const taskNameInput = document.getElementById('taskName');
    const taskDetailInput = document.getElementById('taskDetail');
    const addTaskForm = document.getElementById('add-task');
    const remainingTasksList = document.getElementById('remainingTasks');
    const doneTasksList = document.getElementById('doneTasks');

    let tasks = [];

    fetchTasks();

    addTaskForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const taskName = taskNameInput.value.trim();
        const taskDetail = taskDetailInput.value.trim();

        if (taskName !== '' && taskDetail !== '') {
            const newTask = { name: taskName, detail: taskDetail, done: false };
            await createTask(newTask);
            taskNameInput.value = '';
            taskDetailInput.value = '';
        }
    });

    function renderTasks() {
        remainingTasksList.innerHTML = '';
        doneTasksList.innerHTML = '';

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = `${task.name} - ${task.detail}`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.done;
            checkbox.addEventListener('change', function () {
                tasks[index].done = this.checked;
                updateTask(task._id, tasks[index]);
                renderTasks();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function () {
                deleteTask(task._id);
            });

            li.appendChild(checkbox);
            li.appendChild(deleteBtn);

            if (task.done) {
                doneTasksList.appendChild(li);
            } else {
                remainingTasksList.appendChild(li);
            }
        });
    }

    async function fetchTasks() {
        try {
            const response = await axios.get('https://crudcrud.com/api/bb9e5a5699734ecba1eb78c075fa8f44/tasks');
            tasks = response.data;
            renderTasks();
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    async function createTask(task) {
        try {
            const response = await axios.post('https://crudcrud.com/api/bb9e5a5699734ecba1eb78c075fa8f44/tasks', task);
            tasks.push(response.data);
            renderTasks();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    async function updateTask(taskId, updatedTask) {
        try {
            await axios.put(`https://crudcrud.com/api/bb9e5a5699734ecba1eb78c075fa8f44/tasks/${taskId}`, updatedTask);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    async function deleteTask(taskId) {
        try {
            await axios.delete(`https://crudcrud.com/api/bb9e5a5699734ecba1eb78c075fa8f44/tasks/${taskId}`);
            tasks = tasks.filter(task => task._id !== taskId);
            renderTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
});
