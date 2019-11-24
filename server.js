const http = require("http");
const app = require("./app");

const server = http.createServer(app);
server.listen(3000, "127.0.0.1");

console.log("Server Connected");
