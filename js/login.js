window.onload=function(){
    const form = document.querySelector("#login-form")

    form.addEventListener('submit', evt => {
        evt.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        $.ajax({
            method: "POST",
            url: "/login",
            data: {
                email: email,
                password: password,
            },
                success: function(body) {
                    var json = JSON.parse(body);
                    swal(json.title, json.message, json.type);
                    if (json.success) {
                        setTimeout(() => {
                            location.replace("/dashboard")
                        }, 3000);
                    }
                },

                error: function(body) {
                    swal("Error Occured", "Failed to connect to back-end server.", "error")
                }
        })
    }) 
}