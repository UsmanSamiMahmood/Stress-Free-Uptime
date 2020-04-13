const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
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
        return res.render("login");
    }
})

router.post("/login", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502)
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`)
    } else {
        res.status(200)
        
        let citiesRef = db.collection('users');
        let query = citiesRef.where('email', '==', req.body.email).get()
        .then(snapshot => {
            if (snapshot.empty) {
            return res.send("<h1>This user isn't registered.");
            }  

            snapshot.forEach(doc => {
                return bcrypt.compare(req.body.password, doc.data().password, function (err, result) {
                    if (result) {
                        res.redirect("/dashboard")
                    } else {
                        res.send("<h1>Incorrect e-mail or password.</h1>")
                    }
                });
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
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
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (!authip.includes(ip)) {
        res.status(502); 
        return res.send(`Your IP: ${ip} does not have permission to send data to this url.`)
    } else {
        let email = req.body.email
        let password = req.body.password
        let confirmPassword = req.body.confirmpassword;

        let citiesRef = db.collection('users');
        let query = citiesRef.where('email', '==', email).get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    throw "found"
                }

                var json = {}
                json.type = "success"
                json.title = "Your account has been registered."
                json.message = "Redirecting to login......!"
        
            })
            .catch(err => {
                if (err === "found") {
                    var json = {}
                    json.type = "error"
                    json.title = "Account Exists."
                    json.message = "A user with this email already exists."
                    return res.end(JSON.stringify(json))
                } else if (password !== confirmPassword) {
                    var json = {}
                    json.type = "error"
                    json.title = "Passwords do not match."
                    json.message = "Please make sure passwords match before submitting."
                    return res.end(JSON.stringify(json))
                } else {
                    var json = {}
                    json.type = "success"
                    json.title = "Your account has been registered."
                    json.message = "Redirecting to login......!"
                    return res.end(JSON.stringify(json))
                }
            })
        console.log(`Email: ${req.body.email}. Password: ${req.body.password}.`)
        
        return res.end(JSON.stringify(json))
        }  
})

router.post("/login", async(req, res, next) => {
    console.log(req.body.ad)
    console.log(req.params)
    console.log(req.query)
})

});

module.exports = router;