const bcrypt = require('bcrypt');

module.exports.hashPassword = function(password, length) {
    bcrypt.genSalt(length, function(err, salt) {
        bcrypt.hash(password, length, function(err, hash) {
            console.log(hash)
        })
    })
}
