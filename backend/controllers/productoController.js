const Producto = require('../models/Producto');

// Función para crear un nuevo producto
const crearProducto = async (req, res) => {
    try { //con catch para error general

         //Extraemos los datos que vienen en el JSON
        const { nombre, descripcion, precio, stock, proveedor, fechaCaducidad } = req.body;

        // Creamos una nueva instancia del modelo Producto con esos datos
        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            stock,
            proveedor,
            fechaCaducidad
        });

        // lo guardamos en la base de datos de MongoDB
        const productoGuardado = await nuevoProducto.save();

        // devolvemos una respuesta de éxito cdigo 201
        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: productoGuardado
        });

    } catch (error) {
        // Si hay algún error por ejemplo faltan campos obligatorios
        console.error('Error al crear el producto:', error);

        //TODO: Cambiar el error? Este es un error general

        // devolvemos un código de error 400 Bad Request
        res.status(400).json({
            mensaje: 'Hubo un error al crear el producto',
            error: error.message
        });
    }
};

// Exportamos la función para poder usarla 
module.exports = {
    crearProducto
};