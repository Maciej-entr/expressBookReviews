const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for the given author" });
  }
});

// Get book details based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found for the given title" });
  }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn-promise/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ message: "Book not found" });
    }
  })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json(err));
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn-async/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const book = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject({ message: "Book not found" });
      }
    });

    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json(err);
  }
});

// Get book details based on Author using Promise callbacks
public_users.get('/author-promise/:author', (req, res) => {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ message: "No books found for the given author" });
    }
  })
    .then(booksByAuthor => res.status(200).json(booksByAuthor))
    .catch(err => res.status(404).json(err));
});

// Get book details based on Author using async-await with Axios
public_users.get('/author-async/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const booksByAuthor = await new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject({ message: "No books found for the given author" });
      }
    });

    return res.status(200).json(booksByAuthor);
  } catch (err) {
    return res.status(404).json(err);
  }
});
// Get book details based on Title using Promise callbacks
public_users.get('/title-promise/:title', (req, res) => {
  const title = req.params.title;

  // Simulate an asynchronous operation using a Promise
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject({ message: "No books found for the given title" });
    }
  })
    .then(booksByTitle => res.status(200).json(booksByTitle))
    .catch(err => res.status(404).json(err));
});
// Get book details based on Title using async-await with Axios
public_users.get('/title-async/:title', async (req, res) => {
  const title = req.params.title;

  try {
    // Simulate an asynchronous operation using Axios
    const booksByTitle = await new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject({ message: "No books found for the given title" });
      }
    });

    return res.status(200).json(booksByTitle);
  } catch (err) {
    return res.status(404).json(err);
  }
});
module.exports.general = public_users;