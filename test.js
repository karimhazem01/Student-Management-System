const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "public", "index.html");

console.log("Looking for:", filePath);
console.log("Exists:", fs.existsSync(filePath));
