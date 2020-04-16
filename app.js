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
const session = require("express-session");
const time = 1000 * 60 * 60 * 2
const { db } = require("./database/handler.js");

function makeId() {
  var number = Math.random()
  number.toString(36)
  var id = number.toString(36).substr(2, 9)

  return id
}

const {
  SESSION_LIFETIME = time,
  SESSION_NAME = makeId(),
  SESSION_SECRET = "5etfrhsdjkfh5fsdfkj",
  NODE_ENV = "development"
} = process.env

const IN_PRODUCTION = NODE_ENV === 'production'

const apilimiter = rateLimit({
  windowMs: 900000,
  max: 50,
})

app.set("view engine", "ejs");

app.set('trust proxy', 1)

app.use(session({
  name: SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  cookie: {
    maxAge: SESSION_LIFETIME,
    sameSite: true,
    secure: IN_PRODUCTION,
  }
}))

app.use(express.urlencoded({ extended: false }));
app.use("/views",express.static(__dirname + "/views"));
app.use("/css",express.static(__dirname + "/css"));
app.use("/js",express.static(__dirname + "/js"))
app.use("/", normalRoute);
app.use("/images",express.static(__dirname + "/images"))
app.use("/api", /*apilimiter,*/ apiRoute);

console.log(figlet.textSync("Stress Free Uptime", {font: 'rectangles'}));
console.log("\nStress Free Uptime is a service brought to you by Usman Mahmood and Jonas Schiott.");
console.log("\nPowered by:", "Node.JS & Express.".blue.bold);
console.log("Version:", "1.1.7".yellow.bold);
console.log("Github:", "https://github.com/UsmanSamiMahmood/Automatic-Website-Checker/".magenta.bold);
console.log("\nDevelopers: Usman Mahmood & Jonas Schiott".underline.red.bold)

module.exports = app;

