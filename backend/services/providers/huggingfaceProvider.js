const HF_URL = 'https://api-inference.huggingface.co/models/google/gemma-2-2b-it';

function buildPrompt(mensajes) {
  const system = mensajes.find(m => m.role === 'system')?.content || '';
  const user = mensajes.find(m => m.role === 'user')?.content || '';
  return `<start_of_turn>user\n${system}\n\n${user}<end_of_turn>\n<start_of_turn>model\n`;
}

async function ask(mensajes) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('HUGGINGFACE_API_KEY no configurada en .env');

  const prompt = buildPrompt(mensajes);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(HF_URL, {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature: 0.1,
          max_new_tokens: 512,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 503) {
        throw new Error('HuggingFace: modelo cargando (cold start), espera 20s y reintenta');
      }
      throw new Error(`HuggingFace error (${response.status}): ${text}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0].generated_text;
    }
    throw new Error(`HuggingFace respuesta inesperada: ${JSON.stringify(data)}`);
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { ask };
