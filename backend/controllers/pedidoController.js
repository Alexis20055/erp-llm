const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

const crearPedido = async (req, res) => {
    try {
        const { proveedor, productos, costeTotal } = req.body;
        const nuevoPedido = new Pedido({ proveedor, productos, costeTotal });
        await nuevoPedido.save();

        for (let item of productos) {
            await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: item.cantidad } });
        }

        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('proveedor').populate('productos.producto');
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id).populate('proveedor').populate('productos.producto');
        if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true }).populate('proveedor').populate('productos.producto');
        if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        res.status(200).json(pedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eliminarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndDelete(req.params.id);
        if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });

        for (let item of pedido.productos) {
            await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
        }

        res.status(200).json({ mensaje: 'Pedido eliminado y stock revertido' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crearPedido, obtenerPedidos, obtenerPedidoPorId, actualizarPedido, eliminarPedido };
