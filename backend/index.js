require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// TODO: Aqui cargamos las rutas despues2
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/proveedores', require('./routes/proveedorRoutes'));
app.use('/api/pedidos', require('./routes/pedidoRoutes'));
app.use('/api/desechos', require('./routes/desechoRoutes'));

//TODO: Revisar puerto, puede bloquearse
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor de ERP escuchando en el puerto ${PORT}`));