import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { nombre, correo, password } = await req.json();

    if (!correo || !nombre || !password) {
      return NextResponse.json({ message: "Faltan datos." }, { status: 400 });
    }

    // **Verificar en Prisma si el correo ya está registrado**
    const existingUserPrisma = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (existingUserPrisma) {
      return NextResponse.json(
        { message: "El correo ya está registrado en el sistema." },
        { status: 400 }
      );
    }

    // **Verificar en Supabase si el correo ya está registrado**
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: correo,
      password: "fakepassword123", // Contraseña falsa para probar
    });

    if (!loginError) {
      return NextResponse.json(
        { message: "El correo ya está registrado en Supabase." },
        { status: 400 }
      );
    }

    // **Verificar si el nombre de usuario ya está en la base de datos**
    const existingUsername = await prisma.usuario.findUnique({
      where: { usuario: nombre },
    });

    if (existingUsername) {
      return NextResponse.json(
        { message: "El nombre de usuario ya está en uso." },
        { status: 400 }
      );
    }

    // **Verificar la longitud de la contraseña**
    if (password.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    // **Crear usuario en Supabase**
    const { error: signupError } = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (signupError) {
      console.error("❌ Error en Supabase SignUp:", signupError);
      return NextResponse.json(
        { message: "Error al registrar usuario en Supabase." },
        { status: 400 }
      );
    }

    // **Encriptar la contraseña**
    const hashedPassword = await bcrypt.hash(password, 10);

    // **Registrar en Prisma**
    await prisma.usuario.create({
      data: {
        usuario: nombre,
        correo: correo,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Usuario registrado con éxito. Revisa tu correo para verificar tu cuenta." },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error inesperado en el registro:", error);
    return NextResponse.json(
      { message: "Hubo un error en el servidor, intenta nuevamente." },
      { status: 500 }
    );
  }
}
