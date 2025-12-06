import { useState, useMemo } from 'react';

export const useFilter = <T>(
    items: T[],
    filters: Record<string, (item: T, value: any) => boolean>,
    defaultFilterValues: Record<string, any>,
    sortFn?: (a: T, b: T) => number
) => {
    const [filterValues, setFilterValues] = useState(defaultFilterValues);

    const filteredItems = useMemo(() => {
        let result = [...items];

        // Применяем фильтры
        Object.entries(filters).forEach(([key, filterFn]) => {
            const filterValue = filterValues[key];
            if (filterValue !== 'all' && filterValue !== '' && filterValue !== null) {
                result = result.filter(item => filterFn(item, filterValue));
            }
        });

        // Сортируем если нужно
        if (sortFn) {
            result.sort(sortFn);
        }

        return result;
    }, [items, filterValues, filters, sortFn]);

    const updateFilter = (key: string, value: any) => {
        setFilterValues(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilterValues(defaultFilterValues);
    };

    return {
        filteredItems,
        filterValues,
        updateFilter,
        resetFilters
    };
};