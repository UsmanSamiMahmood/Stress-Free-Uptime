window.onload=function(){
     /* db.collection("data").doc("permissionCheck").get().then(doc => {
        this.console.log(doc.data())
    }) */

    const form = document.querySelector("#register-form")

    form.addEventListener('submit', evt => {
        evt.preventDefault();

        /* var firebaseRef = firebase.database().ref();
        firebaseRef.child("Text").set("Test") */

        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let passwordConfirm = this.document.getElementById("passwordconfirm");

        console.log(`${email} is email and ${password} is password.`)
        console.log(password.value, passwordConfirm.value)

        /* Swal.fire({
            title: "Success",
            text: "Registration successful, redirecting...",
            icon: "success",
            confirmButtonText: 'Ok'
        }) */
       // if (password.value === passwordConfirm.value) {
            swal('Success', 'Register successful redirecting...', 'success')
       /* } else {
            swal("Error", "Passwords are not matching!", "error")
        }

        form.submit()
    })
}



