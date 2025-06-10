const transporter = require("./email").transporter;

const enviarCorreoTareaAsignada = async (destinatario, nombre, tituloTarea, fechaEntrega) => {
  try {
    const info = await transporter.sendMail({
      from: `"RedSocialEmpresa" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: `📋 Nueva tarea asignada: "${tituloTarea}"`,
      html: `
        <h2>Hola ${nombre},</h2>
        <p>Se te ha asignado una nueva tarea en el sistema Red Social Empresarial.</p>
        <p><strong>Título:</strong> ${tituloTarea}</p>
        <p><strong>Fecha de entrega:</strong> ${new Date(fechaEntrega).toLocaleDateString()}</p>
        <br/>
        <p>Por favor revisa tu panel de tareas para más detalles.</p>
        <hr/>
        <p style="font-size: 0.9em; color: #888;">📬 Este correo fue generado automáticamente. No respondas a este mensaje.</p>
      `,
    });

    return info;
  } catch (error) {
    console.error("❌ Error al enviar correo de tarea:", error);
    throw error;
  }
};

module.exports = { enviarCorreoTareaAsignada };
