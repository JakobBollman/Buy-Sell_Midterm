const db = require('../connection');

// General use function to retrieve listings with or without search/filters
// Refactor to accept search/filters in options object (ref LightBnB getAllProperties)
const getListings = (options) => {
  return db.query('SELECT * FROM listings;')
    .then(data => {
      return data.rows;
    });
};


const getListing = (id) => {
  return db.query(`
    SELECT * FROM listings
    LEFT JOIN comments ON listings.id = listing_id
    WHERE listings.id = $1;`,
    [id]
  )
    .then (data => {
      return data.rows[0];
    });
};

const getFavouriteListings = (userId) => {
  return db.query(`
    SELECT * FROM listings
    JOIN favourites ON listings.id = listing_id
    WHERE user_id = $1;`,
    [userId]
  )
  .then (data => {
    return data.rows;
  });
};



module.exports = {
  getListings,
  getListing,
  getFavouriteListings,
};
