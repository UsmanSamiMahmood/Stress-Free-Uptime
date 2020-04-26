const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { db } = require("../database/handler");
const nodemailer = require('nodemailer');
const { emailPassword } = require("../secrets/config.json");
const { SESSION_NAME } = require("../app.js");
const emailTemplates = require("../emailTemplates.json");
const rateLimit = require("express-rate-limit");

const redirectToLogin = (req, res, next) => {
    if (!req.session.userID) {
      res.redirect("/login")
    } else {
      next()
    }
}; 

const redirectToDashboard = (req, res, next) => {
    if (req.session.userID) {
      res.redirect("/dashboard")
    } else {
      next()
    }
};

const adminCheck = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.status(403)
        res.redirect("/dashboard")
    }
};

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "Too many accounts created from your IP, please try again after 1 hour."
});

let location = db.collection("data").doc("permissionCheck")
    .get().then((doc) => {
        let blackListedIPs = doc.data().blacklistedIPs
        let authip = doc.data().authip

const blacklistedCheck = (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        return res.status(502).send(`Your IP; ${ip} is blacklisted from using our services, have a good day.`)
    } else {
        next()
    }
}
router.get("/", blacklistedCheck, (req, res, next) => {
    console.log(req.session)
    return res.status(200).render('index', { "jonasMail": "jonas.tysbjerg@gmail.com", "jonasDiscord": "♰ R1zeN#0001", "usmanMail": "usmanmahmood2914@protonmail.com", "usmanDiscord": "MrShadow#0001" });
})

router.get("/dashboard", redirectToLogin, blacklistedCheck, (req, res, next) => {
    res.status(200).render('dashboard', { userAdmin: req.session.admin });
})

router.get("/login", redirectToDashboard, blacklistedCheck, (req, res, next) => {
    return res.status(200).render('login');
})

router.get('/verify/:token', async (req, res, next) => {
    try {
        let id = req.query.id;
        db.collection('users').doc(id).get()
            .then((doc) => {
                if(!doc.data().verifyID === req.params.token) {
                    return res.send('Error.');
                } else {
                    db.collection('users').doc(id).update({
                        emailVerified: true
                    })
                    return res.send('<h1>Successfully Verified!</h1>')
                    // res.redirect('bullshitlink');
                }
            })
    } catch (e) {
        res.send('Error.')
    }
})

// Note for self, do not edit post routes.

router.post("/login", redirectToDashboard, (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        var json = {}
        json.type = "error"
        json.title = "Error Encountered"
        json.message = `Your IP: ${ip} is blacklisted from using our services.`
        json.success = false

        return res.status(502).send(JSON.stringify(json))
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

                        if (!doc.data().verified) {
                            var json = {}
                            json.type = "error";
                            json.title = "Error Encountered"
                            json.message = "Your account is not verified, please check your email."
                            json.success = false;

                            return res.status(200).send(JSON.stringify(json))
                        } else {
                            req.session.admin = doc.data().admin
                            req.session.userID = doc.data().id
                            req.session.isPremium = doc.data().premium
                            req.session.isVerified = doc.data().emailVerified
                            req.session.isBanned = doc.data().banned
                            var json = {}
                            json.type = "success";
                            json.title = "Successfully logged in.";
                            json.message = "Redirecting to dashboard...";
                            json.success = true

                            return res.send(JSON.stringify(json))

                        }
                        
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

router.get("/register", redirectToDashboard, blacklistedCheck, (req, res, next) => {
    return res.status(200).render('register');
})

router.post("/register", redirectToDashboard, registerLimiter, async(req, res, next) => {
    global.existAlready = false;

    console.log(req.body)

    if (!req.body.email) return res.end("Cannot send POST request with empty or insufficient content.")

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

            return res.send(JSON.stringify(json)), global.existAlready = true;
        })
        
        if (req.body.password != req.body.passwordConfirm) {
            var json = {}
            json.type = "error"
            json.title = "Passwords do not match."
            json.message = "Please make sure passwords match before submitting."
            json.success = false

            return res.send(JSON.stringify(json))
        } 
        if (req.body.password == req.body.passwordConfirm) {
            if (global.existAlready) return;
            let email = req.body.email
            let password = req.body.password
            let firstName = req.body.firstName
            let lastName = req.body.lastName
            var number = Math.random()
            number.toString(36)
            var id = number.toString(36).substr(2, 9)
            id.length >= 9;
            
            var json = {}
            json.type = "success";
            json.title = "Your account has been registered.";
            json.message = "Redirecting to login...";
            json.success = true

            let uuid = Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase()

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    db.collection("users").doc(id).set({
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: hash,
                        emailVerified: false,
                        admin: false,
                        premium: false,
                        id: id,
                        websites: 0,
                        banned: false,
                        verifyID: uuid
                    })
                });
            });

            sendMail(email, "Welcome to Stress Free Uptime", "p", emailTemplates.register.replace("{{replace}}", firstName).replace("{{verifyAccountLink}}", `http://127.0.0.1/verify/${uuid}?id=${id}`))

            console.log(`Email: ${req.body.email}. Password: ${req.body.password}.`)
        
            return res.end(JSON.stringify(json))
        }
})

router.post("/logout", redirectToLogin, (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(502).redirect('/dashboard');
        }
        res.clearCookie(req.session).redirect('/login');
    })

})

router.get("/offers", blacklistedCheck, async(req, res, next) => {
    return res.status(200).render('offers');
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
        };
    });
};

router.get("/admin", adminCheck, blacklistedCheck, (req, res, next) => {
    res.status(200).render('admin');
});

router.post("/admin", (req, res, next) => {
    if (!req.body.action) {
        var json = {}
        json.type = "error"
        json.title = "Error Occured"
        json.message = "Internal error has occured please contact administrators immediately."

        return res.status(400).send(JSON.stringify(json))
    }
    switch (req.body.action) {
        case 'ban':
            if (!req.body.id) {
                var json = {}
                json.type = "error"
                json.title = "Error Occured"
                json.message = 'Insufficient data has been supplied.'
                return res.status(400).send(JSON.stringify(json));
            }
            db.collection('users').doc(req.body.id).update({
                banned: true
            })
            .catch(() => {
                var json = {}
                json.type = "error"
                json.title = "Error Occured."
                json.message = `Failed to ban user with the given ID: ${req.body.id}.`
                return res.status(400).send(JSON.stringify(json));
            })
            
            var json = {}
            json.type = "success"
            json.title = "Successfully banned!"
            json.message = `Banned ID: ${req.body.id}.`
            return res.status(200).send(JSON.stringify(json));
            break;
        
        case 'premium':
            if (!req.body.id) {
                var json = {}
                json.type = "error"
                json.title = "Error Occured"
                json.message = "Insufficient data has been supplied"
            }
            db.collection('users').doc(req.body.id).get()
                .then((doc) => {
                    if (doc.data.premium) {
                        var json = {}
                        json.type = "error"
                        json.title = "Premium Detected"
                        json.message = "This user already has premium."
                        return res.status(400).send(JSON.stringify(json));
                    } else {
                        db.collection('users').doc(req.body.id).update({
                            premium: true,
                        })
                        .catch(() => {
                            var json = {}
                            json.type = "error"
                            json.title = "Error Occured"
                            json.message = `Failed to add premium to ${req.body.id}.`

                            return res.status(400).send(JSON.stringify(json));
                        })
                        
                        var json = {}
                        json.type = "success"
                        json.title = "Premium Added"
                        json.message = `Successfully added premium to ${req.body.id}.`
                        
                        return res.status(200).send(JSON.stringify(json));
                    }
                })
        
        default:
            res.status(400).json({ code: 400, body: 'Bad Request' })
    }
});
});

module.exports = router;