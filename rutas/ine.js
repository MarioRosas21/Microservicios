const express = require('express');
const router = express.Router();
const ineController = require('../controllers/ineController');

// Insertar datos en /api/ine
router.post('/ine', ineController.insertarDatos);

// Buscar por CURP en /api/ine/:curp
router.get('/ine/:curp', ineController.buscarPorCurp);

// Eliminar por CURP en /api/ine/:curp
router.delete('/ine/:curp', ineController.eliminarPorCurp);

// Eliminar por id en /api/ine/id/:id
router.delete('/ine/id/:id', ineController.eliminarPorId);

// Obtener todos los datos en /api/ine
router.get('/ine', ineController.obtenerTodos);

module.exports = router;
