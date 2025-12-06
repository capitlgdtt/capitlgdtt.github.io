import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useI18n} from "../../../../hooks/useI18n.ts";
import {getCategoriesByLanguage, translateCategory} from "../../../../services/blogService.ts";
import {createTeamMember, getTeamMemberById, updateTeamMember} from "../../../../services/teamService.ts";
import LanguageTabs from "../../editor/LanguageTabs.tsx";

const TeamEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, currentLanguage: siteLanguage } = useI18n();

    const isEditing = !!id;
    const memberId = id ? parseInt(id) : undefined;

    // Получаем категории для специализации
    const englishCategories = getCategoriesByLanguage('en');

    const [formData, setFormData] = useState({
        translations: {
            en: { name: '', role: '', description: '' },
            ru: { name: '', role: '', description: '' }
        },
        image: '',
        email: '',
        phone: '',
        experience: '',
        specialization: [] as string[],
        currentLanguage: siteLanguage as 'en' | 'ru'
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Загрузка данных при редактировании
    useEffect(() => {
        if (isEditing && memberId) {
            const member = getTeamMemberById(memberId);
            if (member) {
                setFormData({
                    translations: member.translations,
                    image: member.image,
                    email: member.email,
                    phone: member.phone,
                    experience: member.experience,
                    specialization: member.specialization,
                    currentLanguage: siteLanguage as 'en' | 'ru'
                });
            }
        }
    }, [isEditing, memberId, siteLanguage]);

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

    const handleSpecializationChange = (categoryKey: string) => {
        setFormData(prev => {
            const currentSpecs = prev.specialization;
            const isSelected = currentSpecs.includes(categoryKey);

            return {
                ...prev,
                specialization: isSelected
                    ? currentSpecs.filter(cat => cat !== categoryKey)
                    : [...currentSpecs, categoryKey]
            };
        });
    };

    const handleSave = () => {
        const memberData = {
            translations: formData.translations,
            image: formData.image || '/team/default.jpg',
            email: formData.email,
            phone: formData.phone,
            experience: formData.experience,
            specialization: formData.specialization
        };

        if (isEditing && memberId) {
            updateTeamMember(memberId, memberData);
        } else {
            createTeamMember(memberData);
        }

        navigate('/admin/team');
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
                {/* Заголовок */}
                <div className="overflow-hidden mb-6">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {isEditing ? t('admin.team.editMember') : t('admin.team.createMember')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    {/* Кнопка возврата */}
                    <button
                        onClick={handleCancel}
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
                                {t('admin.backToTeam')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.backToTeam')}
                            </div>
                        </div>
                    </button>
                </div>

                {/* Языковые табы */}
                <LanguageTabs
                    currentLanguage={formData.currentLanguage}
                    onLanguageChange={handleLanguageChange}
                />

                {/* Форма */}
                <div className="space-y-6 mb-8">
                    {/* Имя */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.team.form.name')} *
                        </label>
                        <input
                            type="text"
                            value={currentTranslation.name}
                            onChange={(e) => handleTranslationChange('name', e.target.value)}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder={t('admin.team.form.namePlaceholder')}
                        />
                    </div>

                    {/* Должность */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.team.form.role')} *
                        </label>
                        <input
                            type="text"
                            value={currentTranslation.role}
                            onChange={(e) => handleTranslationChange('role', e.target.value)}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder={t('admin.team.form.rolePlaceholder')}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.team.form.email')} *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder="member@company.com"
                        />
                    </div>

                    {/* Телефон */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.team.form.phone')} *
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>

                    {/* Опыт */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.team.form.experience')} *
                        </label>
                        <input
                            type="text"
                            value={formData.experience}
                            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder="15+ years"
                        />
                    </div>

                    {/* Изображение */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.team.form.image')}
                        </label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder="/team/photo.jpg"
                        />
                    </div>

                    {/* Описание */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.team.form.description')} *
                        </label>
                        <textarea
                            value={currentTranslation.description}
                            onChange={(e) => handleTranslationChange('description', e.target.value)}
                            rows={4}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors resize-none"
                            placeholder={t('admin.team.form.descriptionPlaceholder')}
                        />
                    </div>

                    {/* Специализация (мультивыбор) */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.team.form.specialization')}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {englishCategories.map((englishCategory) => {
                                const translatedCategory = translateCategory(englishCategory, formData.currentLanguage);
                                return (
                                    <div key={englishCategory} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`spec-${englishCategory}`}
                                            checked={formData.specialization.includes(englishCategory)}
                                            onChange={() => handleSpecializationChange(englishCategory)}
                                            className="mr-2"
                                        />
                                        <label
                                            htmlFor={`spec-${englishCategory}`}
                                            className="cursor-pointer hover:text-[var(--accent)] transition-colors"
                                        >
                                            {translatedCategory}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-2">
                            {t('admin.team.form.specializationHint')}
                        </p>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        className="relative inline-flex items-center group py-4"
                    >
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