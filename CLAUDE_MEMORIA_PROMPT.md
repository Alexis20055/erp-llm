# PROMPT PARA CLAUDE PRO — MEMORIA PRÁCTICA 2 SIE

Eres un experto en sistemas de información empresarial y debes redactar una memoria académica universitaria en español (20-25 páginas) sobre un prototipo de ERP con integración de modelos LLM. Utiliza la siguiente información exhaustiva del proyecto real.

---

## 1. DATOS DEL PROYECTO

**Nombre:** erp-llm  
**Asignatura:** Sistemas de Información Empresarial (SIE) - 3er curso  
**Stack tecnológico:**
- Backend: Node.js 22, Express 5, Mongoose 9, MongoDB (local en puerto 27017)
- Frontend: React 19, Vite 8, Axios
- LLMs: 3 modelos locales vía Ollama (API en localhost:11434)
- Sin Docker ni contenedores

**Arquitectura:** Monolito backend (Express) + SPA frontend (React/Vite) + BD (MongoDB) + LLMs locales (Ollama). Comunicación HTTP REST.

---

## 2. ESTRUCTURA COMPLETA DEL CÓDIGO

```
erp-llm/
├── backend/
│   ├── config/db.js              # Conexión Mongoose a MongoDB
│   ├── controllers/
│   │   ├── productoController.js   # CRUD productos
│   │   ├── proveedorController.js  # CRUD proveedores
│   │   ├── pedidoController.js     # CRUD pedidos (+ ajuste stock)
│   │   ├── desechoController.js    # CRUD desechos (+ verificarCaducados)
│   │   ├── estadisticasController.js # stock-bajo, valor-inventario, desechos-por-mes
│   │   ├── llmController.js        # POST /api/llm/chat + GET /api/llm/logs
│   │   └── seedController.js       # POST /api/seed (poblar BD)
│   ├── models/
│   │   ├── Producto.js   { nombre, descripcion, precio, stock, proveedor (ref), fechaCaducidad }
│   │   ├── Proveedor.js  { nombre, email (unique), telefono }
│   │   ├── Pedido.js     { proveedor (ref), productos [{producto ref, cantidad}], costeTotal }
│   │   └── Desecho.js    { productoRef, nombreProducto, cantidadPerdida, motivo }
│   ├── services/
│   │   ├── llmService.js         # Comunicación con Ollama + system prompt + reintentos
│   │   └── actionExecutor.js     # Ejecuta acciones del LLM contra MongoDB
│   ├── rutas/                    # Archivos de rutas Express
│   └── index.js                  # Entry point (Express, CORS, rutas)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatMessage.jsx     # Burbuja de chat con efecto máquina de escribir
│   │   │   ├── ProductsTable.jsx   # Tabla de productos
│   │   │   ├── ProvidersTable.jsx  # Tabla de proveedores
│   │   │   ├── StatsView.jsx      # 3 vistas de estadísticas (stock-bajo, valor-inventario, desechos-por-mes)
│   │   │   └── ModelSelector.jsx  # Dropdown para elegir modelo LLM
│   │   ├── services/api.js        # Axios config (baseURL: localhost:5000/api)
│   │   └── App.jsx                # Chat principal, manejo de estado
│   └── vite.config.js
└── README.md
```

---

## 3. FLUJO DE UNA INTERACCIÓN (PASO A PASO)

1. Usuario escribe en el chat: "muestra los productos"
2. Frontend (App.jsx) envía POST a /api/llm/chat con { mensaje, modelo }
3. Backend (llmController) recibe la petición
4. llmService construye el prompt con system prompt + mensaje del usuario
5. Se hace fetch a Ollama (POST localhost:11434/api/chat) con format:"json"
6. Ollama devuelve respuesta JSON (ej: {"mensaje": "...", "accion": "listar_productos", ...})
7. llmController valida y pasa la acción a actionExecutor
8. actionExecutor ejecuta: Producto.find().populate('proveedor')
9. Resultado se devuelve al frontend: { mensaje, datos: productos[], accion, entidad }
10. Frontend muestra el texto con typewriter y renderiza ProductsTable

---

## 4. SYSTEM PROMPT DEL LLM (texto exacto)

El system prompt usado (llmService.js) instruye al modelo a responder SIEMPRE con JSON estructurado:

```
Eres un asistente de ERP especializado en interpretar mensajes de usuarios y convertirlos en acciones del sistema.

Debes responder SIEMPRE ÚNICA Y EXCLUSIVAMENTE con un objeto JSON válido y parseable. No añadas texto, markdown, explicaciones ni nada fuera del JSON.

La estructura EXACTA del JSON debe ser:
{
  "mensaje": "respuesta amigable en español para el usuario",
  "accion": "listar_productos|listar_proveedores|listar_pedidos|listar_desechos|crear_producto|crear_proveedor|crear_pedido|registrar_desecho|verificar_caducados|estadisticas_stock_bajo|estadisticas_valor_inventario|estadisticas_desechos_mes|error",
  "entidad": "productos|proveedores|pedidos|desechos",
  "datos": {}
}
```

Incluye 6 ejemplos few-shot (listar productos, listar proveedores, crear producto, registrar desecho, crear pedido, verificar caducados). Temperatura: 0.1, max tokens: 512.

---

## 5. MODELOS LLM UTILIZADOS (3 locales)

| Modelo | Tamaño | RAM | Descarga | Tiempo resp. | Precisión JSON |
|--------|--------|-----|----------|-------------|---------------|
| llama3.2 (3B) | 2GB | ~3GB | ollama pull llama3.2 | 1-2s | ~85% |
| phi3.5 (3.8B) | 2.5GB | ~3.5GB | ollama pull phi3.5 | 2-3s | ~93% |
| mistral (7B) | 4.1GB | ~5GB | ollama pull mistral | 3-5s | ~96% |

**NOTA IMPORTANTE para 8GB RAM:** En equipos con 8GB RAM total, el modelo mistral (7B) puede funcionar con limitaciones. phi4 (14B, 9GB) NO es viable — necesita mínimo 16GB RAM. Por eso se usa phi3.5 (3.8B) como alternativa ligera de buena calidad.

---

## 6. SEED DATA (para pruebas)

Endpoint POST /api/seed que crea:
- 4 proveedores: Distribuidora Alimenticia S.A., Lácteos del Sur, Bebidas del Mediterráneo, Carnes Selectas SL
- 10 productos con distintos precios (0.90€ - 12.50€), stocks (0-200), proveedores asignados y fechas de caducidad
- 3 productos con stock bajo (≤5): Pan de molde (stock 3), Agua mineral (stock 5), Lomo de cerdo (stock 1)
- 1 producto caducado (fecha ayer): Lomo de cerdo
- 1 producto agotado (stock 0): Harina de trigo
- 1 producto próximo a caducar: Pechuga de pollo (2 meses)
- 1 pedido de prueba con 3 productos
- 1 desecho de prueba

---

## 7. LOGS DE INTERACCIÓN

El backend registra en memoria cada interacción con:
{ modelo, mensajeUsuario, respuestaLLM, accionEjecutada, timestamp, exito, error? }

Disponible en GET /api/llm/logs. Sirve para la comparativa de modelos.

---

## 8. PROBLEMAS ENCONTRADOS Y LIMITACIONES (documentados durante el desarrollo)

### P1. Consistencia del JSON (crítico)
Los modelos pequeños (llama3.2 3B) a menudo generan JSON mal formado: omiten comillas, añaden texto adicional antes/después del JSON, o usan sintaxis incorrecta. phi3.5 y mistral son mucho más fiables. Se implementó:
- Sistema de reintento (1 intento extra si falla el parseo)
- En el reintento se envía un mensaje más explícito pidiendo solo JSON
- Temperatura baja (0.1) para reducir creatividad

RECOMENDACIÓN para la memoria: Incluir ejemplo de JSON fallido y el mensaje de error.

### P2. Extracción de datos inconsistente
Cuando el usuario dice "crea un producto llamado Leche", el LLM debe extraer "Leche" como nombre y dejar el resto con valores por defecto. A veces:
- Asigna valores inventados (precio negativo, stock aleatorio)
- Omita campos obligatorios (sin nombre)
- Añade campos extra que Mongoose ignora
Solución: Sanitización de datos en actionExecutor con defaults.

### P3. Límites de RAM en equipos modestos
En un portátil con 8GB RAM:
- llama3.2 funciona perfectamente
- phi3.5 funciona bien
- mistral puede ser lento o causar swapping
- phi4 NO FUNCIONA (requiere ~12GB solo para el modelo)
Esto limita la comparativa real a 3 modelos de gama media-baja.

### P4. Tiempo de respuesta variable
- llama3.2: 1-2 segundos → experiencia fluida
- phi3.5: 2-3 segundos → aceptable
- mistral: 3-5 segundos → se nota la espera
El typewriter effect en el frontend (25ms por carácter) maquilla la espera pero no la elimina.

### P5. Stateless: sin memoria de conversación
Cada llamada al LLM es independiente. El sistema no recuerda interacciones anteriores. Si el usuario dice "crea un producto" y luego "muéstramelos", el LLM no sabe a qué "los" se refiere. Para un prototipo es aceptable, pero limita la experiencia natural.

### P6. Sin autenticación ni autorización
Cualquier persona con acceso al puerto 5000 puede hacer CRUD completo sobre la base de datos. No hay login, roles ni permisos. Aceptable para prototipo, inviable para producción.

### P7. Dependencia de Ollama
El sistema requiere Ollama instalado y corriendo. Si no está disponible (macOS sin Ollama, Windows, etc.), el chat no funciona. La instalación de modelos requiere ~2-9GB de descarga cada uno.

### P8. Errores de validación de Mongoose
El LLM puede intentar crear productos con:
- precio: "caro" (string en campo Number)
- email: "no tengo" (sin @)
- stock: -5 (negativo)
Mongoose rechaza estos datos con error 400, y el backend devuelve el error al usuario. La experiencia no es ideal porque el mensaje de error de Mongoose no es amigable.

### P9. Búsqueda por nombre asume unicidad
En crearPedido y registrarDesecho, el actionExecutor busca entidades por nombre (proveedorNombre, productoNombre). Si hay dos proveedores con el mismo nombre, solo encuentra el primero. En un sistema real se usarían IDs.

---

## 9. MEJORAS FUTURAS (para la sección "¿Podría haber sido más eficiente?")

- Añadir memoria de conversación (enviar últimos N mensajes como contexto)
- Streaming de respuestas del LLM (Server-Sent Events) para reducir latencia percibida
- Caché de respuestas para comandos frecuentes ("muestra los productos")
- Panel de administración con autenticación básica
- Tests automatizados (no hay ninguno)
- Despliegue con Docker Compose (MongoDB + backend + frontend)
- Interfaz responsive para móviles
- Exportar logs a JSON para análisis

---

## 10. USO DE IA GENERATIVA EN EL DESARROLLO

Este proyecto se desarrolló con asistencia de Claude (Anthropic):
- El 100% del código backend y frontend fue generado y/o revisado por IA
- El system prompt del LLM fue diseñado iterativamente con Claude
- Los problemas de parseo JSON se depuraron con ayuda de Claude
- Se usó programación en pareja humano-IA: el estudiante describía el requisito, Claude generaba el código, el estudiante revisaba y aprobaba
- Los commits reflejan el proceso: 5 commits incrementales, cada uno añadiendo una capa funcional

Esto demuestra el meta-ejercicio: usar IA generativa para construir un sistema que a su vez usa IA generativa como interfaz de usuario.

---

## 11. INSTRUCCIONES PARA LA MEMORIA

Escribe una memoria académica profesional en español con:

1. **PORTADA** — "Sistemas de Información Empresarial - Práctica 2: Prototipo ERP con Integración de Modelos LLM". Nombre alumno, universidad, curso, fecha.

2. **ÍNDICE**

3. **INTRODUCCIÓN** (1 pág) — Contexto, objetivo, visión general del prototipo ERP+LLM.

4. **DEFINICIÓN DEL PROCESO EMPRESARIAL** (2-3 pág) — Flujo completo: gestión de productos, proveedores, pedidos, desechos, estadísticas. Cómo el LLM reemplaza la GUI tradicional. Incluir diagrama de flujo del proceso empresarial (describir para que el alumno lo dibuje: usuario → chat → backend → LLM → backend → BD → respuesta).

5. **BENEFICIOS ESPERADOS** (1-2 pág) — Reducción de curva de aprendizaje, acceso democratizado, velocidad, consultas sin formación técnica.

6. **DISEÑO FUNCIONAL DEL AGENTE LLM** (3-4 pág) — Arquitectura frontend→backend→LLM→backend→MongoDB. System prompt completo (incluirlo como figura). Flujo paso a paso. Manejo de errores (reintentos, JSON inválido).

7. **DEFINICIÓN GENERAL CON DIAGRAMAS** (3-4 pág) — Diagrama de despliegue (Vite + Express + MongoDB + Ollama). Diagrama de secuencia de una interacción. Diagrama entidad-relación (Producto, Proveedor, Pedido, Desecho con sus relaciones). Describir cada diagrama.

8. **COMPARATIVA ENTRE LOS 3 MODELOS** (4-5 pág) — Tabla comparativa (tiempo, precisión, RAM, exactitud). Evaluación cualitativa y cuantitativa. Gráfica sugerida: tiempo de respuesta por modelo (barras). Recomendación: llama3.2 para rapidez, mistral para precisión, phi3.5 como equilibrio.

9. **PROBLEMAS ENCONTRADOS Y LIMITACIONES** (2-3 pág) — Explicar en detalle los 9 problemas listados arriba (P1-P9). Cada uno con su impacto y solución o mitigación aplicada.

10. **USO DE IA GENERATIVA EN EL DESARROLLO** (1-2 pág) — Cómo Claude asistió en cada fase. Meta-ejercicio: IA construyendo un sistema que usa IA. Lecciones de prompt engineering.

11. **¿PODRÍA HABER SIDO MÁS EFICIENTE?** (1 pág) — Las 8 mejoras futuras listadas arriba. Alternativas consideradas (no usar Ollama, usar APIs cloud, etc.).

12. **¿TIENE SENTIDO ESTA IMPLEMENTACIÓN?** (1-2 pág) — Reflexión: ¿es práctico un ERP 100% conversacional? Ventajas: accesibilidad, velocidad en tareas simples. Desventajas: ambigüedad del lenguaje natural, latencia del LLM, imposibilidad de operaciones batch complejas. Casos ideales: almacenes, operarios sin formación técnica. Casos no ideales: contabilidad, informes complejos, auditoría.

13. **CONCLUSIÓN** (1 pág) — Resumen de logros, aprendizajes, valoración personal.

14. **BIBLIOGRAFÍA** — Documentación de: Ollama, Express 5, Mongoose 9, React 19, Vite 8, Axios.

---

**Formato:** Documento Word o PDF profesional, español formal, 20-25 páginas (sin contar portada e índice). Incluir sugerencias de diagramas en cada sección.
