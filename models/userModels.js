const { v4: uuidV4 } = require("uuid");
let users = require('../data/users.json');

const {writeDataToFile} = require("../utils");

function findAllUsers() {
  return new Promise((resolve, reject) => {
    resolve(users);
  });
}

function findUserById(id) {
  return new Promise((resolve, reject) => {
    const user = users.find((u) => u.id === id);
    resolve(user);
  });
}

function createUser(user) {
  return new Promise((resolve, reject) => {
    const newUser = { id: uuidV4(), ...user };
    users.push(newUser);
    writeDataToFile('./data/users.json', users)
    resolve(newUser)
  });
}

function update(id, user) {
  return new Promise((resolve, reject) => {
    const index = users.findIndex((u) => u.id === id);
    users[index] = { id, ...user };
    writeDataToFile('./data/users.json', users);
    resolve(users[index]);
  });
}

function removeUser(id) {
  return new Promise((resolve, reject) => {
    users = users.filter((p) => p.id !== id);
    writeDataToFile('./data/users.json', users);
    resolve();
  });
}

module.exports = {
  findAllUsers,
  findUserById,
  createUser,
  update,
  removeUser
};
