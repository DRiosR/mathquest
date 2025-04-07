"use client"; 

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError("Hubo un error al obtener la sesión.");
          console.error("Error al obtener sesión:", error);
          router.push("/registro/login");
          return;
        }

        if (!session) {
          router.push("/registro/login");
        } else {
          setTimeout(() => setLoading(false), 500); // 0.5 segundos de carga
        }
      } catch (error) {
        setError("Hubo un error inesperado.");
        console.error("Error al verificar la sesión:", error);
        router.push("/registro/login");
      }
    };

    checkSession();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/registro/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handlePlay = () => {
    router.push("/unidad/categorias"); // Redirige a la página de niveles
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white flex-col">
        <img src="/Company.png" alt="Logo" className="w-32 h-32 mb-4 animate__animated animate__fadeIn" />
        <p className="text-white text-4xl font-extrabold mt-4 text-center tracking-widest">MTK CORP</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold">Bienvenido a MathQuest</h1>
      
      {/* Botón para jugar */}
      <button
        onClick={handlePlay}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
      >
        Jugar
      </button>

      <button
        onClick={handleSignOut}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;
