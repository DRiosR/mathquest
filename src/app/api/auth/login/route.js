import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma"; // Importación correcta

// Método para iniciar sesión
export async function POST(req) {
  const { correo, password } = await req.json();

  // Intentar iniciar sesión con Supabase
  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: correo,
    password: password,
  });

  // Verificar si hubo un error en las credenciales
  if (loginError || !data) {
    return new Response(
      JSON.stringify({ message: "Usuario o contraseña inválidos." }), // Mensaje para credenciales incorrectas
      { status: 400 }
    );
  }

  // Verificar si el correo existe en la base de datos de Prisma
  const user = await prisma.usuario.findUnique({
    where: { correo: correo },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ message: "Usuario no encontrado en la base de datos." }), // Usuario no encontrado en la base de datos
      { status: 400 }
    );
  }

  // Verificar si el correo ha sido verificado en Supabase (con los datos de la sesión)
  if (!data.user.email_confirmed_at) {
    return new Response(
      JSON.stringify({ message: "El correo no está verificado." }), // Correo no verificado en Supabase
      { status: 400 }
    );
  }

  // Si todo está bien, permitir el inicio de sesión
  return new Response(
    JSON.stringify({
      message: "Inicio de sesión exitoso.",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      access_token: data.access_token, // Enviar el token de acceso
    }),
    { status: 200 }
  );
}
