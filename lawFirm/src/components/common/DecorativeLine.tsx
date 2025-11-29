import React from "react";

interface DecorativeLineProps {
    visible: boolean;
    color?: string;
    delay?: number;
    className?: string;
    duration?: number;
}

const DecorativeLine: React.FC<DecorativeLineProps> = ({
                                                           visible,
                                                           color = "var(--text-secondary)",
                                                           delay = 1000,
                                                           duration = 1000,
                                                           className = ""
                                                       }) => {
    return (
        <div
            className={`absolute bottom-0 h-[2px] transition-all ${className} ${
                visible ? "w-full scale-x-100" : "w-0 scale-x-0"
            }`}
            style={{
                backgroundColor: color,
                left: "var(--container-padding)",
                width: "calc(100% - 2 * var(--container-padding))",
                transformOrigin: "left center",
                transitionTimingFunction: "ease-out",
                transitionDelay: `${delay}ms`,
                transitionDuration: `${duration}ms`
            }}
        />
    );
};

export default DecorativeLine;