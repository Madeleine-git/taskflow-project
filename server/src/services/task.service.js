const data = require('../data/data.json');

let libros = [...data];

function obtenerTodos() {
    return libros;
}

function crearLibro(data) {
    const nuevoLibro = {
        id: Date.now(),
        ...data,
    };
    libros.push(nuevoLibro);
    return nuevoLibro;
}

function actualizarLibro(id, data) {
    const index = libros.findIndex((l) => String(l.id) === String(id));
    if (index === -1) throw new Error('NOT_FOUND');
    libros[index] = { ...libros[index], ...data };
    return libros[index];
}

function eliminarLibro(id) {
    const index = libros.findIndex((l) => String(l.id) === String(id));
    if (index === -1) throw new Error('NOT_FOUND');
    libros.splice(index, 1);
}

module.exports = { obtenerTodos, crearLibro, actualizarLibro, eliminarLibro };