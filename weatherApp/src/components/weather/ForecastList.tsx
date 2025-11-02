import React from "react";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import styles from "./ForecastList.module.scss";
import useI18n from "../../hooks/useI18n";

function aggregateByDay(forecast: any) {
    if (!forecast?.list) return [];
    const days: Record<string, any[]> = {};
    for (const item of forecast.list) {
        const d = new Date(item.dt * 1000);
        const key = d.toISOString().slice(0, 10);
        days[key] = days[key] || [];
        days[key].push(item);
    }
    return Object.entries(days).slice(0, 5).map(([day, items]) => {
        const temps = items.map((i: any) => i.main.temp);
        const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
        return { day, avg, items };
    });
}

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function ForecastList({ forecast, units }: { forecast: any; units: "metric" | "imperial" }) {
    const days = aggregateByDay(forecast);
    const { lang, texts } = useI18n();

    const locale = lang === "ru" ? ru : enUS;

    if (!days.length) return null;

    return (
        <div className={styles.forecastCard}>
            <h2 className={styles.title}>{texts.forecastTitle}</h2>
            <div className={styles.list}>
                {days.map(d => {
                    const icon = d.items[0].weather[0].icon;
                    const dayName = capitalizeFirstLetter(format(new Date(d.day), "EEEE", { locale }));                    const dayNum = format(new Date(d.day), "d MMM", { locale });
                    const temp = Math.round(d.avg);
                    const unitSign = units === "metric" ? "°C" : "°F";
                    return (
                        <div key={d.day} className={styles.row}>
                            <img
                                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                                alt="weather icon"
                                className={styles.icon}
                            />
                            <div className={styles.temp}>{temp}{unitSign}</div>
                            <div className={styles.date}>{dayName}, {dayNum}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}