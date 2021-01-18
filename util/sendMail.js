import nodemailer from "nodemailer";
import { email } from "../config.js";

/**
 * @typedef Message
 * @property {string} subject Тема
 * @property {string} text Письмо (текст)
 * @property {string} html Письмо (html)
 */

const transporter = nodemailer.createTransport(email);

/**
 * sendMail
 * @param {string} to E-mail
 * @param {Message} message Message
 */
export default async function (to, message) {
  return await transporter.sendMail({
    from: `NodeJS app <${email.auth.user}>`,
    to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}
