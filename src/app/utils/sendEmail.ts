import httpStatus from "http-status-codes";
import nodemailer from "nodemailer";
import envVars from "../configs/env";
import path from "path";
import ejs from "ejs";
import AppError from "./AppError";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
  port: Number(envVars.SMTP_PORT),
  host: envVars.SMTP_HOST,
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const template = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(template, templateData);

    await transporter.sendMail({
      from: `"Tour Management" <${envVars.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
  } catch (error: any) {
    throw new AppError(
      `Error sending email - ${error.message}`,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export default sendEmail;
