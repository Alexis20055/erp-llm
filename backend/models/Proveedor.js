const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({ //por defecto tods estan requeridos
                                                //TODO: Añadir mas? por ahora no creo que sea necesario
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Proveedor', proveedorSchema);