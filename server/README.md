# Biblioteca Digital — Servidor Backend

Documentación técnica y exhaustiva del servidor Express que alimenta la API REST de la Biblioteca Digital.

## Arquitectura por capas

El servidor sigue el patrón de **separación de responsabilidades (SoC)** dividido en tres capas estrictas:
```
server/
└── src/
    ├── config/
    │   ├── env.js        # Carga y valida variables de entorno
    │   └── swagger.js    # Configuración de documentación Swagger
    ├── controllers/
    │   └── task.controller.js  # Capa de controladores
    ├── routes/
    │   └── task.routes.js      # Capa de enrutamiento
    ├── services/
    │   └── task.service.js     # Capa de servicios (lógica de negocio)
    ├── data/
    │   └── data.json           # Persistencia simulada en archivo JSON
    └── index.js                # Punto de entrada del servidor
```

## Variables de entorno

El servidor usa `dotenv` para cargar variables desde `.env`. Si alguna variable falta, el servidor se niega a arrancar.

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto donde escucha el servidor | `3000` |

Crea un archivo `.env` en la raíz de `server/`:
```bash
PORT=3000
```

## Middlewares

### `cors()`
Permite peticiones desde dominios distintos (cross-origin). Sin este middleware, el navegador bloquearía las peticiones del frontend al backend.

### `express.json()`
Parsea el body de las peticiones entrantes de formato JSON crudo a objetos JavaScript utilizables en `req.body`.

### `loggerAcademico` (auditoría)
Middleware personalizado que registra cada petición con su método, ruta, código de respuesta y tiempo de ejecución.

### Error handler global (4 parámetros)
Captura cualquier error no controlado. Evalúa el mensaje del error:
- Si es `NOT_FOUND` → devuelve **404**
- Cualquier otro error → registra con `console.error()` y devuelve **500** sin filtrar detalles técnicos

## Endpoints

### GET /api/v1/libros
Obtiene todos los libros.

**Request:**
```http
GET /api/v1/libros
```

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

---

### POST /api/v1/libros
Crea un nuevo libro. Valida que `titulo` y `categoria` existan.

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

**Response 400 (sin título):**
```json
{
  "error": "El título es obligatorio"
}
```

---

### PATCH /api/v1/libros/:id
Actualiza parcialmente un libro existente.

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
  "estado": "prestado"
}
```

**Response 404:**
```json
{
  "error": "Libro no encontrado"
}
```

---

### DELETE /api/v1/libros/:id
Elimina un libro por ID.

**Request:**
```http
DELETE /api/v1/libros/1234567890
```

**Response 204:**
```
Sin contenido
```

**Response 404:**
```json
{
  "error": "Libro no encontrado"
}
```

---

### GET /api/v1/libros/error-test
Fuerza un error 500 para pruebas.

**Response 500:**
```json
{
  "error": "Error interno del servidor"
}
```

## Pruebas de integración

Pruebas realizadas con **Thunder Client** forzando errores:

| Prueba | Método | Endpoint | Status esperado | Resultado |
|--------|--------|----------|-----------------|-----------|
| Obtener libros | GET | `/api/v1/libros` | 200 | ✅ |
| Crear libro | POST | `/api/v1/libros` | 201 | ✅ |
| POST sin título | POST | `/api/v1/libros` | 400 | ✅ |
| DELETE inexistente | DELETE | `/api/v1/libros/9999` | 404 | ✅ |
| Error interno | GET | `/api/v1/libros/error-test` | 500 | ✅ |

## Documentación interactiva

Swagger UI disponible en:
- **Local**: `http://localhost:3000/api-docs`
- **Producción**: `https://taskflow-project-teal.vercel.app/api-docs`

## Arrancar el servidor
```bash
# Instalar dependencias
npm install

# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

## Dependencias

| Paquete | Versión | Uso |
|---------|---------|-----|
| `express` | ^5.2.1 | Framework web |
| `cors` | ^2.8.6 | Cabeceras CORS |
| `dotenv` | ^17.3.1 | Variables de entorno |
| `swagger-ui-express` | latest | UI de documentación |
| `swagger-jsdoc` | latest | Generación de spec |
| `nodemon` | ^3.1.14 | Hot-reload en desarrollo |