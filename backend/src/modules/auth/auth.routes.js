const { Router } = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const { loginSchema } = require('./auth.schemas');

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
