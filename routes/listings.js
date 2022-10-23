const express = require('express');
const router = express.Router();
const listingQueries = require('../db/queries/listings');


// GET /listings
router.get('/', (req, res) => {

  // Query for all listings
  listingQueries.getListings(req.query)
  .then((listingsData) => {

    // Placeholder returning all listings
    res.send(listingsData);
  });
});


// GET /listings/favourites
router.get('/favourites', (req, res) => {

  // Capture user id from cookie
  const userID = req.session.user_id;

  // Query for user's favourite listings
  listingQueries.getFavouriteListings(userID)
  .then((favListingsData) => {

    // Placeholder returning all favourite listings
    res.send(favListingsData);
  })
});


// GET /listings/:id
router.get('/:id', (req, res) => {

  // Capture request paramenter
  const listingID = req.params.id;

  // Query for listing, comments
  listingQueries.getListing(listingID)
  .then((listingData) => {

    // Placeholder returning the selected listing
    res.send(listingData);
  });
});


// POST /listings (create new listing)
router.post('/', (req, res) => {

  // Insert record into listings table, redirect to listing page
  listingQueries.createListing()
  .then((createdListing) => {

    // Placeholder returning newly created listing
    res.send(createdListing);
  })
});


// POST /listings/:id
router.post('/:id', (req, res) => {
  // Placeholder
  res.send('Delete listing');
  // Change status of listing, redirect
});

module.exports = router;
