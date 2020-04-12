const { db } = require("../database/handler");

function makeID() {
    var number = Math.random()
    number.toString(36)
    var id = number.toString(36).substr(2, 9)
    id.length >= 9;
    return id
}

let uid = makeID();

function generateUserID() {
    let docRef = db.collection('users').doc(uid);
    let getDoc = docRef.get()
    .then(doc => {
        if (doc.exists) {
            for (let i = 0; i <= 250; i++) {
                const nuid = Math.random().toString(36).substring(15);
                let ref = db.collection("users").doc(nuid);
                ref.get().then(search => {
                    if (!search.exists) {
                        return nuid;
                    }
                })
            }
        } else {
            return uid;
        }
    })
    .catch(err => {
        console.error('Error getting document', err);
    });

}

module.exports = generatorFunctions;
