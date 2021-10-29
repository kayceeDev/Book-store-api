const Book = require("../models/bookModels");
const User = require("../models/userModels");
let admin = require("../data/admin.json");

const { getPostData, isAvailable, isAdded } = require("../utils");

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
    const adminId = admin[0].id;
    // const user = await User.findUserById(userId);
    if (userId !== adminId) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Only admin allowed to add book to store" })
      );
    }
    const body = await getPostData(req);
    const { title, author, description, quantity_available } = JSON.parse(body);
    const titleExist = isAdded(title);
    console.log(titleExist);
    if (titleExist) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Book already in store" }));
    }
    const book = {
      title: title.trim().replace(/\s\s+/g, " "),
      author: author.trim().replace(/\s\s+/g, " "),
      description: description.trim().replace(/\s\s+/g, " "),
      quantity_available,
    };
    const newBook = await Book.create(book);
    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(newBook));
  } catch (error) {
    console.log(error);
  }
}

// To borrow a book by id, find book name
async function borrowBook(req, res, bookId, userId) {
  try {
    const user = await User.findUserById(userId);
    const book = await Book.findById(bookId);
    const bookIsAvailable = isAvailable(bookId);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application.json" });
      return res.end(
        JSON.stringify({ message: "User not found, create a new user first" })
      );
    }
    if (!book) {
      res.writeHead(404, { "Content-Type": "application.json" });
      return res.end(JSON.stringify({ message: "book not found" }));
    }
    if (!bookIsAvailable) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "book out of stock" }));
    } else {
      const { title, author, description, quantity_available } = book;
      const { username, bookBorrowed } = user;

      const bookData = {
        title: title || book.title,
        author: author || book.author,
        description: description || book.description,
        quantity_available: quantity_available - 1,
      };

      if (bookBorrowed.find(b=>b.name === title)) {
        res.writeHead(404, { "Content-Type": "application.json" });
        res.end(
          JSON.stringify({
            message: `User ${userId} already borrowed this book`,
          })
        );
      } else {
        userData = {
          username: username || user.username,
          bookBorrowed: [...bookBorrowed,{id: book.id, name: title}],
        };

        const updUser = await User.update(userId, userData);
        const updBook = await Book.update(bookId, bookData);
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(updUser, updBook));
      }
    }
  } catch (error) {
    console.log(error);
  }
}
async function returnBook(req, res, bookId, userId) {
  try {
    const user = await User.findUserById(userId);
    const book = await Book.findById(bookId);
    const bookIsAvailable = isAvailable(bookId);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(
        JSON.stringify({ message: "User not found, create a new user first" })
      );
    }
    if (!book) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "book not found" }));
    }
    if (!user.bookBorrowed.find(b=>b.name === book.title)) {
      res.writeHead(404, { "Content-Type": "application.json" });
      res.end(JSON.stringify({ message: "You haven't borrowed this book" }));
    } else {
      const { title, author, description, quantity_available } = book;
      const { username, bookBorrowed } = user;

      const bookData = {
        title: title || book.title,
        author: author || book.author,
        description: description || book.description,
        quantity_available: quantity_available + 1,
      };

      const userData = {
        username: username || user.username,
        bookBorrowed: bookBorrowed.filter((b) => b.name != title) || bookBorrowed,
      };
      const updUser = await User.update(userId, userData);
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
        JSON.stringify({
          message:
            "User Id not found, create a new user first or use existing user id",
        })
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

      const updBook = await Book.update(bookId, bookData);
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
        JSON.stringify({
          message:
            "User Id not found, create a new user first or use existing user id",
        })
      );
    }
    if (!book) {
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
  borrowBook,
  returnBook,
};
