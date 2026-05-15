const express = require('express');
const router = express.Router();
const { signup, login, logout, me } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { signupValidator, loginValidator } = require('../validators/auth.validator');
const { validate } = require('../middleware/validate.middleware');

router.post('/signup', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

module.exports = router;
