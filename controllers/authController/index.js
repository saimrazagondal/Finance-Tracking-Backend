const User = require('../../models/userModel');
const { validateSchema } = require('../../utils/validation');
const { loginSchema, signupSchema } = require('./schema');

const login = async (req, res, next) => {
  try {
    await validateSchema(loginSchema, req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: 'User does not exist',
      });

    if (user.password !== password)
      return res.status(400).json({
        message: 'Invalid email/password',
      });

    delete user.password;

    return res.status(200).json({
      token: '',
      userData: user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const signup = async (req, res, next) => {
  try {
    await validateSchema(signupSchema, req.body);

    const { firstName, lastName, email, password } = req.body;

    User.create({ firstName, lastName, email, password });
    return res.status(201).json({
      token: '',
      userData: '',
    });
  } catch (err) {
    return res.status(500).json({ message: err?.message });
  }
};

module.exports = { login, signup };
