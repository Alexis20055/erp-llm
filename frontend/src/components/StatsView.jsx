function StatsView({ stats }) {
  if (!stats) return null;

  if (stats.tipo === "stock-bajo") {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0 }}>Stock Bajo</h3>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Productos con stock menor a {stats.umbral} (total: {stats.total})
          </p>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#1e293b" }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Precio</th>
            </tr>
          </thead>
          <tbody>
            {stats.productos.map((p) => (
              <tr key={p._id}>
                <td style={tdStyle}>{p.nombre}</td>
                <td style={{ ...tdStyle, color: p.stock === 0 ? "#ef4444" : "#f59e0b" }}>{p.stock}</td>
                <td style={tdStyle}>{p.precio} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (stats.tipo === "valor-inventario") {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0 }}>Valor del Inventario</h3>
        </div>
        <div style={{ padding: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>Valor Total</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#22c55e" }}>
              {stats.totalValor?.toFixed(2)} €
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>Productos</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.totalProductos}</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>Stock Total</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.totalStock} uds</div>
          </div>
        </div>
      </div>
    );
  }

  if (stats.tipo === "desechos-por-mes") {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0 }}>Desechos por Mes</h3>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#1e293b" }}>
              <th style={thStyle}>Año</th>
              <th style={thStyle}>Mes</th>
              <th style={thStyle}>Unidades Perdidas</th>
              <th style={thStyle}>Registros</th>
            </tr>
          </thead>
          <tbody>
            {stats.registros.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r._id.year}</td>
                <td style={tdStyle}>{r._id.month}</td>
                <td style={tdStyle}>{r.totalPerdida}</td>
                <td style={tdStyle}>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

const containerStyle = {
  marginTop: "20px",
  background: "#111827",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid #334155",
  boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
};

const headerStyle = {
  padding: "16px",
  borderBottom: "1px solid #334155",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  padding: "14px",
  textAlign: "left",
  color: "#cbd5e1",
  fontSize: "14px",
};

const tdStyle = {
  padding: "14px",
  borderTop: "1px solid #334155",
  color: "#f8fafc",
};

const cardStyle = {
  background: "#1e293b",
  padding: "16px 24px",
  borderRadius: "12px",
  textAlign: "center",
  flex: 1,
  minWidth: "120px",
};

export default StatsView;
