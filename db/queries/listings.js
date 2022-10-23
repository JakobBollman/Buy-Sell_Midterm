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


const createListing = (listingAttributes) => {
  // Placeholder listing attributes (to be replaced with listingAttributes argument)
  const attributes = [
    7,
    'Test Product',
    'Test product by the Mayor',
    99,
    'Misc',
    false,
    'active'
  ];
  return db.query(`INSERT INTO listings (owner_id, title, description, price, category, sold_status, active_status)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *`,
  attributes
  )
  .then (data => {
    return data.rows[0];
  });
}

module.exports = {
  getListings,
  getListing,
  getFavouriteListings,
  createListing,
};
