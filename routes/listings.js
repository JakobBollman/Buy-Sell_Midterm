const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

const listingsQueries = require('../db/queries/listings');
const favouritesQueries = require('../db/queries/favourites');
const usersQueries = require('../db/queries/users');
const commentsQueries = require('../db/queries/comments');


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

  const templateVars = {};

  // Capture user id from cookie session
  const userID = req.session.user_id;

  // Query for all users
  usersQueries.getAllUsers()
  .then(usersData => {
    favouritesQueries.getFavouriteListings(userID)
    .then((favListingsData) => {
      templateVars.users = usersData;
      templateVars.favourites = favListingsData;
      res.render('favourites', templateVars);
    })
    .catch((errorMessage) => res.send(errorMessage));
  })
  .catch((errorMessage) => res.send(errorMessage));
});


// GET /listings/:id
router.get('/:id', (req, res) => {
  // Capture listing id
  const listingID = req.params.id;

  let temp = {};
  // Query for listing, comments, user
  usersQueries.getAllUsers()
  .then((UsersData) => {
    commentsQueries.getCommentsById(listingID)
    .then((commentData) => {
      listingsQueries.getListing(listingID)
      .then((listingData) => {
        temp.users = UsersData;
        temp.comments = commentData;
        temp.listing = listingData;
        res.render('listing', temp);
      })
      .catch((errorMessage) => res.send(errorMessage));
    })
    .catch((errorMessage) => res.send(errorMessage));
  })
  .catch((errorMessage) => res.send(errorMessage));
})



// GET /listings
router.get('/', (req, res) => {

  const userID = req.session.user_id;
  let temp = {}

  // Query for all users,listings
  usersQueries.getAllUsers()
  .then((UsersData) => {
    listingsQueries.getAllListings(req.query)
    .then((listingsData) => {
      favouritesQueries.getFavouriteListings(userID)
      .then((favListingsData) => {
        console.log(favListingsData);
        temp.favourites = favListingsData;
        temp.users = UsersData;
        temp.listings = listingsData;
        res.render('listings', temp);
      })
      .catch((errorMessage) => res.send(errorMessage));
    })
    .catch((errorMessage) => res.send(errorMessage));
  })
  .catch((errorMessage) => res.send(errorMessage));
});


// POST /listings/:id (post comment)
// To be integrated to comments queries (TS working on)

router.post('/:id', (req, res) => {

  // Capture listing, user and comment (verify <form name= >)
  const listingID = req.params.id;
  console.log('listingID:', listingID)
  const userID = req.session.user_id;
  const commentContent = req.body['new-comment'];
  console.log('req.data:', req.data)
  console.log('req.body:', req.body)

  commentsQueries.createNewComment(listingID, userID, commentContent)
  .then((postedComment) => {
    console.log(postedComment)
    res.send(postedComment);
  })
  .catch((errorMessage) => res.send(errorMessage));
})



// POST /listings/:id/favourite
router.post('/:id/favourite', (req, res) => {

  // Capture listing id and user id
  const listingID = req.params.id;
  const userID = req.session.user_id || 1;

  // Query to add listing to favourites
  favouritesQueries.addToFavourites(userID, listingID)
  .then(data => {
    res.json(data);
  })
  .catch(errorMessage => res.send(errorMessage));

});


// DELETE /listings/:id/favourite
router.delete('/:id/favourite', (req, res) => {

  // Capture listing id and user id
  const listingID = req.params.id;
  const userID = req.session.user_id;

  // Query to remove listing from favourites
  favouritesQueries.removeFromFavourites(userID, listingID)
  .then(data => {
    res.json(data);
  })
  .catch(errorMessage => res.send(errorMessage));

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
