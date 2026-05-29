import { useState, useEffect } from "react";
import api from "../services/api";

function WasteSidebar({ refreshTrigger }) {
  const [desechos, setDesechos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchDesechos();
  }, [refreshTrigger]);

  async function fetchDesechos() {
    try {
      const res = await api.get("/desechos");
      setDesechos(res.data);
    } catch (e) {
      //
    } finally {
      setCargando(false);
    }
  }

  const totalRegistros = desechos.length;
  const totalPerdido = desechos.reduce((sum, d) => sum + (d.cantidadPerdida || 0), 0);

  const formatearFecha = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
      <h3 style={{ margin: 0, fontSize: "18px" }}>Desechos</h3>

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
                {totalRegistros}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                Registros
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
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#ef4444",
                }}
              >
                {totalPerdido}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                Unid. perdidas
              </div>
            </div>
          </div>

          <div
            style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}
          >
            Desechos ({desechos.length})
          </div>

          {desechos.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>
              No hay registros de desecho
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {desechos.map((d) => (
                <div
                  key={d._id}
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
                      {d.nombreProducto}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#ef4444",
                        marginLeft: "8px",
                      }}
                    >
                      -{d.cantidadPerdida}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "4px",
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    <span>{d.motivo}</span>
                    <span>{formatearFecha(d.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WasteSidebar;
