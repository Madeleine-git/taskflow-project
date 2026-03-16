Prompt Engineering para Desarrollo de Software
Guía completa de técnicas de prompt engineering aplicadas al desarrollo de software, con ejemplos prácticos y explicaciones de por qué funcionan.

1. Desarrollador Senior
    Prompt:
    Actúa como un desarrollador senior de software con 10 años de experiencia en arquitectura limpia y patrones de diseño. Revisa el siguiente código y proporciona feedback sobre:
    - Principios SOLID violados
    - Oportunidades de refactorización
    - Patrones de diseño aplicables
    - Posibles bugs o edge cases
    - Sugerencias de testing

    Código:
    [pega tu código aquí]

    ¿Por qué funciona? - Establece un contexto de expertise específico que activa el “modo experto” del modelo - Define el marco mental de referencia (SOLID, patrones de diseño) - Estructura la respuesta con categorías claras que facilitan la acción - El rol crea expectativas de calidad y profundidad técnica
    Cuándo usarlo: - Code reviews de arquitectura - Refactorizaciones complejas - Decisiones de diseño de software

2. Arquitecto de Seguridad
    Prompt:
    Eres un arquitecto de seguridad especializado en OWASP Top 10. Analiza este código en busca de:
    - Vulnerabilidades de inyección (SQL, NoSQL, Command)
    - Problemas de autenticación/autorización
    - Exposición de datos sensibles
    - Configuraciones inseguras
    - Validación de entrada insuficiente

    Para cada hallazgo, indica:
    - Severidad (Crítica/Alta/Media/Baja)
    - CWE asociado
    - Código vulnerable (líneas específicas)
    - Fix recomendado con código de ejemplo

    ¿Por qué funciona? - Especialización técnica profunda enfoca el análisis en vectores específicos - Formato estructurado de salida fuerza respuestas accionables - La clasificación por severidad permite priorizar fixes - Referencias a CWE (Common Weakness Enumeration) proporcionan vocabulario estándar de la industria
    Cuándo usarlo: - Security reviews - Auditorías de código - Antes de releases a producción - Código que maneja datos sensibles (PII, pagos, autenticación)

3. Refactorización de Funciones
    Prompt:
    Refactoriza la siguiente función siguiendo estos ejemplos de estilo:

    Ejemplo 1 - ANTES:
    def get_data(id):
        db = connect()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE id = " + str(id))
        return cursor.fetchone()

    Ejemplo 1 - DESPUÉS:
    def get_user_by_id(user_id: int) -> Optional[User]:
        """Retrieve user by ID with parameterized query."""
        query = "SELECT id, name, email FROM users WHERE id = %s"
        with DatabaseConnection() as db:
            return db.execute(query, (user_id,)).fetchone()

    Ahora refactoriza siguiendo el mismo patrón:

    Código a refactorizar:
    [pega tu código aquí]

    ¿Por qué funciona? - Los ejemplos establecen el patrón de transformación deseado sin necesidad de explicar reglas abstractas - El modelo aprende: naming conventions (get_data → get_user_by_id), type hints, docstrings, seguridad (parametrización vs concatenación), context managers - La generalización del patrón es más efectiva que instrucciones textuales - Mantiene consistencia de estilo en toda la base de código
    Cuándo usarlo: - Refactorizaciones masivas de legacy code - Cambios de estilo de código (PEP 8, ESLint rules) - Migraciones entre lenguajes o frameworks

4. Generación de Tests
    Prompt:
    Genera tests unitarios completos siguiendo este estilo:

    Ejemplo de función:
    def calculate_discount(price: float, percentage: float) -> float:
        return price * (1 - percentage / 100)

    Ejemplo de tests:
    import pytest
    from decimal import Decimal

    class TestCalculateDiscount:
        """Test suite for discount calculations."""

        @pytest.mark.parametrize("price,percentage,expected", [
            (100.0, 20.0, 80.0),
            (50.0, 0.0, 50.0),
            (100.0, 100.0, 0.0),
            (Decimal("99.99"), Decimal("10"), Decimal("89.991")),
        ])
        def test_calculate_discount_valid_inputs(self, price, percentage, expected):
            assert calculate_discount(price, percentage) == expected

        def test_calculate_discount_negative_price_raises(self):
            with pytest.raises(ValueError, match="Price must be positive"):
                calculate_discount(-10.0, 20.0)

    Genera tests para:
    [pega tu función aquí]

    ¿Por qué funciona? - Demuestra estructura: clase de test descriptiva, parametrización para múltiples casos, separación de casos válidos e inválidos - Muestra nivel de cobertura esperado (happy path, edge cases, excepciones) - Incluye buenas prácticas (Decimal para precisión monetaria, mensajes de error específicos) - El modelo replica no solo la sintaxis sino la filosofía de testing
    Cuándo usarlo: - Crear suites de test para código existente - TDD (Test Driven Development) - Aumentar cobertura de testing - Onboarding de nuevos desarrolladores en estándares de testing

5. Debugging Estructurado
    Prompt:
    Analiza este error paso a paso:

    Error: `TypeError: 'NoneType' object is not iterable` en línea 42 de `data_processor.py`

    Código problemático:
    def process_items(data):
        items = fetch_data(data)
        for item in items:  # Línea 42
            process(item)

    Sigue este razonamiento:
    1. ¿Qué valores puede tener `items` en este punto?
    2. ¿En qué condiciones `fetch_data()` retorna `None`?
    3. ¿Qué validación falta antes del loop?
    4. ¿Cuál es la solución más robusta (no solo un fix rápido)?
    5. ¿Cómo prevenimos esto en el futuro (tipado, tests, etc.)?

    Responde cada punto antes de dar la solución final.

    ¿Por qué funciona? - Obliga al modelo a razonar secuencialmente en lugar de saltar a conclusiones - Cada paso construye sobre el anterior, reduciendo errores de diagnóstico - La estructura guía al modelo a considerar causas raíz vs síntomas - El paso 5 fomenta prevención, no solo corrección
    Cuándo usarlo: - Bugs complejos o intermitentes - Debugging de código legacy sin documentación - Problemas de race conditions o concurrencia - Cuando los fixes rápidos han fallado anteriormente

6. Optimización de Algoritmos
    Prompt:
    Optimiza este algoritmo de búsqueda. Antes de escribir código, analiza:

    Paso 1 - Complejidad actual:
    - ¿Cuál es la complejidad temporal actual?
    - ¿Cuál es la complejidad espacial?
    - ¿Cuál es el cuello de botella identificado?

    Paso 2 - Estrategias de optimización:
    - ¿Qué estructuras de datos alternativas consideras?
    - ¿Hay subproblemas repetidos (memoización/dinámica)?
    - ¿Podemos usar preprocessing?

    Paso 3 - Trade-offs:
    - ¿Espacio vs tiempo?
    - ¿Complejidad vs legibilidad?
    - ¿Optimización prematura vs necesidad real?

    Paso 4 - Implementación:
    - Proporciona la solución optimizada
    - Explica por qué es mejor con benchmarks estimados

    Código original:
    [pega tu código aquí]

    ¿Por qué funciona? - Estructura el análisis como un ingeniero senior lo haría: medir antes de optimizar - Evita optimizaciones prematuras considerando trade-offs explícitamente - El paso 3 es crítico: muchas “optimizaciones” empeoran el código sin beneficio real - Fuerza justificación cuantitativa (complejidad Big O, benchmarks)
    Cuándo usarlo: - Cuando el performance es crítico (algoritmos en hot paths) - Procesamiento de grandes volúmenes de datos - Optimización de queries de base de datos - Code reviews de código performance-sensitive

Restricciones y Formato
7. Documentación Técnica Estandarizada
    Prompt:
    Documenta la siguiente función API siguiendo ESTRICTAMENTE este formato:

    RESTRICCIONES:
    - Máximo 3 líneas de descripción general
    - Todos los parámetros deben incluir: tipo, obligatorio/opcional, default si aplica, validación
    - Ejemplos de uso: 2 casos (éxito y error)
    - No uses jargón innecesario
    - Incluye sección de "Errores comunes" con 2 items
    - Formato: Markdown con headers nivel 3

    Función a documentar:
    [pega tu función aquí]

    ¿Por qué funciona? - Las restricciones específicas eliminan la variabilidad y aseguran consistencia - Límites de longitud (3 líneas) fuerzan claridad y eliminan “fluff” - Checklist de elementos obligatorios asegura completitud - Formato específico (Markdown h3) permite procesamiento automatizado
    Cuándo usarlo: - Generación de documentación API para equipos grandes - Documentación que será consumida por otros developers - Proyectos donde la consistencia documental es crítica

8. Code Review Checklist
    Prompt:
    Realiza un code review estructurado respondiendo SOLO con este formato:

    ## Resumen Ejecutivo
    - Estado: [APROBADO / CAMBIOS_MENORES / CAMBIOS_MAYORES]
    - Riesgo: [BAJO / MEDIO / ALTO]
    - Esfuerzo de review: [Líneas de código / Tiempo estimado]

    ## Issues Críticos (Bloqueantes)
    | # | Línea | Problema | Severidad | Fix sugerido |
    |---|-------|----------|-----------|--------------|
    | 1 | [num] | [desc] | [Critica] | [código] |

    ## Issues Menores (No bloqueantes)
    [Tabla similar]

    ## Preguntas para el autor
    1. [Pregunta específica]
    2. [Pregunta específica]

    ## Aprendizajes/Positivo
    - [Aspecto bien hecho]

    NO incluyas explicaciones fuera de este formato. Sé conciso.

    Código a revisar:
    [pega tu código aquí]

    ¿Por qué funciona? - El formato tabla fuerza priorización y accionabilidad - La prohibición de texto fuera del formato elimina “ruido” - Estado explícito (APROBADO/CAMBIOS) facilita el workflow de CI/CD - Sección de positivos balancea el feedback crítico
    Cuándo usarlo: - Code reviews formales en PRs - Auditorías de código - Onboarding (enseña el estándar de calidad esperado)

9. Prompts Combinados
    Mensajes de Commit (Rol + Few-Shot + Restricciones)
    Prompt:
    Actúa como un desarrollador que sigue Conventional Commits y semantic versioning.

    Ejemplos de mensajes de commit:

    ❌ Mal:
    fixed bug in login

    ✅ Bien:
    fix(auth): resolve race condition in login token refresh

    - Add mutex lock to prevent concurrent token updates
    - Add retry logic with exponential backoff
    - Update tests to cover concurrent scenarios

    Fixes #123

    Genera un mensaje de commit para estos cambios:

    Restricciones:
    - Tipo: feat|fix|docs|style|refactor|test|chore
    - Scope obligatorio (máx 10 caracteres)
    - Descripción en imperativo presente
    - Body opcional solo si hay "por qué" importante
    - Footer con referencias a issues si aplica

    Diff:
    [pega tu diff aquí]

    ¿Por qué funciona? - Combina tres técnicas efectivas: rol (experto), few-shot (ejemplos contraste), restricciones estrictas - Los ejemplos positivo/negativo clarifican expectativas mejor que descripciones - Conventional Commits permiten automatización (changelog generation, versioning) - Scope limitado fuerza modularidad del pensamiento
    Cuándo usarlo: - Automatización de commits en hooks de git - Equipos que siguen Conventional Commits - Proyectos con changelogs automatizados

10. Diseño de Arquitectura (Chain-of-Thought + Rol)
    Prompt:
    Eres un arquitecto de software diseñando un sistema de [tipo: microservicios/monolito/serverless].

    Requisitos: [describe requisitos funcionales y no funcionales]

    Antes de proponer la arquitectura, razona así:

    1. **Análisis de requisitos**:
    - ¿Qué requisitos son críticos para la arquitectura?
    - ¿Cuál es el volumen de datos/tráfico esperado?
    - ¿Qué constraints técnicos tenemos?

    2. **Decisiones arquitectónicas**:
    - ¿Por qué este patrón arquitectónico y no otro?
    - ¿Cómo escalará esto en 6 meses/2 años?
    - ¿Cuál es nuestro "punto de dolor" aceptado?

    3. **Componentes clave**:
    - Para cada servicio/componente: responsabilidad única, interfaces, dependencias

    4. **Diagrama propuesto**:
    - Usa Mermaid syntax para el diagrama
    - Incluye flujo de datos principal

    5. **Riesgos y mitigaciones**:
    - Top 3 riesgos técnicos y cómo mitigarlos

    NO escribas código de implementación hasta que hayas completado los 5 pasos.
    
    ¿Por qué funciona? - El rol de arquitecto eleva el nivel de abstracción y consideración de trade-offs - La estructura paso a paso evita “hackeos” rápidos que no escalan - Separación clara entre diseño (pasos 1-5) e implementación evita over-engineering - Mermaid permite iteración visual rápida
    Cuándo usarlo: - Greenfield projects (nuevos sistemas) - Migraciones de arquitectura - Decisiones de tecnología (buy vs build, cloud provider, etc.) - Documentación de arquitectura (ADRs)
