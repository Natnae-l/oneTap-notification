const Pulsar = require("pulsar-client");
const nodemailer = require("nodemailer");
const { decrypt } = require("./encryption");

require("dotenv").config();

(async () => {
  // Create a client
  const client = new Pulsar.Client({
    serviceUrl: "pulsar://localhost:6650",
  });

  // Create a consumer
  const consumer = await client.subscribe({
    topic: "pay",
    subscription: "my-subscription",
    subscriptionType: "Exclusive",
  });

  // Receive messages
  for (let i = 0; i < 10; i += 1) {
    const msg = await consumer.receive();
    console.log(msg.getData().toString());
    console.log(decrypt(JSON.parse(msg.getData())));
    consumer.acknowledge(msg);
  }

  await consumer.close();
  await client.close();
})();

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

    console.log({ user: process.env.email, pass: process.env.password });

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
