import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, // tu correo
      pass: process.env.MAIL_PASS, // contraseña de aplicación
    },
  });

  async enviarCodigo(email: string, codigo: string) {
    await this.transporter.sendMail({
      from: `"Soporte App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Código de recuperación',
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Tu código es:</p>
        <h1>${codigo}</h1>
        <p>Este código expira en 15 minutos.</p>
      `,
    });
  }
}