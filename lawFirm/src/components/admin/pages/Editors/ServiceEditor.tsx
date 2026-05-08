import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import LanguageTabs from '../../editor/LanguageTabs';
import { fetchServiceById, createService, updateService } from '../../../../services/serviceService';
import { apiClient } from '../../../../api/apiClient';

const ServiceEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, currentLanguage: siteLanguage } = useI18n();

    const isEditing = !!id;
    const serviceId = id ? parseInt(id) : undefined;

    const [formData, setFormData] = useState({
        title_en: '',
        title_ru: '',
        description_en: '',
        description_ru: '',
        details_en: [''],
        details_ru: [''],
        image: '',
        currentLanguage: siteLanguage as 'en' | 'ru'
    });

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const { url } = await apiClient.uploadFile(file);
            setFormData(prev => ({ ...prev, image: url }));
        } catch (err) {
            console.error('Upload failed', err);
            alert('Ошибка загрузки изображения');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Загрузка данных при редактировании
    useEffect(() => {
        if (isEditing && serviceId) {
            const loadService = async () => {
                setLoading(true);
                try {
                    const service = await fetchServiceById(serviceId);
                    setFormData({
                        title_en: service.title_en,
                        title_ru: service.title_ru,
                        description_en: service.description_en,
                        description_ru: service.description_ru,
                        details_en: service.details_en,
                        details_ru: service.details_ru,
                        image: service.image,
                        currentLanguage: siteLanguage as 'en' | 'ru'
                    });
                } catch (err) {
                    console.error(err);
                    alert('Ошибка загрузки данных');
                } finally {
                    setLoading(false);
                }
            };
            loadService();
        }
    }, [isEditing, serviceId, siteLanguage]);

    const handleTranslationChange = (field: 'title' | 'description', value: string) => {
        const lang = formData.currentLanguage;
        setFormData(prev => ({ ...prev, [`${field}_${lang}`]: value }));
    };

    const handleDetailChange = (index: number, value: string) => {
        const lang = formData.currentLanguage;
        const key = `details_${lang}` as keyof typeof formData;
        setFormData(prev => {
            const newDetails = [...(prev[key] as string[])];
            newDetails[index] = value;
            return { ...prev, [key]: newDetails };
        });
    };

    const addDetail = () => {
        const lang = formData.currentLanguage;
        const key = `details_${lang}` as keyof typeof formData;
        setFormData(prev => ({
            ...prev,
            [key]: [...(prev[key] as string[]), '']
        }));
    };

    const removeDetail = (index: number) => {
        const lang = formData.currentLanguage;
        const key = `details_${lang}` as keyof typeof formData;
        const current = formData[key] as string[];
        if (current.length > 1) {
            setFormData(prev => ({
                ...prev,
                [key]: current.filter((_, i) => i !== index)
            }));
        }
    };

    const handleLanguageChange = (language: 'en' | 'ru') => {
        setFormData(prev => ({ ...prev, currentLanguage: language }));
    };

    const handleSave = async () => {
        const serviceData = {
            title_en: formData.title_en,
            title_ru: formData.title_ru,
            description_en: formData.description_en,
            description_ru: formData.description_ru,
            details_en: formData.details_en,
            details_ru: formData.details_ru,
            image: formData.image || '/services/default.jpg'
        };

        try {
            if (isEditing && serviceId) {
                await updateService(serviceId, serviceData);
            } else {
                await createService(serviceData);
            }
            navigate('/admin/services');
        } catch (err: any) {
            console.error('Save failed', err);
            const message = err.message || t('common.error');
            alert(message);
        }
    };

    const handleCancel = () => {
        navigate('/admin/services');
    };

    const getCurrentValue = (field: 'title' | 'description' | 'details') => {
        const lang = formData.currentLanguage;
        return field === 'details'
            ? formData[`details_${lang}`]
            : formData[`${field}_${lang}`];
    };

    if (loading) {
        return <div className="text-center py-10">Загрузка...</div>;
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
                        {isEditing ? t('admin.services.editService') : t('admin.services.createService')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    <button onClick={handleCancel} className="relative inline-flex items-center group py-4">
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
                                {t('admin.backToServices')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.backToServices')}
                            </div>
                        </div>
                    </button>
                </div>

                <LanguageTabs
                    currentLanguage={formData.currentLanguage}
                    onLanguageChange={handleLanguageChange}
                />

                <div className="space-y-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.services.form.title')} *</label>
                        <input
                            type="text"
                            value={getCurrentValue('title')}
                            onChange={(e) => handleTranslationChange('title', e.target.value)}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder={t('admin.services.form.titlePlaceholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.services.form.description')} *</label>
                        <textarea
                            value={getCurrentValue('description')}
                            onChange={(e) => handleTranslationChange('description', e.target.value)}
                            rows={3}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors resize-none"
                            placeholder={t('admin.services.form.descriptionPlaceholder')}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">{t('admin.services.form.details')} *</label>
                            <button
                                type="button"
                                onClick={addDetail}
                                className="text-[var(--accent)] text-sm hover:opacity-80 transition-opacity"
                            >
                                + {t('admin.services.form.addDetail')}
                            </button>
                        </div>

                        <div className="space-y-3">
                            {(getCurrentValue('details') as string[]).map((detail: string, index: number) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <span className="w-1 h-1 bg-[var(--accent)] rounded-full flex-shrink-0"></span>
                                    <input
                                        type="text"
                                        value={detail}
                                        onChange={(e) => handleDetailChange(index, e.target.value)}
                                        className="flex-1 bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                                        placeholder={t('admin.services.form.detailPlaceholder', { number: index + 1 })}
                                    />
                                    {getCurrentValue('details').length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeDetail(index)}
                                            className="text-red-500 hover:opacity-80 transition-opacity px-3 py-3"
                                            title={t('admin.services.form.removeDetail')}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-2">{t('admin.services.form.detailsHint')}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.services.form.image')}</label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-[var(--bg-primary)] hover:file:opacity-90"
                        />
                        {formData.image && (
                            <div className="mt-2">
                                <img src={formData.image} alt="Preview" className="max-h-32 object-cover rounded" />
                                <p className="text-xs text-[var(--text-secondary)] mt-1 break-all">{formData.image}</p>
                            </div>
                        )}
                        {uploading && <p className="text-xs text-[var(--text-secondary)] mt-1">Загрузка...</p>}
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{t('admin.services.form.imageHint')}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={handleSave} className="relative inline-flex items-center group py-4">
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {isEditing ? t('admin.services.update') : t('admin.services.save')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {isEditing ? t('admin.services.update') : t('admin.services.save')}
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={handleCancel}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wide font-medium py-4"
                    >
                        {t('admin.services.cancel')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServiceEditor;