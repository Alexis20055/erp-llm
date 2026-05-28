function ProductsTable({ productos }) {
  if (!productos || productos.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "20px",
        background: "#111827",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #334155",
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #334155",
        }}
      >
        <h3 style={{ margin: 0 }}>Productos</h3>
        <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
          Listado de productos registrados en el ERP
        </p>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#1e293b" }}>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Precio</th>
            <th style={thStyle}>Stock</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((producto) => (
            <tr key={producto._id}>
              <td style={tdStyle}>{producto.nombre}</td>
              <td style={tdStyle}>{producto.precio} €</td>
              <td style={tdStyle}>{producto.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

export default ProductsTable;