# ERP con IA

Prototipo de ERP con integración de 3 modelos LLM vía APIs cloud gratuitas (Gemini, Groq, HuggingFace).  
Toda la interacción con el sistema se realiza mediante lenguaje natural a través de un chat.

## Requisitos

- **Node.js** >= 18
- **MongoDB** corriendo en `localhost:27017`
- **3 API keys** gratuitas (ver sección Configuración)
- **Docker** (para MongoDB, o instala MongoDB nativo)

## Instalación rápida

```bash
# 1. Backend
cd backend
npm install

# 2. Editar .env con tus API keys (ver más abajo)

# 3. Frontend
cd ../frontend
npm install

# 4. Arrancar MongoDB
sudo docker run -d --name mongodb -p 27017:27017 mongo:7

# 5. Arrancar
cd ..
./start-erp.sh
```

Abrir [http://localhost:5173](http://localhost:5173)

## Configuración: API Keys (GRATIS)

Edita `backend/.env` con las 3 keys:

```env
GEMINI_API_KEY=AIzaSy...        # https://aistudio.google.com/app/apikey
GROQ_API_KEY=gsk_...            # https://console.groq.com/keys
HUGGINGFACE_API_KEY=hf_...      # https://huggingface.co/settings/tokens
```

| Proveedor | Modelo | Gratis | Dónde conseguirla |
|-----------|--------|--------|-------------------|
| Google Gemini | Gemini 2.0 Flash | 60 req/min, 1500/día | aistudio.google.com (cuenta Google) |
| Groq | Llama 3.1 70B | 30 req/min, 14400/día | console.groq.com (cuenta email) |
| Hugging Face | Mistral 7B | 30 req/min, 500/día | huggingface.co/settings/tokens |

## Poblar base de datos

```bash
curl -X POST http://localhost:5000/api/seed
```

## Uso

Escribe en lenguaje natural en el chat. Ejemplos:

| Comando | Qué hace |
|---------|----------|
| "muestra los productos" | Lista todos los productos |
| "crea un producto llamado Leche con precio 2.5 y stock 100" | Crea un producto nuevo |
| "crea un pedido a Distribuidora Alimenticia con 10 Leches" | Crea un pedido (incrementa stock) |
| "registra un desecho de 5 unidades de Leche por caducidad" | Registra pérdida de stock |
| "verifica productos caducados" | Busca y elimina productos caducados |
| "qué productos tienen stock bajo" | Estadística: stock por debajo de 10 |
| "cuál es el valor del inventario" | Estadística: valor total del stock |

Usa el desplegable sobre el chat para cambiar entre los 3 modelos.

## Script de arranque

```bash
./start-erp.sh   # Arranca MongoDB, backend y frontend de golpe
```

## Estructura

```
erp-llm/
├── backend/
│   ├── controllers/        # Lógica de endpoints
│   ├── models/             # Schemas de Mongoose
│   ├── services/
│   │   ├── providers/      # geminiProvider, groqProvider, huggingfaceProvider
│   │   ├── llmService.js   # Router a providers
│   │   └── actionExecutor.js
│   └── index.js
├── frontend/
│   ├── src/components/     # ChatMessage, ProductsTable, ProvidersTable, StatsView, ModelSelector
│   └── src/services/api.js
├── start-erp.sh
└── README.md
```
