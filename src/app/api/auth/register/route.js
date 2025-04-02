import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma"; // Importación corregida

// Método para registrar un nuevo usuario
export async function POST(req) {
  const { nombre, correo, password } = await req.json();

  // Verificar si el correo ya está registrado en la base de datos
  const existingUser = await prisma.usuario.findUnique({
    where: { correo: correo },
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ message: "Este correo ya está registrado." }),
      { status: 400 }
    );
  }

  // Verificar si el nombre de usuario ya está registrado en la base de datos
  const existingUsername = await prisma.usuario.findFirst({
    where: { usuario: nombre },
  });

  if (existingUsername) {
    return new Response(
      JSON.stringify({ message: "Este nombre de usuario ya está en uso." }),
      { status: 400 }
    );
  }

  // Registrar el usuario en Supabase
  const { data: userData, error: supabaseError } = await supabase.auth.signUp({
    email: correo,
    password: password,
  });

  if (supabaseError) {
    return new Response(
      JSON.stringify({ message: "Error al registrar el usuario en Supabase." }),
      { status: 500 }
    );
  }

  // Crear el usuario en Prisma
  const newUser = await prisma.usuario.create({
  data: {
    usuario: nombre,       // Nombre de usuario
    correo: correo,        // Correo electrónico
    password: password,    // Contraseña
  },
});

  return new Response(
    JSON.stringify({ message: "Usuario registrado con éxito." }),
    { status: 200 }
  );
}
