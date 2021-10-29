const http = require("http");

const {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
} = require("./contollers/userController");

const {
  getBooks,
  getBook,
  updateBook,
  addBookToStore,
  deleteBook,
  borrowBook,
  returnBook,
} = require("./contollers/bookController.js");

const server = http.createServer((req, res) => {
  req.url = req.url.toLowerCase()
  if (req.url === '/api/users' && req.method === "GET") {
    // Gets list of users and book borrowed if any
    getUsers(req, res);
  } else if (req.url.match(/\/api\/users\/[\w-]+/) && req.method === "GET") {
    // @GET api/users/:id returns a user
    const id = req.url.split("/")[3];
    getUser(req, res, id);
  } else if (req.url === "/api/users" && req.method === "POST") {
    // @POST api/user adds user
    addUser(req, res);
  } else if (req.url.match(/\/api\/users\/[\w-]+/) && req.method === "DELETE") {
    // @PUT api/users/:user id updates a user profile
    const id = req.url.split("/")[3];
    deleteUser(req, res, id);
  } else if (req.url.match(/\/api\/users\/[\w-]+/) && req.method === "PUT") {
    // @PUT api/users/:id updates a user profile
    const id = req.url.split("/")[3];
    updateUser(req, res, id);
  } else if (req.url === "/api/books" && req.method === "GET") {
    // @GET api/books returns all books. Anyone can view list of books available
    getBooks(req, res);
  } else if (req.url.match(/\/api\/books\/users\/[\w-]+/) && req.method === "GET") {
    // @GET api/books/:id return a book by id
    const id = req.url.split("/")[4];
    getBook(req, res, id);
  } else if (req.url.match(/\/api\/books\/users\/\w+/) && req.method === "POST") {
    // @POST api/users/books Adds a book to library ( only registered users can do that)
    const adminId = req.url.split("/")[4];
    addBookToStore(req, res, adminId);
  } else if (
    req.url.match(/\/api\/books\/users\/update\/[\w-]+\/[\w-]+/) &&
    req.method === "PUT"
  ) {
    // @PUT api/users/books updates a book in library ( only registered users can do that)
    const bookId = req.url.split("/")[6];
    const userId = req.url.split("/")[5];

    updateBook(req, res, bookId, userId);
  } else if (
    req.url.match(/\/api\/books\/users\/delete\/[\w-]+\/[\w-]+/) &&
    req.method === "DELETE"
  ) {
    // @Delete api/users/books deletes a book in library ( only registered users can do that)
    const bookId = req.url.split("/")[6];
    const userId = req.url.split("/")[5];
    deleteBook(req, res, bookId, userId);
  } else if (
    req.url.match(/^\/api\/books\/users\/borrow\/[\w-]+\/[\w-]+/) &&
    req.method === "PATCH"
  ) {
    // @PATCH api/users/borrow only registered users can borrow book
    const bookId = req.url.split("/")[6];
    const userId = req.url.split("/")[5];
    console.log(bookId, userId);
    borrowBook(req, res, bookId, userId);
  } else if (
    req.url.match(/\/api\/books\/users\/return\/[\w-]+\/[\w-]+/) &&
    req.method === "PATCH"
  ) {
    // @PATCH api/users/borrow only registered users can return borrowed book
    const bookId = req.url.split("/")[6];
    const userId = req.url.split("/")[5];
    console.log(bookId, userId);
    returnBook(req, res, bookId, userId);
  } else {
    // When route is invalid
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route Not Found" }));
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = server;
