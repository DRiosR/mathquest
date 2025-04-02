"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext"; // Importa el contexto de autenticación

export default function HomePage() {
  const router = useRouter();
  const { session } = useAuth(); // Obtén la sesión desde el contexto

  useEffect(() => {
    if (!session) {
      // Si no hay sesión, redirigir al login
      router.push("/login");
    } else {
      // Si hay sesión, redirigir a la cuenta del usuario
      router.push("/cuenta");
    }
  }, [session, router]);

  return <p>Redirigiendo...</p>;
}
