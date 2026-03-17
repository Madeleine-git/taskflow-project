## Propósito de este documento
Este documento recopila técnicas avanzadas de prompt engineering específicamente adaptadas para el desarrollo de software en el proyecto TaskFlow. Incluye patrones probados, ejemplos prácticos y mejores prácticas para obtener resultados óptimos de asistentes de IA como Claude y ChatGPT.

# Experimento: Programación con y sin IA

**Fecha:** 2026-03-17  
**Proyecto:** Biblioteca Digital  
**Objetivo:** Comparar soluciones propias vs. asistidas por IA en 3 tareas reales del proyecto

## Metodología

1. Resolver 3 tareas **sin usar IA** (lógica propia)
2. Documentar razonamiento, errores y aprendizajes
3. Comparar con solución experta/IA
4. Extraer conclusiones aplicables al proyecto

## Tarea 1: Búsqueda con Autocompletado

### Contexto
Campo de búsqueda que sugiere libros mientras el usuario escribe, máximo 5 resultados.

### Mi Solución 
    javascript
    const libros = [
        { id: 1, titulo: "Cien años de soledad"},
        { id: 2, titulo: "El principito"},
        { id: 3, titulo: "1984"},
        { id: 4, titulo: "Don Quijote de la Mancha"},
        { id: 5, titulo: "Crimen y castigo"},
        { id: 6, titulo: "La sombra del viento"}
    ];

    let sugerenciasActuales = [];

    function buscarLibros(textoEscrito) {
        if (textoEscrito === "") {
            sugerenciasActuales = [];
            mostrarSugerencias();
            return;
        }
        
        let textoBuscar = textoEscrito.toLowerCase();
        sugerenciasActuales = [];
        
        for (let i = 0; i < libros.length; i++) {
            let libro = libros[i];
            let tituloMinúscula = libro.titulo.toLowerCase();
            let autorMinúscula = libro.autor.toLowerCase();
            
            // ERROR: Condición mal anidada - solo busca si coincide AMBOS
            if (tituloMinúscula.indexOf(textoBuscar) !== -1) {
                if (autorMinúscula.indexOf(textoBuscar) !== -1) {
                    if (sugerenciasActuales.length < 5) {
                        sugerenciasActuales.push({
                            id: libro.id,
                            titulo: libro.titulo,
                            autor: libro.autor
                        });
                    }
                }
            }
        }
        
        mostrarSugerencias();
    }

    function mostrarSugerencias() {
        let contenedor = document.getElementById('lista-sugerencias');
        contenedor.innerHTML = '';
        
        for (let i = 0; i < sugerenciasActuales.length; i++) {
            let sugerencia = sugerenciasActuales[i];
            let div = document.createElement('div');
            div.className = 'sugerencia-item';
            div.style.cursor = 'pointer';
            div.textContent = sugerencia.titulo + ' - ' + sugerencia.autor;
            
            div.onclick = function() {
                document.getElementById('campo-busqueda').value = sugerencia.titulo;
            };
            
            contenedor.appendChild(div);
        }
        
        if (sugerenciasActuales.length === 0) {
            contenedor.textContent = 'No se encontraron coincidencias';
        }
    }

### Solución IA
    const buscarLibros = (query, libros, max = 5) => {
    if (!query.trim()) return [];
    
    const termino = query.toLowerCase();
    const resultados = [];
    
    for (const libro of libros) {
        if (resultados.length >= max) break; // Early exit
        
        const matchTitulo = libro.titulo.toLowerCase().includes(termino);
        const matchAutor = libro.autor.toLowerCase().includes(termino);
        
        if (matchTitulo || matchAutor) { // OR, no AND
            resultados.push({
                ...libro,
                score: (matchTitulo ? 2 : 0) + (matchAutor ? 1 : 0) // Prioriza título
            });
        }
    }
    
    return resultados.sort((a, b) => b.score - a.score);
};


## Tarea 2: Layout Responsive (Sidebar)

### Contexto
Sidebar fijo 280px a la izquierda, contenido centrado con max-width 1200px.

### Mi Solución 
    .biblioteca-layout {
        display: flex;
        min-height: 100vh;
    }

    .biblioteca-sidebar {
        width: 280px;
        background-color: #f3f4f6;
        flex-shrink: 0;
    }

    .biblioteca-content {
        flex-grow: 1;
        padding: 20px;
    }

    .contenedor-centrado {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }

    @media (max-width: 1279px) {
        .biblioteca-sidebar {
            display: none;
        }
    }

### Solución IA
    :root {
        --sidebar-width: 280px;
        --content-max: 1200px;
        --breakpoint-sidebar: calc(var(--sidebar-width) + var(--content-max));
    }

    .biblioteca-layout {
        display: grid;
        grid-template-columns: var(--sidebar-width) 1fr;
        min-height: 100vh;
    }

    @media (max-width: 1480px) { /* Sidebar + content + breathing room */
        .biblioteca-layout {
            grid-template-columns: 1fr;
        }
        
        .biblioteca-sidebar {
            position: fixed;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
        
        .biblioteca-sidebar.abierto {
            transform: translateX(0);
        }
    }

## Tarea 3: Estadísticas en Tiempo Real

### Contexto
Mantener métricas actualizadas sin recalcular todo desde cero, con soporte para undo.

### Mi Solución 
    let totalLibros = 0;
    let sumaRatings = 0;
    let ultimoLibro = null;
    let conteoCategorias = {};

    let ultimaOperacion = null;
    let ultimoLibroBorrado = null;

    function registrarLibro(libro) {
        totalLibros = totalLibros + 1;
        sumaRatings = sumaRatings + libro.rating;
        ultimoLibro = libro;
        
        if (conteoCategorias[libro.categoria]) {
            conteoCategorias[libro.categoria] = conteoCategorias[libro.categoria] + 1;
        } else {
            conteoCategorias[libro.categoria] = 1;
        }
    }

    function eliminarLibro(libro) {
        totalLibros = totalLibros - 1;
        sumaRatings = sumaRatings - libro.rating;
        conteoCategorias[libro.categoria] = conteoCategorias[libro.categoria] - 1;
        
        if (conteoCategorias[libro.categoria] === 0) {
            delete conteoCategorias[libro.categoria];
        }
    }

    function deshacer() {
        if (ultimaOperacion === 'CREAR') {
            eliminarLibro(ultimoLibro);
        } else if (ultimaOperacion === 'ELIMINAR') {
            registrarLibro(ultimoLibroBorrado);
        }
        ultimaOperacion = null;
    }
### Solución IA
        class EstadisticasEngine {
        #total = 0;
        #sumaRatings = 0;
        #categorias = new Map();
        #historial = [];
        #limiteHistorial = 10;

        registrar(operacion) {
            this.#guardarEstado();
            
            switch (operacion.tipo) {
                case 'CREAR':
                    this.#agregar(operacion.libro);
                    break;
                case 'ELIMINAR':
                    this.#remover(operacion.libro);
                    break;
            }
            
            return this.getResumen();
        }

        #agregar(libro) {
            this.#total++;
            this.#sumaRatings += libro.rating;
            this.#categorias.set(
                libro.categoria, 
                (this.#categorias.get(libro.categoria) || 0) + 1
            );
        }

        deshacer() {
            if (this.#historial.length === 0) return null;
            
            const estadoPrevio = this.#historial.pop();
            this.#restaurar(estadoPrevio);
            return this.getResumen();
        }

        #guardarEstado() {
            if (this.#historial.length >= this.#limiteHistorial) {
                this.#historial.shift();
            }
            this.#historial.push({
                total: this.#total,
                sumaRatings: this.#sumaRatings,
                categorias: new Map(this.#categorias)
            });
        }

        getResumen() {
            return {
                total: this.#total,
                ratingPromedio: this.#total ? this.#sumaRatings / this.#total : 0,
                porCategoria: Object.fromEntries(this.#categorias)
            };
        }
    }