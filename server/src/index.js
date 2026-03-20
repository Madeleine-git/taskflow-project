require('./config/env');
const express = require('express');
const cors = require('cors');
const path = require('path');
const taskRoutes = require('./routes/task.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/api/v1/libros', taskRoutes);

// Middleware global de errores
app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Arrancar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});


