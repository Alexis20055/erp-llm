const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function ask(mensajes) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY no configurada en .env');

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
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

module.exports = { ask };
