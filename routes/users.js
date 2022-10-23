/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


// EXAMPLE
router.get('/', (req, res) => {
  res.render('users');
});

// GET /users/login
router.get('/login', (req, res) => {
  // Set admin user cookies (MAKE THIS users.id?)
  req.session.user_id = 'admin';
  res.redirect('/listings');
});

// GET /users/register
router.get('/register', (req, res) => {
  // Set regular user cookies (MAKE THIS users.id?)
  req.session.user_id = 8;
  res.redirect('/listings');
});



module.exports = router;
