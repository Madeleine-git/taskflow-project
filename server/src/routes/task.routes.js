const { Router } = require('express');
const libroController = require('../controllers/task.controller');

const router = Router();

router.get('/', libroController.obtenerLibros);
router.post('/', libroController.crearLibro);
router.patch('/:id', libroController.actualizarLibro);
router.delete('/:id', libroController.eliminarLibro);

module.exports = router;