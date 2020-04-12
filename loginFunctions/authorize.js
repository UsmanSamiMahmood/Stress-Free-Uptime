const bcrypt = require('bcrypt');
const { db } = require("../database/handler");

function authorize(email, password) {
    let citiesRef = db.collection('users');
    let query = citiesRef.where('email', '==', email).get()
        .then(snapshot => {
            if (snapshot.empty) {
            return false;
            }  

            snapshot.forEach(doc => {
                console.log(doc.data())
                return bcrypt.compare(password, doc.data().password, function(err, result) {
                    if (result) return true
                    else return false;
                })
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
            return false;
        });
}