import React, { useEffect, useState } from "react";
import ModalBase from "../../components/ModalBase";
import { ApiWebURL } from "../../utils/Index";

export default function Materiales() {
  const [materiales, setMateriales] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMateriales = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ApiWebURL}/materiales`);
      const data = await response.json();
      setMateriales(data);
    } catch (error) {
      console.error("Error al obtener materiales", error);
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
                <th className="p-2">Nombre</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Unidad</th>
                <th className="p-2">Stock Mínimo</th>
                <th className="p-2">Proveedor</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materiales.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{item.sku}</td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2">{item.minStock}</td>
                  <td className="p-2">{item.supplierId}</td>
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
            </tbody>
          </table>
        </div>
      )}

      {open && selected && (
        <ModalBase open={open} setOpen={setOpen}>
          <div className="p-4 space-y-2">
            <h2 className="text-xl font-bold mb-2">Detalle del material</h2>
            <p><strong>Nombre:</strong> {selected.name}</p>
            <p><strong>Tipo:</strong> {selected.type}</p>
            <p><strong>SKU:</strong> {selected.sku}</p>
            <p><strong>Unidad:</strong> {selected.unit}</p>
            <p><strong>Stock Mínimo:</strong> {selected.minStock}</p>
            <p><strong>Proveedor ID:</strong> {selected.supplierId}</p>
          </div>
        </ModalBase>
      )}
    </div>
  );
}
