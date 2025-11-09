import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'primary',
                                           size = 'md',
                                           onClick,
                                           type = 'button',
                                           className = '',
                                       }) => {
    const baseStyles = 'font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#64a2ec]';

    const variants = {
        primary: 'bg-[#64a2ec] text-[#212426] hover:bg-blue-400',
        secondary: 'bg-[#212426] text-[#f0f0f0] hover:bg-gray-800',
        outline: 'border border-[#64a2ec] text-[#64a2ec] hover:bg-[#64a2ec] hover:text-[#212426]',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;