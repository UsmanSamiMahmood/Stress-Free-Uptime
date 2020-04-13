const http = require("http");
const app = require("./app");
const port = process.env.PORT || 80
const server = http.createServer(app)
var nodemailer = require('nodemailer');
const { emailPassword } = require("./secrets/config.json");
const color = require("colors");
server.listen(port, () => console.log("\nApp listening on port:", `${port}`.bgBlack.brightGreen))