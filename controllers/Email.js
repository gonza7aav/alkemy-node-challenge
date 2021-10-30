const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Envia el correo de bienvenida al nuevo usuario
const sendWelcomeEmail = async (address) => {
  const email = {
    to: address,
    from: process.env.SENDGRID_SENDER,
    subject: 'Bienvenido a la API Disney!',
    // Lo que aparecerá si ve el email en formato plano
    text: 'Para más información sobre su funcionamiento le recomendamos visitar la página del repositorio.',
    // Lo que aparecerá si ve el email en formato HTML
    html: 'Para más información sobre su funcionamiento le recomendamos visitar la <a href="https://github.com/gonza7aav/alkemy-node-challenge">página del repositorio</a>.',
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
