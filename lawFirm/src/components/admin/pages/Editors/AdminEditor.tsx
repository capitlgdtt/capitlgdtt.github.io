import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import { getAdminById, createAdmin, updateAdmin } from '../../../../services/adminService';
import {useTheme} from "../../../../hooks/useTheme.ts";

const AdminEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useI18n();

    const isEditing = !!id;
    const adminId = id ? parseInt(id) : undefined;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'editor' as 'superadmin' | 'admin' | 'editor'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Загрузка данных при редактировании
    useEffect(() => {
        if (isEditing && adminId) {
            const admin = getAdminById(adminId);
            if (admin) {
                setFormData({
                    username: admin.username,
                    email: admin.email,
                    password: '',
                    confirmPassword: '',
                    role: admin.role
                });
            }
        }
    }, [isEditing, adminId]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = t('admin.admins.form.errors.required');
        } else if (formData.username.length < 3) {
            newErrors.username = t('admin.admins.form.errors.minLength', { length: 3 });
        }

        if (!formData.email.trim()) {
            newErrors.email = t('admin.admins.form.errors.required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('admin.admins.form.errors.email');
        }

        if (!isEditing) {
            if (!formData.password) {
                newErrors.password = t('admin.admins.form.errors.required');
            } else if (formData.password.length < 6) {
                newErrors.password = t('admin.admins.form.errors.minLength', { length: 6 });
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = t('admin.admins.form.errors.passwordsMatch');
            }
        } else {
            // При редактировании пароль не обязателен
            if (formData.password && formData.password.length < 6) {
                newErrors.password = t('admin.admins.form.errors.minLength', { length: 6 });
            }

            if (formData.password && formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = t('admin.admins.form.errors.passwordsMatch');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        try {
            if (isEditing && adminId) {
                // Обновление - если пароль пустой, не меняем его
                const updateData: any = {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role
                };

                if (formData.password) {
                    updateData.passwordHash = formData.password; // В реальном приложении хэшировать
                }

                updateAdmin(adminId, updateData);
            } else {
                // Создание
                createAdmin(formData);
            }

            navigate('/admin/admins');
        } catch (error: any) {
            alert(error.message || t('admin.admins.form.errors.saveError'));
        }
    };

    const handleCancel = () => {
        navigate('/admin/admins');
    };

    const { theme } = useTheme();

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                padding: "var(--container-padding)",
                paddingTop: "calc(var(--header-height) + 2rem)"
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок */}
                <div className="overflow-hidden mb-6">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {isEditing ? t('admin.admins.editAdmin') : t('admin.admins.createAdmin')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    {/* Кнопка возврата */}
                    <button
                        onClick={handleCancel}
                        className="relative inline-flex items-center group py-4"
                    >
                        <img
                            src="/arrow_details.svg"
                            alt="arrow"
                            className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1"
                            style={{
                                filter: "invert(54%) sepia(95%) saturate(1555%) hue-rotate(190deg) brightness(95%) contrast(90%)",
                                transform: 'scaleX(-1)'
                            }}
                        />
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('admin.backToAdmins')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.backToAdmins')}
                            </div>
                        </div>
                    </button>
                </div>

                {/* Форма */}
                <div className="space-y-6 mb-8 max-w-2xl">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.admins.form.username')} *
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                            className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors ${
                                errors.username ? 'border-red-500' : 'border-[var(--text-secondary)]'
                            }`}
                            placeholder={t('admin.admins.form.usernamePlaceholder')}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.admins.form.email')} *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors ${
                                errors.email ? 'border-red-500' : 'border-[var(--text-secondary)]'
                            }`}
                            placeholder="admin@company.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {isEditing ? t('admin.admins.form.passwordOptional') : t('admin.admins.form.password')} *
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors ${
                                errors.password ? 'border-red-500' : 'border-[var(--text-secondary)]'
                            }`}
                            placeholder={isEditing ? t('admin.admins.form.passwordLeaveEmpty') : t('admin.admins.form.passwordPlaceholder')}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            {isEditing
                                ? t('admin.admins.form.passwordHintEdit')
                                : t('admin.admins.form.passwordHintCreate')
                            }
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.admins.form.confirmPassword')} {!isEditing && '*'}
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors ${
                                errors.confirmPassword ? 'border-red-500' : 'border-[var(--text-secondary)]'
                            }`}
                            placeholder={t('admin.admins.form.confirmPasswordPlaceholder')}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.admins.form.role')} *
                        </label>
                        <div className="relative">
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                                className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition appearance-none pr-12 ${
                                    'border-[var(--text-secondary)]'
                                }`}
                                style={{
                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "transparent",
                                    color: "var(--text-primary)"
                                }}
                            >
                                <option
                                    value="editor"
                                    style={{
                                        backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                        color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                    }}
                                >
                                    {t('admin.admins.roles.editor')}
                                </option>
                                <option
                                    value="admin"
                                    style={{
                                        backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                        color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                    }}
                                >
                                    {t('admin.admins.roles.admin')}
                                </option>
                                {!isEditing && (
                                    <option
                                        value="superadmin"
                                        style={{
                                            backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                            color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                        }}
                                    >
                                        {t('admin.admins.roles.superadmin')}
                                    </option>
                                )}
                            </select>
                            <img
                                src="/arrow_down.svg"
                                alt=""
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 z-10"
                                style={{
                                    filter: theme === "dark" ? "invert(0)" : "invert(1) brightness(2)"
                                }}
                            />
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            {t('admin.admins.form.roleHint')}
                        </p>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        className="relative inline-flex items-center group py-4"
                    >
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {isEditing ? t('admin.admins.update') : t('admin.admins.save')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {isEditing ? t('admin.admins.update') : t('admin.admins.save')}
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={handleCancel}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wide font-medium py-4"
                    >
                        {t('admin.admins.cancel')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AdminEditor;