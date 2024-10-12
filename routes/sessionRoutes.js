// sessionRoutes.js
const express = require('express');
const {
  renderLogin,
  renderRegister,
  login,
  logout,
  register,
} = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

module.exports = router;
