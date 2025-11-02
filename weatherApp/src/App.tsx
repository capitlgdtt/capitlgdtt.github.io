import React, { useState, useEffect } from "react";
import AppShell from "./components/layout/AppShell";
import useDebounce from "./hooks/useDebounce";
import useLocalStorage from "./hooks/useLocalStorage";
import useFetchJson from "./hooks/useFetchJson";
import {geocodeUrl, reverseGeocodeUrl} from "./services/owm";
import useGeolocation from "./hooks/useGeolocation";
import useUnits from "./hooks/useUnits";
import useWeather from "./hooks/useWeather";
import { Loader, ErrorState, EmptyState } from "./components/common/States";
import CurrentWeatherCard from "./components/weather/CurrentWeatherCard";
import ForecastList from "./components/weather/ForecastList";
import AQICard from "./components/weather/AQICard";
import CurrentLocationCard from "./components/weather/CurrentLocationCard";
import HourlyForecast from "./components/weather/HourlyForecast";
import useI18n from "./hooks/useI18n";

export default function App() {
    const [query, setQuery] = useState("");
    const qDeb = useDebounce(query, 350);
    const [history, setHistory] = useLocalStorage<{label: string, lat: number, lon: number}[]>("searchHistory", []);    const geo = useGeolocation();
    const { units } = useUnits();
    const { lang, texts } = useI18n();

    const geocode = useFetchJson(qDeb ? geocodeUrl(qDeb, lang) : null, [qDeb, lang]);

    const [loc, setLoc] = useState<{ lat: number; lon: number; label?: string } | null>(null);

    const autoReverseGeocode = useFetchJson(
        geo.pos && !loc ? reverseGeocodeUrl(geo.pos.lat, geo.pos.lon, lang) : null,
        [geo.pos, lang]
    );

    const [manualReverseGeocodeCoords, setManualReverseGeocodeCoords] = useState<{lat: number, lon: number} | null>(null);
    const manualReverseGeocode = useFetchJson(
        manualReverseGeocodeCoords ? reverseGeocodeUrl(manualReverseGeocodeCoords.lat, manualReverseGeocodeCoords.lon, lang) : null,
        [manualReverseGeocodeCoords, lang]
    );

    useEffect(() => {
        if (geo.pos && !loc && autoReverseGeocode.data) {
            const data = autoReverseGeocode.data as any[];
            if (data && data[0]) {
                const city = data[0].local_names?.[lang] || data[0].name;
                setLoc({ lat: geo.pos.lat, lon: geo.pos.lon, label: city });
            } else {
                setLoc({ lat: geo.pos.lat, lon: geo.pos.lon, label: texts.currentLocationLabel });
            }
        }
    }, [geo.pos, autoReverseGeocode.data, loc, lang, texts.currentLocationLabel]);

    useEffect(() => {
        if (manualReverseGeocodeCoords && manualReverseGeocode.data) {
            const data = manualReverseGeocode.data as any[];
            let cityName = texts.currentLocationLabel;
            if (data && data[0]) {
                cityName = data[0].local_names?.[lang] || data[0].name;
            }
            setLoc({ lat: manualReverseGeocodeCoords.lat, lon: manualReverseGeocodeCoords.lon, label: cityName });
            setManualReverseGeocodeCoords(null);
        }
    }, [manualReverseGeocode.data, manualReverseGeocodeCoords, lang, texts.currentLocationLabel]);

    const weather = useWeather(loc?.lat ?? null, loc?.lon ?? null, units);

    function onSearch(searchInput: { lat: number; lon: number; label?: string } | string) {
        if (typeof searchInput === 'string') {
            setQuery(searchInput);
        } else {
            setLoc(searchInput);
            setQuery("");
            if (searchInput.label && searchInput.label.trim() !== '') {
                setHistory(prev => {
                    const filtered = prev.filter(item => item.label !== searchInput.label);
                    return [{label: searchInput.label!, lat: searchInput.lat, lon: searchInput.lon}, ...filtered].slice(0, 5);
                });
            }
        }
    }

    const handleUseCurrentLocation = () => {
        if (!geo.pos) {
            if (geo.error) {
                alert(texts.locationError);
            }
            return;
        }

        setManualReverseGeocodeCoords({ lat: geo.pos.lat, lon: geo.pos.lon });
        setQuery("");
    };

    return (
        <AppShell
            suggestions={geocode.data as any}
            onSearch={onSearch}
            onQueryChange={setQuery}
            onUseCurrentLocation={handleUseCurrentLocation}
            searchHistory={history}
        >
            <div className="space-y-4">
                {geo.pos && !loc && autoReverseGeocode.loading && <Loader />}
                {manualReverseGeocode.loading && <Loader />}
                {!geo.pos && !loc && <EmptyState message={texts.chooseCity} />}

                {weather.current.loading && <Loader />}
                {weather.current.error && <ErrorState message={weather.current.error} />}


                {weather.current.data && loc && (
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 max-w-7xl mx-auto w-full">
                        <div className="lg:col-span-3">
                            <CurrentLocationCard
                                key={`${loc.lat}-${loc.lon}`}
                                location={loc.label ?? "—"}
                                timezoneOffset={weather.current.data?.timezone ?? 0}
                            />
                        </div>
                        <div className="lg:col-span-7">
                            <CurrentWeatherCard
                                data={weather.current.data}
                                locationLabel={loc.label}
                                aqiData={weather.aqi.data}
                            />
                        </div>
                        <div className="lg:col-span-4">
                            <ForecastList forecast={weather.forecast.data} units={units} />
                        </div>
                        <div className="lg:col-span-6">
                            <HourlyForecast forecast={weather.forecast.data} units={units} />
                        </div>
                    </div>
                )}


            </div>
        </AppShell>
    );
}