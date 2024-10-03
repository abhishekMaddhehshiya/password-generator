const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNUmber]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMassage]")
const uppecaseCheak = document.querySelector("#uppercase")
const lowercaseCheak = document.querySelector("#lowercase")
const numberCheak = document.querySelector("#numbers")
const symbolCheak = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheakBoxes = document.querySelectorAll("input[type = checkbox]")

const symbols = '~`@!#$%^&*()_\-+=,"<.>?/;:{[}]|';
let password = "";
let passwordLength = 10;
let countCheakBox = 0;

handleSlider();
//set strength circle color to gray
setIndicator("#ccc");

//set pasword length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = `${passwordLength}`
    const mini = inputSlider.min;
    const maxi = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - mini)*100/(maxi - mini)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()* (max - min) ) + min;

}


function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123))
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91))
}

function generateSymbol(){
    const ranNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(ranNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;

    if(uppecaseCheak.checked) hasUpper = true;
    if(lowercaseCheak.checked) hasLower = true;
    if(numberCheak.checked) hasNum = true;
    if(symbolCheak.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6 ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
    
}

function sufflePassword(array){
    //fisher Yates mehtod
    for(let i = array.length - 1; i > 0; i-- ){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) =>{
        str += el
    })
    return str; 
}

function handleCheakBoxChange(){
    countCheakBox = 0;
    allCheakBoxes.forEach((cheakbox) =>{
        if(cheakbox.checked) {
            countCheakBox++;
        }
    })
    console.log(countCheakBox)
    //special case
    if(passwordLength < countCheakBox){
        passwordLength = countCheakBox;
        handleSlider();
    }
    console.log(countCheakBox);
}

allCheakBoxes.forEach( (cheakbox) => {
    console.log("hello ji");
    cheakbox.addEventListener('change', handleCheakBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', () =>{
    // none of the cheakbox are selected
    if(countCheakBox == 0){
        console.log("here");
        return;
    }
    if(passwordLength < countCheakBox){
        passwordLength = countCheakBox;
        handleSlider();
    }
    console.log("starting the journey ", countCheakBox)
    //lets start
    
    // remove old password
    password = "";

    //let put the char mentioned by cheakboxes
    let funcArr = []
    if(uppecaseCheak.checked) {
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheak.checked){
        funcArr.push(generateLowerCase);
    }
    if(numberCheak.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolCheak.checked){
        funcArr.push(generateSymbol);
    }
    console.log("cheaking done")
    //compulsory addition
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("compulsory addition done")
    //remaining addition
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRandomInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done")
    password = sufflePassword(Array.from(password));

    passwordDisplay.value = password;
    //calculate strength
    calcStrength();
})