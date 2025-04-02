"use client"; 

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Importar el contexto de autenticación
import { supabase } from "@/lib/supabase"; // Importar Supabase

const Home = () => {
  const { session, setSession } = useAuth(); // Obtener sesión desde el contexto
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login"); // Redirigir si no hay sesión
    }
  }, [session, router]);

  const handlePlay = () => {
    router.push("/jugar");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Cerrar sesión en Supabase
    setSession(null); // Actualizar contexto
    router.push("/login"); // Redirigir al login
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="text-center p-6 mb-12">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          MathQuest
        </h1>
        <p className="text-xl text-gray-300 mt-4">
          ¡Bienvenido a MathQuest! Aprende matemáticas mientras te diviertes.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handlePlay}
          className="py-3 px-6 bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-xl rounded-lg shadow-lg transform transition-all duration-500 hover:scale-110 hover:bg-gradient-to-l"
        >
          Jugar
        </button>

        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-600 text-white font-medium text-lg rounded-lg shadow-md transition-all hover:bg-red-700"
        >
          Salir
        </button>
      </div>

      <div className="absolute bottom-8 left-8 text-6xl opacity-30">
        <span className="text-yellow-400">∑</span>
        <span className="text-green-500">√</span>
        <span className="text-pink-500">∞</span>
      </div>
    </div>
  );
};

export default Home;
