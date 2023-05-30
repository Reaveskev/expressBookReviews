const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "Kevin", password: "password"}];

const isValid = (username)=>{ 
    let matchingUsers = users.filter((user) => {
        return user.username === username;
      });
      if (matchingUsers.length > 0) {
        return false;
      }
      return true;
    };


const authenticatedUser = (username,password)=>{ //returns boolean
    let matchingUsers = users.filter((user) => {
        return user.username === username && user.password === password;
      });
    
      if (matchingUsers.length > 0) {
        return true;
      }
      return false;
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 });
  
      req.session.authenticated  = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookISBN = req.params.isbn;
  const userReview = req.body.review;

  const currentUser = req.session.authenticated.username;

  let bookReviews = books[bookISBN].reviews;
  
  
  let reviewAlreadyExists = false;
  for (const username in bookReviews) {
   
    if (username === currentUser) {
      bookReviews[currentUser] = userReview;
      reviewAlreadyExists = true;
      break;
    }
  }
  
  
  if (!reviewAlreadyExists) {
    bookReviews[currentUser] = userReview;
  }
  
  res.send("The user's review has been added/updated successfully.");
  
});



regd_users.delete("/auth/review/:isbn", (req, res) => {
    const bookISBN = req.params.isbn;

    const currentUser = req.session.authenticated.username;
    
    const bookReviews = books[bookISBN].reviews;
  
    let reviewAlreadyExists = false;
    for (const username in bookReviews) {

      if (username === currentUser) {
        delete bookReviews[currentUser];
        reviewAlreadyExists = true;
        break;
      }
    }
    
    if (!reviewAlreadyExists) {
      res.send("The review could not be deleted.");
    }
    res.send("The review was deleted successfully.");

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
