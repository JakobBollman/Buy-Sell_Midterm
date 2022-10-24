const db = require("../connection");

const getFavouriteListings = (userId) => {
  return db.query(`
    SELECT * FROM listings
    JOIN favourites ON listings.id = listing_id
    WHERE user_id = $1
    GROUP BY listing_id;`,
    [userId]
  )
  .then (data => {
    return data.rows;
  });
};


const addToFavourites = (userId, listingId) => {
  return db.query(`
    INSERT INTO favourites (user_id, listing_id)
    VALUES (${userId}, ${listingId});
  `)
}

const removeFromFavourites = (userId, listingId) => {
  return db.query(`DELETE FROM favourites WHERE user_id = ${userId} AND listing_id = ${listingId}`)
}
module.exports
{getFavouriteListings, addToFavourites, removeFromFavourites}
