// Глобальные переменные
let zIndexCounter = 100;
let activeWindow = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initStartMenu();
    initDesktopIcons();
    initWindows();
    initTaskbar();
});

// Часы
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const clockElement = document.getElementById('clock');
    
    if (!clockElement) return;
    
    // Время
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Дата
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${day}.${month}.${year}`;
    
    clockElement.querySelector('.clock-time').textContent = timeString;
    clockElement.querySelector('.clock-date').textContent = dateString;
}

// Меню Пуск
function initStartMenu() {
    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('start-menu');
    const desktop = document.querySelector('.desktop');
    
    if (!startButton || !startMenu) return;
    
    // Открытие/закрытие меню Пуск
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });
    
    // Закрытие меню при клике вне его
    desktop.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
            closeStartMenu();
        }
    });
    
    // Приложения в меню Пуск
    const startAppTiles = document.querySelectorAll('.start-app-tile');
    startAppTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const appName = tile.dataset.app;
            openWindow(appName);
            closeStartMenu();
        });
    });
}

function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.querySelector('.start-button');
    
    if (startMenu.classList.contains('active')) {
        closeStartMenu();
    } else {
        startMenu.classList.add('active');
        startButton.classList.add('active');
    }
}

function closeStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.querySelector('.start-button');
    
    startMenu.classList.remove('active');
    startButton.classList.remove('active');
}

// Иконки рабочего стола
function initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    
    icons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const appName = icon.dataset.app;
            openWindow(appName);
        });
    });
}

// Управление окнами
function initWindows() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(window => {
        initWindowControls(window);
        initWindowDragging(window);
        makeWindowClickable(window);
    });
}

function initWindowControls(window) {
    const minimizeBtn = window.querySelector('.minimize-btn');
    const maximizeBtn = window.querySelector('.maximize-btn');
    const closeBtn = window.querySelector('.close-btn');
    
    // Минимизация
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            minimizeWindow(window);
        });
    }
    
    // Максимизация
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMaximizeWindow(window);
        });
    }
    
    // Закрытие
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeWindow(window);
        });
    }
}

function initWindowDragging(window) {
    const titlebar = window.querySelector('.window-titlebar');
    
    if (!titlebar) return;
    
    titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-btn')) return;
        if (window.classList.contains('maximized')) return;
        
        isDragging = true;
        activeWindow = window;
        
        const rect = window.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        bringWindowToFront(window);
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        e.preventDefault();
    });
    
    // Двойной клик для максимизации
    titlebar.addEventListener('dblclick', (e) => {
        if (e.target.closest('.window-btn')) return;
        toggleMaximizeWindow(window);
    });
}

function onMouseMove(e) {
    if (!isDragging || !activeWindow) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Ограничения по краям экрана
    const maxX = window.innerWidth - activeWindow.offsetWidth;
    const maxY = window.innerHeight - 48 - activeWindow.offsetHeight; // 48px - высота панели задач
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    activeWindow.style.left = boundedX + 'px';
    activeWindow.style.top = boundedY + 'px';
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

function makeWindowClickable(window) {
    window.addEventListener('mousedown', () => {
        bringWindowToFront(window);
    });
}

function openWindow(appName) {
    const window = document.getElementById(`${appName}-window`);
    
    if (!window) return;
    
    // Если окно уже открыто, просто активируем его
    if (window.classList.contains('active')) {
        bringWindowToFront(window);
        return;
    }
    
    // Открываем окно
    window.classList.add('active');
    window.classList.remove('minimized');
    
    // Позиционируем окно в центре
    if (!window.style.left || !window.style.top) {
        centerWindow(window);
    }
    
    bringWindowToFront(window);
    addToTaskbar(appName);
}

function closeWindow(window) {
    window.classList.remove('active');
    window.classList.remove('maximized');
    
    const appName = window.dataset.app;
    removeFromTaskbar(appName);
}

function minimizeWindow(window) {
    window.classList.add('minimized');
    window.classList.remove('active');
    
    const appName = window.dataset.app;
    updateTaskbarApp(appName, false);
}

function toggleMaximizeWindow(window) {
    window.classList.toggle('maximized');
    bringWindowToFront(window);
}

function bringWindowToFront(window) {
    zIndexCounter++;
    window.style.zIndex = zIndexCounter;
    
    // Обновляем активное окно
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active');
    });
    window.classList.add('active');
    
    // Обновляем панель задач
    const appName = window.dataset.app;
    updateTaskbarApp(appName, true);
}

function centerWindow(window) {
    const windowWidth = window.offsetWidth || 600;
    const windowHeight = window.offsetHeight || 500;
    
    const left = (window.innerWidth - windowWidth) / 2;
    const top = (window.innerHeight - 48 - windowHeight) / 2; // 48px - высота панели задач
    
    window.style.left = Math.max(0, left) + 'px';
    window.style.top = Math.max(0, top) + 'px';
}

// Панель задач
function initTaskbar() {
    const taskbarApps = document.getElementById('taskbar-apps');
    
    // Обработчик клика по приложениям в панели задач
    taskbarApps.addEventListener('click', (e) => {
        const taskbarApp = e.target.closest('.taskbar-app');
        if (!taskbarApp) return;
        
        const appName = taskbarApp.dataset.app;
        const window = document.getElementById(`${appName}-window`);
        
        if (!window) return;
        
        // Если окно минимизировано или не активно, открываем/активируем его
        if (window.classList.contains('minimized') || !window.classList.contains('active')) {
            window.classList.remove('minimized');
            window.classList.add('active');
            bringWindowToFront(window);
        } else {
            // Если окно активно, минимизируем его
            minimizeWindow(window);
        }
    });
}

function addToTaskbar(appName) {
    const taskbarApps = document.getElementById('taskbar-apps');
    
    // Проверяем, не добавлено ли уже
    if (taskbarApps.querySelector(`[data-app="${appName}"]`)) {
        updateTaskbarApp(appName, true);
        return;
    }
    
    const window = document.getElementById(`${appName}-window`);
    const title = window.querySelector('.window-title span:last-child').textContent;
    const icon = window.querySelector('.window-icon').textContent;
    
    const taskbarApp = document.createElement('button');
    taskbarApp.className = 'taskbar-app active';
    taskbarApp.dataset.app = appName;
    taskbarApp.innerHTML = `
        <span class="taskbar-app-icon">${icon}</span>
        <span class="taskbar-app-label">${title}</span>
    `;
    
    taskbarApps.appendChild(taskbarApp);
}

function removeFromTaskbar(appName) {
    const taskbarApps = document.getElementById('taskbar-apps');
    const taskbarApp = taskbarApps.querySelector(`[data-app="${appName}"]`);
    
    if (taskbarApp) {
        taskbarApp.remove();
    }
}

function updateTaskbarApp(appName, isActive) {
    const taskbarApps = document.getElementById('taskbar-apps');
    const taskbarApp = taskbarApps.querySelector(`[data-app="${appName}"]`);
    
    if (!taskbarApp) return;
    
    if (isActive) {
        taskbarApp.classList.add('active');
    } else {
        taskbarApp.classList.remove('active');
    }
}

// Дополнительные функции для улучшения UX

// Закрытие окон при нажатии Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeWindow = document.querySelector('.window.active');
        if (activeWindow && !activeWindow.classList.contains('minimized')) {
            closeWindow(activeWindow);
        }
        closeStartMenu();
    }
});

// Автоматическое открытие окна "Обо мне" при первой загрузке
setTimeout(() => {
    openWindow('about');
}, 500);

// Эффект наведения для иконок рабочего стола
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.05)';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1)';
    });
});

// Анимация прогресс-баров навыков при открытии окна
const skillsWindow = document.getElementById('skills-window');
if (skillsWindow) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (skillsWindow.classList.contains('active') && !skillsWindow.classList.contains('minimized')) {
                    animateSkillBars();
                }
            }
        });
    });
    
    observer.observe(skillsWindow, { attributes: true });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100 + index * 50);
    });
}

// Предотвращение выделения текста при перетаскивании
document.addEventListener('selectstart', (e) => {
    if (isDragging) {
        e.preventDefault();
    }
});

// Адаптация размера окон при изменении размера экрана
window.addEventListener('resize', () => {
    document.querySelectorAll('.window.active:not(.maximized)').forEach(window => {
        const rect = window.getBoundingClientRect();
        
        // Проверяем, не вышло ли окно за границы экрана
        if (rect.right > window.innerWidth) {
            window.style.left = (window.innerWidth - window.offsetWidth - 10) + 'px';
        }
        
        if (rect.bottom > window.innerHeight - 48) {
            window.style.top = (window.innerHeight - 48 - window.offsetHeight - 10) + 'px';
        }
    });
});

// Функция для открытия всех окон последовательно (демонстрация)
function openAllWindows() {
    const apps = ['about', 'skills', 'experience', 'projects', 'contact'];
    apps.forEach((app, index) => {
        setTimeout(() => {
            openWindow(app);
        }, index * 300);
    });
}

// Добавляем функцию в глобальную область для возможного использования
window.openAllWindows = openAllWindows;

console.log('Windows 10 Resume Site initialized! 🎉');
console.log('Tip: You can call openAllWindows() in console to open all windows at once.');
