import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ApiWebURL } from "../utils/Index";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("COLAB");

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ================================
  // GET: Cargar usuarios
  // ================================
  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${ApiWebURL}api/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      if (error.response?.status === 401) {
        alert("Token inválido o expirado.");
      }
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // ================================
  // POST: Crear usuario
  // ================================
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${ApiWebURL}api/usuarios`,
        { nombre, email, password, rol },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Usuario creado correctamente");

      setModalOpen(false);
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("COLAB");

      fetchUsuarios();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("No se pudo crear el usuario.");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // DELETE: Eliminar usuario
  // ================================
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este usuario?")) return;

    try {
      await axios.delete(`${ApiWebURL}api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar usuario");
    }
  };

  // ================================
  // Filtro de búsqueda
  // ================================
  const usuariosFiltrados = usuarios.filter((user) =>
    user.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold">Usuarios</h1>

        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por correo..."
            className="border border-gray-300 px-3 py-1 rounded-md"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus size={18} /> Añadir Usuario
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.nombre}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.rol}</td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        title="Editar"
                        className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        title="Eliminar"
                        onClick={() => handleEliminar(user.id)}
                        className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Crear Usuario</h2>

            <form onSubmit={handleCrearUsuario} className="flex flex-col gap-3">

              <input
                type="text"
                placeholder="Nombre"
                className="border px-3 py-2 rounded w-full"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <input
                type="email"
                placeholder="Correo"
                className="border px-3 py-2 rounded w-full"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="border px-3 py-2 rounded w-full"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                className="border px-3 py-2 rounded w-full"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="COLAB">COLAB</option>
              </select>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Usuario"}
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-500 text-center hover:underline"
              >
                Cancelar
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
