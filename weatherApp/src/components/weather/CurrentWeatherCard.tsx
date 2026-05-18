import React, { useEffect, useState } from "react";
import styles from "./CurrentWeatherCard.module.scss";
import useUnits from "../../hooks/useUnits";
import useI18n from "../../hooks/useI18n";

export default function CurrentWeatherCard({ data, locationLabel, aqiData }: { data: any; locationLabel?: string; aqiData?: any }) {
    if (!data) return null;

    const { units } = useUnits();
    const { texts } = useI18n();
    const [theme, setTheme] = useState(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const imgPath = (name: string) => `../assets/${theme}/${name}.png`;

    const temp = Math.round(data.main?.temp);
    const feels = Math.round(data.main?.feels_like);
    const desc = data.weather?.[0]?.description;
    const sunrise = new Date(data.sys?.sunrise * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    const sunset = new Date(data.sys?.sunset * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    const humidity = data.main?.humidity;
    const wind = data.wind?.speed;
    const pressure = data.main?.pressure;

    const aqiValue = aqiData?.list?.[0]?.main?.aqi;
    const aqiText = texts[aqiValue === 1 ? 'good' :
        aqiValue === 2 ? 'moderate' :
            aqiValue === 3 ? 'unhealthySensitive' :
                aqiValue === 4 ? 'unhealthy' :
                    aqiValue === 5 ? 'veryUnhealthy' : 'noData'];

    const getWindUnit = (): string => {
        return units === "imperial" ? "mph" : "m/s";
    };

    return (
        <div className={styles.card}>
            {/* Блок 1: Температура и солнце */}
            <div className={styles.temperatureBlock}>
                <div className={styles.degrees}>
                    {temp}°{units === "metric" ? "C" : "F"}
                </div>
                <div className={styles.feels}>
                    {texts.feelsLike} <span>{feels}°{units === "metric" ? "C" : "F"}</span>
                </div>
                <div className={styles.sunTimes}>
                    <div className={styles.sunBlock}>
                        <img src={imgPath("sunrise-white")} alt={texts.sunrise} />
                        <div className={styles.sunText}>
                            <div className={styles.sunLabel}>{texts.sunrise}</div>
                            <div className={styles.sunTime}>{sunrise}</div>
                        </div>
                    </div>
                    <div className={styles.sunBlock}>
                        <img src={imgPath("sunset-white")} alt={texts.sunset} />
                        <div className={styles.sunText}>
                            <div className={styles.sunLabel}>{texts.sunset}</div>
                            <div className={styles.sunTime}>{sunset}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Блок 2: Иконка погоды и описание */}
            <div className={styles.weatherBlock}>
                <img
                    src={`https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@4x.png`}
                    alt={data.weather?.[0]?.description}
                    className={styles.weatherIcon}
                />
                <div className={styles.description}>{desc}</div>
            </div>

            {/* Блок 3: Показатели (2x2 grid) */}
            <div className={styles.metricsBlock}>
                <div className={styles.metricsGrid}>
                    <div className={styles.metricItem}>
                        <img src={imgPath("humidity")} alt={texts.humidity} />
                        <div className={styles.metricValue}>{humidity}%</div>
                        <div className={styles.metricLabel}>{texts.humidity}</div>
                    </div>
                    <div className={styles.metricItem}>
                        <img src={imgPath("wind")} alt={texts.windSpeed} />
                        <div className={styles.metricValue}>{wind} {getWindUnit()}</div>
                        <div className={styles.metricLabel}>{texts.windSpeed}</div>
                    </div>
                    <div className={styles.metricItem}>
                        <img src={imgPath("pressure-white")} alt={texts.pressure} />
                        <div className={styles.metricValue}>{pressure} hPa</div>
                        <div className={styles.metricLabel}>{texts.pressure}</div>
                    </div>
                    <div className={styles.metricItem}>
                        <img src={imgPath("uv-white")} alt={texts.airQuality} />
                        <div className={styles.metricValue}>{aqiText}</div>
                        <div className={styles.metricLabel}>{texts.airQuality}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}