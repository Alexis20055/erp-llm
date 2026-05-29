const geminiProvider = require('./providers/geminiProvider');
const groqProvider = require('./providers/groqProvider');
const huggingfaceProvider = require('./providers/huggingfaceProvider');

const SYSTEM_PROMPT = `Eres un asistente de ERP especializado en interpretar mensajes de usuarios y convertirlos en acciones del sistema.

Debes responder SIEMPRE ÚNICA Y EXCLUSIVAMENTE con un objeto JSON válido y parseable. No añadas texto, markdown, explicaciones ni nada fuera del JSON.

La estructura EXACTA del JSON debe ser:
{
  "mensaje": "respuesta amigable en español para el usuario",
  "accion": "listar_productos|listar_proveedores|listar_pedidos|listar_desechos|crear_producto|crear_proveedor|crear_pedido|registrar_desecho|verificar_caducados|estadisticas_stock_bajo|estadisticas_valor_inventario|estadisticas_desechos_mes|error",
  "entidad": "productos|proveedores|pedidos|desechos",
  "datos": {}
}

REGLAS PARA CADA ACCIÓN:

1. listar_productos: datos={}
2. listar_proveedores: datos={}
3. listar_pedidos: datos={}
4. listar_desechos: datos={}
5. crear_producto: datos={ "nombre": "...", "descripcion": "...", "precio": numero, "stock": numero, "fechaCaducidad": "YYYY-MM-DD" o null }
6. crear_proveedor: datos={ "nombre": "...", "email": "...", "telefono": "..." }
7. crear_pedido: datos={ "proveedorNombre": "NOMBRE_DEL_PROVEEDOR", "productos": [{"productoNombre": "NOMBRE_DEL_PRODUCTO", "cantidad": numero}], "costeTotal": numero }
8. registrar_desecho: datos={ "productoNombre": "NOMBRE_DEL_PRODUCTO", "cantidadPerdida": numero, "motivo": "..." }
9. verificar_caducados: datos={}
10. estadisticas_stock_bajo: datos={ "umbral": 10 }
11. estadisticas_valor_inventario: datos={}
12. estadisticas_desechos_mes: datos={}
13. error: datos={ "motivo": "..." }

EJEMPLOS:
Usuario: "muestra los productos"
{"mensaje": "Aquí tienes todos los productos registrados", "accion": "listar_productos", "entidad": "productos", "datos": {}}

Usuario: "crea un producto llamado Leche con precio 2.5"
{"mensaje": "Voy a crear el producto Leche", "accion": "crear_producto", "entidad": "productos", "datos": {"nombre": "Leche", "descripcion": "", "precio": 2.5, "stock": 0, "fechaCaducidad": null}}

Usuario: "crea un pedido a Distribuidora Alimenticia con 10 Leches"
{"mensaje": "Creando pedido", "accion": "crear_pedido", "entidad": "pedidos", "datos": {"proveedorNombre": "Distribuidora Alimenticia", "productos": [{"productoNombre": "Leche", "cantidad": 10}], "costeTotal": 25}}

Usuario: "registra un desecho de 5 Leches por caducidad"
{"mensaje": "Registrando desecho", "accion": "registrar_desecho", "entidad": "desechos", "datos": {"productoNombre": "Leche", "cantidadPerdida": 5, "motivo": "Caducidad"}}

Usuario: "verifica productos caducados"
{"mensaje": "Verificando productos caducados", "accion": "verificar_caducados", "entidad": "desechos", "datos": {}}

Usuario: "qué productos tienen stock bajo"
{"mensaje": "Productos con stock crítico", "accion": "estadisticas_stock_bajo", "entidad": "", "datos": {"umbral": 10}}`;

function buildMessages(mensajeUsuario) {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: mensajeUsuario }
  ];
}

const providers = {
  'gemini-flash': geminiProvider,
  'groq-llama': groqProvider,
  'hf-mistral': huggingfaceProvider
};

async function askProvider(modelo, mensajes) {
  const provider = providers[modelo];
  if (!provider) {
    throw new Error(`Modelo desconocido: ${modelo}. Usa: ${Object.keys(providers).join(', ')}`);
  }
  return provider.ask(mensajes);
}

function parsearRespuesta(raw) {
  const cleaned = raw.trim();
  const json = cleaned.startsWith('```') ? cleaned.replace(/```json?\n?|```/g, '').trim() : cleaned;

  try {
    const parsed = JSON.parse(json);
    if (!parsed.accion || !parsed.mensaje) {
      throw new Error('Respuesta LLM incompleta');
    }
    return parsed;
  } catch (e) {
    throw new Error(`Respuesta LLM inválida: ${e.message}. Raw: ${raw}`);
  }
}

async function interpretar(mensajeUsuario, modelo) {
  const mensajes = buildMessages(mensajeUsuario);
  const raw = await askProvider(modelo, mensajes);
  return parsearRespuesta(raw);
}

async function interpretarConReintento(mensajeUsuario, modelo) {
  try {
    return await interpretar(mensajeUsuario, modelo);
  } catch (error) {
    const mensajes = buildMessages(
      `${mensajeUsuario}\n\nIMPORTANTE: Debes responder SOLO con JSON válido.`
    );
    const raw = await askProvider(modelo, mensajes);
    return parsearRespuesta(raw);
  }
}

module.exports = { interpretar: interpretarConReintento };
