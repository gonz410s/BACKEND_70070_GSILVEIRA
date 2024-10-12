// adminController.js
const User = require('../models/User');

// Renderizar el panel de administración
const renderAdminDashboard = async (req, res) => {
  try {
    const users = await User.find();
    res.render('dashboard/dashboard', { users, title: 'Panel de Administración' });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).render('error', { error: err.message });
  }
};

module.exports = {
  renderAdminDashboard,
};
