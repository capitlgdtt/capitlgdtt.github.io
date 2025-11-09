import React, { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsHidden(true);
            } else {
                setIsHidden(false);
            }

            setIsScrolled(currentScrollY > 50);
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const mobileMenu = document.querySelector('.mobile-nav-items-container');
            const burgerButton = document.querySelector('.burger-menu');

            if (isMobileMenuOpen &&
                mobileMenu &&
                !mobileMenu.contains(event.target as Node) &&
                !burgerButton?.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        const handleScrollClose = () => {
            if (isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScrollClose);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScrollClose);
        };
    }, [isMobileMenuOpen]);

    const navItems = [
        { href: '#home', label: 'Home' },
        { href: '#services', label: 'Expertises' },
        { href: '#team', label: 'Team' },
        { href: '#blog', label: 'Blog' },
        { href: '#contact', label: 'Contact' },
    ];

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleNavClick = (href: string) => {
        if (href === '#home') {
            navigate('/');
        } else {
            if (window.location.pathname === '/') {
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                navigate('/');
                setTimeout(() => {
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={`nav fixed top-0 left-0 right-0 z-50 border-b border-[var(--bg-secondary)] ${
                isScrolled
                    ? 'bg-[var(--bg-primary)] bg-opacity-95 backdrop-blur-lg shadow-lg'
                    : 'bg-transparent'
            }`}
            style={{
                transform: isHidden ? 'translateY(-100%)' : 'translateY(0)'
            }}
        >
            <div className="container flex justify-between items-center h-20">
                {/* Логотип */}
                <button
                    onClick={scrollToTop}
                    className="nav-logo-container text-[var(--text-primary)] font-syne font-bold text-3xl tracking-tight cursor-pointer"
                    style={{ fontFamily: "'Syne', sans-serif !important" }}
                >
                    CompanyName
                </button>

                {/* Бургер */}
                <div
                    className={`burger-menu lg:hidden ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <div className="burger-menu-line-1"></div>
                    <div className="burger-menu-line-2"></div>
                    <div className="burger-menu-line-3"></div>
                </div>

                {/* Десктоп меню */}
                <nav className="hidden lg:flex gap-12 items-center">
                    {navItems.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className="nav-item text-[var(--text-primary)] sans-serif hover:text-[var(--accent)] transition-all duration-300 cursor-pointer"
                        >
                            {item.label}
                        </button>
                    ))}
                    <ThemeToggle />
                </nav>

                {/* Мобильное меню */}
                <div
                    className={`mobile-nav-items-container lg:hidden ${
                        isMobileMenuOpen ? 'open' : ''
                    } bg-[var(--bg-primary)] border-t border-[var(--bg-secondary)]`}
                >
                    <div className="mobile-nav-items-wrapper">
                        {navItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => handleNavClick(item.href)}
                                className="mobile-nav-item text-[var(--text-primary)] sans-serif hover:text-[var(--accent)] transition-all duration-300"
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className="mobile-nav-item flex justify-center">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
