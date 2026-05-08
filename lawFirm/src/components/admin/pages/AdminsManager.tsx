import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { Link } from 'react-router-dom';
import {
    fetchAdmins,
    deleteAdmin,
    updateAdminStatus,
    fetchAdminsStats, type AdminStats, type Admin
} from '../../../services/adminService';

const AdminsManager: React.FC = () => {
    const { t } = useI18n();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [stats, setStats] = useState<AdminStats>({
        total: 0, active: 0, superadmins: 0, admins: 0, editors: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const [adminsData, statsData] = await Promise.all([
                fetchAdmins(),
                fetchAdminsStats()
            ]);
            setAdmins(adminsData);
            setStats(statsData);
        } catch (err: any) {
            setError(err.message || 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'superadmin': return 'bg-purple-500';
            case 'admin': return 'bg-blue-500';
            case 'editor': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'superadmin': return t('admin.admins.roles.superadmin');
            case 'admin': return t('admin.admins.roles.admin');
            case 'editor': return t('admin.admins.roles.editor');
            default: return role;
        }
    };

    const handleDeleteAdmin = async (id: number, username: string) => {
        const confirmed = window.confirm(
            `${t('admin.admins.deleteConfirm.message')} "${username}"?`
        );
        if (!confirmed) return;

        try {
            await deleteAdmin(id);
            await loadData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleToggleStatus = async (id: number) => {
        const admin = admins.find(a => a.id === id);
        if (!admin) return;
        try {
            await updateAdminStatus(id, !admin.isActive);
            await loadData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <section className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex items-center justify-center">
                <div>{t('common.loading')}</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </section>
        );
    }

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                padding: "var(--container-padding)",
                paddingTop: "calc(var(--header-height) + 2rem)"
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                <div className="overflow-hidden mb-6">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('admin.admins.title')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    <Link to="/admin" className="relative inline-flex items-center group py-4">
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
                                {t('admin.backToDashboard')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.backToDashboard')}
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/admins/create" className="relative inline-flex items-center group py-4">
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('admin.admins.add')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.admins.add')}
                            </div>
                        </div>
                        <img
                            src="/add.svg"
                            alt="add"
                            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                                filter: "invert(54%) sepia(95%) saturate(1555%) hue-rotate(190deg) brightness(95%) contrast(90%)"
                            }}
                        />
                    </Link>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-[var(--bg-secondary)] p-4 text-center">
                        <div className="text-2xl font-bold text-[var(--accent)]">{stats.total}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{t('admin.admins.stats.total')}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-4 text-center">
                        <div className="text-2xl font-bold text-purple-500">{stats.superadmins}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{t('admin.admins.stats.superadmins')}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-4 text-center">
                        <div className="text-2xl font-bold text-blue-500">{stats.admins}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{t('admin.admins.stats.admins')}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-4 text-center">
                        <div className="text-2xl font-bold text-green-500">{stats.editors}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{t('admin.admins.stats.editors')}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-4 text-center">
                        <div className="text-2xl font-bold text-[var(--accent)]">{stats.active}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{t('admin.admins.stats.active')}</div>
                    </div>
                </div>

                {/* Список администраторов */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {admins.map((admin) => (
                        <div
                            key={admin.id}
                            className="p-6 border border-[var(--bg-secondary)] transition-all duration-300 hover:border-[var(--accent)] flex flex-col justify-between h-full"
                        >
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-syne font-semibold">{admin.username}</h3>
                                        {!admin.isActive && (
                                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                                                {t('admin.admins.inactive')}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-white text-sm ${getRoleColor(admin.role)}`}>
                                        {getRoleText(admin.role)}
                                    </span>
                                </div>
                                <div className="space-y-2 text-[var(--text-secondary)]">
                                    <div><strong>{t('admin.admins.email')}:</strong> {admin.email}</div>
                                    <div><strong>{t('admin.admins.created')}:</strong> {admin.createdAt}</div>
                                    <div><strong>{t('admin.admins.lastLogin')}:</strong> {admin.lastLogin || t('admin.admins.neverLoggedIn')}</div>
                                    <div><strong>{t('admin.admins.status')}:</strong>
                                        <span className={admin.isActive ? 'text-green-500 ml-2' : 'text-red-500 ml-2'}>
                                            {admin.isActive ? t('admin.admins.active') : t('admin.admins.inactive')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 mt-6 pt-4 border-t border-[var(--bg-secondary)]">
                                <Link
                                    to={`/admin/admins/edit/${admin.id}`}
                                    className="relative inline-flex items-center group/btn py-2"
                                >
                                    <div className="relative overflow-hidden">
                                        <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:-translate-y-full">
                                            {t('admin.admins.edit')}
                                        </div>
                                        <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:translate-y-[-100%]">
                                            {t('admin.admins.edit')}
                                        </div>
                                    </div>
                                </Link>

                                {admin.role !== 'superadmin' && (
                                    <button
                                        onClick={() => handleToggleStatus(admin.id)}
                                        className={`uppercase tracking-wide font-medium text-sm ${
                                            admin.isActive ? 'text-yellow-500' : 'text-green-500'
                                        } hover:opacity-80 transition-opacity`}
                                    >
                                        {admin.isActive ? t('admin.admins.deactivate') : t('admin.admins.activate')}
                                    </button>
                                )}

                                {admin.role !== 'superadmin' && (
                                    <button
                                        onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                                        className="text-red-500 hover:opacity-80 transition-opacity uppercase tracking-wide font-medium text-sm"
                                    >
                                        {t('admin.admins.delete')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AdminsManager;