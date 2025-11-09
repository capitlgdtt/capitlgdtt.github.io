import React, { useEffect, useRef, useState } from "react";

interface Review {
    id: number;
    author: string;
    position: string;
    text: string;
    rating: number;
}

const ReviewsSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const reviews: Review[] = [
        {
            id: 1,
            author: "Иван Сидоров",
            position: 'Директор ООО "ТехноПрофи"',
            text: "Благодарю команду CompanyName за профессиональное сопровождение нашей компании. Решили сложный корпоративный спор в нашу пользу.",
            rating: 5,
        },
        {
            id: 2,
            author: "Мария Ковалева",
            position: "Частный предприниматель",
            text: "Помогли с регистрацией бизнеса и налоговой оптимизацией. Все сделали быстро и качественно. Рекомендую!",
            rating: 5,
        },
        {
            id: 3,
            author: "Алексей Волков",
            position: 'IT-компания "Девелоп"',
            text: "Юристы CompanyName сопровождают наши международные контракты. Всегда на высоте — оперативно и профессионально.",
            rating: 5,
        },
        {
            id: 4,
            author: "Сергей Петров",
            position: 'Генеральный директор "СтройГарант"',
            text: "Качественная юридическая поддержка строительного бизнеса. Помогли с разрешительной документацией.",
            rating: 4,
        },
        {
            id: 5,
            author: "Ольга Смирнова",
            position: 'Финансовый директор "БизнесКонсалт"',
            text: "Профессиональное налоговое консультирование и оптимизация финансовых потоков компании.",
            rating: 5,
        },
        {
            id: 6,
            author: "Дмитрий Орлов",
            position: 'Владелец ресторанного бизнеса',
            text: "Помогли с лицензированием алкогольной продукции и договорными отношениями с поставщиками.",
            rating: 4,
        },
        {
            id: 7,
            author: "Екатерина Новикова",
            position: 'HR-директор "ПерсоналГрупп"',
            text: "Юридическое сопровождение трудовых отношений и кадрового документооборота на высшем уровне.",
            rating: 5,
        },
        {
            id: 8,
            author: "Павел Козлов",
            position: 'Стартап "ТехноИнновации"',
            text: "Помогли с регистрацией патентов и оформлением интеллектуальной собственности. Спасибо!",
            rating: 5,
        },
    ];

    // появление секции
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // танцы с бубном
    useEffect(() => {
        const handleScroll = () => {
            const section = ref.current;
            if (!section) return;

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;
            const currentScrollY = window.scrollY;

            // Когда секция появляется в viewport (20% сверху) до когда она исчезает (20% снизу)
            const startTrigger = sectionTop - windowHeight * 0.8;
            const endTrigger = sectionTop + sectionHeight - windowHeight * 0.2;

            // Если мы выше начала триггера или ниже конца - выходим
            if (currentScrollY < startTrigger || currentScrollY > endTrigger) {
                setScrollProgress(currentScrollY < startTrigger ? 0 : 1);
                return;
            }

            // Плавный прогресс от 0 до 1 в пределах видимой области секции
            const progress = (currentScrollY - startTrigger) / (endTrigger - startTrigger);

            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Рассчитываем смещение для анимации
    const getScrollOffset = () => {
        const maxOffset = 15;
        return scrollProgress * maxOffset;
    };

    const renderStars = (rating: number) => (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <img
                    key={i}
                    src="/star.svg"
                    alt="star"
                    className="w-5 h-5"
                    style={{
                        opacity: i < rating ? 1 : 0.2,
                    }}
                />
            ))}
        </div>
    );

    return (
        <section
            id="reviews"
            ref={ref}
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{ padding: "var(--container-padding)" }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок секции */}
                <div
                    className={`overflow-hidden mb-8 transition-transform duration-1000 ${
                        visible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                    }`}
                >
                    <h2 className="text-[5rem] md:text-[7rem] font-syne uppercase font-semibold leading-tight">
                        our <span className="text-[var(--accent)]">clients</span>
                    </h2>
                </div>

                {/* Бесконечная прокрутка отзывов */}
                <div className="relative overflow-hidden">

                    {/* Первый ряд (движется вправо) */}
                    <div className="flex gap-8 mb-8">
                        <div
                            className="flex gap-8"
                            style={{
                                transform: `translateX(-${getScrollOffset()}%)`,
                                transition: 'transform 0.3s ease-out' // Более плавный переход
                            }}
                        >
                            {[...reviews, ...reviews].map((review, index) => (
                                <div
                                    key={`right-${review.id}-${index}`}
                                    className="w-80 p-6 bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all duration-400 ease-out
                                             flex flex-col justify-between h-64 shadow-lg hover:scale-105 hover:shadow-xl cursor-pointer flex-shrink-0"
                                >
                                    <div className="wrapper-icons-testimonial mb-4">
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="text-[var(--text-primary)] mb-4 leading-relaxed text-sm line-clamp-4 overflow-hidden">
                                        “{review.text}”
                                    </p>
                                    <div className="wrapper-infos-testimonial flex flex-col gap-2 mt-auto pt-4">
                                        <div className="sub-heading font-syne font-semibold text-lg text-[var(--text-secondary)]">
                                            {review.author}
                                        </div>
                                        <div className="chip bg-[var(--text-secondary)] h-[1px] w-full my-1" />
                                        <div className="testimonial-job-title text-[var(--text-secondary)] text-xs">
                                            {review.position}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Второй ряд (движется влево) */}
                    <div className="flex gap-8 justify-end">
                        <div
                            className="flex gap-8"
                            style={{
                                transform: `translateX(${getScrollOffset()}%)`,
                                transition: 'transform 0.3s ease-out'
                            }}
                        >
                            {[...reviews, ...reviews].map((review, index) => (
                                <div
                                    key={`left-${review.id}-${index}`}
                                    className="w-80 p-6 bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all duration-400 ease-out
                         flex flex-col justify-between h-64 shadow-lg hover:scale-105 hover:shadow-xl cursor-pointer flex-shrink-0"
                                >
                                    <div className="wrapper-icons-testimonial mb-4">
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="text-[var(--text-primary)] mb-4 leading-relaxed text-sm line-clamp-4 overflow-hidden">
                                        “{review.text}”
                                    </p>
                                    <div className="wrapper-infos-testimonial flex flex-col gap-2 mt-auto pt-4">
                                        <div className="sub-heading font-syne font-semibold text-lg text-[var(--text-secondary)]">
                                            {review.author}
                                        </div>
                                        <div className="chip bg-[var(--text-secondary)] h-[1px] w-full my-1" />
                                        <div className="testimonial-job-title text-[var(--text-secondary)] text-xs">
                                            {review.position}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Нижняя линия */}
            <div
                className={`absolute bottom-0 h-[2px] bg-[var(--text-secondary)] transition-all duration-1000 delay-1000 ${
                    visible ? "w-full scale-x-100" : "w-0 scale-x-0"
                }`}
                style={{
                    left: "var(--container-padding)",
                    width: "calc(100% - 2 * var(--container-padding))",
                    transformOrigin: "left center",
                    transitionTimingFunction: "ease-out",
                }}
            />
        </section>
    );
};

export default ReviewsSection;