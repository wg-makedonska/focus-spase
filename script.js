// ========================================
// FOCUS SPACE 3.0 — JAVASCRIPT
// ========================================


// ========================================
// 1. ОТРИМУЄМО ЕЛЕМЕНТИ СТОРІНКИ
// ========================================

const taskInput = document.getElementById("task-name");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

const progressNumber = document.getElementById("progress-number");
const progressFill = document.getElementById("progress-fill");

const timerDisplay = document.getElementById("timer-display");
const startButton = document.getElementById("start-timer");
const pauseButton = document.getElementById("pause-timer");
const resetButton = document.getElementById("reset-timer");

const timerProgress = document.getElementById("timer-progress");

const themeToggle = document.getElementById("theme-toggle");

const totalTasksElement = document.getElementById("total-tasks");
const completedTasksElement = document.getElementById("completed-tasks");
const focusSessionsElement = document.getElementById("focus-sessions");


// ========================================
// 2. ЗАВАНТАЖУЄМО ЗБЕРЕЖЕНІ ДАНІ
// ========================================

// Завдання
let tasks = JSON.parse(
    localStorage.getItem("focusTasks") || "[]"
);

// Завершені сеанси концентрації
let focusSessions = Number(
    localStorage.getItem("focusSessions") || 0
);


// ========================================
// 3. ЗБЕРІГАЄМО ЗАВДАННЯ
// ========================================

function saveTasks() {

    localStorage.setItem(
        "focusTasks",
        JSON.stringify(tasks)
    );

}


// ========================================
// 4. ОНОВЛЮЄМО ПРОГРЕС
// ========================================

function updateProgress() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const percent = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressNumber.textContent = percent + "%";

    progressFill.style.width = percent + "%";

}


// ========================================
// 5. ОНОВЛЮЄМО СТАТИСТИКУ
// ========================================

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    totalTasksElement.textContent = total;

    completedTasksElement.textContent = completed;

    focusSessionsElement.textContent = focusSessions;

}


// ========================================
// 6. ВІДОБРАЖАЄМО ЗАВДАННЯ
// ========================================

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task) => {

        // Створюємо елемент списку
        const li = document.createElement("li");

        // Створюємо checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        // Виконання завдання
        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

        });

        // Назва завдання
        const text = document.createElement("span");

        text.textContent = task.name;

        if (task.completed) {

            text.style.textDecoration = "line-through";
            text.style.opacity = "0.5";

        }

        // Кнопка видалення
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Видалити";

        deleteButton.addEventListener("click", () => {

            tasks = tasks.filter(
                item => item.id !== task.id
            );

            saveTasks();

            renderTasks();

        });

        // Додаємо елементи
        li.append(
            checkbox,
            text,
            deleteButton
        );

        taskList.appendChild(li);

    });

    // Оновлюємо прогрес і статистику
    updateProgress();

    updateStatistics();

}


// ========================================
// 7. ДОДАЄМО НОВЕ ЗАВДАННЯ
// ========================================

function addTask() {

    const name = taskInput.value.trim();

    if (name === "") {

        alert("Введіть назву завдання!");

        return;

    }

    tasks.push({

        id: Date.now() + Math.random(),

        name: name,

        completed: false

    });

    taskInput.value = "";

    saveTasks();

    renderTasks();

}


// Кнопка додавання
addTaskButton.addEventListener("click", addTask);


// Додавання через Enter
taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        addTask();

    }

});


// ========================================
// 8. ТАЙМЕР — НАЛАШТУВАННЯ
// ========================================

const TOTAL_TIME = 25 * 60;

let timeLeft = TOTAL_TIME;

let timerInterval = null;

let timerEndTime = null;


// ========================================
// 9. КРУГОВИЙ ІНДИКАТОР
// ========================================

const timerRadius = 95;

const timerCircumference = 2 * Math.PI * timerRadius;

timerProgress.style.strokeDasharray = timerCircumference;


// Оновлюємо круговий прогрес
function updateTimerProgress() {

    const progress = timeLeft / TOTAL_TIME;

    const offset = timerCircumference * (1 - progress);

    timerProgress.style.strokeDashoffset = offset;

}


// ========================================
// 10. ВІДОБРАЖЕННЯ ЧАСУ
// ========================================

function updateTimerDisplay() {

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

    updateTimerProgress();

}


// ========================================
// 11. ЗАПУСК ТАЙМЕРА
// ========================================

startButton.addEventListener("click", () => {

    // Не дозволяємо запустити два таймери
    if (timerInterval !== null) {
        return;
    }

    // Якщо час завершився — починаємо заново
    if (timeLeft <= 0) {
        timeLeft = TOTAL_TIME;
    }

    // Визначаємо час завершення
    timerEndTime = Date.now() + timeLeft * 1000;

    timerInterval = setInterval(() => {

        // Рахуємо реальний залишок часу
        const remaining = Math.ceil(
            (timerEndTime - Date.now()) / 1000
        );

        timeLeft = Math.max(0, remaining);

        updateTimerDisplay();

        // Якщо таймер завершився
        if (timeLeft === 0) {

            clearInterval(timerInterval);

            timerInterval = null;

            timerEndTime = null;

            // Зараховуємо завершений сеанс
            focusSessions++;

            localStorage.setItem(
                "focusSessions",
                focusSessions
            );

            updateStatistics();

            alert("Час фокусування завершився!");

        }

    }, 250);

});


// ========================================
// 12. ПАУЗА ТАЙМЕРА
// ========================================

pauseButton.addEventListener("click", () => {

    if (timerInterval === null) {
        return;
    }

    timeLeft = Math.max(
        0,
        Math.ceil((timerEndTime - Date.now()) / 1000)
    );

    clearInterval(timerInterval);

    timerInterval = null;

    timerEndTime = null;

    updateTimerDisplay();

});


// ========================================
// 13. СКИДАННЯ ТАЙМЕРА
// ========================================

resetButton.addEventListener("click", () => {

    clearInterval(timerInterval);

    timerInterval = null;

    timerEndTime = null;

    timeLeft = TOTAL_TIME;

    updateTimerDisplay();

});


// ========================================
// 14. ПЕРЕМИКАННЯ ТЕМИ
// ========================================

// Завантажуємо збережену тему
const savedTheme = localStorage.getItem("focusTheme");

if (savedTheme === "light") {

    document.body.classList.add("light-theme");

}


// Натискання на кнопку
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const isLight = document.body.classList.contains(
        "light-theme"
    );

    localStorage.setItem(
        "focusTheme",
        isLight ? "light" : "dark"
    );

});


// ========================================
// 15. ЗАПУСК ЗАСТОСУНКУ
// ========================================

// Показуємо збережені завдання
renderTasks();

// Показуємо початковий час
updateTimerDisplay();

// Оновлюємо статистику
updateStatistics();


// ========================================
// FOCUS SPACE 3.0 — READY
// ========================================