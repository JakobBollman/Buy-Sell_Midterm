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

// GET to /users/login
router.get('/login', (req, res) => {
  // Placeholder
  res.send('admin you are');
  // Set admin user cookies (MAKE THIS USER ID?)
  req.session.user_id = 'admin';
});

// GET to /users/register
router.get('/register', (req, res) => {
  // Placeholder
  res.send('regular user you are');
  // Set regular user cookies (MAKE THIS USER ID?)
  req.session.user_id = 'user'
});



module.exports = router;
