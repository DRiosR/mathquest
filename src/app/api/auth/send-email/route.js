import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { user } = await supabase.auth.api.getUser(req.headers.token);

    if (!user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { email } = user;

    // Verificar si el correo está confirmado
    if (user.email_confirmed_at) {
      // Actualizar el estado del usuario en Prisma
      await prisma.user.update({
        where: { email: email },
        data: { isVerified: true },
      });

      return res.status(200).json({ message: "Correo verificado." });
    }

    return res.status(400).json({ message: "Correo no confirmado." });
  }

  res.status(405).json({ message: "Método no permitido" });
}
