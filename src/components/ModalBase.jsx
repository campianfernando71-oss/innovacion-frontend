import React from "react";

function ModalBase({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        {/* Título */}
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {/* Contenido (formulario, etc.) */}
        {children}

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default ModalBase;
