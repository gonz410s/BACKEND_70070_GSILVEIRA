const express = require('express');
const passport = require('passport');
const { login } = require('../controllers/sessionController');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/login', (req, res) => {
  const token = req.signedCookies.currentUser;
  if (token) {
    return res.redirect('/current');
  }
  res.render('login');
});

// Ruta para login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validar que el usuario existe
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Login failed!' });
  }

  // Validar la contraseña
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Login failed!' });
  }

  // Generar JWT
  const token = jwt.sign(
    { id: user._id, first_name: user.first_name, last_name: user.last_name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Almacenar el JWT en una cookie firmada
  res.cookie('currentUser', token, { httpOnly: true, signed: true });
  
  // Redirigir a la vista /current
  res.redirect('/current');
});

router.get('/current', authenticate, (req, res) => {
  // Si el usuario está autenticado, renderizamos la vista con sus datos
  res.render('current', { user: req.user });
});

module.exports = router;
// Ruta para obtener el usuario autenticado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
