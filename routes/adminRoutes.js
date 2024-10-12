// adminRoutes.js
const express = require('express');
const { renderAdminDashboard } = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/admin/dashboard', authenticate, renderAdminDashboard);

module.exports = router;
