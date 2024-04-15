const stepform = formElement => {
    const form = document.querySelector(formElement);
    form.setAttribute('noValidate', true);

    const formSections = Array.from(form.querySelectorAll(".stepContainer"));
    let formData={};

    const validationOptions = [

        // {
        //     attribute: "disableNonAlphabetic",
        //     isValid: input => {
        //         const keyCode = event.keyCode || event.which;
        //         if (keyCode === 8 || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     },
        //     errorMessage: () => "Only alphabetic characters are allowed",
        // },


        //check if a field is required
        {
            attribute: "required",
            isValid: input => input.value.trim() !== "",
            errorMessage: (input, label) => `**${label.textContent} is required`,
        },

        //validation based on pattern
        {
            attribute: "pattern",
            isValid: input => {
                const patternRegex = new RegExp(input.pattern);
                return patternRegex.test(input.value)
            },
            errorMessage: (input, lable) => {
                if (lable.textContent == "Password") {
                    return `**Password must have atleast one uppercase,one lowercase,one special and one number`;
                }
                else {
                    return `**${lable.textContent} is invalid`;
                }
            }
        },


        // validation for if two fields should match
        {
            attribute: "match",
            isValid: input => {
                const matchSelector = input.getAttribute("match");
                const matchedElement = form.querySelector(`#${matchSelector}`);
                return matchedElement && matchedElement.value.trim() === input.value.trim();
            },
            errorMessage: (input, label) => {
                const matchSelector = input.getAttribute("match");
                const matchedElement = form.querySelector(`#${matchSelector}`);
                return `**${matchSelector} is not matched`
            },
        },
        //custom validation and error message for minimum length
        {
            attribute: "minlength",
            isValid: input => input.value && input.value.length >= parseInt(input.minLength, 10),
            errorMessage: (input, label) => `**${label.textContent} needs to be atleast ${input.minLength} chacaters.`,
        },

        //custom validation and error message for maximum length
        {
            attribute: "customMaxlength",
            isValid: input => input.value && input.value.length <= parseInt(input.getAttribute("customMaxlength"), 10),
            errorMessage: (input, label) => `**${label.textContent} can not exceed ${input.getAttribute("customMaxlength")} chacaters.`,

        },
    ];

    const validateSingleField = (input, label, error) => {
        let isError = false;
        for (const option of validationOptions) {
            if (input.hasAttribute(option.attribute) && !(option.isValid(input, label))) {
                console.log(input.value);
                error.innerText = option.errorMessage(input, label);
                input.classList.add("border-red-700");
                input.classList.add("shake-animation");
                input.classList.remove("border-green-700");
                isError = true;
                break;
            }
        }
        if (!isError) {
            error.textContent = "";
            input.classList.add("border-green-700");
            input.classList.remove("border-red-700");
            input.classList.remove("shake-animation");
        }
        return !isError;
    };

    const singleFormGroupToValidate = formGroup => {
        const label = formGroup.querySelector("label");
        const input = formGroup.querySelector("input");
        const error = formGroup.querySelector(".error");
        input.addEventListener("keyup", () => {
            validateSingleField(input, label, error);
        });
    };

    const sectionToValidate = section => {
        const formGroups = Array.from(section.querySelectorAll(".form-group"));
        formGroups.forEach(singleGroup => singleFormGroupToValidate(singleGroup));
    };

    const isSectionValid = section => {
        const formGroups = section.querySelectorAll('.form-group');
        let isValid = true;
        formGroups.forEach(formGroup => {
            const input = formGroup.querySelector('input');
            const label = formGroup.querySelector('label');
            const error = formGroup.querySelector('.error');
            if (!validateSingleField(input, label, error)) {
                isValid = false;
            }
        });
        return isValid;
    };

    formSections.forEach(section => {
        const nextBtn = section.querySelector(".next");
        const prevBtn = section.querySelector(".prev");
        const saveBtn = section.querySelector(".save");
        sectionToValidate(section)

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const currentSection = section;
                if (isSectionValid(currentSection)) {
                    currentSection.classList.remove("activeContainer");
                    const nextStepNumber = parseInt(currentSection.getAttribute('step')) + 1;
                    const nextStep = form.querySelector(`.stepContainer[step="${nextStepNumber}"]`);
                    nextStep.classList.add('activeContainer');
                    nextStep.classList.add("fadeContainer")
                    const sectiondata=Array.from(currentSection.querySelectorAll('input'));
                    // console.log(sectiondata);
                    // const formData = {};
                    sectiondata.forEach(field => {
                        if (field.hasAttribute('name')) {
                            formData[field.name] = field.value;
                        }
                    });
                    localStorage.setItem("stepFormData", JSON.stringify(formData));

                    
                } else {
                    // const errorMessage = section.querySelector(".error");
                    // errorMessage.textContent = "Please fill in all required fields and correct any errors.";
                }

            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const currentSection = section;
                currentSection.classList.remove("activeContainer");
                const prevStepNumber = parseInt(currentSection.getAttribute('step')) - 1;
                const prevStep = form.querySelector(`.stepContainer[step="${prevStepNumber}"]`);
                prevStep.classList.add('activeContainer');
                prevStep.classList.add("fadeContainer")

            });
        }

        if (saveBtn) {
            const currentSection = section;
            const myform = document.getElementById("myForm");
            saveBtn.addEventListener('click', (e) => {
                if (isSectionValid(currentSection)) {
                    // console.log(myform)    
                    const allFields = Array.from(myform.querySelectorAll('input'));
                    // const formData = {};
                    allFields.forEach(field => {
                        if (field.hasAttribute('name')) {
                            formData[field.name] = field.value;
                        }
                    });
                    localStorage.setItem("stepFormData", JSON.stringify(formData));
                    myform.submit();
                    myform.reset();
                    window.location.href = "display.html";         
                }

            });
        }
    });
};

stepform('#myForm');
