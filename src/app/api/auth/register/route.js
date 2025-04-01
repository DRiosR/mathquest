import { supabase } from "../../../../lib/superbase";
import prisma from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, correo, password } = body;

    if (!correo || !nombre || !password) {
      return new Response(JSON.stringify({ message: "Faltan datos necesarios." }), {
        status: 400,
      });
    }

    // Verificación si el correo ya está registrado en Prisma
    const existingUser = await prisma.usuario.findUnique({
      where: { correo: correo },
    });
    if (existingUser) {
      console.error(`El correo ${correo} ya está registrado.`);
      return new Response(JSON.stringify({ message: "El correo ya está registrado." }), {
        status: 400,
      });
    }

    // Verificación si el nombre de usuario ya está en la base de datos
    const existingUsername = await prisma.usuario.findUnique({
      where: { usuario: nombre },
    });
    if (existingUsername) {
      console.error(`El nombre de usuario ${nombre} ya está en uso.`);
      return new Response(JSON.stringify({ message: "El nombre de usuario ya está en uso." }), {
        status: 400,
      });
    }

    // Crear un nuevo usuario en Supabase para autenticación
    const { data, error } = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (error) {
      console.error("Error de Supabase: ", error.message);
      return new Response(JSON.stringify({ message: error.message }), { status: 400 });
    }

    // Crear el usuario en Prisma
    await prisma.usuario.create({
      data: {
        usuario: nombre,
        correo: correo,
        password: password, // Asegúrate de encriptar la contraseña antes de guardarla
        verificacion: false, // La verificación es falsa al principio
      },
    });

    return new Response(
      JSON.stringify({ message: "Registro exitoso. Revisa tu correo para verificar tu cuenta." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    return new Response(JSON.stringify({ message: "Error en el servidor." }), {
      status: 500,
    });
  }
}