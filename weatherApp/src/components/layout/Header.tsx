import React from "react";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "../search/SearchBar";
import SettingsMenu from "./SettingsMenu";
import CurrentLocationButton from "./CurrentLocationButton";

interface HeaderProps {
    onSearch: (locationData: { lat: number; lon: number; label?: string } | string) => void;
    suggestions?: Array<{ name: string; country?: string; lat: number; lon: number }>;
    onQueryChange?: (q: string) => void;
    onUseCurrentLocation: () => void;
    searchHistory?: {label: string, lat: number, lon: number}[];
}

export default function Header({
                                   onSearch,
                                   suggestions = [],
                                   onQueryChange,
                                   onUseCurrentLocation,
                                   searchHistory = [],
                               }: HeaderProps) {
    return (
        <header className="flex items-center justify-between p-6 bg-transparent w-full gap-4 min-h-[64px]">
            <div className="w-1/6 h-[64px] flex items-center">
                <ThemeToggle />
            </div>

            <div className="w-3/6 h-[64px] flex items-center">
                <div className="w-full h-full">
                    <SearchBar onSearch={onSearch}
                               onQueryChange={onQueryChange}
                               suggestions={suggestions}
                               searchHistory={searchHistory}
                    />
                </div>
            </div>

            <div className="w-2/6 h-[64px] flex items-center justify-end">
                <div className="flex items-center gap-4 h-full">
                    <CurrentLocationButton onLocationFound={onUseCurrentLocation} />
                    <SettingsMenu />
                </div>
            </div>
        </header>
    );
}