const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../database/models/User");
const nodemailer = require('nodemailer');
const { emailPassword } = require("../secrets/config.json");
const { SESSION_NAME } = require("../app.js");
const emailTemplates = require("../emailTemplates.json");
const rateLimit = require("express-rate-limit");

/** 
  * Middleware which checks if the user is not logged in
  * if the user is not logged in and tries to access the dashboard;
  * they will be redirected to the login page.
  */

const redirectToLogin = (req, res, next) => {
    if (!req.session.userID) {
      return res.status(200).redirect("/login")
    } else {
      next()
    }
}; 

/** 
  * Middelware which checks if the user is logged in,
  * if the user is logged in and tries to access the login page;
  * they will be redirected to the dashboard.
  */

const redirectToDashboard = (req, res, next) => {
    if (req.session.userID) {
        return res.status(200).redirect("/dashboard");
    } else {
      next()
    }
};

/** 
  * Middelware which checks if the user is an admin when the user attempts to access the admin panel,
  * if the user is not an admin and tries to access the admin panel;
  * they will be redirected to the dashboard.
  */

const adminCheck = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        return res.status(403).redirect("/dashboard");
    }
};

/** 
  * Below we implement a rateLimit which will be used for the POST route of /register,
  * if the IP that the user is connecting from has made 5 POST requests to the /register route in the last hour;
  * the user will be prevented from sending more POST requests until the timeout is over.
  */

const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: "Too many accounts created from your IP, please try again after 1 hour." });

router.get("/", (req, res, next) => {
    console.log(req.session)
    return res.status(200).render('index', { "jonasMail": "jonas.tysbjerg@gmail.com", "jonasDiscord": "♰ R1zeN#0001", "usmanMail": "usmanmahmood2914@protonmail.com", "usmanDiscord": "MrShadow#0001", "year": new Date().getFullYear() });
})

router.get("/dashboard", redirectToLogin, (req, res, next) => {
    res.status(200).render('dashboard', { userAdmin: req.session.admin, firstSession: req.session.firstSession });
    if(req.session.firstSession) {
        User.findOne({ Em })
       db.collection("users").doc(req.session.userID).update({ firstSession: false });
       req.session.firstSession = false 
    }
    
})

router.get("/login", redirectToDashboard, (req, res, next) => {
    return res.status(200).render('login');
})

router.get('/verify/:token', async (req, res, next) => {
    try {
        let id = req.query.id;
        User.findOne({ Id: id }), async(err, data) => {
            if (err) console.error(err);

            if (!data) throw "error";
            if (!data.VerifyID === req.params.token) {
                return res.status(200).send("Error");
            } else {
                if (data.EmailVerified) return res.status(400).send('<html><head><title>Already Verified</title></head><body bgcolor="white"><center><h1>Already Verified</h1></center><hr><center><a href="/dashboard">Click me to go to dashboard.</a></center></body></html>');
                User.updateOne({ Id: id }), { EmailVerified: true };
                req.session.admin = data.admin
                req.session.userID = data.id
                req.session.isPremium = data.premium
                req.session.isVerified = data.emailVerified
                req.session.isBanned = data.banned
                req.session.firstSession = data.firstSession
                return res.status(200).send('<html><head><title>Successfully Verified</title></head><body bgcolor="white"><center><h1>Successfully Verified</h1></center><hr><center><a href="/dashboard">Click me to go to dashboard.</a></center></body></html>')
            }
        }
    } catch(e) {
        res.status(400).send(`<html><head><title>Error</title></head><body bgcolor="white"><center><h1>An error has occured.</h1></center><hr><center><a>${req.path} is not a valid path.</a></center><br><center><a href="/">Click me to return to home page.</a></center></body></html>`)
    }
})

// Note for self, do not edit post routes.

router.post("/login", redirectToDashboard, (req, res, next) => {
    User.findOne({ Email: req.body.email }), async(err, data) => {
        if (err) console.error(err);
        
        if (data) {
            bcrypt.compare(req.body.password, data.password, function (err, result) {
                if(data.Banned) {
                    var json = {}
                    json.type = "error"
                    json.title = "Account Disabled"
                    json.message = "Your account is banned from using our services."
                    json.success = false;

                    return res.status(200).send(JSON.stringify(json));
                } else if(!data.EmailVerified) {
                    var json = {}
                    json.type = "error";
                    json.title = "Error Encountered"
                    json.message = "Your account is not verified, please check your email."
                    json.success = false;

                    return res.status(200).send(JSON.stringify(json));
                } else {
                    if (req.body.password !== result) {
                        var json = {}
                        json.type = "error"
                        json.title = "Error Encountered"
                        json.message = "Incorrect email or password."
                        json.success = false

                        return res.send(JSON.stringify(json))
                    }
                    req.session.admin = data.Admin
                    req.session.userID = data.UserID
                    req.session.isPremium = data.Premium
                    req.session.isVerified = data.EmailVerified
                    req.session.isBanned = data.Banned
                    req.session.firstName = data.FirstName
                    req.session.lastName = data.LastName
                    req.session.websites = data.Websites
                    req.session.firstSession = data.FirstSession
                    req.session.pinAttempts = 0

                    var json = {}
                    json.type = "success";
                    json.title = "Successfully logged in.";
                    json.message = "Redirecting to dashboard...";
                    json.success = true
    
                    return res.send(JSON.stringify(json))
                }

            })
        } else {
            var json = {}
            json.type = "error"
            json.title = "Error Encountered"
            json.message = "Incorrect email or password."
            json.success = false

            return res.send(JSON.stringify(json))
        }
    }
})
    
router.get("/register", redirectToDashboard, (req, res, next) => {
    return res.status(200).render('register');
})

router.post("/register", redirectToDashboard, registerLimiter, async(req, res, next) => {
    let email = req.body.email
    let password = req.body.password
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    var number = Math.random()
    number.toString(36)
    var id = number.toString(36).substr(2, 9)
    id.length >= 9;
    var token = number.toString().substr(1, 25)
            
    var json = {}
    json.type = "success";
    json.title = "Your account has been registered.";
    json.message = "Redirecting to login...";
    json.success = true

    let uuid = Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase()

    if (req.body.password != req.body.passwordConfirm) {
        var json = {}
        json.type = "error"
        json.title = "Passwords do not match."
        json.message = "Please make sure passwords match before submitting."
        json.success = false

        return res.send(JSON.stringify(json))
    } 

    User.findOne({ Email: email }),async(err, data) => {
        if(err) console.error(err);
        if (data) {
            var json = {}
            json.type = "error"
            json.title = "Account Exists."
            json.message = "A user with this email already exists."
            json.success = false

            return res.send(JSON.stringify(json))
        } else {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    new User({
                        Admin: false,
                        Banned: false,
                        Email: email,
                        EmailVerified: false,
                        FirstName: firstName,
                        LastName: lastName,
                        firstSession: true,
                        Id: id,
                        Password: hash,
                        Token: token,
                        VerifyID: uuid,
                        Websites: [""],
                        Premium: false
                    }).save();
                });
            });
        }
    }
   

        sendMail(email, "Welcome to Stress Free Uptime", "p", emailTemplates.register.replace("{{replace}}", firstName).replace("{{verifyAccountLink}}", `http://127.0.0.1/verify/${uuid}?id=${id}`))

        console.log(`Email: ${req.body.email}. Password: ${req.body.password}.`)
        
        return res.end(JSON.stringify(json))
    });

router.post("/logout", redirectToLogin, (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(502).redirect('/dashboard');
        }
        res.clearCookie(req.session).redirect('/login');
    })

})

router.get("/offers", async(req, res, next) => {
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

router.get("/admin", adminCheck, (req, res, next) => {
    if (!req.session.pinConfirmed) return res.status(400).send(`<html><head><title>Error</title></head><body bgcolor="white"><center><h1>Pin has not been confirmed.</h1></center><hr><center><a href="/dashboard">Go to dashboard and confirm pin.</a></center><br><center><a href="/">Click me to return to home page.</a></center></body></html>`)
    res.status(200).render('admin', { "username": req.session.firstName });
});

router.post("/admin", adminCheck, (req, res, next) => {
    console.log(req.body)
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
                var json = {};
                json.type = "error";
                json.title = "Error Occured";
                json.message = "Insufficient data has been supplied";
            }

            User.findOne({ Id: req.body.id }), async(err, data) => {
                if (err) console.error(err);

                if (!data) {
                    var json = {};
                    json.type = "error";
                    json.title = "Error Occured";
                    json.message = "User doesn't exist.";

                    return res.status(400).send(JSON.stringify(json));
                } else {
                    if (data.Premium) {
                        var json = {};
                        json.type = "error";
                        json.title = "Premium Detected";
                        json.message = "This user already has premium.";
                        return res.status(400).send(JSON.stringify(json));
                    } else {
                        User.updateOne({ Id: req.body.id }), { Premium: true };
                    }
                }
            }
            
            if (data.premium) {
                var json = {};
                json.type = "error";
                json.title = "Premium Detected";
                json.message = "This user already has premium.";
                return res.status(400).send(JSON.stringify(json));
            } else {
                try {
                    User.updateOne({ Id: req.body.id }), { Premium: true };
                } catch {
                    var json = {};
                    json.type = "error";
                    json.title = "Error Occured";
                    json.message = `Failed to add premium to ${req.body.id}.`;

                    return res.status(400).send(JSON.stringify(json));
                }

                var json = {};
                json.type = "success";
                json.title = "Premium Added";
                json.message = `Successfully added premium to ${req.body.id}.`;
                        
                return res.status(200).send(JSON.stringify(json));
            }
        case 'authorise':
            User.findOne({ Email: req.body.email }), async(err, data) => {
                if (err) console.error(err);

                if (!data) {
                    var json = {}
                    json.type = "error"
                    json.title = "User not found"
                    json.message = "The is no user with this email registered."
                    return res.status(200).send(JSON.stringify(json));
                }

                if (data) {
                    if (!data.Admin) {
                        var json = {};
                        json.type = "error";
                        json.title = "User not admin";
                        json.message = "This user isn't an administrator.";
                        return res.status(200).send(JSON.stringify(json));
                    }
                    if (data.Pin === req.body.pin) {
                        var json = {};
                        json.type = "success";
                        json.title = "Authorised";
                        json.message = "Redirecting to admin panel...";
                        json.auth = true;
                        req.session.pinConfirmed = true;
                        return res.status(200).send(JSON.stringify(json));
                    } else {
                        req.session.pinAttempts++
                        if (req.session.pinAttempts >= 3) {
                            User.updateOne({ Email: req.body.email }), { Banned: true };
                        }
                        var json = {};
                        json.type = "error";
                        json.title = "Incorrect Email/Pin";
                        json.message = "You have supplied an incorrect Email/Pin.";
                        return res.status(200).send(JSON.stringify(json));;
                }
            }


            }
            break;
                    
        default:
            res.status(400).json({ code: 400, body: 'Bad Request' })
    }
});

module.exports = router;