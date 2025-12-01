import React, { useEffect, useState } from "react";
import ModalBase from "../components/ModalBase";
import { ApiWebURL } from "../utils/Index";

export default function Materiales() {
  const [materiales, setMateriales] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMateriales = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ApiWebURL}api/categorias`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener materiales`);
      }

      const data = await response.json();
      setMateriales(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener materiales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMateriales();
  }, []);

  const openModal = (item) => {
    setSelected(item);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Materiales</h1>

      {loading ? (
        <p className="text-center text-gray-600">Cargando materiales...</p>
      ) : (
        <div className="bg-white shadow rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr className="text-gray-600">
                <th className="p-2">ID</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Descripción</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materiales.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.nombre}</td>
                  <td className="p-2">{item.descripcion}</td>
                  <td className="p-2">{item.estado === 1 ? "Activo" : "Inactivo"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => openModal(item)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {materiales.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-3">
                    No hay materiales registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {open && selected && (
        <ModalBase open={open} setOpen={setOpen}>
          <div className="p-4 space-y-2">
            <h2 className="text-xl font-bold mb-2">Detalle del material</h2>
            <p><strong>ID:</strong> {selected.id}</p>
            <p><strong>Nombre:</strong> {selected.nombre}</p>
            <p><strong>Descripción:</strong> {selected.descripcion}</p>
            <p><strong>Estado:</strong> {selected.estado}</p>
          </div>
        </ModalBase>
      )}
    </div>
  );
}
