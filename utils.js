
const fs = require("fs");
const { title } = require("process");
const books = require("./data/books.json");

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

function isAvailable(id) {
  return books.some((b) => b.id === id && b.quantity_available > 0);
}

const isAdded = (title)=> {
  return books.some(b => b.title.trim().replace(/\s\s+/g, ' ') === title.trim().replace(/\s\s+/g, ' '))
}

module.exports = {
  writeDataToFile,
  getPostData,
  isAvailable,
  isAdded,
};
