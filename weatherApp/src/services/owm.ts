const KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE = "https://api.openweathermap.org";

export const geocodeUrl = (city: string, lang: string) =>
    `${BASE}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${KEY}&lang=${lang}`;

export const reverseGeocodeUrl = (lat: number, lon: number, lang: string) =>
    `${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${KEY}&lang=${lang}`;

export const currentUrl = (lat: number, lon: number, units = "metric", lang = "ru") =>
    `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${KEY}`;

export const forecastUrl = (lat: number, lon: number, units = "metric", lang = "ru") =>
    `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${KEY}`;

export const airPollutionUrl = (lat: number, lon: number) =>
    `${BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${KEY}`;
