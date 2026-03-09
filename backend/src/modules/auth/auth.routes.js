import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate, registerSchema, loginSchema } from './auth.validator.js';

const router = Router();

// Validate input first, then run the controller
router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.post('/refresh',                            authController.refresh);
router.post('/logout',                             authController.logout);
router.get('/verify-email',                        authController.verifyEmail);

export default router;