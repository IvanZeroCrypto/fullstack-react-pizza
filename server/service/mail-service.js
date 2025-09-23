import nodemailer from "nodemailer";
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: "",
        pass: "",
      },
    });
  }
  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: ",
        to,
        subject: "Активация аккаунта на " + process.env.API_URL,
        text: "",
        html: `
              <div>
              <h1>Для активации перейдите по ссылке</h1>
              <a href = "${link}">${link}</a>
              </div>
              `,
      });
    } catch (error) {
      return error;
    }
  }
}

export default new MailService();
