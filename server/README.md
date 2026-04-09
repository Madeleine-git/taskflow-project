# Biblioteca Digital — Servidor Backend

Documentación técnica y exhaustiva del servidor Express que alimenta la API REST de la Biblioteca Digital.

## Arquitectura por capas

El servidor sigue el patrón de **separación de responsabilidades (SoC)** dividido en tres capas estrictas:

```
server/
├── public/                     # Frontend servido como estáticos
│   ├── api/
│   │   └── client.js           # Capa de red del frontend (fetch)
│   ├── app.js                  # Lógica del frontend
│   ├── index.html              # Interfaz de usuario
│   └── output.css              # Estilos compilados con Tailwind
├── src/
│   ├── config/
│   │   ├── env.js              # Carga y valida variables de entorno
│   │   └── swagger.js          # Configuración de documentación Swagger
│   ├── controllers/
│   │   └── task.controller.js  # Capa de controladores HTTP
│   ├── routes/
│   │   └── task.routes.js      # Capa de enrutamiento
│   ├── services/
│   │   └── task.service.js     # Capa de servicios (lógica de negocio)
│   ├── data/
│   │   └── data.json           # Datos iniciales cargados en memoria al arrancar
│   └── index.js                # Punto de entrada del servidor
├── .env                        # Variables de entorno (no se sube a Git)
├── package.json
└── vercel.json                 # Configuración de despliegue en Vercel
```

## Variables de entorno

El servidor usa `dotenv` para cargar variables desde `.env`. Si alguna variable falta, el servidor se niega a arrancar lanzando un error explícito.

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto donde escucha el servidor | `3000` |

Crea un archivo `.env` en la raíz de `server/`:
```bash
PORT=3000


> Nunca subas el archivo `.env` a Git. Está incluido en `.gitignore`.

## Middlewares

### `cors()`
Permite peticiones desde dominios distintos (cross-origin). Sin este middleware, el navegador bloquearía las peticiones del frontend al backend cuando se ejecutan en dominios o puertos distintos.

### `express.json()`
Parsea el body de las peticiones entrantes de formato JSON crudo a objetos JavaScript utilizables en `req.body`. Sin este middleware, `req.body` sería `undefined`.

### `express.static()`
Sirve los archivos estáticos del frontend (HTML, CSS, JS) desde la carpeta `public/`. Esto permite que el frontend y el backend convivan en el mismo servidor y dominio.

### Error handler global (4 parámetros)
Middleware final que captura cualquier error no controlado propagado con `next(error)`. Evalúa el mensaje del error:
- Si es `NOT_FOUND` → devuelve **404** con mensaje `"Recurso no encontrado"`
- Cualquier otro error → registra la traza con `console.error()` y devuelve **500** con mensaje genérico, sin filtrar detalles técnicos al cliente
```javascript
app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});
```

## Endpoints

Base URL producción: `https://taskflow-project-teal.vercel.app`  
Base URL local: `http://localhost:3000`



### GET /api/v1/libros
Obtiene todos los libros almacenados en memoria.

**Request:**
```http
GET /api/v1/libros


**Response 200:**
```json
[
  {
    "id": 1,
    "titulo": "Clean Code",
    "categoria": "programacion",
    "estado": "disponible",
    "fechaAgregado": "2026-03-19T10:00:00.000Z",
    "rating": 0,
    "marcado": false
  }
]
```



### POST /api/v1/libros
Crea un nuevo libro. Valida que `titulo` y `categoria` estén presentes.

**Request:**
```http
POST /api/v1/libros
Content-Type: application/json

{
  "titulo": "Clean Code",
  "categoria": "programacion",
  "estado": "disponible"
}
```

**Response 201:**
```json
{
  "id": 1234567890,
  "titulo": "Clean Code",
  "categoria": "programacion",
  "estado": "disponible",
  "fechaAgregado": "2026-03-19T10:00:00.000Z",
  "rating": 0,
  "marcado": false
}
```

**Response 400 — sin título:**
```json
{
  "error": "El título es obligatorio"
}
```

**Response 400 — sin categoría:**
```json
{
  "error": "La categoría es obligatoria"
}
```

---

### PATCH /api/v1/libros/:id
Actualiza parcialmente un libro existente por su ID.

**Request:**
```http
PATCH /api/v1/libros/1234567890
Content-Type: application/json

{
  "estado": "prestado"
}
```

**Response 200:**
```json
{
  "id": 1234567890,
  "titulo": "Clean Code",
  "categoria": "programacion",
  "estado": "prestado",
  "fechaAgregado": "2026-03-19T10:00:00.000Z",
  "rating": 0,
  "marcado": false
}
```

**Response 404 — libro no existe:**
```json
{
  "error": "Libro no encontrado"
}
```

---

### DELETE /api/v1/libros/:id
Elimina un libro por su ID.

**Request:**
```http
DELETE /api/v1/libros/1234567890
```

**Response 204:**
```
Sin contenido
```

**Response 404 — libro no existe:**
```json
{
  "error": "Libro no encontrado"
}
```

---

### GET /api/v1/libros/error-test
Fuerza un error 500 para pruebas de integración. Solo para uso en desarrollo.

**Response 500:**
```json
{
  "error": "Error interno del servidor"
}
```

---

## Pruebas de integración

Pruebas realizadas con **Thunder Client** forzando errores intencionados:

| Prueba | Método | Endpoint | Body | Status esperado | Resultado |
|--------|--------|----------|------|-----------------|-----------|
| Obtener todos los libros | GET | `/api/v1/libros` | — | 200 | ✅ |
| Crear libro válido | POST | `/api/v1/libros` | `{"titulo":"Dune","categoria":"ciencia-ficcion"}` | 201 | ✅ |
| Crear libro sin título | POST | `/api/v1/libros` | `{"categoria":"novela"}` | 400 | ✅ |
| Crear libro sin categoría | POST | `/api/v1/libros` | `{"titulo":"Dune"}` | 400 | ✅ |
| Actualizar libro existente | PATCH | `/api/v1/libros/1` | `{"estado":"prestado"}` | 200 | ✅ |
| Actualizar libro inexistente | PATCH | `/api/v1/libros/9999` | `{"estado":"prestado"}` | 404 | ✅ |
| Eliminar libro existente | DELETE | `/api/v1/libros/1` | — | 204 | ✅ |
| Eliminar libro inexistente | DELETE | `/api/v1/libros/9999` | — | 404 | ✅ |
| Forzar error interno | GET | `/api/v1/libros/error-test` | — | 500 | ✅ |

## Documentación interactiva (Swagger)

La API está documentada con **Swagger UI** generado automáticamente desde JSDoc en el código.

- **Local**: `http://localhost:3000/api-docs`
- **Producción**: `https://taskflow-project-teal.vercel.app/api-docs`

## Despliegue en Vercel

El servidor se despliega como función serverless con `@vercel/node`. La configuración está en `vercel.json`:
```json
{
  "version": 2,
  "builds": [{ "src": "src/index.js", "use": "@vercel/node" }],
  "routes": [
    { "src": "/api/(.*)", "dest": "src/index.js" },
    { "src": "/api-docs(.*)", "dest": "src/index.js" },
    { "src": "/(.*)", "dest": "src/index.js" }
  ]
}
```

- Las rutas `/api/*` y `/api-docs*` se dirigen al servidor Express
- El resto de rutas sirven los archivos estáticos del frontend desde `public/` gracias a `express.static()`

> Al ser serverless, el sistema de archivos es de **solo lectura**. Los datos se mantienen en un array en memoria y se resetean con cada redespliegue. Para persistencia real se necesitaría una base de datos externa (MongoDB, PostgreSQL, etc.).

## Arrancar el servidor en local
```bash
# Instalar dependencias
npm install

# Desarrollo con hot-reload
npm run dev

# Producción
npm start
```

## Dependencias

| Paquete | Versión | Uso |
|---------|---------|-----|
| `express` | ^5.2.1 | Framework web HTTP |
| `cors` | ^2.8.6 | Cabeceras CORS para peticiones cross-origin |
| `dotenv` | ^17.3.1 | Carga de variables de entorno desde `.env` |
| `swagger-ui-express` | ^5.0.1 | Sirve la interfaz visual de Swagger |
| `swagger-jsdoc` | ^6.2.8 | Genera la especificación OpenAPI desde JSDoc |
| `nodemon` | ^3.1.14 | Reinicio automático del servidor en desarrollo |