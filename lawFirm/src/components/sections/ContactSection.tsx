import React, { useEffect } from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import DecorativeLine from "../common/DecorativeLine.tsx";
import { getCategoriesByLanguage } from "../../services/blogService.ts";
import { createApplication } from "../../services/applicationService.ts";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme.ts";
import { useVisibility } from "../../hooks/useVisibility.ts";
import {useForm} from "../../hooks/useForm.tsx";

interface FormData {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
}

const ContactSection: React.FC = () => {
    const { t, currentLanguage } = useI18n();
    const { theme } = useTheme();
    const [ref, visible] = useVisibility(0.2);
    const blogCategories = getCategoriesByLanguage(currentLanguage as 'en' | 'ru');

    const services = [...blogCategories];

    // Функция валидации
    const validateForm = (values: FormData): Partial<Record<keyof FormData, string>> => {
        const errors: Partial<Record<keyof FormData, string>> = {};

        if (!values.name.trim()) {
            errors.name = t('contact.errors.required');
        } else if (values.name.trim().length < 2) {
            errors.name = t('contact.errors.minLength', { length: 2 });
        }

        if (!values.phone.trim()) {
            errors.phone = t('contact.errors.required');
        } else {
            const phoneDigits = values.phone.replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                errors.phone = t('contact.errors.phone');
            }
        }

        if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = t('contact.errors.email');
        }

        if (!values.service) {
            errors.service = t('contact.errors.required');
        }

        return errors;
    };

    // Обработчик отправки формы
    const handleSubmit = async (values: FormData) => {
        createApplication({
            name: values.name,
            email: values.email,
            phone: values.phone,
            service: values.service,
            message: values.message
        }, currentLanguage as 'en' | 'ru');

        console.log("Форма отправлена:", values);
        alert(t('contact.successMessage'));
    };

    // Используем хук формы
    const {
        values: formData,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit: submitHandler,
        resetForm,
        setFieldValue
    } = useForm<FormData>({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            service: "",
            message: "",
        },
        validate: validateForm,
        onSubmit: handleSubmit
    });

    // Автоматическое заполнение услуги
    useEffect(() => {
        const handleServiceSelection = (event: CustomEvent) => {
            setFieldValue('service', event.detail.service);
        };

        const savedService = sessionStorage.getItem('selectedService');
        if (savedService) {
            setFieldValue('service', savedService);
            sessionStorage.removeItem('selectedService');
        }

        window.addEventListener('serviceSelected', handleServiceSelection as EventListener);

        return () => {
            window.removeEventListener('serviceSelected', handleServiceSelection as EventListener);
        };
    }, [setFieldValue]);

    // Обработчик формы со сбросом после успешной отправки
    const handleFormSubmit = async (e: React.FormEvent) => {
        await submitHandler(e);
        if (Object.keys(errors).length === 0) {
            resetForm();
        }
    };

    // JSX остается практически без изменений, только замените обработчики:
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
                    <h2 className="text-[2.2rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold leading-tight">
                        {t('contact.title.part1')} <span className="text-[var(--accent)]">{t('contact.title.part2')}</span>
                    </h2>
                </div>

                <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 transition-opacity duration-1000 ${
                        visible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {/* Левая колонка — контакты */}
                    <div className="space-y-10">
                        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-[80%] leading-relaxed mb-12!">
                            {t('contact.description.part1')}{" "}
                            <span className="text-[var(--accent)] font-semibold whitespace-nowrap">
                                {t('contact.description.part2')}
                            </span>{" "}
                            {t('contact.description.part3')}
                        </p>

                        <div className="flex items-start">
                            <div className="p-3 mr-4 md:mr-5 bg-[var(--accent)] rounded-2xl text-[var(--bg-primary)] text-xl md:text-2xl">
                                <img
                                    src="/icons/phone.png"
                                    alt={t('contact.phone')}
                                    className="w-6 h-6"
                                    style={{
                                        filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)"
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1">
                                    {t('contact.phone')}
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
                                    alt={t('contact.email')}
                                    className="w-6 h-6"
                                    style={{
                                        filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)"
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1">
                                    {t('contact.email')}
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
                                    alt={t('contact.workHours')}
                                    className="w-6 h-6"
                                    style={{
                                        filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)"
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1">
                                    {t('contact.workHours')}
                                </h3>
                                <p className="text-[var(--text-secondary)] text-lg">
                                    {t('contact.workDays')}
                                </p>
                                <p className="text-[var(--text-secondary)] text-lg">
                                    {t('contact.weekend')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка — форма */}
                    <div
                        className={`relative p-6 md:p-8 lg:p-10 border transition-all duration-500 ${
                            theme === "dark"
                                ? "border-white/20 bg-white/5"
                                : "border-black/10 bg-white/60 backdrop-blur-md"
                        }`}
                    >
                        <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-sm mb-2 font-medium">
                                        {t('contact.form.name')} *
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
                                        placeholder={t('contact.placeholders.name')}
                                        disabled={isSubmitting}
                                    />
                                    {errors.name && touched.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm mb-2 font-medium">
                                        {t('contact.form.phone')} *
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
                                        placeholder={t('contact.placeholders.phone')}
                                        disabled={isSubmitting}
                                    />
                                    {errors.phone && touched.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    {t('contact.form.email')}
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
                                    placeholder={t('contact.placeholders.email')}
                                    disabled={isSubmitting}
                                />
                                {errors.email && touched.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    {t('contact.form.service')} *
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
                                        disabled={isSubmitting}
                                    >
                                        <option value="">{t('contact.placeholders.service')}</option>
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
                                {errors.service && touched.service && (
                                    <p className="text-red-500 text-xs mt-1">{errors.service}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    {t('contact.form.message')}
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
                                    placeholder={t('contact.placeholders.message')}
                                    disabled={isSubmitting}
                                />
                                {errors.message && touched.message && (
                                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                )}
                            </div>

                            {/* Кнопка с анимацией как на других секциях */}
                            <button
                                type="submit"
                                className="relative inline-flex items-center group py-4 active:scale-95 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                <div className="relative overflow-hidden">
                                    <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                        {isSubmitting ? t('contact.submitting') : t('contact.submit')}
                                    </div>
                                    <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                        {isSubmitting ? t('contact.submitting') : t('contact.submit')}
                                    </div>
                                </div>
                            </button>

                            <p className="text-sm text-[var(--text-secondary)] text-center mt-4">
                                {t('contact.privacy.part1')}{" "}
                                <Link
                                    to="/privacy"
                                    className="text-[var(--accent)] underline"
                                >
                                    {t('contact.privacy.part2')}
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Нижняя линия */}
            <DecorativeLine visible={visible} />
        </section>
    );
};

export default ContactSection;