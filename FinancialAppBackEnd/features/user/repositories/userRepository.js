const User = require("../models/user");

exports.findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

exports.saveUser = async ({ name, email, password }) => {
  try {
    const user = new User({ name, email, password });
    const savedUser = await user.save();
    return savedUser;
  } catch (err) {
    throw err;
  }
};

exports.findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};
