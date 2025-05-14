document.addEventListener("DOMContentLoaded", function () {
    const taskInput= document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const emptyImage = document.querySelector(".empty-img");
    const todosContainer = document.querySelector(".todos-container");
    const progressBar = document.getElementById("progress");
    const progressNumbers = document.getElementById("numbers");
    const toggleEmptyState = () => {
        const actualTasks = taskList.querySelectorAll('li');
        emptyImage.style.display = actualTasks.length === 0 ? "block" : "none";
        todosContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
    };
    const updateProgressBar = (checkCompletion=true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
        const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        progressBar.style.width = totalTasks ? `${progress}%` : "0%";
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;
        if (checkCompletion && completedTasks === totalTasks) {
            Confetti();
            setTimeout(() => {
                alert("Congratulations! You've completed all tasks!");
            }, 1000);
        }
    }
    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    
    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgressBar();
    };
    const addTask = (text, completed = false, checkCompletion = true) => {
        const taskText = (text || taskInput.value).trim();
        if(!taskText) {
            return;
        }
        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;
        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        
        if(completed){
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed');
                editBtn.disabled = true;
                editBtn.style.opacity = '0.5';
                editBtn.style.pointerEvents = 'none';
            }
            else {
                li.classList.remove('completed');
                editBtn.disabled = false;
                editBtn.style.opacity = '1';
                editBtn.style.pointerEvents = 'auto';
            }
            updateProgressBar();
            saveTaskToLocalStorage();
        });
        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                console.log("Edit button clicked"); 
                const currentText = li.querySelector('span').textContent;
                const newText = prompt("Edit your task:", currentText);
                if (newText !== null && newText.trim() !== "") {
                    li.querySelector('span').textContent = newText.trim();
                    saveTaskToLocalStorage();
                }
            }
        });     
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgressBar();
            saveTaskToLocalStorage();
        });
        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgressBar(checkCompletion);
        saveTaskToLocalStorage();
    };

    addTaskButton.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTask();
        }
    })
    loadTasksFromLocalStorage();
});
const Confetti =() =>{
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
}