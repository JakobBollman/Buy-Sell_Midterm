const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

const listingsQueries = require('../db/queries/listings');
const favouritesQueries = require('../db/queries/favourites');
const usersQueries = require('../db/queries/users');
const commentsQueries = require('../db/queries/comments');

// GET /listings/my_listings
router.get('/my_listings', (req, res) => {

  const templateVars = {}
  const userID = req.session.user_id;
  templateVars.user = userID;

  listingsQueries.getMyListings(userID)
  .then((listingsData) => {
    templateVars.myListings = listingsData;
    return favouritesQueries.getFavouriteListings(userID);
  })
  .then((favListingsData) => {
    templateVars.favourites = favListingsData;
    res.render('my_listings',templateVars);
  })
  .catch(errorMessage => res.send(errorMessage));
});


// GET /listings/new
router.get('/new', (req, res) => {

  const userID = req.session.user_id;
  templateVars = { user : userID };

  res.render('new_listing', templateVars);
});


// GET /listings/favourites
router.get('/favourites', (req, res) => {

  const templateVars = {};
  const userID = req.session.user_id;
  templateVars.user = userID;

  usersQueries.getAllUsers()
  .then(usersData => {
    templateVars.users = usersData;
    return favouritesQueries.getFavouriteListings(userID);
  })
  .then((favListingsData) => {
    templateVars.favourites = favListingsData;
    res.render('favourites', templateVars);
  })
  .catch(errorMessage => res.send(errorMessage));
});


// GET /listings/:id
router.get('/:id', (req, res) => {

  const listingID = req.params.id;
  const userID = req.session.user_id;

  let temp = {};
  temp.user = userID;

  usersQueries.getAllUsers()
  .then((UsersData) => {
    temp.users = UsersData;
    return commentsQueries.getCommentsById(listingID);
  })
  .then((commentData) => {
    temp.comments = commentData;
    return listingsQueries.getListing(listingID);
  })
  .then((listingData) => {
    temp.listing = listingData;
    res.render('listing', temp);
  })
  .catch(errorMessage => res.send(errorMessage));
});



// GET /listings
router.get('/', (req, res) => {

  const userID = req.session.user_id;

  let temp = {};
  temp.user = userID;

  usersQueries.getAllUsers()
  .then((UsersData) => {
    temp.users = UsersData;
    return listingsQueries.getAllListings(req.query);
  })
  .then((listingsData) => {
    temp.listings = listingsData;
    return favouritesQueries.getFavouriteListings(userID);
  })
  .then((favListingsData) => {
    temp.favourites = favListingsData;
    res.render('listings', temp);
  })
  .catch(errorMessage => res.send(errorMessage));
});


// IMPLEMENT LOGGED IN CHECK
// POST /listings/:id (post comment)
router.post('/:id', (req, res) => {

  // Capture listing, user and comment
  const userID = req.session.user_id;
  const listingID = req.params.id;
  const commentContent = req.body['new-comment'];

  commentsQueries.createNewComment(listingID, userID, commentContent)
  .then((createdComment) => {
    return commentsQueries.getCommentsById(listingID);
  })
  .then((allComments) => {
    res.send(allComments[allComments.length - 1]);
  })
  .catch((errorMessage) => res.send(errorMessage));
})



// POST /listings/:id/favourite (add to favourites)
router.post('/:id/favourite', (req, res) => {

  const listingID = req.params.id;
  const userID = req.session.user_id;

  favouritesQueries.addToFavourites(userID, listingID)
  .then(data => {
    res.json(data);
  })
  .catch(errorMessage => res.send(errorMessage));
});


// DELETE /listings/:id/favourite (remove from favourites)
router.delete('/:id/favourite', (req, res) => {

  const listingID = req.params.id;
  const userID = req.session.user_id;

  favouritesQueries.removeFromFavourites(userID, listingID)
  .then(data => {
    res.json(data);
  })
  .catch(errorMessage => res.send(errorMessage));
});


// POST /listings (create new listing)
router.post('/', (req, res) => {

  // Capture listing attributes from the form and owner's id
  const listingAttributes = {
    ...req.body,
    owner_id : req.session.user_id
  };

  listingsQueries.createListing(listingAttributes)
  .then((createdListing) => {
    res.redirect('listings/my_listings');
  })
  .catch(errorMessage => res.send(errorMessage));
});


// PATCH /listings/:id/sold
router.patch('/:id/sold', (req, res) => {

  const listingID = req.params.id;

  listingsQueries.markListingSold(listingID)
  .then(soldListing => {
    res.json(soldListing);
  })
  .catch(errorMessage => res.send(errorMessage));
});

// DELETE /listings/:id (status deleted)
router.delete('/:id', (req, res) => {

  const listingID = req.params.id;

  listingsQueries.deleteListing(listingID)
  .then(data => {
    res.json(data);
  })
  .catch((errorMessage) => res.send(errorMessage));
});



module.exports = router;
