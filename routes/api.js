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
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookId, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
    const title = req.body.title;
    //response will contain new book object including atleast _id and title
    
    const bookEntry = {
      title         : title,
      comment_count : 0
    } 
    
    if (!title) { //checking to see if the user entered a title in the required input field
      res.send('*required fields missing');
    } else { //all fields are filled => proceed to add the issue to the database
      db.collection("library").insertOne(bookEntry, (err, doc) => {
        console.log('Book ' + title + ' has been successfully submitted into the library.');
        console.log(bookEntry); 
        err ? res.send(err) : res.json(bookEntry);
        //db.close();
      })
    }
    
    
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      const bookId = req.params.id;
      //json res format: {"_id": bookId, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      const bookId = req.params.id;
      const comment = req.body.comment;
      //json res format same as .get
    
    })
    
    .delete(function(req, res){
      const bookId = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
