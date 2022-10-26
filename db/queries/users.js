const db = require('../connection');

const getAllUsers = () => {
  return db.query(`SELECT * FROM users`)
  .then(users => {
    return users.rows
  })
  .catch(err => {
    return err.message;
  });
};




module.exports = {getAllUsers};
