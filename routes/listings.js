const express = require('express');
const router = express.Router();
const listingQueries = require('../db/queries/listings');


// GET /listings
router.get('/', (req, res) => {

  // Query for all listings
  listingQueries.getListings(req.query)
  .then((listingsData) => {

    // Placeholder
    res.send(listingsData);
  });
});


// GET /listings/:id
router.get('/:id', (req, res) => {

  // Capture request paramenter
  const listingID = req.params['id'];

  // Query for listing, comments
  listingQueries.getListing(listingID)
  .then((listingData) => {

    // Placeholder
    res.send(listingData);
  });
});


// GET /listings/favourites
router.get('/favourites', (req, res) => {

  // Capture user id from cookie
  const userID = req.session.user_id;

  // Query for favourite listings
  listingQueries.getFavouriteListings(userID)
  .then((favListingsData) => {
    res.send(favListingsData);
  })
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
