const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({ 
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: true },
    productos: [{
        producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
        cantidad: { type: Number, required: true, min: 1 }
    }],
    costeTotal: { type: Number, required: true }
}, { timestamps: true }); // el createdAt servirá como fecha del pedido, por ahora deberia funcionar

module.exports = mongoose.model('Pedido', pedidoSchema);