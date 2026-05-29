const MODELOS = [
  {
    id: 'llama3.2',
    nombre: 'Llama 3.2 (3B)',
    desc: 'Rápido, básico ~2GB RAM',
    install: 'ollama pull llama3.2'
  },
  {
    id: 'phi3.5',
    nombre: 'Phi-3.5 (3.8B)',
    desc: 'Equilibrado ~3GB RAM',
    install: 'ollama pull phi3.5'
  },
  {
    id: 'mistral',
    nombre: 'Mistral (7B)',
    desc: 'Preciso ~5GB RAM',
    install: 'ollama pull mistral'
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
          title={`Instalar: ${actual.install}`}
        >
          {actual.desc}
        </span>
      )}
    </div>
  );
}

export { MODELOS };
export default ModelSelector;
