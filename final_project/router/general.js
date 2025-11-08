const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post('/register', function (req, res) {
    // Retrieve username and password from the request body
    const username = req.body.username;
    const password = req.body.password;
    
    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    
    // Check if the username already exists
    if (users[username]) {
        return res.status(409).json({message: "Username already exists"});
    }
    
    // Register the new user
    users[username] = {
        username: username,
        password: password
    };
    
    return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop (synchronous version)
public_users.get('/', function (req, res) {
    // Assuming 'books' is your books data object
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 10: Get the book list using async-await with Axios/Promise
public_users.get('/async', async function (req, res) {
    try {
        // Simulate async operation using Promise
        const getBooks = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books);
            }, 100);
        });
        
        const booksList = await getBooks;
        return res.status(200).send(JSON.stringify(booksList, null, 4));
    } catch (error) {
        return res.status(500).json({message: "Error fetching books", error: error.message});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
    // Assuming 'books' is your data object
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Task 11: Get book details based on ISBN using async-await with Promise
public_users.get('/isbn-async/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        
        // Create a Promise to get book by ISBN
        const getBookByISBN = new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        });
        
        // Use await to get the result
        const book = await getBookByISBN;
        return res.status(200).json(book);
        
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Retrieve the author from the request parameters
    const author = req.params.author;
    
    // Get all the keys (ISBNs) from the books object
    const bookKeys = Object.keys(books);
    
    // Array to store matching books
    let matchingBooks = [];
    
    // Iterate through the books array and check if author matches
    for (let i = 0; i < bookKeys.length; i++) {
        const isbn = bookKeys[i];
        if (books[isbn].author === author) {
            matchingBooks.push(books[isbn]);
        }
    }
    
    // Return the matching books or a not found message
    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({message: "No books found by this author"});
    }
});

// Task 12: Get book details based on author using async-await with Promise
public_users.get('/author-async/:author', async function (req, res) {
    try {
        const author = req.params.author;
        
        // Create a Promise to get books by author
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            let matchingBooks = [];
            
            for (let i = 0; i < bookKeys.length; i++) {
                const isbn = bookKeys[i];
                if (books[isbn].author === author) {
                    matchingBooks.push(books[isbn]);
                }
            }
            
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found by this author"));
            }
        });
        
        // Use await to get the result
        const matchingBooks = await getBooksByAuthor;
        return res.status(200).json(matchingBooks);
        
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Retrieve the title from the request parameters
    const title = req.params.title;
    
    // Get all the keys (ISBNs) from the books object
    const bookKeys = Object.keys(books);
    
    // Array to store matching books
    let matchingBooks = [];
    
    // Iterate through the books array and check if title matches
    for (let i = 0; i < bookKeys.length; i++) {
        const isbn = bookKeys[i];
        if (books[isbn].title === title) {
            matchingBooks.push(books[isbn]);
        }
    }
    
    // Return the matching books or a not found message
    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({message: "No books found with this title"});
    }
});

// Task 13: Get book details based on title using async-await with Promise
public_users.get('/title-async/:title', async function (req, res) {
    try {
        const title = req.params.title;
        
        // Create a Promise to get books by title
        const getBooksByTitle = new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            let matchingBooks = [];
            
            for (let i = 0; i < bookKeys.length; i++) {
                const isbn = bookKeys[i];
                if (books[isbn].title === title) {
                    matchingBooks.push(books[isbn]);
                }
            }
            
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found with this title"));
            }
        });
        
        // Use await to get the result
        const matchingBooks = await getBooksByTitle;
        return res.status(200).json(matchingBooks);
        
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // Check if the book exists
    const book = books[isbn];
    
    if (book) {
        // Return the reviews for the book
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
