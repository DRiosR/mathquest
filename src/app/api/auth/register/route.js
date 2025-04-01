import { supabase } from "../../../../lib/superbase";
import prisma from "../../../../lib/prisma";

// Método POST
export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, correo, password } = body;

    // Validar que los datos no sean nulos o indefinidos
    if (!correo || !nombre || !password) {
      return new Response(JSON.stringify({ message: "Faltan datos necesarios." }), {
        status: 400,
      });
    }

    // Verificar si el correo ya está registrado en Prisma (tabla Usuario)
    const existingUser = await prisma.usuario.findUnique({
      where: { correo: correo },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "El correo ya está registrado." }), {
        status: 400,
      });
    }

    // Verificar si el nombre de usuario ya está en la base de datos
    const existingUsername = await prisma.usuario.findUnique({
      where: { usuario: nombre },
    });

    if (existingUsername) {
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
      return new Response(JSON.stringify({ message: error.message }), { status: 400 });
    }

    // Crear el usuario en Prisma (en la tabla `Usuario`)
    await prisma.usuario.create({
      data: {
        usuario: nombre,
        correo: correo,
        password: password, // Considera encriptar la contraseña antes de guardarla
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
