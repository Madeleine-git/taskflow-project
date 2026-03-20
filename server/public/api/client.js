const API_URL = '/api/v1/libros';

async function obtenerLibros() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener libros');
  return response.json();
}

async function crearLibro(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear libro');
  return response.json();
}

async function eliminarLibro_api(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar libro');
}

async function actualizarLibro(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar libro');
  return response.json();
}