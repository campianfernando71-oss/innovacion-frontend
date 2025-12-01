import { useEffect, useRef, useState, useCallback } from "react";
import MainHeader from "./MainHeader";
import MainNav from "./MainNav";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <>
      <MainHeader toggleSidebar={toggleSidebar} />
      <div className="min-h-screen bg-gray-100 mt-16 flex">
        {/* Sidebar */}
        <MainNav isOpen={sidebarOpen} sidebarRef={sidebarRef} />

        {/* Overlay para móvil/tablet */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            role="presentation"
          />
        )}

        {/* Contenido principal */}
        <main className="flex-1 p-0 transition-all duration-300">
          {children}
        </main>
      </div>
    </>
  );
};

export default MainLayout;
