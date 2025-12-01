import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Si hay sesión activa → redirige
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/inicio");
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        // Guardar "recuérdame"
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("email", email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("email");
        }

        navigate("/inicio");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error(error);
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full space-y-8 bg-neutral-900 p-8 rounded-2xl shadow-lg border border-neutral-700">
        
        {/* LOGO */}
        <div>
          <img
            className="mx-auto h-16 w-auto"
            src="https://martinjoyeria.com/wp-content/uploads/2022/03/logo-martin-joyeria-white.png"
            alt="Logo"
          />
          <h2 className="mt-6 text-center text-2xl font-bold text-white">
            Iniciar sesión
          </h2>
        </div>

        {/* FORM */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-700 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="ejemplo@gmail.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-700 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="********"
                />

                <button
                  type="button"
                  className="absolute right-3 top-2 text-xs text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* REMEMBER + FORGOT */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 bg-neutral-800 border-gray-600 rounded focus:ring-gray-400"
              />
              <span className="ml-2 text-sm">Recuérdame</span>
            </label>

            <div className="text-sm">
              <a href="#" className="font-medium text-gray-400 hover:text-white">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-white/10 hover:bg-white/20 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
          >
            Iniciar sesión
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-4 text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{" "}
          <a href="#" className="font-medium text-white hover:text-gray-300">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
