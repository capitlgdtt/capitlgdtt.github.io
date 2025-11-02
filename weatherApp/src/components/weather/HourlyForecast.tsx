import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import styles from "./HourlyForecast.module.scss";
import useI18n from "../../hooks/useI18n";

export default function HourlyForecast({ forecast, units }: { forecast: any; units: "metric" | "imperial" }) {
    if (!forecast?.list) return null;

    const [isMobile, setIsMobile] = useState(false);
    const { texts } = useI18n();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 600);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const hourlyData = forecast.list.slice(0, isMobile ? 6 : 5);

    const getCardGradient = (hour: number) => {
        const isDay = hour >= 6 && hour < 21;
        return isDay
            ? "linear-gradient(180deg, #F88508 -15%, #F6FAD9 150%)"
            : "linear-gradient(180deg, #443D64 -15%, #6582C6 150%)";
    };

    const getWindUnit = () => units === "metric" ? "m/s" : "mph";

    return (
        <div className={styles.hourlyCard}>
            <h2 className={styles.title}>{texts.hourlyForecast}</h2>
            <div className={styles.cardsContainer}>
                {hourlyData.map((item: any, index: number) => {
                    const time = new Date(item.dt * 1000);
                    const hour = time.getHours();
                    const formattedTime = format(time, "HH:mm");
                    const temp = Math.round(item.main.temp);
                    const windSpeed = Math.round(item.wind.speed);
                    const windDeg = item.wind.deg;
                    const weatherIcon = item.weather[0].icon;

                    return (
                        <div
                            key={index}
                            className={styles.forecastItem}
                            style={{ background: getCardGradient(hour) }}
                        >
                            <div className={styles.time}>{formattedTime}</div>
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                                alt="weather"
                                className={styles.weatherIcon}
                            />
                            <div className={styles.temp}>{temp}°{units === "metric" ? "C" : "F"}</div>
                            <div className={styles.wind}>
                                <img
                                    src={"../src/assets/navigation.png"}
                                    alt="wind"
                                    className={styles.windIcon}
                                    style={{ transform: `rotate(${windDeg}deg)` }}
                                />
                                <span className={styles.windSpeed}>{windSpeed} {getWindUnit()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}