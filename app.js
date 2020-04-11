const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const moment = require("moment");
const figlet = require("figlet");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const admin = require("firebase-admin")
const serviceAccount = require("./secrets/serviceAccount.json");
const normalRoute = require("./middleware/normal")
const limiter = rateLimit({
  windowMs: 900000,
  max: 100,
})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://uptimechecker-1ad70.firebaseio.com"
  });

const db = admin.firestore();

app.set("view engine", "ejs");
app.use(express.static("views"));
app.use("/", limiter, normalRoute);


console.log(figlet.textSync("Stress Free Uptime", {font: 'Ogre'}));
console.log("\nStress Free Uptime is a service brought to you by Usman Mahmood and Jonas Schiott.");
console.log("\nPowered by: Node.JS & Express.");
console.log("Version:", process.env.npm_package_version);
console.log("Github:", process.env.npm_package_homepage);

module.exports = app;