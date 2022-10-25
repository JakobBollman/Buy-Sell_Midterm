const db = require("../connection");

const getFavouriteListings = (userID) => {
  return db.query(`
    SELECT * FROM favourites
    JOIN listings ON listing_id = listings.id
    WHERE user_id = $1
    GROUP BY favourites.id`,
    [userID]
  )
  .then (data => {
    return data.rows;
  })
  .catch(err => {
    return err.message;
  });
};


const addToFavourites = (userID, listingID) => {
  return db.query(`
    INSERT INTO favourites (user_id, listing_id)
    VALUES (${userID}, ${listingID});
  `)
  .then (data => {
    return data;
  })
  .catch(err => {
    return err.message;
  });
};


const removeFromFavourites = (userID, listingID) => {
  return db.query(`DELETE FROM favourites WHERE user_id = ${userID} AND listing_id = ${listingID}`)
  .then (data => {
    return data.rows;
  });
};

module.exports = {
  getFavouriteListings,
  addToFavourites,
  removeFromFavourites,
};
