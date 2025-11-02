import useLocalStorage from "./useLocalStorage";

export default function useUnits() {
    const [units, setUnits] = useLocalStorage<"metric"|"imperial">("units", "metric");
    return { units, setUnits };
}
