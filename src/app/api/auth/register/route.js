import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { nombre, correo, password } = await req.json();

    // Verificar si el usuario ya existe
    const userExists = await prisma.usuario.findUnique({
      where: {
        OR: [{ usuario: nombre }, { correo: correo }],
      },
    });

    if (userExists) {
      return NextResponse.json(
        { message: "El nombre de usuario o correo ya está en uso." },
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

    console.log("Usuario creado en Prisma:", createdUser);

    // Registrar el usuario en Supabase
    const signUpResponse = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (signUpResponse.error) {
      console.log("Error al registrar en Supabase:", signUpResponse.error.message);
      return NextResponse.json(
        { message: signUpResponse.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error en el servidor:", error); // Agregar un log detallado del error
    return NextResponse.json({ message: "Error en el servidor", error: error.message }, { status: 500 });
  }
}
