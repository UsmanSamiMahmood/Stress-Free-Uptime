window.onload=function(){
    const form = document.querySelector("#register-form")

    form.addEventListener('submit', evt => {
        evt.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let passwordConfirm = this.document.getElementById("passwordconfirm").value;

        $.ajax({
            method: "POST",
            url: "/register",
            data: {
                email: email,
                password: password,
                passwordconfirm: passwordConfirm,
            },
                success: function(body) {
                    var json = JSON.parse(body);
                    swal(json.title, json.message, json.type);
                    if (json.success) {
                        setTimeout(() => {
                            location.replace("/login")
                        }, 3000);
                    }
                },

                error: function(body) {
                    swal("Error Occured", "Failed to connect to back-end server.", "error")
                }
        })
    }) 
}