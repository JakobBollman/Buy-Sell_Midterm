const getAllUsers = () => {
  return db.query(`SELECT * FROM users`)
  .then(users => {
    return users.rows
  })
};


module.exports = {getAllUsers};
