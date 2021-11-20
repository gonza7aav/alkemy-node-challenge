const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Envia el correo de bienvenida al nuevo usuario
const sendWelcomeEmail = async (address) => {
  // Cuando no estoy en producción puedo registrar con cualquier email que
  // llegarán a un mail accesible por el desarrollador / tester (con la
  // información de a que email se debería haber enviado)
  const info =
    process.env.NODE_ENV === 'production' ? '' : `<hr> email: ${address}`;

  const email = {
    to:
      process.env.NODE_ENV === 'production'
        ? address
        : process.env.NON_PRODUCTION_EMAIL_RECEIVER,
    from: process.env.SENDGRID_SENDER,
    subject: 'Bienvenido a la API Disney!',
    // Lo que aparecerá si ve el email en formato plano
    text: 'Para más información sobre su funcionamiento le recomendamos visitar la página del repositorio.',
    // Lo que aparecerá si ve el email en formato HTML
    html: `Para más información sobre su funcionamiento le recomendamos visitar la <a href="https://github.com/gonza7aav/alkemy-node-challenge">página del repositorio</a>. ${info}`,
  };

  try {
    await sendgrid.send(email);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendWelcomeEmail,
};
