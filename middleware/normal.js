const express = require("express");
const router = express.Router();
const { db } = require("../database/handler");
let location = db.collection("data").doc("permissionCheck")
    .get().then((doc) => {
        let blackListedIPs = doc.data().blacklistedIPs
    
    console.log(blackListedIPs);
    

router.get("/", (req, res, next) => {
    return res.render("index");
})

router.get("/login", (req, res, next) => {
    return res.render("login")
})
});

module.exports = router;