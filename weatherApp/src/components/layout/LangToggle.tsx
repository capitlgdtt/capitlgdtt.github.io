import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";

export function LangToggle() {
    const [lang, setLang] = useLocalStorage<"ru"|"en">("lang", "ru");
    return (
        <div className="flex items-center gap-2">
            <button onClick={() => setLang("ru")} className={`px-2 py-1 rounded ${lang==="ru" ? "bg-blue-600 text-white" : "border"}`}>RU</button>
            <button onClick={() => setLang("en")} className={`px-2 py-1 rounded ${lang==="en" ? "bg-blue-600 text-white" : "border"}`}>EN</button>
        </div>
    );
}
