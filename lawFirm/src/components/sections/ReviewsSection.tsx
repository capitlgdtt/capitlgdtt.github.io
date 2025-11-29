import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import DecorativeLine from "../common/DecorativeLine.tsx";

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
    const { t, currentLanguage } = useI18n();

    // Константные данные на двух языках
    const reviewsData: Record<string, Review[]> = {
        en: [
            {
                id: 1,
                author: "Ivan Sidorov",
                position: 'Director of "TechnoProfi" LLC',
                text: "Thank you to the CompanyName team for professional support of our company. They resolved a complex corporate dispute in our favor.",
                rating: 5,
            },
            {
                id: 2,
                author: "Maria Kovaleva",
                position: "Private Entrepreneur",
                text: "Helped with business registration and tax optimization. Everything was done quickly and efficiently. I recommend!",
                rating: 5,
            },
            {
                id: 3,
                author: "Alexey Volkov",
                position: 'IT company "Develop"',
                text: "CompanyName lawyers handle our international contracts. Always at the highest level - prompt and professional.",
                rating: 5,
            },
            {
                id: 4,
                author: "Sergey Petrov",
                position: 'General Director of "StroyGarant"',
                text: "Quality legal support for construction business. Helped with permitting documentation.",
                rating: 4,
            },
            {
                id: 5,
                author: "Olga Smirnova",
                position: 'Financial Director of "BusinessConsult"',
                text: "Professional tax consulting and optimization of company financial flows.",
                rating: 5,
            },
            {
                id: 6,
                author: "Dmitry Orlov",
                position: 'Restaurant business owner',
                text: "Helped with licensing of alcoholic products and contractual relations with suppliers.",
                rating: 4,
            },
            {
                id: 7,
                author: "Ekaterina Novikova",
                position: 'HR Director of "PersonnelGroup"',
                text: "Legal support of labor relations and personnel document flow at the highest level.",
                rating: 5,
            },
            {
                id: 8,
                author: "Pavel Kozlov",
                position: 'Startup "TechnoInnovations"',
                text: "Helped with patent registration and intellectual property registration. Thank you!",
                rating: 5,
            },
        ],
        ru: [
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
        ]
    };

    // Получаем отзывы на текущем языке
    const reviews = reviewsData[currentLanguage] || reviewsData.en;

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
        const isMobile = window.innerWidth < 768;
        const maxOffset = isMobile ? 35 : 15;
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
                    <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold leading-tight break-words">
                        {t('reviews.title.part1')} <span className="text-[var(--accent)]">{t('reviews.title.part2')}</span>
                    </h2>
                </div>

                {/* Прокрутка отзывов */}
                <div className="relative overflow-hidden">

                    {/* Первый ряд (движется вправо) */}
                    <div className="flex gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
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
                                    className="w-64 sm:w-72 md:w-80 p-4 sm:p-6 bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all duration-400 ease-out
                                               flex flex-col justify-between h-56 sm:h-60 md:h-64 shadow-lg hover:scale-105 hover:shadow-xl cursor-pointer flex-shrink-0"
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
                    <div className="flex gap-4 sm:gap-6 md:gap-8 justify-end">
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
                                    className="w-64 sm:w-72 md:w-80 p-4 sm:p-6 bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all duration-400 ease-out
                                               flex flex-col justify-between h-56 sm:h-60 md:h-64 shadow-lg hover:scale-105 hover:shadow-xl cursor-pointer flex-shrink-0"
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
            <DecorativeLine visible={visible} />
        </section>
    );
};

export default ReviewsSection;