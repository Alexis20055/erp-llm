const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const MODELOS = {
  'groq-llama': 'llama-3.3-70b-versatile',
  'groq-llama8b': 'llama-3.1-8b-instant',
  'groq-mixtral': 'openai/gpt-oss-20b'
};

async function ask(mensajes, modeloId) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY no configurada en .env');

  const model = MODELOS[modeloId];
  if (!model) throw new Error(`Modelo Groq desconocido: ${modeloId}`);

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: mensajes.map(m => ({ role: m.role, content: m.content })),
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 512
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = { ask, modelosDisponibles: Object.keys(MODELOS) };
