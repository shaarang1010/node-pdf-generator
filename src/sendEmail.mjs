import nodemailer from "nodemailer";
import "dotenv/config";
import path from "path";

const sendEmail = async (filename) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "instrumecsender@gmail.com",
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "noreply@instrumec-pod <instrumecsender@gmail.com>", // sender address
    to: "jamescoles@instrumec.com.au", // list of receivers
    subject: "Proof of Delivery", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
    attachments: [
      {
        filename: filename,
        path: path.join(process.cwd(), `/generated-pdfs/${filename}`),
      },
    ],
  });

  console.log("Message sent: %s", info.messageId);
};
