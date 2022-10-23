/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


// GET /users/login
router.get('/login', (req, res) => {
  // Hard-coded to user Mayor who has listings
  req.session.user_id = 7;
  res.redirect('/listings');
});

// GET /users/register
router.get('/register', (req, res) => {
  // Hard-coded to user Anon Villager who has favourite listings
  req.session.user_id = 8;
  res.redirect('/listings');
});



module.exports = router;
