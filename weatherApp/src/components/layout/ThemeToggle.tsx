import React, { useEffect, useState } from "react";
import useI18n from "../../hooks/useI18n";

export default function ThemeToggle() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
    const { texts } = useI18n();

    useEffect(() => {
        const body = document.body;
        if (dark) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
            body.style.background = "linear-gradient(180deg, #383838 0%, #9E9E9E 72%)";
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
            body.style.background = "linear-gradient(180deg, #FFFFFF 0%, #466173 178%)";
        }
    }, [dark]);

    const toggleTheme = () => {
        setDark(!dark);
    };

    return (
        <div className="flex flex-col items-center justify-center h-16">
            <div
                className="relative inline-block w-14 h-8 cursor-pointer mb-1"
                onClick={toggleTheme}
            >
                <div
                    className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
                        dark ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                ></div>
                <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                        dark ? 'transform translate-x-6' : ''
                    }`}
                ></div>
            </div>

            <div className="text-[18px] font-black text-center w-full whitespace-nowrap" style={{
                color: dark ? '#FFFFFF' : '#292929'
            }}>
                {dark ? texts.lightMode : texts.darkMode}
            </div>
        </div>
    );
}