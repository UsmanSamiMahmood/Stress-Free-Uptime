const bcrypt = require('bcrypt');
const { hashPassword } = require("./generateClientIDs");
const { db } = require("../database/handler");

function authorize(email, password) {
    let citiesRef = db.collection('users');
    let query = citiesRef.where('email', '==', email).get()
        .then(snapshot => {
            if (snapshot.empty) {
            return false;
            }  

            snapshot.forEach(doc => {
                bcrypt.compare(password, doc.data().password, function(err, result) {
                    console.log(typeof result)
                    return !!result
                })
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

}

console.log(authorize("dawsawd@wadwa.com", "2e1r4wq2rwq1f") == true ? "Correct login" : "Incorrect login")