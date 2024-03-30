document.addEventListener("DOMContentLoaded", () => {
    const taskNameInput = document.getElementById("taskName");
    const taskDetailInput = document.getElementById("taskDetail");
    const taskForm = document.getElementById("add-task");
    const remainingTask = document.getElementById("remainingTasks");
    const doneTask = document.getElementById("doneTasks");

    let tasks = [];
    getTask();

    taskForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const newName = taskNameInput.value.trim();
        const newDetail = taskDetailInput.value.trim();
        if (newName && newDetail) {
            const newTask = {
                name: newName,
                detail: newDetail,
                done: false,
            };
            await createTask(newTask);

            taskForm.reset();
        }
    });

    async function getTask() {
        try {
            const res = await axios.get(
                "https://crudcrud.com/api/8f5b315b6a9d474a94db1f59e8dcbf66/tasks"
            );
            tasks = res.data;
            renderList();
        } catch (error) {
            console.error("Error fetching data", error);
        }
    }
    async function createTask(task) {
        try {
            const res = await axios.post(
                "https://crudcrud.com/api/8f5b315b6a9d474a94db1f59e8dcbf66/tasks",
                task
            );
            tasks.push(res.data);
            renderList();
        } catch (error) {
            console.error("Error in creating a task", error);
        }
    }
    async function updateTask(taskId, updatedTask) {
        try {
            await axios.put(`https://crudcrud.com/api/8f5b315b6a9d474a94db1f59e8dcbf66/tasks/${taskId}`,
                updatedTask
            );
        } catch (err) {
            console.error("Error updating task", err);
        }
    }

    async function deleteTask(taskId) {
        try {
            const res = await axios.delete(
                `https://crudcrud.com/api/8f5b315b6a9d474a94db1f59e8dcbf66/tasks/${taskId}`
            );
            tasks = tasks.filter((task) => task._id !== taskId);
            renderList();
        } catch (err) {
            console.error("Error in deleting task", err);
        }
    }

    function renderList() {
        remainingTask.innerHTML = "";
        doneTask.innerHTML = "";
        tasks.forEach((task, index) => {
            const list = document.createElement("li");
            list.textContent = `${task.name} - ${task.detail}`;
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.done;
            checkbox.addEventListener("change", function () {
                tasks[index].done = this.checked;
                updateTask(task._id, tasks[index]);
                renderList();
            });
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                deleteTask(task._id);
            });
            list.appendChild(checkbox);
            list.appendChild(deleteBtn);
            if (task.done) {
                doneTask.appendChild(list);
            } else {
                remainingTask.appendChild(list);
            }
        });
    }
});