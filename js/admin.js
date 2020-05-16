window.onload=function(){
    const form1 = document.querySelector("#ban-form")

    form1.addEventListener('submit', evt => {
        evt.preventDefault();

        let id = document.getElementById("id").value;

        $.ajax({
            method: "POST",
            url: "/admin",
            data: {
                action: 'ban',
                id: id,
            },

            success: function(body) {
                var json = JSON.parse(body);
                swal(json.title, json.message, json.type)
            },

            error: function(body) {
                swal("Error Occured", "Failed to connect to back-end server.", "error")
            }
        })
    })

    const form2 = document.querySelector("premium-form");

    form2.addEventListener('submit', evt => {
        evt.preventDefault();
        
        let id = document.getElementById("id").value;

        $.ajax({
            method: "POST",
            url: "/admin",
            data: {
                action: 'premium',
                id: idm
            },

            

        })

    })    
}