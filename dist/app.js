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

// Inicialización
function init() {
    console.log('=== INICIANDO APLICACIÓN ===');
    
    // Inicializar tema
    initTheme();
    
    // Leer libros del HTML
    const librosDelHTML = leerLibrosDelHTML();
    console.log('Libros encontrados en HTML:', librosDelHTML.length);
    
    // Verificar LocalStorage
    const guardados = localStorage.getItem(STORAGE_KEY);
    if (guardados) {
        libros = JSON.parse(guardados);
        console.log('Libros cargados de LocalStorage:', libros.length);
        
        if (libros.length < librosDelHTML.length) {
            console.log('Agregando libros faltantes del HTML...');
            librosDelHTML.forEach(libroHTML => {
                const existe = libros.some(l => l.titulo === libroHTML.titulo);
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
    configurarEventListeners();
    
    // Aplicar hash de URL
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'todos') {
        activarFiltro(hash);
    } else {
        document.querySelector('.filtro-btn[href="#todos"]')?.classList.add('active');
    }
}

// Gestión de Tema Oscuro (Punto 4)
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
    
    // Botón que alterna la clase dark en el elemento raíz
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
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

// Renderizar libros con clases de Tailwind (Punto 2)
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

// Crear elemento libro con clases de utilidad Tailwind (Punto 2)
function crearElementoLibro(libro) {
    const div = document.createElement('div');
    
    // Clases de Tailwind usando escala por defecto (Punto 5)
    div.className = 'libro flex flex-col bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 border-l-4 border-transparent hover:border-slate-900 dark:hover:border-blue-500 animate-fade-in';
    div.dataset.categoria = libro.categoria;
    div.dataset.id = libro.id;
    
    const nombreCategoria = formatearCategoria(libro.categoria);
    const estadoClase = libro.estado === 'disponible' 
        ? 'bg-green-500' 
        : 'bg-red-500';
    
    // HTML con clases de utilidad Tailwind (Punto 2) y prefijo dark: (Punto 3)
    div.innerHTML = `
        <div class="flex justify-between items-start mb-2 gap-2">
            <h3 class="m-0 text-slate-900 dark:text-white text-lg font-bold flex-1 break-words leading-tight">${escapeHtml(libro.titulo)}</h3>
            <button class="btn-eliminar flex-shrink-0 w-8 h-8 rounded-full border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out hover:scale-110 focus:scale-105 focus:ring-2 focus:ring-red-500/50 flex items-center justify-center text-xl leading-none cursor-pointer p-0" data-id="${libro.id}" aria-label="Eliminar libro">
                ×
            </button>
        </div>
        <div class="flex justify-between items-center mt-auto pt-2 border-t border-slate-100 dark:border-slate-600 gap-2">
            <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">${nombreCategoria}</span>
            <span class="estado px-3 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider ${estadoClase} hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer hover:shadow-md">
                ${formatearEstado(libro.estado)}
            </span>
        </div>
    `;
    
    // Event listener para el botón eliminar
    div.querySelector('.btn-eliminar').addEventListener('click', () => eliminarLibro(libro.id));
    
    return div;
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
    
    const tituloInput = document.getElementById('titulo-libro');
    const categoriaInput = document.getElementById('categoria-libro');
    const estadoInput = document.getElementById('estado-libro');
    
    const titulo = tituloInput?.value?.trim();
    const categoria = categoriaInput?.value;
    const estado = estadoInput?.value || 'disponible';
    
    if (!titulo || !categoria) {
        alert('Por favor completa el título y selecciona una categoría');
        return;
    }
    
    agregarLibro(titulo, categoria, estado);
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
    
    // Ocultar si no coincide con filtro activo
    if (categoriaActiva !== 'todos' && categoriaActiva !== categoria) {
        setTimeout(() => {
            const elemento = contenedorLibros.querySelector(`[data-id="${nuevoLibro.id}"]`);
            if (elemento) elemento.classList.add('hidden');
        }, 10);
    }
    
    formLibro.reset();
    mostrarNotificacion(`📚 "${titulo}" agregado correctamente`);
}

// Eliminar Libro
function eliminarLibro(id) {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;
    
    if (!confirm(`¿Eliminar "${libro.titulo}"?`)) return;
    
    libros = libros.filter(l => l.id !== id);
    guardarLibros();
    renderizarLibros();
    
    if (categoriaActiva !== 'todos') {
        setTimeout(() => filtrarVisualmente(categoriaActiva), 10);
    }
    
    mostrarNotificacion(`🗑️ "${libro.titulo}" eliminado`);
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
    
    // Actualizar clases activas en botones usando Tailwind
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        const href = btn.getAttribute('href');
        if (href === `#${categoria}`) {
            // Botón activo - usando clases de Tailwind
            btn.classList.add('bg-slate-900', 'text-white', 'translate-x-1', 'shadow-md');
            btn.classList.remove('bg-slate-100', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-slate-200');
        } else {
            // Botón inactivo
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

// Notificación con estilos Tailwind (Bonus: transiciones personalizadas)
function mostrarNotificacion(mensaje) {
    const anterior = document.querySelector('.notificacion');
    if (anterior) anterior.remove();
    
    const notif = document.createElement('div');
    notif.className = 'notificacion fixed bottom-5 right-5 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 font-sans animate-slide-in';
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