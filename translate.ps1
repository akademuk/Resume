# PowerShell script for translating Russian to English in HTML file

$file = "index_new.html"
$content = Get-Content $file -Raw -Encoding UTF8

# Translations map
$translations = @{
    # Stats
    "Завершенных проектов" = "Completed Projects"
    "Технологий" = "Technologies"
    "Качество" = "Quality"
    
    # Quick Links
    "Быстрые ссылки" = "Quick Links"
    "Мое портфолио" = "My Portfolio"
    "GitHub профиль" = "GitHub Profile"
    "LinkedIn" = "LinkedIn"
    "Скачать резюме" = "Download Resume"
    
    # Menu Bar
    "Finder" = "Finder"
    "Файл" = "File"
    "Правка" = "Edit"
    "Вид" = "View"
    "Переход" = "Go"
    "Переключить тему" = "Toggle Theme"
    
    # Dock labels
    "Обо мне" = "About"
    "Навыки" = "Skills"
    "Опыт" = "Experience"
    "Проекты" = "Projects"
    "Контакты" = "Contacts"
    "Настройки" = "Settings"
    "Чат с рекрутером" = "Chat with Recruiter"
    "Чат" = "Chat"
    
    # Windows
    "Навыки и технологии" = "Skills & Technologies"
    "Опыт работы" = "Work Experience"
    "Мои проекты" = "My Projects"
    "Контактная информация" = "Contact Information"
    "Настройки системы" = "System Preferences"
    "Чат с рекрутером" = "Recruiter Chat"
    
    # Skills section
    "Frontend Разработка" = "Frontend Development"
    "Backend Технологии" = "Backend Technologies"
    "Инструменты и прочее" = "Tools & Other"
    
    # Experience
    "настоящее время" = "Present"
    
    # Projects
    "Посмотреть" = "View Project"
    "Просмотр проекта" = "Project Viewer"
    "Назад" = "Back"
    "Вперед" = "Forward"
    "Обновить" = "Reload"
    "Открыть в новой вкладке" = "Open in New Tab"
    
    # Chat
    "Сообщения отправляются в Telegram" = "Messages are sent to Telegram"
    "Только что" = "Just now"
    "Напишите сообщение..." = "Type a message..."
    "Отправить" = "Send"
    "Прикрепить файл" = "Attach file"
    "Все сообщения зашифрованы и отправляются через Telegram Bot API" = "All messages are encrypted and sent via Telegram Bot API"
    
    # Settings
    "Внешний вид" = "Appearance"
    "Тема, обои, цвета" = "Theme, wallpapers, colors"
    "Курсор" = "Cursor"
    "Эффекты частиц" = "Particle effects"
    "Уведомления" = "Notifications"
    "Оповещения" = "Alerts"
    "Клавиатура" = "Keyboard"
    "Горячие клавиши" = "Shortcuts"
    "Звук" = "Sound"
    "Громкость, эффекты" = "Volume, effects"
    "Об этой системе" = "About This System"
    "Версия, характеристики" = "Version, specs"
    "Настройки курсора" = "Cursor Settings"
    "Эффект частиц" = "Particle Effect"
    "Цветные частицы следуют за курсором" = "Colored particles follow cursor"
    "Эффект при клике" = "Click Effect"
    "Волны при нажатии мыши" = "Ripple on mouse click"
    "Количество частиц" = "Particle Amount"
    "Больше частиц = красивее, но медленнее" = "More particles = prettier, but slower"
    
    # Contacts
    "Email" = "Email"
    "Telegram" = "Telegram"
    "Телефон" = "Phone"
    "Или напишите мне" = "Or Write to Me"
    "Ваше имя" = "Your Name"
    "Иван Иванов" = "John Doe"
    "Расскажите о вашем проекте..." = "Tell about your project..."
    "Отправить сообщение" = "Send Message"
    
    # Notifications & Apple Menu
    "Об этом Mac" = "About This Mac"
    "Настройки системы..." = "System Preferences..."
    "App Store..." = "App Store..."
    "Недавние объекты" = "Recent Items"
    "Режим сна" = "Sleep"
    "Перезагрузить..." = "Restart..."
    "Выключить..." = "Shut Down..."
    "Заблокировать экран" = "Lock Screen"
    "Выйти из Oleg Fedorov..." = "Log Out Oleg Fedorov..."
    
    # Terminal
    "Добро пожаловать в терминал портфолио Олега!" = "Welcome to Oleg's Portfolio Terminal!"
    "Введите 'help' для просмотра доступных команд." = "Type 'help' to see available commands."
    
    # Location
    "Москва, Россия" = "Kyiv, Ukraine"
}

foreach ($key in $translations.Keys) {
    $content = $content -replace [regex]::Escape($key), $translations[$key]
}

$content | Set-Content $file -Encoding UTF8 -NoNewline

Write-Host "Translation completed!" -ForegroundColor Green
