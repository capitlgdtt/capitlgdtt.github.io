import React from "react";
import useI18n from "../../hooks/useI18n";

interface CurrentLocationButtonProps {
    onLocationFound: () => void;
    disabled?: boolean;
}

export default function CurrentLocationButton({ onLocationFound, disabled }: CurrentLocationButtonProps) {
    const { texts } = useI18n();

    const handleClick = () => {
        console.log("Use current location");
        onLocationFound();
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-2xl shadow-lg transition-colors duration-300 h-16 w-16 md:w-auto px-4 md:px-6 whitespace-nowrap"
        >
            <img
                src="../src/assets/current location icon.png"
                alt={texts.currentLocation}
                className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-xl font-black hidden lg:block">
                {texts.currentLocation}
            </span>
            <span className="text-xl font-black hidden md:block lg:hidden">
                {texts.current}
            </span>
        </button>
    );
}