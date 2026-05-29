const MODELOS = [
  {
    id: 'groq-llama',
    nombre: 'Llama 3.3 70B (Groq)',
    desc: 'Preciso, ~1s',
    apiKey: 'GROQ_API_KEY'
  },
  {
    id: 'groq-llama8b',
    nombre: 'Llama 3.1 8B (Groq)',
    desc: 'Rápido, ~0.3s',
    apiKey: 'GROQ_API_KEY'
  },
  {
    id: 'groq-mixtral',
    nombre: 'Mixtral 8x7B (Groq)',
    desc: 'MoE, ~1.5s',
    apiKey: 'GROQ_API_KEY'
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
        <span style={{ color: "#64748b", fontSize: "12px" }}>
          {actual.desc}
        </span>
      )}
    </div>
  );
}

export { MODELOS };
export default ModelSelector;
