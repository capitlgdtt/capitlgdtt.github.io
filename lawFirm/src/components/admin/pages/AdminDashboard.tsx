import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../hooks/useI18n';

const AdminDashboard: React.FC = () => {
    const { t } = useI18n();

    return (
        <section
            id="admin-dashboard"
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                padding: "var(--container-padding)",
                paddingTop: "calc(var(--header-height) + 2rem)"
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок */}
                <div className="overflow-hidden mb-8">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('admin.dashboard.title')}
                    </h2>
                </div>

                {/* Сетка карточек */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <Link
                        to="/admin/posts"
                        className="p-4! border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors rounded-none"
                    >
                        <h3 className="text-2xl font-syne font-semibold mb-4">{t('admin.dashboard.posts')}</h3>
                        <p className="text-[var(--text-secondary)]">{t('admin.dashboard.postsDesc')}</p>
                    </Link>

                    <Link
                        to="/admin/team"
                        className="p-4! border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors rounded-none"
                    >
                        <h3 className="text-2xl font-syne font-semibold mb-4">{t('admin.dashboard.team')}</h3>
                        <p className="text-[var(--text-secondary)]">{t('admin.dashboard.teamDesc')}</p>
                    </Link>

                    <Link
                        to="/admin/services"
                        className="p-4! border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors rounded-none"
                    >
                        <h3 className="text-2xl font-syne font-semibold mb-4">{t('admin.dashboard.services')}</h3>
                        <p className="text-[var(--text-secondary)]">{t('admin.dashboard.servicesDesc')}</p>
                    </Link>

                    <Link
                        to="/admin/applications"
                        className="p-4! border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors rounded-none"
                    >
                        <h3 className="text-2xl font-syne font-semibold mb-4">{t('admin.dashboard.applications')}</h3>
                        <p className="text-[var(--text-secondary)]">{t('admin.dashboard.applicationsDesc')}</p>
                    </Link>

                    <Link
                        to="/admin/admins"
                        className="p-4! border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors rounded-none"
                    >
                        <h3 className="text-2xl font-syne font-semibold mb-4">{t('admin.dashboard.admins')}</h3>
                        <p className="text-[var(--text-secondary)]">{t('admin.dashboard.adminsDesc')}</p>
                    </Link>

                    <Link
                        to="/admin/stats"
                        className="p-4! border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors rounded-none"
                    >
                        <h3 className="text-2xl font-syne font-semibold mb-4">{t('admin.dashboard.stats')}</h3>
                        <p className="text-[var(--text-secondary)]">{t('admin.dashboard.statsDesc')}</p>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;