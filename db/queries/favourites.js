const db = require("../connection");

const getFavouriteListings = (userID) => {
  return db
  .query(`
  SELECT listings.id, title, description, price, category, sold_status, owner_id, photo_url
  FROM listings
  JOIN favourites ON listing_id = listings.id
  WHERE user_id = $1
  AND active_status = 'active';`,
  [userID])

  .then (data => {
    return data.rows;
  })

  .catch(err => {
    return err.message;
  });
};


const addToFavourites = (userID, listingID) => {
  return db
  .query(`
  INSERT INTO favourites (user_id, listing_id)
  VALUES ($1, $2)
  RETURNING *`,
  [userID, listingID])

  .then (data => {
    return data.rows[0];
  })

  .catch(err => {
    return err.message;
  });
};


const removeFromFavourites = (userID, listingID) => {
  return db
  .query(`
  DELETE FROM favourites
  WHERE user_id = $1 AND listing_id = $2
  RETURNING *`,
  [userID, listingID])

  .then (data => {
    return data.rows[0];
  })

  .catch(err => {
    return err.message;
  });
};

module.exports = {
  getFavouriteListings,
  addToFavourites,
  removeFromFavourites,
};
