const express = require("express");
const router = express.Router();
const { db } = require("../database/handler");
let location = db.collection("data").doc("permissionCheck")
    .get().then((doc) => {
        let blackListedIPs = doc.data().blacklistedIPs
        let authip = doc.data().authip

        

router.get("/", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502);
        res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`);
    } else {
        res.status(200).json({
            message: "Incorrect path specified."
        })
    }
});

router.get("/addwebsite", (req, res, next) => {
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
            // Add something here later.
        }
    }
    
});

router.get("/blacklist", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip)
    ip = ip.split("::ffff:")[0]
    console.log(ip)

    if (blackListedIPs.includes(ip)) {
        res.status(502);
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`);
    } else {
        if (!authip.includes(ip)) {
            res.status(503);
            return res.send(`Your IP: ${ip} does not have permission to send data to this url.`);
        } else {
            if (!req.query.ip) {
                res.status(200).json({
                    error: "IP not specified."
                })
            } else {
                db.collection("data").doc("permissionCheck").update("authip", blackListedIPs.push(req.query.ip))
                res.status(200).json({
                    success: `${ip} was blacklisted.`
                })
            }   
        }
    }
    
});
});

module.exports = router;