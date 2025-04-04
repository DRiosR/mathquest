"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Asegúrate de que esto esté correctamente apuntando a tu archivo de configuración de Supabase
import { FaPlus, FaMinus, FaTimes, FaDivide } from "react-icons/fa"; // Iconos para las categorías

const Categorias = () => {
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data, error } = await supabase
          .from("categoria")
          .select("*");  // Obtenemos todas las categorías (ajustar según tu base de datos)

        if (error) {
          throw new Error(`Error en la consulta: ${error.message}`);
        }

        if (data) {
          setCategorias(data);  // Asignamos las categorías a la variable de estado
        } else {
          setError("No se encontraron categorías.");
        }

        setLoading(false);
      } catch (error) {
        setError(`Hubo un problema al obtener las categorías: ${error.message}`);
        setLoading(false);
      }
    };

    setTimeout(() => {
      fetchCategorias();
    }, 500); // Retraso de 0.5 segundos antes de hacer la solicitud

  }, []);

  const getCategoryIcon = (name) => {
    switch (name.toLowerCase()) {
      case "suma":
        return <FaPlus size={40} className="text-yellow-400" />;
      case "resta":
        return <FaMinus size={40} className="text-red-400" />;
      case "multiplicación":
        return <FaTimes size={40} className="text-green-400" />;
      case "división":
        return <FaDivide size={40} className="text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white p-6">
      {loading ? (
        <div className="flex justify-center items-center h-full flex-col">
          <img src="/Company.png" alt="Logo" className="w-32 h-32 mb-4 animate__animated animate__fadeIn" />
          <p className="text-white text-4xl font-extrabold mt-4 text-center tracking-widest">MTK CORP</p>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-center mb-8 drop-shadow-lg animate__animated animate__fadeIn">
            Elige una categoría
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
            {categorias.length === 0 ? (
              <p className="text-center text-lg">No se encontraron categorías.</p>
            ) : (
              categorias.map((categoria) => (
                <div key={categoria.idCategoria} className="flex justify-center">
                  <button
                    onClick={() => router.push(`/niveles/${categoria.nombre.toLowerCase()}`)}
                    className="w-full p-6 bg-indigo-600 text-white rounded-lg text-xl font-semibold shadow-lg transform transition duration-300 ease-in-out hover:bg-indigo-700 hover:scale-105 flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center">
                      {getCategoryIcon(categoria.nombre)}
                      <span className="mt-2">{categoria.nombre}</span>
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
      {error && (
        <div className="text-red-500 mt-4 text-xl">
          {error}
        </div>
      )}
    </div>
  );
};

export default Categorias;
