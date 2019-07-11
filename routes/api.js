/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

module.exports = (app, db) => {
  
  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookId, "title": book_title, "commentcount": num_of_comments },...]
    db.collection("library")
      .find({})
      .toArray((err, books) => {
      //getting the commentcount value looking at the length of the comments array
      books.forEach(el => el.commentcount = el.comments.length);
      err ? res.send(err) : res.send(books);
      //console.log(books);
    });
  })  
  
    .post(function (req, res){
    const title = req.body.title;
    //response will contain new book object including atleast _id and title
    
    //Book object constructor
    function Book() {
      this.title  = title;
      this.comments = [];
      //this.commentcount  = this.comments.length; //getting the commentcount value looking at the length of the comments array
    }
    
    if (!title) { //checking to see if the user entered a title in the required input field
      res.send('*required fields missing');
    } else { //all fields are filled => proceed to add the book to the library database collection
      db.collection("library")
        .insertOne(new Book(), (err, doc) => {
        err ? res.send(err) : res.send(new Book());
        //console.log('Book ' + title + ' has been successfully submitted into the library.');
        //console.log(bookEntry);
      });
    }
  })
      
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    db.collection("library")
      .deleteMany({}, (err, doc) => {
      err ? res.send('complete delete unsuccessful') : res.send('complete delete successful');
      //console.log(doc);  
    });
  });

  app.route('/api/books/:id')
    .get(function (req, res){
    const bookId = req.params.id;
    //json res format: {"_id": bookId, "title": book_title, "comments": [comment,comment,...]}
    db.collection("library")
      .find({_id: new ObjectId(bookId)})
      .toArray((err, book) => {
      book.length < 1 ? res.send('no book exists') : null;
      err ? res.send(err) : res.send(book[0]);
      console.log(book[0]);
    });
  })
    
    .post(function(req, res){
      const bookId = req.params.id;
      const comment = req.body.comment;
      //json res format same as .get
    db.collection("library")
      .findOneAndUpdate(
      {_id: new ObjectId(bookId)},
      { $push: { comments: comment }},
      (err, book) => {
      err ? res.send(err) : res.send(book.value);
      //console.log('Comment has been successfully submitted to the book.');
      //console.log(book);
      });    
    })
    
    .delete(function(req, res){
    const bookId = req.params.id;
    //if successful response will be 'delete successful'
    db.collection("library")
      .deleteOne({_id: new ObjectId(bookId)}, (err, doc) => {
      err ? res.send('delete unsuccessful') : res.send('delete successful');
      //console.log(doc);  
    });
  });

};
