"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const Niveles = () => {
  const { categoria } = useParams();
  const router = useRouter();
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idCategoria, setIdCategoria] = useState(null);

  useEffect(() => {
    const fetchIdCategoria = async () => {
      if (!categoria) return;

      try {
        // Obtener idCategoria según la categoría
        const { data, error } = await supabase
          .from("categoria")
          .select("idCategoria")
          .eq("nombre", categoria)
          .single();

        if (error) throw new Error(`Error al obtener idCategoria: ${error.message}`);
        if (data) {
          setIdCategoria(data.idCategoria);
        } else {
          setError("No se encontró la categoría en la base de datos.");
        }
      } catch (error) {
        setError(`Hubo un problema al obtener idCategoria: ${error.message}`);
      }
    };

    fetchIdCategoria();
  }, [categoria]);

  useEffect(() => {
    const fetchNiveles = async () => {
      if (!idCategoria) return;

      try {
        console.log(`Buscando niveles para la categoría con id: ${idCategoria}`); // Depuración

        const { data, error } = await supabase
          .from("nivel")
          .select("*")
          .eq("idCategoria", idCategoria); // Buscar por idCategoria en lugar de nombre

        if (error) throw new Error(`Error en la consulta: ${error.message}`);
        if (data) setNiveles(data);
        else setError("No se encontraron niveles para esta categoría.");

        setLoading(false);
      } catch (error) {
        setError(`Hubo un problema al obtener los niveles: ${error.message}`);
        setLoading(false);
      }
    };

    fetchNiveles();
  }, [idCategoria]);

  const handleNivelClick = (nivelId) => {
    router.push(`/unidad/${categoria}/${nivelId}/ejercicios`);
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
            Elige un nivel para la categoría: {categoria}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
            {niveles.length === 0 ? (
              <p className="text-center text-lg">No se encontraron niveles para esta categoría.</p>
            ) : (
              niveles.map((nivel) => (
                <div key={nivel.idNivel} className="flex justify-center">
                  <button
                    onClick={() => handleNivelClick(nivel.idNivel)}
                    className="w-full p-6 bg-indigo-600 text-white rounded-lg text-xl font-semibold shadow-lg transform transition duration-300 ease-in-out hover:bg-indigo-700 hover:scale-105 flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center">
                      <span className="mt-2">Nivel {nivel.nivel}</span>
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Botón para regresar */}
          {(niveles.length > 0 || error) && (
            <button
              onClick={() => router.push("/unidad/categorias")}
              className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg text-xl font-semibold hover:bg-green-700 transition duration-300 ease-in-out"
            >
              Volver a Categorías
            </button>
          )}
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

export default Niveles;
