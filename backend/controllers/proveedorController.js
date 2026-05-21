//Importamos el modelo Proveedor
const Proveedor = require('../models/Proveedor');

//Creamos el nuevo proveedor
const crearProveedor = async (req, res) => {
    try {
        const nuevoProveedor = new Proveedor(req.body);
        await nuevoProveedor.save();
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Obtenemos todos los proveedores 
const obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crearProveedor, obtenerProveedores };