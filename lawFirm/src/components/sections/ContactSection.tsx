import React, { useState, useEffect, useRef } from "react";

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    service?: string;
    message?: string;
}

interface ValidationRules {
    required?: boolean;
    minLength?: number;
    email?: boolean;
    phone?: boolean;
}

const ContactSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const ref = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const services = [
        "Корпоративное право",
        "Налоговое право",
        "Недвижимость",
        "Семейное право",
        "Наследственное право",
        "Защита прав потребителей",
        "Другое",
    ];

    // Автоматическое заполнение услуги
    useEffect(() => {
        const handleServiceSelection = (event: CustomEvent) => {
            setFormData(prev => ({
                ...prev,
                service: event.detail.service
            }));
        };

        // Проверяем есть ли сохраненная услуга при монтировании
        const savedService = sessionStorage.getItem('selectedService');
        if (savedService) {
            setFormData(prev => ({
                ...prev,
                service: savedService
            }));
            sessionStorage.removeItem('selectedService');
        }

        // Слушаем кастомные события
        window.addEventListener('serviceSelected', handleServiceSelection as EventListener);

        return () => {
            window.removeEventListener('serviceSelected', handleServiceSelection as EventListener);
        };
    }, []);

    // Функции валидации
    const validateField = (name: string, value: string): string => {
        const rules: Record<string, ValidationRules> = {
            name: { required: true, minLength: 2 },
            phone: { required: true, phone: true },
            email: { email: true },
            service: { required: true },
            message: { },
        };

        const fieldRules = rules[name];
        if (!fieldRules) return "";

        if (fieldRules.required && !value.trim()) {
            return "Это поле обязательно для заполнения";
        }

        if (fieldRules.minLength && value.trim().length < fieldRules.minLength) {
            return `Минимальная длина: ${fieldRules.minLength} символов`;
        }

        if (fieldRules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return "Введите корректный email";
        }

        if (fieldRules.phone && value) {
            const phoneDigits = value.replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                return "Введите корректный номер телефона";
            }
        }

        return "";
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key as keyof typeof formData]);
            if (error) {
                newErrors[key as keyof FormErrors] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Валидация при изменении, если поле уже было тронуто
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleBlur = (
        e: React.FocusEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Помечаем все поля как тронутые при отправке
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);

        setTouched(allTouched);

        if (validateForm()) {
            console.log("Форма отправлена:", formData);
            // Здесь можно добавить отправку на сервер
            alert("Форма успешно отправлена!");

            // Сброс формы
            setFormData({
                name: "",
                email: "",
                phone: "",
                service: "",
                message: "",
            });
            setErrors({});
            setTouched({});
        } else {
            console.log("Ошибки валидации:", errors);
        }
    };

    // Анимация появления секции
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Отслеживание темы
    useEffect(() => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "dark";
        setTheme(currentTheme as "dark" | "light");

        const observer = new MutationObserver(() => {
            const t =
                document.documentElement.getAttribute("data-theme") || "dark";
            setTheme(t as "dark" | "light");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="contact"
            ref={ref}
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{ padding: "var(--container-padding)" }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок */}
                <div
                    className={`overflow-hidden mb-8 transition-transform duration-1000 ${
                        visible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                    }`}
                >
                    <h2 className="text-[5rem] md:text-[7rem] font-syne uppercase font-semibold leading-tight break-words">
                        get a <span className="text-[var(--accent)]">consultation</span>
                    </h2>
                </div>

                <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-16 transition-opacity duration-1000 ${
                        visible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {/* Левая колонка — контакты */}
                    <div className="space-y-10">
                        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-[80%] leading-relaxed mb-12!">
                            Оставьте заявку, и наш юрист свяжется с вами в течение{" "}
                            <span className="text-[var(--accent)] font-semibold whitespace-nowrap">
                                30 минут
                            </span>{" "}
                            для бесплатной консультации.
                        </p>

                        <div className="flex items-start">
                            <div className="p-3 mr-5 bg-[var(--accent)] rounded-2xl text-[var(--bg-primary)] text-2xl">
                                <img
                                    src="/icons/phone.png"
                                    alt="Phone"
                                    className="w-6 h-6"
                                    style={{
                                        filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)"
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1">
                                    Телефон
                                </h3>
                                <p className="text-[var(--text-secondary)] text-lg">
                                    +7 (495) 123-45-67
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="p-3 mr-5 bg-[var(--accent)] rounded-2xl text-[var(--bg-primary)] text-2xl">
                                <img
                                    src="/icons/mail.png"
                                    alt="Email"
                                    className="w-6 h-6"
                                    style={{
                                        filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)"
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1">
                                    Email
                                </h3>
                                <p className="text-[var(--text-secondary)] text-lg">
                                    info@legaltrust.ru
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="p-3 mr-5 bg-[var(--accent)] rounded-2xl text-[var(--bg-primary)] text-2xl">
                                <img
                                    src="/icons/time.png"
                                    alt="Time"
                                    className="w-6 h-6"
                                    style={{
                                        filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)"
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1">
                                    Время работы
                                </h3>
                                <p className="text-[var(--text-secondary)] text-lg">
                                    Пн–Пт: 9:00–18:00
                                </p>
                                <p className="text-[var(--text-secondary)] text-lg">
                                    Сб: 10:00–16:00
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка — форма */}
                    <div
                        className={`relative p-10 border transition-all duration-500 ${
                            theme === "dark"
                                ? "border-white/20 bg-white/5"
                                : "border-black/10 bg-white/60 backdrop-blur-md"
                        }`}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm mb-2 font-medium">
                                        Имя *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                                            errors.name ? 'border-red-500' : 'border-[var(--text-secondary)]'
                                        }`}
                                        placeholder="Ваше имя"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm mb-2 font-medium">
                                        Телефон *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                                            errors.phone ? 'border-red-500' : 'border-[var(--text-secondary)]'
                                        }`}
                                        placeholder="+7 (___) ___-__-__"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                                        errors.email ? 'border-red-500' : 'border-[var(--text-secondary)]'
                                    }`}
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    Интересующая услуга *
                                </label>
                                <div className="relative">
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition appearance-none pr-12 ${
                                            errors.service ? 'border-red-500' : 'border-[var(--text-secondary)]'
                                        }`}
                                        style={{
                                            backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "transparent",
                                            color: "var(--text-primary)"
                                        }}
                                    >
                                        <option value="">Выберите услугу</option>
                                        {services.map((s, i) => (
                                            <option key={i} value={s} style={{
                                                backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                                color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                            }}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    <img
                                        src="/arrow_down.svg"
                                        alt=""
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 z-10"
                                        style={{
                                            filter: theme === "dark" ? "invert(0)" : "invert(1) brightness(2)"
                                        }}
                                    />
                                </div>
                                {errors.service && (
                                    <p className="text-red-500 text-xs mt-1">{errors.service}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    Сообщение
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition resize-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                                        errors.message ? 'border-red-500' : 'border-[var(--text-secondary)]'
                                    }`}
                                    placeholder="Опишите вашу ситуацию..."
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                )}
                            </div>

                            {/* Кнопка с анимацией как на других секциях */}
                            <button
                                type="submit"
                                className="relative inline-flex items-center group py-4 active:scale-95 transition-transform duration-150"
                            >
                                <div className="relative overflow-hidden">
                                    <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                        получить консультацию
                                    </div>
                                    <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                        получить консультацию
                                    </div>
                                </div>
                            </button>

                            <p className="text-sm text-[var(--text-secondary)] text-center mt-4">
                                Нажимая кнопку, вы соглашаетесь с{" "}
                                <a
                                    href="/privacy"
                                    className="text-[var(--accent)] underline"
                                >
                                    политикой конфиденциальности
                                </a>
                            </p>
                        </form>
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

export default ContactSection;