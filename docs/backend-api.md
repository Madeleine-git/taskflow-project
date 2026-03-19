# Herramientas del ecosistema backend

## Axios

Librería HTTP para el navegador y Node.js. Es una alternativa a `fetch` nativa con ventajas adicionales:

- Interceptores automáticos de peticiones y respuestas
- Cancelación de peticiones
- Transformación automática de JSON
- Mejor manejo de errores (lanza excepciones en códigos 4xx y 5xx automáticamente)
- Compatible con navegadores antiguos

**¿Por qué se usa?**
Simplifica el código de red y centraliza la gestión de errores HTTP en un solo lugar.

**Ejemplo:**
```js
const response = await axios.get('http://localhost:3000/api/v1/libros');
console.log(response.data);
```

---

## Postman

Herramienta gráfica para probar y documentar APIs REST sin necesidad de escribir código.

- Permite crear colecciones de peticiones organizadas
- Soporta variables de entorno (ej. cambiar entre desarrollo y producción)
- Genera documentación automática de la API
- Permite automatizar pruebas con scripts

**¿Por qué se usa?**
Permite verificar que los endpoints funcionan correctamente antes de conectar el frontend, y sirve como documentación viva de la API.

---

## Sentry

Plataforma de monitoreo de errores en producción en tiempo real.

- Captura excepciones automáticamente sin intervención manual
- Registra el contexto completo del error (usuario, navegador, stack trace)
- Alerta al equipo por email o Slack cuando algo falla
- Agrupa errores similares para priorizar correcciones

**¿Por qué se usa?**
En producción no tienes acceso a la consola del servidor. Sentry actúa como una cámara de seguridad que registra todo lo que sale mal.

---

## Swagger

Estándar para documentar APIs REST de forma interactiva.

- Genera una interfaz web donde los usuarios pueden ver todos los endpoints
- Permite probar los endpoints directamente desde el navegador
- Produce documentación siempre actualizada con el código
- Compatible con el estándar OpenAPI

**¿Por qué se usa?**
Elimina la necesidad de mantener documentación manual. Cualquier desarrollador puede entender y probar la API sin leer el código fuente.

**Ejemplo de interfaz Swagger:**

GET  /api/v1/libros        → Obtener todos los libros
POST /api/v1/libros        → Crear un libro nuevo
DELETE /api/v1/libros/{id} → Eliminar un libro por ID
