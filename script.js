const stepform = formElement => {
    const form = document.querySelector(formElement);
    form.setAttribute('noValidate', true);

    const formSections=Array.from(form.querySelectorAll(".stepContainer"));

    const validationOptions=[    
      
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
        {
            attribute:"pattern",
            isValid:input=>{
                const patternRegex=new RegExp(input.pattern);
                 return patternRegex.test(input.value)
            },
            errorMessage:(input,lable)=>{
                if(lable.textContent=="Password"){
                    return `Password must have atleast one uppercase,one lowercase,one special and one number`;     
                }
                else{
                    return `${lable.textContent} is invalid`;
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
                return `${matchSelector} is not matched`
            },
        },
        //custom validation and error message for minimum length
        {
            attribute:"minlength",
            isValid:input=>input.value && input.value.length>=parseInt(input.minLength,10),
            errorMessage:(input,label)=>`${label.textContent} needs to be atleast ${input.minLength} chacaters.`,
        }, 

        //custom validation and error message for maximum length
        {
            attribute:"customMaxlength",
            isValid:input=>input.value && input.value.length<=parseInt(input.getAttribute("customMaxlength"),10),
            errorMessage:(input,label)=>`${label.textContent} can not exceed ${input.getAttribute("customMaxlength")} chacaters.`,
            
        },
        
        
        {
            attribute: "required",
            isValid: input => input.value.trim() !== "",
            errorMessage: (input, label) => `${label.textContent} is required`,
        },
    ];

    const validateSingleField =(input,label,error)=>{
        // debugger;
                let isError=false;
                for(const option of validationOptions){
                    if(input.hasAttribute(option.attribute) && !(option.isValid(input,label))){
                        error.innerText=option.errorMessage(input,label);
                        console.log(error.innerText);
                        input.classList.add("border-red-700");
                        input.classList.add("shake-animation");
                        input.classList.remove("border-green-700");
                         isError=true;
                         break;
                    }
                }
                    if(!isError){
                        error.textContent="";
                        input.classList.add("border-green-700");
                        input.classList.remove("border-red-700")
                        input.classList.remove("shake-animation");
                    }              
                return !isError;
    }

 
    const singleFormGroupToValidate = formGroup=>{
        const label = formGroup.querySelector("label");
        const input = formGroup.querySelector("input");
        const error = formGroup.querySelector(".error");
        // console.log(formGroup);
 

        input.addEventListener("keyup",()=>{
            const isValid = validateSingleField(input, label, error);
            return isValid;
        })
    }

        const sectionToValidate=section=>{
            const forGroups=Array.from(section.querySelectorAll(".form-group"));
            forGroups.forEach(singleGroup=>singleFormGroupToValidate(singleGroup))
        }

        //new section to validate

        


    // logic for navigation
    formSections.forEach((section)=>{
        const nextBtn=section.querySelector(".next");
        const prevBtn=section.querySelector(".prev");
        const saveBtn=section.querySelector(".save");
sectionToValidate(section)
        if(nextBtn){
        // debugger;
            // if(isSectionValidate)
            if(true)
               {
                nextBtn.addEventListener('click',()=>{
                    section.classList.remove("activeContainer");
                    const nextStepNumber=parseInt(section.getAttribute('step'))+1;
                    const nextStep = form.querySelector(`.stepContainer[step="${nextStepNumber}"]`);
                    nextStep.classList.add('activeContainer');
                    const name=section.querySelector("#firstName");
    
                    console.log(name.value);
                })
               }
        }

        

        if(prevBtn){
                prevBtn.addEventListener('click',()=>{
                section.classList.remove("activeContainer");
                const prevStepNumber=parseInt(section.getAttribute('step'))-1;
                const prevStep = form.querySelector(`.stepContainer[step="${prevStepNumber}"]`);
                prevStep.classList.add('activeContainer');
            })
        }

        if(saveBtn){
            saveBtn.addEventListener('click',()=>{
                const name=form.querySelector("#firstName");

                // console.log(name.value)
                 
            })
            
        }
    })
}

stepform('#myForm');
