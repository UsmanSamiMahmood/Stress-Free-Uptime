const express = require("express");
const router = express.Router();
const { db } = require("../app")

router.get("/", (req, res, next) => {
    return res.render("index");
})

router.get("/login", (req, res, next) => {
    return res.render("login")
})

module.exports = router;