import { MailerModule } from "@nestjs-modules/mailer";
import { Global, Module } from "@nestjs/common";
import { join} from "path";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { EmailService } from "./email.service";
@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport:{
        service:"gmail",
        auth:{
          user:"oydin6661@gmail.com",
          pass:"qdiq xprf kfrw kbss"
        }
      },
      defaults:{
        from:'"n26nestjs" <oydin6661@gmail.com>'
      },
      template:{
        dir:join(process.cwd(),"src","templates"),
        adapter:new HandlebarsAdapter(),
        options:{
          strict:true
        }
      }
    })
  ],
  providers:[EmailService],
  exports:[EmailService]
})
export class EmailModule{}