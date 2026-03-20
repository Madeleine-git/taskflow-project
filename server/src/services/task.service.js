const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/data.json');

function leerLibros() {
    try {
        const contenido = fs.readFileSync(DATA_PATH, 'utf-8');
        return JSON.parse(contenido);
    } catch {
        return [];
    }
}

function guardarLibros(libros) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(libros, null, 2));
}

function obtenerTodos() {
    return leerLibros();
}

function crearLibro(data) {
    const libros = leerLibros();
    const nuevoLibro = {
        id: Date.now(),
        ...data,
    };
    libros.push(nuevoLibro);
    guardarLibros(libros);
    return nuevoLibro;
}

function actualizarLibro(id, data) {
    const libros = leerLibros();
    const index = libros.findIndex((l) => l.id === Number(id));
    if (index === -1) throw new Error('NOT_FOUND');
    libros[index] = { ...libros[index], ...data };
    guardarLibros(libros);
    return libros[index];
}

function eliminarLibro(id) {
    const libros = leerLibros();
    const index = libros.findIndex((l) => l.id === Number(id));
    if (index === -1) throw new Error('NOT_FOUND');
    libros.splice(index, 1);
    guardarLibros(libros);
}

module.exports = { obtenerTodos, crearLibro, actualizarLibro, eliminarLibro };