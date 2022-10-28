const express = require('express');
const router  = express.Router();


// GET /users/login
router.get('/login', (req, res) => {
  // Hard-coded to user Mayor (admin, has listings)
  req.session.user_id = 7;
  res.redirect('/listings');
});


// GET /users/register
router.get('/register', (req, res) => {
  // Hard-coded to user Anon Villager (has favourite listings)
  req.session.user_id = 8;
  res.redirect('/listings');
});


module.exports = router;
