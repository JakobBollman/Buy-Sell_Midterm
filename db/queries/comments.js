const db = require("../connection");

const getCommentsById = (listingID) => {
  return db.query(`
    SELECT users.name, comments.id, user_id, listing_id , content
    FROM comments
    JOIN users ON users.id = user_id
    WHERE listing_id = $1
    ORDER BY comments.id`, [listingID])
  .then(data => {
    return data.rows;
  })
  .catch(err => {
    return err.message;
  })
};


const createNewComment = (listingID, userID, comment) => {

  return db
  .query(`INSERT INTO comments (user_id, listing_id, content)
  VALUES ($1, $2, $3)`,
  [userID, listingID, comment]
  )
  .then(data => {

  })
  .catch(err => {
    return err.message;
  });
};


module.exports = {
  getCommentsById,
  createNewComment
};
