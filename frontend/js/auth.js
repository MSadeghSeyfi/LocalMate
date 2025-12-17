// LocalMate Authentication & Utilities

const API_BASE = 'http://localhost:8000/api';

// Language Management
const translations = {
    en: {
        login: 'Login',
        register: 'Sign Up',
        username: 'Username',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        loginButton: 'Login',
        registerButton: 'Create Account',
        loginSubtitle: 'Welcome back! Please login to your account',
        registerSubtitle: 'Create a new account to get started',
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        loginHere: 'Login here',
        registerHere: 'Register here',
        usernamePlaceholder: 'Enter your username',
        passwordPlaceholder: 'Enter your password',
        confirmPasswordPlaceholder: 'Re-enter your password',
        dashboard: 'Dashboard',
        welcome: 'Welcome',
        logout: 'Logout',
        settings: 'Settings',
        language: 'Language',
        tasks: 'Tasks',
        todayTasks: "Today's Tasks",
        pendingTasks: 'Pending Tasks',
        taskTitle: 'Task Title',
        taskDescription: 'Description (Optional)',
        dueDate: 'Due Date',
        addTask: 'Add Task',
        taskTitlePlaceholder: 'Enter task title',
        taskDescriptionPlaceholder: 'Enter task description (optional)',
        backToDashboard: 'Dashboard',
        moveToToday: 'Move to Today',
        delete: 'Delete',
        completed: 'Completed',
        emptyTodayTasks: 'No tasks for today',
        emptyPendingTasks: 'No pending tasks',
        goToTasks: 'Manage Tasks',
        taskAddedSuccess: 'Task added successfully!',
        taskDeletedSuccess: 'Task deleted successfully!',
        taskMovedSuccess: 'Task moved to today!',
        confirmDelete: 'Are you sure you want to delete this task?',
        timer: 'Timer',
        startTimer: 'Start Timer',
        stopTimer: 'Stop Timer',
        selectTask: 'Select a task',
        duration: 'Duration (minutes)',
        durationPlaceholder: 'Enter duration in minutes (e.g., 70)',
        timerRunning: 'Timer Running',
        timeRemaining: 'Time Remaining',
        selectTaskFirst: 'Please select a task first',
        enterDuration: 'Please enter duration',
        timerCompleted: 'Timer completed! Great work!',
        studyTime: 'Study Time',
        totalTime: 'Total Time',
        minutes: 'minutes',
        hours: 'hours',
        timeHistory: 'Time History'
    },
    fa: {
        login: 'ورود',
        register: 'ثبت نام',
        username: 'نام کاربری',
        password: 'رمز عبور',
        confirmPassword: 'تکرار رمز عبور',
        loginButton: 'ورود',
        registerButton: 'ایجاد حساب کاربری',
        loginSubtitle: 'خوش آمدید! لطفا وارد حساب خود شوید',
        registerSubtitle: 'برای شروع یک حساب کاربری جدید ایجاد کنید',
        noAccount: 'حساب کاربری ندارید؟',
        haveAccount: 'قبلا ثبت نام کرده‌اید؟',
        loginHere: 'اینجا وارد شوید',
        registerHere: 'اینجا ثبت نام کنید',
        usernamePlaceholder: 'نام کاربری خود را وارد کنید',
        passwordPlaceholder: 'رمز عبور خود را وارد کنید',
        confirmPasswordPlaceholder: 'رمز عبور خود را دوباره وارد کنید',
        dashboard: 'پنل کاربری',
        welcome: 'خوش آمدید',
        logout: 'خروج',
        settings: 'تنظیمات',
        language: 'زبان',
        tasks: 'وظایف',
        todayTasks: 'وظایف امروز',
        pendingTasks: 'وظایف انجام نشده',
        taskTitle: 'عنوان وظیفه',
        taskDescription: 'توضیحات (اختیاری)',
        dueDate: 'تاریخ انجام',
        addTask: 'افزودن وظیفه',
        taskTitlePlaceholder: 'عنوان وظیفه را وارد کنید',
        taskDescriptionPlaceholder: 'توضیحات را وارد کنید (اختیاری)',
        backToDashboard: 'پنل کاربری',
        moveToToday: 'انتقال به امروز',
        delete: 'حذف',
        completed: 'انجام شده',
        emptyTodayTasks: 'هیچ وظیفه‌ای برای امروز وجود ندارد',
        emptyPendingTasks: 'هیچ وظیفه انجام نشده‌ای وجود ندارد',
        goToTasks: 'مدیریت وظایف',
        taskAddedSuccess: 'وظیفه با موفقیت اضافه شد!',
        taskDeletedSuccess: 'وظیفه با موفقیت حذف شد!',
        taskMovedSuccess: 'وظیفه به امروز منتقل شد!',
        confirmDelete: 'آیا مطمئن هستید که می‌خواهید این وظیفه را حذف کنید؟',
        timer: 'تایمر',
        startTimer: 'شروع تایمر',
        stopTimer: 'توقف تایمر',
        selectTask: 'یک وظیفه انتخاب کنید',
        duration: 'مدت زمان (دقیقه)',
        durationPlaceholder: 'مدت زمان را به دقیقه وارد کنید (مثال: 70)',
        timerRunning: 'تایمر در حال اجرا',
        timeRemaining: 'زمان باقیمانده',
        selectTaskFirst: 'لطفا ابتدا یک وظیفه انتخاب کنید',
        enterDuration: 'لطفا مدت زمان را وارد کنید',
        timerCompleted: 'تایمر تمام شد! کار عالی!',
        studyTime: 'زمان مطالعه',
        totalTime: 'مجموع زمان',
        minutes: 'دقیقه',
        hours: 'ساعت',
        timeHistory: 'تاریخچه زمان'
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);

    if (lang === 'fa') {
        document.body.classList.add('rtl');
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.body.classList.remove('rtl');
        document.documentElement.setAttribute('dir', 'ltr');
    }

    updatePageText();
}

function t(key) {
    return translations[currentLanguage][key] || key;
}

function updatePageText() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
            element.placeholder = t(key);
        } else {
            element.textContent = t(key);
        }
    });
}

// Token Management
function setToken(token) {
    localStorage.setItem('access_token', token);
}

function getToken() {
    return localStorage.getItem('access_token');
}

function removeToken() {
    localStorage.removeItem('access_token');
}

function setUserData(data) {
    localStorage.setItem('username', data.username);
    localStorage.setItem('language', data.language);
}

function getUserData() {
    return {
        username: localStorage.getItem('username'),
        language: localStorage.getItem('language')
    };
}

function isAuthenticated() {
    return !!getToken();
}

function redirectToDashboard() {
    window.location.href = '/static/dashboard.html';
}

function redirectToLogin() {
    window.location.href = '/static/login.html';
}

// API Calls
async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }

        const data = await response.json();
        setToken(data.access_token);
        setUserData(data);
        return data;
    } catch (error) {
        throw error;
    }
}

async function registerUser(username, password, confirm_password, language) {
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, confirm_password, language })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }

        const data = await response.json();
        setToken(data.access_token);
        setUserData(data);
        return data;
    } catch (error) {
        throw error;
    }
}

function logout() {
    removeToken();
    localStorage.removeItem('username');
    redirectToLogin();
}

// Alert Messages
function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const form = document.querySelector('form');
    form.insertBefore(alertDiv, form.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);

    // Language selector
    const langSelector = document.getElementById('languageSelect');
    if (langSelector) {
        langSelector.value = currentLanguage;
        langSelector.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});
