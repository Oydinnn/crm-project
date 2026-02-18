// import { MailerService } from "@nestjs-modules/mailer";
// import { Injectable } from "@nestjs/common";

// @Injectable()
// export class EmailService{
//   constructor(private readonly mailerService: MailerService){}
//   async sendEmail(email: string, login:string, password:string){
//     await this.mailerService.sendMail({
//       to:email,
//       from:process.env.EMAIL,
//       subject:"CRM tizimidan foydalanish uchun login/password",
//       template:"index",
//       context:{
//         text:`login : ${login}\npassword : ${password}`
//       }
//     })
//   }
// }

import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(email: string, login: string, password: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `"CRM Tizimi" <${process.env.EMAIL}>`,
        subject: "CRM tizimidan foydalanish uchun login va parol",
        template: "index", // src/templates/index.hbs fayli bo'lishi kerak
        context: {
          login: login,
          password: password,
          // text: `Login: ${login}\nParol: ${password}`
        },
      });
    } catch (error) {
      console.error("Email yuborishda xato:", error);
      
    }
  }
}