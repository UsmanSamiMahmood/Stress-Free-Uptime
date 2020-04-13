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

const apilimiter = rateLimit({
  windowMs: 900000,
  max: 50,
})

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/views",express.static(__dirname + "/views"));
app.use("/css",express.static(__dirname + "/css"));
app.use("/js",express.static(__dirname + "/js"))
app.use("/", apilimiter, normalRoute);
app.use("/api", limiter, apiRoute);

console.log(figlet.textSync("Stress Free Uptime", {font: 'rectangles'}));
console.log("\nStress Free Uptime is a service brought to you by Usman Mahmood and Jonas Schiott.");
console.log("\nPowered by:", "Node.JS & Express.".blue.bold);
console.log("Version:", "1.1.5".yellow.bold);
console.log("Github:", "https://github.com/UsmanSamiMahmood/Automatic-Website-Checker/".magenta.bold);
console.log("\nDevelopers: Usman Mahmood & Jonas Schiott".underline.red.bold)

module.exports = app;