const User = require('../models/User');

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { first_name, last_name, email, age, password, cart, role } = req.body;
  try {
    const newUser = new User({ first_name, last_name, email, age, password, cart, role });
    await newUser.save();
    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, age, password, cart, role } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;
    user.age = age || user.age;
    user.cart = cart || user.cart;
    user.role = role || user.role;

    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    await user.save();
    res.status(200).json({ message: 'Usuario actualizado', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario eliminado', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
