"use client"; 

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Verificar si el token existe

    if (!token) {
      // Si no hay token, redirigir al login
      router.push("/registro/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold">Bienvenido a MathQuest</h1>
      {/* Aquí va el contenido de tu página Home */}
    </div>
  );
};

export default Home;
