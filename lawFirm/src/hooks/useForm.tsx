import { useState, useCallback } from 'react';

interface UseFormProps<T> {
    initialValues: T;
    validate?: (values: T) => Partial<Record<keyof T, string>>;
    onSubmit: (values: T) => void | Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
                                                           initialValues,
                                                           validate,
                                                           onSubmit
                                                       }: UseFormProps<T>) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof T;

        setValues(prev => ({ ...prev, [fieldName]: value }));

        // Валидация при изменении только если поле было тронуто
        if (touched[fieldName] && validate) {
            const newErrors = validate({ ...values, [fieldName]: value });

            setErrors(prev => {
                if (newErrors[fieldName]) {
                    return { ...prev, [fieldName]: newErrors[fieldName] };
                } else {
                    const updatedErrors = { ...prev };
                    delete updatedErrors[fieldName];
                    return updatedErrors;
                }
            });
        }
    }, [touched, validate, values]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name } = e.target;
        const fieldName = name as keyof T;

        setTouched(prev => ({ ...prev, [fieldName]: true }));

        if (validate) {
            const newErrors = validate(values);

            setErrors(prev => {
                if (newErrors[fieldName]) {
                    return { ...prev, [fieldName]: newErrors[fieldName] };
                } else {
                    const updatedErrors = { ...prev };
                    delete updatedErrors[fieldName];
                    return updatedErrors;
                }
            });
        }
    }, [validate, values]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Пометить все поля как тронутые
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key as keyof T] = true;
            return acc;
        }, {} as Record<keyof T, boolean>);

        setTouched(allTouched);

        let isValid = true;
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
            isValid = Object.keys(validationErrors).length === 0;
        }

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } finally {
            setIsSubmitting(false);
        }
    }, [onSubmit, validate, values]);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    const setFieldValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
        setValues(prev => ({ ...prev, [name]: value }));
    }, []);

    const setFieldError = useCallback(<K extends keyof T>(name: K, error: string) => {
        setErrors(prev => ({ ...prev, [name]: error }));
    }, []);

    const setFieldTouched = useCallback(<K extends keyof T>(name: K, isTouched: boolean = true) => {
        setTouched(prev => ({ ...prev, [name]: isTouched }));
    }, []);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setValues,
        setFieldValue,
        setFieldError,
        setFieldTouched
    };
};