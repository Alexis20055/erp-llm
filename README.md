# ERP con IA

Prototipo de ERP donde toda la interacción se realiza mediante lenguaje natural a través de un chat con IA.
Usa 3 modelos LLM distintos (vía Groq API gratuita) para comparar su precisión y velocidad.

## Requisitos

- **Node.js** >= 18
- **Docker** (para MongoDB)
- **1 API key gratuita** de Groq (ver sección Configuración)

## Instalación rápida

```bash
git clone https://github.com/Alexis20055/erp-llm.git
cd erp-llm

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# Crear .env con tu API key de Groq
echo "GROQ_API_KEY=gsk_tu_key_aqui" > backend/.env

# Arrancar MongoDB
sudo docker run -d --name mongodb -p 27017:27017 mongo:7

# Arrancar todo (backend + frontend + seed automático)
./start-erp.sh
```

Abrir [http://localhost:5173](http://localhost:5173)

## Configuración: API Key (GRATIS)

Solo necesitas una API key de Groq. Consíguela en https://console.groq.com/keys (registro con email).

Crea `backend/.env`:

```env
GROQ_API_KEY=gsk_tu_key_aqui
```

### Modelos disponibles (los 3 vía Groq)

| Modelo | ID en selector | Tamaño | Tiempo resp. |
|--------|---------------|--------|-------------|
| Llama 3.3 70B (versatile) | groq-llama | 70B | ~1s |
| Llama 3.1 8B (instant) | groq-llama8b | 8B | ~0.3s |
| GPT-OSS 20B | groq-mixtral | 20B | ~0.5s |

Límite gratuito: 30 req/min, 14400 req/día.

## Poblar base de datos

El `start-erp.sh` lo hace automáticamente. Manualmente:

```bash
curl -X POST http://localhost:5000/api/seed
```

## Uso

Escribe en lenguaje natural en el chat. Cambia de modelo con el desplegable sobre el chat.

| Comando | Qué hace |
|---------|----------|
| "muestra los productos" | Lista todos los productos |
| "crea un producto llamado Leche con precio 2.5 y stock 100" | Crea un producto nuevo |
| "crea un pedido a Distribuidora Alimenticia con 10 Leches" | Crea un pedido (incrementa stock) |
| "registra un desecho de 5 unidades de Leche por caducidad" | Registra pérdida de stock |
| "verifica productos caducados" | Busca y elimina productos caducados |
| "qué productos tienen stock bajo" | Estadística: stock por debajo de 10 |
| "cuál es el valor del inventario" | Estadística: valor total del stock |

## Sidebars

A la derecha del chat se muestran dos paneles informativos:

- **Inventario**: total de productos, unidades en stock, lista completa con barras proporcionales y código de colores (rojo ≤ 0, naranja < 5, amarillo < 10, verde ≥ 10)
- **Desechos**: total de registros, unidades perdidas, lista con producto, cantidad, motivo y fecha

Ambos se actualizan automáticamente tras cada acción del chat.

## Script de arranque

```bash
./start-erp.sh   # Arranca MongoDB, backend y frontend de golpe
```

## Estructura

```
erp-llm/
├── backend/
│   ├── controllers/          # productoController, proveedorController, pedidoController,
│   │                         # desechoController, estadisticasController, llmController, seedController
│   ├── models/               # Producto, Proveedor, Pedido, Desecho (Mongoose)
│   ├── services/
│   │   ├── providers/
│   │   │   └── groqProvider.js          # Único proveedor con 3 modelos
│   │   ├── llmService.js                # System prompt + reintentos JSON
│   │   └── actionExecutor.js            # Ejecuta acciones LLM contra MongoDB
│   ├── rutas/                # Archivos de rutas Express
│   ├── index.js              # Entry point
│   └── .env                  # GROQ_API_KEY (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatMessage.jsx          # Burbuja de chat con typewriter
│   │   │   ├── ProductsTable.jsx        # Tabla de productos
│   │   │   ├── ProvidersTable.jsx       # Tabla de proveedores
│   │   │   ├── StatsView.jsx           # Stock bajo, valor inventario, desechos por mes
│   │   │   ├── ModelSelector.jsx       # Dropdown 3 modelos Groq
│   │   │   ├── InventorySidebar.jsx    # Sidebar inventario en vivo
│   │   │   └── WasteSidebar.jsx        # Sidebar desechos en vivo
│   │   ├── services/api.js  # Axios (localhost:5000/api)
│   │   └── App.jsx           # Chat + sidebars + layout 3 columnas
│   └── vite.config.js
├── start-erp.sh
└── README.md
```

## Ver logs de interacciones LLM

```bash
curl http://localhost:5000/api/llm/logs
```

## Notas para el profesor

- Solo se necesita **una API key** (Groq), gratis
- El seed se ejecuta automáticamente al arrancar
- Los 3 modelos usan el mismo proveedor; se cambian desde el desplegable
- Si un modelo falla (deprecado), probar otro y avisar
