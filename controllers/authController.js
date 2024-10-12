// authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Renderizar la vista de login
const renderLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

// Renderizar la vista de registro
const renderRegister = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

// Iniciar sesión
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: user._id, first_name: user.first_name, last_name: user.last_name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('currentUser', token, { httpOnly: true, signed: true });
    res.redirect('/current');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Registrar un nuevo usuario
const register = async (req, res) => {
  const { first_name, last_name, email, password, age, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error });
  }
};

// Cerrar sesión
const logout = (req, res) => {
  res.clearCookie('currentUser');
  res.redirect('/login');
};

module.exports = {
  renderLogin,
  renderRegister,
  login,
  logout,
  register,
};
