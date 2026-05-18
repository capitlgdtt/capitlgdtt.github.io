import React from "react";
import useUnits from "../../hooks/useUnits";

export function UnitsToggle() {
    const { units, setUnits } = useUnits();
    return (
        <div className="flex items-center gap-2">
            <button onClick={() => setUnits("metric")} className={`px-2 py-1 rounded ${units==="metric" ? "bg-blue-600 text-white" : "border"}`}>°C</button>
            <button onClick={() => setUnits("imperial")} className={`px-2 py-1 rounded ${units==="imperial" ? "bg-blue-600 text-white" : "border"}`}>°F</button>
        </div>
    );
}
