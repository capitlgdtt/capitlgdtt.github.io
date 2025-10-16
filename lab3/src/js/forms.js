try {
    const validatorFooter = new JustValidate(".footer__form");

    validatorFooter
        .addField(
            "#footer-email", [
                {
                    rule: "required",
                    errorMessage: "E-mail is required",
                },
                {
                    rule: "email",
                    errorMessage: "Enter a valid e-mail",
                },
            ], {
                errorsContainer: document.querySelector(".email-error-message"),
            })
        .addField(
            "#footer-terms", [
                {
                    rule: "required",
                    errorMessage: "You must agree to the terms",
                },
            ], {
                errorsContainer: document.querySelector(".check-error-message"),
            })
        .onSuccess((event) => {
            const form = event.currentTarget;
            const formData = new FormData(form);

            fetch("https://httpbin.org/post", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Success:", data);
                    form.reset();
                })
                .catch((err) => console.error("Error:", err));
        });
} catch (e) {
}


try {
    const contactValidator = new JustValidate('.contact-form');

    contactValidator
        .addField('#name', [
            {
                rule: 'required',
                errorMessage: 'Name is required',
            },
            {
                rule: 'minLength',
                value: 2,
                errorMessage: 'Name must be at least 2 characters',
            },
        ], {
            errorsContainer: document.querySelector('.name-error'),
        })
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: 'Email is required',
            },
            {
                rule: 'email',
                errorMessage: 'Enter a valid email address',
            },
        ], {
            errorsContainer: document.querySelector('.email-error'),
        })
        .addField('#question', [
            {
                validator: (value) => {
                    if (!value.trim()) return true;

                    return value.trim().length >= 10;
                },
                errorMessage: 'Your question must be at least 10 characters long',
            },
        ], {
            errorsContainer: document.querySelector('.question-error'),
        })
        .addField('#terms', [
            {
                rule: 'required',
                errorMessage: 'You must agree to the terms',
            },
        ], {
            errorsContainer: document.querySelector('.terms-error'),
        })
        .onSuccess((event) => {
            const form = event.currentTarget;
            const formData = new FormData(form);

            fetch('https://httpbin.org/post', {
                method: 'POST',
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('Form sent successfully:', data);
                    form.reset();
                })
                .catch((err) => console.error('Error:', err));
        });
} catch (e) {
    console.error(e);
}
