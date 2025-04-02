import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { nombre, correo, password } = await req.json();

    // Verificar si el correo electrónico ya está registrado (sin exponer el error específico)
    const existingUserByEmail = await prisma.usuario.findUnique({
      where: { correo },
    });
    if (existingUserByEmail) {
      // Si ya existe un correo, no especificamos si es el correo o nombre de usuario
      return NextResponse.json(
        { message: "Ya existe una cuenta con ese correo o nombre de usuario." },
        { status: 400 }
      );
    }

    // Verificar si el nombre de usuario ya está registrado (sin exponer el error específico)
    const existingUserByUsername = await prisma.usuario.findUnique({
      where: { usuario: nombre },
    });
    if (existingUserByUsername) {
      // Si ya existe un nombre de usuario, no especificamos si es el correo o nombre de usuario
      return NextResponse.json(
        { message: "Ya existe una cuenta con ese correo o nombre de usuario." },
        { status: 400 }
      );
    }

    // Crear el usuario en la base de datos con Prisma
    const createdUser = await prisma.usuario.create({
      data: {
        usuario: nombre,
        correo: correo,
        password: password, // Asegúrate de hashear la contraseña antes de guardarla
      },
    });

    // Registrar el usuario en Supabase
    const signUpResponse = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (signUpResponse.error) {
      return NextResponse.json(
        { message: signUpResponse.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ message: "Error en el servidor", error: error.message, stack: error.stack }, { status: 500 });
  }
}
