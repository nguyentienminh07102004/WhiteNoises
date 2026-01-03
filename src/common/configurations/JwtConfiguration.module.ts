import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("SECRET_KEY"),
        signOptions: {
          expiresIn: "86400s",
          algorithm: "HS512",
          issuer: "WhiteNoise"
        }
      })
    })
  ]
})
export class JwtConfigurationModule {}

