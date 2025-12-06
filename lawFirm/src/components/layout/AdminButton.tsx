import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme.ts';

const AdminButton: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleClick = () => {
        navigate('/admin');
    };

    return (
        <button
            onClick={handleClick}
            className="admin-btn w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            title="Admin Panel"
            aria-label="Admin Panel"
        >
            <img
                src="/icons/user.svg"
                alt="Admin"
                className="w-6 h-6"
                style={{
                    filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'none'
                }}
            />
        </button>
    );
};

export default AdminButton;