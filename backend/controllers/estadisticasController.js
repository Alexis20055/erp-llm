const Producto = require('../models/Producto');
const Desecho = require('../models/Desecho');
const Pedido = require('../models/Pedido');

const stockBajo = async (req, res) => {
    try {
        const umbral = parseInt(req.query.umbral) || 10;
        const productos = await Producto.find({ stock: { $lt: umbral } }).populate('proveedor');
        res.status(200).json({ umbral, total: productos.length, productos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const valorInventario = async (req, res) => {
    try {
        const productos = await Producto.find();
        const totalValor = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
        const totalProductos = productos.length;
        const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
        res.status(200).json({ totalValor, totalProductos, totalStock });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const desechosPorMes = async (req, res) => {
    try {
        const datos = await Desecho.aggregate([
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    totalPerdida: { $sum: '$cantidadPerdida' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);
        res.status(200).json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { stockBajo, valorInventario, desechosPorMes };
