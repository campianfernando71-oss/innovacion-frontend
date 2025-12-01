// src/data.jsx

// 📦 Lista de productos
const productosData = [
  { id_producto: 1, nombre: 'Hamburguesa Clásica', precio: 15 },
  { id_producto: 2, nombre: 'Pizza Personal', precio: 20 },
  { id_producto: 3, nombre: 'Pollo a la Brasa (1/4)', precio: 18 },
  { id_producto: 4, nombre: 'Ensalada César', precio: 12 },
  { id_producto: 5, nombre: 'Sopa del Día', precio: 10 },
  { id_producto: 6, nombre: 'Coca-Cola 500ml', precio: 5 },
  { id_producto: 7, nombre: 'Jugo Natural de Naranja', precio: 8 },
  { id_producto: 8, nombre: 'Café Americano', precio: 6 },
  { id_producto: 9, nombre: 'Postre de Chocolate', precio: 9 },
  { id_producto: 10, nombre: 'Agua Mineral 500ml', precio: 4 },
];

// 🛒 Ventas registradas (usando id_producto para evitar errores)
const ventas = [
  {
    id: 1,
    fecha: '2025-08-14',
    hora: '10:30 AM',
    productos: [
      { id_producto: 1, cantidad: 2 }, // Hamburguesa Clásica
      { id_producto: 6, cantidad: 2 }, // Coca-Cola 500ml
    ],
  },
  {
    id: 2,
    fecha: '2025-08-12',
    hora: '02:15 PM',
    productos: [
      { id_producto: 2, cantidad: 1 }, // Pizza Personal
    ],
  },
  {
    id: 3,
    fecha: '2025-07-30',
    hora: '08:45 PM',
    productos: [
      { id_producto: 7, cantidad: 1 }, // Jugo Natural de Naranja
    ],
  },
];

// 👥 Lista de clientes
const clientes = [
  { id_cliente: 1, nombre: 'Luis Ortega', telefono: '987654321' },
  { id_cliente: 2, nombre: 'María López', telefono: '912345678' },
  { id_cliente: 3, nombre: 'Juan Pérez', telefono: '965432187' },
];

// 🧑‍💼 Empleados
const empleados = [
  { id_empleado: 1, nombre: 'Carlos Ramos', cargo: 'Cajero' },
  { id_empleado: 2, nombre: 'Ana Torres', cargo: 'Mesera' },
  { id_empleado: 3, nombre: 'Pedro Gómez', cargo: 'Cocinero' },
];

// 🔹 Función para obtener ventas con datos completos
function getVentasDetalladas() {
  return ventas.map(venta => ({
    ...venta,
    productosData: venta.productos.map(vp => {
      const prod = productos.find(p => p.id_producto === vp.id_producto);
      return {
        ...vp,
        nombre: prod?.nombre || 'Producto desconocido',
        precio: prod?.precio || 0,
        subtotal: (prod?.precio || 0) * vp.cantidad,
      };
    }),
  }));
}

export { productosData, ventas, clientes, empleados, getVentasDetalladas };

// 📦 Lista de productos en almacén
const productosAlmacen = [
  { id_producto: 1, nombre: "Aceite 10W40", stock: 120, unidad: "Litros" },
  { id_producto: 2, nombre: "Filtro de aceite", stock: 80, unidad: "Unidades" },
  { id_producto: 3, nombre: "Batería 12V", stock: 25, unidad: "Unidades" },
  { id_producto: 4, nombre: "Pastillas de freno", stock: 60, unidad: "Juegos" },
  { id_producto: 5, nombre: "Anticongelante", stock: 40, unidad: "Litros" },
];

// 📝 Registro de entradas al almacén
const entradasAlmacen = [
  {
    id: 1,
    id_producto: 1,
    cantidad: 50,
    fecha: "2025-10-07",
    proveedor: "Lubricantes S.A.",
    usuario: "Fernando",
  },
  {
    id: 2,
    id_producto: 2,
    cantidad: 30,
    fecha: "2025-10-08",
    proveedor: "Repuestos Express",
    usuario: "Ana",
  },
  {
    id: 3,
    id_producto: 3,
    cantidad: 10,
    fecha: "2025-10-09",
    proveedor: "Baterías Perú",
    usuario: "Carlos",
  },
];

// 📝 Registro de salidas del almacén
const salidasAlmacen = [
  {
    id: 1,
    id_producto: 1,
    cantidad: 10,
    fecha: "2025-10-10",
    destino: "Orden de trabajo #101",
    usuario: "Fernando",
  },
  {
    id: 2,
    id_producto: 2,
    cantidad: 5,
    fecha: "2025-10-11",
    destino: "Orden de trabajo #102",
    usuario: "Ana",
  },
];

// 📝 Registro de devoluciones al almacén
const devolucionesAlmacen = [
  {
    id: 1,
    id_producto: 2,
    cantidad: 2,
    fecha: "2025-10-12",
    motivo: "Producto no utilizado",
    usuario: "Carlos",
  },
];

// 🔹 Función para obtener el stock actualizado en tiempo real
function getStockActual() {
  // Suma entradas, resta salidas y suma devoluciones
  const stock = {};
  productosAlmacen.forEach(p => {
    stock[p.id_producto] = p.stock;
  });
  entradasAlmacen.forEach(e => {
    stock[e.id_producto] = (stock[e.id_producto] || 0) + e.cantidad;
  });
  salidasAlmacen.forEach(s => {
    stock[s.id_producto] = (stock[s.id_producto] || 0) - s.cantidad;
  });
  devolucionesAlmacen.forEach(d => {
    stock[d.id_producto] = (stock[d.id_producto] || 0) + d.cantidad;
  });
  return productosAlmacen.map(p => ({
    ...p,
    stock: stock[p.id_producto] || 0,
  }));
}

export {
  productosAlmacen,
  entradasAlmacen,
  salidasAlmacen,
  devolucionesAlmacen,
  getStockActual,
};