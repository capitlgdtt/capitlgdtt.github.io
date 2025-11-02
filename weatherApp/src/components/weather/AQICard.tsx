import React from "react";
import useI18n from "../../hooks/useI18n";

export default function AQICard({ aqi }: { aqi: any }) {
    const { texts } = useI18n();

    function mapAqi(aqi: number) {
        if (aqi === 1) return texts.good;
        if (aqi === 2) return texts.moderate;
        if (aqi === 3) return texts.unhealthySensitive;
        if (aqi === 4) return texts.unhealthy;
        if (aqi === 5) return texts.veryUnhealthy;
        return texts.noData;
    }

    const val = aqi?.list?.[0]?.main?.aqi;
    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
            <div className="font-medium">{texts.airQuality}</div>
            <div className="text-2xl">{val ?? "-"}</div>
            <div className="text-sm text-gray-500">{mapAqi(val)}</div>
        </div>
    );
}