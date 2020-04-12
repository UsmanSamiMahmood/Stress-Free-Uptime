const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var color = require('colors');
const moment = require("moment");
const figlet = require("figlet");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const normalRoute = require("./middleware/normal");
const apiRoute = require("./middleware/api")
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const limiter = rateLimit({
  windowMs: 900000,
  max: 100,
})

//const isBlacklisted = array.includes(ip) ? true : false

app.set("view engine", "ejs");
app.use("/views",express.static(__dirname + "/views"));
app.use("/css",express.static(__dirname + "/css"));
app.use("/", limiter, normalRoute);
app.use("/api", limiter, apiRoute);
app.use(express.bodyParser());


console.log(figlet.textSync("Stress Free Uptime", {font: 'Ogre'}));
console.log("\nStress Free Uptime is a service brought to you by Usman Mahmood and Jonas Schiott.");
console.log("\nPowered by: Node.JS & Express.");
console.log("Version:", process.env.npm_package_version);
console.log("Github:", process.env.npm_package_homepage);

module.exports = app;