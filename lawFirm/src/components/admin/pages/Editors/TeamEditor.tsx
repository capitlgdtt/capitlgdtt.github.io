import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import { fetchTeamMemberById, createTeamMember, updateTeamMember } from '../../../../services/teamService';
import { fetchServices } from '../../../../services/serviceService';
import { apiClient } from '../../../../api/apiClient';
import LanguageTabs from '../../editor/LanguageTabs';

interface ServiceItem {
    id: number;
    key: string;      // английское название (title_en)
    title: string;    // переведённое название
}

const TeamEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, currentLanguage: siteLanguage } = useI18n();

    const isEditing = !!id;
    const memberId = id ? parseInt(id) : undefined;

    const [formData, setFormData] = useState({
        translations: {
            en: { name: '', role: '', description: '' },
            ru: { name: '', role: '', description: '' }
        },
        image: '',
        email: '',
        phone: '',
        experience: '',
        specialization: [] as string[], // массив английских ключей услуг
        currentLanguage: siteLanguage as 'en' | 'ru'
    });

    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Загрузка списка услуг для специализаций
    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await fetchServices();
                const list = data.map(s => ({
                    id: s.id,
                    key: s.translations.en.title,
                    title: s.translations[siteLanguage as 'en' | 'ru']?.title || s.translations.en.title,
                }));
                setServices(list);
            } catch (err) {
                console.error('Failed to load services', err);
            } finally {
                setLoadingServices(false);
            }
        };
        loadServices();
    }, [siteLanguage]);

    // Загрузка данных сотрудника при редактировании
    useEffect(() => {
        if (isEditing && memberId) {
            const loadMember = async () => {
                try {
                    const member = await fetchTeamMemberById(memberId);
                    setFormData({
                        translations: member.translations,
                        image: member.image,
                        email: member.email,
                        phone: member.phone,
                        experience: member.experience,
                        specialization: member.specialization,
                        currentLanguage: siteLanguage as 'en' | 'ru'
                    });
                } catch (err) {
                    console.error(err);
                    alert('Ошибка загрузки данных');
                }
            };
            loadMember();
        }
    }, [isEditing, memberId, siteLanguage]);

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

    const handleTranslationChange = (field: 'name' | 'role' | 'description', value: string) => {
        setFormData(prev => ({
            ...prev,
            translations: {
                ...prev.translations,
                [prev.currentLanguage]: {
                    ...prev.translations[prev.currentLanguage],
                    [field]: value
                }
            }
        }));
    };

    const handleLanguageChange = (language: 'en' | 'ru') => {
        setFormData(prev => ({ ...prev, currentLanguage: language }));
    };

    const handleSpecializationChange = (serviceKey: string) => {
        setFormData(prev => {
            const current = prev.specialization;
            const isSelected = current.includes(serviceKey);
            return {
                ...prev,
                specialization: isSelected
                    ? current.filter(k => k !== serviceKey)
                    : [...current, serviceKey]
            };
        });
    };

    const handleSave = async () => {
        const memberData = {
            translations: formData.translations,
            image: formData.image || '/team/default.jpg',
            email: formData.email,
            phone: formData.phone,
            experience: formData.experience,
            specialization: formData.specialization
        };

        try {
            if (isEditing && memberId) {
                await updateTeamMember(memberId, memberData);
            } else {
                await createTeamMember(memberData);
            }
            navigate('/admin/team');
        } catch (err) {
            console.error('Save failed', err);
            alert('Ошибка сохранения');
        }
    };

    const handleCancel = () => {
        navigate('/admin/team');
    };

    const currentTranslation = formData.translations[formData.currentLanguage];

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
                        {isEditing ? t('admin.team.editMember') : t('admin.team.createMember')}
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
                                {t('admin.backToTeam')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.backToTeam')}
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
                        <label className="block text-sm font-medium mb-2">{t('admin.team.form.name')} *</label>
                        <input
                            type="text"
                            value={currentTranslation.name}
                            onChange={(e) => handleTranslationChange('name', e.target.value)}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder={t('admin.team.form.namePlaceholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.team.form.role')} *</label>
                        <input
                            type="text"
                            value={currentTranslation.role}
                            onChange={(e) => handleTranslationChange('role', e.target.value)}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder={t('admin.team.form.rolePlaceholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.team.form.email')} *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder="member@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.team.form.phone')} *</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.team.form.experience')} *</label>
                        <input
                            type="text"
                            value={formData.experience}
                            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder="15+ years"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.team.form.image')}</label>
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.team.form.description')} *</label>
                        <textarea
                            value={currentTranslation.description}
                            onChange={(e) => handleTranslationChange('description', e.target.value)}
                            rows={4}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors resize-none"
                            placeholder={t('admin.team.form.descriptionPlaceholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('admin.team.form.specialization')}</label>
                        {loadingServices ? (
                            <p className="text-[var(--text-secondary)]">Загрузка...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {services.map(service => (
                                    <div key={service.key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`spec-${service.key}`}
                                            checked={formData.specialization.includes(service.key)}
                                            onChange={() => handleSpecializationChange(service.key)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`spec-${service.key}`} className="cursor-pointer hover:text-[var(--accent)] transition-colors">
                                            {service.title}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-[var(--text-secondary)] mt-2">
                            {t('admin.team.form.specializationHint')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={handleSave} className="relative inline-flex items-center group py-4">
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {isEditing ? t('admin.team.update') : t('admin.team.save')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {isEditing ? t('admin.team.update') : t('admin.team.save')}
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={handleCancel}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wide font-medium py-4"
                    >
                        {t('admin.team.cancel')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TeamEditor;