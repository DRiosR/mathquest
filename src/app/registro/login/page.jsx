"use client";  // Asegúrate de que el componente sea del lado del cliente

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");  // Cambié "contraseña" por "password"
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { correo, password };  // Cambié "contraseña" por "password"

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/home");  // Redirige al home al iniciar sesión correctamente
      } else {
        const result = await res.json();
        setError(result.message || "Hubo un error en el inicio de sesión");
      }
    } catch (err) {
      setError("Error de conexión. Intenta más tarde.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-3xl shadow-lg">
        <h2 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
          Iniciar sesión en MathQuest
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-xl font-medium mb-2" htmlFor="correo">
              Correo electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              className="w-full px-4 py-3 text-lg rounded-lg bg-gray-700 text-white border-2 border-transparent focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xl font-medium mb-2" htmlFor="password"> {/* Cambié "contraseña" por "password" */}
              Contraseña
            </label>
            <input
              type="password"
              id="password"  // Cambié "contraseña" por "password"
              name="password"  // Cambié "contraseña" por "password"
              className="w-full px-4 py-3 text-lg rounded-lg bg-gray-700 text-white border-2 border-transparent focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={password}  // Cambié "contraseña" por "password"
              onChange={(e) => setPassword(e.target.value)}  // Cambié "contraseña" por "password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold rounded-lg transform transition-all duration-500 hover:scale-105"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-center mt-6 text-gray-300">
          ¿No tienes cuenta?{" "}
          <a href="/registro/register" className="text-blue-400 hover:underline font-semibold">
            Regístrate aquí
          </a>
        </p>

        {/* Icono matemático */}
        <div className="absolute bottom-8 left-8 text-6xl opacity-30">
          <span className="text-yellow-400">∑</span>
          <span className="text-green-500">√</span>
          <span className="text-pink-500">∞</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
