// app/page.jsx
"use client"; // Asegura que este componente se ejecute en el cliente

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext"; // Importa el contexto de autenticación

export default function HomePage() {
  const { session } = useAuth(); // Obtén la sesión desde el contexto
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Si está logueado, redirige al home
      router.push("/home");
    } else {
      // Si no está logueado, redirige al login
      router.push("/login");
    }
  }, [session, router]);

  return <p>Cargando...</p>; // Mensaje mientras se determina el estado de la sesión
}
