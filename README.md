# Biblioteca Digital

## Diseño de la Aplicación

### Objetivo
Sistema de gestión de libros intuitivo que permita visualizar rápidamente 
la disponibilidad y administrar el inventario de forma eficiente.

### Estructura de la Interfaz

**1. Cabecera (Header)**
- Logo y nombre de la biblioteca
- Barra de búsqueda en tiempo real
- Botón para añadir nuevo libro

**2. Panel Lateral (Sidebar)**
- Filtros por género literario
- Filtros por estado (Todos/Disponibles/Prestados)
- Panel de estadísticas en tiempo real

**3. Área Principal (Main)**
- Grid responsive de tarjetas de libros
- Cada tarjeta muestra: portada, título, autor, género, estado
- Acciones rápidas: editar, eliminar, cambiar estado

**4. Modal de Formulario**
- Aparece al añadir/editar libro
- Campos: Título, Autor, Género, Estado (disponible/prestado)
- Validación de campos obligatorios

### Acciones del Usuario

| Acción | Descripción | Ubicación |
|--------|-------------|-----------|
| Añadir libro | Crear nuevo registro | Botón "+" header |
| Editar libro | Modificar datos existentes | Icono lápiz en tarjeta |
| Eliminar libro | Borrar permanentemente | Icono basura en tarjeta |
| Cambiar estado | Toggle disponible/prestado | Click en badge de estado |
| Filtrar | Ver solo cierta categoría | Botones sidebar |
| Buscar | Encontrar por título/autor | Input header |

### Wireframes
Ver carpeta `docs/design/` para ver imágenes del diseño propuesto.

### Decisiones de Diseño

- **Paleta**: Verde (disponible), Rojo (prestado), Gris (neutral)
- **Tarjetas**: Diseño limpio con información esencial visible
- **Responsive**: Grid adaptable a 1 columna (móvil) hasta 4 columnas (desktop)
- **Feedback visual**: Cambios de estado inmediatos, sin recarga de página

El diseño visual detallado se encuentra en:# Taskflow Project