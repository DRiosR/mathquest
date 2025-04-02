import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { nombre, correo, password } = await req.json();

    // Verificar si el correo electrónico ya está registrado
    const existingUserByEmail = await prisma.usuario.findUnique({
      where: { correo },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado." },
        { status: 400 }  // Código de estado 400 para error de solicitud
      );
    }

    // Verificar si el nombre de usuario ya está registrado
    const existingUserByUsername = await prisma.usuario.findUnique({
      where: { usuario: nombre },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "El nombre de usuario ya está en uso." },
        { status: 400 }  // Código de estado 400 para error de solicitud
      );
    }

    // Crear usuario en la base de datos con Prisma
    await prisma.usuario.create({
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
        { status: 400 } // Error de supabase
      );
    }

    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error en el servidor", error: error.message }, { status: 500 });
  }
}
