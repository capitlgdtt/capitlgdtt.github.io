import "/src/sass/style.scss";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';


const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const closeBtn = document.querySelector('.menu__close');
const backdrop = document.querySelector('.menu__backdrop');

function openMenu() {
    menu.classList.add('active');
    burger.classList.add('active');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menu.classList.remove('active');
    burger.classList.remove('active');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
    if (menu.classList.contains('active')) closeMenu();
    else openMenu();
})
closeBtn.addEventListener('click', closeMenu);
backdrop.addEventListener('click', closeMenu);

function resetMenu() {
    if (window.innerWidth >= 768) {
        menu.classList.remove('active');
        menu.setAttribute('aria-hidden', 'false');
    }
}
window.addEventListener('resize', resetMenu);
document.addEventListener('DOMContentLoaded', resetMenu);

document.querySelector('.header__logo').addEventListener('click', () => {
    window.location.href = 'index.html';
});

const swiper = new Swiper('.mySwiper', {
    loop: true,
    slidesPerView: 1,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        1200: {
            slidesPerView: 3,
            spaceBetween: 30,
        }
    }
})