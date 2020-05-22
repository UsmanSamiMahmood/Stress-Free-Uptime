const express = require("express");
const router = express.Router();
const User = require("../database/models/User");
User
/*let location = db.collection("data").doc("permissionCheck")
    .get().then((doc) => {
        let blackListedIPs = doc.data().blacklistedIPs
        let authip = doc.data().authip
*/

// Check to see if someone is blacklisted which will be passed as middleware.

const blacklistedCheck = (req, res, next) => {
   /* let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        return res.status(502).send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`)
    } else {*/
        next()
    //}
}

router.get("/", blacklistedCheck, (req, res, next) => {
    res.status(200).json({ message: "Incorrect path specified." });
});

router.get("/user", blacklistedCheck, (req, res, next) => {
    console.log(req.session)
    if (!req.session.userID) return res.status(400).json({ error: "You must be logged in to use this." })
    if (!req.session.admin) {
        let loc = db.collection('users').doc(req.session.userID)
            .get().then((doc) => {
                res.status(200).json({ admin: doc.data().admin, banned: doc.data().false, email:  doc.data().email, emailVerified: doc.data().emailVerified, firstName: doc.data().firstName, lastName: doc.data().lastName, FullName: doc.data().firstName + " " + doc.data().lastName, Premium: doc.data().premium, Websites: doc.data().websites});
                
            })
    } else {
        if (!req.query.id) return res.status(400).json({ error: "ID not specified." })
        let l = db.collection('users').doc(req.query.id)
            .get().then((docSnapshot) => {
                if (!docSnapshot.exists) return res.status(400).json({ error: "An error occured, did you supply a valid ID? Contact backend developer is problems persist." }); throw "found"
            })
        let ll = db.collection('users').doc(req.query.id)
            .get().then((doc) => {
                return res.status(200).json({ admin: doc.data().admin, banned: doc.data().false, email:  doc.data().email, emailVerified: doc.data().emailVerified, firstName: doc.data().firstName, lastName: doc.data().lastName, FullName: doc.data().firstName + " " + doc.data().lastName, Premium: doc.data().premium, Websites: doc.data().websites});
            })
    }
})

// Below is a work in progress addwebsite api route.

/* router.get("/addwebsite", blacklistedCheck, (req, res, next) => {
    let url = req.query.url;
    let interval = req.query.interval;
    let id = req.query.id;
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1];

    if (!url) {
        return res.status(400).json({
            error: 'Please supply a url.'
        });
    } else {
        if (!interval) {
            return res.status(400).json({
                error: 'Please supply an interval.'
            });
        } else {
            if (!id) {
                return res.status(400).json({
                    error: 'Please supply an account ID.'
                })
            }
            
        }
    }
}) */

/* router.get("/addwebsite", (req, res, next) => {
    let url = req.query.url; let interval = req.query.interval; let premium = req.query.premium;
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]

    if (blackListedIPs.includes(ip)) {
        res.status(502);
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`);
    } else {
        if (!authip.includes(ip)) {
            res.status(503);
            return res.send(`Your IP: ${ip} does not have permission to send data to this url.`);
        } else {
            if (!url) {
                res.status(200).json({
                    error: 'Please supply a url.'
                })
            } else {
                if (!url) {
                    res.status(200).json({
                        error: 'Please supply an interval.'
                    })
                } else {
                    if (!premium) {
                        res.status(200).json({
                            error: 'Please supply premium status.'
                        })
                    } else {
                        let loc = db.collection('data')
                    }
                }
            }
        }
    }
    
}); */

router.post("/blacklist", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    console.log(ip)

    if (blackListedIPs.includes(ip)) {
        res.status(502);
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`);
    } else {
        if (!authip.includes(ip)) {
            res.status(503);
            return res.send(`Your IP: ${ip} does not have permission to send data to this url.`);
        } else {
            if (!req.body.ip) {
                res.status(200).json({
                    error: "IP not specified."
                })
            } else {
                db.collection("data").doc("permissionCheck").update("authip", blackListedIPs.push(req.body.ip))
                res.status(200).json({
                    success: `${ip} was blacklisted.`
                })
            }   
        }
    }
    
});

module.exports = router;