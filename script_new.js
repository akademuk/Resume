// ========================================
// macOS Portfolio - Enhanced JavaScript
// ========================================

class MacOSPortfolio {
    constructor() {
        this.zIndexCounter = 100;
        this.activeWindow = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.theme = localStorage.getItem('theme') || 'light';
        this.terminalHistory = [];
        this.terminalHistoryIndex = -1;
        
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.initTheme();
        this.initClock();
        this.initDock();
        this.initWindows();
        this.initSpotlight();
        this.initNotificationCenter();
        this.initContextMenu();
        this.initTerminal();
        this.initSkillsTabs();
        this.initProjectsView();
        this.initProjectViewer();
        this.initContactForm();
        this.initKeyboardShortcuts();
        this.initBattery();
        this.welcomeNotification();
        this.initEasterEggs();
        this.initCursorEffects();
        this.initDraggableWindows();
        this.initAppleMenu();
        this.initChat();
    }

    // ========================================
    // Loading Screen
    // ========================================
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 500);
        }, 2000);
    }

    // ========================================
    // Theme Management
    // ========================================
    
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        if (this.theme === 'dark') {
            body.classList.add('dark-theme');
        }
        
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            this.theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', this.theme);
            this.showNotification('Тема изменена', `Активирована ${this.theme === 'dark' ? 'тёмная' : 'светлая'} тема`);
        });
    }

    // ========================================
    // Clock
    // ========================================
    
    initClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const clock = document.getElementById('menu-clock');
        const now = new Date();
        
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        
        const day = days[now.getDay()];
        const date = `${now.getDate()} ${months[now.getMonth()]}`;
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        clock.querySelector('.clock-day').textContent = day;
        clock.querySelector('.clock-date').textContent = date;
        clock.querySelector('.clock-time').textContent = time;
    }

    // ========================================
    // Battery
    // ========================================
    
    async initBattery() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                this.updateBattery(battery);
                
                battery.addEventListener('levelchange', () => this.updateBattery(battery));
                battery.addEventListener('chargingchange', () => this.updateBattery(battery));
            } catch (error) {
                console.log('Battery API not available');
            }
        }
    }

    updateBattery(battery) {
        const batteryIcon = document.getElementById('battery-icon');
        const level = Math.round(battery.level * 100);
        
        batteryIcon.querySelector('.battery-percent').textContent = `${level}%`;
        
        const icon = batteryIcon.querySelector('i');
        icon.className = 'fas fa-battery-full';
        
        if (battery.charging) {
            icon.className = 'fas fa-battery-bolt';
        } else if (level <= 20) {
            icon.className = 'fas fa-battery-empty';
        } else if (level <= 50) {
            icon.className = 'fas fa-battery-half';
        }
    }

    // ========================================
    // Dock
    // ========================================
    
    initDock() {
        const dockItems = document.querySelectorAll('.dock-item[data-app]');
        
        dockItems.forEach(item => {
            item.addEventListener('click', () => {
                const app = item.dataset.app;
                const window = document.getElementById(`${app}-window`);
                
                if (window.classList.contains('active') && !window.classList.contains('minimized')) {
                    this.minimizeWindow(window);
                } else {
                    this.openWindow(app);
                }
            });
        });

        // Trash animation
        const trash = document.getElementById('trash');
        trash.addEventListener('click', () => {
            this.showNotification('Корзина', 'Корзина пуста');
        });

        // Dock magnification effect
        this.initDockMagnification();
    }

    initDockMagnification() {
        const dockItems = document.querySelectorAll('.dock-item');
        const dock = document.querySelector('.dock-container');
        
        dock.addEventListener('mousemove', (e) => {
            dockItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const distance = Math.abs(e.clientX - centerX);
                const scale = Math.max(1, 1.5 - distance / 200);
                
                item.style.transform = `scale(${scale})`;
            });
        });
        
        dock.addEventListener('mouseleave', () => {
            dockItems.forEach(item => {
                item.style.transform = 'scale(1)';
            });
        });
    }

    // ========================================
    // Windows Management
    // ========================================
    
    initWindows() {
        const windows = document.querySelectorAll('.window');
        
        windows.forEach(window => {
            this.initWindowControls(window);
            this.initWindowDragging(window);
            this.makeWindowClickable(window);
        });
    }

    initWindowControls(window) {
        const closeBtn = window.querySelector('.traffic-light.close');
        const minimizeBtn = window.querySelector('.traffic-light.minimize');
        const maximizeBtn = window.querySelector('.traffic-light.maximize');
        
        closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(window);
        });
        
        minimizeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(window);
        });
        
        maximizeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMaximize(window);
        });
    }

    initWindowDragging(window) {
        const header = window.querySelector('.window-header');
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.traffic-lights') || e.target.closest('.window-toolbar')) return;
            if (window.classList.contains('maximized')) return;
            
            this.isDragging = true;
            this.activeWindow = window;
            
            const rect = window.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            this.bringToFront(window);
            
            document.addEventListener('mousemove', this.handleDrag);
            document.addEventListener('mouseup', this.handleDragEnd);
            
            e.preventDefault();
        });
        
        // Double-click to maximize
        header.addEventListener('dblclick', (e) => {
            if (e.target.closest('.traffic-lights')) return;
            this.toggleMaximize(window);
        });
    }

    handleDrag = (e) => {
        if (!this.isDragging || !this.activeWindow) return;
        
        const newX = e.clientX - this.dragOffset.x;
        const newY = Math.max(28, e.clientY - this.dragOffset.y); // Below menu bar
        
        this.activeWindow.style.left = newX + 'px';
        this.activeWindow.style.top = newY + 'px';
    }

    handleDragEnd = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
    }

    makeWindowClickable(window) {
        window.addEventListener('mousedown', () => {
            this.bringToFront(window);
        });
    }

    openWindow(appName) {
        const window = document.getElementById(`${appName}-window`);
        if (!window) return;
        
        if (window.classList.contains('active')) {
            this.bringToFront(window);
            window.classList.remove('minimized');
            return;
        }
        
        window.classList.add('active');
        window.classList.remove('minimized');
        
        if (!window.style.left || !window.style.top) {
            this.centerWindow(window);
        }
        
        this.bringToFront(window);
        this.updateDock(appName, true);
        
        // Trigger animations for specific windows
        if (appName === 'skills') {
            setTimeout(() => this.animateSkills(), 300);
        }
    }

    closeWindow(window) {
        window.classList.remove('active', 'minimized', 'maximized');
        const appName = window.dataset.app;
        this.updateDock(appName, false);
    }

    minimizeWindow(window) {
        window.classList.add('minimized');
        const appName = window.dataset.app;
        this.updateDock(appName, false);
    }

    toggleMaximize(window) {
        window.classList.toggle('maximized');
        this.bringToFront(window);
    }

    bringToFront(window) {
        this.zIndexCounter++;
        window.style.zIndex = this.zIndexCounter;
        
        document.querySelectorAll('.window').forEach(w => {
            w.classList.remove('active');
        });
        window.classList.add('active');
    }

    centerWindow(window) {
        const rect = window.getBoundingClientRect();
        const left = (window.innerWidth - rect.width) / 2;
        const top = (window.innerHeight - rect.height - 80) / 2 + 28; // Account for menu bar and dock
        
        window.style.left = Math.max(0, left) + 'px';
        window.style.top = Math.max(28, top) + 'px';
    }

    updateDock(appName, isActive) {
        const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
        if (!dockItem) return;
        
        if (isActive) {
            dockItem.classList.add('active');
        } else {
            dockItem.classList.remove('active');
        }
    }

    // ========================================
    // Spotlight Search
    // ========================================
    
    initSpotlight() {
        const spotlight = document.getElementById('spotlight');
        const searchIcon = document.getElementById('search-icon');
        const input = document.getElementById('spotlight-input');
        const results = document.getElementById('spotlight-results');
        
        const openSpotlight = () => {
            spotlight.classList.add('active');
            input.focus();
            this.generateSpotlightResults('');
        };
        
        const closeSpotlight = () => {
            spotlight.classList.remove('active');
            input.value = '';
            results.innerHTML = '';
        };
        
        searchIcon.addEventListener('click', openSpotlight);
        
        input.addEventListener('input', (e) => {
            this.generateSpotlightResults(e.target.value);
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSpotlight();
            } else if (e.key === 'Enter') {
                const selected = results.querySelector('.spotlight-result.selected');
                if (selected) {
                    selected.click();
                    closeSpotlight();
                }
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateSpotlightResults(e.key === 'ArrowDown' ? 1 : -1);
            }
        });
        
        spotlight.addEventListener('click', (e) => {
            if (e.target === spotlight) {
                closeSpotlight();
            }
        });
    }

    generateSpotlightResults(query) {
        const results = document.getElementById('spotlight-results');
        const searchableItems = [
            { name: 'Обо мне', icon: 'user-circle', app: 'about', type: 'Приложение' },
            { name: 'Навыки', icon: 'code', app: 'skills', type: 'Приложение' },
            { name: 'Опыт работы', icon: 'briefcase', app: 'experience', type: 'Приложение' },
            { name: 'Проекты', icon: 'folder-open', app: 'projects', type: 'Приложение' },
            { name: 'Контакты', icon: 'address-book', app: 'contacts', type: 'Приложение' },
            { name: 'Terminal', icon: 'terminal', app: 'terminal', type: 'Приложение' },
            { name: 'Темная тема', icon: 'moon', action: 'theme', type: 'Действие' },
            { name: 'Скачать резюме', icon: 'download', action: 'download', type: 'Действие' },
        ];
        
        const filtered = searchableItems.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filtered.length === 0) {
            results.innerHTML = '<div class="spotlight-result"><i class="fas fa-circle-xmark"></i><div>Ничего не найдено</div></div>';
            return;
        }
        
        results.innerHTML = filtered.map((item, index) => `
            <div class="spotlight-result ${index === 0 ? 'selected' : ''}" data-app="${item.app || ''}" data-action="${item.action || ''}">
                <i class="fas fa-${item.icon}"></i>
                <div>
                    <div>${item.name}</div>
                    <div style="font-size: 12px; opacity: 0.6;">${item.type}</div>
                </div>
            </div>
        `).join('');
        
        results.querySelectorAll('.spotlight-result').forEach(result => {
            result.addEventListener('click', () => {
                const app = result.dataset.app;
                const action = result.dataset.action;
                
                if (app) {
                    this.openWindow(app);
                } else if (action === 'theme') {
                    document.getElementById('theme-toggle').click();
                } else if (action === 'download') {
                    this.downloadResume();
                }
                
                document.getElementById('spotlight').classList.remove('active');
            });
        });
    }

    navigateSpotlightResults(direction) {
        const results = document.querySelectorAll('.spotlight-result');
        const selected = document.querySelector('.spotlight-result.selected');
        
        if (!selected || results.length === 0) return;
        
        const currentIndex = Array.from(results).indexOf(selected);
        let newIndex = currentIndex + direction;
        
        if (newIndex < 0) newIndex = results.length - 1;
        if (newIndex >= results.length) newIndex = 0;
        
        selected.classList.remove('selected');
        results[newIndex].classList.add('selected');
        results[newIndex].scrollIntoView({ block: 'nearest' });
    }

    // ========================================
    // Notification Center
    // ========================================
    
    initNotificationCenter() {
        const controlCenter = document.getElementById('control-center');
        const notificationCenter = document.getElementById('notification-center');
        const clearBtn = document.getElementById('clear-notifications');
        
        controlCenter.addEventListener('click', () => {
            notificationCenter.classList.toggle('active');
        });
        
        clearBtn.addEventListener('click', () => {
            const list = document.getElementById('notifications-list');
            list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">Нет уведомлений</div>';
        });
        
        document.addEventListener('click', (e) => {
            if (!notificationCenter.contains(e.target) && !controlCenter.contains(e.target)) {
                notificationCenter.classList.remove('active');
            }
        });
    }

    showNotification(title, message) {
        const list = document.getElementById('notifications-list');
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
                <span class="notification-time">Только что</span>
            </div>
        `;
        
        if (list.querySelector('[style*="text-align"]')) {
            list.innerHTML = '';
        }
        
        list.insertBefore(notification, list.firstChild);
    }

    welcomeNotification() {
        setTimeout(() => {
            this.showNotification(
                'Добро пожаловать! 👋',
                'Спасибо за интерес к моему портфолио. Нажмите ⌘+Space для быстрого поиска!'
            );
        }, 3000);
    }

    // ========================================
    // Context Menu
    // ========================================
    
    initContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        const desktop = document.querySelector('.desktop-wallpaper');
        
        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';
            contextMenu.classList.add('active');
        });
        
        document.addEventListener('click', () => {
            contextMenu.classList.remove('active');
        });
        
        contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                
                if (action === 'refresh') {
                    location.reload();
                } else if (action === 'wallpaper') {
                    this.showNotification('Обои', 'Функция смены обоев в разработке');
                }
            });
        });
    }

    // ========================================
    // Terminal
    // ========================================
    
    initTerminal() {
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                this.executeTerminalCommand(command);
                input.value = '';
                this.terminalHistoryIndex = -1;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.terminalHistoryIndex < this.terminalHistory.length - 1) {
                    this.terminalHistoryIndex++;
                    input.value = this.terminalHistory[this.terminalHistory.length - 1 - this.terminalHistoryIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.terminalHistoryIndex > 0) {
                    this.terminalHistoryIndex--;
                    input.value = this.terminalHistory[this.terminalHistory.length - 1 - this.terminalHistoryIndex];
                } else {
                    this.terminalHistoryIndex = -1;
                    input.value = '';
                }
            }
        });
    }

    executeTerminalCommand(command) {
        if (!command) return;
        
        this.terminalHistory.push(command);
        const output = document.getElementById('terminal-output');
        
        // Add command to output
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `
            <span class="terminal-prompt">guest@oleg-portfolio</span>
            <span class="terminal-path">~</span>
            <span class="terminal-symbol">$</span>
            <span class="terminal-text">${command}</span>
        `;
        output.appendChild(commandLine);
        
        // Execute command
        const response = this.getTerminalResponse(command);
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        responseLine.innerHTML = `<span class="terminal-text">${response}</span>`;
        output.appendChild(responseLine);
        
        const blankLine = document.createElement('div');
        blankLine.className = 'terminal-line blank';
        output.appendChild(blankLine);
        
        // Scroll to bottom
        output.parentElement.scrollTop = output.parentElement.scrollHeight;
    }

    getTerminalResponse(command) {
        const cmd = command.toLowerCase().trim();
        
        const commands = {
            help: `Доступные команды:
  <span style="color: #4EC9B0;">help</span>      - показать список команд
  <span style="color: #4EC9B0;">about</span>     - информация обо мне
  <span style="color: #4EC9B0;">skills</span>    - мои навыки
  <span style="color: #4EC9B0;">projects</span>  - мои проекты
  <span style="color: #4EC9B0;">contact</span>   - контактная информация
  <span style="color: #4EC9B0;">clear</span>     - очистить терминал
  <span style="color: #4EC9B0;">theme</span>     - переключить тему
  <span style="color: #4EC9B0;">download</span>  - скачать резюме
  <span style="color: #4EC9B0;">socials</span>   - мои соцсети
  <span style="color: #4EC9B0;">joke</span>      - случайная шутка
  <span style="color: #4EC9B0;">date</span>      - текущая дата
  
  <span style="color: #CE9178;">🎮 Пасхалки:</span>
  <span style="color: #4EC9B0;">matrix</span>    - эффект Матрицы
  <span style="color: #4EC9B0;">confetti</span>  - праздничное конфетти
  <span style="color: #4EC9B0;">coffee</span>    - сварить кофе
  <span style="color: #4EC9B0;">hack</span>      - взломать систему
  <span style="color: #4EC9B0;">rickroll</span>  - сюрприз 😉
  <span style="color: #4EC9B0;">sudo</span>      - попробуйте...
  
  Попробуйте Konami код: ↑↑↓↓←→←→BA`,
            
            about: 'Oleg Fedorov - Middle Markup Developer\n3+ года опыта в веб-разработке\nМосква, Россия 🇷🇺',
            
            skills: 'Основные навыки:\n• HTML5 / CSS3 / JavaScript\n• React / Next.js / TypeScript\n• Sass / Tailwind CSS\n• Git / Webpack / Figma',
            
            projects: 'Проекты:\n1. E-Commerce Platform (React, TypeScript)\n2. Analytics Dashboard (Vue.js, Chart.js)\n3. Creative Portfolio (HTML/CSS/JS)\n4. Task Manager Pro (React, Redux)\n5. Weather Forecast App (React, API)\n6. UI Components Library (React, Storybook)',
            
            contact: 'Контакты:\n📧 Email: oleg.fedorov@example.com\n💬 Telegram: @olegfedorov\n💼 LinkedIn: linkedin.com/in/olegfedorov\n🐙 GitHub: github.com/olegfedorov',
            
            clear: () => {
                document.getElementById('terminal-output').innerHTML = '';
                return '';
            },
            
            theme: () => {
                document.getElementById('theme-toggle').click();
                return 'Тема изменена ✓';
            },
            
            download: () => {
                this.downloadResume();
                return 'Скачивание резюме начато... ⬇️';
            },
            
            socials: 'Мои соцсети:\n• GitHub: github.com/olegfedorov\n• LinkedIn: linkedin.com/in/olegfedorov\n• Telegram: @olegfedorov',
            
            joke: () => {
                const jokes = [
                    'Почему программисты путают Хэллоуин и Рождество? Потому что OCT 31 = DEC 25 😄',
                    'Настоящий программист может написать Hello World на 10 языках, но не может сказать это на человеческом 🤓',
                    'В чём разница между Java и JavaScript? Примерно как между Кар и Карпатами 🚗',
                    'Лучшие программисты - это ленивые программисты. Они автоматизируют всё! 💤',
                    'Багов нет, это недокументированные фичи! 🐛'
                ];
                return jokes[Math.floor(Math.random() * jokes.length)];
            },
            
            date: () => new Date().toLocaleString('ru-RU'),
            
            matrix: () => {
                this.matrixEffect();
                return 'Добро пожаловать в Матрицу... 🟢';
            },
            
            confetti: () => {
                this.confettiEffect();
                return '🎉 Праздник начался!';
            },
            
            rickroll: () => {
                window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                return 'Never gonna give you up... 🎵';
            },
            
            coffee: () => {
                return '☕ Заваривается кофе... Подождите 3 секунды...\n...\n...\nГотово! Ваш виртуальный кофе готов! ☕✨';
            },
            
            hack: () => {
                return 'Взлом Пентагона...\n[████████████] 100%\nГотово! Шутка 😄 Я законопослушный разработчик!';
            },
            
            sudo: (args) => {
                if (args === 'rm -rf /') {
                    return '⚠️ ОТКАЗАНО! Не пытайтесь удалить мое портфолио! 😤';
                }
                return 'Привилегии суперпользователя не требуются для просмотра резюме 😉';
            },
        };
        
        if (commands[cmd]) {
            return typeof commands[cmd] === 'function' ? commands[cmd](args) : commands[cmd];
        }
        
        return `Command not found: ${command}\nType <span style="color: #4EC9B0;">help</span> for available commands.`;
    }

    matrixEffect() {
        const chars = '01アイウエオカキクケコサシスセソタチツテト';
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            color: #0f0;
            font-family: monospace;
            font-size: 20px;
            overflow: hidden;
            z-index: 999999;
            animation: fadeOut 5s ease 3s forwards;
        `;
        
        for (let i = 0; i < 50; i++) {
            const column = document.createElement('div');
            column.style.cssText = `
                position: absolute;
                top: -100px;
                left: ${Math.random() * 100}%;
                animation: fall ${3 + Math.random() * 3}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            column.textContent = Array(20).fill(0).map(() => 
                chars[Math.floor(Math.random() * chars.length)]
            ).join('\n');
            overlay.appendChild(column);
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to { transform: translateY(100vh); }
            }
            @keyframes fadeOut {
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.remove();
            style.remove();
        }, 8000);
    }

    confettiEffect() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = ['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)];
            confetti.style.cssText = `
                position: fixed;
                top: -50px;
                left: ${Math.random() * 100}vw;
                font-size: ${20 + Math.random() * 20}px;
                animation: confettiFall ${2 + Math.random() * 2}s ease-out forwards;
                z-index: 999999;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }
        
        const confettiStyle = document.createElement('style');
        confettiStyle.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 720}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(confettiStyle);
        setTimeout(() => confettiStyle.remove(), 4000);
    }

    // ========================================
    // Project Viewer
    // ========================================
    
    initProjectViewer() {
        const projectBtns = document.querySelectorAll('.project-btn[data-project-url]');
        const viewerWindow = document.getElementById('project-viewer');
        const iframe = document.getElementById('project-iframe');
        const viewerTitle = document.getElementById('viewer-title');
        const viewerUrl = document.getElementById('viewer-url');
        const backBtn = document.getElementById('viewer-back');
        const forwardBtn = document.getElementById('viewer-forward');
        const reloadBtn = document.getElementById('viewer-reload');
        const externalBtn = document.getElementById('viewer-external');
        
        let currentUrl = '';
        
        projectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = btn.dataset.projectUrl;
                const name = btn.dataset.projectName;
                
                if (url && url !== '#') {
                    this.openProjectInViewer(url, name);
                } else {
                    this.showNotification('Проект', 'Демо-версия проекта в разработке');
                }
            });
        });
        
        backBtn?.addEventListener('click', () => {
            iframe.contentWindow?.history.back();
        });
        
        forwardBtn?.addEventListener('click', () => {
            iframe.contentWindow?.history.forward();
        });
        
        reloadBtn?.addEventListener('click', () => {
            if (currentUrl) {
                iframe.src = currentUrl;
                this.showNotification('Обновлено', 'Страница перезагружена');
            }
        });
        
        externalBtn?.addEventListener('click', () => {
            if (currentUrl) {
                window.open(currentUrl, '_blank');
                this.showNotification('Открыто', 'Проект открыт в новой вкладке');
            }
        });
        
        this.projectViewer = {
            iframe,
            viewerTitle,
            viewerUrl,
            getCurrentUrl: () => currentUrl,
            setCurrentUrl: (url) => { currentUrl = url; }
        };
    }
    
    openProjectInViewer(url, name) {
        const viewerWindow = document.getElementById('project-viewer');
        const iframe = this.projectViewer.iframe;
        const viewerTitle = this.projectViewer.viewerTitle;
        const viewerUrl = this.projectViewer.viewerUrl;
        
        this.openWindow('viewer');
        
        iframe.src = url;
        viewerTitle.textContent = name;
        viewerUrl.value = url;
        this.projectViewer.setCurrentUrl(url);
        
        iframe.style.opacity = '0.5';
        iframe.addEventListener('load', () => {
            iframe.style.opacity = '1';
            this.showNotification('Проект загружен', `${name} открыт для просмотра`);
        }, { once: true });
        
        setTimeout(() => {
            viewerWindow.style.left = '50%';
            viewerWindow.style.top = '50%';
            viewerWindow.style.transform = 'translate(-50%, -50%)';
            viewerWindow.style.width = '90%';
            viewerWindow.style.height = '85%';
            viewerWindow.style.maxWidth = '1400px';
        }, 100);
    }

    // ========================================
    // Skills Tabs
    // ========================================
    
    initSkillsTabs() {
        const tabs = document.querySelectorAll('.skill-tab');
        const contents = document.querySelectorAll('.skill-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(`${target}-skills`).classList.add('active');
                
                if (target === 'frontend' || target === 'tools') {
                    setTimeout(() => this.animateSkills(), 100);
                }
            });
        });
    }

    animateSkills() {
        const progressBars = document.querySelectorAll('.skill-progress');
        progressBars.forEach((bar, index) => {
            const progress = bar.dataset.progress;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 50 + index * 100);
        });
    }

    // ========================================
    // Projects View Switcher
    // ========================================
    
    initProjectsView() {
        const viewBtns = document.querySelectorAll('.view-btn');
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const grid = document.querySelector('.projects-grid');
                const list = document.querySelector('.projects-list');
                
                if (view === 'grid') {
                    grid.classList.add('active');
                    list.classList.remove('active');
                } else {
                    grid.classList.remove('active');
                    list.classList.add('active');
                    this.generateProjectsList();
                }
            });
        });
    }

    generateProjectsList() {
        const list = document.querySelector('.projects-list');
        // Simple implementation - in production you'd reuse the same data
        list.innerHTML = '<div style="padding: 20px; color: var(--text-secondary);">List view - Coming soon...</div>';
    }

    // ========================================
    // Contact Form
    // ========================================
    
    initContactForm() {
        const form = document.getElementById('contact-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const message = form.querySelector('#message').value;
            
            // Simulate sending
            this.showNotification(
                'Сообщение отправлено! ✉️',
                `Спасибо, ${name}! Я свяжусь с вами в ближайшее время.`
            );
            
            form.reset();
        });

        // Download CV button
        const downloadBtn = document.getElementById('download-cv');
        downloadBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadResume();
        });
    }

    downloadResume() {
        this.showNotification('Скачивание', 'Резюме скачивается...');
        
        // In production, this would download actual PDF
        setTimeout(() => {
            this.showNotification('Успешно!', 'Резюме успешно скачано!');
        }, 1500);
    }

    // ========================================
    // Keyboard Shortcuts
    // ========================================
    
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Command/Ctrl + Space - Spotlight
            if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
                e.preventDefault();
                document.getElementById('search-icon').click();
            }
            
            // Escape - Close active window or spotlight
            if (e.key === 'Escape') {
                const spotlight = document.getElementById('spotlight');
                if (spotlight.classList.contains('active')) {
                    spotlight.classList.remove('active');
                } else {
                    const activeWindow = document.querySelector('.window.active:not(.minimized)');
                    if (activeWindow) {
                        this.closeWindow(activeWindow);
                    }
                }
            }
            
            // Command/Ctrl + W - Close active window
            if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
                e.preventDefault();
                const activeWindow = document.querySelector('.window.active:not(.minimized)');
                if (activeWindow) {
                    this.closeWindow(activeWindow);
                }
            }
            
            // Command/Ctrl + M - Minimize active window
            if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
                e.preventDefault();
                const activeWindow = document.querySelector('.window.active:not(.minimized)');
                if (activeWindow) {
                    this.minimizeWindow(activeWindow);
                }
            }
        });
    }

    // ========================================
    // Easter Eggs
    // ========================================
    
    initEasterEggs() {
        let konamiCode = [];
        const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.key);
            konamiCode = konamiCode.slice(-10);
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                this.activateEasterEgg();
                konamiCode = [];
            }
        });

        // Click logo 5 times
        const logo = document.querySelector('.apple-logo');
        let clickCount = 0;
        logo.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                this.showNotification('🎉 Easter Egg!', 'Вы нашли секрет! Вы потрясающий исследователь!');
                clickCount = 0;
            }
        });
    }

    activateEasterEgg() {
        this.showNotification('🎮 Konami Code!', 'Легендарный код активирован! +30 жизней!');
        
        // Fun animation
        document.body.style.animation = 'rainbow 2s linear';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
}

// ========================================
// Live Chat with Telegram Integration
// ========================================
// 
// 📱 НАСТРОЙКА TELEGRAM BOT:
// 1. Создайте бота через @BotFather в Telegram
// 2. Получите токен (формат: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz)
// 3. Получите ваш Chat ID через @userinfobot
// 4. Замените 'YOUR_BOT_TOKEN_HERE' и 'YOUR_CHAT_ID_HERE' ниже
// 5. Полная инструкция в файле TELEGRAM_SETUP.md
//

MacOSPortfolio.prototype.initChat = function() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const charCounter = document.getElementById('char-counter');
    const attachBtn = document.getElementById('attach-btn');
    
    // Telegram Bot Configuration
    // ✅ Настроено и готово к работе!
    const TELEGRAM_BOT_TOKEN = '8465705982:AAE1kox8TLjNqEDGzZnwIINXEEobtbFdBSM';
    const TELEGRAM_CHAT_ID = '2110512187'; // Fedorov Oleg (@web_marvel)
    
    // Character counter
    chatInput.addEventListener('input', () => {
        const length = chatInput.value.length;
        charCounter.textContent = `${length}/500`;
        sendBtn.disabled = length === 0;
        
        if (length > 450) {
            charCounter.style.color = '#FF3B30';
        } else {
            charCounter.style.color = 'var(--text-secondary)';
        }
    });
    
    // Send message
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add message to chat UI
        this.addChatMessage(message, 'sent');
        chatInput.value = '';
        charCounter.textContent = '0/500';
        sendBtn.disabled = true;
        
        // Show typing indicator
        document.getElementById('typing-indicator').style.display = 'flex';
        
        // Send to Telegram
        try {
            await this.sendToTelegram(message, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID);
            
            // Simulate response after delay
            setTimeout(() => {
                document.getElementById('typing-indicator').style.display = 'none';
                this.addChatMessage('Спасибо за сообщение! Я получил его в Telegram и отвечу в ближайшее время. 😊', 'received');
                
                // Show notification badge
                const badge = document.getElementById('chat-badge');
                if (!document.getElementById('chat-window').classList.contains('active')) {
                    badge.style.display = 'block';
                    badge.textContent = '1';
                }
            }, 2000);
            
        } catch (error) {
            document.getElementById('typing-indicator').style.display = 'none';
            this.addChatMessage('❌ Ошибка отправки. Проверьте настройки Telegram Bot.', 'received');
            console.error('Telegram error:', error);
        }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    attachBtn.addEventListener('click', () => {
        this.showNotification('Функция недоступна', 'Отправка файлов будет добавлена в следующем обновлении');
    });
    
    // Clear badge when window opens
    const chatWindow = document.getElementById('chat-window');
    const observer = new MutationObserver(() => {
        if (chatWindow.classList.contains('active')) {
            document.getElementById('chat-badge').style.display = 'none';
        }
    });
    observer.observe(chatWindow, { attributes: true, attributeFilter: ['class'] });
};

MacOSPortfolio.prototype.addChatMessage = function(text, type) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const now = new Date();
    const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    const avatarText = type === 'sent' ? '👤' : 'OF';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatarText}</div>
        <div class="message-content">
            <div class="message-bubble">${text}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    // Insert before typing indicator
    const typingIndicator = document.getElementById('typing-indicator');
    chatMessages.insertBefore(messageDiv, typingIndicator);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

MacOSPortfolio.prototype.sendToTelegram = async function(message, botToken, chatId) {
    // Проверка конфигурации
    if (botToken === 'YOUR_BOT_TOKEN_HERE' || chatId === 'YOUR_CHAT_ID_HERE') {
        console.warn('⚠️ Telegram Bot не настроен! Установите TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в script_new.js');
        // Симулируем успешную отправку для демонстрации
        return Promise.resolve();
    }
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const payload = {
        chat_id: chatId,
        text: `🔔 Новое сообщение с сайта-резюме:\n\n${message}`,
        parse_mode: 'HTML'
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error('Failed to send message to Telegram');
    }
    
    return response.json();
};

// ========================================
// Apple Menu & Settings
// ========================================

MacOSPortfolio.prototype.initAppleMenu = function() {
    const appleMenu = document.getElementById('apple-menu');
    const menuDropdown = document.getElementById('apple-menu-dropdown');
    
    appleMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuDropdown.contains(e.target) && e.target !== appleMenu) {
            menuDropdown.classList.remove('active');
        }
    });
    
    // Menu actions
    document.getElementById('menu-settings')?.addEventListener('click', () => {
        this.openWindow('settings');
        menuDropdown.classList.remove('active');
    });
    
    document.getElementById('menu-sleep')?.addEventListener('click', () => {
        this.sleepMode();
        menuDropdown.classList.remove('active');
    });
    
    document.getElementById('menu-restart')?.addEventListener('click', () => {
        this.restartSystem();
        menuDropdown.classList.remove('active');
    });
    
    document.getElementById('menu-shutdown')?.addEventListener('click', () => {
        this.shutdownSystem();
        menuDropdown.classList.remove('active');
    });
    
    document.getElementById('about-mac')?.addEventListener('click', () => {
        this.showAboutMac();
        menuDropdown.classList.remove('active');
    });
    
    // Settings window interactions
    this.initSettings();
};

MacOSPortfolio.prototype.initSettings = function() {
    const cursorSettings = document.getElementById('cursor-settings');
    const settingsGrid = document.querySelector('.settings-grid');
    const cursorPanel = document.getElementById('cursor-panel');
    const backBtn = document.getElementById('settings-back');
    
    cursorSettings?.addEventListener('click', () => {
        settingsGrid.style.display = 'none';
        cursorPanel.style.display = 'block';
    });
    
    backBtn?.addEventListener('click', () => {
        settingsGrid.style.display = 'grid';
        cursorPanel.style.display = 'none';
    });
    
    // Particle toggle
    const particlesToggle = document.getElementById('particles-toggle');
    particlesToggle?.addEventListener('change', (e) => {
        if (this.cursorEffects) {
            this.cursorEffects.enabled = e.target.checked;
        }
        this.showNotification('Настройки', 
            e.target.checked ? 'Эффект частиц включен' : 'Эффект частиц выключен');
    });
    
    // Particle amount slider
    const particleAmount = document.getElementById('particle-amount');
    const particleValue = document.getElementById('particle-value');
    particleAmount?.addEventListener('input', (e) => {
        particleValue.textContent = e.target.value;
        if (this.cursorEffects) {
            this.cursorEffects.maxParticles = parseInt(e.target.value);
        }
    });
};

MacOSPortfolio.prototype.sleepMode = function() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        z-index: 999999;
        opacity: 0;
        transition: opacity 1s ease;
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000);
        this.showNotification('Система', 'Выход из режима сна');
    }, 3000);
};

MacOSPortfolio.prototype.restartSystem = function() {
    const confirmed = confirm('Вы уверены, что хотите перезагрузить систему?');
    if (confirmed) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            location.reload();
        }, 500);
    }
};

MacOSPortfolio.prototype.shutdownSystem = function() {
    const confirmed = confirm('Вы уверены, что хотите выключить систему?');
    if (confirmed) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1s ease';
        setTimeout(() => {
            document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: black; color: white; font-family: Inter, sans-serif;">Система выключена. Обновите страницу для перезапуска.</div>';
        }, 1000);
    }
};

MacOSPortfolio.prototype.showAboutMac = function() {
    this.showNotification('Об этом Mac', 'macOS Portfolio v1.0\nОдин из лучших проектов Oleg Fedorov\n\n🚀 Разработано с любовью');
};

MacOSPortfolio.prototype.initDraggableWindows = function() {
    // Window dragging is already implemented in initWindowDragging
    console.log('✅ Window dragging enabled');
};

// ========================================
// Cursor Effects & Particles
// ========================================

class CursorEffects {
    constructor() {
        this.particles = [];
        this.maxParticles = 50;
        this.enabled = true;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }

    init() {
        this.canvas.id = 'cursor-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            if (this.enabled) {
                this.addParticle(e.clientX, e.clientY);
            }
        });
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addParticle(x, y) {
        if (this.particles.length < this.maxParticles) {
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                life: 1,
                color: `hsla(${Math.random() * 60 + 200}, 100%, 60%, ${Math.random() * 0.5 + 0.3})`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 0.02;
            particle.size *= 0.96;

            if (particle.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                return true;
            }
            return false;
        });

        requestAnimationFrame(() => this.animate());
    }
}

MacOSPortfolio.prototype.initCursorEffects = function() {
    this.cursorEffects = new CursorEffects();
    
    // Add click ripple effect
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 122, 255, 0.4) 0%, transparent 70%);
            pointer-events: none;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            z-index: 99999;
        `;
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
};

document.addEventListener('DOMContentLoaded', () => {
    window.macOS = new MacOSPortfolio();
    console.log('%c🍎 macOS Portfolio Loaded!', 'color: #007AFF; font-size: 20px; font-weight: bold;');
    console.log('%cTip: Try Command+Space for Spotlight search!', 'color: #34C759; font-size: 14px;');
    console.log('%cType "help" in Terminal for available commands', 'color: #FF9500; font-size: 14px;');
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
