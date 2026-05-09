const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');

router.post('/:tipoCuenta/register', authController.registrar);
router.post('/:tipoCuenta/login', authController.login);

module.exports = router;
