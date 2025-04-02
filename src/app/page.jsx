"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext"; // Asegúrate de importar el AuthContext

export default function HomePage() {
  const router = useRouter();
  const { session } = useAuth(); // Usa el contexto de autenticación
  const [loading, setLoading] = useState(true); // Para evitar redirigir antes de tiempo

  useEffect(() => {
    if (session === undefined) return; // Esperar a que AuthContext cargue la sesión

    if (!session) {
      router.push("/registro/login"); // Si no hay sesión, ir a login
    } else {
      router.push("/home"); // Si hay sesión, ir a Home
    }
    setLoading(false);
  }, [session]);

  if (loading) return <p>Cargando...</p>; // Muestra algo mientras espera la sesión

  return null;
}
