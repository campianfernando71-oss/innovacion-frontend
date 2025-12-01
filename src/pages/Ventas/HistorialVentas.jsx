import React, { useState, useEffect } from 'react';

const ventasMock = [
  {
    id: 1,
    fecha: '2025-07-11',
    hora: '10:30 AM',
    productos: [
      { nombre: 'Laptop HP', cantidad: 1, precio: 2500 },
      { nombre: 'Mouse', cantidad: 2, precio: 50 },
    ],
  },
  {
    id: 2,
    fecha: '2025-07-10',
    hora: '04:15 PM',
    productos: [
      { nombre: 'Teclado Mecánico', cantidad: 1, precio: 300 },
    ],
  },
];

function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [filtroProducto, setFiltroProducto] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    setVentas(ventasMock);
  }, []);

  const filtrarVentas = () =>
    ventas.filter((venta) => {
      const contieneProducto = filtroProducto
        ? venta.productos.some((p) =>
            p.nombre.toLowerCase().includes(filtroProducto.toLowerCase())
          )
        : true;

      const coincideFecha = filtroFecha ? venta.fecha === filtroFecha : true;

      return contieneProducto && coincideFecha;
    });

  const ventasFiltradas = filtrarVentas();

  const calcularTotal = (productos) =>
    productos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Historial de Ventas</h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por producto"
          value={filtroProducto}
          onChange={(e) => setFiltroProducto(e.target.value)}
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm"
        />

        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">N° Venta</th>
              <th className="px-4 py-2">Productos</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Hora</th>
              <th className="px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length > 0 ? (
              ventasFiltradas.map((venta) => (
                <tr key={venta.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{venta.id}</td>
                  <td className="px-4 py-2">
                    {venta.productos.map((p) => p.nombre).join(', ')}
                  </td>
                  <td className="px-4 py-2">{venta.fecha}</td>
                  <td className="px-4 py-2">{venta.hora}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setVentaSeleccionada(venta)}
                      className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No se encontraron ventas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detalles */}
      {ventaSeleccionada && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-2">Detalle de Venta #{ventaSeleccionada.id}</h2>
            <p className="text-sm text-gray-600 mb-4">
              Fecha: {ventaSeleccionada.fecha} - Hora: {ventaSeleccionada.hora}
            </p>

            <table className="w-full text-sm mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-2 py-1">Producto</th>
                  <th className="text-right px-2 py-1">Cant.</th>
                  <th className="text-right px-2 py-1">Precio</th>
                  <th className="text-right px-2 py-1">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ventaSeleccionada.productos.map((prod, index) => (
                  <tr key={index}>
                    <td className="px-2 py-1">{prod.nombre}</td>
                    <td className="px-2 py-1 text-right">{prod.cantidad}</td>
                    <td className="px-2 py-1 text-right">S/ {prod.precio.toFixed(2)}</td>
                    <td className="px-2 py-1 text-right">S/ {(prod.cantidad * prod.precio).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right font-semibold text-lg">
              Total: S/ {calcularTotal(ventaSeleccionada.productos).toFixed(2)}
            </div>

            <button
              onClick={() => setVentaSeleccionada(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistorialVentas;
