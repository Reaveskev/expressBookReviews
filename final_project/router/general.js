const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password; 

   if (username && password) {

    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully added!" });
    } else {
      return res.status(406).json({ message: "Unable to add user: User already exists!" });
    }
  }
  return res.status(406).json({ message: "Unable to add user: No username and/or password provided." });
});




// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  res.send(JSON.stringify(books,null,4))
});

// Get the book list available in the shop via Promises
public_users.get("/promise/", function (req, res) {
    
    const getBooks = new Promise(() => {
      res.send(JSON.stringify({ books }));
    });
  
    getBooks.then(() => console.log("Promise all books"))
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   const isbn = req.params.isbn;
  
  res.send(books[isbn])
 });
  



// Get book details based on ISBN via Promises
public_users.get("/promise/isbn/:isbn", function (req, res) {
  
    const getBook = new Promise(() => {
      const bookISBN = req.params.isbn;
      res.send(books[bookISBN]);
    });
  
    getBook.then(() => console.log("Promise ISBN"))
  }); 


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let matches = [];
    
    for (let bookId in books) {
        if (books[bookId].author === author) {
            matches.push(books[bookId]);
        }
    }

  res.send(matches)
});


// Get book details based on author via Promises
public_users.get("/promise/author/:author", function (req, res) {
  
    const getBook = new Promise(() => {
        const author = req.params.author;
        let matches = [];
        
        for (let bookId in books) {
            if (books[bookId].author === author) {
                matches.push(books[bookId]);
            }
        }
        res.send(matches)
    });
  
    getBook.then(() => console.log("Promise author"))
  }); 


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let matches = [];

    for (let bookId in books) {
        if (books[bookId].title === title) {
            matches.push(books[bookId]);
        }
    }
    res.send(matches)
});


// Get book details based on author via Promises
public_users.get("/promise/title/:title", function (req, res) {
   
    const getBook = new Promise(() => {
        const title = req.params.title;
        let matches = [];
    
        for (let bookId in books) {
            if (books[bookId].title === title) {
                matches.push(books[bookId]);
            }
        }
        res.send(matches)
    });
  
    getBook.then(() => console.log("Promise title"))
  }); 

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;
  //Write your code here
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
