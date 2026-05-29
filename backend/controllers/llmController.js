const llmService = require('../services/llmService');
const actionExecutor = require('../services/actionExecutor');

const interacciones = [];

async function chat(req, res) {
  const { mensaje, modelo } = req.body;

  if (!mensaje) {
    return res.status(400).json({ mensaje: 'El mensaje es obligatorio', datos: null, accion: 'error', entidad: '' });
  }

  const modeloUsado = modelo || 'llama3.2';

  try {
    const interpretacion = await llmService.interpretar(mensaje, modeloUsado);

    if (interpretacion.accion === 'error') {
      interacciones.push({
        modelo: modeloUsado,
        mensajeUsuario: mensaje,
        respuestaLLM: interpretacion,
        accionEjecutada: null,
        timestamp: new Date(),
        exito: false,
        error: interpretacion.datos?.motivo || 'Error interpretando mensaje'
      });

      return res.json({
        mensaje: interpretacion.mensaje,
        datos: null,
        accion: 'error',
        entidad: ''
      });
    }

    const resultado = await actionExecutor.ejecutar(interpretacion.accion, interpretacion.datos);

    interacciones.push({
      modelo: modeloUsado,
      mensajeUsuario: mensaje,
      respuestaLLM: interpretacion,
      accionEjecutada: interpretacion.accion,
      timestamp: new Date(),
      exito: true
    });

    res.json({
      mensaje: resultado.mensaje || interpretacion.mensaje,
      datos: resultado.datos || null,
      accion: interpretacion.accion,
      entidad: interpretacion.entidad
    });

  } catch (error) {
    interacciones.push({
      modelo: modeloUsado,
      mensajeUsuario: mensaje,
      respuestaLLM: null,
      accionEjecutada: null,
      timestamp: new Date(),
      exito: false,
      error: error.message
    });

    res.json({
      mensaje: `Error: ${error.message}`,
      datos: null,
      accion: 'error',
      entidad: ''
    });
  }
}

function obtenerLogs(req, res) {
  res.json(interacciones);
}

module.exports = { chat, obtenerLogs };
