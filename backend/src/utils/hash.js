import bcrypt from 'bcryptjs';
import { CONSTANTS } from '../config/constants.js';

// Hash a plain password before saving to DB
export const hashPassword = (password) => {
  return bcrypt.hash(password, CONSTANTS.SALT_ROUNDS);
};

// Compare plain password with stored hash
export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};