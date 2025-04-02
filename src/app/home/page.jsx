"use client"; 

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Asegúrate de que supabase esté importado correctamente

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Para manejar errores

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError("Hubo un error al obtener la sesión.");
          console.error("Error al obtener sesión:", error);
          router.push("/registro/login"); // Redirigir al login si no hay sesión
          return;
        }

        if (!session) {
          router.push("/registro/login"); // Si no hay sesión, redirigir
        } else {
          setLoading(false); // Si hay sesión, continúa cargando la página
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
      await supabase.auth.signOut(); // Cerrar la sesión
      router.push("/registro/login"); // Redirigir a la página de login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p>Cargando...</p> {/* Muestra un mensaje de carga mientras se verifica la sesión */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p>{error}</p> {/* Muestra el error si hay algún problema */}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold">Bienvenido a MathQuest</h1>
      {/* Aquí va el contenido de tu página Home */}
      
      <button
        onClick={handleSignOut}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;
