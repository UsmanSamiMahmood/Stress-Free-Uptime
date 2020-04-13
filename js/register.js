window.onload=function(){
    const form = document.querySelector("#register-form")

    form.addEventListener('submit', evt => {
        evt.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let passwordConfirm = this.document.getElementById("passwordconfirm").value;

        /* if (password === passwordConfirm) {
            swal('Success', 'Register successful redirecting...', 'success')
        } else {
            swal("Error", "Passwords are not matching!", "error")
        } */

        $.ajax({
            method: "POST",
            url: "/register",
            data: {
                email: email,
                password: password
            },
                success: function(body) {
                    var json = JSON.parse(body);
                    swal(json.title, json.message, json.type);
                }
        })

        
    }) 
}