const db = require('../connection');


// General use function to retrieve listings with or without search/filters
// Refactor to accept search/filters in options object (ref LightBnB getAllProperties)
const getListings = (options) => {
  return db.query('SELECT * FROM listings;')
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      return err.message;
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
  // Assign content of listingAttributes object to variables
  const {
    owner_id,
    title,
    description,
    price,
    category,
  } = listingAttributes;

  // Place variables into array in correct order
  const queryParams = [
    owner_id,
    title,
    description,
    price,
    category,
  ];

  // Pass array to insertion query
  return db.query(`INSERT INTO listings (owner_id, title, description, price, category)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
  queryParams
  )
  .then (data => {
    return data.rows[0];
  });
}

const markListingSold = (id) => {
  return db.query('UPDATE TABLE listings SET sold_status = true WHERE id = $1 RETURNING *', [id])
  .then((data) => {
    return;
  })
}

const deleteListing = (id) => {
  return db.query('UPDATE TABLE listings SET active_status = deleted WHERE id = $1 RETURNING *', [id])
  .then((data) => {
    return;
  });
}


module.exports = {
  getListings,
  getListing,
  getFavouriteListings,
  createListing,
  deleteListing,
  markListingSold,
};
