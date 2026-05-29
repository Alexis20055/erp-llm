const Producto = require('../models/Producto');
const Proveedor = require('../models/Proveedor');
const Pedido = require('../models/Pedido');
const Desecho = require('../models/Desecho');

async function poblar(req, res) {
  try {
    await Promise.all([
      Producto.deleteMany({}),
      Proveedor.deleteMany({}),
      Pedido.deleteMany({}),
      Desecho.deleteMany({})
    ]);

    const proveedores = await Proveedor.insertMany([
      { nombre: 'Distribuidora Alimenticia S.A.', email: 'info@distalimenticia.com', telefono: '952111111' },
      { nombre: 'Lácteos del Sur', email: 'pedidos@lacteossur.es', telefono: '952222222' },
      { nombre: 'Bebidas del Mediterráneo', email: 'ventas@bebidasmed.com', telefono: '952333333' },
      { nombre: 'Carnes Selectas SL', email: 'hola@carnesselectas.es', telefono: '952444444' }
    ]);

    const hace6meses = new Date();
    hace6meses.setMonth(hace6meses.getMonth() - 6);

    const dentro2meses = new Date();
    dentro2meses.setMonth(dentro2meses.getMonth() + 2);

    const dentro6meses = new Date();
    dentro6meses.setMonth(dentro6meses.getMonth() + 6);

    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const productos = await Producto.insertMany([
      { nombre: 'Leche entera 1L', descripcion: 'Leche pasteurizada entera', precio: 1.20, stock: 200, proveedor: proveedores[1]._id, fechaCaducidad: dentro2meses },
      { nombre: 'Leche semidesnatada 1L', descripcion: 'Leche pasteurizada semidesnatada', precio: 1.15, stock: 150, proveedor: proveedores[1]._id, fechaCaducidad: dentro2meses },
      { nombre: 'Yogur natural pack 4ud', descripcion: 'Yogur natural sin azúcar', precio: 2.50, stock: 80, proveedor: proveedores[1]._id, fechaCaducidad: dentro2meses },
      { nombre: 'Pan de molde integral', descripcion: 'Pan de molde integral 500g', precio: 2.80, stock: 3, proveedor: proveedores[0]._id, fechaCaducidad: dentro6meses },
      { nombre: 'Agua mineral 1.5L', descripcion: 'Agua mineral natural', precio: 0.90, stock: 5, proveedor: proveedores[2]._id, fechaCaducidad: dentro6meses },
      { nombre: 'Refresco de cola 2L', descripcion: 'Refresco carbonatado sabor cola', precio: 1.95, stock: 120, proveedor: proveedores[2]._id, fechaCaducidad: dentro6meses },
      { nombre: 'Pechuga de pollo 1kg', descripcion: 'Pechuga de pollo fresca', precio: 7.50, stock: 30, proveedor: proveedores[3]._id, fechaCaducidad: dentro2meses },
      { nombre: 'Lomo de cerdo 1kg', descripcion: 'Lomo de cerdo fresco', precio: 9.80, stock: 1, proveedor: proveedores[3]._id, fechaCaducidad: ayer },
      { nombre: 'Harina de trigo 1kg', descripcion: 'Harina de trigo común', precio: 1.10, stock: 0, proveedor: proveedores[0]._id, fechaCaducidad: dentro6meses },
      { nombre: 'Aceite de oliva virgen extra 1L', descripcion: 'AOVE primera presión en frío', precio: 12.50, stock: 45, proveedor: proveedores[0]._id, fechaCaducidad: dentro6meses }
    ]);

    const pedido1 = await Pedido.create({
      proveedor: proveedores[0]._id,
      productos: [
        { producto: productos[3]._id, cantidad: 50 },
        { producto: productos[8]._id, cantidad: 100 },
        { producto: productos[9]._id, cantidad: 60 }
      ],
      costeTotal: 50 * productos[3].precio + 100 * productos[8].precio + 60 * productos[9].precio
    });

    const desecho = await Desecho.create({
      productoRef: productos[7]._id,
      nombreProducto: productos[7].nombre,
      cantidadPerdida: 2,
      motivo: 'Caducidad manual'
    });

    res.status(201).json({
      mensaje: `Base de datos poblada: ${proveedores.length} proveedores, ${productos.length} productos, 1 pedido, 1 desecho`,
      stats: {
        proveedores: proveedores.length,
        productos: productos.length,
        pedidos: 1,
        desechos: 1
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error poblando la base de datos', error: error.message });
  }
}

module.exports = { poblar };
