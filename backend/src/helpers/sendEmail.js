import nodeMailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async (
  subject,
  send_to,
  send_from, // Default sender email from .env
  reply_to , // Default reply-to email from .env
  template,
  name,
  link
) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === "true", // Use TLS
    auth: {
      user: process.env.EMAIL_USER, // Auth user from .env
      pass: process.env.EMAIL_PASS, // Auth password from .env
    },
    tls: {
      rejectUnauthorized: false, // Allows self-signed certificates if needed
    },
  });

  const handlebarsOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve(__dirname, "../views"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "../views"),
    extName: ".handlebars",
  };

  // Attach Handlebars plugin to the transporter
  transporter.use("compile", hbs(handlebarsOptions));

  const mailOptions = {
    from: send_from, // Sender email
    to: send_to, // Recipient email
    replyTo: reply_to, // Reply-to email
    subject: subject, // Email subject
    template: template, // Handlebars template file name (without extension)
    context: {
      name: name, // Context data for the template
      link: link, // Additional context for the template
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId); // Log the message ID
    return info; // Return info for additional handling
  } catch (error) {
    console.error("Error sending email: ", error); // Log detailed error
    throw error; // Re-throw the error for higher-level handling
  }
};

export default sendEmail;
