const express = require('express');
const router = express.Router();
const listingQueries = require('../db/queries/listings');

// GET /listings
router.get('/', (req, res) => {
  // Placeholder
  // res.send('listings home page');

  // Query for all listings
  listingQueries.getListings(req.query)
  .then((listings) => {
    // Placeholder
    res.json(listings);
  })
});

// GET /listings/:id
router.get('/:id', (req, res) => {
  // Placeholder
  res.send('Specific listing page');
  // Query for listing, comments
});

// GET /listings/favourites
router.get('/favourites', (req, res) => {
  // Placeholder
  res.send('Favourite listings');
  // Query for favourite listings
});

// POST /listings (create new listing)
router.post('/', (req, res) => {
  // Placeholder
  res.send('Create listing');
  // Insert record into listings table, redirect to listing page
});

// POST /listings/:id
router.post('/:id', (req, res) => {
  // Placeholder
  res.send('Delete listing');
  // Change status of listing, redirect
});

module.exports = router;
