const bcrypt = require('bcrypt');
const { hashPassword } = require("./generateClientIDs");
const { db } = require("../database/handler");

function authorize(email, password) {
    let citiesRef = db.collection('users');
    let query = citiesRef.where('email', '==', "dawsawd@wadwa.com").get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }  

    snapshot.forEach(doc => {
        bcrypt.compare(password, doc.data().password, function(err, result) {
            return true;
        })
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });

}