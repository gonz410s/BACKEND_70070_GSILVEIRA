require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path'); 
const { engine } = require('express-handlebars');
const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
// Inicializar la app
const app = express();

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Establece el directorio de vistas

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para manejar formularios
app.use(cookieParser()); // Parsear cookies firmadas
app.use(passport.initialize()); // Inicializar Passport

// Rutas estáticas para archivos CSS, JS, imágenes, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para usuarios y sesiones
app.use('/api/users', userRoutes); // Rutas relacionadas con usuarios (CRUD)
app.use('/api/sessions', sessionRoutes); // Rutas relacionadas con sesiones (login, registro, etc.) 

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb+srv://gonz410:lalala@clustergonza.qd3uj.mongodb.net/integrative_practice?retryWrites=true&w=majority')
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión:', err));

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
