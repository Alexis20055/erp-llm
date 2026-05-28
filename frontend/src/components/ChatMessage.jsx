function ChatMessage({ autor, texto, escribiendo }) {
  const esUsuario = autor === "usuario";
  const blinkStyle = `
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  `;
  return (
      <>
        <style>{blinkStyle}</style>
    <div
      style={{
        display: "flex",
        justifyContent: esUsuario ? "flex-end" : "flex-start",
        marginBottom: "14px",
      }}
    >
      <div
        style={{
          background: esUsuario
            ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
            : "#1e293b",
          color: "white",
          padding: "12px 16px",
          borderRadius: esUsuario ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          maxWidth: "70%",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          lineHeight: "1.5",
        }}
      >
        <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>
          {esUsuario ? "Usuario" : "Asistente ERP"}
        </div>
        <span>
          {texto}
          {escribiendo && (
            <span
              style={{
                animation: "blink 1s infinite",
                marginLeft: "2px",
              }}
            >
              ▋
            </span>
          )}
        </span>
      </div>
    </div>
    </>
  );
}

export default ChatMessage;