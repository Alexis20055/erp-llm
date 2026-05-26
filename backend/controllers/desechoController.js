const Desecho = require('../models/Desecho');
const Producto = require('../models/Producto');

// Llamada para eliminar stock de algo caducado
const registrarDesecho = async (req, res) => {
    try {
        const { productoId, cantidadPerdida } = req.body;

        const producto = await Producto.findById(productoId);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

        //Creamos el registro del desecho
        const nuevoDesecho = new Desecho({
            productoRef: producto._id,
            nombreProducto: producto.nombre,
            cantidadPerdida: cantidadPerdida
        });
        await nuevoDesecho.save();

        //Restamos la cantidad perdida del stock
        producto.stock -= cantidadPerdida;
        
        // Si el stock llega a 0 lo eliminamos
        if(producto.stock <= 0) {
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
        const desechos = await Desecho.find();
        res.status(200).json(desechos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registrarDesecho, obtenerDesechos };