import React from "react";

interface ReviewCardProps {
    review: {
        author: string;
        position: string;
        text: string;
        rating: number;
    };
    language: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const renderStars = (rating: number) => (
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <img
                    key={i}
                    src="/star.svg"
                    alt="star"
                    className="w-5 h-5"
                    style={{
                        opacity: i < rating ? 1 : 0.2,
                        filter: "var(--star-filter)"
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="w-64 sm:w-72 md:w-80 p-4 sm:p-6
                       bg-[var(--bg-secondary)] text-[var(--text-primary)]
                       transition-all duration-400 ease-out
                       flex flex-col justify-between h-56 sm:h-60 md:h-64
                       shadow-lg hover:scale-105 hover:shadow-xl
                       cursor-pointer flex-shrink-0
                       border border-white/10 rounded-2xl
                       backdrop-blur-sm">
            <div className="wrapper-icons-testimonial">
                {renderStars(review.rating)}
            </div>

            <p className="text-[var(--text-primary)] mb-4
                         leading-relaxed text-sm line-clamp-4
                         overflow-hidden italic">
                “{review.text}”
            </p>

            <div className="wrapper-infos-testimonial flex flex-col gap-2 mt-auto pt-4">
                <div className="sub-heading font-syne font-semibold
                               text-lg text-[var(--text-secondary)]">
                    {review.author}
                </div>
                <div className="chip bg-[var(--text-secondary)]
                              h-[1px] w-full my-1 opacity-30" />
                <div className="testimonial-job-title
                               text-[var(--text-secondary)] text-xs">
                    {review.position}
                </div>
            </div>
        </div>
    );
};