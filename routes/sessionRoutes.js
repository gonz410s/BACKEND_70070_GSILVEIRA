const express = require('express');
const passport = require('passport');
const { login } = require('../controllers/sessionController');
const router = express.Router();
const User = require('../models/User');
const sessionController = require('../controllers/sessionController');


// Ruta de login
router.post('/login', login);

// Ruta para obtener el usuario autenticado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
