import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import {fetchTeamMembers, deleteTeamMember, type TeamMember} from '../../../services/teamService';
import { Link } from 'react-router-dom';

const TeamManager: React.FC = () => {
    const { t, currentLanguage } = useI18n();
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        setLoading(true);
        try {
            const data = await fetchTeamMembers();
            setTeam(data);
        } catch (err: any) {
            setError(err.message || 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    const getMemberForDisplay = (member: TeamMember) => {
        const lang = currentLanguage as 'en' | 'ru';
        return {
            ...member,
            name: lang === 'en' ? member.name_en : member.name_ru,
            role: lang === 'en' ? member.role_en : member.role_ru,
            description: lang === 'en' ? member.description_en : member.description_ru,
            specialization: member.specialization,
        };
    };

    const handleDeleteMember = async (memberId: number, memberName: string) => {
        const confirmed = window.confirm(
            `${t('admin.team.deleteConfirm.message')} "${memberName}"?`
        );
        if (!confirmed) return;

        try {
            await deleteTeamMember(memberId);
            await loadTeam();
            alert(t('admin.team.deleteConfirm.deleted'));
        } catch (err: any) {
            alert(err.message || 'Ошибка удаления');
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
                        {t('admin.team.title')}
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

                    <Link to="/admin/team/create" className="relative inline-flex items-center group py-4">
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('admin.team.add')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.team.add')}
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

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {team.map((member) => {
                        const displayMember = getMemberForDisplay(member);
                        return (
                            <div
                                key={member.id}
                                className="border border-[var(--bg-secondary)] p-6 transition-all duration-300 hover:border-[var(--accent)] flex flex-col justify-between h-full"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <img
                                            src={member.image}
                                            alt={displayMember.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="text-xl font-syne font-semibold">{displayMember.name}</h3>
                                            <p className="text-[var(--accent)]">{displayMember.role}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                                        <div>{member.email}</div>
                                        <div>{member.phone}</div>
                                        <div>{member.experience}</div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-[var(--text-secondary)] mb-2">{displayMember.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {displayMember.specialization.slice(0, 6).map((spec, idx) => (
                                                <span key={idx} className="text-xs bg-[var(--bg-secondary)] px-2 py-1">
                          {spec}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-6 pt-4 border-t border-[var(--bg-secondary)]">
                                    <Link
                                        to={`/admin/team/edit/${member.id}`}
                                        className="relative inline-flex items-center group/btn py-2"
                                    >
                                        <div className="relative overflow-hidden">
                                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:-translate-y-full">
                                                {t('admin.team.edit')}
                                            </div>
                                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:translate-y-[-100%]">
                                                {t('admin.team.edit')}
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteMember(member.id, displayMember.name)}
                                        className="text-red-500 uppercase tracking-wide font-medium hover:opacity-80 transition-opacity"
                                    >
                                        {t('admin.team.delete')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TeamManager;