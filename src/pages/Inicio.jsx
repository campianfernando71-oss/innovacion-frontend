import React from "react";
import { useAuth } from "../context/AuthContext";

function Inicio() {
  const { user } = useAuth(); // 👈 Datos del usuario logueado

  return (
    <div className="min-h-screen bg-black px-4 pt-12 sm:pt-16 md:pt-20 text-white">
      <div className="bg-zinc-900 shadow-2xl rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto text-center border border-gray-700">
        {/* 🔹 Logo Joyería Martín */}
        <div className="flex justify-center mb-6">
          <img
            src="https://martinjoyeria.com/wp-content/uploads/2022/03/logo-martin-joyeria-white.png"
            alt="Joyería Martín"
            className="w-48 sm:w-60"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          ¡Bienvenido a Joyería Martín!
        </h1>

        {/* 👇 Mostramos el nombre y rol */}
        {user && (
          <div className="mb-6 text-gray-300">
            <p className="text-lg font-semibold">
              Hola,{" "}
              <span className="text-white">
                {user.nombre}
              </span>
            </p>
            <p className="text-sm text-gray-400">
              Rol: <span className="font-medium capitalize text-white">{user.role}</span>
            </p>
          </div>
        )}

        <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
          Este sistema te permite{" "}
          <span className="font-semibold text-white">
            gestionar el inventario y ventas de joyería
          </span>
          . Los administradores pueden controlar el stock, registrar entradas y
          salidas, y los vendedores registrar las ventas de piezas exclusivas.
        </p>

        {/* 🔹 Imagen decorativa */}
        <div className="flex justify-center mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png"
            alt="Joyería"
            className="w-32 sm:w-40 opacity-80"
          />
        </div>

        {/* 🔹 Botones según el rol */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {user?.rol === "vendedor" && (
            <a
              href="/ventas/nueva"
              className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2 rounded-full text-sm sm:text-base transition"
            >
              Registrar Nueva Venta
            </a>
          )}

          {user?.rol === "admin" && (
            <a
              href="/almacen/stock"
              className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2 rounded-full text-sm sm:text-base transition"
            >
              Ver Inventario
            </a>
          )}

          {/* 🔸 Ambos roles pueden ver historial */}
          <a
            href="/ventas/historial"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full text-sm sm:text-base transition"
          >
            Ver Historial
          </a>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
