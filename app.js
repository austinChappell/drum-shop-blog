require('dotenv').config();

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

const Blog = require('./blog');

const port = process.env.PORT || 3500;

const url = process.env.MONGODB_URI;

mongoose.connect(url, {useMongoClient: true});

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.get('/', (req, res) => {
  Blog.find({}, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log('RESULTS', results);
      res.render('add_entry', {results});
    }
  })
});

app.post('/add_post', (req, res) => {
  console.log(req.body);
  const post = req.body;
  post.createdAt = new Date().toDateString();
  Blog.create(post, (err, post) => {
    if (err) {
      throw err;
    } else {
      res.redirect('/');
    }
  })
});

app.get('/api', (req, res) => {
  Blog.find({}, (err, results) => {
    if (err) {
      throw err;
    } else {
      res.json(results)
    }
  })
});

app.listen(port, () => {
  console.log(`Your app is running on PORT ${ port }.`);
});
