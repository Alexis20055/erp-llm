const { GoogleGenerativeAI } = require("@google/generative-ai");

async function ask(mensajes) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada en .env');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 512
    }
  });

  const systemMsg = mensajes.find(m => m.role === 'system');
  const userMsg = mensajes.find(m => m.role === 'user');

  const result = await model.generateContent({
    systemInstruction: systemMsg?.content || '',
    contents: [{ role: "user", parts: [{ text: userMsg?.content || '' }] }]
  });

  const text = result.response.text();
  return text;
}

module.exports = { ask };
