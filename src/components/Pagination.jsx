import React from "react";

function Pagination({ 
  paginaActual, 
  totalPaginas, 
  filasPorPagina, 
  setFilasPorPagina, 
  cambiarPagina 
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
      {/* Select de filas por página */}
      <div className="flex items-center gap-2">
        <span>Filas por página:</span>
        <select
          value={filasPorPagina}
          onChange={(e) => {
            setFilasPorPagina(Number(e.target.value));
            cambiarPagina(1); // Reinicia a la primera página
          }}
          className="border border-gray-300 px-2 py-1 rounded-md"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Botones de navegación */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Pagination;
