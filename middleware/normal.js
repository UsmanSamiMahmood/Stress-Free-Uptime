const express = require("express");
const router = express.Router();
const { db } = require("../database/handler");
let location = db.collection("data").doc("permissionCheck")
    .get().then((doc) => {
        let blackListedIPs = doc.data().blacklistedIPs

router.get("/", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")//[0]
    console.log(ip)
    if (blackListedIPs.includes(ip)) {
        return res.write(`Your IP ${ip} is blacklisted from using our services, have a good day.`)
    } else {
        return res.render("index");
    }
})
});
router.get("/login", (req, res, next) => {
    return res.render("login")
})

module.exports = router;