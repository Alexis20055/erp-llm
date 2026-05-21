const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true 
    },
    descripcion: { 
        type: String,
        trim: true
    },
    precio: { 
        type: Number, 
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    stock: { 
        type: Number, 
        default: 0, 
        required: true,
        min: [0, 'El stock no puede ser negativo']
    },
    proveedor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Proveedor' 
    },
    fechaCaducidad: { 
        type: Date, 
        required: false 
    }
}, {
    timestamps: true // Esto añade automáticamente createdAt y updatedAt a cada documento
});

module.exports = mongoose.model('Producto', productoSchema);