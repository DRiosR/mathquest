"use client"; // Esta línea asegura que el componente se ejecute del lado del cliente

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(true); // Estado para controlar la visibilidad del error
  const [showSuccess, setShowSuccess] = useState(true); // Estado para controlar la visibilidad del mensaje de éxito
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificación de la contraseña
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setShowError(true); // Mostrar la alerta de error
      setTimeout(() => setShowError(false), 5000); // Desaparecer después de 5 segundos
      return;
    }

    // Validación de correo electrónico
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA0-9]{2,}$/;
    if (!isValidEmail.test(correo)) {
      setError("Por favor ingresa un correo electrónico válido.");
      setShowError(true); // Mostrar la alerta de error
      setTimeout(() => setShowError(false), 5000); // Desaparecer después de 5 segundos
      return;
    }

    const data = { nombre, correo, password };

    try {
      setIsLoading(true);
      setIsVerifying(false);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setSuccessMessage("Se ha enviado un correo de verificación, por favor verifica tu correo.");
        setShowSuccess(true); // Mostrar la alerta de éxito
        setTimeout(() => setShowSuccess(false), 5000); // Desaparecer después de 5 segundos
        setIsVerifying(true);

        setTimeout(() => {
          setIsVerifying(false);
        }, 5000);
      } else {
        const result = await res.json();
        setError(result.message || "Hubo un error durante el registro.");
        setShowError(true); // Mostrar la alerta de error
        setTimeout(() => setShowError(false), 5000); // Desaparecer después de 5 segundos
        setIsVerifying(false);
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente más tarde.");
      setShowError(true); // Mostrar la alerta de error
      setTimeout(() => setShowError(false), 5000); // Desaparecer después de 5 segundos
      setIsVerifying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-3xl shadow-lg">
        <h2 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
          ¡Bienvenido a MathZone!
        </h2>

        {error && showError && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-6 transition-all transform duration-500 ease-out translate-y-4 opacity-100">
            {error}
          </div>
        )}

        {successMessage && showSuccess && (
          <div className="bg-green-500 text-white p-3 rounded-md mb-6 transition-all transform duration-500 ease-out translate-y-4 opacity-100">
            {successMessage}
          </div>
        )}

        {isVerifying && (
          <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-gray-800 p-8 rounded-lg text-center w-1/3">
              <h2 className="text-xl font-bold mb-4 text-white">¡Verificación de correo!</h2>
              <p className="text-white">Por favor, revisa tu correo electrónico para verificar tu cuenta.</p>
              <div className="mt-4 border-t-4 border-t-blue-500 border-b-transparent border-r-transparent border-l-transparent w-12 h-12 rounded-full animate-spin mx-auto"></div>
            </div>
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
              Dirección de correo electrónico
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
            <label className="block text-xl font-medium mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 text-lg rounded-lg bg-gray-700 text-white border-2 border-transparent focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold rounded-lg"
            disabled={isLoading}  // Deshabilitar botón mientras se procesa el registro
          >
            {isLoading ? "Cargando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-300">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/registro/login"
            className="text-blue-400 hover:underline font-semibold"
          >
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
