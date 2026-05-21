const mongoose = require('mongoose');

// registra la perdida de stock
const desechoSchema = new mongoose.Schema({
    productoRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    nombreProducto: { type: String, required: true },
    cantidadPerdida: { type: Number, required: true },
    motivo: { type: String, default: 'Caducidad' }
}, { timestamps: true });

module.exports = mongoose.model('Desecho', desechoSchema);