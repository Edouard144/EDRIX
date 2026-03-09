import { Router } from 'express';
import * as usersController from './users.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

// requireAuth runs first on every route below
router.get('/me',              requireAuth, usersController.getProfile);
router.patch('/me',            requireAuth, usersController.updateProfile);
router.get('/me/sessions',     requireAuth, usersController.getSessions);
router.delete('/me/sessions',  requireAuth, usersController.logoutAllDevices);

export default router;