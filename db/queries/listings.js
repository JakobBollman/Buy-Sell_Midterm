const db = require('../connection');


// General use function to retrieve listings with or without search/filters
const getAllListings = (options) => {
  const queryParams = [];
  let queryString = `SELECT * FROM listings`

  // I think this will capture the 'seach' field, and then we'll query the submitted search against the 'titles'
  if (options.title) {
    queryParams.push(`%${options.title}%`);
    if (queryParams.length === 1) {
      queryString += `WHERE title ILIKE $${queryParams.length} `;
    } else {
      queryString += `AND title ILIKE $${queryParams.length} `;
    }
  }

  //I'm hoping we can set this for clicking on the 'owner' of any listing
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }

  //seach filter for price, 'min' and 'max_price' will have to be options on the search form we create
  if (options.min_price) {
    queryParams.push(options.min_price);
    if (queryParams.length === 1) {
      queryString += `WHERE price >= $${queryParams.length} `;
    } else {
      queryString += `AND price >= $${queryParams.length} `;
    }
  }
  if (options.max_price) {
    queryParams.push(options.max_price);
    if (queryParams.length === 1) {
      queryString += `WHERE price <= $${queryParams.length} `;
    } else {
      queryString += `AND price <= $${queryParams.length} `;
    }
  }

  //ideally we can make the category part of the search form a drop down bar that only allows the correct category options
  if (options.category) {
    queryParams.push(options.category);
    if (queryParams.length === 1) {
      queryString += `WHERE category = $${queryParams.length} `;
    } else {
      queryString += `AND category = $${queryParams.length} `;
    }
  }

  //this is intended to check if any options have been entered, and then add WHERE or AND to filter out deleted listings. need to check on whether 'active' needs single quotes. Should apply on every instance of the query
  if (queryParams.length === 1) {
    queryString += `WHERE active_status = active`;
  } else {
    queryString += `AND active_status = active`;
  }
  queryString += `
  GROUP BY listings.id
  ORDER BY price
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
  .then(data => {
    return data.rows[0];
  })
  .catch(err => {
    return err.message;
  });
}
const getMyListings = (userID) => {
  return db.query(`SELECT * FROM listings WHERE owner_id = ${userID}`)
  .then((data) => {
    return data.rows;
  })
}
const markListingSold = (id) => {
  return db.query('UPDATE TABLE listings SET sold_status = true WHERE id = $1 RETURNING *', [id])
  .then(data => {
    return;
  })
  .catch(err => {
    return err.message;
  });
}

const deleteListing = (id) => {
  return db.query('UPDATE TABLE listings SET active_status = deleted WHERE id = $1 RETURNING *', [id])
  .then((data) => {
    return;
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
