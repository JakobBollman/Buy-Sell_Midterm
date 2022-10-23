const db = require('../connection');

// General function
// Refactor to accept filters in options object (ref LightBnB getAllProperties)
const getListings = (options) => {
  return db.query('SELECT * FROM listings LIMIT 10;')
    .then(data => {
      return data.rows;
    });
};

const getListing = (id) => {
  return db.query(`SELECT * FROM listings WHERE id = $1;`, [id])
    .then (data => {
      return data.rows[0];
    });
};

const getFavouriteListings = (userId) => {
  return db.query(`
    SELECT * FROM listings
    JOIN favourites ON users.id = user_id
    WHERE users.id = $1;`,
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
