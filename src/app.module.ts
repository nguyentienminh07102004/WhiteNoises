import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostgreSQLModule } from "./configurations/PostgreSQL.module";
import { MinIOModule } from "./modules/MinIO/MinIO.module";
import { WhiteNoiseModule } from "./modules/whitenoise/WhiteNoise.module";

@Module({
  imports: [
    PostgreSQLModule,
    MinIOModule,
    WhiteNoiseModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ]
})
export class AppModule {}
