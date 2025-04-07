import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export async function enviarCorreoBienvenida(destinatario, nombre) {
  const email = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email: destinatario }],
    sender: { email: "daniel.ext1@gmail.com", name: "MTK Corp" },
    templateId: 1, // Usa el ID real de tu plantilla de Brevo
    params: {
      NAME: nombre,
    },
  });

  try {
    await apiInstance.sendTransacEmail(email);
    console.log("✅ Correo con plantilla enviado con éxito.");
  } catch (error) {
    console.error("❌ Error al enviar correo con plantilla:", error);
  }
}
