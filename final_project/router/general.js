const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    if (username && password) {
        if (!isValid(username.trim())) {
            users.push({username:username.trim(), password:password.trim()});
            return res.status(200).json({ message: "Registration complete." });
        } 
        else {
            return res.status(404).json({ message: "Username taken." });
        }
    }
    return res.status(404).json({ message: "Registration failed." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn.trim()];
    if (book) {
        res.send(book);
    } 
    else {
        res.send("ISBN not found.");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    const bookList = Object.values(books);
    // console.log(bookList);

    const authorFilter = bookList.filter(book => book.author.trim() == author.trim());
    // console.log(authorFilter);
    if (authorFilter.length > 0) {
        res.send(authorFilter);
    } 
    else {
        res.send("Author not found.");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
    const bookList = Object.values(books);

    const titleFilter = bookList.filter(book => book.title.trim() == title.trim());
    if (titleFilter.length > 0) {
        res.send(titleFilter);
    } 
    else {
        res.send("Title not found.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn.trim()];
    if (book){
        res.send(book.reviews);
    }
    else{
        res.send("ISBN not found.")
    }
});

module.exports.general = public_users;
