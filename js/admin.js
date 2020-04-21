// Testing over, will move onto next stage on 21/04/2020.

window.onload=function(){
    $.ajax({
        method: "POST",
        url: "/admin",
        data: {
            action: 'ban',
            email: 'usmanmahmood2914@protonmail.com',
            id: '22zpjw85i',
        },
            success: function(body) {
                var json = JSON.parse(body);
                swal(json.title, json.message, json.type);
            },

            error: function(body) {
                swal("Error Occured", "Failed to connect to back-end server.", "error")
            }
    })
}