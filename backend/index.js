require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/productos', require('./rutas/rutaProductos'));
app.use('/api/proveedores', require('./rutas/rutasProveedor'));
app.use('/api/pedidos', require('./rutas/rutaPedidos'));
app.use('/api/desechos', require('./rutas/rutaDesechos'));
app.use('/api/estadisticas', require('./rutas/rutaEstadisticas'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor de ERP escuchando en el puerto ${PORT}`));