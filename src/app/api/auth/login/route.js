// src/app/api/auth/login/route.js
import { prisma } from "@/lib/prisma"; // Conexión a la base de datos
import bcrypt from "bcrypt"; // Para comparar la contraseña encriptada

export async function POST(req) {
  const { correo, contraseña } = await req.json(); // Obtienes los datos del body de la solicitud

  // Verificar si el correo existe
  const usuario = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (!usuario) {
    return new Response(JSON.stringify({ error: "Correo o contraseña incorrectos" }), { status: 400 });
  }

  // Comparar la contraseña encriptada con la proporcionada
  const contrasenaValida = await bcrypt.compare(contraseña, usuario.contraseña);
  
  if (!contrasenaValida) {
    return new Response(JSON.stringify({ error: "Correo o contraseña incorrectos" }), { status: 400 });
  }

  // Si la contraseña es correcta, puedes devolver un objeto con los datos del usuario
  return new Response(JSON.stringify({ message: "Login exitoso", usuario }), { status: 200 });
}
