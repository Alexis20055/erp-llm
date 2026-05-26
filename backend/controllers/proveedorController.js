const Proveedor = require('../models/Proveedor');

const crearProveedor = async (req, res) => {
    try {
        const nuevoProveedor = new Proveedor(req.body);
        await nuevoProveedor.save();
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerProveedorPorId = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        res.status(200).json(proveedor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
        if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        res.status(200).json(proveedor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eliminarProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByIdAndDelete(req.params.id);
        if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        res.status(200).json({ mensaje: 'Proveedor eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crearProveedor, obtenerProveedores, obtenerProveedorPorId, actualizarProveedor, eliminarProveedor };
