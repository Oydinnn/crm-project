import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/core/database/prisma.module";

@Module({
  imports: [
    PrismaModule,
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