import { useTranslation } from 'react-i18next';

export const useI18n = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const currentLanguage = i18n.isInitialized ? i18n.language.split('-')[0] : 'ru';
    const isEnglish = currentLanguage === 'en';

    return {
        t,
        changeLanguage,
        currentLanguage,
        isEnglish,
        i18n
    };
};