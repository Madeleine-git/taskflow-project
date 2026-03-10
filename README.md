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

# 📚 Biblioteca Digital - Documentación de Pruebas

**Fecha de pruebas:** 10 de marzo de 2026  
**Versión:** 1.0.0  
**Navegador utilizado:** Chrome/Firefox/Edge (compatible con todos)

---

## 🧪 Casos de Prueba Realizados

### 1. Prueba con Lista Vacía

**Procedimiento:**
1. Eliminar todos los libros usando el botón "Eliminar Todos"
2. Verificar mensaje de lista vacía
3. Comprobar estadísticas en cero

**Resultado:** ✅ **PASÓ**
- Se muestra mensaje: "📭 No hay libros en la biblioteca. ¡Agrega tu primer libro!"
- Estadísticas muestran: Total: 0, Disponibles: 0, Prestados: 0
- Los botones de acción muestran notificaciones apropiadas ("No hay libros para modificar")
- El formulario de agregar libro sigue funcionando correctamente

**Evidencia:**


---

### 2. Añadir Libro sin Título

**Procedimiento:**
1. Dejar el campo título vacío
2. Intentar enviar el formulario
3. Verificar validaciones

**Resultado:** ✅ **PASÓ**
- El formulario no se envía
- Se muestra mensaje de error: "Por favor ingresa un título"
- El campo de título realiza animación de "shake" (vibración) en rojo
- El campo recibe foco automáticamente para corrección
- No se crea entrada en LocalStorage

**Casos probados:**
- Título vacío: ❌ Bloqueado
- Solo espacios: ❌ Bloqueado (trim() elimina espacios)
- Título con 1 carácter: ❌ Bloqueado (mínimo 2 caracteres requeridos)

---

### 3. Marcar Libros como Prestados/Disponibles

**Procedimiento:**
1. Marcar varios libros individualmente clickeando el estado
2. Usar botón "Todos Prestados" 
3. Usar selección múltiple con checkboxes + botón acción
4. Verificar persistencia de estados

**Resultado:** ✅ **PASÓ**
- Click individual alterna entre Disponible (verde) ↔ Prestado (rojo)
- Botón "Todos Prestados" cambia estado de todos los libros
- Checkbox + botón permite acciones masivas sobre selección específica
- Estadísticas se actualizan en tiempo real con animación de conteo
- Estados persisten en LocalStorage correctamente


---

## 📊 Resumen de Resultados

| Prueba | Estado | Detalles |
|--------|--------|----------|
| Lista vacía | ✅ PASÓ | Mensaje apropiado, estadísticas en cero |
| Sin título | ✅ PASÓ | Validación estricta, UX clara |
| Título largo | ✅ PASÓ | Límite 100 chars, truncado visual elegante |
| Cambio de estados | ✅ PASÓ | Individual y masivo, persistencia OK |
| Eliminación | ✅ PASÓ | Confirmaciones, múltiples modos, seguro |
| Persistencia | ✅ PASÓ | LocalStorage 100% funcional |

**Conclusión:** Todas las pruebas pasaron exitosamente. La aplicación es robusta, maneja edge cases correctamente y proporciona buena experiencia de usuario con validaciones claras y persistencia confiable.

---

## 🐛 Issues Encontrados y Soluciones

| Issue | Severidad | Solución Implementada |
|-------|-----------|----------------------|
| Títulos largos desbordaban contenedor | Media | CSS `word-break: break-word` + truncado visual |
| Posible doble envío de formulario | Baja | `preventDefault()` + validación estricta |
| Estados no visibles en modo oscuro | Baja | Ajuste de colores en tema dark |
| Sin feedback al alcanzar límite de caracteres | Media | Contador dinámico con cambio de color |

---

## 🚀 Mejoras Implementadas Post-Pruebas

1. **Validación en tiempo real:** Contador de caracteres con límite visual
2. **Animaciones de error:** Shake effect en campos inválidos
3. **Tooltips informativos:** Títulos completos al hover sobre textos truncados
4. **Notificaciones diferenciadas:** Éxito (verde) vs Error (rojo)
5. **Confirmaciones contextuales:** Mensajes específicos según cantidad de libros afectados

---

## 📝 Notas Técnicas

- **LocalStorage Key:** `biblioteca_libros`
- **Formato de datos:** Array de objetos JSON con id, titulo, categoria, estado, fechaAgregado
- **Límite de almacenamiento:** ~5MB (suficiente para miles de libros)
- **Compatibilidad:** IE11+ (con polyfills), todos los navegadores modernos

---

**Desarrollado por:**Madeleine Urrego 
**Repositorio:** https://github.com/Madeleine-git/taskflow-project/
