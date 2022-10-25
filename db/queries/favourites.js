const db = require("../connection");

const getFavouriteListings = (userID) => {
  return db.query(`
    SELECT * FROM listings
    JOIN favourites ON listings.id = listing_id
    WHERE user_id = $1
    GROUP BY favourites.id`,
    [userID]
  )
  .then (data => {
    return data.rows;
  });
};


const addToFavourites = (userID, listingID) => {
  return db.query(`
    INSERT INTO favourites (user_id, listing_id)
    VALUES (${userID}, ${listingID});
  `)
  .then (data => {
    return data.rows;
  });
};

const removeFromFavourites = (userID, listingID) => {
  return db.query(`DELETE FROM favourites WHERE user_id = ${userID} AND listing_id = ${listingID}`)
  .then (data => {
    return data.rows;
  });
};

module.exports
{getFavouriteListings, addToFavourites, removeFromFavourites}
