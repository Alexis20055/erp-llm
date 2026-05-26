const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

const crearPedido = async (req, res) => {
    try {
        const { proveedor, productos, costeTotal } = req.body;

        // 1. Crear el pedido
        const nuevoPedido = new Pedido({ proveedor, productos, costeTotal });
        await nuevoPedido.save();

        // 2. Actualizar el stock 
        for (let item of productos) {
            await Producto.findByIdAndUpdate(
                item.producto, 
                { $inc: { stock: item.cantidad } }
            );
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

module.exports = { crearPedido, obtenerPedidos };