const libroService = require('../services/task.service');

function obtenerLibros(req, res) {
  const libros = libroService.obtenerTodos();
  res.status(200).json(libros);
}

function crearLibro(req, res) {
  const { titulo, categoria, estado } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  if (!categoria) {
    return res.status(400).json({ error: 'La categoría es obligatoria' });
  }

  const nuevoLibro = libroService.crearLibro({
    titulo,
    categoria,
    estado: estado || 'disponible',
    fechaAgregado: new Date().toISOString(),
    rating: 0,
    marcado: false,
  });

  res.status(201).json(nuevoLibro);
}

function actualizarLibro(req, res) {
  try {
    const libroActualizado = libroService.actualizarLibro(req.params.id, req.body);
    res.status(200).json(libroActualizado);
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

function eliminarLibro(req, res) {
  try {
    libroService.eliminarLibro(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { obtenerLibros, crearLibro, actualizarLibro, eliminarLibro };