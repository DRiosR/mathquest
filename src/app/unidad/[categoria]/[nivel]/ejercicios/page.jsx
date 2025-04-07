"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";

const Ejercicios = () => {
  const { categoria, nivel } = useParams();
  const router = useRouter();
  const { session } = useAuth();

  const [ejercicios, setEjercicios] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [error, setError] = useState(null);
  const [finalizado, setFinalizado] = useState(false);

  const [idCategoria, setIdCategoria] = useState(null);

  // Obtener idCategoria basado en la categoría
  useEffect(() => {
    const fetchIdCategoria = async () => {
      const { data, error } = await supabase
        .from("categoria")
        .select("idCategoria")
        .eq("nombre", categoria)
        .single();

      if (error) {
        setError("Nivel o categoría inválida.");
        return;
      }

      setIdCategoria(data.idCategoria);
    };

    fetchIdCategoria();
  }, [categoria]);

  // Obtener ejercicios para la categoría y nivel específicos
  useEffect(() => {
    const fetchEjercicios = async () => {
      if (!idCategoria || !nivel) return;

      try {
        console.log("Buscando ejercicios para idCategoria:", idCategoria, "y nivel:", nivel);

        const { data, error } = await supabase
          .from("ejercicio")
          .select("*")
          .eq("idNivel", parseInt(nivel))  // Asegúrate de que el nivel sea un número
          .eq("idCategoria", idCategoria); // Se filtra por idCategoria

        console.log("Datos obtenidos de la base de datos:", data); // Verificamos qué datos recibimos

        if (error) {
          console.error("Error en la consulta:", error);
          setError("Error al obtener los ejercicios.");
          return;
        }

        if (data.length === 0) {
          setError("No se encontraron ejercicios para este nivel y categoría.");
          return;
        }

        // Mostrar ejercicios de manera aleatoria (3 ejercicios)
        const ejerciciosAleatorios = getRandomExercises(data, 3);
        setEjercicios(ejerciciosAleatorios);
      } catch (err) {
        console.error("Error al obtener ejercicios:", err);
        setError("Error al obtener los ejercicios.");
      }
    };

    fetchEjercicios();
  }, [idCategoria, nivel]);

  const getRandomExercises = (data, cantidad) => {
    return [...data].sort(() => 0.5 - Math.random()).slice(0, cantidad);
  };

  const handleRespuesta = (opcionSeleccionada) => {
    const ejercicio = ejercicios[currentExerciseIndex];
    const esCorrecta = opcionSeleccionada === ejercicio.respuestaCorrecta;

    setIntentos((prev) => prev + 1);
    setAciertos((prev) => (esCorrecta ? prev + 1 : prev));
    setRespuestas((prev) => [...prev, esCorrecta]);

    if (currentExerciseIndex < ejercicios.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      setFinalizado(true);
    }
  };

  useEffect(() => {
    const guardarResultados = async () => {
      if (!session?.user?.id || !finalizado || !idCategoria) return;

      try {
        // 1. Obtener ejercicios del nivel y categoría actual
        const { data: ejerciciosCategoria, error: errorEjCat } = await supabase
          .from("ejercicio")
          .select("idEjercicio")
          .eq("idNivel", parseInt(nivel))
          .eq("idCategoria", idCategoria);

        if (errorEjCat) throw errorEjCat;

        const idsEjerciciosCategoria = ejerciciosCategoria.map((e) => e.idEjercicio);

        // 2. Obtener respuestas previas del usuario para esos ejercicios
        const { data: respuestasPrevias, error: errorResp } = await supabase
          .from("respuesta")
          .select("esCorrecta, idEjercicio")
          .eq("idUsuario", session.user.id)
          .eq("idNivel", parseInt(nivel))
          .eq("idCategoria", idCategoria);

        if (errorResp) throw errorResp;

        const respuestasFiltradas = respuestasPrevias.filter((r) =>
          idsEjerciciosCategoria.includes(r.idEjercicio)
        );

        const aciertosAnteriores = respuestasFiltradas.filter((r) => r.esCorrecta).length;

        // 3. Si el nuevo puntaje es mejor, reemplazar respuestas
        if (aciertos > aciertosAnteriores) {
          await supabase
            .from("respuesta")
            .delete()
            .eq("idUsuario", session.user.id)
            .eq("idNivel", parseInt(nivel))
            .eq("idCategoria", idCategoria)
            .in("idEjercicio", idsEjerciciosCategoria);

          const nuevasRespuestas = ejercicios.map((ej, index) => ({
            idUsuario: session.user.id,
            idEjercicio: ej.idEjercicio,
            idNivel: parseInt(nivel),
            idCategoria,
            esCorrecta: respuestas[index],
          }));

          const { error: errorInsert } = await supabase
            .from("respuesta")
            .insert(nuevasRespuestas);

          if (errorInsert) throw errorInsert;

          console.log("✅ Respuestas actualizadas con mejor rendimiento");
        } else {
          console.log("🔁 No se actualizó porque el resultado no fue mejor");
        }
      } catch (err) {
        console.error("❌ Error al guardar respuestas:", err.message);
      }
    };

    guardarResultados();
  }, [finalizado]);

  const handleRegresar = () => {
    router.push(`/unidad/${categoria}/nivel`);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white p-6">
      {error ? (
        <div className="text-red-500 text-xl">{error}</div>
      ) : !finalizado ? (
        ejercicios.length > 0 && (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-8">
              Ejercicio {currentExerciseIndex + 1} de {ejercicios.length}
            </h1>
            <p className="text-2xl mb-6">{ejercicios[currentExerciseIndex].pregunta}</p>
            <div className="flex flex-col items-center">
              {ejercicios[currentExerciseIndex].opciones
                .split(",")
                .map((opcion, index) => (
                  <button
                    key={index}
                    onClick={() => handleRespuesta(opcion.trim())}
                    className="w-full p-4 bg-indigo-600 text-white rounded-lg mb-4 text-xl font-semibold shadow-lg transform transition duration-300 ease-in-out hover:bg-indigo-700 hover:scale-105"
                  >
                    {opcion.trim()}
                  </button>
                ))}
            </div>
          </div>
        )
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-8">Resultados</h1>
          <p className="text-2xl mb-6">
            Aciertos: {aciertos} / {intentos}
          </p>
          <div className="text-left">
            {ejercicios.map((ejercicio, index) => (
              <div key={ejercicio.idEjercicio} className="mb-4">
                <p>{ejercicio.pregunta}</p>
                <p
                  className={`${
                    respuestas[index] ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {respuestas[index] ? "Respuesta correcta" : "Respuesta incorrecta"}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={handleRegresar}
            className="w-full p-4 bg-gray-700 text-white rounded-lg mt-6 text-xl font-semibold shadow-lg transform transition duration-300 ease-in-out hover:bg-gray-800"
          >
            Volver a la selección de niveles
          </button>
        </div>
      )}
    </div>
  );
};

export default Ejercicios;
