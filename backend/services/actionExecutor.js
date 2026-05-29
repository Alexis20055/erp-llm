const Producto = require('../models/Producto');
const Proveedor = require('../models/Proveedor');
const Pedido = require('../models/Pedido');
const Desecho = require('../models/Desecho');

async function listarProductos() {
  const productos = await Producto.find().populate('proveedor');
  return { mensaje: `Se encontraron ${productos.length} productos`, datos: productos };
}

async function listarProveedores() {
  const proveedores = await Proveedor.find();
  return { mensaje: `Se encontraron ${proveedores.length} proveedores`, datos: proveedores };
}

async function listarPedidos() {
  const pedidos = await Pedido.find().populate('proveedor').populate('productos.producto');
  return { mensaje: `Se encontraron ${pedidos.length} pedidos`, datos: pedidos };
}

async function listarDesechos() {
  const desechos = await Desecho.find().populate('productoRef');
  return { mensaje: `Se encontraron ${desechos.length} registros de desechos`, datos: desechos };
}

async function crearProducto(datos) {
  const producto = new Producto({
    nombre: datos.nombre,
    descripcion: datos.descripcion || '',
    precio: datos.precio,
    stock: datos.stock || 0,
    fechaCaducidad: datos.fechaCaducidad || null
  });
  const guardado = await producto.save();
  return { mensaje: `Producto "${guardado.nombre}" creado exitosamente`, datos: guardado };
}

async function crearProveedor(datos) {
  const proveedor = new Proveedor({
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono
  });
  const guardado = await proveedor.save();
  return { mensaje: `Proveedor "${guardado.nombre}" creado exitosamente`, datos: guardado };
}

async function crearPedido(datos) {
  const proveedor = await Proveedor.findOne({ nombre: datos.proveedorNombre });
  if (!proveedor) {
    throw new Error(`Proveedor "${datos.proveedorNombre}" no encontrado`);
  }

  const productosPedido = [];
  for (const item of datos.productos) {
    const producto = await Producto.findOne({ nombre: item.productoNombre });
    if (!producto) {
      throw new Error(`Producto "${item.productoNombre}" no encontrado`);
    }
    productosPedido.push({ producto: producto._id, cantidad: item.cantidad });
    await Producto.findByIdAndUpdate(producto._id, { $inc: { stock: item.cantidad } });
  }

  const pedido = new Pedido({
    proveedor: proveedor._id,
    productos: productosPedido,
    costeTotal: datos.costeTotal || 0
  });
  const guardado = await pedido.save();
  return { mensaje: `Pedido a ${proveedor.nombre} creado exitosamente`, datos: guardado };
}

async function registrarDesecho(datos) {
  const producto = await Producto.findOne({ nombre: datos.productoNombre });
  if (!producto) {
    throw new Error(`Producto "${datos.productoNombre}" no encontrado`);
  }

  const desecho = new Desecho({
    productoRef: producto._id,
    nombreProducto: producto.nombre,
    cantidadPerdida: datos.cantidadPerdida,
    motivo: datos.motivo || 'Caducidad'
  });
  await desecho.save();

  producto.stock -= datos.cantidadPerdida;
  if (producto.stock <= 0) {
    await Producto.findByIdAndDelete(producto._id);
  } else {
    await producto.save();
  }

  return { mensaje: `Desecho registrado: ${datos.cantidadPerdida} unidades de "${producto.nombre}"`, datos: desecho };
}

async function verificarCaducados() {
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

  return { mensaje: `Se procesaron ${desechosCreados.length} productos caducados`, datos: desechosCreados };
}

async function estadisticasStockBajo(datos) {
  const umbral = datos.umbral || 10;
  const productos = await Producto.find({ stock: { $lt: umbral } }).populate('proveedor');
  return { mensaje: `Productos con stock menor a ${umbral}: ${productos.length}`, datos: { tipo: 'stock-bajo', umbral, total: productos.length, productos } };
}

async function estadisticasValorInventario() {
  const productos = await Producto.find();
  const totalValor = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
  const totalProductos = productos.length;
  const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
  return { mensaje: `Valor total del inventario: ${totalValor.toFixed(2)}€`, datos: { tipo: 'valor-inventario', totalValor, totalProductos, totalStock } };
}

async function estadisticasDesechosMes() {
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
  return { mensaje: `Estadísticas de desechos por mes`, datos: { tipo: 'desechos-por-mes', registros: datos } };
}

const actionMap = {
  listar_productos: listarProductos,
  listar_proveedores: listarProveedores,
  listar_pedidos: listarPedidos,
  listar_desechos: listarDesechos,
  crear_producto: (datos) => crearProducto(datos),
  crear_proveedor: (datos) => crearProveedor(datos),
  crear_pedido: (datos) => crearPedido(datos),
  registrar_desecho: (datos) => registrarDesecho(datos),
  verificar_caducados: () => verificarCaducados(),
  estadisticas_stock_bajo: (datos) => estadisticasStockBajo(datos),
  estadisticas_valor_inventario: () => estadisticasValorInventario(),
  estadisticas_desechos_mes: () => estadisticasDesechosMes()
};

async function ejecutar(accion, datos) {
  const handler = actionMap[accion];

  if (!handler) {
    throw new Error(`Acción desconocida: ${accion}`);
  }

  return handler(datos || {});
}

module.exports = { ejecutar };
