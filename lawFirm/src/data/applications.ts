import type { Application } from '../types';

export const applications: Application[] = [
    {
        id: 1,
        name: "Иван Иванов",
        email: "ivan@mail.com",
        phone: "+7 (999) 123-45-67",
        service: "Корпоративное право",
        message: "Нужна консультация по регистрации ООО. Хочу открыть бизнес в сфере IT-разработки.",
        createdAt: "2024-01-15 14:30",
        status: "new"
    },
    {
        id: 2,
        name: "Мария Петрова",
        email: "maria@mail.com",
        phone: "+7 (999) 123-45-68",
        service: "Налоговое право",
        message: "Помощь в налоговой оптимизации для ИП. Есть вопросы по УСН и вычетам.",
        createdAt: "2024-01-14 11:20",
        status: "in-progress"
    },
    {
        id: 3,
        name: "Алексей Смирнов",
        email: "alex@mail.com",
        phone: "+7 (999) 123-45-69",
        service: "Семейное право",
        message: "Требуется помощь в составлении брачного договора перед заключением брака.",
        createdAt: "2024-01-13 16:45",
        status: "completed"
    },
    {
        id: 4,
        name: "Екатерина Козлова",
        email: "ekaterina@mail.com",
        phone: "+7 (999) 123-45-70",
        service: "Недвижимость",
        message: "Помощь в проверке документов при покупке квартиры в новостройке.",
        createdAt: "2024-01-12 09:15",
        status: "new"
    },
    {
        id: 5,
        name: "Дмитрий Орлов",
        email: "dmitry@mail.com",
        phone: "+7 (999) 123-45-71",
        service: "Наследственное право",
        message: "Вопросы по оформлению наследства после смерти родственника.",
        createdAt: "2024-01-11 13:30",
        status: "in-progress"
    }
];