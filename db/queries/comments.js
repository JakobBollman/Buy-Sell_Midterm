const db = require("../connection");

const getCommentsById = (listingID) => {
  return db.query(`
    SELECT * FROM comments
    WHERE listing_id = $1`, [listingID])
  .then(data => {
    return data.rows;
  })
  .catch(err => {
    return err.message;
  })
};


const createNewComment = (listingID, userID, comment) => {
  const queryParams = [listingID, userID, comment]
  return db
  .query(`INSERT INTO comments (user_id, listing_id, content)
  VALUES ($1, $2, $3)
  RETURNING *;`,
  queryParams
  )
  .then(data => {
    return data.rows;
  })
  .catch(err => {
    return err.message;
  });
  }


module.exports =
{getCommentsById,
createNewComment
}
