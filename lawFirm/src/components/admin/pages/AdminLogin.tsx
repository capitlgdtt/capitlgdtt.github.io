import React, { useState } from 'react';
import { useI18n } from "../../../hooks/useI18n.ts";
import { useAdminAuth } from '../../../hooks/useAdminAuth.ts';
import {useNavigate} from "react-router-dom";

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { t } = useI18n();
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError(t('admin.login.errors.required'));
            return;
        }

        const success = login(username, password);

        if (success) {
            setTimeout(() => {
                navigate('/admin');
            }, 100);
        } else {
            setError(t('admin.login.errors.invalid'));
        }
    };

    return (
        <section className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="overflow-hidden mb-8">
                    <h2 className="text-[2.5rem] font-syne uppercase font-semibold leading-tight text-center">
                        {t('admin.login.title')}
                    </h2>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 text-red-500 border border-red-500/30 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 px-6">
                    <div>
                        <input
                            type="text"
                            required
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                            placeholder={t('admin.login.username')}
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError('');
                            }}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                            placeholder={t('admin.login.password')}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[var(--accent)] text-[var(--bg-primary)] py-3 px-4 font-medium hover:opacity-90 transition-opacity"
                    >
                        {t('admin.login.submit')}
                    </button>

                    {/* Подсказка для тестирования */}
                    <div className="text-xs text-[var(--text-secondary)] text-center mt-4 p-3 bg-[var(--bg-secondary)]">
                        <p>Демо доступы:</p>
                        <p>• admin / admin (суперадмин)</p>
                        <p>• manager / manager (админ)</p>
                        <p>• editor / editor (редактор)</p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AdminLogin;