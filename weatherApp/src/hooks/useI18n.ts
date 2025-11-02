import useLocalStorage from "./useLocalStorage";
import { translations } from "../i18n/translations";

export default function useI18n() {
    const [lang, setLang] = useLocalStorage<"ru"|"en">("lang", "ru");
    const texts = translations[lang];

    return { lang, setLang, texts };
}