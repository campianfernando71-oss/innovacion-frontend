import {
  Home,
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  BarChart2,
  Package,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const menuDataByRole = {
  admin: [
    {
      title: "Panel de Control",
      key: "Panel",
      items: [
        { label: "Inicio", to: "/inicio", icon: <LayoutDashboard size={18} /> },
        { label: "Panel Control", to: "/panel-control", icon: <LayoutDashboard size={18} /> },
        { label: "Usuarios", to: "/usuarios", icon: <Home size={18} /> },
      ],
    },
    {
      title: "Productos",
      key: "Productos",
      items: [
        { label: "Lista de Productos", to: "/productos/lista-productos", icon: <Package size={18} /> },
        { label: "Productos más vendidos", to: "/productos/mas-vendidos", icon: <BarChart2 size={18} /> },
        { label: "Registrar Producto", to: "/productos/nuevo", icon: <ShoppingCart size={18} /> },
      ],
    },
    {
      title: "Clientes",
      key: "Clientes",
      items: [
        { label: "Lista de Clientes", to: "/clientes", icon: <ClipboardList size={18} /> },
      ],
    },
  ],

  cliente: [
    {
      title: "Tienda",
      key: "Tienda",
      items: [
        { label: "Productos", to: "/productos", icon: <Package size={18} /> },
        { label: "Mis Compras", to: "/compras", icon: <ClipboardList size={18} /> },
      ],
    },
    {
      title: "Perfil",
      key: "Perfil",
      items: [
        { label: "Mi Perfil", to: "/perfil", icon: <Home size={18} /> },
        { label: "Inicio", to: "/inicio", icon: <LayoutDashboard size={18} /> },
      ],
    },
  ],
};

const MainNav = ({ isOpen, sidebarRef }) => {
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // 👇 Normalizar rol en caso venga en mayúsculas
  const userRole = user?.role?.toLowerCase() || "";
  const menuData = menuDataByRole[userRole] || [];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (!mobile) {
        const allOpen = Object.fromEntries(menuData.map((m) => [m.key, true]));
        setOpenMenus(allOpen);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [menuData]);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 
      bg-black text-white shadow-lg z-40 transition-transform duration-300
      ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"} 
      lg:static lg:translate-x-0`}
    >
      <div className="h-full p-4 flex flex-col">
        <nav className="flex-1 overflow-y-auto space-y-4 text-sm">
          {menuData.map((section) => (
            <div key={section.key}>
              <div
                className="text-xs font-semibold text-gray-400 uppercase mb-1 cursor-pointer"
                onClick={() => toggleMenu(section.key)}
              >
                {section.title}
              </div>

              {openMenus[section.key] && (
                <ul className="ml-2 space-y-1">
                  {section.items.map((item, index) => (
                    <li key={index}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-2 py-2 rounded font-medium transition ${
                            isActive
                              ? "bg-gray-800 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          }`
                        }
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default MainNav;
