// /src/app/api/auth/register/route.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  const { nombre, correo, contraseña } = await req.json();

  // Verificación básica de datos
  if (!nombre || !correo || !contraseña) {
    return new Response(
      JSON.stringify({ message: "Por favor, completa todos los campos." }),
      { status: 400 }
    );
  }

  // Validación de correo electrónico
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!isValidEmail.test(correo)) {
    return new Response(
      JSON.stringify({ message: "Correo electrónico inválido." }),
      { status: 400 }
    );
  }

  try {
    // Cifra la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Verifica si el correo ya existe en la base de datos
    const existingUser = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "El correo electrónico ya está registrado." }),
        { status: 400 }
      );
    }

    // Crear el nuevo usuario
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contraseña: hashedPassword,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Usuario registrado exitosamente",
        user: newUser,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return new Response(
      JSON.stringify({ message: "Hubo un problema al registrar al usuario." }),
      { status: 500 }
    );
  }
}
