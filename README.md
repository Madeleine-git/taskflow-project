# Biblioteca Digital

**Versión Mejorada:** 1.0.0  
**Estado:** Estable  
**Licencia:** MIT

Sistema de gestión de libros intuitivo que permite visualizar rápidamente la disponibilidad y administrar el inventario de forma eficiente.

## ✨ Características Principales

- 📖 **Gestión Completa**: Añade, edita y elimina libros fácilmente
- 🔍 **Búsqueda en Tiempo Real**: Encuentra libros por título o autor instantáneamente
- 🏷️ **Filtrado Inteligente**: Filtra por género literario o estado (disponible/prestado)
- 📊 **Estadísticas en Vivo**: Visualiza métricas actualizadas automáticamente
- 💾 **Persistencia Local**: Datos guardados en LocalStorage (sin necesidad de backend)
- 📱 **Diseño Responsive**: Adaptable desde móviles hasta escritorio
- 🎨 **UI Moderna**: Interfaz limpia con feedback visual inmediato

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Soporte para LocalStorage

## 🛠️ Instalación y Uso

### Uso Directo

1. Clona el repositorio:
   bash:

    git clone https://github.com/Madeleine-git/taskflow-project.git

    Abre index.html en tu navegador:
    cd taskflow-project
    open index.html

### Estructura de Datos    

    interface Libro {
    id: string | number;        // UUID o timestamp
    titulo: string;             // 2-100 caracteres
    categoria: Categoria;       // 'novela' | 'ciencia-ficcion' | 'historia' | 'programacion'
    estado: EstadoLibro;        // 'disponible' | 'prestado' | 'leyendo'
    fechaAgregado: string;      // ISO 8601
    rating: number;             // 0-5 estrellas
    marcado: boolean;           // Selección múltiple
    }

    type Categoria = 'todos' | 'novela' | 'ciencia-ficcion' | 'historia' | 'programacion';
    type EstadoLibro = 'disponible' | 'prestado' | 'leyendo';

### Gestión de Libros
 

| Función                                   | Descripción                                    | Parámetros                       | Retorno |
| ----------------------------------------- | ---------------------------------------------- | -------------------------------- | ------- |
| `agregarLibro(titulo, categoria, estado)` | Añade nuevo libro con validación de duplicados | `string, Categoria, EstadoLibro` | `void`  |
| `eliminarLibro(id)`                       | Elimina libro por ID con confirmación          | `string \| number`               | `void`  |
| `editarTitulo(id, elemento)`              | Edición inline del título (doble clic)         | `string \| number, HTMLElement`  | `void`  |
| `toggleEstado(id)`                        | Alterna entre disponible/prestado              | `string \| number`               | `void`  |
| `setRatingLibro(id, rating)`              | Asigna rating 0-5 (0 quita el rating)          | `string \| number, number`       | `void`  |


### Filtrado y Búsqueda

| Función                         | Descripción              | Parámetros   | Retorno |
| ------------------------------- | ------------------------ | ------------ | ------- |
| `activarFiltro(categoria)`      | Filtra por categoría     | `string`     | `void`  |
| `manejarBusqueda(evento)`       | Búsqueda en tiempo real  | `InputEvent` | `void`  |
| `filtrarVisualmente(categoria)` | Aplica filtro al DOM     | `string`     | `void`  |
| `mostrarTodosLosLibros()`       | Muestra todos los libros | -            | `void`  |

### Acciones Masivas

| Función                                  | Descripción                              |
| ---------------------------------------- | ---------------------------------------- |
| `aplicarAccionMasiva(aplicar, mensajes)` | Aplica función a selección o todos       |
| `obtenerIdsSeleccionados()`              | Retorna IDs de libros marcados           |
| `btnMarcarTodos`                         | Toggle selección de todos los checkboxes |
| `btnTodosDisponibles`                    | Marca selección/todos como disponibles   |
| `btnTodosPrestados`                      | Marca selección/todos como prestados     |
| `btnEliminarTodos`                       | Elimina selección/todos con confirmación |

### Utilidades

| Función                                   | Descripción                | Ejemplo               |
| ----------------------------------------- | -------------------------- | ----------------------------- |
| `normalizarTituloParaComparacion(titulo)` | Normaliza para comparación | `"  Hola  "` → `"hola"`                   |
| `normalizarRating(valor)`                 | Convierte a entero 0-5     | `3.7` → `4`                               |
| `formatearCategoria(categoria)`           | Label amigable             | `"ciencia-ficcion"` → `"Ciencia Ficción"` |
| `formatearEstado(estado)`                 | Label amigable             | `"prestado"` → `"Prestado"`               |
| `escapeHtml(texto)`                       | Sanitiza HTML              | `<script>` → `&lt;script&gt;`             |
| `shake(elemento)`                         | Animación de error         | -                                         |
| `animarContador(elemento, inicio, fin)`   | Animación numérica         | `0` → `42`                  |

### Estadísticas

| Función                             | Descripción                    | Retorno                       |
| ----------------------------------- | ------------------------------ | ----------------------------- |
| `actualizarEstadisticas()`          | Recalcula y pinta stats        | -                             |
| `calcularEstadisticasRating(lista)` | Calcula promedio y mejor libro | `{ promedioRating, mejorLibroTitulo }`|

💡 Ejemplos de Uso
1. Añadir un Libro
Interfaz:
    1. Completa el formulario:
        Título: "Clean Code" (2-100 caracteres, sin espacios múltiples)
        Categoría: "Programación"
        Estado: "Disponible"
    2. Click en "Agregar"
Programáticamente:

    agregarLibro("Clean Code", "programacion", "disponible");
    // Valida duplicados, normaliza espacios, genera UUID

Validaciones aplicadas:
    ❌ Título vacío o solo espacios
    ❌ Menos de 2 caracteres
    ❌ Más de 100 caracteres
    ❌ Sin letras ni números (solo símbolos)
    ❌ Espacios múltiples internos
    ❌ Duplicado mismo título + categoría
2. Editar Título (Doble Clic)
Interfaz:
    1. Haz doble clic en el título del libro
    2. Edita el texto inline
    3. Presiona Enter o pierde el foco para guardar
    4. Presiona Escape para cancelar
Validaciones:
    No permite título vacío
    No excede 100 caracteres

3. Calificar con Estrellas
Interfaz:
    Pasa el mouse sobre las estrellas para previsualizar
    Click para asignar rating (1-5)
    Click en la misma estrella para quitar el rating (0)
Programáticamente:

    setRatingLibro("uuid-del-libro", 5);
    // Muestra notificación: "★ Rating: 5/5 para 'Clean Code'"

4. Acciones Masivas con Selección
Interfaz:
    1. Marca checkboxes de libros específicos (persistente en LocalStorage)
    2. Usa los botones del panel lateral:
        "Marcar Todos": Toggle selección
        "Todos Disponibles": Cambia estado de seleccionados
        "Todos Prestados": Cambia estado de seleccionados
        "Eliminar Todos": Elimina seleccionados (o todos si no hay selección)
Comportamiento:
    Si hay selección: aplica solo a seleccionados
    Si no hay selección: aplica a todos los libros
    Siempre pide confirmación para eliminar

5. Buscar Libros
Interfaz:
    Escribe en el buscador: "clean"
    Filtra en tiempo real por título o categoría
    Respeta el filtro de categoría activo
Programáticamente:

        // Búsqueda automática vía event listener
    buscador.addEventListener('input', manejarBusqueda);

6. Cambiar Tema
Interfaz:
    Click en el botón 🌙/☀️ para alternar
    Guarda preferencia en LocalStorage
    Detecta preferencia del sistema automáticamente

7. Exportar/Importar Datos (Manual)
    // Exportar
    const datos = localStorage.getItem('biblioteca_libros');
    // Copiar datos JSON

    // Importar (en consola de nuevo navegador)
    localStorage.setItem('biblioteca_libros', datosJSON);
    location.reload();

### 🎨 Personalización
    Configuración

    const CONFIG = {
    MAX_TITULO_LENGTH: 100,
    MIN_TITULO_LENGTH: 2,
    STORAGE_KEY: 'biblioteca_libros',
    CATEGORIAS_VALIDAS: ['todos', 'novela', 'ciencia-ficcion', 'historia', 'programacion'],
    ESTADOS_VALIDOS: ['disponible', 'prestado', 'leyendo']
    };    

### CSS Personalizado (Tailwind)

    /* Animaciones incluidas */
    .animate-fade-in      /* Entrada suave de tarjetas */
    .animate-slide-in     /* Notificación entrada */
    .animate-slide-out    /* Notificación salida */
    .error-shake          /* Vibración en errores de validación */

    /* Clases de estado visual */
    .ring-2.ring-blue-500 /* Libro seleccionado (checkbox) */


### 🧪 Pruebas Realizadas

| Prueba                     | Estado | Detalles                                 |
| -------------------------- | ------ | ---------------------------------------- |
| Lista vacía                | ✅ Pasó | Mensaje apropiado, estadísticas en cero  |
| Validación título vacío    | ✅ Pasó | Bloqueo con shake animation              |
| Validación longitud mínima | ✅ Pasó | Mínimo 2 caracteres                      |
| Validación longitud máxima | ✅ Pasó | Máximo 100 caracteres, truncado visual   |
| Validación espacios        | ✅ Pasó | `trim()` + colapso de múltiples espacios |
| Validación caracteres      | ✅ Pasó | Requiere al menos una letra o número     |
| Prevención duplicados      | ✅ Pasó | Comparación normalizada título+categoría |
| Edición inline             | ✅ Pasó | Doble clic, Enter guarda, Escape cancela |
| Rating estrellas           | ✅ Pasó | Hover, click, toggle para quitar         |
| Selección múltiple         | ✅ Pasó | Persistente en LocalStorage              |
| Acciones masivas           | ✅ Pasó | Aplica a selección o todos               |
| Cambio de estados          | ✅ Pasó | Individual y masivo, persistencia OK     |
| Eliminación                | ✅ Pasó | Confirmaciones contextuales              |
| Búsqueda                   | ✅ Pasó | Por título y categoría, respeta filtros  |
| Tema oscuro/claro          | ✅ Pasó | Persistencia y detección de sistema      |
| LocalStorage               | ✅ Pasó | 100% funcional, límite ~5MB              |
| Responsive                 | ✅ Pasó | Grid adaptable                           |


### 🐛 Solución de Problemas

Los datos no persisten
    Verifica que LocalStorage esté habilitado
    No uses modo incógnito
    Límite de ~5MB en LocalStorage
Error "Estado inválido" o "Categoría inválida"
    No manipules el DOM para cambiar valores
    Usa solo las opciones del formulario
No puedo editar un título
    Asegúrate de hacer doble clic en el texto del título (no en otra parte de la tarjeta)
Las estrellas no responden
    Verifica que no haya errores en consola
    El rating debe ser número entre 0-5
La selección múltiple no se guarda
    El estado de checkboxes se guarda al cambiar
    Verifica que guardarLibros() se ejecute sin errores

### 🗺️ Hoja de Ruta
    [ ] Sincronización con Google Drive/Dropbox
    [ ] Exportar/Importar JSON desde UI
    [ ] Ordenamiento por título, fecha o rating
    [ ] Modo offline con Service Workers
    [ ] Compartir biblioteca entre dispositivos
    [ ] Escaneo de códigos ISBN
    [ ] Importación desde Goodreads/LibraryThing

### 🤝 Contribuciones
    1. Fork el repositorio
    2. Crea una rama: git checkout -b feature/nueva-funcionalidad
    3. Commit: git commit -am 'Añade nueva funcionalidad'
    4. Push: git push origin feature/nueva-funcionalidad
    5. Abre un Pull Request

### 📄 Licencia
MIT License - Ver LICENSE

### 👩‍💻 Autor
    Madeleine Urrego
    GitHub: @Madeleine-git
    Repositorio: taskflow-project
