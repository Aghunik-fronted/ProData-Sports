const burger = document.querySelector('.header__burger');
const nav = document.querySelector('.header__nav');
const body = document.body;
const profileInfo = document.querySelector('.user-profile__info');
const profileDropdown = document.querySelector('.user-profile__dropdown');

if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('header__burger--active');
        nav.classList.toggle('header__nav--active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden'; // Блокируем скролл фона
    });
}

const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('header__burger--active');
        nav.classList.remove('header__nav--active');
        body.style.overflow = '';
    });
});

if (profileInfo) {
    profileInfo.addEventListener('click', (e) => {
        e.stopPropagation(); 
        profileDropdown.classList.toggle('user-profile__dropdown--active');
    });
}

document.addEventListener('click', () => {
    if (profileDropdown) {
        profileDropdown.classList.remove('user-profile__dropdown--active');
    }
});

const removeBtns = document.querySelectorAll('.cart-card__remove');

removeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const item = e.target.closest('.cart-card');
        if (item) {
            if (confirm('Удалить этот тариф из корзины?')) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';

                setTimeout(() => {
                    item.remove();
                    updateCartTotal();
                    checkEmptyCart();
                }, 300);
            }
        }
    });
});

function updateCartTotal() {
    const prices = document.querySelector('.cart-card__price');
    const totalElement = document.querySelector('.summary__total span:last-child');
    let total = 0;

    prices.forEach(price => {
        const value = parseInt(price.innerText.replace(/\s/g, ''));
        total += value;
    });

    if (totalElement) {
        totalElement.innerText = total.toLocaleString() + ' ₽';
    }
}

function checkEmptyCart() {
    const cartMain = document.querySelector('.cart__main');
    const cartItems = document.querySelectorAll('.cart-card');
    const emptyBlock = document.querySelector('.cart-empty');

    if (cartItems === 0 && emptyBlock) {
        emptyBlock.style.display = 'block';
        if (cartMain) cartMain.style.display = 'none';
    }
}