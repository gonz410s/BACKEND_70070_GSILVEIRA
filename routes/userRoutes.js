const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

// Crear un nuevo usuario
router.post('/', createUser);

// Obtener todos los usuarios
router.get('/', getUsers);

// Obtener un usuario por ID
router.get('/:id', getUserById);

// Actualizar un usuario por ID
router.put('/:id', updateUser);

// Eliminar un usuario por ID
router.delete('/:id', deleteUser);

module.exports = router;
