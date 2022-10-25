const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

const listingsQueries = require('../db/queries/listings');
const favouritesQueries = require('../db/queries/favourites');
// const commentsQueries = require('../db/queries/comments');

// STRETCH Route to see a user's listings
// router.get('/my_listings', (req, res) => {

//   // Query for all listings
//   listingQueries.getListings(req.query)
//   .then((listingsData) => {

//     // Placeholder returning all listings
//     res.render('my_listings',listingsData);
//   });
// });


// GET /listings/new
router.get('/new', (req, res) => {
    res.render('new_listing');
});


// GET /listings/favourites
router.get('/favourites', (req, res) => {

  // Capture user id from cookie session
  const userID = req.session.user_id;

  // Query for user's favourite listings
  favouritesQueries.getFavouriteListings(userID)
  .then((favListingsData) => {

    // Placeholder returning all favourite listings
    res.send(favListingsData);
  })
  .catch((errorMessage) => res.send(errorMessage));
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
  })
  .catch((errorMessage) => res.send(errorMessage));
});


// GET /listings
router.get('/', (req, res) => {

  console.log(req.query);

  // Query for all listings
  listingsQueries.getAllListings(req.query)
  .then((listingsData) => {
    const templateVars = {listings : listingsData}
    res.render('listings', templateVars);
  })
  .catch((errorMessage) => res.send(errorMessage));
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
  })
  .catch((errorMessage) => res.send(errorMessage));
})
*/


// PATCH /listings/:id/fav
router.patch('/:id/fav', (req, res) => {

  // Capture listing id and user id
  // const listingID = req.params.id;
  // const userID = req.session.user_id;
  const listingID = req.body.list;  //FOR CURL TESTING
  const userID = req.body.user;      //FOR CURL TESTING

  // Query to add listing to favourites
  favouritesQueries.addToFavourites(listingID, userID)
  .then(data => {
    res.status(200);
  })
  .catch(errorMessage => res.send(errorMessage));

});


// Admin cookie session check
// router.use((req, res) => {
//   if (req.session.user_id !== 'admin') {
//     res.send('Please log in as admin');
//   }
// });


// POST /listings (create new listing)
router.post('/', (req, res) => {

  // Capture listing attributes from form and owner's id
  const listingAttributes = {...req.body, owner_id : req.session.user_id};

  // Pass attributes into new listing query
  listingsQueries.createListing(listingAttributes)
  .then((createdListing) => {

    // Placeholder returning newly created listing
    res.send(createdListing);
  })
  .catch((errorMessage) => res.send(errorMessage));
});


// PATCH /listings/:id/sold
router.patch('/:id/sold', (req, res) => {

  // Capture listing id
  const listingID = req.params.id;

  // Query to mark listing as sold
  favouritesQueries.markListingSold(listingID)
  .then(data => {
    return;
  })
  .catch((errorMessage) => res.send(errorMessage));
});


// DELETE /listings/:id (status deleted)
router.delete('/:id', (req, res) => {

  // Capture listing id parameter
  const listingID = req.params.id;

  // Query to mark listing as deleted
  listingsQueries.deleteListing(listingID)
  .then(data => {
    // Placeholder
    res.redirect('/listings');
  })
  .catch((errorMessage) => res.send(errorMessage));
});


module.exports = router;
