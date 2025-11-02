import React, { useState, useEffect } from "react";
import AppShell from "./components/layout/AppShell";
import SearchBar from "./components/search/SearchBar";
import SearchSuggestions from "./components/search/SearchSuggestions";
import useDebounce from "./hooks/useDebounce";
import useLocalStorage from "./hooks/useLocalStorage";
import useFetchJson from "./hooks/useFetchJson";
import { geocodeUrl } from "./services/owm";
import useGeolocation from "./hooks/useGeolocation";
import useUnits from "./hooks/useUnits";
import useWeather from "./hooks/useWeather";
import { Loader, ErrorState, EmptyState } from "./components/common/States";
import CurrentWeatherCard from "./components/weather/CurrentWeatherCard";
import ForecastList from "./components/weather/ForecastList";
import AQICard from "./components/weather/AQICard";

export default function App() {
    const [query, setQuery] = useState("");
    const qDeb = useDebounce(query, 350);
    const [history, setHistory] = useLocalStorage<string[]>("searchHistory", []);
    const geo = useGeolocation();
    const { units } = useUnits();

    const geocode = useFetchJson(qDeb ? geocodeUrl(qDeb) : null, [qDeb]);
    const [loc, setLoc] = useState<{ lat: number; lon: number; label?: string } | null>(null);

    useEffect(() => {
        if (geo.pos && !loc) setLoc({ lat: geo.pos.lat, lon: geo.pos.lon, label: "Current location" });
    }, [geo.pos]);

    const weather = useWeather(loc?.lat ?? null, loc?.lon ?? null, units, "ru");

    function onSearch(q: string) {
        setQuery(q);
    }

    function pickSuggestion(lat: number, lon: number, label?: string) {
        setLoc({ lat, lon, label });
        setHistory([...(history.filter(h => h !== label)), label ?? `${lat},${lon}`].slice(0, 10));
        setQuery("");
    }

    return (
        <AppShell>
            <div className="space-y-4">
                <SearchBar onSearch={onSearch} />
                <SearchSuggestions items={(geocode.data ?? []) as any} onPick={pickSuggestion} />
                {!loc && <EmptyState message="Выберите город или используйте геолокацию" />}
                {weather.current.loading && <Loader />}
                {weather.current.error && <ErrorState message={weather.current.error} />}
                {weather.current.data && loc && (
                    <>
                        <CurrentWeatherCard data={weather.current.data} locationLabel={loc.label} />
                        <ForecastList forecast={weather.forecast.data} />
                        <AQICard aqi={weather.aqi.data} />
                    </>
                )}
            </div>
        </AppShell>
    );
}
