import * as usersService from './users.service.js';
import { sendSuccess } from '../../utils/response.js';

// GET /api/users/me
export const getProfile = async (req, res, next) => {
  try {
    const user = await usersService.getProfile(req.user.userId);
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/me
export const updateProfile = async (req, res, next) => {
  try {
    const user = await usersService.updateProfile(req.user.userId, req.body);
    sendSuccess(res, { user }, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

// GET /api/users/me/sessions
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await usersService.getSessions(req.user.userId);
    sendSuccess(res, { sessions });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/me/sessions
export const logoutAllDevices = async (req, res, next) => {
  try {
    await usersService.logoutAllDevices(req.user.userId);
    sendSuccess(res, {}, 'Logged out from all devices');
  } catch (err) {
    next(err);
  }
};