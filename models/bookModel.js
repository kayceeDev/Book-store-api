let availableBooks = require("../data/books");
const { v4: uuidV4 } = require("uuid");
let users = require('../data/users.json')

const { writeDataToFile } = require("../utils");
const { resolve } = require("path/posix");
const { rejects } = require("assert");

function findAll() {
  return new Promise((resolve, reject) => {
    resolve(availableBooks);
  });
}

function findById(id) {
  return new Promise((resolve, reject) => {
    const book = availableBooks.filter((p) => p.id === id);
    resolve(book);
  });
}


function create(book){
    return new Promise((resolve, reject)=>{
        const newBook = {id:uuidV4(), ...books}
        availableBooks.push(newBook)
        writeDataToFile('../data/books.json', availableBooks)
    })
}

function update(id, book) {
  return new Promise((resolve, reject) => {
    const index = availableBooks.findIndex((b) => b.id === id);
    availableBooks[index] = { id, ...book };
    writeDataToFile("../data/books.json", availableBooks);
    resolve(availableBooks[index]);
  });
}
