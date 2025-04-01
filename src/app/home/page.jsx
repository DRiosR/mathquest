// src/app/home/page.jsx

"use client";  // Asegúrate de que el componente sea del lado del cliente

import React from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handlePlay = () => {
    // Redirige a la página de juego
    router.push("/jugar");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="text-center p-6 mb-12">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        MathQuest
        </h1>
        <p className="text-xl text-gray-300 mt-4">
          ¡Bienvenido a MathQuest ! Aprende matemáticas mientras te diviertes.
        </p>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={handlePlay}
          className="py-3 px-6 mt-6 bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-xl rounded-lg shadow-lg transform transition-all duration-500 hover:scale-110 hover:bg-gradient-to-l"
        >
          Jugar
        </button>
        
        {/* Iconos matemáticos para decorar */}
        <div className="absolute bottom-8 left-8 text-6xl opacity-30">
          <span className="text-yellow-400">∑</span>
          <span className="text-green-500">√</span>
          <span className="text-pink-500">∞</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
