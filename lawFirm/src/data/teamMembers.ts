import type {TeamMember} from "../types";

export const teamMembers: TeamMember[] = [
    {
        id: 1,
        translations: {
            en: {
                name: "Phil Morrisson",
                role: "Founder & CEO",
                description: "Expert in corporate law with extensive experience in international business transactions."
            },
            ru: {
                name: "Фил Моррисон",
                role: "Основатель и Генеральный директор",
                description: "Эксперт в области корпоративного права с обширным опытом международных бизнес-транзакций."
            }
        },
        image: "/team/dmitry.jpg",
        email: "phil@company.com",
        phone: "+1 (555) 123-4567",
        experience: "15+ years",
        specialization: ["Corporate Law", "Mergers & Acquisitions", "International Law"]
    },
    {
        id: 2,
        translations: {
            en: {
                name: "Frederik Johansson",
                role: "General Practice Lawyer",
                description: "Specialized in civil litigation and contract disputes with successful case history."
            },
            ru: {
                name: "Фредерик Йоханссон",
                role: "Юрист общей практики",
                description: "Специализируется на гражданских судебных процессах и договорных спорах с успешной историей дел."
            }
        },
        image: "/team/sergei.jpg",
        email: "frederik@company.com",
        phone: "+1 (555) 123-4568",
        experience: "12+ years",
        specialization: ["Civil Law", "Contract Law", "Dispute Resolution"]
    },
    {
        id: 3,
        translations: {
            en: {
                name: "John Wayne",
                role: "General Practice Lawyer",
                description: "Dedicated to providing comprehensive legal solutions for individuals and families."
            },
            ru: {
                name: "Джон Уэйн",
                role: "Юрист общей практики",
                description: "Посвящен предоставлению комплексных юридических решений для частных лиц и семей."
            }
        },
        image: "/team/mikhail.jpg",
        email: "john@company.com",
        phone: "+1 (555) 123-4569",
        experience: "10+ years",
        specialization: ["Criminal Law", "Family Law", "Real Estate"]
    },
    {
        id: 4,
        translations: {
            en: {
                name: "Jane Smith",
                role: "Senior Partner",
                description: "Leading expert in tax optimization and intellectual property protection."
            },
            ru: {
                name: "Джейн Смит",
                role: "Старший партнер",
                description: "Ведущий эксперт в области налоговой оптимизации и защиты интеллектуальной собственности."
            }
        },
        image: "/team/anna.jpg",
        email: "jane@company.com",
        phone: "+1 (555) 123-4570",
        experience: "18+ years",
        specialization: ["Tax Law", "Business Law", "Intellectual Property"]
    },
    {
        id: 5,
        translations: {
            en: {
                name: "Robert Brown",
                role: "Legal Consultant",
                description: "Focused on employment law and corporate compliance strategies."
            },
            ru: {
                name: "Роберт Браун",
                role: "Юридический консультант",
                description: "Сосредоточен на трудовом праве и корпоративных стратегиях соответствия."
            }
        },
        image: "/team/dmitry.jpg",
        email: "robert@company.com",
        phone: "+1 (555) 123-4571",
        experience: "8+ years",
        specialization: ["Employment Law", "Compliance", "Risk Management"]
    },
    {
        id: 6,
        translations: {
            en: {
                name: "Sarah Wilson",
                role: "Associate Lawyer",
                description: "Passionate about immigration law and protecting clients' rights."
            },
            ru: {
                name: "Сара Уилсон",
                role: "Младший юрист",
                description: "Увлечена иммиграционным правом и защитой прав клиентов."
            }
        },
        image: "/team/anna.jpg",
        email: "sarah@company.com",
        phone: "+1 (555) 123-4572",
        experience: "6+ years",
        specialization: ["Immigration Law", "Administrative Law", "Human Rights"]
    }
];