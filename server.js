const http = require("http");
const app = require("./app");
const port = process.env.PORT || 80
const server = http.createServer(app)
const color = require("colors")
server.listen(port, () => console.log(`App listening on port:`, `${port}`.bgRed.black))