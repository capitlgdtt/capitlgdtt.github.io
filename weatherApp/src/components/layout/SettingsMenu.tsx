import React, { useState, useEffect, useRef } from "react";
import { UnitsToggle } from "./UnitsToggle";
import { LangToggle } from "./LangToggle";
import useI18n from "../../hooks/useI18n";

export default function SettingsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { texts } = useI18n();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const applySettings = () => {
        window.location.reload();
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col items-center justify-center gap-1 h-16 w-16 rounded-2xl transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--card-bg, #D9D9D9)',
                    color: 'var(--text-primary, #292929)'
                }}
            >
                <span className="w-6 h-0.5 bg-current rounded"></span>
                <span className="w-6 h-0.5 bg-current rounded"></span>
                <span className="w-6 h-0.5 bg-current rounded"></span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-xl border z-50"
                     style={{
                         backgroundColor: 'var(--card-bg, #fff)',
                         borderColor: 'var(--text-secondary, #e5e5e5)'
                     }}
                >
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2"
                                   style={{ color: 'var(--text-secondary, #666)' }}>
                                {texts.language}
                            </label>
                            <LangToggle />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2"
                                   style={{ color: 'var(--text-secondary, #666)' }}>
                                {texts.units}
                            </label>
                            <UnitsToggle />
                        </div>
                        <button
                            onClick={applySettings}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 font-medium"
                        >
                            {texts.apply}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}