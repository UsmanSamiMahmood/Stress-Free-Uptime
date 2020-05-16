const userOptions = document.querySelector("#usrOpt");
const settingsButton = document.querySelector(".settingsBtn")

const tl = new TimelineMax();

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

window.onload=function() {
    const form1 = document.querySelector("#myForm")

    form1.addEventListener('submit', evt => {
        evt.preventDefault();

        let pin = document.getElementById("pin").value;
        let email = document.getElementById("email").value;

        $.ajax({
            method: "POST",
            url: "/admin",
            data: {
                email: email,
                pin: pin,
                action: "authorise"
            },

            success: function(body) {
                var json = JSON.parse(body)
                swal(json.title, json.message, json.type)
                if (json.auth) {
                    setTimeout(() => {
                        location.replace("/admin")
                    }, 3000);
                }
            },

            error: function(body) {
                swal("Error Occured", "Failed to connect to back-end server.", "error")
            }
        })
    })
}

//tl.fromTo(userOptions, 0.3, {y: "500"}, {y: "20"})
