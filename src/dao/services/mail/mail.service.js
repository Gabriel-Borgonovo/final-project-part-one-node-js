import datosConection from '../../../../data.js';
import nodemailer from 'nodemailer';

class EmailService {
    #transporter
    constructor() {
        this.#transporter = nodemailer.createTransport(datosConection.MAIL);
    }

    async sendEmail({to, subject, html, attachments = []}) {
        await this.#transporter.sendMail({
            from: `"CoderIntegrador", <${datosConection.MAIL.auth.user}>`,
            to,
            subject,
            html,
        });
    }
}

const instance = new EmailService();

Object.freeze(instance);

export default instance;