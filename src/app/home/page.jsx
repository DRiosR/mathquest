"use client"; 

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Asegúrate de tener esta importación

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para manejar la autenticación
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay una sesión activa con Supabase
    const session = supabase.auth.session();

    if (!session) {
      // Si no hay sesión, redirigir al login
      router.push("/registro/login");
    } else {
      // Si hay sesión, permitir el acceso al Home
      setIsAuthenticated(true);
    }

    // Establecer un listener para el cambio de sesión (cuando el usuario se loguea o desloguea)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true); // Si hay sesión, actualizar el estado
      } else {
        setIsAuthenticated(false); // Si no hay sesión, redirigir
        router.push("/registro/login");
      }
    });

    // Limpiar el listener cuando el componente se desmonta
    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Mostrar loading mientras se verifica la autenticación
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold">Bienvenido a MathQuest</h1>
      {/* Aquí va el contenido de tu página Home */}
    </div>
  );
};

export default Home;
