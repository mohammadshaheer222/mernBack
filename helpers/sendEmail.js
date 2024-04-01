const nodemailer = require("nodemailer");

const sendEmail = (email, accessToken) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: process.env.GMAIL,
      to: email,
      subject: "Reset Password ",
      text: "Reset your password",
      html: `http://localhost:5173/resetPassword/${accessToken}`,
    });
    return info.messageId;
  }

  const message = main().catch(console.error);
  return message;
};

module.exports = { sendEmail };
