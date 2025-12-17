// Tasks Management for LocalMate

// Format date based on language
function formatDate(dateString, language) {
    const date = new Date(dateString);

    if (language === 'fa') {
        // Persian (Shamsi) date
        const jalaaliDate = moment(date).format('jYYYY/jMM/jDD HH:mm');
        return jalaaliDate;
    } else {
        // English (Gregorian) date
        return moment(date).format('YYYY/MM/DD HH:mm');
    }
}

// Check if task is due today
function isToday(dateString) {
    const taskDate = new Date(dateString);
    const today = new Date();

    return taskDate.getDate() === today.getDate() &&
           taskDate.getMonth() === today.getMonth() &&
           taskDate.getFullYear() === today.getFullYear();
}

// Check if task is overdue
function isOverdue(dateString) {
    const taskDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today;
}

// Fetch all tasks
async function fetchTasks() {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE}/tasks?token=${token}`);

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }

        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

// Create new task
async function createTask(title, description, dueDate) {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE}/tasks?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                due_date: dueDate
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        const task = await response.json();
        return task;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

// Toggle task completion
async function toggleTaskCompletion(taskId) {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE}/tasks/${taskId}/complete?token=${token}`, {
            method: 'PUT'
        });

        if (!response.ok) {
            throw new Error('Failed to toggle task completion');
        }

        const task = await response.json();
        return task;
    } catch (error) {
        console.error('Error toggling task:', error);
        throw error;
    }
}

// Move task to today
async function moveTaskToToday(taskId) {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE}/tasks/${taskId}/move-to-today?token=${token}`, {
            method: 'PUT'
        });

        if (!response.ok) {
            throw new Error('Failed to move task to today');
        }

        const task = await response.json();
        return task;
    } catch (error) {
        console.error('Error moving task:', error);
        throw error;
    }
}

// Delete task
async function deleteTask(taskId) {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE}/tasks/${taskId}?token=${token}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

// Render task item
function renderTask(task, isPending = false) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${task.is_completed ? 'completed' : ''}`;
    taskDiv.dataset.taskId = task.id;

    const language = getUserData().language || 'en';
    const formattedDate = formatDate(task.due_date, language);

    taskDiv.innerHTML = `
        <div class="task-header">
            <div class="task-title-wrapper">
                <div class="task-checkbox ${task.is_completed ? 'checked' : ''}" onclick="handleToggleTask(${task.id})"></div>
                <div>
                    <div class="task-title">${task.title}</div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                </div>
            </div>
        </div>
        <div class="task-footer">
            <div class="task-date">${formattedDate}</div>
            <div class="task-actions">
                ${isPending ? `<button class="btn-icon btn-move" onclick="handleMoveToToday(${task.id})" data-i18n="moveToToday">${t('moveToToday')}</button>` : ''}
                <button class="btn-icon btn-delete" onclick="handleDeleteTask(${task.id})" data-i18n="delete">${t('delete')}</button>
            </div>
        </div>
    `;

    return taskDiv;
}

// Load and display tasks
async function loadTasks() {
    const tasks = await fetchTasks();
    const todayTasksList = document.getElementById('todayTasksList');
    const pendingTasksList = document.getElementById('pendingTasksList');

    // Clear existing tasks
    todayTasksList.innerHTML = '';
    pendingTasksList.innerHTML = '';

    // Separate tasks into today's and pending
    const todayTasks = [];
    const pendingTasks = [];

    tasks.forEach(task => {
        if (!task.is_completed && (isToday(task.due_date) || isOverdue(task.due_date))) {
            todayTasks.push(task);
        } else if (!task.is_completed && !isToday(task.due_date)) {
            pendingTasks.push(task);
        } else if (task.is_completed && isToday(task.due_date)) {
            todayTasks.push(task);
        }
    });

    // Render today's tasks
    if (todayTasks.length === 0) {
        todayTasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p data-i18n="emptyTodayTasks">${t('emptyTodayTasks')}</p>
            </div>
        `;
    } else {
        todayTasks.forEach(task => {
            todayTasksList.appendChild(renderTask(task, false));
        });
    }

    // Render pending tasks
    if (pendingTasks.length === 0) {
        pendingTasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <p data-i18n="emptyPendingTasks">${t('emptyPendingTasks')}</p>
            </div>
        `;
    } else {
        pendingTasks.forEach(task => {
            pendingTasksList.appendChild(renderTask(task, true));
        });
    }
}

// Handle toggle task completion
async function handleToggleTask(taskId) {
    try {
        await toggleTaskCompletion(taskId);
        await loadTasks();
    } catch (error) {
        alert(currentLanguage === 'fa' ? 'خطا در تغییر وضعیت وظیفه' : 'Error toggling task');
    }
}

// Handle move task to today
async function handleMoveToToday(taskId) {
    try {
        await moveTaskToToday(taskId);
        showTaskNotification(t('taskMovedSuccess'), 'success');
        await loadTasks();
    } catch (error) {
        alert(currentLanguage === 'fa' ? 'خطا در انتقال وظیفه' : 'Error moving task');
    }
}

// Handle delete task
async function handleDeleteTask(taskId) {
    const confirmMessage = t('confirmDelete');

    if (confirm(confirmMessage)) {
        try {
            await deleteTask(taskId);
            showTaskNotification(t('taskDeletedSuccess'), 'success');
            await loadTasks();
        } catch (error) {
            alert(currentLanguage === 'fa' ? 'خطا در حذف وظیفه' : 'Error deleting task');
        }
    }
}

// Show notification
function showTaskNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: var(--bg-light);
        border-radius: 12px;
        box-shadow: 5px 5px 15px var(--shadow-dark), -5px -5px 15px var(--shadow-light);
        z-index: 1000;
        color: ${type === 'success' ? 'var(--accent)' : 'var(--error)'};
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle form submission
document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;

    if (!title || !dueDate) {
        alert(currentLanguage === 'fa' ? 'لطفا عنوان و تاریخ را وارد کنید' : 'Please enter title and date');
        return;
    }

    try {
        await createTask(title, description, dueDate);
        showTaskNotification(t('taskAddedSuccess'), 'success');

        // Clear form
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskDueDate').value = '';

        // Reload tasks
        await loadTasks();
    } catch (error) {
        alert(currentLanguage === 'fa' ? 'خطا در ایجاد وظیفه' : 'Error creating task');
    }
});

// Back to dashboard button
document.getElementById('backToDashboard').addEventListener('click', () => {
    window.location.href = '/static/dashboard.html';
});

// Update placeholder text based on language
function updatePlaceholders() {
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// Override updatePageText to also update placeholders
const originalUpdatePageText = updatePageText;
updatePageText = function() {
    originalUpdatePageText();
    updatePlaceholders();
    loadTasks(); // Reload tasks when language changes
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default due date to today
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('taskDueDate').value = now.toISOString().slice(0, 16);

    // Load tasks
    loadTasks();

    // Update placeholders
    updatePlaceholders();
});

// Timer functionality
let timerInterval = null;
let timerEndTime = null;
let currentTimerTaskId = null;
let timerDurationMinutes = 0;

// Load tasks into selector
async function loadTaskSelector() {
    const tasks = await fetchTasks();
    const selector = document.getElementById('taskSelector');

    // Clear existing options except first
    selector.innerHTML = `<option value="" data-i18n="selectTask">${t('selectTask')}</option>`;

    // Add incomplete tasks
    tasks.filter(task => !task.is_completed).forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.title;
        selector.appendChild(option);
    });
}

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Start timer
function startTimer() {
    const taskId = document.getElementById('taskSelector').value;
    const duration = parseInt(document.getElementById('timerDuration').value);

    if (!taskId) {
        alert(t('selectTaskFirst'));
        return;
    }

    if (!duration || duration < 1) {
        alert(t('enterDuration'));
        return;
    }

    currentTimerTaskId = taskId;
    timerDurationMinutes = duration;
    timerEndTime = Date.now() + (duration * 60 * 1000);

    // Update UI
    document.getElementById('timerButton').textContent = t('stopTimer');
    document.getElementById('timerButton').onclick = stopTimer;
    document.getElementById('timerDisplay').classList.add('active');
    document.getElementById('taskSelector').disabled = true;
    document.getElementById('timerDuration').disabled = true;

    // Start interval
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// Update timer display
function updateTimer() {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((timerEndTime - now) / 1000));

    document.getElementById('timerTime').textContent = formatTime(remaining);

    if (remaining === 0) {
        timerCompleted();
    }
}

// Stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    resetTimerUI();
}

// Timer completed
async function timerCompleted() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Save time entry
    try {
        const token = getToken();
        await fetch(`${API_BASE}/time-entries?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task_id: currentTimerTaskId,
                duration_minutes: timerDurationMinutes
            })
        });

        showTaskNotification(t('timerCompleted'), 'success');

        // Update total time display
        await updateTaskTotalTime(currentTimerTaskId);
    } catch (error) {
        console.error('Error saving time entry:', error);
    }

    resetTimerUI();
    playCompletionSound();
}

// Reset timer UI
function resetTimerUI() {
    document.getElementById('timerTime').textContent = '00:00';
    document.getElementById('timerButton').textContent = t('startTimer');
    document.getElementById('timerButton').onclick = startTimer;
    document.getElementById('timerDisplay').classList.remove('active');
    document.getElementById('taskSelector').disabled = false;
    document.getElementById('timerDuration').disabled = false;
    document.getElementById('timerDuration').value = '';

    currentTimerTaskId = null;
    timerDurationMinutes = 0;
    timerEndTime = null;
}

// Play completion sound (visual feedback)
function playCompletionSound() {
    // Flash the timer display
    const display = document.getElementById('timerDisplay');
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        display.style.background = flashCount % 2 === 0 ? 'var(--accent)' : 'var(--bg-light)';
        flashCount++;
        if (flashCount >= 6) {
            clearInterval(flashInterval);
            display.style.background = '';
        }
    }, 200);
}

// Update task total time
async function updateTaskTotalTime(taskId) {
    if (!taskId) return;

    try {
        const token = getToken();
        const response = await fetch(`${API_BASE}/tasks/${taskId}/total-time?token=${token}`);

        if (response.ok) {
            const data = await response.json();
            const timeInfo = document.getElementById('taskTimeInfo');
            const timeValue = document.getElementById('totalTimeValue');

            if (data.total_minutes > 0) {
                const hours = Math.floor(data.total_minutes / 60);
                const minutes = data.total_minutes % 60;

                let timeText = '';
                if (hours > 0) {
                    timeText = `${hours} ${t('hours')}`;
                    if (minutes > 0) {
                        timeText += ` ${minutes} ${t('minutes')}`;
                    }
                } else {
                    timeText = `${minutes} ${t('minutes')}`;
                }

                timeValue.innerHTML = timeText;
                timeInfo.style.display = 'block';
            } else {
                timeInfo.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error fetching total time:', error);
    }
}

// Task selector change handler
document.getElementById('taskSelector').addEventListener('change', (e) => {
    updateTaskTotalTime(e.target.value);
});

// Timer button click
document.getElementById('timerButton').addEventListener('click', startTimer);

// Override loadTasks to also update selector
const originalLoadTasks = loadTasks;
loadTasks = async function() {
    await originalLoadTasks();
    await loadTaskSelector();
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
