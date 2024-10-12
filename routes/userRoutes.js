// userRoutes.js
const express = require('express');
const {
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();
// Ruta para obtener la información del usuario autenticado
router.get('/current', authenticate, (req, res) => {
    res.json({ message: 'Bienvenido', user: req.user });
  });
router.get('/users', authenticate, getUsers);
router.put('/users/:id', authenticate, updateUser);
router.post('/users/admin/delete/:id', authenticate, deleteUser);

module.exports = router;
