# ERP con IA

Prototipo de ERP con integración de modelos LLM locales (Ollama).  
Toda la interacción con el sistema se realiza mediante lenguaje natural a través de un chat.

## Requisitos

- **Node.js** >= 18
- **MongoDB** corriendo en `localhost:27017`
- **Ollama** con al menos un modelo descargado

## Instalación

### 1. Backend

```bash
cd backend
npm install
cp .env .env.local  # opcional, los valores por defecto funcionan
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173)

### 3. Ollama (modelos locales)

```bash
# Instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Descargar modelos (elige al menos uno)
ollama pull llama3.2      # ~2GB - Rápido, básico
ollama pull phi3.5        # ~2.5GB - Equilibrado (alternativa ligera)
ollama pull mistral       # ~4.1GB - Preciso

# Asegurarse de que Ollama está corriendo
ollama serve
```

### 4. Poblar base de datos

```bash
curl -X POST http://localhost:5000/api/seed
```

## Uso

Escribe en lenguaje natural en el chat. Ejemplos:

| Comando | Qué hace |
|---------|----------|
| "muestra los productos" | Lista todos los productos |
| "enséñame los proveedores" | Lista todos los proveedores |
| "crea un producto llamado Leche con precio 2.5 y stock 100" | Crea un producto nuevo |
| "añade un proveedor llamado Pepito, email pepito@mail.com, teléfono 123456789" | Crea un proveedor nuevo |
| "crea un pedido a Distribuidora Alimenticia con 10 Leches" | Crea un pedido (incrementa stock) |
| "registra un desecho de 5 unidades de Leche por caducidad" | Registra pérdida de stock |
| "verifica productos caducados" | Busca y elimina productos caducados |
| "qué productos tienen stock bajo" | Estadística: stock por debajo de 10 |
| "cuál es el valor del inventario" | Estadística: valor total del stock |
| "desechos por mes" | Estadística: pérdidas agregadas por mes |

## Seleccionar modelo

Usa el desplegable sobre el chat para cambiar entre los modelos de Ollama disponibles.

## API endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/llm/chat` | Enviar mensaje al LLM |
| GET | `/api/llm/logs` | Ver logs de interacciones |
| POST | `/api/seed` | Poblar BD con datos de prueba |
| GET/POST/PUT/DELETE | `/api/productos` | CRUD de productos |
| GET/POST/PUT/DELETE | `/api/proveedores` | CRUD de proveedores |
| GET/POST/PUT/DELETE | `/api/pedidos` | CRUD de pedidos |
| GET/POST/PUT/DELETE | `/api/desechos` | CRUD de desechos |
| GET | `/api/estadisticas/*` | Estadísticas |

## Estructura del proyecto

```
erp-llm/
├── backend/
│   ├── controllers/       # Lógica de endpoints
│   ├── models/            # Schemas de Mongoose
│   ├── routes/            # (vacio, reemplazado por rutas/)
│   ├── rutas/             # Definiciones de rutas
│   ├── services/          # LLM service + action executor
│   ├── .env               # Configuración
│   └── index.js           # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   └── services/      # Axios API client
│   └── index.html
└── README.md
```

## Problemas conocidos

- **phi4 requiere 16GB+ RAM**: En máquinas con 8GB RAM, usar llama3.2, phi3.5 o mistral.
- **JSON inconsistente**: Modelos pequeños (llama3.2) pueden devolver JSON inválido. El backend reintenta automáticamente.
- **Extracción de datos**: El LLM asigna valores por defecto si faltan campos en comandos como "crear producto".
