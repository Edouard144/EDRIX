import * as queries from './users.queries.js';

export const getProfile = async (userId) => {
  const user = await queries.getUserById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const updateProfile = async (userId, body) => {
  const updated = await queries.updateUser(userId, body);
  return updated;
};

export const getSessions = async (userId) => {
  return await queries.getUserSessions(userId);
};

export const logoutAllDevices = async (userId) => {
  await queries.revokeAllSessions(userId);
};