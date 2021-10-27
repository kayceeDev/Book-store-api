let availableBooks = require("../data/books");
const { v4: uuidV4 } = require("uuid");
let users = require("../data/users.json");

const { writeDataToFile } = require("../utils");


function findAll() {
  return new Promise((resolve, reject) => {
    resolve(availableBooks);
  });
}

function findById(id) {
  return new Promise((resolve, reject) => {
    const book = availableBooks.find((p) => p.id === id);
    resolve(book);
  });
}

function create(book) {
  return new Promise((resolve, reject) => {
    const newBook = { id: uuidV4(), ...book };
    availableBooks.push(newBook);
    writeDataToFile("./data/books.json", availableBooks);
  });
}

function update(id, book) {
  return new Promise((resolve, reject) => {
    const index = availableBooks.findIndex((b) => b.id === id);
    availableBooks[index] = { id, ...book };
    writeDataToFile("./data/books.json", availableBooks);
    resolve(availableBooks[index]);
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    availableBooks = availableBooks.filter((p) => p.id !== id);
    writeDataToFile("./data/books.json", availableBooks);
    resolve();
  });
}

// function borrow(id){
//   return new Promise((resolve, reject)=>{
//     user = user.map
//     users.borr
//   })
// }




module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
}
