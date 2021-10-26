const fs = require("fs");
const books = require('./data/books.json')

function writeDataToFile(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function getPostData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(err);
    }
  });
}

function isAvailable(id){
books.map(b=>b.id === id && b.qunatity_available > 0)
}

module.exports = {
  writeDataToFile,
  getPostData,
  isAvailable
};
