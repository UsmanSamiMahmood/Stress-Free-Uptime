const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { db } = require("../database/handler");
const nodemailer = require('nodemailer');
const { emailPassword } = require("../secrets/config.json");
const { SESSION_NAME } = require("../app.js");
const emailTemplates = require("../emailTemplates.json");

const redirectToLogin = (req, res, next) => {
    if (!req.session.userID) {
      res.redirect("/login")
    } else {
      next()
    }
}

const redirectToDashboard = (req, res, next) => {
    if (req.session.userID) {
      res.redirect("/dashboard")
    } else {
      next()
    }
}

const adminCheck = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.status(403)
        res.redirect("/dashboard")
    }
}

let location = db.collection("data").doc("permissionCheck")
    .get().then((doc) => {
        let blackListedIPs = doc.data().blacklistedIPs
        let authip = doc.data().authip
    
router.get("/", (req, res, next) => {
    console.log(req.session)
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

router.get("/dashboard", redirectToLogin, (req, res, next) => {
    console.log(req.session)
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

router.get("/login", redirectToDashboard, (req, res, next) => {
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

router.post("/login", redirectToDashboard, (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502)
        var json = {}
        json.type = "error"
        json.title = "Error Encountered"
        json.message = `Your IP: ${ip} is blacklisted from using our services.`
        json.success = false

        return res.send(JSON.stringify(json))

    } else {
        res.status(200)
        let citiesRef = db.collection('users');
        let query = citiesRef.where('email', '==', req.body.email).get()
        .then(snapshot => {
            if (snapshot.empty) {
                var json = {}
                json.type = "error"
                json.title = "Error Encountered"
                json.message = "This user isn't registered."
                json.success = false

                return res.send(JSON.stringify(json))
            }  

            snapshot.forEach(doc => {
                return bcrypt.compare(req.body.password, doc.data().password, function (err, result) {
                    if (result) {
                        req.session.admin = doc.data().admin
                        req.session.userID = doc.data().id
                        var json = {}
                        json.type = "success";
                        json.title = "Successfully logged in.";
                        json.message = "Redirecting to dashboard...";
                        json.success = true

                        return res.send(JSON.stringify(json))
                    } else {
                        var json = {}
                        json.type = "error"
                        json.title = "Error Encountered"
                        json.message = "Incorrect email or password."
                        json.success = false

                        return res.send(JSON.stringify(json))
                    }
                });
            });
        })
        .catch(err => {
            console.log('Error getting documents.', err);
        });
    }
})

router.get("/register", redirectToDashboard, (req, res, next) => {
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

router.post("/register", redirectToDashboard, async(req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502); 
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`)
    }

    let citiesRef = db.collection('users');
    let query = await citiesRef.where('email', '==', req.body.email).get()
        .then(snapshot => {
            if (!snapshot.empty) {
                console.log("Activated")
                throw "found"
            }        
        })
        .catch(() => {
            console.log("Activated 2")
            var json = {}
            json.type = "error"
            json.title = "Account Exists."
            json.message = "A user with this email already exists."
            json.success = false

            return res.send(JSON.stringify(json))
            })
        
        if (req.body.password != req.body.passwordconfirm) {
            var json = {}
            json.type = "error"
            json.title = "Passwords do not match."
            json.message = "Please make sure passwords match before submitting."
            json.success = false

            return res.send(JSON.stringify(json))
        } 
        if (req.body.password === req.body.passwordConfirm) {
            let email = req.body.email
            let password = req.body.password
            let firstName = req.body.firstName
            let lastName = req.body.lastName
            var number = Math.random()
            number.toString(36)
            var id = number.toString(36).substr(2, 9)
            id.length >= 9;

            console.log(id);
            

            var json = {}
            json.type = "success";
            json.title = "Your account has been registered.";
            json.message = "Redirecting to login...";
            json.success = true

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    db.collection("users").doc(id).set({
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: hash,
                        admin: false,
                        premium: false,
                        id: id,
                        websites: 0
                    })
                });
            });

            sendMail(email, "Welcome to Stress Free Uptime", "p", emailTemplates.register.replace("{{replace}}", ""))

            console.log(`Email: ${req.body.email}. Password: ${req.body.password}.`)
        
            return res.end(JSON.stringify(json))
        }
})

router.post("/logout", redirectToLogin, (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard')
        }

        res.clearCookie(SESSION_NAME)
        res.redirect("/login")
    })

})

function sendMail(email, subject, body, html="") {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'stressfreeuptime@gmail.com',
          pass: emailPassword
        },
        tls: {
            rejectUnauthorized: false
        }
      });
      
      var mailOptions = {
        from: '(Robot) stressfreeuptime@gmail.com',
        to: email,
        subject: subject,
        text: body,
        html: html
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    })
}

router.get("/admin", adminCheck, (req, res, next) => {
    res.sendStatus(200)
})

});

module.exports = router;