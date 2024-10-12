const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Asegúrate de que la ruta sea correcta

// Conectar a MongoDB
mongoose.connect('mongodb+srv://gonz410:lalala@clustergonza.qd3uj.mongodb.net/integrative_practice?retryWrites=true&w=majority', { // Reemplaza con tus credenciales
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB');
})
.catch(err => {
  console.error('Error conectando a MongoDB', err);
});

// Hashear contraseñas
async function hashPasswords() {
  try {
    const users = await User.find();

    for (const user of users) {
      // Hashear la contraseña
      const hashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      user.password = hashedPassword;

      // Guardar el usuario con la contraseña hasheada
      await user.save();
      console.log(`Contraseña hasheada para el usuario: ${user.email}`);
    }

    console.log('Todos los usuarios han sido actualizados con contraseñas hasheadas.');
  } catch (error) {
    console.error('Error al hashear las contraseñas:', error);
  } finally {
    mongoose.connection.close(); // Cerrar la conexión
  }
}

// Ejecutar la función
hashPasswords();
