import React, { useEffect, useState } from "react";
import styles from "./CurrentLocationCard.module.scss";
import useI18n from "../../hooks/useI18n";

interface CurrentLocationCardProps {
    location: string;
    timezoneOffset?: number;
}

export default function CurrentLocationCard({ location, timezoneOffset = 0 }: CurrentLocationCardProps) {
    const [time, setTime] = useState(new Date());
    const { texts } = useI18n();

    useEffect(() => {
        const timer = setInterval(() => {
            const utcTime = Date.now() + (new Date()).getTimezoneOffset() * 60000;
            const cityTime = new Date(utcTime + timezoneOffset * 1000);
            setTime(cityTime);
        }, 1000);
        return () => clearInterval(timer);
    }, [timezoneOffset]);

    const day = texts.days[time.getDay()];
    const date = time.getDate();
    const monthKey = time.toLocaleString("en-US", { month: "long" }).toLowerCase();
    const month = texts.months[monthKey as keyof typeof texts.months];

    const formattedTime = time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    return (
        <div className={styles.currentLocationCard}>
            <div className={styles.city}>{location}</div>
            <div className={styles.time}>{formattedTime}</div>
            <div className={styles.date}>
                {day}, {month} {date}
            </div>
        </div>
    );
}