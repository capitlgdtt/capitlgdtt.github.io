import React from "react";
import useI18n from "../../hooks/useI18n";

export function Loader() {
    const { texts } = useI18n();
    return <div className="p-6 text-center">{texts.loading}</div>;
}

export function ErrorState({ message }: { message?: string }) {
    const { texts } = useI18n();
    return <div className="p-6 text-center text-red-600">{texts.error} {message || texts.errorDefault}</div>;
}

export function EmptyState({ message }: { message?: string }) {
    const { texts } = useI18n();
    return <div className="p-6 text-center text-gray-500">{message || texts.empty}</div>;
}