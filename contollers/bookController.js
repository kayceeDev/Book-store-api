const Book = require("../models/bookModels");
const User = require("../models/userModels");
let availableBooks = require("../data/books.json");

const { getPostData, isAvailable, isAvailable } = require("../utils");

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
      const { title, author, description, quantity_available } =
        JSON.parse(body);
      availableBooks.map((book) => {
        if (book.title === title) {
          const id = book.id;
          const book = {
            title,
            author,
            description: description,
            quantity_available: book.quantity_available + quantity_available,
          };
          const updBook = await Book.update(id, book);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(updBook));
        } else {
          const book = {
            title,
            author,
            description,
            quantity_available,
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

// To borrow a book by id, find book name
async function borrowBook(req, res, bookId, userId) {
  try {
    const user = await User.findUserById(userId);
    const book = await Book.findById(bookId);
    const bookIsAvailable = await isAvailable(bookId);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(
        JSON.stringify({ message: "User not found, create a new user first" })
      );
    } else if (!book) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "book not found" }));
    } else if (!bookIsAvailable) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "book out of stock" }));
    } else {
      const { title, author, description, quantity_available } = book;

      const bookData = {
        title: title || book.title,
        author: author || book.author,
        description: description || book.description,
        quantity_available: quantity_available - 1,
      };
      user.bookBorrowed.map((t) => {
        if (t.title === title) {
          t.count++;
        } else {
          user.bookBorrowed.push({ title, count: 1 });
        }
      });
      const updUser = await users.update(userId, user);
      const updBook = await Book.update(bookId, bookData);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(updBook, updUser));
    }
  } catch (error) {
    console.log(error);
  }
}
async function returnBook(req, res, bookId, userId) {
  try {
    const user = await User.findUserById(userId);
    const book = await Book.findById(bookId);
    const bookIsAvailable = await isAvailable(bookId);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(
        JSON.stringify({ message: "User not found, create a new user first" })
      );
    } else if (!book) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "book not found" }));
    } else if (!bookIsAvailable) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "book out of stock" }));
    } else {
      const { title, author, description, quantity_available } = book;

      const bookData = {
        title: title || book.title,
        author: author || book.author,
        description: description || book.description,
        quantity_available: quantity_available + 1,
      };

      user.bookBorrowed.map((t) => {
        if (t.title === title && count > 0) {
          t.count--;
        } else {
          const index = user.bookBorrowed.findIndex((b) => b.title === title);
          user.bookBorrowed.splice(index, 1);
          //   user.bookBorrowed.push({ title, count: 1 });
        }
      });
      const updUser = await users.update(userId, user);
      const updBook = await Book.update(bookId, bookData);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(updBook, updUser));
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
      const { title, author, description, quantity_available } =
        JSON.parse(body);

      const bookData = {
        title: title || book.title,
        author: author || book.author,
        description: description || book.description,
        quantity_available: quantity_available || book.quantity_available,
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
    } else if (!book) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "book not found" }));
    } else {
      await Book.remove(bookId);
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify({ message: `Book ${bookId} removed` }));
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getBooks,
  getBook,
  updateBook,
  addBookToStore,
  deleteBook,
};
