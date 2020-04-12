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
        res.status(502)
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`)
    } else {
        res.status(200).json({
            message: "Incorrect path specified."
        })
    }
})

router.get("/blacklist", (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split("::ffff:")[1]
    if (blackListedIPs.includes(ip)) {
        res.status(502)
        return res.send(`Your IP: ${ip} is blacklisted from using our services, have a good day.`)
    } else {
        if (!authip.includes(ip)) {
            res.status(503)
            return res.send(`Your IP: ${ip} does not have permission to send data to this url.`)
        } else {
            if (!req.query.ip) {
                res.status(200).json({
                    error: "IP not specified."
                })
            } else {
                blackListedIPs.push(req.query.ip)
                    .then(function() {
                        res.status(200).json({
                            success: `${req.query.ip} was blacklisted.`,
                            currentList: `${blackListedIPs}`
                        })
                    })
            }
        }
    }
    
}) 
});

module.exports = router;