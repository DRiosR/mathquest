import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { nombre, correo, password } = await req.json();

    // Verificar si el usuario o correo ya existen en la base de datos
    const userExists = await prisma.usuario.findUnique({
      where: {
        usuario: nombre,
      },
    });

    if (userExists) {
      return NextResponse.json(
        { message: "El nombre de usuario ya está registrado." },
        { status: 400 }
      );
    }

    const emailExists = await prisma.usuario.findUnique({
      where: {
        correo: correo,
      },
    });

    if (emailExists) {
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado." },
        { status: 400 }
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
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Usuario registrado con éxito" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}
