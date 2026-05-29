function ProvidersTable({ proveedores }) {
  if (!proveedores || proveedores.length === 0) return null;

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
        <h3 style={{ margin: 0 }}>Proveedores</h3>
        <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
          Listado de proveedores registrados en el ERP
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
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((prov) => (
            <tr key={prov._id}>
              <td style={tdStyle}>{prov.nombre}</td>
              <td style={tdStyle}>{prov.email}</td>
              <td style={tdStyle}>{prov.telefono}</td>
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

export default ProvidersTable;
