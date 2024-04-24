const stepform = formElement => { 
    let disableArray=[];
    const form = document.querySelector(formElement);
    form.setAttribute('noValidate', true);

    const formSections = Array.from(form.querySelectorAll(".stepContainer"));
    // console.log(formSections);
    let formData={};

    const validationOptions = [
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
        const nextBtn=input.parentElement.parentElement.querySelector(".next");
        for (const option of validationOptions) {
            if (input.hasAttribute(option.attribute) && !(option.isValid(input, label))) {
                error.innerText = option.errorMessage(input, label);
                input.classList.add("border-red-700");
                input.classList.add("shake-animation");
                input.classList.remove("border-green-700");
                if(nextBtn){
                nextBtn.classList.add("notAllowed");
                nextBtn.disabled = true;
                }
                isError = true;
                disableArray.push(false);
                break;
            }
        }
        if (!isError) {
            error.textContent = "";
            input.classList.add("border-green-700");
            input.classList.remove("border-red-700");
            input.classList.remove("shake-animation");
            if(nextBtn){
            nextBtn.classList.remove("notAllowed");
            nextBtn.disabled = false;

            disableArray.push(true);
            }
        }
        return !isError;
    };

   

    const singleFormGroupToValidate = formGroup => {

        const isDisables=Array.from(formGroup.parentElement.querySelectorAll('span'));
        const nextBtn=formGroup.parentElement.querySelector('.next');
        const saveBtn=formGroup.parentElement.querySelector('.next');
        const label = formGroup.querySelector("label");
        const input = formGroup.querySelector("input");
        const error = formGroup.querySelector(".error");
        
        input.addEventListener("input", () => {
            validateSingleField(input, label, error);
            isDisables.some((errorr)=>{
                if(!errorr.innerText==""){
                nextBtn.disabled=true;
                nextBtn.classList.add("notAllowed");
                }
            })

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
                    nextStep.classList.add("fadeContainer");
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
                    nextBtn.classList.add("notAllowed")
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
            const loader=document.querySelector(".loader");
            saveBtn.addEventListener('click', (e) => {
                if (isSectionValid(currentSection)) {
                const allFields = Array.from(myform.querySelectorAll('input'));
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

function disableNameFeild(e){
    const key = e.key.toLowerCase();
    if (!(key >= 'a' && key <= 'z') && key !== 'backspace') {
        e.preventDefault();
    }
}

function disableOnlyNumberFeild(e){
    if (!(e.key >= '0' && e.key <= '9') && e.key !== 'Backspace') {
        e.preventDefault();
      } 
}

function showPass(e){
    const password=document.getElementById("password");
    password.setAttribute("type","text");
}

function hidePass(e){
    const password=document.getElementById("password");
    password.setAttribute("type","password");
}

 