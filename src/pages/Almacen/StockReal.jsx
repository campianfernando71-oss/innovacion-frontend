import React from "react";
import { getStockActual } from "../Data";

const StockReal = () => {
  const stockActual = getStockActual();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Stock en Tiempo Real</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left text-gray-600">ID</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Producto</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Stock Actual</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Unidad</th>
            </tr>
          </thead>
          <tbody>
            {stockActual.length > 0 ? (
              stockActual.map(p => (
                <tr key={p.id_producto} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b">{p.id_producto}</td>
                  <td className="px-4 py-2 border-b">{p.nombre}</td>
                  <td className="px-4 py-2 border-b">{p.stock}</td>
                  <td className="px-4 py-2 border-b">{p.unidad}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  No hay productos en stock.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockReal;