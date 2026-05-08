import React from "react";
import { useI18n } from "../../../hooks/useI18n.ts";
import { Marquee } from "@/registry/magicui/marquee"

interface MarqueeReviewsProps {
    reviews: Review[];
    reverse?: boolean;
    className?: string;
}

export const MarqueeReviews: React.FC<MarqueeReviewsProps> = ({
                                                                  reviews,
                                                                  reverse = false,
                                                                  className = ""
                                                              }) => {
    const { currentLanguage } = useI18n();

    const duplicatedReviews = [...reviews, ...reviews, ...reviews];

    return (
        <Marquee
            pauseOnHover
            reverse={reverse}
            className={`${className} py-4`}
            innerClassName="gap-6 md:gap-8"
        >
            {duplicatedReviews.map((review, index) => (
                <div
                    key={`${review.id}-${index}`}
                    className="mx-2"
                >
                    <ReviewCard
                        review={review}
                        language={currentLanguage}
                    />
                </div>
            ))}
        </Marquee>
    );
};