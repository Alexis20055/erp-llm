const HF_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

function buildPrompt(mensajes) {
  const system = mensajes.find(m => m.role === 'system')?.content || '';
  const user = mensajes.find(m => m.role === 'user')?.content || '';
  return `<s>[INST] ${system}\n\n${user} [/INST]`;
}

async function ask(mensajes) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('HUGGINGFACE_API_KEY no configurada en .env');

  const prompt = buildPrompt(mensajes);

  const response = await fetch(HF_URL, {
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
    throw new Error(`HuggingFace error (${response.status}): ${text}`);
  }

  const data = await response.json();
  if (Array.isArray(data) && data.length > 0) {
    return data[0].generated_text;
  }
  throw new Error(`HuggingFace respuesta inesperada: ${JSON.stringify(data)}`);
}

module.exports = { ask };
