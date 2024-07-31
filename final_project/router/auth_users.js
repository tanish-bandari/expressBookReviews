const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let validUser = users.filter(user => user.username.trim() == username.trim());
    if (validUser.length > 0) {
        return true;
    } 
    else {
        return false;
    }
}

const authenticatedUser = (username,password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validuser = users.filter(user => user.username.trim() == username.trim() && user.password.trim() == password.trim());
    if (validuser.length > 0) {
        return true;
    } 
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
        {
            data: password,
        }, "access", { expiresIn: 60 * 60 });

        req.session.authorization = {
        accessToken,
        username,
        };
        return res.status(200).send("User successfully logged in");
    } 
    else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;
    const user = req.session.authenticated.username;
    let bookReviews = books[isbn.trim()].reviews;

    if (!bookReviews){
        res.send("ISBN ${isbn} does not exist.")
    }

    let reviewExists = false;
    for (const username in bookReviews) {
        if (username == user) {
            bookReviews[user] = review;
            reviewExists = true;
            break;
        }
    }
    if (!reviewExists) {
        bookReviews[user] = review;
    }
    return res.json({message: "The review for ISBN ${isbn} has been added."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
