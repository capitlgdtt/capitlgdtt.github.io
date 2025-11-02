import React from "react";

export default function SearchSuggestions({
                                              items,
                                              onPick
                                          }: {
    items: Array<{ name: string; displayName?: string; country?: string; state?: string; lat: number; lon: number }>;
    onPick: (lat: number, lon: number, label?: string) => void;
}) {
    if (!items?.length) return null;

    return (
        <ul
            className="rounded-2xl shadow-xl border overflow-hidden"
            style={{
                backgroundColor: "var(--card-bg, #fff)",
                borderColor: "var(--text-secondary, #e5e5e5)"
            }}
        >
            {items.map((it, i) => {
                const displayName = it.displayName || it.name;
                const locationLabel = [displayName, it.state, it.country].filter(Boolean).join(", ");
                return (
                    <li
                        key={i}
                        className="p-4 hover:bg-gray-400 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b last:border-b-0"
                        style={{ borderColor: "var(--text-secondary, #e5e5e5)" }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onPick(it.lat, it.lon, locationLabel);
                        }}
                    >
                        <div className="font-medium" style={{ color: "var(--text-primary, #292929)" }}>
                            {displayName}
                        </div>
                        <div className="text-sm" style={{ color: "var(--text-secondary, #666)" }}>
                            {[it.state, it.country].filter(Boolean).join(", ")}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}