
const loginBtn = document.querySelector(".login-form-btn");
const loginEmail = document.querySelector(".login-user-info");
const loginPassword = document.querySelector(".login-password");
const signUpPage = document.querySelector(".signUp-page");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const usernameInput = document.querySelector("#username-input");
const signUpBtn = document.querySelector("#signUp-btn");
const inputElement = document.querySelectorAll("input");




/*============== To display and undisplay SignUp-page ====================*/

document.addEventListener("click", (e) => {

    if (e.target.id == "signUp-now"){

        setTimeout(()=>{
            signUpPage.style.display = "block";
        },500);
        
    }
    else if (e.target.id == "close-btn"){

        setTimeout(()=>{
            signUpPage.style.display = "none";
        },500);
        
    }
    
})


/*======================== To Create New-Account/ On-clicking Sign-Up button =======================================================*/ 


let signUpData = [];

signUpBtn.addEventListener("click", () => {

    if(nameInput.value.length == 0){
        nameInput.style.borderColor = "red";
    }
    if(emailInput.value.length == 0){
        emailInput.style.borderColor = "red";
    }
    if(passwordInput.value.length == 0){
        passwordInput.style.borderColor = "red";
    }
    if(usernameInput.value.length == 0){
        usernameInput.style.borderColor = "red";
    }
    if(!emailInput.value.includes("@") || !emailInput.value.includes(".com")){
        emailInput.style.borderColor = "red";
        alert("Wrong email address!");
    }
    if(nameInput.value.length > 0 &&
       emailInput.value.length > 0 &&
       emailInput.value.includes("@") &&
       emailInput.value.includes(".com") &&
       passwordInput.value.length > 0 &&
       usernameInput.value.length > 0
       ){
        if(localStorage.getItem("twitterSignUpData")){
            let flag = true;
            signUpData = JSON.parse(localStorage.getItem("twitterSignUpData"));
            signUpData.forEach((user) => {
                if(user.email == emailInput.value){
                    alert("User Already Exists with given email address!");
                    emailInput.style.borderColor = "red";
                    flag = false;
                }else if(user.username == usernameInput.value) {
                    alert("Username already taken!");
                    usernameInput.style.borderColor = "red";
                    flag = false;
                }
            });
            if(flag){
                signUpData.push(
                    {
                        name: nameInput.value,
                        email: emailInput.value,
                        password: passwordInput.value,
                        username: usernameInput.value
                    }
                );
                localStorage.setItem("twitterSignUpData", JSON.stringify(signUpData));
                setTimeout(()=>{
                    alert("Account created successfully!");
                    signUpPage.style.display = "none";
                },1000);
                
            }
        }
        else {
            signUpData.push(
                {
                    name: nameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value,
                    username: usernameInput.value
                }
            );
            localStorage.setItem("twitterSignUpData", JSON.stringify(signUpData));
            setTimeout(()=>{
                alert("Account created successfully!");
                signUpPage.style.display = "none";
            },1000);
        }
    }
    
})



/*============== To replace input-border color from red to gray on typing input ====================*/

    inputElement.forEach((input) => {
        input.addEventListener("input", ()=>{
            if(input.value.length > 0){
                input.style.borderColor = "#ddd";
            }
        })
    })

/*=====================================================================================================================*/




/*============================ On-clicking login-btn =======================================================*/

loginBtn.addEventListener("click", () => {

    let wrongEmail = true;

    if (localStorage.getItem("twitterSignUpData")){
        signUpData = JSON.parse(localStorage.getItem("twitterSignUpData"));
        signUpData.forEach((user) => {
            if(user.email == loginEmail.value){
                wrongEmail = false;
                if(user.password == loginPassword.value){
                    setTimeout(()=>{
                        window.location.href = "home.html";
                    },2000);
                    localStorage.setItem("twitterLoginEmail", loginEmail.value);
                }
                else{
                    loginPassword.style.borderColor = "red";
                    alert("Wrong password!");
                }
            }
        })
        if(wrongEmail){
            loginEmail.style.borderColor = "red";
            alert("User doesn't exist!");
        }
    }
    else {
        loginEmail.style.borderColor = "red";
        alert("User doesn't exist!");
    }

})