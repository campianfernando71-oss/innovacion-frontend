import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalBase from "../../components/ModalBase";
import { ApiWebURL } from "../../utils/Index";

function ProductosJoyeria() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    categoria_id: "",
    cantidad: 0,
    stock_minimo: 0,
    precio: 0,
  });

  // =============================
  // 🔹 GET: Cargar productos
  // =============================
  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ApiWebURL}api/productos`);
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔹 GET: Cargar categorías
  // =============================
  const cargarCategorias = async () => {
    try {
      const res = await axios.get(`${ApiWebURL}api/categorias`);
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  // =============================
  // 🔹 POST: Registrar producto
  // =============================
  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nuevoProducto.categoria_id) {
      alert("Debes seleccionar una categoría");
      return;
    }

    try {
      await axios.post(`${ApiWebURL}api/productos`, {
        ...nuevoProducto,
        categoria_id: Number(nuevoProducto.categoria_id),
      });
      cargarProductos();
      setModalOpen(false);
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        categoria_id: "",
        cantidad: 0,
        stock_minimo: 0,
        precio: 0,
      });
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo guardar el producto.");
    }
  };

  // =============================
  // 🔹 DELETE: Eliminar producto
  // =============================
  const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await axios.delete(`${ApiWebURL}api/productos/${id}`);
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Filtro de búsqueda
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
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
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Stock Min.</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : productosFiltrados.length > 0 ? (
              productosFiltrados.map((p) => {
                const categoria = categorias.find(c => c.id === p.categoria_id);
                return (
                  <tr key={p.id} className="border-t border-gray-700 hover:bg-gray-800">
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2">{p.descripcion}</td>
                    <td className="px-4 py-2">{categoria ? categoria.nombre : p.categoria_id}</td>
                    <td className="px-4 py-2">{p.cantidad}</td>
                    <td className="px-4 py-2">{p.stock_minimo}</td>
                    <td className="px-4 py-2">{p.precio}</td>
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
                );
              })
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
      <ModalBase
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Agregar producto"
      >
        <form onSubmit={handleGuardar} className="space-y-3">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.nombre}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
            }
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoProducto.descripcion}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })
            }
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          />

          {/* SELECT CATEGORÍA */}
          <select
            value={nuevoProducto.categoria_id}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, categoria_id: e.target.value })
            }
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          >
            <option value="">-- Selecciona categoría --</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            value={nuevoProducto.cantidad}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, cantidad: Number(e.target.value) })
            }
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="number"
            placeholder="Stock mínimo"
            value={nuevoProducto.stock_minimo}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, stock_minimo: Number(e.target.value) })
            }
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, precio: Number(e.target.value) })
            }
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
