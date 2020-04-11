const express = require("express");
const router = express.Router();
const { db } = require("../database/handler");
let location = db.collection("data").doc("permissionCheck")
    .get().then((doc) => {
        let blackListedIPs = doc.data().blacklistedIPs

router.get("/", (req, res, next) => {
    let hey = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    hey = hey.split("::ffff:")[1]
    console.log(hey)
    if (blackListedIPs.includes(hey)) {
        res.send(`Your IP ${hey} is blacklisted from using our services, have a good day.`)
    } else {
        return res.render("index");
    }
})
});
router.get("/login", (req, res, next) => {
    return res.render("login")
})

module.exports = router;