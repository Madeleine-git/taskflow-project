# Biblioteca Digital

**Versión:** 2.0.0  
**Estado:** Estable  
**Licencia:** MIT

Sistema de gestión de libros con arquitectura cliente-servidor. El frontend consume una API REST desplegada en Vercel.

## 🌐 URL de producción
API REST: `https://taskflow-project-teal.vercel.app/api/v1/libros`

## ✨ Características Principales

- 📖 **Gestión Completa**: Añade, edita y elimina libros fácilmente
- 🔍 **Búsqueda en Tiempo Real**: Encuentra libros por título o categoría instantáneamente
- 🏷️ **Filtrado Inteligente**: Filtra por género literario o estado (disponible/prestado)
- 📊 **Estadísticas en Vivo**: Visualiza métricas actualizadas automáticamente
- 💾 **Persistencia**: API REST desplegada en Vercel
- 📱 **Diseño Responsive**: Adaptable desde móviles hasta escritorio
- 🎨 **UI Moderna**: Interfaz limpia con feedback visual inmediato

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Node.js (para correr el servidor localmente)

## 🛠️ Instalación y Uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/Madeleine-git/taskflow-project.git
cd taskflow-project
```

### 2. Arrancar el servidor local
```bash
cd server
npm install
npm run dev
```

### 3. Abrir el frontend
Abre `public/index.html` con Live Server en VS Code.

## 🏗️ Arquitectura de carpetas
```
taskflow-project/
├── public/                      # Frontend
│   ├── src/api/
│   │   └── client.js            # Capa de red (fetch al servidor)
│   ├── index.html               # Interfaz de usuario
│   ├── styles.css               # Estilos
│   └── app.js                   # Lógica del frontend
├── server/                      # Backend
│   └── src/
│       ├── config/
│       │   └── env.js           # Carga y valida variables de entorno
│       ├── controllers/
│       │   └── task.controller.js  # Manejo de peticiones HTTP
│       ├── routes/
│       │   └── task.routes.js      # Definición de endpoints
│       ├── services/
│       │   └── task.service.js     # Lógica de negocio
│       └── index.js             # Punto de entrada del servidor
├── docs/
│   └── backend-api.md           # Documentación de herramientas del ecosistema
└── README.md
```

## 🖥️ Backend (API REST)

### Middlewares
- **cors()**: Permite peticiones desde el frontend en otro dominio
- **express.json()**: Transforma el body de las peticiones a JSON utilizable
- **Error handler**: Captura errores globales y responde con códigos HTTP semánticos sin filtrar detalles técnicos

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/v1/libros | Obtener todos los libros |
| POST | /api/v1/libros | Crear un libro nuevo |
| PATCH | /api/v1/libros/:id | Actualizar un libro |
| DELETE | /api/v1/libros/:id | Eliminar un libro por ID |

### Ejemplos de uso

**Crear libro:**
```json
POST /api/v1/libros
{
  "titulo": "Clean Code",
  "categoria": "programacion",
  "estado": "disponible"
}
```

**Respuesta:**
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

### Gestión de estados de red en el frontend

El frontend gestiona tres estados:
- ⏳ **Cargando**: Indicador visual mientras la petición viaja al servidor
- ✅ **Éxito**: Renderiza los libros recibidos
- ❌ **Error**: Muestra mensaje si el servidor no está disponible

## 🧪 Pruebas Realizadas

| Prueba | Estado | Detalles |
|--------|--------|----------|
| GET todos los libros | ✅ Pasó | Devuelve array correctamente |
| POST crear libro | ✅ Pasó | Crea libro con todos los campos |
| POST sin título | ✅ Pasó | Devuelve 400 con mensaje de error |
| DELETE libro inexistente | ✅ Pasó | Devuelve 404 correctamente |
| Servidor no disponible | ✅ Pasó | Muestra mensaje de error en UI |
| Validación título vacío | ✅ Pasó | Bloqueo con animación |
| Búsqueda en tiempo real | ✅ Pasó | Por título y categoría |
| Tema oscuro/claro | ✅ Pasó | Persistencia y detección del sistema |
| Responsive | ✅ Pasó | Grid adaptable |

## 🗺️ Hoja de Ruta
- [ ] Conectar base de datos real (MongoDB/PostgreSQL)
- [ ] Autenticación de usuarios
- [ ] Exportar/Importar JSON desde UI
- [ ] Ordenamiento por título, fecha o rating
- [ ] Escaneo de códigos ISBN

## 🤝 Contribuciones
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Añade nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia
MIT License

## 👩‍💻 Autor
Madeleine Urrego  
GitHub: @Madeleine-git  
Repositorio: taskflow-project
