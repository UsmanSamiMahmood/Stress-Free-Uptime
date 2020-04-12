var db = firebase.firestore();


window.onload=function(){
    db.collection("data").doc("permissionCheck").get().then(doc => {
        this.console.log(doc.data())
    })

    const form = document.querySelector("#register-form")

    form.addEventListener('submit', evt => {
        evt.preventDefault();

        let email = document.getElementById("email");
        let password = document.getElementById("password")
    })
}



