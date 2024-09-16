require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const User = require('./models/User');
require('./config/passport'); // Archivo de configuración de Passport

const sessionRoutes = require('./routes/sessionRoutes');

const app = express();

const userRoutes = require('./routes/userRoutes');

const sessionController = require('./controllers/sessionController');


app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

// Rutas de usuarios
app.use('/api/users', userRoutes);

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error(err));

// Rutas
app.use('/api/sessions', sessionRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
