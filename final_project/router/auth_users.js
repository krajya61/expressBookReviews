const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    // Retrieve username and password from the request body
    const username = req.body.username;
    const password = req.body.password;
    
    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    
    // Check if the user exists
    if (!users[username]) {
        return res.status(401).json({message: "Invalid username or password"});
    }
    
    // Validate the password
    if (users[username].password !== password) {
        return res.status(401).json({message: "Invalid username or password"});
    }
    
    // Generate JWT token
    const token = jwt.sign(
        { username: username },
        'fingerprint_customer', // CHANGED FROM 'secret-token' TO MATCH index.js
        { expiresIn: '1h' } // Token expires in 1 hour
    );
    
    // Save the token in the session
    req.session.authorization = {
        accessToken: token,
        username: username
    };
    
    return res.status(200).json({
        message: "User successfully logged in",
        token: token
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Get the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // Get the review from the request query or body
    const review = req.query.review || req.body.review;
    
    // Get the username from the session
    const username = req.session.authorization['username'];
    
    // Check if review is provided
    if (!review) {
        return res.status(400).json({message: "Review is required"});
    }
    
    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    // Check if the book has a reviews object, if not create one
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    
    // Add or modify the review with the username as the key
    books[isbn].reviews[username] = review;
    
    return res.status(200).json({
        message: "Review successfully added/updated",
        reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Get the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // Get the username from the session
    const username = req.session.authorization['username'];
    
    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    // Check if the book has reviews
    if (!books[isbn].reviews) {
        return res.status(404).json({message: "No reviews found for this book"});
    }
    
    // Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({message: "You have not reviewed this book"});
    }
    
    // Delete the user's review
    delete books[isbn].reviews[username];
    
    return res.status(200).json({
        message: "Review successfully deleted",
        reviews: books[isbn].reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
