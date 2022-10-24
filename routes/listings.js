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

  // Capture user id from cookie session
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

  // Capture listing id
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

  // Capture listing attributes from form and owner's id
  const listingAttributes = {...req.body, owner_id : req.session.user_id};

  // Pass attributes into new listing query
  listingQueries.createListing(listingAttributes)
  .then((createdListing) => {

    // Placeholder returning newly created listing
    res.send(createdListing);
  })
});


// POST /listings/:id
// Implement owner and listing checks
router.post('/:id', (req, res) => {

  // Capture listing id parameter
  const listingID = req.params.id;

  listingQueries.deleteListing(listingID)
  .then(() => {
    // Placeholder
    res.redirect('/listings');
  })
});

module.exports = router;
