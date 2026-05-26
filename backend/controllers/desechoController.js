const Desecho = require('../models/Desecho');
const Producto = require('../models/Producto');

const registrarDesecho = async (req, res) => {
    try {
        const { productoId, cantidadPerdida, motivo } = req.body;

        const producto = await Producto.findById(productoId);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

        const nuevoDesecho = new Desecho({
            productoRef: producto._id,
            nombreProducto: producto.nombre,
            cantidadPerdida,
            motivo: motivo || 'Caducidad'
        });
        await nuevoDesecho.save();

        producto.stock -= cantidadPerdida;
        if (producto.stock <= 0) {
            await Producto.findByIdAndDelete(productoId);
        } else {
            await producto.save();
        }

        res.status(201).json(nuevoDesecho);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const obtenerDesechos = async (req, res) => {
    try {
        const desechos = await Desecho.find().populate('productoRef');
        res.status(200).json(desechos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerDesechoPorId = async (req, res) => {
    try {
        const desecho = await Desecho.findById(req.params.id).populate('productoRef');
        if (!desecho) return res.status(404).json({ mensaje: 'Desecho no encontrado' });
        res.status(200).json(desecho);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarDesecho = async (req, res) => {
    try {
        const desecho = await Desecho.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true }).populate('productoRef');
        if (!desecho) return res.status(404).json({ mensaje: 'Desecho no encontrado' });
        res.status(200).json(desecho);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eliminarDesecho = async (req, res) => {
    try {
        const desecho = await Desecho.findByIdAndDelete(req.params.id);
        if (!desecho) return res.status(404).json({ mensaje: 'Desecho no encontrado' });
        res.status(200).json({ mensaje: 'Desecho eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verificarCaducados = async (req, res) => {
    try {
        const ahora = new Date();
        const caducados = await Producto.find({ fechaCaducidad: { $lte: ahora }, stock: { $gt: 0 } });
        const desechosCreados = [];

        for (const producto of caducados) {
            const desecho = new Desecho({
                productoRef: producto._id,
                nombreProducto: producto.nombre,
                cantidadPerdida: producto.stock,
                motivo: 'Caducidad automática'
            });
            await desecho.save();
            desechosCreados.push(desecho);

            await Producto.findByIdAndDelete(producto._id);
        }

        res.status(200).json({ mensaje: `Se procesaron ${desechosCreados.length} productos caducados`, desechos: desechosCreados });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registrarDesecho, obtenerDesechos, obtenerDesechoPorId, actualizarDesecho, eliminarDesecho, verificarCaducados };
