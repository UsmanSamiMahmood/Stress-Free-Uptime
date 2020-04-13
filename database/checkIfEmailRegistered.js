window.onload=function(){
    export function checkMail(email) {
        let citiesRef = db.collection('users');
        let query = citiesRef.where('email', '==', email).get()
        .then(snapshot => {
            if (!snapshot.empty) {
                throw "Email exists"
            } else {
                throw "Email does not exist"
            }

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    }
    console.log("Success!")
}