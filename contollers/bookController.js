const Book = require("../models/bookModels");
const User = require("../models/userModels");
let availableBooks = require("../data/books.json");

const { getPostData } = require("../utils");

async function getBooks(req, res) {
  try {
    const books = await Book.findAll();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(books));
  } catch (error) {
    console.log(error);
  }
}

async function getBook(req, res, id) {
  try {
    const book = await Book.findById(id);
    if (!book) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Book Not Found" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(book));
    }
  } catch (error) {
    console.log(error);
  }
}

async function addBookToStore(req, res, userId) {
  try {
    const user = await User.findUserById(userId);

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found, Create new user" }));
    } else {
      const body = await getPostData(req);
      const { title, author, description, quantity } = JSON.parse(body);
      availableBooks.map((book) => {
        if (book.title === title) {
          const id = book.id;
          const book = {
            title,
            author,
            description: description,
            quantity: book.quantity + quantity,
          };
          const updBook = await Book.update(id, book);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(updBook));
        } else {
          const book = {
            title,
            author,
            description,
            quantity,
          };
          const newBook = await Book.create(book);
          res.writeHead(201, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(newBook));
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateBook(req, res, bookId, userId) {
  try {
    const user = await User.findUserById(userId);
    const book = await Book.findById(bookId);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(
        JSON.stringify({ message: "User not found, create a new user first" })
      );
    } else if (!book) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "book not found" }));
    } else {
      const body = await getPostData(req);
      const { title, author, description, quantity } = JSON.parse(body);

      const bookData = {
        title: title || book.title,
        author: author || book.author,
        description: description || book.description,
        quantity: quantity || book.quantity,
      };

      const updBook = Book.update(bookId, bookData);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(updBook));
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteBook(req, res, bookId, userId) {
  try {
    const user = await User.findUserById(userId);
    const book = await Book.findById(bookId);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(
        JSON.stringify({ message: "User not found, create a new user first" })
      );
    } else {
      await Book.remove(bookId);
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify({ message: `Book ${bookId} removed` }));
    }
  } catch (error) {
    console.log(error);
  }
}


module.exports={
    getBooks,
    getBook, 
    updateBook,
    addBookToStore,
    deleteBook
}
