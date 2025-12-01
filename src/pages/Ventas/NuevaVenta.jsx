import React, { useState, useEffect } from 'react';
import BoletaVenta from '../../components/BoletaVenta';
import  {productosData} from '../Data'; // Renombrado para evitar conflicto

const NuevaVenta = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [ventaActual, setVentaActual] = useState(null);

  useEffect(() => {
    setProductos(productosData); // Usamos la data importada
  }, []);

  useEffect(() => {
    const ventaGuardada = sessionStorage.getItem('ventaRegistrada');
    if (ventaGuardada) {
      setVentaActual(JSON.parse(ventaGuardada));
    }
  }, []);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(p => p.id_producto === producto.id_producto);
    if (existe) {
      setCarrito(carrito.map(p =>
        p.id_producto === producto.id_producto
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return;
    setCarrito(carrito.map(p =>
      p.id_producto === id ? { ...p, cantidad: nuevaCantidad } : p
    ));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(p => p.id_producto !== id));
  };

  const totalVenta = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const registrarVenta = () => {
    const venta = {
      productos: carrito,
      total: totalVenta,
      fecha: new Date().toLocaleString()
    };

    sessionStorage.setItem('ventaRegistrada', JSON.stringify(venta));
    setVentaActual(venta);
    setCarrito([]);
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Nueva Venta</h2>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar producto..."
        className="border px-4 py-2 rounded w-full mb-4"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {busqueda.trim() !== '' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(prod => (
              <div key={prod.id_producto} className="border rounded p-4 shadow hover:shadow-md">
                <h3 className="font-semibold text-lg">{prod.nombre}</h3>
                <p className="text-gray-600">Precio: S/ {prod.precio.toFixed(2)}</p>
                <button
                  onClick={() => agregarAlCarrito(prod)}
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Agregar
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No se encontraron productos.</p>
          )}
        </div>
      )}

      {/* Carrito */}
      <div className="bg-white shadow-md rounded p-4">
        <h3 className="text-xl font-semibold mb-2">Carrito de venta</h3>
        {carrito.length === 0 ? (
          <p className="text-gray-500">No hay productos añadidos.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Producto</th>
                <th>Precio</th>
                <th>Cant.</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id_producto} className="border-b">
                  <td>{item.nombre}</td>
                  <td>S/ {item.precio.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      className="w-16 border px-2 py-1 rounded"
                      onChange={(e) => cambiarCantidad(item.id_producto, parseInt(e.target.value))}
                    />
                  </td>
                  <td>S/ {(item.precio * item.cantidad).toFixed(2)}</td>
                  <td>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => eliminarDelCarrito(item.id_producto)}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Total y botón de registrar */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold">Total: S/ {totalVenta.toFixed(2)}</p>
          <button
            onClick={registrarVenta}
            disabled={carrito.length === 0}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Confirmar Venta
          </button>
        </div>
      </div>

      {/* Boleta de Venta */}
      {ventaActual && <BoletaVenta venta={ventaActual} />}
    </div>
  );
};

export default NuevaVenta;
