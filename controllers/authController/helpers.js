const jwt = require('jsonwebtoken');

exports.generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_TOKEN_KEY, {
    expiresIn: '5000000',
  });
};
