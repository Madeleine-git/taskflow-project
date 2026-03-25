/**
 * Biblioteca Digital - Gestión de Libros
 * Persistencia en LocalStorage + Tailwind CSS
 */

/** @typedef {'todos'|'novela'|'ciencia-ficcion'|'historia'|'programacion'} Categoria */
/** @typedef {'disponible'|'prestado'|'leyendo'} EstadoLibro */
/**
 * @typedef Libro
 * @property {string|number} id
 * @property {string} titulo
 * @property {Categoria} categoria
 * @property {EstadoLibro} estado
 * @property {string} fechaAgregado
 * @property {number} rating
 * @property {boolean} marcado
 */

// Estado de la aplicación
/** @type {Libro[]} */
let libros = [];
let categoriaActiva = 'todos';

/** @type {ReadonlyArray<Categoria>} */
const CATEGORIAS_VALIDAS = ['todos', 'novela', 'ciencia-ficcion', 'historia', 'programacion'];
/** @type {ReadonlyArray<EstadoLibro>} */
const ESTADOS_VALIDOS = ['disponible', 'prestado', 'leyendo'];

// Referencias al DOM
const formLibro = document.getElementById('form-libro');
const contenedorLibros = document.getElementById('contenedor-libros');
const buscador = document.getElementById('buscador');
const mensajeVacio = document.getElementById('mensaje-vacio');
const themeToggle = document.getElementById('theme-toggle');
const tituloInput = document.getElementById('titulo-libro');
const contadorCaracteres = document.getElementById('contador-caracteres');
const mensajeError = document.getElementById('mensaje-error');
const categoriaInput = document.getElementById('categoria-libro');
const estadoInput = document.getElementById('estado-libro');

// Referencias a estadísticas
const statTotal = document.getElementById('stat-total');
const statDisponibles = document.getElementById('stat-disponibles');
const statPrestados = document.getElementById('stat-prestados');
const statRatingPromedio = document.getElementById('stat-rating-promedio');
const statRatingMejor = document.getElementById('stat-rating-mejor');

// Referencias a botones de acciones masivas
const btnMarcarTodos = document.getElementById('btn-marcar-todos');
const btnTodosDisponibles = document.getElementById('btn-todos-disponibles');
const btnTodosPrestados = document.getElementById('btn-todos-prestados');
const btnEliminarTodos = document.getElementById('btn-eliminar-todos');

// Inicialización
/**
 * Inicializa tema, listeners, estado desde HTML/LocalStorage y render inicial.
 * @returns {void}
 */
async function init() {
    console.log('=== INICIANDO APLICACIÓN ===');
    
    // Inicializar tema
    initTheme();
    
    // Configurar contador de caracteres
    configurarContadorCaracteres();
    
    // Leer libros del HTML
    const librosDelHTML = leerLibrosDelHTML();
    console.log('Libros encontrados en HTML:', librosDelHTML.length);
    
    // Mostrar estado de carga
    const loadingEl = document.getElementById('loading');
    const errorRedEl = document.getElementById('error-red');
    if (loadingEl) loadingEl.style.display = 'block';

try {
    const [librosData] = await Promise.all([
        obtenerLibros(),
        new Promise(resolve => setTimeout(resolve, 800))
    ]);
    libros = librosData;
    console.log('✅ Libros cargados desde el servidor:', libros.length);
    guardarLibros();
    if (errorRedEl) errorRedEl.style.display = 'none';

} catch (error) {
        console.error('❌ Error al conectar con el servidor:', error);
        if (errorRedEl) {
            errorRedEl.textContent = '❌ No se pudo conectar con el servidor';
            errorRedEl.style.display = 'block';
        }
        libros = [];
    }

    if (loadingEl) loadingEl.style.display = 'none';

    // Normalizar rating y marcado en libros existentes (compatibilidad hacia atrás)
    let huboCambios = false;
    libros.forEach(l => {
        if (typeof l.rating !== 'number') {
            l.rating = 0;
            huboCambios = true;
        }
        // Asegurar que existe la propiedad marcado
        if (typeof l.marcado !== 'boolean') {
            l.marcado = false;
            huboCambios = true;
        }
        l.rating = normalizarRating(l.rating);
    });
    if (huboCambios) guardarLibros();
    
    renderizarLibros();
    actualizarEstadisticas();
    configurarEventListeners();
    configurarAccionesMasivas();
    
    // Aplicar hash de URL
    const hash = window.location.hash.replace('#', '') || 'todos';
    activarFiltro(hash);
}

/**
 * Aplica una clase de "shake" a un elemento (si existe).
 * @param {HTMLElement|null|undefined} el
 * @returns {void}
 */
function shake(el) {
    if (!el) return;
    el.classList.add('error-shake');
    setTimeout(() => el.classList.remove('error-shake'), 500);
}

/**
 * Normaliza un título para comparaciones (trim + minúsculas + colapsa espacios).
 * @param {string} titulo
 * @returns {string}
 */
function normalizarTituloParaComparacion(titulo) {
    return String(titulo).trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Valida que una categoría pertenezca al conjunto permitido.
 * @param {string} categoria
 * @returns {categoria is Categoria}
 */
function esCategoriaValida(categoria) {
    return CATEGORIAS_VALIDAS.includes(/** @type {Categoria} */ (categoria));
}

/**
 * Valida que un estado pertenezca al conjunto permitido.
 * @param {string} estado
 * @returns {estado is EstadoLibro}
 */
function esEstadoValido(estado) {
    return ESTADOS_VALIDOS.includes(/** @type {EstadoLibro} */ (estado));
}

// Configurar contador de caracteres
/**
 * Configura el contador de caracteres del título y limpia errores al teclear.
 * @returns {void}
 */
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
/**
 * Inicializa el tema (dark/light) usando preferencia y LocalStorage.
 * @returns {void}
 */
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
/**
 * Lee los libros existentes en el HTML inicial y los transforma en objetos `Libro`.
 * @returns {Libro[]}
 */
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
                fechaAgregado: new Date().toISOString(),
                rating: 0,
                marcado: false
            });
        }
    });
    
    return librosHTML;
}

// Guardar libros
/**
 * Persiste el array `libros` en LocalStorage.
 * @returns {void}
 */
function guardarLibros() {
    // Los datos viven en el servidor
}

// Actualizar estadísticas
/**
 * Recalcula y pinta estadísticas (total, disponibles, prestados, ratings).
 * @returns {void}
 */
function actualizarEstadisticas() {
    const total = libros.length;
    const disponibles = libros.filter(l => l.estado === 'disponible').length;
    const prestados = libros.filter(l => l.estado === 'prestado').length;

    const { promedioRating, mejorLibroTitulo } = calcularEstadisticasRating(libros);
    
    // Animación de conteo
    animarContador(statTotal, parseInt(statTotal.textContent), total);
    animarContador(statDisponibles, parseInt(statDisponibles.textContent), disponibles);
    animarContador(statPrestados, parseInt(statPrestados.textContent), prestados);

    if (statRatingPromedio) statRatingPromedio.textContent = promedioRating.toFixed(1);
    if (statRatingMejor) statRatingMejor.textContent = mejorLibroTitulo || '—';
}

/**
 * Anima un contador numérico en el DOM.
 * @param {HTMLElement|null} elemento
 * @param {number} inicio
 * @param {number} fin
 * @returns {void}
 */
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
/**
 * Renderiza todos los libros en el contenedor aplicando el filtro activo.
 * @returns {void}
 */
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
/**
 * Crea el nodo DOM para una tarjeta de libro y adjunta listeners.
 * @param {Libro} libro
 * @returns {HTMLDivElement}
 */
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

    const ratingActual = normalizarRating(libro.rating ?? 0);
    const ratingTexto = ratingActual > 0 ? `<span class="text-xs font-bold text-yellow-700 dark:text-yellow-300">(${ratingActual}/5)</span>` : '';
    const estrellasHtml = crearEstrellasHTML(libro.id, ratingActual);
    
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
        <div class="flex items-center justify-between gap-3 mb-2">
            <div class="rating flex items-center gap-1" data-id="${libro.id}" aria-label="Calificar libro">
                ${estrellasHtml}
            </div>
            ${ratingTexto}
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
    const ratingContainer = div.querySelector('.rating');
    
    btnEliminar.addEventListener('click', () => eliminarLibro(libro.id));
    spanEstado.addEventListener('click', () => toggleEstado(libro.id));
    
    // Doble clic para editar título
    titulo.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        editarTitulo(libro.id, titulo);
    });
    
    // Checkbox para selección - ahora con estado persistente
    checkbox.checked = libro.marcado; // Restaurar estado guardado

    if (libro.marcado) {
        div.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-slate-800');
    }
    
    checkbox.addEventListener('change', (e) => {
        const estaMarcado = e.target.checked;
        
        // Actualizar visualmente
        if (estaMarcado) {
            div.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-slate-800');
        } else {
            div.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-slate-800');
        }
        
        // Guardar en el estado del libro
        const libroActual = libros.find(l => l.id === libro.id);
        if (libroActual) {
            libroActual.marcado = estaMarcado;
            guardarLibros();
        }
    });

    // Rating estrellas (hover + click toggle)
    if (ratingContainer) {
        const estrellas = Array.from(ratingContainer.querySelectorAll('.rating-star'));
        const pintar = (valor) => {
            estrellas.forEach(star => {
                const v = parseInt(star.dataset.value, 10);
                if (v <= valor) {
                    star.classList.add('filled');
                    star.classList.remove('empty');
                    star.textContent = '★';
                } else {
                    star.classList.remove('filled');
                    star.classList.add('empty');
                    star.textContent = '☆';
                }
            });
        };

        ratingContainer.addEventListener('mouseover', (e) => {
            const star = e.target.closest('.rating-star');
            if (!star) return;
            const valor = parseInt(star.dataset.value, 10);
            if (Number.isFinite(valor)) pintar(valor);
        });

        ratingContainer.addEventListener('mouseout', () => {
            pintar(normalizarRating(libro.rating ?? 0));
        });

        ratingContainer.addEventListener('click', (e) => {
            const star = e.target.closest('.rating-star');
            if (!star) return;
            const valor = parseInt(star.dataset.value, 10);
            if (!Number.isFinite(valor)) return;

            const actual = normalizarRating(libro.rating ?? 0);
            const nuevo = (valor === actual) ? 0 : valor;
            setRatingLibro(libro.id, nuevo);
        });
    }
    
    return div;
}

// Editar título
/**
 * Habilita edición inline del título de un libro.
 * @param {string|number} id
 * @param {HTMLElement} elementoTitulo
 * @returns {void}
 */
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
/**
 * Alterna el estado `disponible` ↔ `prestado` para un libro individual.
 * @param {string|number} id
 * @returns {void}
 */
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
/**
 * Obtiene los IDs numéricos seleccionados en el grid (si hay).
 * Nota: los `data-id` de los libros nuevos son UUID (string), y los
 * seleccionados desde tarjetas dinámicas siempre tienen `data-id`.
 * @returns {Array<string|number>}
 */
function obtenerIdsSeleccionados() {
    const checkboxes = contenedorLibros.querySelectorAll('.estado-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.dataset.id).filter(Boolean);
}

/**
 * Aplica una acción a la selección actual; si no hay selección, aplica a todos.
 * @template T
 * @param {(libro: Libro) => void} aplicar
 * @param {{ mensajeSeleccion?: (n: number) => string, mensajeTodos?: string }} mensajes
 * @returns {void}
 */
function aplicarAccionMasiva(aplicar, mensajes = {}) {
    if (libros.length === 0) {
        mostrarNotificacion('📭 No hay libros para modificar', 'error');
        return;
    }

    const idsSeleccionados = obtenerIdsSeleccionados();
    if (idsSeleccionados.length > 0) {
        const idsSet = new Set(idsSeleccionados.map(String));
        libros.forEach(l => {
            if (idsSet.has(String(l.id))) aplicar(l);
        });
        if (mensajes.mensajeSeleccion) mostrarNotificacion(mensajes.mensajeSeleccion(idsSeleccionados.length));
    } else {
        libros.forEach(aplicar);
        if (mensajes.mensajeTodos) mostrarNotificacion(mensajes.mensajeTodos);
    }

    guardarLibros();
    renderizarLibros();
    actualizarEstadisticas();
}

function configurarAccionesMasivas() {
    // Marcar todos los checkboxes
    btnMarcarTodos.addEventListener('click', () => {
        const checkboxes = contenedorLibros.querySelectorAll('.estado-checkbox');
        const todosMarcados = Array.from(checkboxes).every(cb => cb.checked);
        const nuevoEstado = !todosMarcados;
        
        checkboxes.forEach(cb => {
            cb.checked = nuevoEstado;
            cb.dispatchEvent(new Event('change'));
        });
        
        mostrarNotificacion(nuevoEstado ? '✓ Todos los libros seleccionados' : '❌ Selección limpiada');
    });
    
    // Todos disponibles
    btnTodosDisponibles.addEventListener('click', () => {
        aplicarAccionMasiva(
            (libro) => { libro.estado = 'disponible'; },
            {
                mensajeSeleccion: (n) => `📗 ${n} libro(s) marcado(s) como disponibles`,
                mensajeTodos: '📗 Todos los libros marcados como disponibles'
            }
        );
    });
    
    // Todos prestados
    btnTodosPrestados.addEventListener('click', () => {
        aplicarAccionMasiva(
            (libro) => { libro.estado = 'prestado'; },
            {
                mensajeSeleccion: (n) => `📕 ${n} libro(s) marcado(s) como prestados`,
                mensajeTodos: '📕 Todos los libros marcados como prestados'
            }
        );
    });
    
    // Eliminar todos
    btnEliminarTodos.addEventListener('click', () => {
        if (libros.length === 0) {
            mostrarNotificacion('📭 No hay libros para eliminar', 'error');
            return;
        }
        
        const idsSeleccionados = obtenerIdsSeleccionados();
        let mensaje = '¿Estás seguro de eliminar TODOS los libros?';
        let eliminarTodos = true;
        
        if (idsSeleccionados.length > 0) {
            mensaje = `¿Eliminar ${idsSeleccionados.length} libro(s) seleccionado(s)?`;
            eliminarTodos = false;
        }
        
        if (!confirm(mensaje)) return;
        
        if (eliminarTodos) {
            libros = [];
            mostrarNotificacion('🗑️ Todos los libros han sido eliminados');
        } else {
            const idsSet = new Set(idsSeleccionados.map(String));
            const cantidadEliminada = idsSeleccionados.length;
            libros = libros.filter(l => !idsSet.has(String(l.id)));
            mostrarNotificacion(`🗑️ ${cantidadEliminada} libro(s) eliminado(s)`);
        }
        
        guardarLibros();
        renderizarLibros();
        actualizarEstadisticas();
    });
}

// Event Listeners
/**
 * Configura listeners globales: formulario, buscador, filtros y navegación.
 * @returns {void}
 */
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
/**
 * Valida y procesa el submit del formulario.
 * @param {SubmitEvent} e
 * @returns {void}
 */
function manejarSubmit(e) {
    e.preventDefault();
    
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

    // Validación: sin solo símbolos (al menos una letra o número)
    if (!/[a-zA-ZÀ-ÿ0-9]/.test(titulo)) {
        mostrarErrorTitulo('El título debe contener al menos una letra o número');
        return;
    }

    // Validación: evitar múltiples espacios internos extremos
    if (titulo !== titulo.replace(/\s+/g, ' ').trim()) {
        mostrarErrorTitulo('Evita espacios múltiples en el título');
        return;
    }
    
    // Validación: categoría requerida
    if (!categoria) {
        mostrarNotificacion('❌ Por favor selecciona una categoría', 'error');
        shake(categoriaInput);
        return;
    }

    // Validación: categoría válida (no manipulada)
    if (!esCategoriaValida(categoria)) {
        mostrarNotificacion('❌ Categoría inválida', 'error');
        shake(categoriaInput);
        return;
    }

    // Validación: estado válido (no manipulado)
    if (!esEstadoValido(estado)) {
        mostrarNotificacion('❌ Estado inválido', 'error');
        shake(estadoInput);
        return;
    }
    
    agregarLibro(titulo, categoria, estado);
}

/**
 * Muestra error asociado al campo título con feedback visual.
 * @param {string} mensaje
 * @returns {void}
 */
function mostrarErrorTitulo(mensaje) {
    if (mensajeError) {
        mensajeError.textContent = mensaje;
        mensajeError.classList.remove('hidden');
    }
    shake(tituloInput);
    tituloInput?.focus();
}

/**
 * Agrega un libro al inicio de la lista con validación de duplicados.
 * @param {string} titulo
 * @param {Categoria} categoria
 * @param {EstadoLibro} estado
 * @returns {void}
 */
async function agregarLibro(titulo, categoria, estado) {
    try {
        // Validar duplicados (mismo título y categoría, ignorando mayúsculas y espacios)
        const tituloNorm = normalizarTituloParaComparacion(titulo);
        const existeDuplicado = libros.some(libro => (
            normalizarTituloParaComparacion(libro.titulo) === tituloNorm &&
            libro.categoria === categoria
        ));

        if (existeDuplicado) {
            mostrarNotificacion(`❌ Ya existe un libro titulado "${titulo}" en la categoría seleccionada`, 'error');
            return;
        }

        let nuevoLibro;

        nuevoLibro = await crearLibro({
            titulo,
            categoria,
            estado: estado || 'disponible',
            fechaAgregado: new Date().toISOString(),
            rating: 0,
            marcado: false,
        });
        console.log('✅ Libro creado en el servidor:', nuevoLibro);
        

        libros.unshift(nuevoLibro);
        guardarLibros();

        if (buscador) buscador.value = '';
        renderizarLibros();
        actualizarEstadisticas();

        if (categoriaActiva !== 'todos' && categoriaActiva !== categoria) {
            setTimeout(() => {
                const elemento = contenedorLibros.querySelector(`[data-id="${nuevoLibro.id}"]`);
                if (elemento) elemento.classList.add('hidden');
            }, 10);
        }

        formLibro.reset();
        if (contadorCaracteres) contadorCaracteres.textContent = '0/100';
        mostrarNotificacion(`📚 "${titulo.substring(0, 30)}${titulo.length > 30 ? '...' : ''}" agregado correctamente`);
    } catch (error) {
        console.error('Error al agregar libro:', error);
        mostrarNotificacion('❌ Ocurrió un error al agregar el libro.', 'error');
    }
}

// Eliminar Libro
/**
 * Elimina un libro por id tras confirmación.
 * @param {string|number} id
 * @returns {void}
 */
async function eliminarLibro(id) {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;
    
    if (!confirm(`¿Eliminar "${libro.titulo}"?`)) return;
    
    await eliminarLibro_api(id);
    console.log('✅ Libro eliminado del servidor');
    
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
/**
 * Filtra visualmente por texto (título o categoría) respetando el filtro activo.
 * @param {InputEvent} e
 * @returns {void}
 */
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
/**
 * Activa un filtro de categoría y repinta la lista.
 * @param {string} categoria
 * @returns {void}
 */
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
/**
 * Devuelve el label amigable de una categoría.
 * @param {string} categoria
 * @returns {string}
 */
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

/**
 * Devuelve el label amigable de un estado.
 * @param {string} estado
 * @returns {string}
 */
function formatearEstado(estado) {
    const estados = {
        'disponible': 'Disponible',
        'prestado': 'Prestado',
        'leyendo': 'Leyendo'
    };
    return estados[estado] || estado;
}

/**
 * Escapa HTML para evitar inyección al insertar texto en `innerHTML`.
 * @param {string} texto
 * @returns {string}
 */
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Normaliza un rating a entero entre 0 y 5.
 * @param {unknown} valor
 * @returns {number}
 */
function normalizarRating(valor) {
    const n = Number(valor);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(5, Math.round(n)));
}

/**
 * Genera el HTML de estrellas para rating.
 * @param {string|number} libroId
 * @param {unknown} rating
 * @returns {string}
 */
function crearEstrellasHTML(libroId, rating) {
    const r = normalizarRating(rating);
    let html = '';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= r;
        html += `<span class="rating-star ${filled ? 'filled' : 'empty'}" data-id="${libroId}" data-value="${i}" aria-label="${i} estrellas">${filled ? '★' : '☆'}</span>`;
    }
    return html;
}

/**
 * Setea el rating de un libro y actualiza UI + estadísticas.
 * @param {string|number} id
 * @param {number} rating
 * @returns {void}
 */
function setRatingLibro(id, rating) {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;

    libro.rating = normalizarRating(rating);
    guardarLibros();
    renderizarLibros();
    actualizarEstadisticas();

    if (libro.rating === 0) {
        mostrarNotificacion(`☆ Rating quitado: "${libro.titulo.substring(0, 25)}${libro.titulo.length > 25 ? '...' : ''}"`);
    } else {
        mostrarNotificacion(`★ Rating: ${libro.rating}/5 para "${libro.titulo.substring(0, 25)}${libro.titulo.length > 25 ? '...' : ''}"`);
    }
}

/**
 * Calcula estadísticas de rating para una lista de libros.
 * @param {Libro[]} lista
 * @returns {{ promedioRating: number, mejorLibroTitulo: string }}
 */
function calcularEstadisticasRating(lista) {
    const conRating = lista
        .map(l => ({ ...l, rating: normalizarRating(l.rating ?? 0) }))
        .filter(l => l.rating > 0);

    const promedioRating = conRating.length === 0
        ? 0
        : conRating.reduce((acc, l) => acc + l.rating, 0) / conRating.length;

    let mejorLibroTitulo = '';
    if (conRating.length > 0) {
        const mejor = conRating.reduce((best, cur) => (cur.rating > best.rating ? cur : best), conRating[0]);
        mejorLibroTitulo = mejor?.titulo || '';
    }

    return { promedioRating, mejorLibroTitulo };
}

// Notificación mejorada con tipos
/**
 * Muestra una notificación temporal.
 * @param {string} mensaje
 * @param {'success'|'error'} [tipo]
 * @returns {void}
 */
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