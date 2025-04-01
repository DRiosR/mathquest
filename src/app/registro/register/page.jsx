"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificación de la contraseña
    if (contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Validación de correo electrónico
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!isValidEmail.test(correo)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    const data = { nombre, correo, contraseña };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/registro/login");
      } else {
        const result = await res.json();
        setError(result.message || "Hubo un error en el registro");
      }
    } catch (err) {
      setError("Error de conexión. Intenta más tarde.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-3xl shadow-lg">
        <h2 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
          ¡Bienvenido a MathZone!
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-xl font-medium mb-2" htmlFor="nombre">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="w-full px-4 py-3 text-lg rounded-lg bg-gray-700 text-white border-2 border-transparent focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

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
            <label className="block text-xl font-medium mb-2" htmlFor="contraseña">
              Contraseña
            </label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              className="w-full px-4 py-3 text-lg rounded-lg bg-gray-700 text-white border-2 border-transparent focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold rounded-lg transform transition-all duration-500 hover:scale-105"
          >
            Crear cuenta
          </button>
        </form>

        <p className="text-center mt-6 text-gray-300">
          ¿Ya tienes cuenta?{" "}
          <a href="/registro/login" className="text-blue-400 hover:underline font-semibold">
            Inicia sesión aquí
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

export default Register;
