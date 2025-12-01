import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import ModalBase from '../components/ModalBase';
import { ApiWebURL } from '../utils/Index';

function Clientes() {
  const [listaclientes, setListaClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(25);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    direccion: '',
    email: ''
  });

  // =============================
  // 🔹 GET: Cargar clientes desde API
  // =============================
  const cargarClientes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ApiWebURL}api/clientes`);
      setListaClientes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      alert("No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // =============================
  // 🔹 POST: Agregar nuevo cliente
  // =============================
  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nuevoCliente.nombre) {
      alert("El nombre es obligatorio.");
      return;
    }

    try {
      await axios.post(`${ApiWebURL}api/clientes`, nuevoCliente);
      setModalOpen(false);
      setNuevoCliente({ nombre: '', documento: '', telefono: '', direccion: '', email: '' });
      cargarClientes();
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      alert("No se pudo agregar el cliente.");
    }
  };

  // =============================
  // 🔹 DELETE: Eliminar cliente
  // =============================
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;

    try {
      await axios.delete(`${ApiWebURL}api/clientes/${id}`);
      cargarClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert("No se pudo eliminar el cliente.");
    }
  };

  // =============================
  // Filtro de búsqueda y paginación
  // =============================
  const clientesFiltrados = listaclientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (cliente.documento || '').includes(busqueda) ||
    (cliente.telefono || '').includes(busqueda) ||
    (cliente.direccion || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (cliente.email || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const indiceInicial = (paginaActual - 1) * filasPorPagina;
  const indiceFinal = indiceInicial + filasPorPagina;
  const clientesPaginados = clientesFiltrados.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(clientesFiltrados.length / filasPorPagina);

  const cambiarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, documento, correo, etc..."
            className="border border-gray-300 px-3 py-1 rounded-md"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Añadir Cliente
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Documento</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Cargando...</td>
              </tr>
            ) : clientesPaginados.length > 0 ? (
              clientesPaginados.map(cliente => (
                <tr key={cliente.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{cliente.nombre}</td>
                  <td className="px-4 py-2">{cliente.documento}</td>
                  <td className="px-4 py-2">{cliente.telefono}</td>
                  <td className="px-4 py-2">{cliente.direccion}</td>
                  <td className="px-4 py-2">{cliente.email}</td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button className="bg-yellow-100 text-yellow-600 p-2 rounded hover:bg-yellow-200">
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleEliminar(cliente.id)}
                      className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center px-4 py-4 text-gray-500">
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Mostrando {indiceInicial + 1} a {Math.min(indiceFinal, clientesFiltrados.length)} de {clientesFiltrados.length} clientes
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-2 py-1">{paginaActual} / {totalPaginas}</span>
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* MODAL AGREGAR CLIENTE */}
      <ModalBase isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Agregar Cliente">
        <form onSubmit={handleGuardar} className="space-y-3">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoCliente.nombre}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Documento"
            value={nuevoCliente.documento}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, documento: e.target.value })}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={nuevoCliente.telefono}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={nuevoCliente.direccion}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
          />
          <input
            type="email"
            placeholder="Correo"
            value={nuevoCliente.email}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </form>
      </ModalBase>
    </div>
  );
}

export default Clientes;
