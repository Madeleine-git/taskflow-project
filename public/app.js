/**
 * Biblioteca Digital - Gestión de Libros
 * Persistencia en LocalStorage + Tailwind CSS
 */

// Estado de la aplicación
let libros = [];
const STORAGE_KEY = 'biblioteca_libros';
let categoriaActiva = 'todos';

// Referencias al DOM
const formLibro = document.getElementById('form-libro');
const contenedorLibros = document.getElementById('contenedor-libros');
const buscador = document.getElementById('buscador');
const mensajeVacio = document.getElementById('mensaje-vacio');
const themeToggle = document.getElementById('theme-toggle');
const tituloInput = document.getElementById('titulo-libro');
const contadorCaracteres = document.getElementById('contador-caracteres');
const mensajeError = document.getElementById('mensaje-error');

// Referencias a estadísticas
const statTotal = document.getElementById('stat-total');
const statDisponibles = document.getElementById('stat-disponibles');
const statPrestados = document.getElementById('stat-prestados');

// Referencias a botones de acciones masivas
const btnMarcarTodos = document.getElementById('btn-marcar-todos');
const btnTodosDisponibles = document.getElementById('btn-todos-disponibles');
const btnTodosPrestados = document.getElementById('btn-todos-prestados');
const btnEliminarTodos = document.getElementById('btn-eliminar-todos');

// Inicialización
function init() {
    console.log('=== INICIANDO APLICACIÓN ===');
    
    // Inicializar tema
    initTheme();
    
    // Configurar contador de caracteres
    configurarContadorCaracteres();
    
    // Leer libros del HTML
    const librosDelHTML = leerLibrosDelHTML();
    console.log('Libros encontrados en HTML:', librosDelHTML.length);
    
    // Verificar LocalStorage
    const guardados = localStorage.getItem(STORAGE_KEY);
    if (guardados) {
        libros = JSON.parse(guardados);
        console.log('Libros cargados de LocalStorage:', libros.length);
        
        // Fusionar con libros del HTML si faltan
        if (libros.length < librosDelHTML.length) {
            console.log('Agregando libros faltantes del HTML...');
            librosDelHTML.forEach(libroHTML => {
                const existe = libros.some(l => l.titulo === libroHTML.titulo && l.categoria === libroHTML.categoria);
                if (!existe) libros.push(libroHTML);
            });
            guardarLibros();
        }
    } else {
        libros = librosDelHTML;
        console.log('Usando libros del HTML:', libros.length);
        guardarLibros();
    }
    
    renderizarLibros();
    actualizarEstadisticas();
    configurarEventListeners();
    configurarAccionesMasivas();
    
    // Aplicar hash de URL
    const hash = window.location.hash.replace('#', '') || 'todos';
    activarFiltro(hash);
}

// Configurar contador de caracteres
function configurarContadorCaracteres() {
    if (!tituloInput || !contadorCaracteres) return;
    
    tituloInput.addEventListener('input', (e) => {
        const longitud = e.target.value.length;
        contadorCaracteres.textContent = `${longitud}/100`;
        
        // Cambiar color si se acerca al límite
        if (longitud >= 90) {
            contadorCaracteres.classList.add('text-orange-500');
            contadorCaracteres.classList.remove('text-slate-500', 'dark:text-slate-400');
        } else {
            contadorCaracteres.classList.remove('text-orange-500');
            contadorCaracteres.classList.add('text-slate-500', 'dark:text-slate-400');
        }
        
        // Ocultar mensaje de error al escribir
        if (mensajeError) {
            mensajeError.classList.add('hidden');
            tituloInput.classList.remove('error-shake');
        }
    });
}

// Gestión de Tema Oscuro
function initTheme() {
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        html.classList.add('dark');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
    
    themeToggle?.addEventListener('click', () => {
        html.classList.toggle('dark');
        
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        }
    });
}

// Leer Libros de HTML
function leerLibrosDelHTML() {
    const librosHTML = [];
    const elementos = contenedorLibros.querySelectorAll(':scope > .libro');
    
    elementos.forEach((el, index) => {
        const h3 = el.querySelector('h3');
        const titulo = h3?.textContent?.trim();
        const categoria = el.dataset.categoria;
        const spans = el.querySelectorAll('span');
        
        let estado = 'disponible';
        if (spans.length > 0) {
            const ultimoSpan = spans[spans.length - 1];
            estado = ultimoSpan?.textContent?.trim().toLowerCase() || 'disponible';
        }
        
        if (titulo && categoria) {
            librosHTML.push({
                id: Date.now() + index,
                titulo: titulo,
                categoria: categoria,
                estado: estado,
                fechaAgregado: new Date().toISOString()
            });
        }
    });
    
    return librosHTML;
}

// Guardar libros
function guardarLibros() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
        console.log('✅ Datos guardados en LocalStorage:', libros.length, 'libros');
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        mostrarNotificacion('❌ Error al guardar datos', 'error');
    }
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const total = libros.length;
    const disponibles = libros.filter(l => l.estado === 'disponible').length;
    const prestados = libros.filter(l => l.estado === 'prestado').length;
    
    // Animación de conteo
    animarContador(statTotal, parseInt(statTotal.textContent), total);
    animarContador(statDisponibles, parseInt(statDisponibles.textContent), disponibles);
    animarContador(statPrestados, parseInt(statPrestados.textContent), prestados);
}

function animarContador(elemento, inicio, fin) {
    if (!elemento || inicio === fin) return;
    const duracion = 500;
    const paso = (fin - inicio) / (duracion / 16);
    let actual = inicio;
    
    function actualizar() {
        actual += paso;
        if ((paso > 0 && actual >= fin) || (paso < 0 && actual <= fin)) {
            elemento.textContent = fin;
        } else {
            elemento.textContent = Math.round(actual);
            requestAnimationFrame(actualizar);
        }
    }
    actualizar();
}

// Renderizar libros
function renderizarLibros() {
    contenedorLibros.innerHTML = '';
    
    if (libros.length === 0) {
        mensajeVacio.classList.remove('hidden');
        mensajeVacio.querySelector('p').textContent = '📭 No hay libros en la biblioteca. ¡Agrega tu primer libro!';
        return;
    }
    
    mensajeVacio.classList.add('hidden');
    
    libros.forEach((libro) => {
        const elemento = crearElementoLibro(libro);
        contenedorLibros.appendChild(elemento);
    });
    
    if (categoriaActiva !== 'todos') {
        filtrarVisualmente(categoriaActiva);
    }
}

// Crear elemento libro
function crearElementoLibro(libro) {
    const div = document.createElement('div');
    
    div.className = 'libro flex flex-col bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 border-l-4 border-transparent hover:border-slate-900 dark:hover:border-blue-500 animate-fade-in';
    div.dataset.categoria = libro.categoria;
    div.dataset.id = libro.id;
    
    const nombreCategoria = formatearCategoria(libro.categoria);
    const estadoClase = libro.estado === 'disponible' 
        ? 'bg-green-500' 
        : 'bg-red-500';
    
    // Truncar título muy largo para visualización
    const tituloMostrado = libro.titulo.length > 50 
        ? libro.titulo.substring(0, 50) + '...' 
        : libro.titulo;
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-2 gap-2">
            <div class="flex items-center gap-2 flex-1 min-w-0">
                <input type="checkbox" class="estado-checkbox dark:bg-slate-700 flex-shrink-0" data-id="${libro.id}" aria-label="Seleccionar libro">
                <h3 class="m-0 text-slate-900 dark:text-white text-lg font-bold flex-1 break-words leading-tight cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors titulo-largo" title="${escapeHtml(libro.titulo)} - Doble clic para editar">${escapeHtml(tituloMostrado)}</h3>
            </div>
            <button class="btn-eliminar flex-shrink-0 w-8 h-8 rounded-full border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out hover:scale-110 focus:scale-105 focus:ring-2 focus:ring-red-500/50 flex items-center justify-center text-xl leading-none cursor-pointer p-0" data-id="${libro.id}" aria-label="Eliminar libro">
                ×
            </button>
        </div>
        <div class="flex justify-between items-center mt-auto pt-2 border-t border-slate-100 dark:border-slate-600 gap-2">
            <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">${nombreCategoria}</span>
            <span class="estado px-3 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider ${estadoClase} hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer hover:shadow-md" data-id="${libro.id}">
                ${formatearEstado(libro.estado)}
            </span>
        </div>
    `;
    
    // Event listeners
    const btnEliminar = div.querySelector('.btn-eliminar');
    const spanEstado = div.querySelector('.estado');
    const titulo = div.querySelector('h3');
    const checkbox = div.querySelector('.estado-checkbox');
    
    btnEliminar.addEventListener('click', () => eliminarLibro(libro.id));
    spanEstado.addEventListener('click', () => toggleEstado(libro.id));
    
    // Doble clic para editar título
    titulo.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        editarTitulo(libro.id, titulo);
    });
    
    // Checkbox para selección
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            div.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-slate-800');
        } else {
            div.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-slate-800');
        }
    });
    
    return div;
}

// Editar título
function editarTitulo(id, elementoTitulo) {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = libro.titulo;
    input.className = 'editing w-full text-lg font-bold bg-transparent dark:text-white';
    input.maxLength = 100;
    
    elementoTitulo.replaceWith(input);
    input.focus();
    input.select();
    
    function guardarEdicion() {
        const nuevoTitulo = input.value.trim();
        
        // Validación: no permitir título vacío
        if (!nuevoTitulo) {
            mostrarNotificacion('❌ El título no puede estar vacío', 'error');
            renderizarLibros();
            return;
        }
        
        // Validación: límite de caracteres
        if (nuevoTitulo.length > 100) {
            mostrarNotificacion('❌ El título no puede exceder 100 caracteres', 'error');
            renderizarLibros();
            return;
        }
        
        if (nuevoTitulo !== libro.titulo) {
            libro.titulo = nuevoTitulo;
            guardarLibros();
            renderizarLibros();
            actualizarEstadisticas();
            mostrarNotificacion(`✏️ Título actualizado: "${nuevoTitulo.substring(0, 30)}${nuevoTitulo.length > 30 ? '...' : ''}"`);
        } else {
            renderizarLibros();
        }
    }
    
    input.addEventListener('blur', guardarEdicion);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            renderizarLibros();
        }
    });
}

// Toggle estado individual
function toggleEstado(id) {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;
    
    libro.estado = libro.estado === 'disponible' ? 'prestado' : 'disponible';
    guardarLibros();
    renderizarLibros();
    actualizarEstadisticas();
    
    const mensaje = libro.estado === 'disponible' 
        ? `📗 "${libro.titulo.substring(0, 20)}${libro.titulo.length > 20 ? '...' : ''}" ahora está disponible` 
        : `📕 "${libro.titulo.substring(0, 20)}${libro.titulo.length > 20 ? '...' : ''}" marcado como prestado`;
    mostrarNotificacion(mensaje);
}

// Configurar acciones masivas
function configurarAccionesMasivas() {
    // Marcar todos los checkboxes
    btnMarcarTodos.addEventListener('click', () => {
        const checkboxes = contenedorLibros.querySelectorAll('.estado-checkbox');
        const todosMarcados = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(cb => {
            cb.checked = !todosMarcados;
            cb.dispatchEvent(new Event('change'));
        });
        
        mostrarNotificacion(todosMarcados ? '❌ Selección limpiada' : '✓ Todos los libros seleccionados');
    });
    
    // Todos disponibles
    btnTodosDisponibles.addEventListener('click', () => {
        if (libros.length === 0) {
            mostrarNotificacion('📭 No hay libros para modificar', 'error');
            return;
        }
        
        const checkboxes = contenedorLibros.querySelectorAll('.estado-checkbox:checked');
        if (checkboxes.length > 0) {
            // Solo los seleccionados
            checkboxes.forEach(cb => {
                const id = parseInt(cb.dataset.id);
                const libro = libros.find(l => l.id === id);
                if (libro) libro.estado = 'disponible';
            });
            mostrarNotificacion(`📗 ${checkboxes.length} libro(s) marcado(s) como disponibles`);
        } else {
            // Todos
            libros.forEach(libro => libro.estado = 'disponible');
            mostrarNotificacion('📗 Todos los libros marcados como disponibles');
        }
        
        guardarLibros();
        renderizarLibros();
        actualizarEstadisticas();
    });
    
    // Todos prestados
    btnTodosPrestados.addEventListener('click', () => {
        if (libros.length === 0) {
            mostrarNotificacion('📭 No hay libros para modificar', 'error');
            return;
        }
        
        const checkboxes = contenedorLibros.querySelectorAll('.estado-checkbox:checked');
        if (checkboxes.length > 0) {
            // Solo los seleccionados
            checkboxes.forEach(cb => {
                const id = parseInt(cb.dataset.id);
                const libro = libros.find(l => l.id === id);
                if (libro) libro.estado = 'prestado';
            });
            mostrarNotificacion(`📕 ${checkboxes.length} libro(s) marcado(s) como prestados`);
        } else {
            // Todos
            libros.forEach(libro => libro.estado = 'prestado');
            mostrarNotificacion('📕 Todos los libros marcados como prestados');
        }
        
        guardarLibros();
        renderizarLibros();
        actualizarEstadisticas();
    });
    
    // Eliminar todos
    btnEliminarTodos.addEventListener('click', () => {
        if (libros.length === 0) {
            mostrarNotificacion('📭 No hay libros para eliminar', 'error');
            return;
        }
        
        const checkboxes = contenedorLibros.querySelectorAll('.estado-checkbox:checked');
        let mensaje = '¿Estás seguro de eliminar TODOS los libros?';
        let eliminarTodos = true;
        
        if (checkboxes.length > 0) {
            mensaje = `¿Eliminar ${checkboxes.length} libro(s) seleccionado(s)?`;
            eliminarTodos = false;
        }
        
        if (!confirm(mensaje)) return;
        
        if (eliminarTodos) {
            libros = [];
            mostrarNotificacion('🗑️ Todos los libros han sido eliminados');
        } else {
            const idsAEliminar = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
            const cantidadEliminada = idsAEliminar.length;
            libros = libros.filter(l => !idsAEliminar.includes(l.id));
            mostrarNotificacion(`🗑️ ${cantidadEliminada} libro(s) eliminado(s)`);
        }
        
        guardarLibros();
        renderizarLibros();
        actualizarEstadisticas();
    });
}

// Event Listeners
function configurarEventListeners() {
    // Formulario
    if (formLibro) {
        formLibro.addEventListener('submit', manejarSubmit);
    }
    
    // Buscador
    if (buscador) {
        buscador.addEventListener('input', manejarBusqueda);
    }
    
    // Filtros de categoría
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = e.target.getAttribute('href').replace('#', '');
            activarFiltro(categoria);
            window.history.pushState(null, null, `#${categoria}`);
        });
    });
    
    // Botón atrás del navegador
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '') || 'todos';
        activarFiltro(hash);
    });
}

// Agregar Libro
function manejarSubmit(e) {
    e.preventDefault();
    
    const categoriaInput = document.getElementById('categoria-libro');
    const estadoInput = document.getElementById('estado-libro');
    
    const titulo = tituloInput?.value?.trim();
    const categoria = categoriaInput?.value;
    const estado = estadoInput?.value || 'disponible';
    
    // Validación: título vacío o solo espacios
    if (!titulo) {
        mostrarErrorTitulo('Por favor ingresa un título');
        return;
    }
    
    // Validación: título muy corto
    if (titulo.length < 2) {
        mostrarErrorTitulo('El título debe tener al menos 2 caracteres');
        return;
    }
    
    // Validación: título muy largo
    if (titulo.length > 100) {
        mostrarErrorTitulo('El título no puede exceder 100 caracteres');
        return;
    }
    
    // Validación: categoría requerida
    if (!categoria) {
        mostrarNotificacion('❌ Por favor selecciona una categoría', 'error');
        categoriaInput?.classList.add('error-shake');
        setTimeout(() => categoriaInput?.classList.remove('error-shake'), 500);
        return;
    }
    
    agregarLibro(titulo, categoria, estado);
}

function mostrarErrorTitulo(mensaje) {
    if (mensajeError) {
        mensajeError.textContent = mensaje;
        mensajeError.classList.remove('hidden');
    }
    tituloInput?.classList.add('error-shake');
    tituloInput?.focus();
    
    setTimeout(() => {
        tituloInput?.classList.remove('error-shake');
    }, 500);
}

function agregarLibro(titulo, categoria, estado) {
    const nuevoLibro = {
        id: Date.now(),
        titulo: titulo,
        categoria: categoria,
        estado: estado,
        fechaAgregado: new Date().toISOString()
    };
    
    libros.unshift(nuevoLibro);
    guardarLibros();
    
    if (buscador) buscador.value = '';
    
    renderizarLibros();
    actualizarEstadisticas();
    
    // Ocultar si no coincide con filtro activo
    if (categoriaActiva !== 'todos' && categoriaActiva !== categoria) {
        setTimeout(() => {
            const elemento = contenedorLibros.querySelector(`[data-id="${nuevoLibro.id}"]`);
            if (elemento) elemento.classList.add('hidden');
        }, 10);
    }
    
    formLibro.reset();
    if (contadorCaracteres) contadorCaracteres.textContent = '0/100';
    mostrarNotificacion(`📚 "${titulo.substring(0, 30)}${titulo.length > 30 ? '...' : ''}" agregado correctamente`);
}

// Eliminar Libro
function eliminarLibro(id) {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;
    
    if (!confirm(`¿Eliminar "${libro.titulo}"?`)) return;
    
    libros = libros.filter(l => l.id !== id);
    guardarLibros();
    renderizarLibros();
    actualizarEstadisticas();
    
    if (categoriaActiva !== 'todos') {
        setTimeout(() => filtrarVisualmente(categoriaActiva), 10);
    }
    
    mostrarNotificacion(`🗑️ "${libro.titulo.substring(0, 20)}${libro.titulo.length > 20 ? '...' : ''}" eliminado`);
}

// Búsqueda
function manejarBusqueda(e) {
    const texto = e.target.value.toLowerCase().trim();
    const elementos = contenedorLibros.querySelectorAll('.libro');
    
    if (!texto) {
        if (categoriaActiva === 'todos') {
            mostrarTodosLosLibros();
        } else {
            filtrarVisualmente(categoriaActiva);
        }
        return;
    }
    
    let encontrados = 0;
    
    elementos.forEach(el => {
        const titulo = el.querySelector('h3')?.textContent?.toLowerCase() || '';
        const categoria = el.dataset.categoria?.toLowerCase() || '';
        
        const coincideBusqueda = titulo.includes(texto) || categoria.includes(texto);
        const coincideCategoria = categoriaActiva === 'todos' || el.dataset.categoria === categoriaActiva;
        
        if (coincideBusqueda && coincideCategoria) {
            el.classList.remove('hidden');
            encontrados++;
        } else {
            el.classList.add('hidden');
        }
    });
    
    if (encontrados === 0) {
        mensajeVacio.classList.remove('hidden');
        mensajeVacio.querySelector('p').textContent = '🔍 No se encontraron libros con esa búsqueda';
    } else {
        mensajeVacio.classList.add('hidden');
    }
}

// Filtros
function activarFiltro(categoria) {
    categoriaActiva = categoria;
    
    // Actualizar clases activas en botones
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        const href = btn.getAttribute('href');
        if (href === `#${categoria}`) {
            btn.classList.add('bg-slate-900', 'text-white', 'translate-x-1', 'shadow-md');
            btn.classList.remove('bg-slate-100', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-slate-200');
        } else {
            btn.classList.remove('bg-slate-900', 'text-white', 'translate-x-1', 'shadow-md');
            btn.classList.add('bg-slate-100', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-slate-200');
        }
    });
    
    if (buscador) buscador.value = '';
    
    if (categoria === 'todos') {
        mostrarTodosLosLibros();
    } else {
        filtrarVisualmente(categoria);
    }
}

function filtrarVisualmente(categoria) {
    const elementos = contenedorLibros.querySelectorAll('.libro');
    let visibles = 0;
    
    elementos.forEach(el => {
        if (el.dataset.categoria === categoria) {
            el.classList.remove('hidden');
            visibles++;
        } else {
            el.classList.add('hidden');
        }
    });
    
    if (visibles === 0) {
        mensajeVacio.classList.remove('hidden');
        mensajeVacio.querySelector('p').textContent = `📭 No hay libros en ${formatearCategoria(categoria)}`;
    } else {
        mensajeVacio.classList.add('hidden');
    }
}

function mostrarTodosLosLibros() {
    const elementos = contenedorLibros.querySelectorAll('.libro');
    elementos.forEach(el => el.classList.remove('hidden'));
    mensajeVacio.classList.add('hidden');
}

// Utilidades
function formatearCategoria(categoria) {
    const categorias = {
        'todos': 'Todos los libros',
        'novela': 'Novela',
        'ciencia-ficcion': 'Ciencia Ficción',
        'historia': 'Historia',
        'programacion': 'Programación'
    };
    return categorias[categoria] || categoria;
}

function formatearEstado(estado) {
    const estados = {
        'disponible': 'Disponible',
        'prestado': 'Prestado',
        'leyendo': 'Leyendo'
    };
    return estados[estado] || estado;
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Notificación mejorada con tipos
function mostrarNotificacion(mensaje, tipo = 'success') {
    const anterior = document.querySelector('.notificacion');
    if (anterior) anterior.remove();
    
    const notif = document.createElement('div');
    const bgColor = tipo === 'error' ? 'bg-red-500' : 'bg-green-500';
    notif.className = `notificacion fixed bottom-5 right-5 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 font-sans animate-slide-in max-w-md`;
    notif.textContent = mensaje;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.remove('animate-slide-in');
        notif.classList.add('animate-slide-out');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Iniciar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}