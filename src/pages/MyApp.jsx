import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import route from '../helpers/Routes';

// Pages
import Login from './Login';
import Inicio from './Inicio';
import Clientes from './Clientes';
import Usuarios from './Usuarios';
import PanelControl from './PanelControl';
import Productos from './Almacen/Productos';

// Context
import { AuthProvider, useAuth } from '../context/AuthContext';

// Layout
import MainLayout from '../common/MainLayout';

function AppContent() {
    const location = useLocation();
    const { user } = useAuth();

    const isLoginPage = location.pathname === route.login;
    const hideSidebar = !user || isLoginPage;

    return (
        <div className="flex h-screen">

            {!hideSidebar && <MainLayout />}

            <main className={`flex-1 ${!isLoginPage ? 'pt-16 overflow-auto bg-gray-100' : ''}`}>
                <Routes>
                    <Route path="/" element={<Navigate to={route.login} />} />

                    {/* Public */}
                    <Route path={route.login} element={<Login />} />

                    {/* Ahora todas son públicas */}
                    <Route path={route.inicio} element={<Inicio />} />
                    <Route path={route.clientes} element={<Clientes />} />
                    <Route path={route.usuarios} element={<Usuarios />} />
                    <Route path={route.productos} element={<Productos />} />
                    <Route path={route.PanelControl} element={<PanelControl />} />

                </Routes>
            </main>
        </div>
    );
}

export default function MyApp() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
