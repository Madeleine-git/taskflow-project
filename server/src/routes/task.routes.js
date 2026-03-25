const { Router } = require('express');
const libroController = require('../controllers/task.controller');

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Libro:
 *       type: object
 *       required:
 *         - titulo
 *         - categoria
 *       properties:
 *         id:
 *           type: number
 *           description: ID único generado automáticamente
 *         titulo:
 *           type: string
 *           description: Título del libro
 *         categoria:
 *           type: string
 *           enum: [novela, ciencia-ficcion, historia, programacion]
 *         estado:
 *           type: string
 *           enum: [disponible, prestado]
 *         fechaAgregado:
 *           type: string
 *           format: date-time
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         marcado:
 *           type: boolean
 */

/**
 * @swagger
 * /api/v1/libros:
 *   get:
 *     summary: Obtener todos los libros
 *     tags: [Libros]
 *     responses:
 *       200:
 *         description: Lista de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 */
router.get('/', libroController.obtenerLibros);

/**
 * @swagger
 * /api/v1/libros:
 *   post:
 *     summary: Crear un nuevo libro
 *     tags: [Libros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - categoria
 *             properties:
 *               titulo:
 *                 type: string
 *               categoria:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Libro creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', libroController.crearLibro);

/**
 * @swagger
 * /api/v1/libros/{id}:
 *   patch:
 *     summary: Actualizar un libro
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Libro actualizado
 *       404:
 *         description: Libro no encontrado
 */
router.get('/error-test', (req, res, next) => {
  next(new Error('Error interno forzado para pruebas'));
});

router.patch('/:id', libroController.actualizarLibro);

/**
 * @swagger
 * /api/v1/libros/{id}:
 *   delete:
 *     summary: Eliminar un libro
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Libro eliminado
 *       404:
 *         description: Libro no encontrado
 */
router.delete('/:id', libroController.eliminarLibro);

/**
 * @swagger
 * /api/v1/libros/error-test:
 *   get:
 *     summary: Forzar error 500 (solo para pruebas)
 *     tags: [Libros]
 *     responses:
 *       500:
 *         description: Error interno del servidor
 */


module.exports = router;