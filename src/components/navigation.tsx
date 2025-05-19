'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export const Navigation = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Chequea el estado al montar y cuando cambia el storage
    useEffect(() => {
        const checkLogin = () => {
            setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
            setIsAdmin(localStorage.getItem("isAdmin") === "true");
        };

        checkLogin();

        window.addEventListener("storage", checkLogin);
        // También escucha el foco de la ventana (por si el usuario navega)
        window.addEventListener("focus", checkLogin);

        return () => {
            window.removeEventListener("storage", checkLogin);
            window.removeEventListener("focus", checkLogin);
        };
    }, []);

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    return (
        <div className={showLogoutModal ? "relative" : ""}>
            {/* Blur overlay when modal is open */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-all"></div>
            )}
            <ul className={`flex items-center space-x-8 ${showLogoutModal ? "filter blur-sm pointer-events-none select-none" : ""}`}>
                <div className="flex space-x-4">
                    <li>
                        <Link
                            href="/about"
                            className="text-black border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                        >
                            About
                        </Link>
                    </li>
                     {/* Botón "Ver mi perfil" solo visible para usuarios logueados */}
                        {isLoggedIn && !isAdmin && (
                            <li>
                                <Link
                                    href="/perfil"
                                    className="text-black border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                                >
                                    Ver mi perfil
                                </Link>
                            </li>
                        )}
                    {/* Botón solo visible para admin */}
                    {isLoggedIn && isAdmin &&  (
                        <li>
                            <Link
                                href="/cargarPropiedad"
                                className="text-white bg-purple-600 border border-purple-600 px-4 py-2 rounded hover:bg-purple-700"
                            >
                                Cargar Propiedad
                            </Link>
                        </li>
                    )}
                </div>
                <div className="ml-auto flex space-x-4">
                    {!isLoggedIn && (
                        <>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-white bg-blue-500 border border-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Iniciar Sesión
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/register"
                                    className="text-white bg-green-500 border border-green-500 px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Registrar
                                </Link>
                            </li>
                        </>
                    )}
                    {isLoggedIn &&  (
                        <>
                            <li>
    <button
        className="text-white bg-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-600"
        onClick={() => {
            setShowLogoutModal(true);
        }}
    >
        Cerrar sesión
    </button>
                            </li>
                        </>
                    )}
                </div>
            </ul>
            {/* Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-lg p-8 z-10 max-w-md w-full flex flex-col items-center">
                        <p className="mb-6 text-lg font-semibold text-gray-800">
                            ¿Estás seguro que quieres cerrar la sesión?
                        </p>
                        <div className="flex space-x-4">
                            <button
                                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => {
                                    localStorage.removeItem("isLoggedIn");
                                    localStorage.removeItem("isAdmin"); // <-- Elimina el flag de admin
                                    localStorage.removeItem('userEmail');
                                    setShowLogoutModal(false);
                                    window.location.href = "/login";
                                }}
                            >
                                Sí
                            </button>
                            <button
                                className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};