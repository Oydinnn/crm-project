import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { register } from "module";

@Module({
  imports: [
    JwtModule.register({
      secret:"shaftoli",
      signOptions: {
        expiresIn:"1d"
      },
      global: true
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})

export class AuthModule{}