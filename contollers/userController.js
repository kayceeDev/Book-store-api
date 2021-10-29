const User = require("../models/userModels");
const admin = require('../data/admin.json')

const { getPostData } = require("../utils");

async function getUsers(req, res) {
  try {
    const users = await User.findAllUsers();
    res.writeHead(200, { "Content-Type": "application.json" });
    return res.end(JSON.stringify(users));
  } catch (error) {
    console.log("error");
  }
}

async function getUser(req, res, id) {
  try {
    const user = await User.findUserById(id);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "User not found" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    }
  } catch (error) {
    console.log(error);
  }
}

async function addUser(req, res) {
  try {
    const body = await getPostData(req);
    const { username } = JSON.parse(body);

    const newUser = {
      username,
      bookBorrowed: [],
    };

    const user = await User.createUser(newUser);
    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
}

async function updateUser(req, res, id) {
  try {
    const user = await User.findUserById(id);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application.json" });
      return res.end(
        JSON.stringify({ message: "User not found, create a new user first" })
      );
    } else {
      const body = await getPostData(req);
      const { username, bookBorrowed } = JSON.parse(body);

      const userData = {
        username: username || user.username,
        bookBorrowed: bookBorrowed || user.bookBorrowed,
      };
      const updUser = await User.update(id, userData);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(updUser));
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteUser(req, res, id) {
  try {
    const user = await User.findUserById(id);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(
        JSON.stringify({ message: "User not found, create a new user first" })
      );
    } else {
      await User.removeUser(id);
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify({ message: `User ${id} removed` }));
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
};
