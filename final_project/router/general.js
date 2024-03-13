const express = require('express');
let books = require("./booksdb.js");
let axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User registred!. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. not password or user provided"});
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
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author= req.params.author;
  let books_filtered = []

  for (let key in books) {
    if (books.hasOwnProperty(key)) {
        if (books[key].author === author)
            books_filtered.push(books[key])
    }
}

  res.send(JSON.stringify(books_filtered, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title= req.params.title;
  let books_filtered = []

  for (let key in books) {
    if (books.hasOwnProperty(key)) {
        if (books[key].title === title)
            books_filtered.push(books[key])
    }
}

  res.send(JSON.stringify(books_filtered, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

//Using ASYNC Await to get books by diferent details :D

async function getBooks() {
    try {
      console.log("trying to get books with axios")
      const response = await axios.get('https://andfrojasp-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
      console.log("books are =");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

getBooks();

async function getBookByISBN() {
    try {
      console.log("trying to get books by its ISBN with axios")
      const response = await axios.get('https://andfrojasp-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/2');
      console.log("book are =");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  getBookByISBN()


  async function getBookByAUTHOR() {
    try {
      console.log("trying to get books by its Author with axios")
      const response = await axios.get('https://andfrojasp-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/Unknown');
      console.log("books of this author are =");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  getBookByAUTHOR()

  
  async function getBookByTITLE() {
    try {
      console.log("trying to get books by its Title with axios")
      const response = await axios.get('https://andfrojasp-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai//title/Fairy tales');
      console.log("The details of this book are=");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

getBookByTITLE()

module.exports.general = public_users;
