import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MinioModule } from "nestjs-minio-client";
import { MinIOService } from "./MinIO.service";

@Module({
  imports: [
    MinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get<string>("MINIO_HOST") as string,
        port: parseInt(configService.get<string>("MINIO_PORT") || "9000"),
        useSSL: false,
        accessKey: configService.get<string>("MINIO_ROOT_USERNAME") as string,
        secretKey: configService.get<string>("MINIO_ROOT_PASSWORD") as string
      })
    })
  ],
  providers: [MinIOService],
  exports: [MinIOService]
})
export class MinIOModule {}
