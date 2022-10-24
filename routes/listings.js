const express = require('express');
const router = express.Router();
const listingsQueries = require('../db/queries/listings');
const commentsQueries = require('../db/queries/comments');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));


// GET /listings
router.get('/', (req, res) => {

  // Query for all listings
  listingsQueries.getListings(req.query)
  .then((listingsData) => {

    // Placeholder returning all listings
    res.render('listings', listingsData);
  });
});


// GET /listings/favourites
router.get('/favourites', (req, res) => {

  // Capture user id from cookie session
  const userID = req.session.user_id;

  // Query for user's favourite listings
  listingsQueries.getFavouriteListings(userID)
  .then((favListingsData) => {

    // Placeholder returning all favourite listings
    res.send(favListingsData);
  });
});


// GET /listings/:id
router.get('/:id', (req, res) => {

  // Capture listing id
  const listingID = req.params.id;

  // Query for listing, comments
  listingsQueries.getListing(listingID)
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
  listingsQueries.createListing(listingAttributes)
  .then((createdListing) => {

    // Placeholder returning newly created listing
    res.send(createdListing);
  });
});


// DELETE /listings/:id (status deleted)
// Implement owner and listing checks
router.delete('/:id', (req, res) => {

  // Capture listing id parameter
  const listingID = req.params.id;

  listingsQueries.deleteListing(listingID)
  .then(() => {
    // Placeholder
    res.redirect('/listings');
  });
});


// POST /listings/:id (post comment)
// To be integrated to comments queries (TS working on)
/*
router.post('/:id', (req, res) => {

  // Capture listing, user and comment (verify <form name= >)
  const listingID = req.params.id;
  const userID = req.session.user_id;
  const commentContent = req.body.comment;

  commentsQueries.createComment(listingID, userID, commentContent)
  .then((postedComment) => {
    res.send(postedComment);
  });
})
*/

module.exports = router;
