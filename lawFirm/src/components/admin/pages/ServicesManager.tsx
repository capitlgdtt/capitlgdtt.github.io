import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import {fetchServices, deleteService, type Service} from '../../../services/serviceService';
import { Link } from 'react-router-dom';

const ServicesManager: React.FC = () => {
    const { t, currentLanguage } = useI18n();
    const [servicesList, setServicesList] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await fetchServices();
            setServicesList(data);
        } catch (err: any) {
            setError(err.message || 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentTranslation = (service: Service) => {
        const lang = currentLanguage as 'en' | 'ru';
        return {
            title: lang === 'en' ? service.title_en : service.title_ru,
            description: lang === 'en' ? service.description_en : service.description_ru,
            details: lang === 'en' ? service.details_en : service.details_ru,
        };
    };

    const handleDeleteService = async (serviceId: number, serviceTitle: string) => {
        const confirmed = window.confirm(
            `${t('admin.services.deleteConfirm.message')} "${serviceTitle}"?`
        );
        if (!confirmed) return;

        try {
            await deleteService(serviceId);
            await loadServices(); // перезагружаем список
            alert(t('admin.services.deleteConfirm.deleted'));
        } catch (err: any) {
            alert(err.message || 'Ошибка удаления');
        }
    };

    if (loading) {
        return (
            <section className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex items-center justify-center">
                <div>{t('common.loading')}</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </section>
        );
    }

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                padding: "var(--container-padding)",
                paddingTop: "calc(var(--header-height) + 2rem)"
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                <div className="overflow-hidden mb-6">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('admin.services.title')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    <Link to="/admin" className="relative inline-flex items-center group py-4">
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

                    <Link to="/admin/services/create" className="relative inline-flex items-center group py-4">
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('admin.services.add')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.services.add')}
                            </div>
                        </div>
                        <img
                            src="/add.svg"
                            alt="add"
                            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                                filter: "invert(54%) sepia(95%) saturate(1555%) hue-rotate(190deg) brightness(95%) contrast(90%)"
                            }}
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {servicesList.map((service) => {
                        const translation = getCurrentTranslation(service);
                        return (
                            <div
                                key={service.id}
                                className="p-6 border border-[var(--bg-secondary)] transition-all duration-300 hover:border-[var(--accent)] flex flex-col justify-between h-full"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-2xl font-syne font-semibold">{translation.title}</h3>
                                        <div className="text-[var(--accent)] text-2xl font-syne font-bold opacity-40">
                                            {String(service.id).padStart(2, "0")}
                                        </div>
                                    </div>
                                    <p className="text-[var(--text-secondary)] mb-4!">{translation.description}</p>
                                    <div className="space-y-2">
                                        {translation.details.map((detail, idx) => (
                                            <div key={idx} className="flex items-center text-sm text-[var(--text-secondary)]">
                                                <span className="w-1 h-1 bg-[var(--accent)] rounded-full mr-3"></span>
                                                {detail}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4 mt-6 pt-4 border-t border-[var(--bg-secondary)]">
                                    <Link
                                        to={`/admin/services/edit/${service.id}`}
                                        className="relative inline-flex items-center group/btn py-2"
                                    >
                                        <div className="relative overflow-hidden">
                                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:-translate-y-full">
                                                {t('admin.services.edit')}
                                            </div>
                                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:translate-y-[-100%]">
                                                {t('admin.services.edit')}
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteService(service.id, translation.title)}
                                        className="text-red-500 hover:opacity-80 transition-opacity uppercase tracking-wide font-medium"
                                    >
                                        {t('admin.services.delete')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServicesManager;