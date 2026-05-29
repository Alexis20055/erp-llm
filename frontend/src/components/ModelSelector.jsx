const MODELOS = [
  {
    id: 'gemini-flash',
    nombre: 'Gemini 2.0 Flash',
    desc: 'Google AI — rápido, preciso, free tier',
    apiKey: 'GEMINI_API_KEY'
  },
  {
    id: 'groq-llama',
    nombre: 'Llama 3.1 70B (Groq)',
    desc: 'Groq — muy rápido, free tier',
    apiKey: 'GROQ_API_KEY'
  },
  {
    id: 'hf-mistral',
    nombre: 'Mistral 7B (HuggingFace)',
    desc: 'Hugging Face — gratuito, menos fiable',
    apiKey: 'HUGGINGFACE_API_KEY'
  }
];

function ModelSelector({ modelo, setModelo }) {
  const actual = MODELOS.find((m) => m.id === modelo);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "14px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <label
        htmlFor="model-select"
        style={{ color: "#94a3b8", fontSize: "14px" }}
      >
        Modelo IA:
      </label>
      <select
        id="model-select"
        value={modelo}
        onChange={(e) => setModelo(e.target.value)}
        style={{
          padding: "8px 16px",
          borderRadius: "10px",
          border: "1px solid #334155",
          background: "#0f172a",
          color: "white",
          fontSize: "14px",
          outline: "none",
          cursor: "pointer",
        }}
      >
        {MODELOS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>
      {actual && (
        <span
          style={{ color: "#64748b", fontSize: "12px" }}
          title={actual.apiKey}
        >
          {actual.desc}
        </span>
      )}
    </div>
  );
}

export { MODELOS };
export default ModelSelector;
