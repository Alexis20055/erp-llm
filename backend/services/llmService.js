const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

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
{"mensaje": "Aquí tienes todos los productos registrados en el sistema", "accion": "listar_productos", "entidad": "productos", "datos": {}}

Usuario: "enséñame los proveedores"
{"mensaje": "Claro, estos son los proveedores disponibles", "accion": "listar_proveedores", "entidad": "proveedores", "datos": {}}

Usuario: "crea un producto llamado Leche entera con precio 2.50 y stock 100"
{"mensaje": "Voy a crear el producto Leche entera", "accion": "crear_producto", "entidad": "productos", "datos": {"nombre": "Leche entera", "descripcion": "", "precio": 2.5, "stock": 100, "fechaCaducidad": null}}

Usuario: "registra un desecho de 5 unidades de Leche por caducidad"
{"mensaje": "Registrando desecho de 5 unidades", "accion": "registrar_desecho", "entidad": "desechos", "datos": {"productoNombre": "Leche", "cantidadPerdida": 5, "motivo": "Caducidad"}}

Usuario: "crea un pedido a Distribuidora Alimenticia con 50 Leches"
{"mensaje": "Creando pedido a Distribuidora Alimenticia", "accion": "crear_pedido", "entidad": "pedidos", "datos": {"proveedorNombre": "Distribuidora Alimenticia", "productos": [{"productoNombre": "Leche", "cantidad": 50}], "costeTotal": 125}}

Usuario: "verifica productos caducados"
{"mensaje": "Verificando productos caducados", "accion": "verificar_caducados", "entidad": "desechos", "datos": {}}

Usuario: "qué productos tienen stock bajo"
{"mensaje": "Estos son los productos con stock crítico", "accion": "estadisticas_stock_bajo", "entidad": "", "datos": {"umbral": 10}}`;

function buildPrompt(mensajeUsuario) {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: mensajeUsuario }
  ];
}

async function askOllama(modelo, mensajes) {
  const url = `${OLLAMA_URL}/api/chat`;

  const body = JSON.stringify({
    model: modelo,
    messages: mensajes,
    format: 'json',
    stream: false,
    options: {
      temperature: 0.1,
      num_predict: 512
    }
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.message.content;
}

function parsearRespuesta(raw) {
  try {
    const parsed = JSON.parse(raw.trim());

    if (!parsed.accion || !parsed.mensaje) {
      throw new Error('Respuesta LLM incompleta');
    }

    return parsed;
  } catch (e) {
    throw new Error(`Respuesta LLM inválida: ${e.message}. Raw: ${raw}`);
  }
}

async function interpretar(mensajeUsuario, modelo) {
  const mensajes = buildPrompt(mensajeUsuario);
  const raw = await askOllama(modelo, mensajes);
  return parsearRespuesta(raw);
}

async function interpretarConReintento(mensajeUsuario, modelo) {
  try {
    return await interpretar(mensajeUsuario, modelo);
  } catch (error) {
    const mensajes = buildPrompt(
      `${mensajeUsuario}\n\nIMPORTANTE: Debes responder SOLO con JSON válido. No incluyas texto, explicaciones ni markdown.`
    );
    mensajes.push({
      role: 'assistant',
      content: `{"mensaje": "Voy a procesar tu solicitud", "accion": "error", "entidad": "", "datos": {"motivo": "reintento"}}`
    });

    const raw = await askOllama(modelo, mensajes);
    return parsearRespuesta(raw);
  }
}

module.exports = { interpretar: interpretarConReintento };
