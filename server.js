// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(cookieSession({
  name: 'session',
  keys: ['secretkey']
}));


// Separated Routes for each Resource
const usersRoutes = require('./routes/users');
const listingsRoutes = require('./routes/listings');

// Mount all resource routes
app.use('/users', usersRoutes);
app.use('/listings', listingsRoutes);

// Home page
app.get('/', (req, res) => {
  res.redirect('/listings');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
