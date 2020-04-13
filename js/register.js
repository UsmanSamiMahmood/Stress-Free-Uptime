import { checkMail } from "../database/checkIfEmailRegistered.js"
window.onload=function(){
     /* db.collection("data").doc("permissionCheck").get().then(doc => {
        this.console.log(doc.data())
    }) */

    const form = document.querySelector("#register-form")

    form.addEventListener('submit', evt => {
        evt.preventDefault();

        /* var firebaseRef = firebase.database().ref();
        firebaseRef.child("Text").set("Test") */

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let passwordConfirm = document.getElementById("passwordconfirm").value;

        /* Swal.fire({
            title: "Success",
            text: "Registration successful, redirecting...",
            icon: "success",
            confirmButtonText: 'Ok'
        }) */
        try {
            checkMail(email)
        } catch (res) {
            if(res === "Email exists") {
                swal("Error", "This email is already registered in our database!", "error")
            }
        }
        if (password === passwordConfirm) {
            swal('Success', 'Register successful redirecting...', 'success')
        } else {
            swal("Error", "Passwords are not matching!", "error")
        }

        form.submit()
    })
}



