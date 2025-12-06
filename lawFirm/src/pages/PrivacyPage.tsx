import React, { useEffect, useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import DecorativeLine from '../components/common/DecorativeLine.tsx';

const PrivacyPage: React.FC = () => {
    const { t } = useI18n();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const timeout = setTimeout(() => setVisible(true), 200);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden min-h-screen"
            style={{
                padding: "var(--container-padding)",
                paddingTop: "calc(var(--header-height) + 2rem)"
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок */}
                <div className="overflow-hidden mb-8">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('privacy.title')}
                    </h2>
                </div>

                {/* Кнопка назад */}
                <div className="mb-8">
                    <button
                        onClick={() => window.history.back()}
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
                                {t('privacy.back')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('privacy.back')}
                            </div>
                        </div>
                    </button>
                </div>

                {/* Контент */}
                <div className={`prose prose-lg max-w-none text-[var(--text-primary)] transition-opacity duration-1000 ${
                    visible ? 'opacity-100' : 'opacity-0'
                }`}>
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-2xl font-syne font-semibold mb-4 text-[var(--accent)]">
                                {t('privacy.sections.collection.title')}
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {t('privacy.sections.collection.content')}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-syne font-semibold mb-4 text-[var(--accent)]">
                                {t('privacy.sections.use.title')}
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {t('privacy.sections.use.content')}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-syne font-semibold mb-4 text-[var(--accent)]">
                                {t('privacy.sections.protection.title')}
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {t('privacy.sections.protection.content')}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-syne font-semibold mb-4 text-[var(--accent)]">
                                {t('privacy.sections.cookies.title')}
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {t('privacy.sections.cookies.content')}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-syne font-semibold mb-4 text-[var(--accent)]">
                                {t('privacy.sections.rights.title')}
                            </h3>
                            <ul className="list-disc pl-5 space-y-2 text-[var(--text-secondary)]">
                                <li>{t('privacy.sections.rights.items.access')}</li>
                                <li>{t('privacy.sections.rights.items.correction')}</li>
                                <li>{t('privacy.sections.rights.items.deletion')}</li>
                                <li>{t('privacy.sections.rights.items.objection')}</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-2xl font-syne font-semibold mb-4 text-[var(--accent)]">
                                {t('privacy.sections.contact.title')}
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {t('privacy.sections.contact.content')}
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-[var(--bg-secondary)]">
                        <p className="text-sm text-[var(--text-secondary)]">
                            {t('privacy.lastUpdated')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Декоративная линия */}
            <DecorativeLine visible={visible} delay={500} />
        </section>
    );
};

export default PrivacyPage;