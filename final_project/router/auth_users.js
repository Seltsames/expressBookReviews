const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in, missing user name or password"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. check your credentials and try again"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn/:review", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const actReviews = books[isbn].reviews;
  const reqReview = req.params.review;
  const user = req.session.authorization.username;
  let newReviews = []

  const newReview = {
    user: user,
    reviewtext: reqReview
  };


    for (let key in actReviews) {
        if (actReviews.hasOwnProperty(key)) {
                newReviews.push(actReviews[key])}
    }
    
    if (newReviews.length > 0){
        newReviews.map(review => { 
            if (review.user === user){
            review.reviewtext = reqReview;
        }
    })
    }else{
        books[isbn].reviews = []
        newReviews.push(newReview)
    }

  books[isbn].reviews = newReviews;
  res.send(books[isbn]);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const actReviews = books[isbn].reviews;
    const user = req.session.authorization.username;
    let newReviews = []

    for (let key in actReviews) {
        if (actReviews.hasOwnProperty(key)) {
                newReviews.push(actReviews[key])}
    }


    if (newReviews.length > 0){
        newReviews.map(review => { 
            if (review.user === user){
                newReviews = newReviews.filter(function(i) { return i !== review });
                books[isbn].reviews = newReviews;
                res.send("Review from "+user+" deleted "+newReviews)
        }
    })
    }else{
        res.send("No reviews to delete")
    }

});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
