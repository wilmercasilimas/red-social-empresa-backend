// helpers/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarCorreoRegistro = async (destinatario, nombre, passwordPlano) => {
  try {
    const info = await transporter.sendMail({
      from: `"RedSocialEmpresa" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: "🛡️ Bienvenido - Acceso al sistema RedSocialEmpresa",
      html: `
        <h2>Hola ${nombre},</h2>
        <p>Has sido registrado en el sistema interno de Red Social Empresarial.</p>
        <p><strong>Tu contraseña temporal es:</strong></p>
        <p style="font-size:18px;color:blue"><b>${passwordPlano}</b></p>
        <p>Por seguridad, deberás cambiarla en cuanto inicies sesión.</p>
        <br/>
        <p>📬 Este correo fue generado automáticamente. No respondas a este mensaje.</p>
      `,
    });

    return info;
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    throw error;
  }
};

module.exports = {
  enviarCorreoRegistro,
};
