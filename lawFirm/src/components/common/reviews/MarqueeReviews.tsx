import React from "react";
import { useI18n } from "../../../hooks/useI18n";
import { ReviewCard } from "./ReviewCard";
import type { Review } from "../../../types";

interface MarqueeReviewsProps {
    reviews: Review[];
    className?: string;
}

export const MarqueeReviews: React.FC<MarqueeReviewsProps> = ({ reviews, className = "" }) => {
    const { currentLanguage } = useI18n();

    if (reviews.length === 0) return null;

    return (
        <div className={`flex overflow-x-auto gap-6 md:gap-8 py-4 ${className}`}>
            {reviews.map((review, index) => (
                <div key={`${review.id}-${index}`} className="flex-shrink-0 w-80">
                    <ReviewCard review={review} language={currentLanguage} />
                </div>
            ))}
        </div>
    );
};