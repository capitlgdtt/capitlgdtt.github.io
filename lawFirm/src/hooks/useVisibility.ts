import {useState, useEffect, useRef, type RefObject} from 'react';

export const useVisibility = (threshold = 0.2): [RefObject<HTMLDivElement | null>, boolean] => {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Проверяем, что мы в браузере
        if (typeof window === 'undefined') return;

        // Проверяем, что IntersectionObserver поддерживается
        if (!('IntersectionObserver' in window)) {
            // Фолбэк для браузеров без поддержки
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    // Отключаем observer после первого срабатывания для оптимизации
                    observer.disconnect();
                }
            },
            { threshold }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold]);

    return [ref, visible];
};