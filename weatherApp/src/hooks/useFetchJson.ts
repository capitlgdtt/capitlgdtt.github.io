import { useEffect, useState } from "react";

type State<T> = { data: T | null; loading: boolean; error: string | null };

export default function useFetchJson<T = any>(url: string | null, deps: any[] = []) {
    const [state, setState] = useState<State<T>>({ data: null, loading: false, error: null });

    useEffect(() => {
        if (!url) {
            setState({ data: null, loading: false, error: null });
            return;
        }
        let canceled = false;
        setState(s => ({ ...s, loading: true, error: null }));
        fetch(url)
            .then(async res => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then(data => {
                if (!canceled) setState({ data, loading: false, error: null });
            })
            .catch(err => {
                if (!canceled) setState({ data: null, loading: false, error: err.message || "Error" });
            });
        return () => {
            canceled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, ...deps]);

    return state;
}
