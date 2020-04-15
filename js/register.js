window.onload=function(){
    const form = document.querySelector("#register-form");

    form.addEventListener('submit', evt => {
        evt.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let passwordConfirm = document.getElementById("passwordconfirm").value;
        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;

        $.ajax({
            method: "POST",
            url: "/register",
            data: {
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                passwordConfirm: passwordConfirm
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