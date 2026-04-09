const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../users/User.model');

const registerUser = async ({ fullName, email, documentId, password, municipality }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('El email ya está registrado');
    err.statusCode = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, documentId, passwordHash, municipality });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  return { token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    const err = new Error('Credenciales inválidas'); err.statusCode = 401; throw err;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Credenciales inválidas'); err.statusCode = 401; throw err;
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  return { token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } };
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) { const err = new Error('Usuario no encontrado'); err.statusCode = 404; throw err; }
  return user;
};

module.exports = { registerUser, loginUser, getUserById };