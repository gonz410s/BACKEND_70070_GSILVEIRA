require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { engine } = require('express-handlebars'); // Cambiado aquí
const sessionRoutes = require('./routes/sessionRoutes'); // Rutas de sesión
const userRoutes = require('./routes/userRoutes'); // Rutas de usuarios
require('./config/passport'); // Estrategia de Passport (JWT)
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // Firmar cookies con JWT_SECRET
app.use(passport.initialize());

// Configuración de Handlebars
app.engine('handlebars', engine()); 
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error(err));

// Rutas
app.use('/api/users', userRoutes);        // CRUD de usuarios
app.use('/api/sessions', sessionRoutes);  // Login y autenticación

// Vista para login y usuario actual
app.get('/login', (req, res) => {
  const token = req.signedCookies.currentUser;  // Chequear si ya tiene token
  if (token) {
    return res.redirect('/current');  // Redirigir al usuario actual si está logueado
  }
  res.render('login'); // Renderizar la vista de login
});

// Vista actual del usuario
app.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Renderizar los datos del usuario autenticado
  res.render('current', { user: req.user });  
});

// Ruta para logout (borrar cookie)
app.get('/logout', (req, res) => {
  res.clearCookie('currentUser');  // Limpiar la cookie firmada
  res.redirect('/login');          // Redirigir al login
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
