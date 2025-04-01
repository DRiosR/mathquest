"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Simula autenticación
    if (!token) {
      router.push("/registro/login"); // Redirige al login si no hay sesión
    }
  }, []);

  return <p>Redirigiendo...</p>;
}
