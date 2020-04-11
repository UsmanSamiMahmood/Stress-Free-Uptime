const express = require("express");
const router = express.Router();
const { db } = require("../app.js")
let location = db.collection("data")
let locget = location.get()
let ips = locget.data().blacklisted

router.get("/", (req, res, next) => {
    return res.render("index");
})

router.get("/login", (req, res, next) => {
    return res.render("login")
})

module.exports = router;