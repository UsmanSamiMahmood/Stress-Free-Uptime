function temp(body) {
    var json = JSON.parse(body)
    swal(json.title, json.message, json.type);
}

document.getElementById("buttonreg").addEventListener("click", temp)
