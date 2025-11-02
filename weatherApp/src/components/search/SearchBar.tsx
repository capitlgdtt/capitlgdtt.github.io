import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import SearchSuggestions from "./SearchSuggestions";
import useI18n from "../../hooks/useI18n";

type Form = { q: string };

interface SearchBarProps {
    onSearch: (locationData: { lat: number; lon: number; label?: string } | string) => void;
    suggestions?: Array<{
        name: string;
        local_names?: { [key: string]: string };
        country?: string;
        state?: string;
        lat: number;
        lon: number
    }>;
    onQueryChange?: (q: string) => void;
    searchHistory?: Array<string | { label: string; lat: number; lon: number }>;
}

export default function SearchBar({
                                      onSearch,
                                      suggestions = [],
                                      onQueryChange,
                                      searchHistory = [],
                                  }: SearchBarProps) {
    const {register, handleSubmit, setValue} = useForm<Form>({defaultValues: {q: ""}});
    const [theme, setTheme] = useState("dark");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [query, setQuery] = useState("");
    const { texts, lang } = useI18n();

    const uniqueSuggestions = React.useMemo(() => {
        if (!suggestions?.length) return [];

        const grouped = new Map();

        suggestions.forEach(item => {
            const key = `${item.name.toLowerCase()}|${item.state || ''}`;

            if (!grouped.has(key)) {
                grouped.set(key, item);
            }
        });

        return Array.from(grouped.values());
    }, [suggestions]);

    const localizedSuggestions = React.useMemo(() => {
        return uniqueSuggestions.map(item => ({
            ...item,
            displayName: item.local_names?.[lang] || item.name
        }));
    }, [uniqueSuggestions, lang]);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
        });
        observer.observe(document.documentElement, {attributes: true, attributeFilter: ["class"]});
        return () => observer.disconnect();
    }, []);

    const submit = (data: Form) => {
        const v = data.q.trim();
        if (!v) return;
        onSearch(v);
        setShowSuggestions(false);
    };

    const handleSuggestionPick = (lat: number, lon: number, label?: string) => {
        if (label) {
            const cityNameOnly = label.split(',')[0].trim();
            setValue("q", "");
            setQuery("");
            onSearch({lat, lon, label: cityNameOnly});
        }
        setShowSuggestions(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setValue("q", value);
        if (onQueryChange) onQueryChange(value);
        setShowSuggestions(!!value.trim());
    };

    const searchIcon = `../src/assets/${theme}/search.png`;

    return (
        <div className="relative">
            <form onSubmit={handleSubmit(submit)} className="relative h-16">
                <input
                    {...register("q")}
                    placeholder={texts.searchPlaceholder}
                    className="w-full h-16 p-4 pl-14 rounded-2xl border-0 text-lg font-normal shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                        backgroundColor: theme === "dark" ? "#444444" : "#D9D9D9",
                        color: theme === "dark" ? "#FFFFFF" : "#292929"
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    value={query}
                    onChange={handleInputChange}
                />
                <button type="submit"
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent border-none outline-none focus:outline-none">
                    <img
                        src={searchIcon}
                        alt={texts.search}
                        className="w-6 h-6"
                    />
                </button>
            </form>

            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2">
                    {!query && searchHistory.length > 0 ? (
                        <SearchSuggestions
                            items={searchHistory.map(item =>
                                typeof item === "string"
                                    ? { name: item, lat: 0, lon: 0 }
                                    : { name: item.label, lat: item.lat, lon: item.lon }
                            )}
                            onPick={handleSuggestionPick}
                        />
                    ) : query && localizedSuggestions.length > 0 ? (
                        <SearchSuggestions
                            items={localizedSuggestions}
                            onPick={handleSuggestionPick}
                        />
                    ) : null}
                </div>
            )}

        </div>
    );
}