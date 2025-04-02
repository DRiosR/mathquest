"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Verifica si este import es necesario

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado de carga para controlar la redirección

  useEffect(() => {
    const session = supabase.auth.session(); // Verifica si hay sesión activa
    console.log("Session en Home: ", session); // Verifica si session se obtiene correctamente

    if (!session) {
      router.push("/registro/login"); // Si no hay sesión, redirige al login
    } else {
      setLoading(false); // Si hay sesión, dejar de mostrar la pantalla de carga
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold">Bienvenido a MathQuest</h1>
      {/* Aquí va el contenido de tu página Home */}
    </div>
  );
};

export default Home;
