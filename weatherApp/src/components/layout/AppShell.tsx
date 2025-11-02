import React from "react";
import Header from "./Header";

interface AppShellProps {
    children: React.ReactNode;
    onSearch: (locationData: { lat: number; lon: number; label?: string } | string) => void;
    suggestions?: Array<{ name: string; country?: string; lat: number; lon: number }>;
    onQueryChange?: (q: string) => void;
    onUseCurrentLocation: () => void;
    searchHistory?: {label: string, lat: number, lon: number}[];
}

export default function AppShell({
                                     children,
                                     onSearch,
                                     suggestions = [],
                                     onQueryChange,
                                     onUseCurrentLocation,
                                     searchHistory = [],
                                 }: AppShellProps) {
    return (
        <div className="min-h-screen">
            <Header
                onSearch={onSearch}
                onQueryChange={onQueryChange}
                suggestions={suggestions}
                onUseCurrentLocation={onUseCurrentLocation}
                searchHistory={searchHistory}
            />
            <main className="p-4">{children}</main>
        </div>
    );
}