// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + '/public'));


/************
 * DATABASE *
 ************/

const db = require('./models');

const BookModule = require('./models/books.js')

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  // DONE TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      {method: 'GET', path: '/api', description: 'Describes all available endpoints'},
      {method: 'GET', path: '/api/profile', description: 'Data about me'},
      {method: 'GET', path: '/api/books/', description: 'Get All books information'},
      {method: 'POST', path: '/api/books/', description: 'Add a book information into database'},
      {method: 'PUT', path: '/api/books/:id', description: 'Update a book information based upon the specified ID'},
      {method: 'DELETE', path: '/api/books/:id', description: 'Delete a book based upon the specified ID'},
      // DONE TODO: Write other API end-points description here like above
    ]
  })
});
// DONE TODO:  Fill the values
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'Jon Snow',
    'homeCountry': 'winterfell',
    'degreeProgram': 'informatics',//informatics or CSE.. etc
    'email': 'jon.snow@tum.de',
    'deployedURLLink': '',//leave this blank for the first exercise
    'apiDocumentationURL': '', //leave this also blank for the first exercise
    'currentCity': 'Germany',
    'hobbies': ["Sport"]

  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post('/api/books/', (req, res) => {

  /*
   * New Book information in req.body
   */
  console.log(req.body);

  /*
   * DONE TODO: use the books model and create a new object
   * with the information in req.body
   */
  var newBook = new db.books({
    title: req.body.title,
    author: req.body.author,
    releaseDate: req.body.releaseDate,
    genre: req.body.genre,
    rating: req.body.rating,
    language: req.body.language
  })

  newBook.save(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result)
    }
  })

  /*
 * return the new book information object as json
 */

  res.json(newBook);
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);

  /*
   * DONE TODO: use the books model and find using the bookId and update the book information
   */
  /*
   * Send the updated book information as a JSON object
   */

  db.books.findOneAndUpdate(
    {_id: bookId},
    {
      $set: {
        title: bookNewData.title,
        author: bookNewData.author,
        releaseDate: bookNewData.releaseDate,
        genre: bookNewData.genre,
        rating: bookNewData.rating,
        language: bookNewData.language
      }
    }, {new: true}, (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }

      console.log(doc);
      res.json(doc);
    });


});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * DONE TODO: use the books model and find using
   * the bookId and delete the book
   */
  db.books.findOneAndDelete({_id: bookId}, function (err, docs) {
    if (err){
      console.log(err)
    }
    else{
      console.log("Deleted Book : ", docs);
      res.json(docs);
    }
  });

  /*
   * Send the deleted book information as a JSON object
   */
  // res.json(deletedBook);
});


/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
