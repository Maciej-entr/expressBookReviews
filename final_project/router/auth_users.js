const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secretKey = "your_secret_key"; // Replace with a secure secret key

const isValid = (username) => {
  // Check if the username is valid (not empty and not null)
  return username && typeof username === "string";
};

const authenticatedUser = (username, password) => {
  // Check if the username and password match any user in the records
  const user = users.find(user => user.username === username && user.password === password);
  return !!user; // Return true if user exists, otherwise false
};

// Middleware to authenticate JWT and attach user to the request
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Attach the user to the request
    next();
  });
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate the user credentials
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

  // Return the token to the client
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.user.username; // Extracted from JWT

  // Check if the ISBN exists in the books database
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Add or modify the review for the given ISBN
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review for the user
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username; // Extracted from JWT

  // Check if the ISBN exists in the books database
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for the given ISBN
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for the user" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;