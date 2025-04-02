import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { nombre, correo, password } = await req.json();

    // Verificar si los datos son correctos
    if (!nombre || !correo || !password) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos." },
        { status: 400 }
      );
    }

    // Verificar si el correo electrónico ya está registrado
    const existingUserByEmail = await prisma.usuario.findUnique({
      where: { correo },
    });
    if (existingUserByEmail) {
      console.log("Error: El correo ya está registrado");
      return NextResponse.json(
        { message: "Ya existe una cuenta con ese correo o nombre de usuario." },
        { status: 400 }
      );
    }

    // Verificar si el nombre de usuario ya está registrado
    const existingUserByUsername = await prisma.usuario.findUnique({
      where: { usuario: nombre },
    });
    if (existingUserByUsername) {
      console.log("Error: El nombre de usuario ya está en uso");
      return NextResponse.json(
        { message: "Ya existe una cuenta con ese correo o nombre de usuario." },
        { status: 400 }
      );
    }

    // Crear usuario en la base de datos con Prisma
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
      console.log("Error en Supabase:", signUpResponse.error.message);
      return NextResponse.json(
        { message: signUpResponse.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({
      message: "Error en el servidor",
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
