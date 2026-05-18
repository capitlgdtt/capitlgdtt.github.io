import { useEffect, useState } from "react";

export default function useGeolocation() {
    const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            p => {
                setPos({ lat: p.coords.latitude, lon: p.coords.longitude });
                setLoading(false);
            },
            e => {
                setError(e.message);
                setLoading(false);
            }
        );
    }, []);

    return { pos, error, loading };
}
