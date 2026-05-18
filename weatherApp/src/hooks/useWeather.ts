import useFetchJson from "./useFetchJson";
import { currentUrl, forecastUrl, airPollutionUrl } from "../services/owm";
import useI18n from "./useI18n";

export default function useWeather(lat: number | null, lon: number | null, units = "metric") {
    const { lang } = useI18n();

    const cur = useFetchJson(lat && lon ? currentUrl(lat, lon, units, lang) : null, [lat, lon, units, lang]);
    const forecast = useFetchJson(lat && lon ? forecastUrl(lat, lon, units, lang) : null, [lat, lon, units, lang]);
    const aqi = useFetchJson(lat && lon ? airPollutionUrl(lat, lon) : null, [lat, lon]);

    return {
        current: cur,
        forecast,
        aqi
    };
}