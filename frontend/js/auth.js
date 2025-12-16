// LocalMate Authentication & Utilities

const API_BASE = 'http://localhost:8000/api';

// Language Management
const translations = {
    en: {
        login: 'Login',
        register: 'Sign Up',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        loginButton: 'Login',
        registerButton: 'Create Account',
        loginSubtitle: 'Welcome back! Please login to your account',
        registerSubtitle: 'Create a new account to get started',
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        loginHere: 'Login here',
        registerHere: 'Register here',
        usernamePlaceholder: 'Enter your username',
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        dashboard: 'Dashboard',
        welcome: 'Welcome',
        logout: 'Logout',
        settings: 'Settings',
        language: 'Language'
    },
    fa: {
        login: 'ورود',
        register: 'ثبت نام',
        username: 'نام کاربری',
        email: 'ایمیل',
        password: 'رمز عبور',
        loginButton: 'ورود',
        registerButton: 'ایجاد حساب کاربری',
        loginSubtitle: 'خوش آمدید! لطفا وارد حساب خود شوید',
        registerSubtitle: 'برای شروع یک حساب کاربری جدید ایجاد کنید',
        noAccount: 'حساب کاربری ندارید؟',
        haveAccount: 'قبلا ثبت نام کرده‌اید؟',
        loginHere: 'اینجا وارد شوید',
        registerHere: 'اینجا ثبت نام کنید',
        usernamePlaceholder: 'نام کاربری خود را وارد کنید',
        emailPlaceholder: 'ایمیل خود را وارد کنید',
        passwordPlaceholder: 'رمز عبور خود را وارد کنید',
        dashboard: 'پنل کاربری',
        welcome: 'خوش آمدید',
        logout: 'خروج',
        settings: 'تنظیمات',
        language: 'زبان'
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

async function registerUser(username, email, password, language) {
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, language })
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
