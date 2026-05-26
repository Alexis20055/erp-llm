const Producto = require('../models/Producto');

const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, proveedor, fechaCaducidad } = req.body;
        const nuevoProducto = new Producto({ nombre, descripcion, precio, stock, proveedor, fechaCaducidad });
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: productoGuardado });
    } catch (error) {
        res.status(400).json({ mensaje: 'Hubo un error al crear el producto', error: error.message });
    }
};

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().populate('proveedor');
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).populate('proveedor');
        if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true }).populate('proveedor');
        if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.status(200).json({ mensaje: 'Producto actualizado', producto });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.status(200).json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto };
