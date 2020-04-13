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

        console.log(`${email} is email and ${password} is password.`)

        /* Swal.fire({
            title: "Success",
            text: "Registration successful, redirecting...",
            icon: "success",
            confirmButtonText: 'Ok'
        }) */

        swal('Success', 'Register successful redirecting...', 'success')

        form.submit()
    })
}



