const { Schema } = require("mongoose");
const UserSchema = new Schema({
    Admin: Boolean,
    Banned: Boolean,
    Email: String,
    EmailVerified: Boolean,
    FirstName: String,
    LastName: String,
    FirstSession: Boolean,
    Id: String,
    Password: String,
    Pin: String,
    Token: String,
    VerifyID: String,
    RegisteredIPs: String,
    Websites: Array,
    Premium: Boolean,
});

module.exports = mongoose.model("user", UserSchema);