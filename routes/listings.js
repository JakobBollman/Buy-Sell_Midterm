const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

const listingsQueries = require('../db/queries/listings');
const favouritesQueries = require('../db/queries/favourites');
const usersQueries = require('../db/queries/users');
const commentsQueries = require('../db/queries/comments');


// STRETCH Route to see a user's listings
router.get('/my_listings', (req, res) => {
  const templateVars = {}
  const userID = req.session.user_id;

  // Query for all listings
  listingsQueries.getMyListings(userID)
  .then((listingsData) => {
    templateVars.myListings = listingsData
    templateVars.user = userID
    res.render('my_listings',templateVars);
  })
  .catch(errorMessage => res.send(errorMessage));
});


// GET /listings/new
router.get('/new', (req, res) => {
  const userID = req.session.user_id;
  templateVars = {user : userID}
  res.render('new_listing', templateVars);
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
      templateVars.user = userID;
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
  const userID = req.session.user_id;
  let temp = {};

  usersQueries.getAllUsers()
  .then((UsersData) => {

    temp.users = UsersData;
    temp.user = userID;

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
  });
});



// GET /listings
router.get('/', (req, res) => {
  const userID = req.session.user_id;
  let temp = {}

  // Three functions here get us query data that was difficult/impossible to join, and passes it to EJS
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
        temp.user = userID;
        res.render('listings', temp);
      })
      .catch((errorMessage) => res.send(errorMessage));
    })
  })
});


// POST /listings/:id (post comment)

router.post('/:id', (req, res) => {

  // Capture listing, user and comment
  const listingID = req.params.id;
  console.log('listingID:', listingID)
  const userID = req.session.user_id;
  const commentContent = req.body['new-comment'];

  commentsQueries.createNewComment(listingID, userID, commentContent)
  .then(() => {
    commentsQueries.getCommentsById(listingID)
  })
  .then((data) => {
    console.log('log in route', data)
    res.send(data[data.length - 1]);
  })
  .catch((errorMessage) => res.send(errorMessage));
})



// POST /listings/:id/favourite
router.post('/:id/favourite', (req, res) => {

  // Capture listing id and user id
  const listingID = req.params.id;
  const userID = req.session.user_id;

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
    res.redirect('listings/my_listings');
  })
  .catch((errorMessage) => res.send(errorMessage));
});


// PATCH /listings/:id/sold
router.patch('/:id/sold', (req, res) => {

  // Capture listing id
  const listingID = req.params.id;

  // Query to mark listing as sold
  listingsQueries.markListingSold(listingID)
  .then(soldListing => {
    console.log('route', soldListing);
    res.json(soldListing);
  })
  .catch(errorMessage => res.send(errorMessage));
});


// DELETE /listings/:id (status deleted)
router.delete('/:id', (req, res) => {

  // Capture listing id parameter
  const listingID = req.params.id;

  // Query to mark listing as deleted
  listingsQueries.deleteListing(listingID)
  .then(data => {
    res.json(data);
  })
  .catch((errorMessage) => res.send(errorMessage));
});


module.exports = router;
