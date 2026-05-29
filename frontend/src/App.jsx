import { useState, useEffect, useRef } from "react";
import api from "./services/api";
import ChatMessage from "./components/ChatMessage";
import ProductsTable from "./components/ProductsTable";
import ProvidersTable from "./components/ProvidersTable";
import StatsView from "./components/StatsView";
import ModelSelector from "./components/ModelSelector";
import InventorySidebar from "./components/InventorySidebar";
import WasteSidebar from "./components/WasteSidebar";

function App() {
  const [mensaje, setMensaje] = useState("");
  const [chat, setChat] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [stats, setStats] = useState(null);
  const [modelo, setModelo] = useState("groq-llama");
  const [cargando, setCargando] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat, cargando, productos, proveedores, stats]);

  const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const escribirRespuestaIA = async (texto) => {
    const id = Date.now();

    setChat((prev) => [
      ...prev,
      { id, autor: "ia", texto: "", escribiendo: true }
    ]);

    for (let i = 0; i <= texto.length; i++) {
      await esperar(25);
      setChat((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, texto: texto.slice(0, i) } : msg
        )
      );
    }

    setChat((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, escribiendo: false } : msg
      )
    );
  };

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const textoUsuario = mensaje;

    setChat((prev) => [
      ...prev,
      { autor: "usuario", texto: mensaje }
    ]);
    setMensaje("");

    try {
      setCargando(true);

      const response = await api.post("/llm/chat", {
        mensaje: textoUsuario,
        modelo
      });

      const { mensaje: respuestaTexto, datos, accion } = response.data;

      if (accion === "listar_productos") {
        setProductos(datos || []);
        setProveedores([]);
        setStats(null);
      } else if (accion === "listar_proveedores") {
        setProveedores(datos || []);
        setProductos([]);
        setStats(null);
      } else if (accion === "listar_pedidos" || accion === "listar_desechos") {
        setProductos([]);
        setProveedores([]);
        setStats(null);
      } else if (accion.startsWith("estadisticas")) {
        setStats(datos);
        setProductos([]);
        setProveedores([]);
      } else {
        setProductos([]);
        setProveedores([]);
        setStats(null);
      }

      await esperar(500);
      setCargando(false);
      await escribirRespuestaIA(respuestaTexto);

    } catch (error) {
      await esperar(500);
      setCargando(false);
      const msg = error.response?.data?.mensaje || error.message;
      await escribirRespuestaIA(`Error: ${msg}`);
    } finally {
      setRefreshTrigger((n) => n + 1);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #020617, #0f172a)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <header style={{ marginBottom: "8px", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "34px" }}>ERP con IA</h1>
          <p style={{ marginTop: "8px", color: "#94a3b8" }}>
            Gestiona productos, proveedores, pedidos y estadísticas mediante lenguaje natural.
          </p>
        </header>

        <ModelSelector modelo={modelo} setModelo={setModelo} />

        <div style={{ display: "flex", gap: "16px", flex: 1, overflow: "hidden" }}>
          <main
            ref={chatRef}
            style={{
              flex: 1,
              border: "1px solid #334155",
              background: "rgba(15, 23, 42, 0.85)",
              padding: "20px",
              borderRadius: "20px",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            }}
          >
            {chat.length === 0 && (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  textAlign: "center",
                }}
              >
                <div>
                  <h2 style={{ color: "white" }}>Bienvenido al ERP inteligente</h2>
                  <p>Escribe una orden como: "Muéstrame los productos"</p>
                  <p style={{ fontSize: "13px", marginTop: "8px", color: "#64748b" }}>
                    También puedes crear productos, proveedores, pedidos y consultar estadísticas.
                  </p>
                </div>
              </div>
            )}

            {chat.map((msg, index) => (
              <ChatMessage
                key={index}
                autor={msg.autor}
                texto={msg.texto}
                escribiendo={msg.escribiendo}
              />
            ))}

            {cargando && (
              <ChatMessage autor="ia" texto="Pensando..." />
            )}

            <ProductsTable productos={productos} />
            <ProvidersTable proveedores={proveedores} />
            <StatsView stats={stats} />
          </main>
          <InventorySidebar refreshTrigger={refreshTrigger} />
          <WasteSidebar refreshTrigger={refreshTrigger} />
        </div>

        <section
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "14px",
            background: "#020617",
            padding: "14px",
            borderRadius: "18px",
            border: "1px solid #334155",
          }}
        >
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
            placeholder='Ej: Muéstrame los productos'
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
              outline: "none",
              fontSize: "15px",
            }}
          />
          <button
            onClick={enviarMensaje}
            style={{
              padding: "14px 24px",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Enviar
          </button>
        </section>
      </div>
    </div>
  );
}

export default App;
