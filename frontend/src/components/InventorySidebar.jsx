import { useState, useEffect } from "react";
import api from "../services/api";

function InventorySidebar({ refreshTrigger }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, [refreshTrigger]);

  async function fetchProductos() {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch (e) {
      //
    } finally {
      setCargando(false);
    }
  }

  const totalProductos = productos.length;
  const totalStock = productos.reduce((sum, p) => sum + (p.stock || 0), 0);

  const getColor = (stock) => {
    if (stock <= 0) return "#ef4444";
    if (stock < 5) return "#f97316";
    if (stock < 10) return "#eab308";
    return "#22c55e";
  };

  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        background: "rgba(15, 23, 42, 0.85)",
        border: "1px solid #334155",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "fit-content",
        maxHeight: "100%",
        overflowY: "auto",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "18px" }}>Inventario</h3>

      {cargando ? (
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Cargando...</p>
      ) : (
        <>
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              style={{
                flex: 1,
                background: "#111827",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {totalProductos}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                Productos
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "#111827",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {totalStock}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                Unidades
              </div>
            </div>
          </div>

          <div
            style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}
          >
            Productos ({productos.length})
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {productos.map((p) => (
              <div
                key={p._id}
                style={{
                  background: "#111827",
                  padding: "10px 12px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#f8fafc",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.nombre}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: getColor(p.stock),
                      marginLeft: "8px",
                    }}
                  >
                    {p.stock}
                  </span>
                </div>
                <div
                  style={{
                    height: "4px",
                    background: "#1e293b",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${
                        totalStock > 0
                          ? (p.stock / totalStock) * 100
                          : 0
                      }%`,
                      background: getColor(p.stock),
                      borderRadius: "2px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default InventorySidebar;
