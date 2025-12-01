import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

// Simulación de clientes
const clientesSimulados = [
  {
    id: 1,
    ruc: "20123456789",
    razonSocial: "Empresa Uno SAC",
    contacto: "Ana López",
    correo: "ana@empresauno.com",
    direccion: "Av. Principal 123",
    telefono: "999888777",
  },
  {
    id: 2,
    ruc: "2098765432",
    razonSocial: "Servicios Dos EIRL",
    contacto: "Juan Pérez",
    correo: "juan@serviciosdos.com",
    direccion: "Jr. Secundario 456",
    telefono: "988777666",
  },
  // Puedes agregar más clientes aquí
];

function Clientes() {
  const [listaclientes, setListaClientes] = useState(clientesSimulados);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(25);

  const handleEliminar = (id) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar este cliente?');
    if (confirmacion) {
      setListaClientes(prev => prev.filter(cliente => cliente.id !== id));
    }
  };

  const clientesFiltrados = listaclientes.filter(cliente =>
    cliente.contacto.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.ruc.includes(busqueda)
  );

  // Paginación
  const indiceInicial = (paginaActual - 1) * filasPorPagina;
  const indiceFinal = indiceInicial + filasPorPagina;
  const clientesPaginados = clientesFiltrados.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(clientesFiltrados.length / filasPorPagina);

  const handleAgregarCliente = () => {
    alert("Funcionalidad para agregar cliente aún no implementada.");
  };

  const cambiarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  return (
    <div className="p-4 ">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar por RUC, contacto, razón social o correo..."
            className="border border-gray-300 px-3 py-1 rounded-md"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1); // reinicia búsqueda en página 1
            }}
          />
          <button
            onClick={handleAgregarCliente}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Añadir Cliente
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-2">RUC</th>
              <th className="px-4 py-2">Razón Social</th>
              <th className="px-4 py-2">Contacto</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesPaginados.length > 0 ? (
              clientesPaginados.map((cliente) => (
                <tr key={cliente.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{cliente.ruc}</td>
                  <td className="px-4 py-2">{cliente.razonSocial}</td>
                  <td className="px-4 py-2">{cliente.contacto}</td>
                  <td className="px-4 py-2">{cliente.correo}</td>
                  <td className="px-4 py-2">{cliente.direccion}</td>
                  <td className="px-4 py-2">{cliente.telefono}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        title="Editar"
                        className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        title="Eliminar"
                        onClick={() => handleEliminar(cliente.id)}
                        className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center px-4 py-4 text-gray-500">
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación simple */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-sm text-gray-600">
            Mostrando {indiceInicial + 1} a {Math.min(indiceFinal, clientesFiltrados.length)} de {clientesFiltrados.length} clientes
          </span>
        </div>
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
    </div>
  );
}

export default Clientes;