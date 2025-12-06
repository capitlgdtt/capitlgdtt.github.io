import { useState, useEffect, useRef, type RefObject } from 'react';

export const useVisibilitySafe = (threshold = 0.1): [RefObject<HTMLElement | null>, boolean] => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    // Для дебаггинга - убираем после фикса
    console.log('useVisibilitySafe called', { threshold, isVisible });

    useEffect(() => {
        console.log('useVisibilitySafe effect running');

        // Проверка на SSR
        if (typeof window === 'undefined') {
            console.log('SSR detected, skipping');
            return;
        }

        // Проверка поддержки IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            console.log('IntersectionObserver not supported, defaulting to visible');
            setIsVisible(true);
            return;
        }

        let observer: IntersectionObserver | null = null;
        const currentRef = ref.current;

        try {
            const options = {
                threshold: threshold,
                rootMargin: '0px'
            };

            observer = new IntersectionObserver((entries) => {
                console.log('IntersectionObserver callback', entries);
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('Element became visible');
                        setIsVisible(true);
                        if (observer && currentRef) {
                            observer.unobserve(currentRef);
                        }
                    }
                });
            }, options);

            if (currentRef) {
                console.log('Observing element');
                observer.observe(currentRef);
            } else {
                console.log('No element to observe');
            }
        } catch (error) {
            console.error('IntersectionObserver error:', error);
            setIsVisible(true); // Fallback
        }

        return () => {
            console.log('Cleaning up observer');
            if (observer && currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold]);

    // Убедимся, что возвращаем именно массив из двух элементов
    const result: [RefObject<HTMLElement | null>, boolean] = [ref, isVisible];

    // Дополнительная валидация
    if (!Array.isArray(result) || result.length !== 2) {
        console.error('Invalid return from useVisibilitySafe:', result);
        return [useRef(null), true]; // Фолбэк
    }

    return result;
};