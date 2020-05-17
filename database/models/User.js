const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    Admin: Boolean,
    Banned: Boolean,
    Email: String,
    EmailVerified: Boolean,
    FirstName: String,
    LastName: String,
    FirstSession: Boolean,
    Id: String,
    Password: String,
    Token: String,
    VerifyID: String,
    Websites: Array,
    Premium: Boolean,
});

module.exports = mongoose.model("user", Schema);