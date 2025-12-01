import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalBase from "../../components/ModalBase";
import { ApiWebURL } from "../../utils/Index";

function ProductosJoyeria() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtener token
  const token = localStorage.getItem("token");

  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    type: "",
    sku: "",
    unit: "",
    minStock: "",
    supplierId: 1,
  });

  // ====================================
  // 🔹 GET: Cargar productos con Token
  // ====================================
  const cargarProductos = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${ApiWebURL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProductos(res.data.data || res.data);

    } catch (error) {
      console.error("Error al cargar productos:", error);
      if (error.response?.status === 401) alert("Token inválido o expirado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // ====================================
  // 🔹 POST: Registrar producto
  // ====================================
  const handleGuardar = async (e) => {
    e.preventDefault();

    const payload = {
      name: nuevoProducto.name,
      type: nuevoProducto.type,
      sku: nuevoProducto.sku,
      unit: nuevoProducto.unit,
      minStock: Number(nuevoProducto.minStock),
      supplierId: Number(nuevoProducto.supplierId),
    };

    try {
      await axios.post(`${ApiWebURL}/products`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      cargarProductos();
      setModalOpen(false);

      setNuevoProducto({
        name: "",
        type: "",
        sku: "",
        unit: "",
        minStock: "",
        supplierId: 1,
      });

    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo guardar el producto.");
    }
  };

  // ====================================
  // 🔹 DELETE: Eliminar producto
  // ====================================
  const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await axios.delete(`${ApiWebURL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      cargarProductos();

    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Filtro de búsqueda
  const productosFiltrados = productos.filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 bg-black text-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Productos</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
        >
          + Añadir Producto
        </button>
      </div>

      {/* BUSCAR */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
        />
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-800 text-gray-200">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Unidad</th>
              <th className="px-4 py-2">Stock Min.</th>
              <th className="px-4 py-2">Proveedor</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">Cargando...</td>
              </tr>
            ) : productosFiltrados.length > 0 ? (
              productosFiltrados.map((p) => (
                <tr key={p.id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.type}</td>
                  <td className="px-4 py-2">{p.sku}</td>
                  <td className="px-4 py-2">{p.unit}</td>
                  <td className="px-4 py-2">{p.minStock}</td>
                  <td className="px-4 py-2">{p.supplierId}</td>

                  <td className="px-4 py-2 space-x-2">
                    <button className="bg-yellow-500 text-black px-2 py-1 rounded">
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(p.id)}
                      className="bg-red-600 px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-400">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <ModalBase isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Agregar producto">
        <form onSubmit={handleGuardar} className="space-y-3">

          <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.name}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, name: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          />

          <input
            type="text"
            placeholder="Tipo"
            value={nuevoProducto.type}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, type: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          />

          <input
            type="text"
            placeholder="SKU"
            value={nuevoProducto.sku}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, sku: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          />

          <input
            type="text"
            placeholder="Unidad (g, ml, unidad...)"
            value={nuevoProducto.unit}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, unit: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          />

          <input
            type="number"
            placeholder="Stock mínimo"
            value={nuevoProducto.minStock}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, minStock: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 p-2 rounded hover:bg-emerald-700"
          >
            Guardar
          </button>
        </form>
      </ModalBase>

    </div>
  );
}

export default ProductosJoyeria;
