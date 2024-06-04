const Pulsar = require("pulsar-client");
const nodemailer = require("nodemailer");
const { decrypt } = require("./encryption");

require("dotenv").config();

const notifyEmail = async (email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password,
        port: 465,
        secure: true,
      },
    });

    console.log(email, message);

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "OneTap",
      html: `<p>${message}</p>     `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

console.log("Notification service started listening");

(async () => {
  // Create a client
  const client = new Pulsar.Client({
    serviceUrl: process.env.pulsarUrl,
  });

  // Create a consumer
  const consumer = await client.subscribe({
    topic: "pay",
    subscription: "my-subscription",
    subscriptionType: "Exclusive",
  });

  // Receive messages
  while (true) {
    const msg = await consumer.receive();
    const { email, message } = JSON.parse(decrypt(JSON.parse(msg.getData())));
    console.log("here", typeof data);
    await notifyEmail(email, message);
    consumer.acknowledge(msg);
  }

  await consumer.close();
  await client.close();
})();
