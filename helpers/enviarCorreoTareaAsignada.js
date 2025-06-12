const transporter = require("./email").transporter;

const enviarCorreoTarea = async (
  tipo,
  destinatario,
  nombre,
  tituloTarea,
  fechaEntrega
) => {
  let subject = "";
  let html = "";

  switch (tipo) {
    case "asignada":
      subject = `📋 Nueva tarea asignada: "${tituloTarea}"`;
      html = `
        <h2>Hola ${nombre},</h2>
        <p>Se te ha asignado una nueva tarea en el sistema Red Social Empresarial.</p>
        <p><strong>Título:</strong> ${tituloTarea}</p>
        <p><strong>Fecha de entrega:</strong> ${new Date(
          fechaEntrega
        ).toLocaleDateString()}</p>
        <br/>
        <p>Por favor revisa tu panel de tareas para más detalles.</p>
      `;
      break;

    case "editada":
      subject = `✏️ Tarea actualizada: "${tituloTarea}"`;
      html = `
        <h2>Hola ${nombre},</h2>
        <p>Una de tus tareas ha sido actualizada por un administrador o gerente.</p>
        <p><strong>Título:</strong> ${tituloTarea}</p>
        <p><strong>Nueva fecha de entrega:</strong> ${new Date(
          fechaEntrega
        ).toLocaleDateString()}</p>
        <br/>
        <p>Revisa los cambios en tu panel de tareas.</p>
      `;
      break;

    case "completada":
      subject = `✅ Tarea marcada como completada: "${tituloTarea}"`;
      html = `
        <h2>Hola ${nombre},</h2>
        <p>La tarea que se te asignó ha sido marcada como completada.</p>
        <p><strong>Título:</strong> ${tituloTarea}</p>
        <p><strong>Fecha de entrega:</strong> ${new Date(
          fechaEntrega
        ).toLocaleDateString()}</p>
        <br/>
        <p>Gracias por tu trabajo.</p>
      `;
      break;

    default:
      console.warn("❗ Tipo de correo no válido:", tipo);
      throw new Error("Tipo de correo no válido.");
  }

  try {
    console.log(
      `📨 Enviando correo [${tipo}] a ${destinatario} (${nombre})...`
    );

    const info = await transporter.sendMail({
      from: `"RedSocialEmpresa" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject,
      html:
        html +
        `
        <hr/>
        <p style="font-size: 0.9em; color: #888;">
        📬 Este correo fue generado automáticamente. No respondas a este mensaje.</p>
      `,
    });

    console.log("✅ Correo enviado correctamente:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error al enviar correo de tarea:", error);
    throw error;
  }
};

module.exports = { enviarCorreoTarea };
