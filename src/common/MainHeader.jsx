import { Menu, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const handlePerfil = () => navigate("/perfil");
  const handleConfig = () => navigate("/configuracion");

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-black shadow-md z-50 px-4 lg:px-8 border-b border-gray-800">
      {/* Móvil y tablet */}
      <div className="flex lg:hidden items-center justify-between h-full relative">
        {/* Botón menú */}
        <button onClick={toggleSidebar} className="text-white hover:text-gray-300">
          <Menu className="w-6 h-6 mx-2" />
        </button>

        {/* Logo centrado */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
          <img
            src="https://martinjoyeria.com/wp-content/uploads/2022/03/logo-martin-joyeria-white.png"
            className="w-8 h-8"
            alt="logo joyería"
          />
          <span className="text-lg font-semibold text-white tracking-wide">
            Martin Joyería
          </span>
        </div>

        {/* Botones opciones */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="text-white hover:text-gray-300"
            onClick={handlePerfil}
            title="Ver perfil"
          >
            <User className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="text-white hover:text-gray-300"
            onClick={handleConfig}
            title="Configuración"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="text-white hover:text-gray-300"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Escritorio */}
      <div className="hidden lg:flex items-center justify-between h-full">
        {/* Logo + menú */}
        <div className="flex items-center space-x-4">
          <img
            src="https://martinjoyeria.com/wp-content/uploads/2022/03/logo-martin-joyeria-white.png"
            className="w-10 h-10"
            alt="logo joyería"
          />
          <span className="text-[1.5rem] font-bold text-white tracking-wide">
            Martin Joyería
          </span>
          <button onClick={toggleSidebar} className="text-white hover:text-gray-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Íconos perfil/configuración */}
        <div className="flex space-x-5 items-center">
          <button
            onClick={handlePerfil}
            title="Ver perfil"
            className="text-white hover:text-gray-300"
          >
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={handleConfig}
            title="Configuración"
            className="text-white hover:text-gray-300"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="text-white hover:text-gray-300"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
