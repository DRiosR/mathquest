import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { nombre, correo, password } = await req.json();

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

    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}
