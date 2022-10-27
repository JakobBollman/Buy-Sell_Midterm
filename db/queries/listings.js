const db = require('../connection');


// General use function to retrieve listings with or without search/filters
const getAllListings = (options) => {
  const queryParams = [];
  let queryString = `SELECT * FROM listings WHERE active_status = 'active'`

  // I think this will capture the 'seach' field, and then we'll query the submitted search against the 'titles'
  if (options.title) {
    queryParams.push(`%${options.title}%`);
    queryString += `AND title ILIKE $${queryParams.length} `;
    }

  //I'm hoping we can set this for clicking on the 'owner' of any listing
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length} `;
    }

  //seach filter for price, 'min' and 'max_price' will have to be options on the search form we create
  if (options.min_price) {
    queryParams.push(options.min_price);
    queryString += `AND price >= $${queryParams.length} `;
    }

  if (options.max_price) {
    queryParams.push(options.max_price);
    queryString += `AND price <= $${queryParams.length} `;
    }

  //ideally we can make the category part of the search form a drop down bar that only allows the correct category options
  //will need changes to work with multiple category selection
  if (options.category) {
    queryParams.push(options.category);
    queryString += `AND category = $${queryParams.length} `;
  }

  queryString += `
  GROUP BY listings.id
  ORDER BY price;
  `;

  return db.query(queryString, queryParams)
  .then(data => {
    return data.rows
  })
  .catch(err => {
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
  .then(data => {
    return data.rows[0];
  })
  .catch(err => {
    return err.message;
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
    photo_url
  } = listingAttributes;

  // Place variables into array in correct order
  const queryParams = [
    owner_id,
    title,
    description,
    price,
    category,
    photo_url
  ];

  // Pass array to insertion query
  return db.query(`INSERT INTO listings (owner_id, title, description, price, category, photo_url)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;`,
  queryParams
  )
  .then(data => {
    return data.rows[0];
  })
  .catch(err => {
    return err.message;
  });
}


const getMyListings = (userID) => {
  return db.query(`SELECT users.name, listings.id, owner_id, title, description, price, photo_url, sold_status, active_status FROM listings JOIN users ON users.id = owner_id WHERE owner_id = $1 ORDER BY sold_status, id;`, [userID])
  .then((listings) => {
    return listings.rows;
  })
  .catch(err => {
    return err.message;
  });
}


const markListingSold = (id) => {
  return db.query(`UPDATE listings
  SET sold_status = true
  WHERE id = $1 RETURNING *;`, [id])
  .then(data => {
    return data.rows[0];
  })
  .catch(err => {
    return err.message;
  });
}


const deleteListing = (id) => {
  return db.query(`UPDATE listings
  SET active_status='deleted'
  WHERE id = $1 RETURNING *;`, [id])
  .then(deletedListing => {
    return deletedListing.rows[0];
  })
  .catch(err => {
    return err.message;
  });
}


module.exports = {
  getAllListings,
  getListing,
  getMyListings,
  createListing,
  deleteListing,
  markListingSold,
};
