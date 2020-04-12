function temp(){
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    console.log(`${email} is email and ${password} is password.`)
}

document.getElementById("buttonreg").addEventListener("click", temp)