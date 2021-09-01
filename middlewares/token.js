const jwt = require("jsonwebtoken");

module.exports = (user_id) => {
  jwt.sign({ user_id }, process.env.JWT_SECRET, (err, token) => {
    if (err) next(err);
    return token;
  });
};
