import React from "react";
import { useAuth } from "../context/AuthContext";

function PanelControl() {
  const { user } = useAuth();

  // 📊 Datos simulados del dashboard
  const dashboardData = {
    stockTotal: 1285,
    trazabilidad: 92,
    alertasReorden: 7,
    ventasUltimos30Dias: 45780,
  };

  // 💎 Productos más vendidos (simulados)
  const productosMasVendidos = [
    {
      id: 1,
      nombre: "Anillo de Oro 18k",
      categoria: "Anillos",
      unidades: 42,
      total: 8400,
    },
    {
      id: 2,
      nombre: "Collar con Diamantes",
      categoria: "Collares",
      unidades: 30,
      total: 12000,
    },
    {
      id: 3,
      nombre: "Pulsera de Plata Italiana",
      categoria: "Pulseras",
      unidades: 55,
      total: 6600,
    },
    {
      id: 4,
      nombre: "Aros de Oro Blanco",
      categoria: "Aros",
      unidades: 28,
      total: 7200,
    },
    {
      id: 5,
      nombre: "Reloj de Lujo Acero Inoxidable",
      categoria: "Relojes",
      unidades: 18,
      total: 7580,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-10">
      <div className="max-w-6xl w-full bg-neutral-900 p-10 rounded-2xl shadow-lg border border-neutral-700">
        {/* === ENCABEZADO === */}
        <div className="text-center mb-10">
          <img
            src="https://martinjoyeria.com/wp-content/uploads/2022/03/logo-martin-joyeria-white.png"
            alt="Logo"
            className="mx-auto h-16 mb-4"
          />
          <h1 className="text-3xl font-bold tracking-wide">Panel de Control — Joyería</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Bienvenido{user ? `, ${user.name}` : ""}. Aquí puedes ver un resumen general del negocio.
          </p>
        </div>

        {/* === TARJETAS RESUMEN === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-neutral-800 rounded-xl p-6 text-center border border-neutral-700 hover:scale-[1.02] transition-transform">
            <p className="text-sm text-gray-400">Stock Total</p>
            <p className="text-4xl font-bold text-white mt-2">{dashboardData.stockTotal}</p>
            <p className="text-xs text-gray-500 mt-1">Piezas disponibles</p>
          </div>

          <div className="bg-neutral-800 rounded-xl p-6 text-center border border-neutral-700 hover:scale-[1.02] transition-transform">
            <p className="text-sm text-gray-400">Piezas con Trazabilidad</p>
            <p className="text-4xl font-bold text-white mt-2">
              {dashboardData.trazabilidad}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Controladas correctamente</p>
          </div>

          <div className="bg-neutral-800 rounded-xl p-6 text-center border border-neutral-700 hover:scale-[1.02] transition-transform">
            <p className="text-sm text-gray-400">Alertas de Reorden</p>
            <p className="text-4xl font-bold text-red-500 mt-2">
              {dashboardData.alertasReorden}
            </p>
            <p className="text-xs text-gray-500 mt-1">Productos con bajo stock</p>
          </div>

          <div className="bg-neutral-800 rounded-xl p-6 text-center border border-neutral-700 hover:scale-[1.02] transition-transform">
            <p className="text-sm text-gray-400">Ventas últimos 30 días</p>
            <p className="text-4xl font-bold text-green-400 mt-2">
              S/{dashboardData.ventasUltimos30Dias.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Ingresos recientes</p>
          </div>
        </div>

        {/* === TABLA PRODUCTOS MÁS VENDIDOS === */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Productos Más Vendidos</h2>
          <div className="overflow-x-auto rounded-lg border border-neutral-700 shadow-md">
            <table className="min-w-full bg-neutral-900 text-sm">
              <thead className="bg-neutral-800 text-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">#</th>
                  <th className="px-6 py-3 text-left font-medium">Producto</th>
                  <th className="px-6 py-3 text-left font-medium">Categoría</th>
                  <th className="px-6 py-3 text-center font-medium">Unidades Vendidas</th>
                  <th className="px-6 py-3 text-right font-medium">Total Vendido</th>
                </tr>
              </thead>
              <tbody>
                {productosMasVendidos.map((p, index) => (
                  <tr
                    key={p.id}
                    className="border-t border-neutral-700 hover:bg-neutral-800 transition"
                  >
                    <td className="px-6 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-6 py-3 font-semibold">{p.nombre}</td>
                    <td className="px-6 py-3 text-gray-400">{p.categoria}</td>
                    <td className="px-6 py-3 text-center text-gray-200">{p.unidades}</td>
                    <td className="px-6 py-3 text-right text-green-400">
                      S/{p.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === PIE DE PÁGINA / NOTA === */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          Datos simulados para demostración — Martin Joyería © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

export default PanelControl;
