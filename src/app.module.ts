import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostgreSQLModule } from "./common/configurations/PostgreSQL.module";
import { RedisConfigurationModule } from "./common/configurations/RedisConfiguration.module";
import { MinIOModule } from "./modules/MinIO/MinIO.module";
import { WhiteNoiseModule } from "./modules/whitenoise/WhiteNoise.module";
import { TagModule } from "./modules/tags/tag.module";
import { UserModule } from "./modules/users/user.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./common/guard/AuthGuard.guard";
import { JwtConfigurationModule } from "./common/configurations/JwtConfiguration.module";
import { WebsocketModule } from "./common/configurations/WebsocketModule.module";
import { MongooseMongoDBModule } from "./common/configurations/Mongoose.module";
import { chatModule } from "./modules/chat/chat.module";

@Module({
  imports: [
    PostgreSQLModule,
    MinIOModule,
    JwtConfigurationModule,
    WhiteNoiseModule,
    TagModule,
    UserModule,
    MongooseMongoDBModule,
    chatModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RedisConfigurationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    WebsocketModule
  ]
})
export class AppModule {}
