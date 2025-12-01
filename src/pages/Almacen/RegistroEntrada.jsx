import React, { useState } from "react";
import { entradasAlmacen, productosAlmacen } from "../Data";

function exportToExcel(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${row[h]}"`).join(","));
  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "entradas_almacen.xls";
  a.click();
  URL.revokeObjectURL(url);
}

const RegistroEntrada = () => {
  const [filtroProducto, setFiltroProducto] = useState("");
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

  // Relaciona id_producto con nombre
  const entradasConNombre = entradasAlmacen.map(e => ({
    ...e,
    producto: productosAlmacen.find(p => p.id_producto === e.id_producto)?.nombre || "Desconocido",
  }));

  // Filtrado
  const entradasFiltradas = entradasConNombre.filter(e =>
    (!filtroProducto || e.producto.toLowerCase().includes(filtroProducto.toLowerCase())) &&
    (!filtroProveedor || e.proveedor.toLowerCase().includes(filtroProveedor.toLowerCase())) &&
    (!filtroFecha || e.fecha === filtroFecha) &&
    (!filtroUsuario || e.usuario.toLowerCase().includes(filtroUsuario.toLowerCase()))
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Registro de Entradas al Almacén</h2>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Filtrar por producto"
          value={filtroProducto}
          onChange={e => setFiltroProducto(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Filtrar por proveedor"
          value={filtroProveedor}
          onChange={e => setFiltroProveedor(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          placeholder="Filtrar por fecha"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Filtrar por usuario"
          value={filtroUsuario}
          onChange={e => setFiltroUsuario(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
          onClick={() => exportToExcel(entradasFiltradas)}
        >
          Exportar a Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left text-gray-600">ID</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Producto</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Cantidad</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Fecha</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Proveedor</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {entradasFiltradas.length > 0 ? (
              entradasFiltradas.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b">{e.id}</td>
                  <td className="px-4 py-2 border-b">{e.producto}</td>
                  <td className="px-4 py-2 border-b">{e.cantidad}</td>
                  <td className="px-4 py-2 border-b">{e.fecha}</td>
                  <td className="px-4 py-2 border-b">{e.proveedor}</td>
                  <td className="px-4 py-2 border-b">{e.usuario}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No hay registros que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroEntrada;