import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import {
    getApplications,
    deleteApplication,
    updateApplicationStatus,
    getApplicationsStats
} from '../../../services/applicationService.ts';
import {getCategoriesByLanguage, translateCategory} from '../../../services/blogService.ts';
import {Link} from "react-router-dom";
import {useTheme} from "../../../hooks/useTheme.ts";
import { useFilter } from '../../../hooks/useFilter';

const ApplicationsManager: React.FC = () => {
    const { t, currentLanguage } = useI18n();
    const [applications, setApplications] = useState(getApplications());
    const [stats, setStats] = useState(getApplicationsStats());

    // Получаем категории услуг для фильтра
    const categories = ['all', ...getCategoriesByLanguage((currentLanguage || 'ru') as 'en' | 'ru')];

    // Отслеживание темы для стилей выпадающих списков
    const { theme } = useTheme();

    // Определяем фильтры для useFilter
    const statusFilter = (app: any, status: string) => app.status === status;
    const serviceFilter = (app: any, selectedCategory: string) => {
        if (selectedCategory === 'all') return true;

        const translatedAppService = translateCategory(app.service, currentLanguage as 'en' | 'ru');
        return translatedAppService === selectedCategory;
    };

    // Функция сортировки по дате (новые сверху)
    const sortByDate = (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    const {
        filteredItems: filteredApplications,
        filterValues,
        updateFilter,
        resetFilters
    } = useFilter(
        applications,
        {
            status: statusFilter,
            service: serviceFilter
        },
        {
            status: 'all',
            service: 'all'
        },
        sortByDate
    );

    // Извлекаем значения фильтров
    const selectedStatus = filterValues.status;
    const selectedService = filterValues.service;

    // Обновление статистики
    useEffect(() => {
        setStats(getApplicationsStats());
    }, [applications]);

    const handleStatusChange = async (id: number, newStatus: 'new' | 'in-progress' | 'completed') => {
        const updated = updateApplicationStatus(id, newStatus);
        if (updated) {
            setApplications(getApplications());
        }
    };

    const handleDeleteApplication = async (id: number, applicantName: string) => {
        const confirmed = window.confirm(
            `${t('admin.applications.deleteConfirm.message')} "${applicantName}"?`
        );

        if (confirmed) {
            const success = deleteApplication(id);
            if (success) {
                setApplications(getApplications());
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500';
            case 'in-progress': return 'bg-yellow-500';
            case 'completed': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'new': return t('admin.applications.status.new');
            case 'in-progress': return t('admin.applications.status.inProgress');
            case 'completed': return t('admin.applications.status.completed');
            default: return status;
        }
    };

    const handleResetFilters = () => {
        resetFilters(); // Используем метод из useFilter
    };

    // Локализация названий полей
    const getFieldLabel = (field: string) => {
        const labels: Record<string, string> = {
            'name': t('contact.form.name'),
            'email': t('contact.form.email'),
            'phone': t('contact.form.phone'),
            'service': t('contact.form.service'),
            'message': t('contact.form.message'),
            'createdAt': t('admin.applications.date'),
            'status': t('admin.applications.statusLabel')
        };
        return labels[field] || field;
    };

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                padding: "var(--container-padding)",
                paddingTop: "calc(var(--header-height) + 2rem)"
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок */}
                <div className="overflow-hidden mb-6">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('admin.applications.title')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    {/* Кнопка возврата */}
                    <Link
                        to="/admin"
                        className="relative inline-flex items-center group py-4"
                    >
                        <img
                            src="/arrow_details.svg"
                            alt="arrow"
                            className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1"
                            style={{
                                filter: "invert(54%) sepia(95%) saturate(1555%) hue-rotate(190deg) brightness(95%) contrast(90%)",
                                transform: 'scaleX(-1)'
                            }}
                        />
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('admin.backToDashboard')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.backToDashboard')}
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[var(--bg-secondary)] p-4 text-center">
                        <div className="text-2xl font-bold text-[var(--accent)]">{stats.total}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{t('admin.applications.stats.total')}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-4 text-center">
                        <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{t('admin.applications.stats.new')}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-500">{stats.inProgress}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{t('admin.applications.stats.inProgress')}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-4 text-center">
                        <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{t('admin.applications.stats.completed')}</div>
                    </div>
                </div>

                {/* Фильтры */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-[var(--bg-secondary)]">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">{t('admin.applications.filters.status')}</label>
                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => updateFilter('status', e.target.value)} // Используем updateFilter
                                className={`w-full bg-transparent border px-4 py-2 focus:border-[var(--accent)] outline-none transition appearance-none pr-12 ${
                                    selectedStatus !== 'all' ? 'border-[var(--accent)]' : 'border-[var(--text-secondary)]'
                                }`}
                                style={{
                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "transparent",
                                    color: "var(--text-primary)"
                                }}
                            >
                                <option value="all" style={{
                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                    color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                }}>
                                    {t('admin.applications.filters.allStatuses')}
                                </option>
                                <option value="new" style={{
                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                    color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                }}>
                                    {t('admin.applications.status.new')}
                                </option>
                                <option value="in-progress" style={{
                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                    color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                }}>
                                    {t('admin.applications.status.inProgress')}
                                </option>
                                <option value="completed" style={{
                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                    color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                }}>
                                    {t('admin.applications.status.completed')}
                                </option>
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
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">{t('admin.applications.filters.service')}</label>
                        <div className="relative">
                            <select
                                value={selectedService}
                                onChange={(e) => updateFilter('service', e.target.value)} // Используем updateFilter
                                className={`w-full bg-transparent border px-4 py-2 focus:border-[var(--accent)] outline-none transition appearance-none pr-12 ${
                                    selectedService !== 'all' ? 'border-[var(--accent)]' : 'border-[var(--text-secondary)]'
                                }`}
                                style={{
                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "transparent",
                                    color: "var(--text-primary)"
                                }}
                            >
                                {categories.map((category, index) => (
                                    <option
                                        key={index}
                                        value={category}
                                        style={{
                                            backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                            color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                        }}
                                    >
                                        {category === 'all' ? t('admin.applications.filters.allServices') : category}
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
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleResetFilters}
                            className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--text-secondary)] hover:border-[var(--accent)] transition-colors text-sm"
                        >
                            {t('admin.applications.filters.reset')}
                        </button>
                    </div>
                </div>

                {/* Список заявок */}
                <div className="space-y-6">
                    {filteredApplications.length === 0 ? (
                        <div className="text-center py-8 text-[var(--text-secondary)]">
                            {t('admin.applications.noApplications')}
                        </div>
                    ) : (
                        filteredApplications.map((application) => (
                            <div
                                key={application.id}
                                className="p-6 border border-[var(--bg-secondary)] transition-all duration-300 hover:border-[var(--accent)]"
                            >
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <h3 className="text-xl font-syne font-semibold">{application.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(application.status)}`}>
                                                {getStatusText(application.status)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[var(--text-secondary)]">
                                            <div>
                                                <strong>{getFieldLabel('email')}:</strong> {application.email}
                                            </div>
                                            <div>
                                                <strong>{getFieldLabel('phone')}:</strong> {application.phone}
                                            </div>
                                            <div>
                                                <strong>{getFieldLabel('service')}:</strong> {translateCategory(application.service, currentLanguage as 'en' | 'ru')}
                                            </div>
                                            <div>
                                                <strong>{getFieldLabel('createdAt')}:</strong> {application.createdAt}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <strong>{getFieldLabel('message')}:</strong>
                                    <p className="text-[var(--text-secondary)] mt-2">{application.message}</p>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--bg-secondary)]">
                                    {/* Изменение статуса */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-[var(--text-secondary)]">{getFieldLabel('status')}:</span>
                                        <div className="relative">
                                            <select
                                                value={application.status}
                                                onChange={(e) => handleStatusChange(application.id, e.target.value as any)}
                                                className={`bg-transparent border px-3 py-1 text-sm focus:border-[var(--accent)] outline-none transition appearance-none pr-8 ${
                                                    'border-[var(--text-secondary)]'
                                                }`}
                                                style={{
                                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "transparent",
                                                    color: "var(--text-primary)"
                                                }}
                                            >
                                                <option value="new" style={{
                                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                                    color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                                }}>
                                                    {t('admin.applications.status.new')}
                                                </option>
                                                <option value="in-progress" style={{
                                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                                    color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                                }}>
                                                    {t('admin.applications.status.inProgress')}
                                                </option>
                                                <option value="completed" style={{
                                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                                    color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                                }}>
                                                    {t('admin.applications.status.completed')}
                                                </option>
                                            </select>
                                            <img
                                                src="/arrow_down.svg"
                                                alt=""
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none w-3 h-3"
                                                style={{
                                                    filter: theme === "dark" ? "invert(0)" : "invert(1) brightness(2)"
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Кнопки действий */}
                                    <div className="flex gap-4 ml-auto">
                                        <button
                                            onClick={() => handleDeleteApplication(application.id, application.name)}
                                            className="text-red-500 uppercase tracking-wide font-medium hover:opacity-80 transition-opacity text-sm"
                                        >
                                            {t('admin.applications.delete')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ApplicationsManager;