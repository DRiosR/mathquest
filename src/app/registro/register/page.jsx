"use client"; // Esta línea asegura que el componente se ejecute del lado del cliente

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false); // Para mostrar el modal de verificación
  const [isLoading, setIsLoading] = useState(false); // Para mostrar indicador de carga al hacer submit
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificación de la contraseña
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Validación de correo electrónico
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA0-9]{2,}$/;
    if (!isValidEmail.test(correo)) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    const data = { nombre, correo, password };

    try {
      setIsLoading(true); // Mostrar indicador de carga al enviar el formulario
      setIsVerifying(false); // Asegurarse de que no esté mostrando el modal de verificación al comenzar

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
        setIsVerifying(true); // Mostrar el mensaje de verificación solo si el registro es exitoso

        // Aquí iniciamos un setTimeout para que el mensaje de éxito se cierre después de 10 segundos
        setTimeout(() => {
          setIsVerifying(false); // Ocultar el modal después de 10 segundos
        }, 10000); // 10 segundos para la alerta verde de confirmación
      } else {
        const result = await res.json();
        setError(result.message || "Hubo un error durante el registro.");
        setIsVerifying(false); // Si hay un error, ocultamos el mensaje de verificación

        // Aquí iniciamos un setTimeout para que el mensaje de error se cierre después de 5 segundos
        setTimeout(() => {
          setError(null); // Ocultar el mensaje de error después de 5 segundos
        }, 5000); // 5 segundos para la alerta de error
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente más tarde.");
      setIsVerifying(false); // Si hay error de conexión, también quitamos el mensaje de verificación

      // Aquí iniciamos un setTimeout para que el mensaje de error se cierre después de 5 segundos
      setTimeout(() => {
        setError(null); // Ocultar el mensaje de error después de 5 segundos
      }, 5000); // 5 segundos para la alerta de error
    } finally {
      setIsLoading(false); // Ocultar el indicador de carga
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-3xl shadow-lg">
        <h2 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
          ¡Bienvenido a MathZone !
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded-md mb-6">
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
