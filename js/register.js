const database = firebase.database()

window.onload=function(){
     /* db.collection("data").doc("permissionCheck").get().then(doc => {
        this.console.log(doc.data())
    }) */

    const form = document.querySelector("#register-form")

    form.addEventListener('submit', evt => {
        evt.preventDefault();

        userId = "test"
        /* var firebaseRef = firebase.database().ref();
        firebaseRef.child("Text").set("Test") */
        database.ref("/users/" + userId).set({
            firstname: "hello"
        })

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let passwordConfirm = this.document.getElementById("passwordconfirm").value;

        if (password === passwordConfirm) {
            swal('Success', 'Register successful redirecting...', 'success')
        } else {
            swal("Error", "Passwords are not matching!", "error")
        }

        form.submit()
    }) 
}