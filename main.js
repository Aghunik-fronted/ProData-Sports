document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ЛОГИКА МЕНЮ И ПРОФИЛЯ ---
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const profileInfo = document.querySelector('.user-profile__info');
    const profileDropdown = document.querySelector('.user-profile__dropdown');

    if (burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('header__burger--active');
            nav.classList.toggle('header__nav--active');
            document.body.classList.toggle('no-scroll');
        });
    }

    if (profileInfo) {
        profileInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('user-profile__dropdown--active');
        });
    }

    document.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.classList.remove('user-profile__dropdown--active');
    });

    // --- 2. ОБЩИЕ ФУНКЦИИ (ОБНОВЛЕНИЕ UI) ---

    // Обновление счетчика корзины
    const updateBadge = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const badge = document.querySelector('.cart-link__badge');
        if (badge) {
            badge.innerText = cart.length;
            badge.style.display = cart.length > 0 ? 'flex' : 'none';
        }
    };

    // Обновление баланса пользователя
    const updateBalanceUI = () => {
        const balance = localStorage.getItem('userBalance') || '0';
        const balanceElements = document.querySelectorAll('.user-profile__balance, .stat-card__value--balance');
        
        balanceElements.forEach(el => {
            el.innerText = parseInt(balance).toLocaleString() + ' ₽';
        });
    };

    // --- 3. ЛОГИКА КОРЗИНЫ (LOCAL STORAGE) ---

    const buyButtons = document.querySelectorAll('.btn--buy');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productName = btn.getAttribute('data-name');
            const productPrice = parseInt(btn.getAttribute('data-price'));
            const productIcon = btn.getAttribute('data-icon') || '💎';

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            cart.push({ 
                name: productName, 
                price: productPrice, 
                icon: productIcon,
                id: Date.now() + Math.random() // Уникальный ID
            });
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateBadge();
            window.location.href = 'cart.html';
        });
    });

    // Логика страницы cart.html
    const cartContainer = document.querySelector('.cart__main');
    if (cartContainer) {
        const renderCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartGrid = document.querySelector('.cart'); 
            const totalValue = document.querySelector('.summary__total span:last-child');
            const countValue = document.querySelector('.summary__row span:first-child');
            const emptyBlock = document.querySelector('.cart-empty');
            
            if (cart.length === 0) {
                if (emptyBlock) emptyBlock.style.display = 'block';
                if (cartGrid) cartGrid.style.display = 'none';
                return;
            } else {
                if (emptyBlock) emptyBlock.style.display = 'none';
                if (cartGrid) cartGrid.style.display = 'grid';
            }

            cartContainer.innerHTML = cart.map(item => `
                <div class="cart-card" data-id="${item.id}">
                    <div class="cart-card__info">
                        <div class="cart-card__image"><span class="icon">${item.icon}</span></div>
                        <div class="cart-card__text">
                            <h3 class="cart-card__name">${item.name}</h3>
                            <p class="cart-card__descr">Доступ к аналитике</p>
                        </div>
                    </div>
                    <div class="cart-card__price">${item.price.toLocaleString()} ₽</div>
                    <button class="cart-card__remove" type="button">✕</button>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + item.price, 0);
            if (totalValue) totalValue.innerText = total.toLocaleString() + ' ₽';
            if (countValue) countValue.innerText = `Товары (${cart.length})`;
        };

        renderCart();

        cartContainer.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.cart-card__remove');
            if (removeBtn) {
                const card = removeBtn.closest('.cart-card');
                const id = card.getAttribute('data-id');
                
                card.style.opacity = '0';
                card.style.transform = 'translateX(20px)';

                setTimeout(() => {
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart = cart.filter(item => item.id.toString() !== id.toString());
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    renderCart();
                    updateBadge();
                }, 200);
            }
        });
    }

    // --- 4. АККАУНТ И НАВИГАЦИЯ ---

    // Выход из системы
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userBalance'); 
            localStorage.removeItem('cart');        
            window.location.href = 'index.html'; 
        });
    }

    // Подсветка активных ссылок в сайдбаре
    const sideLinks = document.querySelectorAll('.side-nav__link');
    const currentPath = window.location.pathname.split('/').pop();
    sideLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('side-nav__link--active');
        }
    });

    // Имитация пополнения баланса
    const depositBtn = document.querySelector('.stat-card .btn--primary');
    if (depositBtn) {
        depositBtn.addEventListener('click', () => {
            const amount = prompt('Введите сумму пополнения (₽):', '1000');
            if (amount && !isNaN(amount)) {
                let currentBalance = parseInt(localStorage.getItem('userBalance')) || 0;
                localStorage.setItem('userBalance', currentBalance + parseInt(amount));
                updateBalanceUI();
                alert('Баланс успешно пополнен!');
            }
        });
    }

    // Сохранение настроек
    const settingsForm = document.querySelector('.settings-grid form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const saveBtn = settingsForm.querySelector('.btn--primary');
            saveBtn.innerText = 'Сохранено...';
            saveBtn.disabled = true;
            
            setTimeout(() => {
                saveBtn.innerText = 'Сохранить изменения';
                saveBtn.disabled = false;
                alert('Данные профиля успешно обновлены!');
            }, 1000);
        });
    }

    // --- ЛОГИКА ФИЛЬТРАЦИИ ТАБЛИЦЫ ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tableRows = document.querySelectorAll('#stats-body tr');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
        // 1. Меняем активную кнопку
            filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
            btn.classList.add('filter-btn--active');

        // 2. Фильтруем строки
            const filterValue = btn.getAttribute('data-filter');

            tableRows.forEach(row => {
                const category = row.getAttribute('data-category');
            
                if (filterValue === 'all' || category === filterValue) {
                    row.style.display = ''; // Показываем
                } else {
                    row.style.display = 'none'; // Скрываем
                }
            });
        });
    });

    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
    // Если адрес страницы содержит href ссылки (и href не пустой)
        if (link.href !== "" && currentUrl.includes(link.href)) {
        link.classList.add('nav__link--active');
        } else {
        link.classList.remove('nav__link--active');
     }
    });

    // Запуск инициализации при загрузке любой страницы
    updateBadge();
    updateBalanceUI();
});