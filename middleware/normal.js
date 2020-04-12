const express = require("express");
const router = express.Router();
const loginFunctions = require("../loginFunctions/authorize");
const { db } = require("../database/handler");
let location = db.collection("data").doc("permissionCheck")
    .get().then((doc) => {
        let blackListedIPs = doc.data().blacklistedIPs
        let authip = doc.data().authip
    
router.get("/", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502)
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`)
    } else {
        res.status(200)
        return res.render("index", {
            "jonasMail": "jonas.tysbjerg@gmail.com",
            "jonasDiscord": "♰ R1zeN#0001",
            "usmanMail": "usmanmahmood2914@protonmail.com",
            "usmanDiscord": "MrShadow#0001"
        })
    }
})

router.get("/dashboard", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502)
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`)
    } else {
        res.status(200)
        return res.render("dashboard")
    }
})

router.get("/login", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502)
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`)
    } else {
        res.status(200)
        return res.render("login", { loginFunctions: loginFunctions });
    }
})

router.get("/register", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502)
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`)
    } else {
        res.status(200)
        return res.render("register");
    }
})

router.post("/register", async(req, res, next) => {
    var id = makeID()
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502);
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`);
    } else {
        if (!authip.includes(ip)) {
            res.status(503);
            return res.send(`Your IP: ${ip} does not have permission to send data to this url.`);
        }
    }
    
    // Note for tomorrow, make the database make a document with the id name and inside the document store the email and password(encrypted) and set premium to false, also create an array called monitoredUrls.
    // Collection for user and document containing urls.
})

function makeID() {
    var number = Math.random()
    number.toString(36)
    var id = number.toString(36).substr(2, 9)
    id.length >= 9;
    return id
}


router.post("/login", async(req, res, next) => {
    console.log(req.body.ad)
    console.log(req.params)
    console.log(req.query)
})

});

module.exports = router;